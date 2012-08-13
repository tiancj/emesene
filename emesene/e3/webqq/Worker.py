# -*- coding: utf-8 -*-

#    This file is part of emesene.
#
#    emesene is free software; you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation; either version 3 of the License, or
#    (at your option) any later version.
#
#    emesene is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with emesene; if not, write to the Free Software
#    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

import os
import sys
import ssl
import time
import Queue
import base64
import hashlib
import e3
import StringIO
import logging
import simplejson as json
import cookielib
import urllib2
import urllib
import json.encoder as json_encode
import json.decoder as json_decode
import threading

log = logging.getLogger('WebQQ.Worker')

# Python versions before 3.0 do not use UTF-8 encoding
# by default. To ensure that Unicode is handled properly
# throughout SleekXMPP, we will set the default encoding
# ourselves to UTF-8.
if sys.version_info < (3, 0):
    reload(sys)
    sys.setdefaultencoding('utf8')
else:
    raw_input = input

'''
10:'online',20:'offline',30:'away',40:'hidden',50:'busy',60:'callme',70:'silent'
'''
STATUS_MAP = {}
STATUS_MAP[e3.status.BUSY] = 'busy'
STATUS_MAP[e3.status.AWAY] = 'away'
STATUS_MAP[e3.status.IDLE] = 'silent'
STATUS_MAP[e3.status.ONLINE] = 'online'
STATUS_MAP[e3.status.OFFLINE] = 'offline'

STATUS_MAP_REVERSE = {}
STATUS_MAP_REVERSE['busy'] = e3.status.BUSY
STATUS_MAP_REVERSE['away'] = e3.status.AWAY
STATUS_MAP_REVERSE['silent'] = e3.status.IDLE
STATUS_MAP_REVERSE['online'] = e3.status.ONLINE
STATUS_MAP_REVERSE['offline'] = e3.status.OFFLINE

PHOTO_TYPES = {
    'image/png': '.png',
    'image/jpg': '.jpg',
    'image/jpeg': '.jpg',
    'image/gif': '.gif',
    'image/bmp': '.bmp',
    }



'''
1. 头像获取
1.1 自己头像
http://faceXX.qun.qq.com/cgi/svr/face/getface?cache=1&type=1&fid=0&uin=YYY＆vfwebqq=ZZZZZZZZZZZZZZZZZZZZZZZZZZ&t=TIMESTAMP
1.2 群头像：
http://faceXX.qun.qq.com/cgi/svr/face/getface?cache=0&type=4&fid=0&uin=YYY&vfwebqq=ZZZZZZZZZZZZZZZZZZZZZZ
1.3 好友头像：
http://faceXX.qun.qq.com/cgi/svr/face/getface?cache=0&type=1&fid=0&uin=YYY&vfwebqq=ZZZZZZZZZZZZZZZZZZZZZZ

if 'last' in avatars:
	contact.picture = os.path.join(avatars.path, 'last')
self.session.picture_change_succeed(self.session.account.account, 
self.session.contacts.me.picture = avatar_path

self.caches.get_avatar_cache

self.caches = e3.cache.CacheManager(self.session.config_dir.base_dir)
self.my_avatars = self.caches.get_avatar_cache(self.session.account.account)

avatars = self.caches.get_avatar_cache(jid)
contact.picture = os.path.join(avaters.path, 'last')

avatars.insert_url

new_path = self._avatar_cache.insert_url(avatar_url)[1] [0]: timestamp
self._avatar_path = os.path.join(self._avatar_cache.path, new_path)

'''
class Worker(e3.Worker):
    '''webqq's Worker thread'''

    def __init__(self, app_name, session, proxy, use_http=False, use_ipv6=False):
        '''class constructor'''
        e3.Worker.__init__(self, session)

        self.client = None

        self.proxy = proxy
        self.proxy_data = None
        self._login_success = False
        self.send_seq = 12345

        if self.proxy.use_proxy:
            self.proxy_data = {}
            self.proxy_data['host'] = self.proxy.host
            self.proxy_data['port'] = self.proxy.port

            if self.proxy.use_auth:
                self.proxy_data['username'] = self.proxy.user
                self.proxy_data['password'] = self.proxy.passwd

        self.conversations = {}
        self.rconversations = {}
        self.caches = e3.cache.CacheManager(self.session.config_dir.base_dir)
        self.avatars_cache = self.caches.get_avatar_cache(self.session.account.account)


        self.username = self.session.account.account
        self.password = self.session.account.password
        self.cookiefile = os.path.join(self.session.config_dir.base_dir, 'cookies.txt')
        log.debug(self.cookiefile)
        self.cookiejar  = cookielib.MozillaCookieJar(self.cookiefile)
        self.opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(self.cookiejar))
        self.opener.addheaders = [('User-agent', 'Opera/9.23')]
        urllib2.install_opener(self.opener)

    def md5hash(self, str):
        return hashlib.md5(str).digest()

    """进行md5加密，并输出16进制值"""
    def hex_md5hash(self, str):
        return hashlib.md5(str).hexdigest().upper()

    """
    由于提取的验证码2为文本字符串，因此要把文本字符串转换成原始的字符串。
    本函数先把\x00\x00\x00\x00\x95\x22\xea\x8a切片成list如['00','00','00','00','95','22','ea','8a'],
    然后遍历这个list，对每个字符串进行转换，转换成16进制的数字，
    最后使用chr函数，把16进制的数字转换成原始字符，并合并
    """
    def hexchar2bin(self, uin):
        uin_final = ''
        uin = uin.split('\\x')
        #print uin
        for i in uin[1:]:
            uin_final += chr(int(i, 16))
        return uin_final

    def get_password(self, password, verifyCode1, verifyCode2):
        """
        根据明文密码计算出加密后的密码, 从抓包来看，verifyCode2是一样的
        """
        password_1 = self.md5hash(password) #第一步，计算出来原始密码的MD5值，输出二进制
        password_2 = self.hex_md5hash(password_1 + self.hexchar2bin(verifyCode2)) #第二步，合并(拼接)第二步产生的bin值与验证码2的bin值，并进行md5加密，输出32位的16进制
        password_final = self.hex_md5hash(password_2 + verifyCode1.upper()) #第三步，合并(拼接)第二步产生的16进制值与验证码1，并进行md5加密，输出32位的16进制值
        log.debug(password_final)
        return password_final

    def find_cookie(self, name):
        for cookie in self.cookiejar:
            if cookie.name == name:
                return cookie.value
        return ""

    def send_request(self, url, method = 'GET', data = {}, save_cookie=False):
        if method.upper() == 'POST':
            data = urllib.urlencode(data)
            request = urllib2.Request(url, data, self.__headers)
        else:
            request = urllib2.Request(url, headers = self.__headers)
        response = urllib2.urlopen(request)
        return response.read()

    def run(self):
        '''main method, block waiting for data, process it, and send data back
        '''
        while self._continue:
            try:
                action = self.session.actions.get(True, 0.1)
                self._process_action(action)

            except Queue.Empty:
                pass

    """
    def run(self):
        '''main method, block waiting for data, process it, and send data back
        '''
        while self._continue == True:
            try:
                event_queue = self.res_manager.event_queue
                if not event_queue.empty() :
                    self.res_manager.lock()
                    while not event_queue.empty():
                        item = event_queue.pop()
                        if item[0] == libwebqqpython.ON_BUDDY_MESSAGE :
                            self._on_message(item[1])
                        elif item[0] == libwebqqpython.ON_NICK_CHANGE:
                            self._on_nick_update(item[1])
                        elif item[0] == libwebqqpython.ON_BUDDY_STATUS_CHANGE:
                            self._on_status_change(item[1])
                        elif item[0] == libwebqqpython.ON_GROUP_MESSAGE:
                            self._on_group_message(item[1])
                        else:
                            print 'Un implementation callback functions'

                    self.res_manager.ulock()

                action = self.session.actions.get(True, 0.1)
                self._process_action(action)

            except Queue.Empty:
                pass
    """

    def _session_started(self):
        """
        获取好友列表，群列表等。
        Process the session_start event.

        Typical actions for the session_start event are
        requesting the roster and broadcasting an initial
        presence stanza.

        Arguments:
            event -- An empty dictionary. The session_start
                     event does not provide any additional
                     data.
        """
        """
        categories_dict = {}
        default_group = e3.Group('Friends','Friends')
        group_group = e3.Group('Groups', 'Groups')
        categories_dict[0] = default_group
        categories_dict[-1] = group_group

        for index in self.res_manager.categories.keys():
            group = e3.Group( self.res_manager.categories[index].name, index)
            categories_dict[index] = group

        for uin in self.res_manager.contacts.keys():
            #nick = self.res_manager.contacts[uin].nick
            _status = e3.status.OFFLINE
            try:
                if not self.res_manager.contacts[uin].status  == '':
                    _status = STATUS_MAP_REVERSE[self.res_manager.contacts[uin].status]
            except KeyError , e:
                _stauts = e3.status.ONLINE

            contact = e3.Contact(account = uin, identifier = int(uin),  message = self.res_manager.contacts[uin].lnick, _status = _status, blocked = False, cid = uin)
            '''
            if contact.cid  == self.session.account.account :
                self.session.contacts.me.nick = nick
                self.session.nick_change_succeed(nick)
                continue
            '''
            index = self.res_manager.contacts[uin].cate_index
            group = categories_dict[index]
            self._add_contact_to_group( contact, group.name )
            self.session.contacts.contacts[uin] = contact

        for group_id in self.res_manager.groups.keys():
            _status = e3.status.ONLINE
            contact = e3.Contact(account = group_id, identifier = int(group_id), nick =  self.res_manager.groups[group_id].name ,
                                 message = self.res_manager.groups[group_id].memo,  _status = _status, blocked = False, cid = group_id)
            self._add_contact_to_group(contact, group_group.name)
            self.session.contacts.contacts[group_id] = contact

            for uins in self.res_manager.group_contacts[group_id].keys():
                buddy = self.res_manager.group_contacts[group_id][uins]
                uin = buddy.uin
                _status = e3.status.ONLINE
                contact = e3.Contact(account = uin, identifier = int(uin),  nick = buddy.nick, message = buddy.lnick  , _status = _status, blocked = False, cid = uin)
                #self.session.contacts.contacts[uin] = contact
        """
        self.session.login_succeed()
        self.session.contact_list_ready()

    def _change_status(self, status_):
        '''change the user status'''
        contact = self.session.contacts.me
        stat = STATUS_MAP[status_]
        # XXX: set QQ status via HTTP

        e3.base.Worker._handle_action_change_status(self, status_)

    def _on_message(self, message):
        '''handle the reception of a message'''
        """
        data = json.loads(message)

        from_uin = str(data['from_uin'])

        account = from_uin
        body = data['content'][-1]
        type_ = e3.Message.TYPE_MESSAGE

        if account in self.conversations:
            cid = self.conversations[account]
        else:
            cid = time.time()
            self.conversations[account] = cid
            self.rconversations[cid] = [account]
            self.session.conv_first_action(cid, [account])

        msgobj = e3.Message(type_, body, account)
        self.session.conv_message(cid, account, msgobj)

        # log message
        print 'log message'
        e3.Logger.log_message(self.session, None, msgobj, False)
        """
        pass

    def _on_group_message(self, message):
        """
        data = json.loads(message)
        group_code = str(data["group_code"])
        send_uin = str(data["send_uin"])
        body = data['content'][-1]
        display_name=send_uin

        for group in self.res_manager.group_contacts.keys():
          if self.res_manager.group_contacts[group].count(send_uin) == 1:
              display_name = self.res_manager.group_contacts[group][send_uin].nick
              break

        account = group_code
        if account in self.conversations:
            cid = self.conversations[account]
        else:
            cid = time.time()
            self.conversations[account] = cid
            self.rconversations[cid] = [account]
            self.session.conv_first_action(cid, [account])

        type_ = e3.Message.TYPE_MESSAGE
        msgobj = e3.Message(type_, body, display_name)
        self.session.conv_message(cid, display_name, msgobj)
        print 'log message'
        e3.Logger.log_message(self.session, None, msgobj, False)
        """
        pass


    '''status, nick, picture'''
    def _on_nick_update(self, value):
        """
        data = json.loads(value)
        uin = str(data["uin"])
        nick = data["nick"]
        contact = self.session.contacts.contacts.get(uin, None)

        if contact == None:
            return

        account = uin
        old_nick = contact.nick
        status_ = contact.status

        log_account = e3.Logger.Account(contact.cid, None, contact.account, contact.status, contact.nick, contact.message, contact.picture)
        if not nick == "" :
           contact.nick = nick
           contact.alias = nick
           self.session.contact_attr_changed(account, 'nick', old_nick)
           self.session.log('nick change', status_, nick,  log_account)

        if contact.account  == self.session.account.account :
            me = self.session.contacts.me
            log_account =e3.Logger.Account(me.cid, None, me.account,
                                         me.status, nick, me.message, me.picture)
            self.session.log('nick change', contact.status, nick,
                             log_account)
            self.session.contacts.me.nick = nick
            self.session.contacts.me.alias = nick
            self.session.nick_change_succeed(nick)
        """
        pass


    #def _on_photo_update(self, session, stanza):
    #    pass
    #def _on_contact_jabber_changed(self, session, stanza):
    #    pass
    # mailbox handlers
    #def _on_mailbox_unread_mail_count_changed(self, unread_mail_count,
    #        initial):

    #    log.info("Mailbox count changed (initial? %s): %s" % (initial,
    #        unread_mail_count))
    #    self.session.mail_count_changed(unread_mail_count)

    #def _on_mailbox_new_mail_received(self, mail_message):
    #    log.info("New mailbox message received: %s" % mail_message)
    #    self.session.mail_received(mail_message)

    #def _on_social_external_request(self, conn_url):
    #    self.session.social_request(conn_url)

    def _add_group(self, name):
        """
        method to add a group to the contact list
        """
        self.session.groups[name] = e3.Group(name, name)

    def _add_contact_to_group(self, account, group):
        """
        method to add a contact to a group
        """
        self.session.groups[group].contacts.append(account)
        self.session.contacts.contacts[account].groups.append(group)


    #def _add_group(self, group):
    #    self.session.groups[group] = e3.base.Group(group, group)

    #def _add_contact_to_group(self, contact, group):
    #    ''' method to add a contact to a (gui) group '''
    #    if group not in self.session.groups.keys():
    #        self._add_group(group)
    #    self.session.groups[group].contacts.append(contact.account)
    #    contact.groups.append(group)

    # action handlers
    def _handle_action_quit(self):
        '''handle Action.ACTION_QUIT
        '''
        log.debug('closing thread')
        self.session.events.queue.clear()
        self.session.logger.quit()
        self.session.signals.quit()
        self._continue = False
        self.session.disconnected(None, False)

    def _handle_action_add_contact(self, account):
        '''handle Action.ACTION_ADD_CONTACT
        '''
        pass

    def _handle_action_add_group(self, name):
        '''handle Action.ACTION_ADD_GROUP
        '''

        pass

    def _handle_action_add_to_group(self, account, gid):
        '''handle Action.ACTION_ADD_TO_GROUP
        '''
        pass

    def _handle_action_block_contact(self, account):
        '''handle Action.ACTION_BLOCK_CONTACT
        '''
        pass

    def _handle_action_unblock_contact(self, account):
        '''handle Action.ACTION_UNBLOCK_CONTACT
        '''
        pass

    def _handle_action_change_status(self, status_):
        '''handle Action.ACTION_CHANGE_STATUS
        '''
        self._change_status(status_)

    # 1 param: username
    # appid = 1003903, r = random()
    verifyURL = "http://check.ptlogin2.qq.com/check?uin=%s&appid=1003903&r=0.1314827858518941"
    #verifyURL = "http://check.ptlogin2.qq.com/check?uin={0:s}&appid=1003903&r=0.1314827858518941"
    # 2 param: username, vc_type: verify code
    # aid = 1002101, r = random()
    verifyImageURL = "http://captcha.qq.com/getimage?aid=1002101&r=0.1314827858518941&uin=%s&vc_type=%s"
    #verifyImageURL = "http://captcha.qq.com/getimage?aid=1002101&r=0.1314827858518941&uin={0:s}&vc_type={1:s}"
    # username, encoded password, verify code, webqq_type(10)
    #loginURL = "http://ptlogin2.qq.com/login?u=%s&p=%s&verifycode=%s&webqq_type=%s&remember_uin=1&login2qq=1&aid=1003903&u1=http%3A%2F%2Fweb.qq.com%2Floginproxy.html%3Flogin2qq%3D1%26webqq_type%3D10&h=1&ptredirect=0&ptlang=2052&from_ui=1&pttype=1&dumy=&fp=loginerroralert&action=8-24-32078&mibao_css=m_webqq&t=1&g=1"
    loginURL = "http://ptlogin2.qq.com/login?u={0:s}&p={1:s}&verifycode={2:s}&webqq_type={3:s}&remember_uin=1&login2qq=1&aid=1003903&u1=http%3A%2F%2Fweb.qq.com%2Floginproxy.html%3Flogin2qq%3D1%26webqq_type%3D10&h=1&ptredirect=0&ptlang=2052&from_ui=1&pttype=1&dumy=&fp=loginerroralert&action=8-24-32078&mibao_css=m_webqq&t=1&g=1"
    login2URL = "http://d.web2.qq.com/channel/login2"

    send_buddy_msg_url = "http://d.web2.qq.com/channel/send_buddy_msg2"
    send_group_msg_url = "http://d.web2.qq.com/channel/send_qun_msg2"


    __headers = {
        #'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.9 Safari/534.30', 
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:14.0) Gecko/20100101 Firefox/14.0.1', 
        'Referer':'http://ui.ptlogin2.qq.com/cgi-bin/login?target=self&style=5&mibao_css=m_webqq&appid=1003903&enable_qlogin=0&no_verifyimg=1&s_url=http%3A%2F%2Fwebqq.qq.com%2Floginproxy.html&f_url=loginerroralert&strong_login=1&login_state=10&t=20110909003',
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
        #'Accept-Encoding': 'gzip, deflate',
        # later we can support gzip
        #'Connection': 'keep-alive',
        #'Content-Type': 'utf-8'
    }

    def get_http_headers(self):
        return self.__headers

    def _handle_action_login(self, account, password, status_, host, port):
        '''
        handle Action.ACTION_LOGIN
        '''
        self.my_avatars = self.caches.get_avatar_cache(self.session.account.account)

        #if self.webqq_plugin.webqq_login(account, password) is True:
        #    print "Login Success"
        #else:
        #    print "Login Fail"
        ### Fix this if login fail
        print "_handle_action_login"
        # XXX: 加载已存在的cookie，尝试此cookie是否还有效
        try:
            self.cookiejar.load(ignore_discard=True, ignore_expires=True)
        except Exception, e:
            # 加载失败，说明从未登录过，需创建一个cookie
            self.cookiejar.save(self.cookiefile, ignore_discard=True, ignore_expires=True)

        #request = urllib2.Request(self.verifyURL % self.username)
        #response = urllib2.urlopen(request)
        url = self.verifyURL % self.username
        data = self.send_request(url)
        """
        对response的文本进行提取，第一步拆分成
        ["ptui_checkVC('0'", "'!YQL'", "'\\x00\\x00\\x00\\x00\\x95\\x22\\xea\\x8a');"]
        """
        #data = response.read()
        print "data is ", data
        content = data.split(',')
        print content
        self.verifyCode1 = content[1][1:-1]
        #print "verifyCode1", self.verifyCode1
        self.verifyCode2 = content[2].split("'")[1]
        #print "verifyCode2", self.verifyCode2

        if len(self.verifyCode1) > 4:
            # must retrieve image verify code from Tencent server
            url = self.verifyImageURL % (self.username, self.verifyCode1)
            print url
            self.session.login_verify_code(self._handle_verify_code, url)    # send verify code event
            return
        else:
            self._handle_verify_code()

	"""when verify code completes, call _handle_verify_code() """
    def _handle_verify_code(self, verifyCode1 = None):
        """
        the following happens when verifycode is filled by server
        ptuiCB('3','0','','0','您输入的帐号或密码不正确，请重新输入。', '245155408')
        """
        if verifyCode1 is not None:
            self.verifyCode1 = verifyCode1
        print self.verifyCode1
        #loginurl = self.loginURL % (self.username, self.get_password(self.password, verifyCode1, verifyCode2), verifyCode1, "10")
        loginurl = self.loginURL.format(self.username, self.get_password(self.password, self.verifyCode1, self.verifyCode2), self.verifyCode1, "10")
        print loginurl
        data = self.send_request(loginurl)
        print "login response in HTML: ", data
        #if data.find('登陆成功') == -1:
        if data.find('web.qq.com') == -1:
            self.session.login_failed(data.split(',')[4])
            return
        self.session.login_succeed()    #登陆成功

        self.cookiejar.save(self.cookiefile, ignore_discard=True, ignore_expires=True)
        #for cookie in self.cookiejar:
        #    print ("%s -> %s" %(cookie.name, cookie.value))
        #print self.find_cookie("ptwebqq")

        self.login2()

    def login2(self):
        # 执行第二步login
        a = {'status': 'hidden',
            'ptwebqq': self.find_cookie("ptwebqq"),
            'passwd_sig': '',
            'clientid': '85849142',
            'psessionid': 'null'}
        array = {'r': json_encode.JSONEncoder().encode(a),
            'clientid': 85849142,
            'psessionid': 'null'}
        headers = ({'Referer': 'http://d.web2.qq.com/proxy.html?v=20110331002&callback=2'})
        #print urllib.urlencode(array)
        #r = urllib2.Request(self.login2URL, urllib.urlencode(array), headers)
        #u = urllib2.urlopen(r)
        #response = u.read()
        self.__headers.update(headers)
        response  = self.send_request(self.login2URL, 'POST', array)

        print "HTML response", response
        response = json_decode.JSONDecoder().decode(response)
        #print response

        # remember the psessionid and vfwebqq, other operation needs them
        self.psessionid = response['result']['psessionid']
        self.vfwebqq = response['result']['vfwebqq']
        self._login_success = True

        self.get_friend_info2()     #获取自己的信息
        self.get_user_friends2()    #获取好友
        self.get_group_name_list_mask2()    #获取群成员
        self.session.contact_list_ready()
        #set_single_long_nick
        self.get_single_long_nick2()
        self.get_online_buddies()  #获取在线好友
        self.get_group_info_ext2()
        #get_discu_list_new2
        #get_recent_list2
        QQPoll(self, self.session).start()
        #self.poll2()
        #self.get_msg_tip()
        return True

    def get_online_buddies(self):
        '''
        {
            "retcode":0,
            "result":[
                {"uin":3007902232,"status":"online","client_type":1},
                {"uin":4057383977,"status":"online","client_type":21},
                {"uin":2049474691,"status":"away","client_type":1},
                {"uin":40344547,"status":"online","client_type":24},
                {"uin":1268665911,"status":"online","client_type":21},
                {"uin":1155832458,"status":"online","client_type":21},
                {"uin":4217182536,"status":"online","client_type":21},
                {"uin":510958893,"status":"online","client_type":21},
                {"uin":309402969,"status":"away","client_type":1},
                {"uin":965488758,"status":"away","client_type":1}
            ]
        }
        '''
        #'https://d.web2.qq.com/channel/get_online_buddies2?clientid=78127272&psessionid=8368046764001e636f6e6e7365727665725f77656271714031302e3133332e34312e323032000023bd000003d4016e040050c69c0e6d0000000a4039724a42784b4f39566d00000028eeee5c7a751dd5fef13a8c5b3b647c25ca6af14be1c7edbee27018733b81f51c889e8f2bf97efbff&t=1344673127900'
        url = 'http://d.web2.qq.com/channel/get_online_buddies2?clientid=85849142&psessionid=%s' %self.psessionid
        response = self.send_request(url)
        print "get_online_buddies in HTML: ", response
        response = json_decode.JSONDecoder().decode(response)
        # process response
        if response['retcode'] == 0:
            #onlinegroup = _('Online')
            #self._add_group(onlinegroup)
            #self.session.group_add_succeed(onlinegroup)
            for iter in response['result']:
                uin = str(iter['uin'])
                status = STATUS_MAP_REVERSE[iter['status']]
                contact = self.session.contacts.contacts.get(uin, None)
                if contact is not None:
                    account = uin
                    old_status = contact.status
                    contact.status = status
                    self.session.contact_attr_changed(account, 'status', old_status)
                    #self._add_contact(uin, uin, e3.status.OFFLINE, '', False)
                    #self._add_contact_to_group(uin, onlinegroup)
                    #self.session.contact_add_succeed(account)




    def get_single_long_nick2(self, uin=None):
        '''
        http://s.web2.qq.com/api/get_single_long_nick2?tuin=245155408&vfwebqq=eeee5c7a751dd5fef13a8c5b3b647c25ca6af14be1c7edbee27018733b81f51c889e8f2bf97efbff&t=1344673127901
        {"retcode":0,"result":[{"uin":245155408,"lnick":"海葵来袭。。。"}]}
        '''
        if uin is None:
            uin = self.username
        url = 'http://s.web2.qq.com/api/get_single_long_nick2?tuin=%s&vfwebqq=%s' %(uin, self.vfwebqq)
        response = self.send_request(url)

        # process response
        print response
        response = json_decode.JSONDecoder().decode(response)
        if response['retcode'] == 0:
            lnick = response['result'][0]['lnick']
        contact = self.session.contacts.contacts.get(uin, None)
        if contact == None:
            return
        account = uin
        contact.message = lnick
        if uin == self.username:
            self.session.profile_get_succeed('', lnick)
        self.session.contact_attr_changed(account, 'message', '')

    def get_friend_info2(self, uin=None):
        '''
            @url:http://s.web2.qq.com/api/get_friend_info2?tuin=self.__qq&verifysession=&code=&vfwebqq=self.__vfwebqq
            http://s.web2.qq.com/api/get_friend_info2?tuin=245155408&verifysession=&code=&vfwebqq=
                d9845386840fd5442d5239e4f798bdd419c25f3e7c094104d969698f3f0cf5518515058ece478fba&t=1344344849355
            return decoded json structure
        获取好友信息，如QQ号，出生日期等。
        {
        	"retcode":0,
        	"result": {
        		"face":252,
        		"birthday": {"month":7,"year":1985,"day":22},
        		"occupation":"待业/无业/失业",
        		"phone":"",
        		"allow":1,
        		"college":"东南大学",
        		"uin":245155408,"
        		"constel":6,
        		"blood":5,
        		"homepage":"http://www.cnblogs.com/codestub",
        		"stat":20,
        		"vip_info":0,
        		"country":"中国",
        		"city":"浦东新区",
        		"personal":"",
        		"nick":"tiancj",
        		"shengxiao":2,
        		"email":"cj_tian@126.com",
        		"province":"上海",
        		"gender":"male",
        		"mobile":"139********"
        	}
        }
        '''
        if uin is None:
            uin = self.username
        headers = ({'Referer': 'http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=3'})
        url = "http://s.web2.qq.com/api/get_friend_info2?tuin={0:s}&verifysession=&code=&vfwebqq={1:s}".format(uin, self.vfwebqq)
        self.__headers.update(headers)
        response = self.send_request(url)
        print "HTML response", response
        response = json_decode.JSONDecoder().decode(response)
        #print response
        if response['retcode'] == 0:
            nick_name = response['result']['nick']
            self.session.profile_get_succeed(nick_name, '')

    def get_user_friends2(self):
        """s.web2.qq.com POST /api/get_user_friends2 HTTP/1.1"""
        """Referer: http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=3"""
        headers = {'Referer': 'http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=3'}
        url = "http://s.web2.qq.com/api/get_user_friends2"
        a = {'h': 'hello',
            'vfwebqq':self.vfwebqq}
        array = {'r': json_encode.JSONEncoder().encode(a) }
        response = self.send_request(url, 'POST', array)
        print "HTML response of get_user_friends2: ", response
        response = json_decode.JSONDecoder().decode(response)
        #print response
        self._fill_contact_list(response)
        pass


	"""
	{
		"retcode": 0,
		"result": {
			"friends":  [ {"flag":12, "uin":328586066, "categories":3}, {"flag":16, "uin":1492280827, "categories":4} ],
			"marknames":[ {"uin":328586066,"markname":"韦东山"}, {"uin":1492280827,"markname":"胡艳艳"},{"uin":4004198679,"markname":"Rebecca"} ],
			"categories":[{"index":0, "sort":1, "name":"大学同窗"},{"index":1, "sort":3, "name":"初高中同学"}],
			"vipinfo":  [ {"vip_level":0,"u":3852414103,"is_vip":0}, {"vip_level":3,"u":1636734747,"is_vip":1}],
			"info":     [ {"face":252,"flag":514,"nick":"南方","uin":328586066}, {"face":0,"flag":13107712,"nick":" ~~钼~~","uin":1492280827}]
		}
	}

    有的人不一定有mark name, 有没有mark name 取决于自己有没有设置他／她的mark name，即昵称
	"""

    def _fill_contact_list(self, contents):
        contents = contents['result']
        friends = contents['friends']
        marknames = contents['marknames']
        categories = contents['categories']
        info = contents['info']
        groups = {}
        for c in categories:
            groups[c['index']] = c['name']
            self._add_group(c['name'])
        #print groups
        nicknames = {}
        for markname in marknames:
            nicknames[str(markname['uin'])] = markname['markname']
        infos = {}
        uins  = []
        for i in info:
            infos[str(i['uin'])] = i['nick']
            uins.append(str(i['uin']))
        for i,friend in enumerate(friends):
            g = groups[friend['categories']]
            uin = str(friend['uin'])
            display_name = nicknames.get(uin, None)
            if display_name is None:
                display_name = infos.get(uin, "No Info")
            self._add_contact(uin, display_name, e3.status.OFFLINE, '', False)
            self._add_contact_to_group(uin, g)
        #self.session.contact_list_ready()

        #print "going to run Get_single_long_nick2"
        Get_single_long_nick2(self, self.session, uins).start()
        Get_avatars(self, self.session, uins).start()
        #print "launghed Get_single_long_nick2"

    def _add_contact(self, mail, nick, status_, alias, blocked, msg="..."):
        """
        method to add a contact to the contact list
        """
        self.session.contacts.contacts[mail] = e3.Contact(mail, mail,
            nick, msg, status_, alias, blocked)

    def get_group_name_list_mask2(self):
        '''s.web2.qq.com POST /api/get_group_name_list_mask2 HTTP/1.1
        Referer: http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=3
        {
            "retcode":0,
            "result":{
                "gmasklist":[
                    {"gid":1000,"mask":0},
                    {"gid":2574319507,"mask":0},
                    {"gid":763844360,"mask":0},
                    {"gid":968555405,"mask":1},
                    {"gid":2073672680,"mask":0},
                    {"gid":2534329316,"mask":0},
                    {"gid":3956930755,"mask":0},
                    {"gid":1509156903,"mask":0},
                    {"gid":1188247891,"mask":0}
                ],
                "gnamelist":[
                    {"flag":16777217,"name":"2010年扬帆瑞晟","gid":2534329316,"code":3960841336},
                    {"flag":17956865,"name":"汽车031","gid":1509156903,"code":548559759},
                    {"flag":16908289,"name":"港北初中2000","gid":3956930755,"code":4017542342},
                    {"flag":1,"name":"盐阜大地","gid":2073672680,"code":1512835309},
                    {"flag":1,"name":"03届伍中班","gid":1188247891,"code":3672561384},
                    {"flag":17826817,"name":"seu-auto-07","gid":763844360,"code":55435657},
                    {"flag":167773201,"name":"东大上海校友会超级群","gid":968555405,"code":2306800230},
                    {"flag":16777217,"name":"seu-老周实验室","gid":2574319507,"code":2732143650}
                ],
                "gmarklist":[]
            }
        }
        '''
        url = 'http://s.web2.qq.com/api/get_group_name_list_mask2'
        array = {"vfwebqq": self.vfwebqq }
        response = self.send_request(url, 'POST', array)
        print response
        # process response
        self.__get_group_name_list_mask2 = response = json_decode.JSONDecoder().decode(response)
        if response['retcode'] == 0:
            groups = response['result']['gnamelist']
            self.gs = {}
            for group in groups:
                self._add_group(group['name'])
                #self.session.group_add_succeed(group['name'])
                self.gs[group['name']] = str(group['code'])
                #self._add_contact("test@gmail.com", "test@gmail.com", e3.status.OFFLINE, '', False)
                #self._add_contact_to_group("test@gmail.com", group['name'])
                #self.session.contact_add_succeed("test@gmail.com")

    def get_group_info_ext2(self):
        """
        GET http://s.web2.qq.com/api/get_group_info_ext2?gcode=548559759&vfwebqq=XXXXX&t=TIMESTAMP
        Refer:  http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=1
        {
            "retcode":0,
            "result":{
                "stats":[
                    {"client_type":1,"uin":1614208798,"stat":10},
                    {"client_type":1,"uin":3760655361,"stat":30},
                    {"client_type":1,"uin":2533513671,"stat":10},
                    {"client_type":1,"uin":1627828918,"stat":30},
                    {"client_type":1,"uin":393457809,"stat":10}
                ],
                "minfo":[
                    {"nick":"迷墙上的砖","province":"","gender":"male","uin":3077092499,"country":"","city":""},
                    {"nick":"快了","province":"江苏","gender":"male","uin":2215122588,"country":"中国","city":"无锡"},
                    {"nick":"华华","province":"重庆","gender":"male","uin":1614208798,"country":"中国","city":"沙坪坝"},
                    {"nick":"六块钱™","province":"","gender":"unknown","uin":2724352837,"country":"","city":""},
                    {"nick":"三昧","province":"江苏","gender":"male","uin":3702981873,"country":"中国","city":"苏州"},
                    {"nick":"蔡浩","province":"江苏","gender":"male","uin":3030318252,"country":"中国","city":"苏州"},
                    {"nick":"xiaoy","province":"江苏","gender":"male","uin":3760655361,"country":"中国","city":"扬州"},
                    {"nick":"树袋","province":"江苏","gender":"male","uin":1347051889,"country":"中国","city":"苏州"},
                    {"nick":"事后诸葛","province":"江苏","gender":"male","uin":3596018326,"country":"中国","city":""},
                    {"nick":"owen","province":"江苏","gender":"male","uin":2533513671,"country":"中国","city":"泰州"},
                    {"nick":"庄明","province":"","gender":"male","uin":1627828918,"country":"伊拉克","city":""},
                    {"nick":"蓝色海洋","province":"广东","gender":"male","uin":393457809,"country":"中国","city":"广州"},
                    {"nick":"arrow","province":"江苏","gender":"male","uin":1029479865,"country":"中国","city":"南通"},
                    {"nick":"颜色","province":"江苏","gender":"male","uin":2451882775,"country":"中国","city":"南京"}
                ],
                "ginfo":{
                    "face":1,
                    "memo":"聚会时间确定在9月15日（周六），地点南京，人数统计好了就确定具体行程，报名联系我15995778262（不带家属）",
                    "class":10011,
                    "fingermemo":"",
                    "code":548559759,
                    "createtime":1119880120,
                    "flag":17956865,
                    "level":0,
                    "name":"汽车031",
                    "gid":1509156903,
                    "owner":3077092499,
                    "members":[
                        {"muin":3077092499,"mflag":4},
                        {"muin":2215122588,"mflag":128},
                        {"muin":1614208798,"mflag":128},
                        {"muin":2724352837,"mflag":77},
                        {"muin":3702981873,"mflag":69},
                        {"muin":3030318252,"mflag":192},
                        {"muin":3760655361,"mflag":136},
                        {"muin":1347051889,"mflag":64},
                        {"muin":3596018326,"mflag":4},
                        {"muin":1228003705,"mflag":4},
                        {"muin":2451882775,"mflag":136}
                    ],
                    "option":2
                },
                "cards":[
                    {"muin":3077092499,"card":"于皖东"},
                    {"muin":2215122588,"card":"丁浩"},
                    {"muin":1614208798,"card":"肖建华"},
                    {"muin":2724352837,"card":"陆缘"},
                    {"muin":3702981873,"card":"窦雯臻"},
                    {"muin":1228003705,"card":"解伟"},
                    {"muin":2451882775,"card":"杨国泉"}
                ],
                "vipinfo":[
                    {"vip_level":0,"u":3077092499,"is_vip":0},
                    {"vip_level":0,"u":2215122588,"is_vip":0},
                    {"vip_level":0,"u":1614208798,"is_vip":0}
                    {"vip_level":0,"u":2451882775,"is_vip":0}
                ]
            }
        }
        """
        URL = 'http://s.web2.qq.com/api/get_group_info_ext2?gcode=%s&vfwebqq=%s'
        gs = self.gs
        for gid in gs.values():
            url = URL % (gid, self.vfwebqq)
            print url
            response = self.send_request(url)
            print response
            # process response

    def get_msg_tip(self):
        # poll
        pass

    def send_buddy_msg(self, uid, message):
        pass

    def send_group_msg(self, gid, message):
        pass

    def _handle_action_logout(self):
        '''handle Action.ACTION_LOGOUT
        '''
        pass

    def _handle_action_move_to_group(self, account, src_gid, dest_gid):
        '''handle Action.ACTION_MOVE_TO_GROUP
        '''
        pass

    def _handle_action_remove_contact(self, account):
        '''handle Action.ACTION_REMOVE_CONTACT
        '''
        pass

    def _handle_action_reject_contact(self, account):
        '''handle Action.ACTION_REJECT_CONTACT
        '''
        pass

    def _handle_action_remove_from_group(self, account, gid):
        '''handle Action.ACTION_REMOVE_FROM_GROUP
        '''
        pass

    def _handle_action_remove_group(self, gid):
        '''handle Action.ACTION_REMOVE_GROUP
        '''
        pass

    def _handle_action_rename_group(self, gid, name):
        '''handle Action.ACTION_RENAME_GROUP
        '''
        pass

    def _handle_action_set_contact_alias(self, account, alias):
        '''handle Action.ACTION_SET_CONTACT_ALIAS
        '''
        pass

    def _handle_action_set_message(self, message):
        '''handle Action.ACTION_SET_MESSAGE
        '''
        pass

    def _handle_action_set_media(self, message):
        '''handle Action.ACTION_SET_MEDIA
        '''
        pass

    def _handle_action_set_nick(self, nick):
        '''handle Action.ACTION_SET_NICK
        '''
        pass

    def _handle_action_set_picture(self, picture_name):
        '''handle Action.ACTION_SET_PICTURE
        '''
        pass

    def _handle_action_new_conversation(self, account, cid):
        '''handle Action.ACTION_NEW_CONVERSATION
        '''
        print "New conversation account : %s, cid : %s" %(account, cid)
        self.conversations[account] = cid
        self.rconversations[cid] = [account]

    def _handle_action_close_conversation(self, cid):
        '''handle Action.ACTION_CLOSE_CONVERSATION
        '''
        if cid in self.rconversations:
            account = self.rconversations[cid][0]
            del self.conversations[account]
            del self.rconversations[cid]
        else:
            log.warning('conversation %s not found' % cid)

    def send_buddy_message(self, recipient, msg):
        self.send_seq +=1
        msg = "[\""+ msg +"\",[\"font\",{\"name\":\"宋体\",\"size\":\"10\",\"style\":[0,0,0],\"color\":\"000000\"}]]"
        #self.__headers.update({'Referer':'http://d.web2.qq.com/proxy.html?v=20110331002&callback=2'});

        url = 'http://d.web2.qq.com/channel/send_buddy_msg2'
        a = {'to':recipient, 'face':180,'content':msg,'msg_id':self.send_seq,'clientid':'85849142','psessionid':self.psessionid}
        array = {'r':json_encode.JSONEncoder().encode(a),'clientid':'85849142','psessionid':self.psessionid}
        str = self.send_request(url,'POST',array)
        print str

    def _handle_action_send_message(self, cid, msg):

        '''handle Action.ACTION_SEND_MESSAGE
        cid is the conversation id, message is a Message object
        POST https://d.web2.qq.com/channel/send_buddy_msg2

        {"to":4006651665,"face":252,"content":"[\"another
        message\\n\",[\"font\",{\"name\":\"宋体\",\"size\":\"10\",\"style\":[0,0,0],\"color\":\"000000\"}]]","msg_id":67520002,"clientid":"15752131","psessionid":"8368046764001e636f6e6e7365727665725f77656271714031302e3133332e34312e3230320000178f000003cd016e040050c69c0e6d0000000a4039724a42784b4f39566d0000002847e95539cb61da48a8193be558d3b05c5cca0e59d174165e9a9da2a6345e69d4635ae582ea6e10bc"}


        response
        {"retcode":0,"result":"ok"}
        '''

        print msg
        recipients = self.rconversations.get(cid, ())
        print "Message : " + msg.body
        print recipients
        for recipient in recipients:
            self.send_buddy_message(str(recipient), msg.body)
        #    if str(recipient) in self.res_manager.groups.keys():
        #        self.webqq_plugin.send_group_message( str(recipient), str(message.body))
        #    else:
        #        self.webqq_plugin.send_buddy_message( str(recipient), str(message.body))
        #    # log message
        #e3.Logger.log_message(self.session, recipients, message, True)
        #pass

    # p2p handlers

    def _handle_action_p2p_invite(self, cid, pid, dest, type_, identifier):
        '''handle Action.ACTION_P2P_INVITE,
         cid is the conversation id
         pid is the p2p session id, both are numbers that identify the
            conversation and the session respectively, time.time() is
            recommended to be used.
         dest is the destination account
         type_ is one of the e3.Transfer.TYPE_* constants
         identifier is the data that is needed to be sent for the invitation
        '''
        pass

    def _handle_action_p2p_accept(self, pid):
        '''handle Action.ACTION_P2P_ACCEPT'''
        pass

    def _handle_action_p2p_cancel(self, pid):
        '''handle Action.ACTION_P2P_CANCEL'''
        pass


class QQAccount(object):
	def __init__(self, name):
		self.name = name
	def set_group(self, group):
		self.group = group
	def set_nick_name(self, nick_name):
		self.nick_name = nick_name

class QQPoll(threading.Thread):
    def __init__(self, worker, session):
        threading.Thread.__init__(self)
        self.worker = worker
        self.session = session
        self.psessionid = worker.psessionid
        self.__headers = worker.get_http_headers()
        self.__rc = 0

    def send_request(self, url, method = 'GET', data = {}, save_cookie=False):
        if method.upper() == 'POST':
            data = urllib.urlencode(data)
            request = urllib2.Request(url, data, self.__headers)
        else:
            request = urllib2.Request(url, headers = self.__headers)
        response = urllib2.urlopen(request)
        return response.read()

    def run(self):
        # Because urllib2.open is blocked, so the task will not query the 
        # server heavily
        while True:
            headers = ({'Referer':'http://d.web2.qq.com/proxy.html?v=20110331002&callback=2'})
            url = 'http://d.web2.qq.com/channel/poll2'
            a = {'clientid': '85849142',
                'psessionid':self.psessionid,
                'key':0,
                'ids':[]}
            array = {'r':json_encode.JSONEncoder().encode(a),
                'clientid':'85849142',
                'psessionid':self.psessionid}
            self.__headers.update(headers)
            response = self.send_request(url, 'POST', array)
            print "in poll HTML: ", response
            response = json_decode.JSONDecoder().decode(response)

            #2327 4342:
            if response['retcode'] == 0:
                poll_type = response['result'][0]['poll_type']
                value = response['result'][0]['value']
                if poll_type == 'message':
                    self._received_message(value)
                elif poll_type == 'group_message':
                    self._received_message(value)
                elif poll_type == 'buddies_status_change':
                    self._on_status_change(value)
                    pass
                elif poll_type == 'nick_change':
                    pass
                elif poll_type == 'shake_message':
                    pass
                elif poll_type == 'sess_message':
                    pass
                elif poll_type == 'kick_message':
                    # XXX me is kicked out
                    self._received_kick_message(value)
                    pass
                elif poll_type == 'file_message':
                    # Receive a file transport message
                    pass
                elif poll_type == 'system_message':
                    # Tencent System message
                    pass
                elif poll_type == '':
                    '''
                    case "message":
                        f = f.value;
                        EQQ.Model.BuddyList.isUser(f.from_uin) ? this.receiveBuddyMsg(f) : f.msg_type === 9 ? this.receiveStrangerMsg(f) : (f.msg_type === 31 || f.msg_type === 140) && this.receiveGroupBuddyMsg(f);
                        break;
                    case "shake_message":
                        b.out("\u6536\u5230\u6296\u52a8\u6d88\u606f");
                        this.receiveShakeMsg(f.value);
                        break;
                    case "sess_message":
                        f = f.value;
                        this.receiveGroupBuddyMsg(f);
                        break;
                    case "group_message":
                        f = f.value;
                        this.addMessageBoxGroupList(f);
                        this.preloadGroupMessageImages(f);
                        this.receiveGroupMsg(f);
                        break;
                    case "kick_message":
                        b.out("\u8e22\u7ebf\u901a\u77e5\uff1a" + f.value);
                        var f = f.value,
                            h = "\u60a8\u7684\u5e10\u53f7\u5728\u53e6\u4e00\u5730\u70b9\u767b\u5f55\uff0c\u60a8\u5df2\u88ab\u8feb\u4e0b\u7ebf\u3002\u5982\u6709\u7591\u95ee\uff0c\u8bf7\u767b\u5f55:safe.qq.com\u4e86\u89e3\u66f4\u591a\u3002";
                        if (f.show_reason !== 0) h = f.reason;
                        c.notifyObservers(EQQ, "SelfOffline", {
                            message: h,
                            action: "none"
                        });
                        break;
                    case "file_message":
                        b.out("\u6587\u4ef6\u4fe1\u9053\u901a\u77e5" + f.value);
                        this.receiveFile(f.value);
                        break;
                    case "system_message":
                        b.out("\u6536\u5230\u7cfb\u7edf\u6d88\u606f" + f.value);
                        this.receiveSystemMsg(f.value);
                        c.notifyObservers(EQQ, "SystemMessageRecive", f.value);
                        break;
                    case "filesrv_transfer":
                        b.out("\u6587\u4ef6\u4f20\u8f93\u6d88\u606f" + f.value);
                        this.receiveTransferMsg(f.value);
                        break;
                    case "tips":
                        b.out("\u6536\u5230tips\u6d88\u606f" + f.value);
                        this.receiveTipsMsg(f.value);
                        break;
                    case "sys_g_msg":
                        b.out("\u6536\u5230\u7fa4\u7cfb\u7edf\u6d88\u606f" + f.value);
                        this.receiveSysGroupMsg(f.value);
                        break;
                    case "av_request":
                        b.out("\u6536\u5230\u89c6\u9891\u8bf7\u6c42" + f.value);
                        this.receiveVideoMsg(f.value);
                        break;
                    case "discu_message":
                        b.out("\u6536\u5230\u8ba8\u8bba\u7ec4\u6d88\u606f" + f.value);
                        this.receiveDiscuMsg(f.value);
                        break;
                    case "push_offfile":
                        b.out("\u6536\u5230\u79bb\u7ebf\u6587\u4ef6\u6d88\u606f" + f.value);
                        this.receiveOffFile(f.value);
                        break;
                    case "notify_offfile":
                        b.out("\u6536\u5230\u79bb\u7ebf\u6587\u4ef6\u5bf9\u65b9\u884c\u4e3a\u6d88\u606f" + f.value);
                        this.receiveNotifyOffFile(f.value);
                        break;
                    case "input_notify":
                        this.receiveInputNotify(f.value)
                    '''
                    pass

        
    def _received_message(self, data):
        '''
        handle the reception of a message
        {
            u'retcode': 0, 
            u'result': [
                {
                    u'poll_type': u'message', 
                    u'value': {
                                u'reply_ip': 176752493,
                                u'msg_type': 9, 
                                u'msg_id': 6914, 
                                u'content': [
                                                [u'font', {u'color': u'000000', u'style': [0, 0, 0], u'name': u'\u5b8b\u4f53', u'size': 9}], 
                                                u'fffffffffffff '
                                            ], 
                                u'msg_id2': 254516,
                                u'from_uin': 3570340234L, 
                                u'time': 1344656653, 
                                u'to_uin': 245155408
                    }
                }
            ]
        }
        '''
        from_uin = str(data['from_uin'])

        account = from_uin
        body = data['content'][-1]
        type_ = e3.Message.TYPE_MESSAGE

        if account in self.worker.conversations:
            cid = self.worker.conversations[account]
        else:
            cid = time.time()
            self.worker.conversations[account] = cid
            self.worker.rconversations[cid] = [account]
            self.session.conv_first_action(cid, [account])

        msgobj = e3.Message(type_, body, account)
        self.session.conv_message(cid, account, msgobj)

        # log message
        print 'log message'
        e3.Logger.log_message(self.session, None, msgobj, False)

    def _on_status_change(self, data):
        '''
        {"retcode":0,"result":[{"poll_type":"buddies_status_change","value":{"uin":1268665911,"status":"online","client_type":21}}]}
        '''
        print '_on_status_change'
        uin = str(data["uin"])
        status_ = data["status"]
        contact = self.session.contacts.contacts.get(uin, None)
        if contact == None:
            return
        account = uin
        old_status = contact.status
        stat = None
        try:
            stat = STATUS_MAP_REVERSE[status_]
        except:
            stat = e3.status.ONLINE
        contact.status = stat
        self.session.contact_attr_changed(account, 'status', old_status)

        acc = e3.Logger.Account(contact.cid,
                                None, contact.account, contact.status, contact.nick,
                                contact.message, contact.picture)
        self.session.log('status change', contact.status,
                         old_status, acc)

    def _received_kick_message(self, data):
        '''
        {
            "retcode":0,
            "result":[
                {
                    "poll_type":"kick_message",
                    "value":{
                        "way":"poll",
                        "show_reason":1,
                        "reason": " safe.qq.com \u4E86\u89E3\u66F4\u591A\u3002"
                    }
                }
            ]
        }
        '''
        self.session.disconnected(data['reason'])
        
        
    def __get_msg_tip_(self):
        """
            #也不知道是什么，反正一直请求
            @url:http://webqq.qq.com/web2/get_msg_tip?uin=&tp=1&id=0&retype=1&rc=64&lv=2&t=1315746772886
        """
        self.__headers.update({'Referer': 'http://webqq.qq.com/'})
        self.__rc += 1
        num = 100 + self.__rc
        t = '%s' % '%d' % time.time() + '%s' % num
        urlv = 'http://webqq.qq.com/web2/get_msg_tip?uin=&tp=1&id=0&retype=1&rc='+'%s'% self.__rc +'&lv=3&t=' + t
        self.__get_msg_tip = self.send_request(urlv)
        print(self.__get_msg_tip)


class Get_single_long_nick2(threading.Thread):
    def __init__(self, worker, session, uins):
        threading.Thread.__init__(self)
        self.worker = worker
        self.session = session
        self.uins = uins
        self.__headers = worker.get_http_headers()

    def send_request(self, url, method = 'GET', data = {}, save_cookie=False):
        if method.upper() == 'POST':
            data = urllib.urlencode(data)
            request = urllib2.Request(url, data, self.__headers)
        else:
            request = urllib2.Request(url, headers = self.__headers)
        response = urllib2.urlopen(request)
        return response.read()

    def get_single_long_nick2(self, uin=None):
        '''
        http://s.web2.qq.com/api/get_single_long_nick2?tuin=245155408&vfwebqq=eeee5c7a751dd5fef13a8c5b3b647c25ca6af14be1c7edbee27018733b81f51c889e8f2bf97efbff&t=1344673127901
        {"retcode":0,"result":[{"uin":245155408,"lnick":"海葵来袭。。。"}]}
        '''
        print 'get_single_long_nick2'
        if uin is None:
            uin = self.username
        url = 'http://s.web2.qq.com/api/get_single_long_nick2?tuin=%s&vfwebqq=%s' %(uin, self.worker.vfwebqq)
        response = self.send_request(url)

        # process response
        print response
        response = json_decode.JSONDecoder().decode(response)
        if response['retcode'] == 0:
            lnick = response['result'][0]['lnick']
        contact = self.session.contacts.contacts.get(uin, None)
        if contact == None:
            return
        account = uin
        contact.message = lnick
        self.session.contact_attr_changed(account, 'message', '')

        if contact.account  == self.session.account.account :
            me = self.session.contacts.me
            log_account =e3.Logger.Account(me.cid, None, me.account,
                                         me.status, lnick, me.message, me.picture)
            self.session.log('nick change', contact.status, lnick,
                             log_account)
            self.session.contacts.me.nick = lnick
            self.session.contacts.me.alias = lnick
            self.session.nick_change_succeed(lnick)

    def run(self):
        print "in Get_single_long_nick2 run"
        for uin in self.uins:
            self.get_single_long_nick2(uin)

class Get_avatars(threading.Thread):
    __headers = {
        #'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.9 Safari/534.30', 
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:14.0) Gecko/20100101 Firefox/14.0.1', 
        'Referer':'http://web.qq.com',
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
        #'Accept-Encoding': 'gzip, deflate',
        # later we can support gzip
        #'Connection': 'keep-alive',
        #'Content-Type': 'utf-8'
    }
    def __init__(self, worker, session, uins):
        threading.Thread.__init__(self)
        self.worker = worker
        self.session = session
        self.uins = uins

    def send_request(self, url, method = 'GET', data = {}, save_cookie=False):
        if method.upper() == 'POST':
            data = urllib.urlencode(data)
            request = urllib2.Request(url, data, self.__headers)
        else:
            request = urllib2.Request(url, headers = self.__headers)
        response = urllib2.urlopen(request)
        return response.read()

    '''
    1. 头像获取
    1.1 自己头像
    http://faceXX.qun.qq.com/cgi/svr/face/getface?cache=1&type=1&fid=0&uin=YYY＆vfwebqq=ZZZZZZZZZZZZZZZZZZZZZZZZZZ&t=TIMESTAMP
    1.2 群头像：
    http://faceXX.qun.qq.com/cgi/svr/face/getface?cache=0&type=4&fid=0&uin=YYY&vfwebqq=ZZZZZZZZZZZZZZZZZZZZZZ
    1.3 好友头像：
    http://faceXX.qun.qq.com/cgi/svr/face/getface?cache=0&type=1&fid=0&uin=YYY&vfwebqq=ZZZZZZZZZZZZZZZZZZZZZZ

    if 'last' in avatars:
        contact.picture = os.path.join(avatars.path, 'last')
    self.session.picture_change_succeed(self.session.account.account, 
    self.session.contacts.me.picture = avatar_path

    self.caches.get_avatar_cache

    self.caches = e3.cache.CacheManager(self.session.config_dir.base_dir)
    self.my_avatars = self.caches.get_avatar_cache(self.session.account.account)

    avatars = self.caches.get_avatar_cache(jid)
    contact.picture = os.path.join(avaters.path, 'last')

    avatars.insert_url

    new_path = self._avatar_cache.insert_url(avatar_url)[1] [0]: timestamp
    self._avatar_path = os.path.join(self._avatar_cache.path, new_path)

    '''
    def get_avatars(self):
        #AVATAR_URL_FOR_ME = 'http://face2.qun.qq.com/cgi/svr/face/getface?cache=1&type=1&fid=0&uin=%s&vfwebqq=%s'
        #url = AVATAR_URL_FOR_ME % (self.session.account.account, self.worker.vfwebqq)


        MAXHOSTS = 10
        URL = 'http://face%s.qun.qq.com/cgi/svr/face/getface?cache=0&type=1&fid=0&uin=%s&vfwebqq=%s'
        for i, uin in enumerate(self.uins):
            hostnum = (i % MAXHOSTS) + 1
            url = URL % (hostnum, uin, self.worker.vfwebqq)
            print url
            avatars_cache = self.worker.caches.get_avatar_cache(uin)
            new_path = avatars_cache.insert_url(url, self.retrieve)[1]
            avatar_path = os.path.join(avatars_cache.path, new_path)
            print avatar_path
            contact = self.session.contacts.contacts.get(uin, None)
            #contact.picture = os.path.join(avatar_path, 'last')
            contact.picture = avatar_path
            self.session.contact_attr_changed(uin, 'picture', '')
            if uin == self.session.account.account:
                self.session.picture_change_succeed(uin, avatar_path)

    def retrieve(self, url, save_path):
        request = urllib2.Request(url, headers = self.__headers)
        data = urllib2.urlopen(request)
        f = open(save_path, "wb")
        response = data.read()
        f.write(response)

    def run(self):
        print "in Get_avatars run"
        self.get_avatars()
