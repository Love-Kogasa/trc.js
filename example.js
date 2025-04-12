var {VRestServer} = require( "./index" )
var server = new VRestServer( 7171, "localhost", "private-token-for-lovekogasa" )
var CommandManager = require( "./TRModule/ccommand/index" )
/*
server.enableTick()

server.on( "connect", ( event ) => {
  console.log( "Connect tshock successful" )
  console.table( event.server )
})

server.on( "disconnect", () => {
  console.log( "Disconnect" )
})

server.on( "tick", ( event ) => {
  console.log( "server@terraria# server status: "+ event.server.status )
})
*/

server.on( "player_join", ( event ) => {
  event.reply( "Welcome : " + event.sender )
  event.firework().catch(console.error)
  console.log( event.sender + "Join the game" )
})

server.on( "player_level", ( event ) => {
  console.log( event.sender + "Quit the game" )
})

server.on( "chat", ( event ) => {
  console.log( event.sender + "@terraria# " + event )
  if( event.toString() == "hi" ){
    event.reply( "hey!", "lovekogasa" ).catch(console.error)
    event.firework( "B" ).catch(console.error)
  } else if( event.toString() == "#status" ){
    server.status().then( ( s ) => event.reply( s.world ) )
  } else if( event.toString() == "#player" ){
    event.read().then(console.log)
  }
})

// 自定义命令
var command = new CommandManager( server )
command.add( "test123", ( args, sender ) => {
  sender.reply( "Test successful ！" )
  sender.firework()
})

server.listen( 7373, () => {
  console.log( "127.0.0.1:7373")
})