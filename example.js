var {VRestServer} = require( "./index" )
var server = new VRestServer( 7171, "localhost", "private-token-for-lovekogasa" )
server.on( "chat", ( event ) => {
  console.log( event.sender + "@terraria# " + event )
  if( event.toString() == "hi" ){
    event.reply( "hey!", "lovekogasa" ).catch(console.error)
    event.firework( "B" ).catch(console.error)
    event.firework( "G" ).catch(console.error)
  } else if( event.toString() == "#status" ){
    server.status().then( ( s ) => event.reply( s.world ) )
  } else if( event.toString() == "#player" ){
    event.read().then(console.log)
  }
})
server.listen( 7373, () => {
  console.log( "127.0.0.1:7373")
})