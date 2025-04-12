# TRC.js
基于RESTAPI的JavaScript Tshock插件库  
**无需魔改服务端或客户端，全JavaScript实现，基于Nodejs**.  
*TIP: 本库部分功能依赖tshock插件 ChattyBridge 聊天桥*.  
Example(.js):
```js
var server = new VRestServer( 7171, "localhost", "private-token-for-lovekogasa" )
// 后两者是可选的，但是您需要提供token才能够使用绝大部分功能
server.on( "message", ( event ) => {
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
```
在本地启动服务器后，将ChattyBridge配置文件中的REST地址设置一条为localhost:7373  
打开游戏输入hi进行测试  
*如果后面有更好的相关的插件出来，本项目也会添加更多事件支持*.  

# 支持的事件列表
* message - 聊天栏消息事件，返回消息对象(EventChatMsg)，可用event.message.type 检测是玩家聊天还是退出或进入，启用指令转发后可用于检测不存在的命令
* chat - 聊天事件
* player\_join - 玩家进入
* player\_leave - 玩家退出
* tick - 服务器REST启动后每t(enableTick中自定义，默认为1000(ms))在执行一次，返回TickEvent对象，无依赖，需要启用tick事件  
调用VRestServer对象的enableTick以启动tick事件
* connect - 启用tick后当服务器rest可以被请求则执行该事件，返回TickEvent对象
* disconnect - 词面意思

# TRModule 目录
本目录为TRC扩展功能列表，非依赖库

# TODO 正在整
* 完善Tick事件
* 增加更多类
* 增加更多功能