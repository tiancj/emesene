#! /usr/bin/env python
# -*- coding: utf-8 -*-

import hashlib
import urllib
import urllib2
import cookielib
import os
import json.encoder as json_encode
import json.decoder as json_decode
import threading

class WebQQ:


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
        'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.9 Safari/534.30',\
        'Referer':'http://ui.ptlogin2.qq.com/cgi-bin/login?target=self&style=5&mibao_css=m_webqq&appid=1003903&enable_qlogin=0&no_verifyimg=1&s_url=http%3A%2F%2Fwebqq.qq.com%2Floginproxy.html&f_url=loginerroralert&strong_login=1&login_state=10&t=20110909003'\
    }    
    def __init__(self, username, password):
        self.username = username
        self.password = password

        # TODO: pls set different cookie path for each QQ account
        self.cookiefile = "/tmp/cookie" + self.username + ".txt"
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
        根据明文密码计算出加密后的密码
        """
        password_1 = self.md5hash(password) #第一步，计算出来原始密码的MD5值，输出二进制
        password_2 = self.hex_md5hash(password_1 + self.hexchar2bin(verifyCode2)) #第二步，合并(拼接)第二步产生的bin值与验证码2的bin值，并进行md5加密，输出32位的16进制
        password_final = self.hex_md5hash(password_2 + verifyCode1.upper()) #第三步，合并(拼接)第二步产生的16进制值与验证码1，并进行md5加密，输出32位的16进制值
        print password_final
        return password_final

    def find_cookie(self, name):
        for cookie in self.cookiejar:
            if cookie.name == name:
                return cookie.value
        return ""

    def send_request(self, url, headers = {}, method = 'GET', data = {}, save_cookie=False):
        if method.upper() == 'POST':
            data = urllib.urlencode(data)
            request = urllib2.Request(url, data, headers)
        else:
            request = urllib2.Request(url, headers = headers)
        response = urllib2.urlopen(request)
        return response

    
    def login(self):
        # XXX: 加载已存在的cookie，尝试此cookie是否还有效
        try:
            self.cookiejar.load(ignore_discard=True, ignore_expires=True)
        except Exception, e:
            # 加载失败，说明从未登录过，需创建一个cookie
            self.cookiejar.save(self.cookiefile, ignore_discard=True, ignore_expires=True)

        request = urllib2.Request(self.verifyURL % self.username)
        response = urllib2.urlopen(request)
        """
        对response的文本进行提取，第一步拆分成
        ["ptui_checkVC('0'", "'!YQL'", "'\\x00\\x00\\x00\\x00\\x95\\x22\\xea\\x8a');"]
        """
        data = response.read()
        print "data is ", data
        content = data.split(',')
        print content
        verifyCode1 = content[1][1:-1]
        print "verifyCode1", verifyCode1
        verifyCode2 = content[2].split("'")[1]
        print "verifyCode2", verifyCode2

        if len(verifyCode1) > 4:
            print self.verifyImageURL % (self.username, verifyCode1)
            verifyCode1 = raw_input("Enter verify code: ")
        print self.loginURL
        #loginurl = self.loginURL % (self.username, self.get_password(self.password, verifyCode1, verifyCode2), verifyCode1, "10")
        loginurl = self.loginURL.format(self.username, self.get_password(self.password, verifyCode1, verifyCode2), verifyCode1, "10")
        print loginurl

        req = urllib2.Request(loginurl)
        req.add_header('Referer', "http://t.qq.com/")
        conn = urllib2.urlopen(req)
        print conn.read()

        self.cookiejar.save(self.cookiefile, ignore_discard=True, ignore_expires=True)
        for cookie in self.cookiejar:
            print ("%s -> %s" %(cookie.name, cookie.value))
        print self.find_cookie("ptwebqq")

        self.login2()

    def login2(self):
        # 执行第二步login
        a = {
            'status': 'hidden',
            'ptwebqq': self.find_cookie("ptwebqq"),
            'passwd_sig': '',
            'clientid': '85849142',
            'psessionid': 'null'}
        array = {
            'r': json_encode.JSONEncoder().encode(a),
            'clientid': 85849142,
            'psessionid': 'null'}
        headers = {
            'Referer': 'http://d.web2.qq.com/proxy.html?v=20110331002&callback=2'}
        print urllib.urlencode(array)
        r = urllib2.Request(self.login2URL, urllib.urlencode(array), headers)
        u = urllib2.urlopen(r)
        response = u.read()
        print response
        response = json_decode.JSONDecoder().decode(response)
        print response

        # remember the psessionid and vfwebqq, other operation needs them
        self.psessionid = response['result']['psessionid']
        self.vfwebqq = response['result']['vfwebqq']

        self.get_friend_info2()
        self.get_user_friends2()
        self.get_group_name_list_mask2()
        self.poll2()
        self.get_msg_tip()
        
        return True

    def get_friend_info2(self):
        '''
            @url:http://s.web2.qq.com/api/get_friend_info2?tuin=self.__qq&verifysession=&code=&vfwebqq=self.__vfwebqq
        ''' 
        headers = {
            'Referer': 'http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=3'}
        """http://s.web2.qq.com/api/get_friend_info2?tuin=245155408&verifysession=&code=&vfwebqq=d9845386840fd5442d5239e4f798bdd419c25f3e7c094104d969698f3f0cf5518515058ece478fba&t=1344344849355"""
        url = "http://s.web2.qq.com/api/get_friend_info2?tuin={0:s}&verifysession=&code=&vfwebqq={1:s}"
        r = urllib2.Request(url.format(self.username, self.vfwebqq), headers=headers)
        u = urllib2.urlopen(r)
        response = u.read()
        print response
        response = json_decode.JSONDecoder().decode(response)
        print response

    def get_user_friends2(self):
        """s.web2.qq.com POST /api/get_user_friends2 HTTP/1.1"""
        """Referer: http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=3"""
        headers = {
                    'Referer': 'http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=3'}        
        url = "http://s.web2.qq.com/api/get_user_friends2"
        a = {
            'h': 'hello',
            'vfwebqq':self.vfwebqq
        }
        array = {'r': json_encode.JSONEncoder().encode(a)}
        print urllib.urlencode(array)
        r = urllib2.Request(url.format(self.username, self.vfwebqq), urllib.urlencode(array), headers)
        u = urllib2.urlopen(r)
        response = u.read()
        print response
        response = json_decode.JSONDecoder().decode(response)
        print response        
        pass

    def get_group_name_list_mask2(self):
        """s.web2.qq.com POST /api/get_group_name_list_mask2 HTTP/1.1"""
        """Referer: http://s.web2.qq.com/proxy.html?v=20110412001&callback=1&id=3"""
        pass

    def poll2(self):
        # poll
        headers = {
            'Referer':'http://d.web2.qq.com/proxy.html?v=20110331002&callback=2'
        }
        url = 'http://d.web2.qq.com/channel/poll2'
        a = {
            'clientid': '85849142',
            'psessionid':self.psessionid,
            'key':0,
            'ids':[]
        }
        array = {
            'r':json_encode.JSONEncoder().encode(a),
            'clientid':'85849142',
            'psessionid':self.psessionid
        }
        #print urllib.urlencode(array)
        print "in poll"
        r = urllib2.Request(url, urllib.urlencode(array), headers)
        u = urllib2.urlopen(r)
        response = u.read()
        #print response
        str = json_decode.JSONDecoder().decode(response)
        print "in poll", str
        
        if str['retcode'] == 0:
            if str['result'][0]['poll_type'] == 'message':
                #self.__message(str['result'][0]['value']['from_uin'])
                #print "XXX message"
                print str['result'][0]['value']['from_uin']
            elif str['result'][0]['poll_type'] == 'group_message':
                #self.__group_message(str['result'][0]['value']['from_uin'])
                #print "XXX group_message"
                print str['result'][0]['value']['from_uin']
        t1 =threading.Timer(1, self.poll2)
        t1.start()

    def get_msg_tip(self):
        # poll
        pass

    def send_buddy_msg(self, uid, message):
        pass

    def send_group_msg(self, gid, message):
        pass



if __name__ == '__main__':
    webqq = WebQQ("245155408", "solo_198565_mon")
    webqq.login()
