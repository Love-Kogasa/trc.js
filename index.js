var http = require( "http" )
var events = require( "events" )
var {parse} = require( "url" )

// Player 对象
class Player {
  constructor( player, group = "default", vrest ){
    this.player = player
    this.group = group
    this.vrest = vrest
  }
  toString(){
    return this.player
  }
  // Terraria API
  firework( color = "" ){
    return this.vrest.exec( "/firework " + this.player + " " + color )
  }
  give( item, count = 1, level = "" ){
    return this.vrest.exec( ["/give", item, this.player, count, level].join( " " ) )
  }
  buff( id, time = 30 ){
    return this.vrest.exec( ["/gbuff", this.player, id, time].join( " " ) )
  }
  tell( msg, to = this.player ){
    return this.vrest.exec( ["/w", to, msg].join( " " ) )
  }
  god(){
    return this.vrest.exec( ["/god", this.player].join( " " ) )
  }
  annoy(){
    return this.vrest.exec( ["/annoy", this.player].join( " " ) )
  }
  respawn(){
    return this.vrest.exec( ["/respawn", this.player].join( " " ) )
  }
  heal( count = 5 ){
    return this.vrest.exec( ["/heal", this.player, count].join( " " ) )
  }
  slap( count = 5 ){
    return this.vrest.exec( ["/slap", this.player, count].join( " " ) )
  }
  tpto( p ){
    return this.vrest.exec( ["/tp", this.player, p].join( " " ) )
  }
  // Simple Api
  async where(){
    return await this.read().position
  }
  read(){
    return this.vrest.readPlayer( this.player )
  }
  kill(){
    return this.vrest.killPlayer( this.player )
  }
  kick( why = "none" ){
    return this.vrest.kickPlayer( this.player )
  }
  mute( why = "none" ){
    return this.vrest.mutePlayer( this.player )
  }
  unmute( why = "none" ){
    return this.vrest.unmutePlayer( this.player )
  }
  ban( why = "none" ){
    return this.vrest.banPlayer( this.player )
  }
}

// 聊天事件，需要插件 ChattyBridge
class EventChatMsg extends Player {
  constructor( chatmsg, vrest ){
    super( JSON.parse(chatmsg.msg).name, vrest )
    this.msg = chatmsg
    this.message = JSON.parse(this.msg.msg)
    // 突然想到，懒得改代码了，所以就又加了一个变量
    this.sender = this.message.name
    this.vrest = vrest
  }
  toString(){
    return (this.message.text || "").replace( /\+/g, " " )
  }
  chatAsPlayer( msg ){
    var temp =  JSON.parse(this.msg.msg)
    temp.text = msg.toString()
    return this.vrest._r( "/chat", {
      msg: temp, verify: this.msg.verify || ""
    })
  }
  reply( msg, sender = "server", group = "owner", rgb = "////" ){
    var temp =  JSON.parse(this.msg.msg)
    temp.text = msg.toString()
    temp.name = sender.toString()
    temp.owner = group
    temp.rgb = rgb
    return this.vrest._r( "/chat", {
      msg: JSON.stringify(temp), verify: this.msg.verify || ""
    })
  }
}

// Tick 事件
class TickEvent {
  constructor( status, vrest ){
    this.server = status
    this.vrest = vrest
  }
}

// 虚拟 REST
class VRestServer extends events.EventEmitter {
  _parse( url ){
    try {
      var {query} = parse( url )
      var object = {}
      if( query == null ) return {}
      for( let option of query.split( "&" )){
        let [ key, value ] = option.split( "=" )
        object[key] = decodeURIComponent( value )
      }
      return object
    } catch( err ){
      console.error( err )
      return {}
    }
  }
  _code( data ){
    var url = []
    for( let key of Object.keys( data ) ){
      url.push( key + "=" + encodeURIComponent( data[key] ) )
    }
    return url.join( "&" )
  }
  async _r( p, dt = {} ){
    return await (await fetch( "http://" + this.setting.host + ":" + this.setting.port + p + "?" + this._code(dt) )).json()
  }
  constructor( port = 5000, host = "localhost", token = "" ){
    super()
    this.setting = {port, host, token}
    this.visitMap = new Map()
    var _s = this
    this.visitMap.set( "/chat", ( req, res ) => {
      var chatDt = _s._parse( req.url )
      var message = new EventChatMsg( chatDt, _s )
      _s.emit( "message", message )
      switch( message.message.type ){
        case "player_chat":
          _s.emit( "chat", message )
          break;
        case "player_join":
          _s.emit( "player_join", message )
          break;
        case "player_leave":
          _s.emit( "player_level", message )
          break;
      }
      res.setHeader( "Content-Type", "application/json" )
      res.statusCode = 200
      res.end( JSON.stringify( {
        status: 200, response: "successful."
      }))
    })
    this.server = http.createServer(( req, res ) => {
      var {pathname} = parse( req.url )
      if( this.visitMap.has( pathname ) ){
        this.visitMap.get( pathname )( req, res )
      } else {
        res.setHeader( "Content-Type", "application/json" )
        res.statusCode = 404
        res.end( JSON.stringify( {
          status: 404, response: "The endpoint does not exist."
        }))
      }
    })
  }
  // Listen as http
  listen( port, callback ){
    this.server.listen( port, callback )
  }
  // Server api
  status(){
    return this._r( "/status" )
  }
  broadcast( msg ){
    return this._r( "/v2/server/broadcast", {
      msg: msg, token: this.setting.token
    })
  }
  // Players Api
  players(){
    return this._r( "/v2/players/list", {
      token: this.setting.token
    } )
  }
  async readPlayer( player ){
    var dt = await this._r( "/v3/players/read", {
      token: this.setting.token,
      player: player.toString()
    })
    dt.position = dt.position.split( "," )
    return dt
  }
  killPlayer( player ){
    return this._r( "/v2/players/kill", {
      token: this.setting.token,
      player: player.toString()
    })
  }
  mutePlayer( player, sth = "none", _u = "" ){
    return this._r( "/v2/players/" + _u + "mute", {
      token: this.setting.token,
      player: player.toString(),
      reason: sth
    })
  }
  unmutePlayer( player, sth = "none" ){
    return this.mutePlayer( player, sth, "un" )
  }
  kickPlayer( player, sth = "none" ){
    return this._r( "/v2/players/kick", {
      token: this.setting.token,
      player: player.toString(),
      reason: sth
    })
  }
  banPlayer( player, sth = "none" ){
    return this._r( "/v2/players/ban", {
      token: this.setting.token,
      player: player.toString(),
      reason: sth
    })
  }
  getPlayer( nick, group ){
    return new Player( nick, group, this )
  }
  // World api
  world(){
    return this._r( "/world/read", {
      token: this.setting.token
    })
  }
  meteor(){
    return this._r( "/world/meteor", {
      token: this.setting.token
    })
  }
  bloodmoon( yes = true ){
    return this._r( "/world/bloodmoon/" + yes.toString(), {
      token: this.setting.token
    })
  }
  save(){
    this._r( "/v2/world/save", {
      token: this.setting.token
    })
  }
  butcher( kfnpc = false ){
    this._r( "/v2/world/butcher", {
      token: this.setting.token,
      killfriendly: kfnpc
    })
  }
  // Command API
  exec( cmd, version = 3 ){
    return this._r( "/v" + version + "/server/rawcmd", {
      token: this.setting.token,
      cmd: cmd
    })
  }
  // 启用基于定时获取的事件
  // 一般1秒一次其实够用
  enableTick( tick = 1000 ){
    var _s = this, tick, online = false, oldstatus = {}, status = {}
    this.tick = tick = setInterval(async function(){
      try {
        oldstatus = status
        status = await _s._r( "/status" )
        if( !online ){
          online = true
          _s.emit( "connect", new TickEvent( status, _s ) )
        } else {
          _s.emit( "tick", new TickEvent( status, _s ), new TickEvent( oldstatus, _s ) )
        }
      } catch( error ){
        if( online ){
          online = false
          _s.emit( "disconnect" )
        }
      }
    }, tick)
    return {
      close: () => clearInterval( tick )
    }
  }
}

module.exports = {VRestServer, EventChatMsg, Player}
