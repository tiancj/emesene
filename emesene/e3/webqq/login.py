#!/usr/bin/env python
# -*- coding: utf-8 -*-

import hashlib
import urllib2
import urllib
import cookielib
import os
import json.encoder as json_encode
import json.decoder as json_decode

cookiefile = "/tmp/cookie.txt"
username = "245155408"
#username =  "2271988661"
password = "solo_198565_mon"

def md5hash(str):
    return hashlib.md5(str).digest()

"""进行md5加密，并输出16进制值"""
def hex_md5hash(str):
    return hashlib.md5(str).hexdigest().upper()

"""
由于提取的验证码2为文本字符串，因此要把文本字符串转换成原始的字符串。
本函数先把\x00\x00\x00\x00\x95\x22\xea\x8a切片成list如['00','00','00','00','95','22','ea','8a'],
然后遍历这个list，对每个字符串进行转换，转换成16进制的数字，
最后使用chr函数，把16进制的数字转换成原始字符，并合并
"""
def hexchar2bin(uin):
    uin_final = ''
    uin = uin.split('\\x')
    #print uin
    for i in uin[1:]:
        uin_final +=chr(int(i, 16))
    return uin_final

def get_password(password, verifyCode1, verifyCode2):
    """
    根据明文密码计算出加密后的密码
    """
    password_1 = md5hash(password) #第一步，计算出来原始密码的MD5值，输出二进制
    password_2 = hex_md5hash(password_1 + hexchar2bin(verifyCode2)) #第二步，合并(拼接)第二步产生的bin值与验证码2的bin值，并进行md5加密，输出32位的16进制
    password_final = hex_md5hash(password_2 + verifyCode1.upper()) #第三步，合并(拼接)第二步产生的16进制值与验证码1，并进行md5加密，输出32位的16进制值 
    return password_final

def get_login(update = False):
    cookies = cookielib.MozillaCookieJar(cookiefile)
    try:
         """加载已存在的cookie，尝试此cookie是否还有效"""
         cookies.load(ignore_discard=True, ignore_expires=True)
         if not update:
             return cookies
    except Exception, e:
        """加载失败，说明从未登录过，需创建一个cookie kong 文件"""
        cookies.save(cookiefile, ignore_discard=True, ignore_expires=True)

    verifyURL = "http://check.ptlogin2.qq.com/check?uin=" + username + "&appid=1003903&r=0.1314827858518941"
    loginURL  = "http://ptlogin2.qq.com/login?"
    verifyImageURL = "http://captcha.qq.com/getimage?aid=1002101&r=0.1314827858518941&uin=" + username + "&vc_type="

    opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cookies))
    opener.addheaders = [('User-agent', 'Opera/9.23')]
    urllib2.install_opener(opener)

    request = urllib2.Request(verifyURL)
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
        verifyImageURL += verifyCode1
        print verifyImageURL
        verifyCode1 = raw_input("Enter verify code: ")
    loginURL += "u=" + username
    loginURL += "&p="
    loginURL += get_password(password, verifyCode1, verifyCode2)
    #loginURL += "&verifycode=" + verifyCode1 + "&low_login_enable=1&low_login_hour=720&aid=1003903&u1=http%3A%2F%2Ft.qq.com&ptredirect=1&h=1&from_ui=1&dumy=&fp=loginerroralert&g=1&t=1&dummy="
    # the following 2 line work fine
    #loginURL += "&verifycode=" + verifyCode1 + "&webqq_type=40&remember_uin=1&login2qq=1&aid=1003903&u1=http%3A%2F%2Fweb.qq.com%2Floginproxy.html%3Flogin2qq%3D1%26webqq_type%3D40&h=1&ptredirect=0&ptlang=2052&from_ui=1&pttype=1&dumy=&fp=loginerroralert&action=8-24-32078&mibao_css=m_webqq&t=1&g=1"
    #loginURL += "&verifycode=" + verifyCode1 + "&webqq_type=10&remember_uin=1&login2qq=1&aid=1003903&u1=http%3A%2F%2Fweb.qq.com%2Floginproxy.html%3Flogin2qq%3D1%26webqq_type%3D10&h=1&ptredirect=0&ptlang=2052&from_ui=1&pttype=1&dumy=&fp=loginerroralert&action=4-23-28932&mibao_css=m_webqq&t=1&g=1"
    loginURL += "&verifycode=" + verifyCode1 + "&webqq_type=10&remember_uin=1&login2qq=1&aid=1003903&u1=http%3A%2F%2Fweb.qq.com%2Floginproxy.html%3Flogin2qq%3D1%26webqq_type%3D10&h=1&ptredirect=0&ptlang=2052&from_ui=1&pttype=1&dumy=&fp=loginerroralert&action=8-24-32078&mibao_css=m_webqq&t=1&g=1"
    print loginURL

    req = urllib2.Request(loginURL)
    req.add_header('Referer', "http://t.qq.com/")
    conn = urllib2.urlopen(req)
    print conn.read()
    cookies.save(cookiefile, ignore_discard=True, ignore_expires=True)
    for ck in cookies:
        print ("%s -> %s" %(ck.name, ck.value))
    print cookies
    print type(cookies)
    print find_cookie(cookies, "ptwebqq")
    print find_cookie(cookies, "ptwebqq23")
    request_post(cookies)
    return cookies

def find_cookie(cj, name):
    for cookie in cj:
        if cookie.name == name:
            return cookie.value
    return None


def request_post(cj):
    """
    POST
    http://d.web2.qq.com/channel/login2
    clientid: 85849142
    psessionid: null
    r: {"status":"hidden",
        "ptwebqq":"3d87018045e840b4446fd0d5558c73c65a8bde50fb2e4f24d911cc850b65c091",
        "passwd_sig":"",
        "clientid":"85849142",
        "psessionid":null}
    """
    url = "http://d.web2.qq.com/channel/login2"
    a = {
        'status': 'hidden', 
        'ptwebqq': find_cookie(cj, "ptwebqq"),
        'passwd_sig': '',
        'clientid': '85849142',
        'psessionid': 'null'
    }
    array = {
        'r': json_encode.JSONEncoder().encode(a),
        'clientid': 85849142,
        'psessionid': 'null'
    }
    headers = {
        'Referer': 'http://d.web2.qq.com/proxy.html?v=20110331002&callback=2'
    }
    print urllib.urlencode(array)
    r = urllib2.Request(url, urllib.urlencode(array), headers)
    u = urllib2.urlopen(r)
    print u.read()
if __name__ == "__main__":
    """ptui_checkVC('0','!VIO','\x00\x00\x00\x00\x0e\x9c\xc6\x50');"""
    print get_password("solo_198565_mon", "!6DK", r"\x00\x00\x00\x00\x0e\x9c\xc6\x50")
    if get_login(True):
        print "login succeed"
    else:
        print "something is wrong"

