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
send GET/POST HTTP requst to Tencent server
'''

class WebQQApi(object):
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
    ''' Tencent WebQQ servers'''
    __servers = {
        MAIN_DOMAIN: "qq.com",
        #EQQ_SERVER_URL: "http://" + u + "/",
        CONN_SERVER_DOMAIN: "http://d.web2.qq.com/",
        CONN_SERVER_DOMAINS: ["http://d.web2.qq.com/"],
        CONN_PROXY_URLS: ["http://d.web2.qq.com/proxy.html?v=20110331002"],
        #CONN_SERVER_DOMAIN2: "http://" + u + "/",
        CONN_PROXY_URL: "http://d.web2.qq.com/proxy.html?v=20110331002",
        #CHAT_PIC_SERVER: "http://" + u + "/",
        AVATAR_SERVER_DOMAIN: "http://qun.qq.com/",
        AVATAR_SERVER_DOMAINS: ["http://face1.qun.qq.com/", 
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
        SYSTEM_FACE_URL: "http://0.web.qstatic.com/webqqpic/style/face/",
        LOGIN_PROTECT_FINISH_URL: "./login_protect.html",
        UPLOAD_CUSTOM_FACE_SERVER: "http://up.web2.qq.com/cgi-bin/cface_upload",
        DOWNLOAD_CHAT_LOG_SERVER: "http://sns.qq.com/buddy_state/feed/save_chat.php",
        FILE_SERVER: "http://file1.web.qq.com/",
        OFFLINE_FILE_SERVER: "http://weboffline.ftn.qq.com:80/ftn_access/",
        QZONE_SERVER_DOMAIN: "http://qzone.qq.com/",
        QZONE_USER_SERVER_DOMAIN: "http://user.qzone.qq.com/",
        QQ_GROUP_URL: "http://qun.qq.com/air/",
    }

    def __init__(self)


