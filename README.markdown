# emesene

emesene is an instant messenger capable of connecting to various networks
and utilizing different graphical toolkits.
Currently msn, xmpp (jabber) and Tencent QQ are supported through papyon, 
SleekXMPP, and webqq, which allows emesene to connect to various IM services 
such as Windows Live Messenger, GTalk, Facebook Chat, Tencent QQ, China 
Fetion(under developemnt), etc.

# Tencent QQ
Tencent QQ is the most popular IM in China, and this version of emesene has
implemented the basic function, such as get friends' contact, mark and avatars,
get groups' contacts, and get/send messages to your friends. 

Some functions need to be implented, list as below:
* seperate normal friends' contact list and groups' contact list
* fill groups' contact list, such UIN, QQ number, avatars, etc.
* caches for QQ avatars, messages, etc.
* fix bug of send/recevice group messages
* Support multiple accouts at the same time, and this may be the most usefull
function for someone
* invite(find/add friend's account), group management, file transfer, video 
support

If anyone has the interest of developmenting QQ and Fetion protocol, please
contact me.

# China Fetion
Besides of QQ, Fetion is used widely in China, because it can send messages to 
your friends' mobile phone, and there are some wonderfull projects that have
already implemented its protocol, such as levin's openfetion, linux fetion(qt),
etc. Intergrate fetion to emesene is underway.

## Useful links

* [Main repository](http://github.com/emesene/emesene) (fork this one)
* [Wiki](http://wiki.github.com/emesene/emesene)
* [Issue tracker](http://github.com/emesene/emesene/issues)

## Upstream libraries repositories

emesene embeds in its codebase a number of python libraries for the different
service it supports. We embed them instead of using git submodules so we can
make packagers' life better and hotfix eventual bugs.

* [papyon] (https://github.com/emesene/papyon)
* [SleekXMPP] (https://github.com/fritzy/SleekXMPP)
* [pyfb] (https://github.com/jmg/pyfb)
