// Author: Love-Kogasa
// Allow u make a lot of cmds with TRC.JS
// depend on ChattyBridge
class CommandManager {
  constructor( vrest, sign = "/" ){
    this.vrest = vrest
    this.sign = sign
    this.cmdmap = new Map()
    vrest.on( "chat", ( message ) => {
      if( message.toString()[0] == sign ){
        var cmd = message.toString().split( " " )
        if( cmd[0] == "/sudo" ) cmd = cmd.slice( 1 )
        if( this.cmdmap.has( cmd[0] ) ){
          this.cmdmap.get( cmd[0] )( cmd.slice(1), message )
        }
      }
    })
  }
  add( name, func ){
    this.cmdmap.set( this.sign + name, func )
  }
  short( name, f ){
    this.cmdmap.set( this.sign + name, (...args) => {
      if( this.cmdmap.has( this.sign + f ) ){
        this.cmdmap.get( this.sign + f )(...args)
      } else {
        this.vrest.exec( "/" + f + " " + args.join( " " ) )
      }
    })
  }
}

module.exports = CommandManager