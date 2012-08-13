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
1. seperate normal friends' contact list and groups' contact list
2. fill groups' contact list, such UIN, QQ number, avatars, etc.
3. caches for QQ avatars, messages, etc.
4. fix bug of send/recevice group messages
5. Support multiple accouts at the same time, and this may be the most usefull
function for someone

If anyone has the interest of developmenting QQ and Fetion protocol, please
contact me.

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
