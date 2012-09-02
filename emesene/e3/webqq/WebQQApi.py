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

'''
send GET/POST HTTP request to Tencent server
'''

import cookielib
import hashlib
import urllib
import urllib2
import json.encoder as json_encode
import json.decoder as json_decode
import threading
import os
import sys
import time

import e3
import logging
from MultiPartForm import *

log = logging.getLogger('WebQQ.WebQQApi')

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
STATUS_MAP[e3.status.OFFLINE] = 'hidden'

STATUS_MAP_REVERSE = {}
STATUS_MAP_REVERSE['busy'] = e3.status.BUSY
STATUS_MAP_REVERSE['away'] = e3.status.AWAY
STATUS_MAP_REVERSE['silent'] = e3.status.IDLE
STATUS_MAP_REVERSE['online'] = e3.status.ONLINE
STATUS_MAP_REVERSE['hidden'] = e3.status.OFFLINE
STATUS_MAP_REVERSE['offline'] = e3.status.OFFLINE

class WebQQApi(object):
    __headers = {
        #'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.9 Safari/534.30',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:14.0) Gecko/20100101 Firefox/14.0.1',
        #'Referer':'http://ui.ptlogin2.qq.com/cgi-bin/login?target=self&style=5&mibao_css=m_webqq&appid=1003903&enable_qlogin=0&no_verifyimg=1&s_url=http%3A%2F%2Fwebqq.qq.com%2Floginproxy.html&f_url=loginerroralert&strong_login=1&login_state=10&t=20110909003',
        #'Referer':'http://ui.ptlogin2.qq.com/cgi-bin/login?target=self&style=5&mibao_css=m_webqq&appid=1003903&enable_qlogin=0&no_verifyimg=1&s_url=http%3A%2F%2Fweb.qq.com%2Floginproxy.html&f_url=loginerroralert&strong_login=1&login_state=10&t=20120619001',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
        #'Accept-Encoding': 'gzip, deflate',
        # later we can support gzip
        #'Connection': 'keep-alive',
        #'Content-Type': 'utf-8'
    }
    TIMEOUT = 120
    CLIENTID = '85849142'
    APPID = '1003903' # Tencent QQ
    MAXHOSTS = 10
    __hostnum = 0
    send_seq = 12345
    __fileid = 0
    ''' Tencent WebQQ servers'''
    __servers = {
        'MAIN_DOMAIN': "qq.com",
        #'EQQ_SERVER_URL': "http://" + u + "/",
        'CONN_SERVER_DOMAIN': "http://d.web2.qq.com/",
        'CONN_SERVER_DOMAINS': ["http://d.web2.qq.com/"],
        'CONN_PROXY_URLS': ["http://d.web2.qq.com/proxy.html?v=20110331002"],
        #'CONN_SERVER_DOMAIN2': "http://" + u + "/",
        'CONN_PROXY_URL': "http://d.web2.qq.com/proxy.html?v=20110331002",
        #'CHAT_PIC_SERVER': "http://" + u + "/",
        'AVATAR_SERVER_DOMAIN': "http://qun.qq.com/",
        'AVATAR_SERVER_DOMAINS': ["http://face1.qun.qq.com/",
            "http://face2.qun.qq.com/",
            "http://face3.qun.qq.com/",
            "http://face4.qun.qq.com/",
            "http://face5.qun.qq.com/",
            "http://face6.qun.qq.com/",
            "http://face7.qun.qq.com/",
            "http://face8.qun.qq.com/",
            "http://face9.qun.qq.com/",
            "http://face10.qun.qq.com/",
            "http://face11.qun.qq.com/"],
        'SYSTEM_FACE_URL': "http://0.web.qstatic.com/webqqpic/style/face/",
        'LOGIN_PROTECT_FINISH_URL': "./login_protect.html",
        'UPLOAD_CUSTOM_FACE_SERVER': "http://up.web2.qq.com/cgi-bin/cface_upload",
        'DOWNLOAD_CHAT_LOG_SERVER': "http://sns.qq.com/buddy_state/feed/save_chat.php",
        'FILE_SERVER': "http://file1.web.qq.com/",
        'OFFLINE_FILE_SERVER': "http://weboffline.ftn.qq.com:80/ftn_access/",
        'QZONE_SERVER_DOMAIN': "http://qzone.qq.com/",
        'QZONE_USER_SERVER_DOMAIN': "http://user.qzone.qq.com/",
        'QQ_GROUP_URL': "http://qun.qq.com/air/",
    }

    def __init__(self, cookiefile):
        self.cookiefile = cookiefile
        self.cookiejar = cookielib.MozillaCookieJar(cookiefile)
        # XXX: 加载已存在的cookie，尝试此cookie是否还有效
        try:
            self.cookiejar.load(ignore_discard=True, ignore_expires=True)
        except Exception, e:
            # 加载失败，说明从未登录过，需创建一个cookie
            self.cookiejar.save(self.cookiefile, ignore_discard=True, ignore_expires=True)
        self.opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(self.cookiejar))

    def send_request(self, url, method='GET', data={}, headers=__headers, savecookie=False,
            timeout_=120):
        try:
            str = '{}'
            if method.upper() == 'POST':
                #data = urllib.unquote(data).encode('utf-8')
                data = urllib.urlencode(data)
                request = urllib2.Request(url, data, headers)
            else:
                request = urllib2.Request(url, headers=headers)
            u = self.opener.open(request, timeout=timeout_)
            response = u.read()
            #try:
            #    str = response.decode('utf-8')
            #except UnicodeDecodeError as e:
            #    str = response

            if savecookie:
                self.cookiejar.save(ignore_discard=True, ignore_expires=True)
            u.close()
            #return str
            return response
        except Exception as e:
            return ''

    '''
    start password generation
    '''
    def _md5hash(self, str):
        return hashlib.md5(str).digest()

    """进行md5加密，并输出16进制值"""
    def _hex_md5hash(self, str):
        return hashlib.md5(str).hexdigest().upper()

    """
    由于提取的验证码2为文本字符串，因此要把文本字符串转换成原始的字符串。
    本函数先把\x00\x00\x00\x00\x95\x22\xea\x8a切片成list如['00','00','00','00','95','22','ea','8a'],
    然后遍历这个list，对每个字符串进行转换，转换成16进制的数字，
    最后使用chr函数，把16进制的数字转换成原始字符，并合并
    """
    def _hexchar2bin(self, uin):
        uin_final = ''
        uin = uin.split('\\x')
        print uin
        for i in uin[1:]:
            uin_final += chr(int(i, 16))
        return uin_final

    def _get_password(self, password, verifyCode1, verifyCode2):
        """
        根据明文密码计算出加密后的密码, 从抓包来看，verifyCode2是一样的
        """
        password_1 = self._md5hash(password) #第一步，计算出来原始密码的MD5值，输出二进制
        password_2 = self._hex_md5hash(password_1 + self._hexchar2bin(verifyCode2)) #第二步，合并(拼接)第二步产生的bin值与验证码2的bin值，并进行md5加密，输出32位的16进制
        password_final = self._hex_md5hash(password_2 + verifyCode1.upper()) #第三步，合并(拼接)第二步产生的16进制值与验证码1，并进行md5加密，输出32位的16进制值
        #log.debug(password_final)
        print password_final
        return password_final

    def _find_cookie(self, name):
        for cookie in self.cookiejar:
            if cookie.name == name:
                return cookie.value
        return ""

    def quit(self):
        # FIXME: implement it
        pass

    def request_login(self, username, password):
        '''
        @method: GET
        @url: http://check.ptlogin2.qq.com/check?uin=1907274033&appid=1003903&r=0.9123782307560073
        @Referer: http://ui.ptlogin2.qq.com/cgi-bin/login?target=self&style=5&mibao_css=m_webqq&appid=1003903&enable_qlogin=0&no_verifyimg=1&s_url=http%3A%2F%2Fweb.qq.com%2Floginproxy.html&f_url=loginerroralert&strong_login=1&login_state=10&t=20120619001
        @return: True if user don't need to input verify code, False
        '''
        self.username = username
        self.password = password
        verifyURL = 'http://check.ptlogin2.qq.com/check?uin=%s&appid=%s&r=0.9123782307560073' %(self.username, self.APPID)
        headers = self.__headers.copy()
        headers.update(({'Referer':
            'http://ui.ptlogin2.qq.com/cgi-bin/login?target=self&style=5&mibao_css=m_webqq&appid=1003903&enable_qlogin=0&no_verifyimg=1&s_url=http%3A%2F%2Fweb.qq.com%2Floginproxy.html&f_url=loginerroralert&strong_login=1&login_state=10&t=20120619001'}))
        data = self.send_request(verifyURL, headers=headers, savecookie=True)
        content = data.split(',')
        print content
        self.verifyCode1 = content[1][1:-1]
        print "verifyCode1", self.verifyCode1
        self.verifyCode2 = content[2].split("'")[1]
        if len(self.verifyCode1) > 4:
            return False
        return True

    def login(self, status='hidden', verifycode=None):
        '''
        @method: GET
        @url: http://ptlogin2.qq.com/login?u=1907274033&p=499213A9E88A7CADC01610B4C1372E6B&verifycode=!ISB&webqq_type=10&remember_uin=1&login2qq=1&aid=1003903&u1=http%3A%2F%2Fweb.qq.com%2Floginproxy.html%3Flogin2qq%3D1%26webqq_type%3D10&h=1&ptredirect=0&ptlang=2052&from_ui=1&pttype=1&dumy=&fp=loginerroralert&action=2-17-7617&mibao_css=m_webqq&t=1&g=1
        @Referer: None
        '''
        if verifycode is not None:
            self.verifyCode1 = verifycode
        self.status = 'hidden'
        loginURL = "http://ptlogin2.qq.com/login?u={0:s}&p={1:s}&verifycode={2:s}&webqq_type={3:s}&remember_uin=1&login2qq=1&aid=1003903&u1=http%3A%2F%2Fweb.qq.com%2Floginproxy.html%3Flogin2qq%3D1%26webqq_type%3D10&h=1&ptredirect=0&ptlang=2052&from_ui=1&pttype=1&dumy=&fp=loginerroralert&action=2-17-7617&mibao_css=m_webqq&t=1&g=1".format(self.username, self._get_password(self.password, self.verifyCode1, self.verifyCode2), self.verifyCode1, self.status)
        data = self.send_request(loginURL)
        return data

    def get_verify_code_url(self, username):
        '''
        verifyImageURL = "http://captcha.qq.com/getimage?aid=1002101&r=0.1314827858518941&uin=%s&vc_type=%s"
        '''
        verifyImageURL = "http://captcha.qq.com/getimage?aid=1002101&r=0.1314827858518941&uin=%s&vc_type=%s"
        return verifyImageURL % (self.username, self.verifyCode1)

    def login2(self):
        '''
        @method: POST
        @url: http://d.web2.qq.com/channel/login2
        @Referer: https://d.web2.qq.com/cfproxy.html?v=20110331002&callback=1
        @Returns: True if login2 OK, False if not
        '''
        login2URL = "http://d.web2.qq.com/channel/login2"
        a = {'status': 'hidden',    #隐身
            'ptwebqq': self._find_cookie("ptwebqq"),
            'passwd_sig': '',
            'clientid': self.CLIENTID,
            'psessionid': 'null'}
        #print "login2: ", a
        array = {'r': json_encode.JSONEncoder().encode(a),
            'clientid': self.CLIENTID,
            'psessionid': 'null'}
        headers = self.__headers.copy()
        headers.update(({'Referer': 'https://d.web2.qq.com/cfproxy.html?v=20110331002&callback=1'}))
        response = self.send_request(login2URL, 'POST', array, headers=headers)

        print "HTML response of login2: ", response
        response = json_decode.JSONDecoder().decode(response)
        #print response
        if response['retcode'] == 0:
            # remember the psessionid and vfwebqq, other operation needs them
            self.psessionid = response['result']['psessionid']
            self.vfwebqq = response['result']['vfwebqq']
            self.skey = self._find_cookie('skey')
            self.cookiejar.save(self.cookiefile, ignore_discard=True, ignore_expires=True)
            return True
        return False

    def _get_timestamp(self):
        return '%d' % time.time()

    def get_friend_info2(self, uin=None):
        ''' URL OK
        GET
        @url: http://s.web2.qq.com/api/get_friend_info2?tuin=3397969651&verifysession=&code=&vfwebqq=xxx&t=1345386140606
        @Referer: http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=1
        获取好友信息，如QQ号，出生日期等。
        '''
        if uin is None:
            uin = self.username
        headers = self.__headers.copy()
        headers.update(({'Referer':
            'http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=1'}))
        url = "http://s.web2.qq.com/api/get_friend_info2?tuin={0:s}&verifysession=&code=&vfwebqq={1:s}&t=%d".format(uin,
                self.vfwebqq, self._get_timestamp)
        response = self.send_request(url, headers=headers)
        print "HTML response", response
        return response
        #response = json_decode.JSONDecoder().decode(response)
        #print response
        #if response['retcode'] == 0:
        #    nick_name = response['result']['nick']
        #    self.session.profile_get_succeed(nick_name, '')

    def get_user_friends2(self):    #获取好友
        '''
        POST
        @url: http://s.web2.qq.com/api/get_user_friends2
        @Referer: http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=1
        '''
        headers = self.__headers.copy()
        headers.update(({'Referer':
            'http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=1'}))
        url = "http://s.web2.qq.com/api/get_user_friends2"
        a = {'h': 'hello',
            'vfwebqq':self.vfwebqq}
        array = {'r': json_encode.JSONEncoder().encode(a) }
        response = self.send_request(url, 'POST', array, headers=headers)
        return response


    def get_online_buddies2(self):
        '''获取在线好友 URL OK 4
        @url: https://d.web2.qq.com/channel/get_online_buddies2?clientid=19158976&psessionid=xxxx
        @Referer: https://d.web2.qq.com/cfproxy.html?v=20110331002&callback=1
        '''
        url = 'http://d.web2.qq.com/channel/get_online_buddies2?clientid=%s&psessionid=%s' % (self.CLIENTID, self.psessionid)
        headers = self.__headers.copy()
        headers.update(({'Referer':
            'https://d.web2.qq.com/cfproxy.html?v=20110331002&callback=1'}))
        response = self.send_request(url, headers=headers)
        return response

    def get_single_long_nick2(self, uin):
        ''' URL OK 3
        获取心情之类
        GET
        @url: http://s.web2.qq.com/api/get_single_long_nick2?tuin=1907274033&vfwebqq=74630f51c0e5a33e5d87b4ac1af4e039e8430c17ed0a5cbdd486f6029a87ae416618fe2769237b5e&t=1345384160123
        @Referer: http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=1
        {"retcode":0,"result":[{"uin":245155408,"lnick":"海葵来袭。。。"}]}
        '''
        headers = self.__headers.copy()
        headers.update(({'Referer':
            'http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=1'}))
        url = 'http://s.web2.qq.com/api/get_single_long_nick2?tuin=%s&vfwebqq=%s&t=%s' %(uin,
                self.vfwebqq, self._get_timestamp())
        response = self.send_request(url, headers=headers)
        return response

    def get_qq_num(self, tuin, type=4):
        ''' URL OK
        get qq num by uin
        @url:http://s.web2.qq.com/api/get_friend_uin2?tuin=3829192369&verifysession=&type=4&code=&vfwebqq=0102567&t=1321433563257  #群
        @url:http://s.web2.qq.com/api/get_friend_uin2?tuin=1993816635&verifysession=&type=1&code=&vfwebqq=0102567&t=1321433748003  #qq
        @Referer: http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=1
        '''
        headers = self.__headers.copy()
        headers.update(({'Referer':
            'http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=1'}))
        url = 'http://s.web2.qq.com/api/get_friend_uin2?tuin=%s&verifysession=&type=%s&code=&vfwebqq=%s&t=%s' % (tuin, type,
                self.vfwebqq, self._get_timestamp())
        response = self.send_request(url, headers=headers)
        return response

    def poll2(self):
        ''' URL OK
        POST
        @url: https://d.web2.qq.com/channel/poll2
        @Referer: https://d.web2.qq.com/cfproxy.html?v=20110331002&callback=1
        '''
        headers = self.__headers.copy()
        headers.update(({'Referer':
            'https://d.web2.qq.com/cfproxy.html?v=20110331002&callback=1'}))
        url = 'http://d.web2.qq.com/channel/poll2'
        a = {'clientid': self.CLIENTID,
            'psessionid': self.psessionid,
            'key': 0,
            'ids': []}
        array = {'r': json_encode.JSONEncoder().encode(a),
            'clientid': self.CLIENTID,
            'psessionid': self.psessionid}
        response = self.send_request(url, 'POST', array, headers=headers, timeout_=600)
        return response

    def get_avatar(self, uin, avatar_cache):
        ''' URL OK
        @url: http://face2.qun.qq.com/cgi/svr/face/getface?cache=0&type=1&fid=0&uin=3087014331&vfwebqq=74630f51c0e5a33e5d87b4ac1af4e039e8430c17ed0a5cbdd486f6029a87ae416618fe2769237b5e
        @Referer: http://web.qq.com/
        '''
        URL = 'http://face%s.qun.qq.com/cgi/svr/face/getface?cache=0&type=1&fid=0&uin=%s&vfwebqq=%s'
        self.__hostnum = ((self.__hostnum + 1) % self.MAXHOSTS) + 1
        headers = self.__headers.copy()
        headers.update(({'Referer':
            'http://web.qq.com'}))
        url = URL % (self.__hostnum, uin, self.vfwebqq)
        if avatar_cache is None:
            print 'FIXME: avatar_cache is None'
        try:
            new_path = avatar_cache.insert_url(url, self._retrieve)[1]
            avatar_path = os.path.join(avatar_cache.path, new_path)
            return avatar_path
        except Exception as e:
            return ''

    def _retrieve(self, url, save_path):
        headers = self.__headers.copy()
        headers.update(({'Referer':
            'http://web.qq.com'}))
        
        request = urllib2.Request(url, headers=headers)
        u = self.opener.open(request)
        response = u.read()
        f = open(save_path, "wb")
        f.write(response)

    def get_self_avatar(self):
        #AVATAR_URL_FOR_ME = 'http://face2.qun.qq.com/cgi/svr/face/getface?cache=1&type=1&fid=0&uin=%s&vfwebqq=%s'
        #url = AVATAR_URL_FOR_ME % (self.session.account.account, self.worker.vfwebqq)
        URL = 'http://face2.qun.qq.com/cgi/svr/face/getface?cache=0&type=1&fid=0&uin=%s&vfwebqq=%s'
        url = URL % (self.username, self.vfwebqq)
        qqnum = self.username
        avatars_cache = self.caches.get_avatar_cache(qqnum)
        new_path = avatars_cache.insert_url(url, self._retrieve)[1]
        return new_path

    def send_buddy_msg2(self, uin, msg):
        '''
        POST
        @url: https://d.web2.qq.com/channel/send_buddy_msg2
        @Referer: 	https://d.web2.qq.com/cfproxy.html?v=20110331002&callback=1
        @POST Data
        { "to":4006651665,
          "face":252,
          "content":"[
              \"another message\\n\", 
              [\"font\",{\"name\":\"宋体\",\"size\":\"10\",\"style\":[0,0,0],\"color\":\"000000\"}]
          ]",
          "msg_id":67520002,
          "clientid":"15752131",
          "psessionid":"xxxx"
        }

        @Return
        {"retcode":0,"result":"ok"}
        '''
        headers = self.__headers.copy()
        headers.update(({'Referer':
            'https://d.web2.qq.com/cfproxy.html?v=20110331002&callback=1'}))
        url = 'http://d.web2.qq.com/channel/send_buddy_msg2'
        self.send_seq = self.send_seq + 1
        a = {'to': uin, 'face': 180, 'content': msg, 'msg_id': self.send_seq, 'clientid': self.CLIENTID, 'psessionid': self.psessionid}
        array = {'r':json_encode.JSONEncoder().encode(a),'clientid': self.CLIENTID, 'psessionid':self.psessionid}
        print array
        str = self.send_request(url, 'POST', array, headers=headers)
        return str

    def send_group_message(self):
        '''
        send_group_msg_url = "http://d.web2.qq.com/channel/send_qun_msg2"
        '''
        pass



    def get_group_info_ext2(self):
        ''' URL OK
        @url: http://s.web2.qq.com/api/get_group_info_ext2?gcode=1372666207&vfwebqq=xxx&t=1345386795420
        @Referer: http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=1
        '''
        pass

    def get_group_name_list_mask2(self):
        ''' URL OK 2
        获取群列表
        POST
        @url: http://s.web2.qq.com/api/get_group_name_list_mask2
        @Referer: http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=1
        '''
        pass
    def get_qq_level(self, tuin=None):
        ''' URL OK
        GET
        @url: http://s.web2.qq.com/api/get_qq_level2?tuin=1907274033&vfwebqq=cc90a34f829f63d7340a2a988955712f0222f4130f7f4ea72bdd5701a61f6875d25a8f1d283f9d36&t=1345385466941
        @Referer: http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=1
        '''
        pass
    def get_msg_tip(self):
        ''' URL OK
        GET
        @url: http://web.qq.com/web2/get_msg_tip?uin=&tp=1&id=0&retype=1&rc=16&lv=3&t=1345385165192
        @Referer: http://web.qq.com/
        '''
        pass
    def get_recent_list2(self):
        ''' URL OK
        GET
        @url: https://d.web2.qq.com/channel/change_status2?newstatus=hidden&clientid=96703193&psessionid=xxx&t=1345387043410
        @Referer: https://d.web2.qq.com/cfproxy.html?v=20110331002&callback=1
        '''
        pass

    def change_status(self, status):
        ''' URL OK
        change the user status
        @url: https://d.web2.qq.com/channel/change_status2?newstatus=hidden&clientid=19158976&psessionid=xxxx&t=1345385874242
        @Referer: https://d.web2.qq.com/cfproxy.html?v=20110331002&callback=1
        '''
        # FIXME
        #contact = self.session.contacts.me
        stat = STATUS_MAP[status]
        # XXX: set QQ status via HTTP
        url = 'http://d.web2.qq.com/channel/change_status2?newstatus=%s&clientid=85849142&psessionid=%s' %(stat, self.psessionid)

    def _get_fileid(self):
        self.__fileid += 1
        return self.__fileid

    def upload_offline_pic(self, peeruin, filename, filepath):
        '''
        @url: http://weboffline.ftn.qq.com/ftn_access/upload_offline_pic?time=1346325152232
        @Referer: http://web.qq.com/
        userSendPicFrom: 
            <input name="callback" type="hidden" value="parent.EQQ.Model.ChatMsg.callbackSendPic">
            <input name="locallangid" type="hidden" value="2052">
            <input name="clientversion" type="hidden" value="1409">
            <input name="uin" type="hidden" value="<%=uin%>">
            <input name="skey" type="hidden" value="@325fz2vag">
            <input name="appid" type="hidden" value="1002101">
            <input name="peeruin" type="hidden" value="593023668">
            <input id="offline_pic_<%=uin%>" class="f" name="file" type="file">
            <input name="fileid" type="hidden" value="">
            <input name="vfwebqq" type="hidden" value="">
            <input name="senderviplevel" type="hidden" value="">
            <input name="reciverviplevel" type="hidden" value="">
        groupSendPicFrom: 
            <input id="from_<%=gid%>" name="from" value="control" type="hidden">
            <input name="f" type="hidden" value="EQQ.Model.ChatMsg.callbackSendPicGroup">
            <input name="vfwebqq" type="hidden" value="@325fz2vag">
            <input id="custom_face_<%=gid%>" class="f" name="custom_face" type="file">
            <input name="fileid" type="hidden" value="">'
        '''
        url = 'http://weboffline.ftn.qq.com/ftn_access/upload_offline_pic?time=%s' % self._get_timestamp()
        form = MultiPartForm()
        form.add_field('callback', 'parent.EQQ.Model.ChatMsg.callbackSendPic')
        form.add_field('locallangid', '2052')
        form.add_field('clientversion', '1409')
        form.add_field('uin', self.username)
        form.add_field('skey', self.skey)
        form.add_field('appid', '1002101')
        form.add_field('peeruin', peeruin)
        form.add_field('fileid', self._get_fileid())
        
        # Add a fake file
        form.add_file('file', filename, fileHandle=file(filepath))

        # Build the request
        request = urllib2.Request(url)
        request.add_header('User-agent', 'PyMOTW (http://www.doughellmann.com/PyMOTW/)')
        body = str(form)
        request.add_header('Content-type', form.get_content_type())
        request.add_header('Content-length', len(body))
        request.add_data(body)
        pass

    def get_session_signature(self):
        '''
        @url: channel/get_c2cmsg_sig2
        '''
        pass


    def get_custom_face_list(self):
        '''
        @url: CONN_SERVER_DOMAIN2/cgi-bin/webqq_app/?cmd=1?t=getTime()&vfwebqq=xxx
        @Referer: http://web.qq.com/
        @return: var custom_face={"ret":"0",data:[["1CF34E3B3DC7616A51E3CEF5B646616B.JPG",
        1346152148,85817],["55706AB280FFE5DF5B7ED81371643BDD.GIF",
        1346152327,5420],["E74E01F1349F59EFA8E93BAD02D27285.JPG", 1346388951,85337]]};
        '''
        pass

    def delete_custom_face(self, img):
        '''
        @url: http://web.qq.com/cgi-bin/webqq_app/?cmd=12&bd=xxx.GIF&vfwebqq=xxx
        @Referer: http://web.qq.com/
        @Return: var cface_delete_result={"ret":"0"}
        '''
        pass

    def get_group_constom_face_key(self):
        '''
        @url: channel/get_gface_sig2
        '''
        pass

    def get_group_constom_face_info(self):
        '''
        @url: channel/send_qun_msg2
        '''
        pass
    
    def get_offline_picture_url(self, file_path):
        '''
        @url: http://d.web2.qq.com/channel/apply_offline_pic_dl2?f_uin=1907274033&file_path=%2Fc1519186-f9f8-4096-835e-0613915f3f85&clientid=7194101&psessionid=xxxx&t=1346387195751
        '''
        pass


    def get_offline_picture(self, file_path, uin, files_cache):
        '''
        @url: http://d.web2.qq.com/channel/get_offpic2?file_path=%2F5870db5a-9658-4cfe-a4b0-ae4cb2e2d2c5&f_uin=961617117&clientid=34943817&psessionid=xxxx
        '''
        # Dummy file
        url = 'http://d.web2.qq.com/channel/get_offpic2?file_path=%s&f_uin=%s&clientid=%s&psessionid=%s' \
                %( file_path, uin, self.CLIENTID, self.psessionid)
        print url
        try:
            new_path = files_cache.insert_url(url, self._retrieve)[1]
            file_path = os.path.join(files_cache.path, new_path)
            print file_path
            return file_path
        except Exception as e:
            print 'get_custom_face failed: ', e
            return ''
        #return os.path.join(os.getcwd(), 'data', 'pixmaps', 'emesene.png')

    def get_custom_face(self, picture, msg_id, uin, files_cache):
        '''
        @url:
        http://d.web2.qq.com/channel/get_cface2?lcid=7062&guid=55706AB280FFE5DF5B7ED81371643BDD.GIF&to=961617117&count=5&time=1&clientid=34943817&psessionid=xxx
        '''
        def _retrieve(url, save_path):
            headers = self.__headers.copy()
            headers.update(({'Referer': 'http://web.qq.com',
                'Accept': 'image/png,image/*;q=0.8,*/*;q=0.5',
                'Accept-Encoding': 'gzip, deflate'}))
            
            request = urllib2.Request(url, headers=headers)
            u = self.opener.open(request)
            response = u.read()
            f = open(save_path, "wb")
            f.write(response)
        url = 'http://d.web2.qq.com/channel/get_cface2?lcid=%s&guid=%s&to=%s&count=5&time=1&clientid=%s&psessionid=%s'  \
                % (msg_id, picture, uin, self.CLIENTID, self.psessionid)
        print url
        try:
            new_path = files_cache.insert_url(url, _retrieve)[1]
            file_path = os.path.join(files_cache.path, new_path)
            print file_path
            return file_path
        except Exception as e:
            print 'get_custom_face failed: ', e
            return ''
        print url
        # Dummy file
        #return os.path.join(os.getcwd(), 'data', 'pixmaps', 'emesene.png')

    def send_shake(self, to_uin):
        '''
        @url: http://d.web2.qq.com/channel/shake2?to_uin=590641642&clientid=71863696&psessionid=xxx&t=1346527893011
        @Referer: http://d.web2.qq.com/proxy.html?v=20110331002&callback=1&id=3
        '''
        headers = self.__headers.copy()
        headers.update(({'Referer':
            'http://d.web2.qq.com/proxy.html?v=20110331002&callback=1&id=3'}))
        url = 'http://d.web2.qq.com/channel/shake2?to_uin=%s&clientid=%s&psessionid=%s&t=%s' % (to_uin, self.CLIENTID, self.psessionid, self._get_timestamp())
        response = self.send_request(url, headers=headers)
        return response

