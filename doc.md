# 文档
## VRestServer: EventEmitter
(候补)
## EventChatMsg: Player
#### constructor( msg, vrest )
* msg : /chat所接受到的对象
* vrest : 虚拟REST服务器，一个虚拟REST服务器只能对应一个tshock服务器
#### reply( msg, sender = "server", group = "owner", rgb = "////" )
* 回复消息
* msg: 消息字符串
* sender: 发送者，默认为服务器(可以是不在线的玩家)
* group: 发送者用户组(可以是不存在的组别，但建议是default或owner)
* rgb: 颜色，详见ChattyBridge插件
#### chatAsPlayer( msg )
* msg 字符串
* 以发送者身份发送消息
#### toString()
* 消息字符串
#### message
* 消息对象，包含text, rgb等数据
#### sender - 发送者
#### msg
* constructor 接受的msg，可用于声明EventChatMsg类
#### Extend Player
## Player
#### constructor( player, group = "default", vrest )
* 懒得介绍了，这里player可以使用玩家名称
#### toString()
* 返回玩家名，可用于匹配玩家
#### firework( color = "" )
* 在玩家处烟花
* color: 烟花颜色，必须是 R G B A 或者 "" 之一，默认为""
(太多了，懒得写了，等有5star了再补充吧)