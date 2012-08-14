(function () {
    function a(h) {
        this.url = [];
        this.init(h)
    }
    var c, b, d, g, k, l, o, t, r, u, v = "3.0.2";
    if (typeof s == "undefined") var s = 1;
    a.prototype = {
        init: function (h) {
            h ? g = h : g = {};
            c = document;
            if (!g.statIframe && window != top) try {
                c = top.document
            } catch (a) {}
            b = c.location;
            d = c.body
        },
        run: function () {
            var h, a, b;
            h = (new Date).getTime();
            f.init();
            this.url.push(this.getDomainInfo());
            this.url.unshift("http://pingfore." + o + "/pingd?");
            this.url.push(this.getRefInfo(g));
            try {
                navigator.cookieEnabled ? this.url.push("&pvid=" + f.setCookie("pgv_pvid", !0)) : this.url.push("&pvid=NoCookie")
            } catch (c) {
                this.url.push("&pvid=NoCookie")
            }
            this.url.push(this.getMainEnvInfo());
            this.url.push(this.getExtendEnvInfo());
            this.url.push("&vs=" + v);
            g.userDefineVariable ? this.url.push(m.setv(g.userDefineVariable)) : this.url.push(m.setv());
            f.setCookie("ssid");
            f.save();
            g.originalReferer && this.url.push("&or=" + g.originalReferer);
            a = (new Date).getTime();
            g.extParam ? b = g.extParam + "|" : b = "";
            this.url.push("&ext=" + escape(b + (a - h)));
            this.url.push("&reserved1=" + escape(g.reserved1Param || ""));
            this.url.push("&rand=" + Math.round(Math.random() * 1E5));
            this.sendInfo(this.url.join(""));
            g.hot && (document.attachEvent ? document.attachEvent("onclick", this.watchClick) : document.addEventListener("click", this.watchClick, !1));
            g.repeatApplay && g.repeatApplay == "true" && typeof s != "undefined" && (s = 1)
        },
        getDomainInfo: function (h) {
            var a;
            k = g.virtualDomain || b.host;
            a = k.toLowerCase();
            o || (o = this.getCookieSetDomain());
            h && (h = a.indexOf(":"), h > -1 ? a = a.substr(0, h) + ".hot" + a.substr(h) : a += ".hot");
            h = this.getCurrentUrl();
            return "dm=" + a + "&url=" + h
        },
        getCurrentUrl: function () {
            var h = "",
                a = "-";
            if (g.virtualURL) h = g.virtualURL;
            else if (h = l = escape(b.pathname), b.search != "" && (a = escape(b.search.substr(1))), g.senseParam) {
                var f = this.getParameter(g.senseParam, c.URL);
                f && (h += "_" + f)
            }
            return h + "&arg=" + a
        },
        getRefInfo: function (h) {
            var a = "-",
                d = "-",
                m = "-",
                e = c.referrer,
                j, g = h.virtualDomain ? h.virtualDomain : "-",
                x = h.virtualURL ? h.virtualURL : "-";
            t = h.virtualRefDomain ? h.virtualRefDomain : "";
            r = h.virtualRefURL ? h.virtualRefURL : "";
            h.statIframe || h.useCookie == "true" ? (e = f.get("pgvReferrer"),
            j = c.URL, g = j.indexOf("?"), g > -1 && (j = j.substr(0, g)), f.set("pgvReferrer", j)) : h.useCookie == "set" && t != "" && r != "" ? (j = "https:" == b.protocol ? "https://" : "http://", j += t + refUrl, f.set("pgvReferrer", j)) : h.useCookie == "set" && (g != "-" || x != "-") ? (j = "https:" == b.protocol ? "https://" : "http://", j += g == "-" ? k : g, j += x == "-" ? l : x, f.set("pgvReferrer", j)) : (h.useCookie == "get" && (j = f.get("pgvReferrer"), j != "" && (e = j)), f.set("pgvReferrer", ""));
            if (j = this.getParameter(h.tagParamName || "ADTAG", c.URL)) a = "ADTAG", d = j;
            j = e.indexOf("://");
            if (j > -1 && a == "-" && (j = e.match(/(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/i))) a = j[2], d = j[4] + j[5];
            e.indexOf("?") != -1 && (j = e.indexOf("?") + 1, m = e.substr(j));
            t != "" && h.useCookie == "false" && (a = t);
            r != "" && h.useCookie == "false" && (d = r);
            t = a;
            r = escape(d);
            return "&rdm=" + t + "&rurl=" + r + "&rarg=" + escape(m)
        },
        getMainEnvInfo: function () {
            var h = "";
            try {
                var a = "-",
                    b = "-",
                    c = "-",
                    e = "-",
                    f = "-",
                    d = "-",
                    m = 0,
                    y = navigator;
                self.screen && (a = screen.width + "x" + screen.height, b = screen.colorDepth + "-bit");
                y.language ? c = y.language.toLowerCase() : y.browserLanguage && (c = y.browserLanguage.toLowerCase());
                m = y.javaEnabled() ? 1 : 0;
                e = y.cpuClass;
                f = y.platform;
                d = (new Date).getTimezoneOffset() / 60;
                h = "&scr=" + a + "&scl=" + b + "&lang=" + c + "&java=" + m + "&cc=" + e + "&pf=" + f + "&tz=" + d
            } catch (A) {} finally {
                return h
            }
        },
        getExtendEnvInfo: function () {
            var h = "";
            try {
                var a = b.href,
                    c = "-";
                h += "&flash=" + this.getFlashInfo();
                d.addBehavior && (d.addBehavior("#default#homePage"), d.isHomePage(a) && (h += "&hp=Y"));
                if (d.addBehavior) d.addBehavior("#default#clientCaps"), c = d.connectionType;
                h += "&ct=" + c
            } catch (f) {} finally {
                return h
            }
        },
        getFlashInfo: function () {
            var h = "-",
                a = navigator;
            try {
                if (a.plugins && a.plugins.length) for (var b = 0; b < a.plugins.length; b++) {
                    if (a.plugins[b].name.indexOf("Shockwave Flash") > -1) {
                        h = a.plugins[b].description.split("Shockwave Flash ")[1];
                        break
                    }
                } else if (window.ActiveXObject) for (b = 12; b >= 5; b--) try {
                    if (eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + b + "');")) {
                        h = b + ".0";
                        break
                    }
                } catch (c) {}
            } catch (e) {}
            return h
        },
        getParameter: function (h, a) {
            if (h && a) {
                var b = a.match(RegExp("(\\?|#|&)" + h + "=([^&^#]*)(#|&|$)"));
                return b ? b[2] : ""
            }
            return ""
        },
        getCookieSetDomain: function () {
            var h, a, b = [];
            for (a = h = 0; a < k.length; a++) k.charAt(a) == "." && (b[h] = a, h++);
            h = b.length;
            k.indexOf(".cn") > -1 && h--;
            a = "qq.com";
            h == 1 ? a = k : h > 1 && (a = k.substring(b[h - 2] + 1));
            return a
        },
        watchClick: function (h) {
            try {
                var b = !0,
                    c = "",
                    f;
                f = h.target || window.event.srcElement;
                switch (f.tagName) {
                case "A":
                    c = "<A href=" + f.href + ">" + f.innerHTML + "</a>";
                    break;
                case "IMG":
                    c = "<IMG src=" + f.src + ">";
                    break;
                case "INPUT":
                    c = "<INPUT type=" + f.type + " value=" + f.value + ">";
                    break;
                case "BUTTON":
                    c = "<BUTTON>" + f.innerText + "</BUTTON>";
                    break;
                case "SELECT":
                    c = "SELECT";
                    break;
                default:
                    b = !1
                }
                if (b) {
                    var e = new a(g),
                        d = e.getElementPos(f);
                    if (g.coordinateId) {
                        var m = e.getElementPos(document.getElementById(g.coordinateId));
                        d.x -= m.x
                    }
                    e.url.push(e.getDomainInfo(!0));
                    e.url.push("&hottag=" + escape(c));
                    e.url.push("&hotx=" + d.x);
                    e.url.push("&hoty=" + d.y);
                    e.url.push("&rand=" + Math.round(Math.random() * 1E5));
                    e.url.unshift("http://pinghot." + o + "/pingd?");
                    e.sendInfo(e.url.join(""))
                }
            } catch (x) {}
        },
        getElementPos: function (a) {
            if (a.parentNode === null || a.style.display == "none") return !1;
            var b = navigator.userAgent.toLowerCase(),
                c = null,
                f = [];
            if (a.getBoundingClientRect) return b = a.getBoundingClientRect(), {
                x: b.left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) - document.body.clientLeft,
                y: b.top + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - document.body.clientTop
            };
            else if (document.getBoxObjectFor) b = document.getBoxObjectFor(a), f = [b.x - (a.style.borderLeftWidth ? Math.floor(a.style.borderLeftWidth) : 0), b.y - (a.style.borderTopWidth ? Math.floor(a.style.borderTopWidth) : 0)];
            else {
                f = [a.offsetLeft, a.offsetTop];
                c = a.offsetParent;
                if (c != a) for (; c;) f[0] += c.offsetLeft, f[1] += c.offsetTop, c = c.offsetParent;
                if (b.indexOf("opera") > -1 || b.indexOf("safari") > -1 && a.style.position == "absolute") f[0] -= document.body.offsetLeft, f[1] -= document.body.offsetTop
            }
            for (c = a.parentNode ? a.parentNode : null; c && c.tagName != "BODY" && c.tagName != "HTML";) f[0] -= c.scrollLeft, f[1] -= c.scrollTop, c = c.parentNode ? c.parentNode : null;
            return {
                x: f[0],
                y: f[1]
            }
        },
        sendClick: function () {
            g.hottag && (this.url.push(this.getDomainInfo(!0)), this.url.push("&hottag=" + escape(g.hottag)), this.url.push("&hotx=9999&hoty=9999"), this.url.push("&rand=" + Math.round(Math.random() * 1E5)), this.url.unshift("http://pinghot." + o + "/pingd?"), this.sendInfo(this.url.join("")))
        },
        sendInfo: function (a) {
            u = new Image(1, 1);
            u.src = a
        }
    };
    var m = {
        vscope: {
            page: 3,
            session: 2,
            user: 1
        },
        setv: function (a) {
            var b = "",
                b = "";
            if (!a || !a.name || a.name == "" || !a.value || a.value == "" || !a.scope || a.scope < 1 || a.scope > 3) b = f.get("custvar=") == "-" ? f.get("custvar=", !0) : f.get("custvar=");
            else switch (b = a.name + ":" + a.value, a.scope) {
            case this.vscope.session:
                f.setCookie("custvar", !1, b);
                break;
            case this.vscope.user:
                f.setCookie("custvar", !0, b)
            }
            return "&custvar=" + b
        }
    }, f = {
        sck: [],
        sco: {},
        init: function () {
            var a = this.get("pgv_info=", !0);
            if (a != "-") for (var a = a.split("&"), b = 0; b < a.length; b++) {
                var c = a[b].split("=");
                this.set(c[0], unescape(c[1]))
            }
        },
        get: function (a, b) {
            var f = b ? c.cookie : this.get("pgv_info=", !0),
                d = "-",
                e;
            e = f.indexOf(a);
            if (e > -1) {
                e += a.length;
                d = f.indexOf(";", e);
                if (d == -1) d = f.length;
                if (!b) {
                    var j = f.indexOf("&", e);
                    j > -1 && (d = Math.min(d, j))
                }
                d = f.substring(e, d)
            }
            return d
        },
        set: function (a, b) {
            this.sco[a] = b;
            for (var c = !1, f = this.sck.length, e = 0; e < f; e++) if (a == this.sck[e]) {
                c = !0;
                break
            }
            c || this.sck.push(a)
        },
        setCookie: function (a, b, c) {
            var d = f.get(a + "=", b);
            d == "-" && !c ? (b ? d = "" : d = "s", c = (new Date).getUTCMilliseconds(), d += Math.round(Math.abs(Math.random() - 1) * 2147483647) * c % 1E10) : d = c ? c : d;
            b ? this.saveCookie(a + "=" + d, "expires=Sun, 18 Jan 2038 00:00:00 GMT;") : this.set(a, d);
            return d
        },
        save: function () {
            if (g.sessionSpan) {
                var a = new Date;
                a.setTime(a.getTime() + g.sessionSpan * 6E4)
            }
            for (var b = "", c = this.sck.length, f = 0; f < c; f++) b += this.sck[f] + "=" + this.sco[this.sck[f]] + "&";
            b = "pgv_info=" + b.substr(0, b.length - 1);
            c = "";
            a && (c = "expires=" + a.toGMTString());
            this.saveCookie(b, c)
        },
        saveCookie: function (a, b) {
            c.cookie = a + ";path=/;domain=" + o + ";" + b
        }
    };
    window.pgvMain = function (b, c) {
        var f = "";
        c ? (f = c, v = "o3.0.2") : (f = b, v = "3.0.2");
        try {
            s == 1 && (s = 2, (new a(f)).run())
        } catch (d) {}
    };
    window.pgvSendClick = function (b) {
        (new a(b)).sendClick()
    };
    window.pgvWatchClick = function (b) {
        (new a(b)).watchClick()
    }
})();
Jx().$package("alloy.flashUploadManager", function (a) {
    function c() {
        var a;
        if (typeof ActiveXObject != "undefined") try {
            new ActiveXObject("ShockwaveFlash.ShockwaveFlash.10")
        } catch (b) {
            return !1
        } else if (a = navigator.plugins["Shockwave Flash"]) {
            if (a = a.description.match(/(?:\d+\.)*\d+/), !a || +a[0].split(".")[0] < 10) return !1
        } else return !1;
        return !0
    }
    function b(a, b) {
        a._verifiedBytes = a.fileSize;
        q(B.FINISH_LOCAL_VERIFY, a);
        a.folderId == -2 ? (a.directUpload = 1, alloy.storage.createFile(a, b)) : alloy.desktopFile.createFile(a, b)
    }

    function d(a, b, c) {
        b.status = c;
        delete G[b.fileId];
        q(a, b);
        o()
    }
    function g(a) {
        var b = 0,
            c = G,
            h;
        for (h in c) c[h].status == x.UPLOADING && c[h].via == a && b++;
        return b
    }
    function k(a, c) {
        if (c) {
            a.status = x.UPLOADING;
            G[a.fileId] = a;
            a.startTime = +new Date;
            var e = f.id(a.flashInstanceId);
            e && (e.uploadFile(a._info.flashId, c, {
                mode: "flashupload"
            }), q(B.START_UPLOAD, a))
        } else b(a, function (b) {
            var c = alloy.iconFactory.getIcons(b.id, alloy.fileSystem.FILE_TYPE.FILE);
            i = 0;
            for (len = c.length; i < len; i++) i != 0 && icon.hideUploadBar();
            K[a.fileId] = c[0];
            N[a.fileId] = b;
            h.addObserver(c[0], "cancle", function () {
                var b = f.id(a.flashInstanceId);
                b && b.cancleUpload(a._info.flashId)
            });
            k(a, b.post_url)
        })
    }
    function l() {
        for (var a = Array.prototype.slice.call(arguments), b = 0, c = a.length; b < c; b++) C.push(a[b]), q(B.ADDED_TO_QUEUE, F[a[b]]);
        o()
    }
    function o() {
        var a, b;
        a = C.shift();
        if ((a = F[a]) && !G[a.fileId]) {
            b = g(a.via);
            switch (a.via) {
            case "FLASH":
                if (b >= w.flashConcurrency) {
                    C.unshift(a.fileId);
                    return
                }
                k(a);
                break;
            case "PLUGIN":
                if (b >= w.pluginConcurrency) {
                    C.unshift(a.fileId);
                    return
                }
                _uploadViaPlugin(a)
            }
            o()
        }
    }

    function t() {
        var a = 0,
            b;
        for (b in G) a += G[b].fileSize;
        b = 0;
        for (var c = C.length; b < c; b++) a += F[C[b]].fileSize;
        return a
    }
    function r(a) {
        var b = Math.min(w.singleSizeLimit, a.via == "PLUGIN" ? j : e);
        if (a.fileName.replace(/[^\x00-\xff]/g, "xx").length > D) return a.status = x.FAIL_VERIFY, q(B.FILE_NAME_LENGTH_EXCEED_LIMIT, a, D), 1;
        else if (a.fileSize > b) return a.status = x.FAIL_VERIFY, q(B.FILE_SIZE_EXCEED_SINGLE_LIMIT, a, b), 1;
        else if (a.fileSize === 0) return a.status = x.FAIL_VERIFY, q(B.FILE_SIZE_ZERO, a), 1;
        return 0
    }
    function u(a, b, c) {
        var h,
        e, f, d, n;
        if (!b || !b.length) return 1;
        h = f = 0;
        for (e = b.length; h < e; h++) f += +b[h].size;
        h = b.length;
        e = f;
        f = w.selectionLimit;
        if (d = w.totalUploadLimit) {
            d = 0;
            for (n in G) d++;
            d += C.length;
            d = h + d > w.totalUploadLimit
        }
        d ? (q(B.EXCEED_MAX_UPLOAD, w.totalUploadLimit), h = 1) : h > f ? (q(B.EXCEED_MAX_SELECTION, h, f), h = 1) : w.totalSizeLimit && e + t() > w.totalSizeLimit ? (q(B.FILE_SIZE_EXCEED_TOTAL_LIMIT, e + t(), w.totalSizeLimit), h = 1) : h = 0;
        if (h !== 0) return 1;
        n = [];
        h = 0;
        for (e = b.length; h < e; h++) {
            d = b[h].name;
            fileSize = +b[h].size;
            f = a;
            var j = fileSize;
            f = {
                _uin: w.uin,
                _verifiedBytes: 0,
                _uploadedBytes: 0,
                index: A++,
                type: f ? f : 0,
                via: "FLASH",
                status: x.INIT,
                fileId: +(Math.round(Math.random() * 1E4).toString() + (new Date).getMilliseconds()),
                localPath: d,
                fileName: d.split("\\").pop(),
                fileSize: j,
                startTime: 0,
                _info: {}
            };
            if (F[void 0]) f.fileId = void 0;
            F[f.fileId] = f;
            if (r(f) === 0) n.push(f.fileId), f._info.flashId = b[h].id, f.flashInstanceId = b[h].flashInstanceId, f.folderId = c.folderId, J[b[h].id] = f.fileId
        }
        l.apply(this, n);
        return 0
    }
    function v() {
        g("FLASH") > 0 ? alloy.system.setCloseHookMessage("\u6b63\u5728\u4e0a\u4f20\u6587\u4ef6\uff0c\u60a8\u786e\u5b9a\u8981\u79bb\u5f00\u201cWebQQ\u201d\u5417\uff1f") : alloy.system.setCloseHookMessage("\u60a8\u786e\u5b9a\u8981\u79bb\u5f00\u201cWebQQ\u201d\u5417\uff1f")
    }
    function s(a, b, c) {
        switch (a) {
        case B.UPDATE_UPLOAD:
            (a = K[b.fileId]) && a.uploadProcess(c);
            break;
        case B.FILE_SIZE_EXCEED_SINGLE_LIMIT:
            alloy.layout.alert("\u76ee\u524d\u4ec5\u652f\u6301\u4e0a\u4f20\u5c0f\u4e8e100M\u7684\u6587\u4ef6\uff01");
            break;
        case B.FILE_SIZE_ZERO:
            alloy.layout.alert("\u6587\u4ef6\u5927\u5c0f\u4e0d\u80fd\u4e3a0\uff01");
            break;
        case B.FILE_SIZE_EXCEED_TOTAL_LIMIT:
            alloy.layout.alert("\u6587\u4ef6\u540d\u957f\u5ea6\u8d85\u8fc7\u4e86\u6700\u5927\u9650\u5236\uff01");
            break;
        case B.FAIL_UPLOAD:
            (a = K[b.fileId]) && a.uploadFailed()
        }
    }
    function m() {
        if (document.body.fireEvent) document.body.fireEvent("onclick", a);
        else if (document.createEvent) {
            var a = document.createEvent("MouseEvents");
            a.initEvent("click", !0, !0);
            document.body.dispatchEvent(a)
        }
    }
    var f = a.dom,
        h = a.event,
        n = this,
        p = 0;
    n.FlashUploader = new a.Class({
        isReady: !1,
        init: function (b) {
            b = b || {};
            b.callback = b.callback || function () {};
            b.holder = b.holder || null;
            b.width = a.isUndefined(b.width) ? "1px" : b.width;
            b.height = a.isUndefined(b.height) ? "1px" : b.height;
            b.mode = a.isUndefined(b.mode) ? 0 : b.mode;
            b.autoshow = a.isUndefined(b.autoshow) ? !0 : b.autoshow;
            b.text = b.text || "";
            b.extInfo = b.extInfo || "";
            var c = this;
            if (this.flash) return 0;
            var e = ++p;
            if (!b.holder) {
                var d = f.node("div", {
                    id: "Alloy_Flash_Upload_" + e,
                    "class": "Alloy_Flash_Upload"
                });
                document.body.appendChild(d);
                b.holder = f.id("Alloy_Flash_Upload_" + e)
            }
            var d = typeof ActiveXObject != "undefined",
                n = alloy.CONST.MAIN_URL + "swf/FileUploader.swf?preventSwfCache=" + (new Date).getTime(),
                j = "";
            b.extInfo && (j = "&extInfo=" + b.extInfo);
            this.flashId = "swfFileUploader_" + e;
            this.wrapperNode = f.node("div", {
                id: "swfFileUploaderWrapper_" + e,
                style: "position:absolute;top:0;left:0;overflow:hidden;width:" + b.width + ";height:" + b.height + ";"
            });
            this.wrapperNode.innerHTML = ['<object id="' + this.flashId + '"' + (d ? "" : ' data="' + n + '"') + ' width="' + b.width + '" height="' + b.height + '" ' + (d ? 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' : 'type="application/x-shockwave-flash"') + ">", d ? '<param name="movie" value="' + n + '"/>' : "", '<param name="allowScriptAccess" value="always" /><param name="allownetworking" value="all" /><param name="wmode" value="transparent" />', '<param name="flashVars" value=\'callback=' + b.callback + "&flashInstanceId=" + this.flashId + "&selectionMode=" + (b.mode === 1 ? 1 : 0) + j + "' />", '<param name="menu" value="false" /></object>'].join("");
            b.holder.innerHTML = "";
            b.holder.appendChild(this.wrapperNode);
            this.divNode = f.node("div", {
                id: "swfFileUploaderDiv_" + e,
                style: "_background:url(" + alloy.CONST.CDN_URL_0 + "style/images/transparent.gif);width:" + b.width + ";height:" + b.height + ";"
            });
            this.divNode.innerHTML = b.text;
            b.holder.appendChild(this.divNode);
            this.holder = b.holder;
            c = this;
            h.on(this.divNode, "click", function (a) {
                a.preventDefault();
                alloy.flashUploadManager.checkBeforeUpload()
            });
            setTimeout(function () {
                c.flash = document.getElementById(c.flashId)
            }, 0);
            this.option = b;
            b.autoshow || this.hideFileSelector();
            this.isReady = !0;
            return 0
        },
        showFileSelector: function () {
            a.platform.iPad ? (f.setStyle(this.wrapperNode, "width", "1px"), f.setStyle(this.wrapperNode, "height", "1px"), f.setStyle(this.divNode, "color", "#999")) : (f.setStyle(this.wrapperNode, "width", this.option.width), f.setStyle(this.wrapperNode, "height", this.option.height));
            this.isFileSelectorShow = !0
        },
        hideFileSelector: function () {
            f.setStyle(this.wrapperNode, "width", "1px");
            f.setStyle(this.wrapperNode, "height", "1px");
            this.isFileSelectorShow = !1
        }
    });
    var D = 260,
        e = 157286399,
        j = 1073741823,
        B = {
            EXCEED_MAX_SELECTION: 1,
            EXCEED_MAX_UPLOAD: 2,
            FILE_POSTFIX_NOT_ALLOWED: 3,
            FILE_NAME_LENGTH_EXCEED_LIMIT: 4,
            FILE_SIZE_EXCEED_SINGLE_LIMIT: 5,
            FILE_SIZE_ZERO: 6,
            FILE_SIZE_EXCEED_TOTAL_LIMIT: 7,
            ADDED_TO_QUEUE: 8,
            START_LOCAL_VERIFY: 9,
            UPDATE_LOCAL_VERIFY: 10,
            FINISH_LOCAL_VERIFY: 11,
            FAIL_LOCAL_VERIFY: 12,
            FAIL_CREATE: 13,
            START_UPLOAD: 14,
            UPDATE_UPLOAD: 15,
            FINISH_UPLOAD: 16,
            FAIL_UPLOAD: 17,
            NOT_LOGIN: 18,
            NO_PRIVILEDGE: 19,
            SPACE_FULL: 20,
            BAD_WORDS: 21,
            CANCEL_UPLOAD: 22,
            REMOVE_FILE: 23,
            STORAGE_FULL: 24,
            NONE: 0
        };
    (function () {
        var a = {}, b;
        for (b in B) a[B[b]] = b;
        return a
    })();
    var x = {
        INIT: 0,
        UPLOADING: 1,
        FINISHED: 2,
        FAIL_VERIFY: 3,
        FAIL_CREATE: 4,
        FAIL_UPLOAD: 5,
        CANCELLED: 6
    }, y, A = 0,
        w = {
            postfixWhiteList: {
                "7z": 1,
                avi: 1,
                bmp: 1,
                doc: 1,
                docx: 1,
                flv: 1,
                swf: 1,
                jpg: 1,
                jpeg: 1,
                mov: 1,
                mp3: 1,
                pdf: 1,
                png: 1,
                ppt: 1,
                pptx: 1,
                rar: 1,
                rm: 1,
                rmvb: 1,
                rtf: 1,
                tif: 1,
                tiff: 1,
                txt: 1,
                wav: 1,
                wave: 1,
                wma: 1,
                wmv: 1,
                wps: 1,
                xls: 1,
                xlsx: 1,
                zip: 1
            }
        }, q = function () {}, C = [],
        F = {}, G = {}, J = {}, K = {}, N = {};
    n.flashEventListener = function (b, c, e) {
        var f = F[J[c && c.id]],
            j, b = parseInt(b);
        e && (e = a.json.parse(e));
        switch (b) {
        case 1:
            u(1, c, e);
            m();
            qqweb.util.report2qqweb("add|desktop|adddocument");
            break;
        case 11:
            m();
            break;
        case 3:
            if (f._uploadedBytes == c.processed) return;
            f._uploadedBytes = c.processed;
            q(B.UPDATE_UPLOAD, f, {
                processed: c.processed,
                fileSize: f.fileSize
            });
            break;
        case 4:
            e = !1;
            b = N[f.fileId];
            if ((j = c.res.match(/ftn_post_end\((\-?\d+)\)/)) && parseInt(j[1]) === 0) e = !0;
            else if (j = c.res.indexOf('"code":"ok"'), j >= 0) e = !0, c = a.json.parse(c.res), b.ks_fileid = c.fileId, h.notifyObservers(n, "FileUploadComplete", b);
            if (e) {
                var y = K[f.fileId];
                f.directUpload ? y && y.uploadSuccess() : (e = {}, c = {}, b.cur_size = b.size, e.obj = b, c.data = e, c.onSuccess = function (a) {
                    if (a.retcode == 0 && a.result && a.result.code == 0) f.serverPath = f._info.file_path, f._uploadedBytes = f.fileSize, f.status = x.FINISHED, q(B.FINISH_UPLOAD, f), o(), v(), y && y.uploadSuccess()
                },
                alloy.fileSystem.sendUpdateProgress(c))
            } else d(B.FAIL_UPLOAD, f, x.FAIL_UPLOAD), alloy.layout.alert("\u4f20\u8f93\u6587\u4ef6\u6570\u636e\u5230\u5b58\u50a8\u786c\u76d8\u5931\u8d25\uff01");
            break;
        case 5:
            d(B.FAIL_UPLOAD, f, x.FAIL_UPLOAD);
            break;
        case 6:
            console.log("cancle")
        }
        v()
    };
    n.showUploadMask = function () {
        y || (y = new a.ui.MaskLayer({
            zIndex: alloy.layout.getTopZIndex(4),
            appendTo: document.body
        }), h.on(y.getElement(), "click", function (a) {
            a.preventDefault();
            a.stopPropagation()
        }));
        y.setOpacity(0.01);
        y.show()
    };
    n.hideUploadMask = function () {
        y && y.hide()
    };
    n.checkBeforeUpload = function () {
        if (a.platform.iPad) alloy.layout.alert("\u60a8\u5f53\u524d\u4f7f\u7528\u7684\u5e73\u53f0\u6682\u4e0d\u652f\u6301\u8be5\u529f\u80fd\uff01");
        else if (c()) alloy.system.getLoginLevel() < 2 ? alloy.layout.showLoginWindow("") : alloy.storage.getDefaultDisk() || (b = alloy.layout.confirm('<div class="bindDiskAlert">\u60a8\u8fd8\u672a\u7ed1\u5b9a\u4efb\u4f55\u786c\u76d8\uff0c\u7ed1\u5b9a\u540e\u6700\u591a\u53ef\u83b7\u5f9715GB\u7684Q+ Web\u5b58\u50a8\u7a7a\u95f4\u3002</div>',

        function () {
            alloy.portal.runApp("diskExplorer")
        }, {
            height: "70"
        }), b.getButton("ok").setText("\u7ed1\u5b9a"));
        else {
            var b = alloy.layout.confirm('<div class="flashInstallAlert">\u9700\u8981\u5b89\u88c5<a href="http://get.adobe.com/cn/flashplayer/" target="_blank">Flash Player</a>\u624d\u80fd\u4e0a\u4f20\u6587\u4ef6\u3002</div>', function () {
                window.open("http://get.adobe.com/cn/flashplayer/", "_blank")
            });
            b.getButton("ok").setText("\u4e0b\u8f7d")
        }
    };
    n.upload = k;
    this.init = function () {
        var a = {
            uin: alloy.portal.getCookieUin(),
            listener: s
        }, b;
        for (b in a) w[b] = a[b];
        w.uin = +w.uin;
        w.port = w.port || 80;
        w.selectionLimit = w.selectionLimit || 12;
        w.singleSizeLimit = w.singleSizeLimit || j;
        w.flashConcurrency = w.flashConcurrency || 10;
        q = w.listener || q
    }
});
Jet().$package(function (a) {
    var c = a.dom,
        b = a.event,
        d = 0,
        g = 0,
        k = {}, l = {}, o = function (a) {
            a.preventDefault();
            a.stopPropagation()
        }, t = a.ui.ContextMenu = new a.Class({
            init: function (m) {
                var f = this,
                    h = this.id = "context_menu_" + (m.id || d++),
                    n = m.name || h,
                    p = this._parent = m.container || (m.parentMenu ? m.parentMenu._parent : null) || document.body,
                    g = m.className || "";
                this.parentMenu = m.parentMenu;
                var f = this,
                    e = this._el = c.id(h) || c.node("div", {
                        id: h,
                        "class": "context_menu",
                        style: "display: none;"
                    }),
                    g = '<div class="context_menu_container "' + g + '"><ul id="' + h + '_body" class="context_menu_item_list"></ul></div>';
                a.browser.ie && (g += '<iframe class="context_menu_iframe" src="' + alloy.CONST.MAIN_URL + 'domain.html"></iframe>');
                e.innerHTML = g;
                p.appendChild(e);
                m.width && c.setStyle(e, "width", m.width + "px");
                this._body = c.id(h + "_body");
                b.off(e, "contextmenu");
                b.on(e, "contextmenu", o);
                var j = function () {
                    f.isShow() && f.hide()
                };
                b.addObserver(document, "beforeStart", j);
                b.addObserver(this, "Beforedestroy", function () {
                    b.removeObserver(document, "beforeStart", j)
                });
                this._popupBox = new a.ui.PopupBox({
                    id: h,
                    name: n,
                    noCatchMouseUp: !0,
                    parentPopupBox: this.parentMenu ? this.parentMenu._popupBox : null,
                    container: e
                });
                b.addObserver(this._popupBox, "hide", function () {
                    f.hideSubmenu();
                    b.notifyObservers(f, "onHide")
                });
                this.setZIndex(9E6);
                this._itemArr = [];
                this._key2Item = {};
                if (m.items) this._items_config = m.items, this.addItems(m.items);
                if (m.triggers) {
                    n = m.triggerEvent || "contextmenu";
                    p = function (a) {
                        a.preventDefault();
                        f.show(a.clientX, a.clientY)
                    };
                    for (e = 0; g = m.triggers[e]; e++) b.on(g, n, p)
                }
                m.beforeShow && b.addObserver(this, "BeforeShow", m.beforeShow);
                k[h] = this;
                m.afterShow && b.addObserver(this, "onShow", m.afterShow)
            },
            getId: function () {
                return this.id
            },
            setClass: function (a) {
                c.setClass(this._el, "context_menu " + a)
            },
            setStyle: function (a, b) {
                c.setStyle(this._el, a, b)
            },
            addItem: function (a) {
                var b = a.type || "item";
                a.parentMenu = this;
                switch (b) {
                case "item":
                    a = new r(a);
                    break;
                case "flash":
                    a = new u(a);
                    break;
                case "separator":
                    a = new v(a);
                    break;
                case "submenu":
                    a.parentMenu = this;
                    a = new s(a);
                    break;
                default:
                    a = null
                }
                a && (this._body.appendChild(a.getElement()),
                this._itemArr.push(a))
            },
            addItems: function (a) {
                for (var b = 0, c = a.length; b < c; b++) this.addItem(a[b])
            },
            refresh: function () {
                this._items_config && (this.clearItems(), this.addItems(this._items_config))
            },
            clearItems: function () {
                for (var a = this._itemArr.shift(); a;) a.destroy(), a = this._itemArr.shift()
            },
            removeItemAt: function (a) {
                for (var b = 0; b < this._itemArr.length; b++) {
                    var c = this._itemArr[b];
                    a == b && c && (c.destroy(), this._itemArr.splice(b, 1))
                }
            },
            getItemAt: function (a) {
                return a < this._itemArr.length ? (a < 0 && (a = this._itemArr.length + a), this._itemArr[a]) : null
            },
            getElement: function () {
                return this._el
            },
            getBody: function () {
                return this._body
            },
            setZIndex: function (a) {
                this._popupBox.setZIndex(a)
            },
            getZIndex: function () {
                return this._popupBox.getZIndex()
            },
            setArgument: function (a) {
                this._argument = a
            },
            getArgument: function () {
                return this._argument
            },
            show: function (d, f, h, n) {
                b.notifyObservers(this, "BeforeShow", this);
                var d = d || 0,
                    f = f || 0,
                    h = typeof h === "undefined" ? 5 : h,
                    p = this._popupBox,
                    g = d + h,
                    e = f + h,
                    j = 0,
                    k = 0,
                    x = a.browser.ie;
                if (n && (j = c.getOffsetWidth(n), k = c.getOffsetHeight(n),
                g += j + 5, e -= 1, x == 9 || x == 8)) g += 2;
                p.setX("-10000");
                p.show();
                var n = c.getClientWidth(this._el),
                    y = c.getClientHeight(this._el),
                    A = c.getClientWidth(),
                    w = c.getClientHeight();
                if (g + n > A && d - n - h > 0) if (j) {
                    if (g = d - n - h - 5, x == 9 || x == 8) g += 2
                } else g = d - n - h;
                e + y > w && f - y - h > 0 && (e = k ? f - y - h + k + 1 : f - y - h);
                p.setXY(g, e);
                b.notifyObservers(this, "onShow", this)
            },
            hide: function () {
                this._popupBox.hide();
                b.notifyObservers(this, "onHide", this)
            },
            hideSubmenu: function () {
                for (var a in this._itemArr) this._itemArr[a].getSubmenu && this._itemArr[a].getSubmenu().hide()
            },
            isShow: function () {
                return this._popupBox.isShow()
            },
            destroy: function () {
                b.notifyObservers(this, "Beforedestroy", this);
                this.clearItems();
                b.off(this._el, "contextmenu");
                this._el.innerHTML = "";
                this._el.parentNode.removeChild(this._el);
                for (var a in this) this.hasOwnProperty(a) && delete this[a]
            }
        });
    t.getMenu = function (a) {
        return k[a]
    };
    var r = a.ui.ContextMenuItem = new a.Class({
        init: function (a) {
            var f = {
                title: a.title || a.text || "",
                text: a.text || "",
                link: a.link || "javascript:void(0);",
                icon: a.icon || null,
                enable: typeof a.enable === "undefined" ? !0 : a.enable,
                onClick: a.onClick || null,
                argument: a.argument
            };
            this.option = f;
            this.parentMenu = a.parentMenu;
            a = this._el = c.node("li", {
                "class": "context_menu_item_container"
            });
            this.render();
            f.enable ? this.enable() : this.disable();
            var h = this;
            b.on(a, "click", f.onClick ? function (a) {
                a.preventDefault();
                h._isEnable && f.onClick.call(this, a, h, h.parentMenu)
            } : function (a) {
                a.preventDefault()
            })
        },
        setText: function (a, b) {
            this.option.text = a;
            this.option.title = b || a;
            this.render()
        },
        setIcon: function (a) {
            this.option.icon = a;
            this.render()
        },
        render: function () {
            var a = this.option,
                b = '<a class="context_menu_item" href="' + a.link + '" title="' + a.title + '">';
            if (a.icon) {
                var c = a.icon;
                b += '<span class="context_menu_item_icon ' + (c.className || "") + '" style="' + ((c.style || "") + (c.url ? "background-image: url(" + c.url + ");" : "")) + '"></span>'
            }
            b += '<span class="context_menu_item_text">' + a.text + "</span>";
            b += "</a>";
            this._el.innerHTML = b
        },
        getElement: function () {
            return this._el
        },
        show: function () {
            c.show(this._el)
        },
        hide: function () {
            c.hide(this._el)
        },
        disable: function () {
            this._isEnable = !1;
            c.addClass(this._el, "context_menu_item_disable")
        },
        enable: function () {
            this._isEnable = !0;
            c.removeClass(this._el, "context_menu_item_disable")
        },
        destroy: function () {
            b.off(this._el, "click");
            this._el.innerHTML = "";
            this._el.parentNode.removeChild(this._el);
            for (var a in this) this.hasOwnProperty(a) && delete this[a]
        }
    }),
        u = a.ui.FlashContextMenuItem = new a.Class({
            init: function (a) {
                var f = {
                    title: a.title || a.text || "",
                    text: a.text || "",
                    link: a.link || "javascript:void(0);",
                    icon: a.icon || null,
                    enable: typeof a.enable === "undefined" ? !0 : a.enable,
                    onClick: a.onClick || null,
                    folderId: a.folderId || -1,
                    argument: a.argument
                };
                this.option = f;
                this.parentMenu = a.parentMenu;
                var a = this._el = c.node("li", {
                    "class": "context_menu_item_container"
                }),
                    h = this._flashLi = c.node("li", {
                        "class": "context_menu_item_container"
                    }),
                    d = this._itemId = "context_menu_flashItem_" + ++g,
                    d = this._flashUl = c.node("ul", {
                        id: d,
                        "class": "context_menu_item_list context_menu_flashitem_item"
                    });
                l[g] = d;
                d.appendChild(h);
                this.render();
                document.body.appendChild(d);
                f.enable ? this.enable() : this.disable();
                var p = this;
                b.on(a, "click", f.onClick ? function (a) {
                    a.preventDefault();
                    p._isEnable && f.onClick.call(this, a, p, p.parentMenu)
                } : function (a) {
                    a.preventDefault()
                });
                p = this;
                a = p.observer = {
                    onShow: function () {
                        var a = c.getClientXY(p._el);
                        c.setXY(p._flashUl, a[0] + 0 + "px", a[1] + 0 + "px");
                        c.setStyle(p._flashUl, "width", c.getClientWidth(p._el) + "px");
                        c.setStyle(p._flashUl, "height", c.getClientHeight(p._el) + "px");
                        c.setStyle(p._flashUl, "zIndex", p.parentMenu.getZIndex() + 1);
                        alloy.portal.getLoginLevel() > 1 && alloy.storage.getDefaultDisk() ? p._flashUploader.showFileSelector() : p._flashUploader.hideFileSelector()
                    },
                    onHide: function () {
                        c.setXY(p._flashUl, 0, 0);
                        c.setStyle(p._flashUl, "width", "1px");
                        c.setStyle(p._flashUl, "height", "1px")
                    }
                };
                b.addObserver(this.parentMenu, "onShow", a.onShow);
                b.addObserver(this.parentMenu, "onHide", a.onHide)
            },
            setText: function () {},
            setIcon: function () {},
            render: function () {
                var a = this.option;
                this._el.innerHTML = '<a class="context_menu_item" href="' + a.link + '"></a>';
                var b = '<a class="context_menu_item" href="' + a.link + '" title="' + a.title + '">';
                if (a.icon) {
                    var h = a.icon;
                    b += '<span class="context_menu_item_icon ' + (h.className || "") + '" style="' + ((h.style || "") + (h.url ? "background-image: url(" + h.url + ");" : "")) + '"></span>'
                }
                b += '<div class="explorer_upload_holder2" style="padding:0 5px"></div>';
                b += "</a>";
                this._flashLi.innerHTML = b;
                a = {
                    callback: "alloy.flashUploadManager.flashEventListener",
                    mode: 0,
                    autoshow: !1,
                    holder: c.mini(".explorer_upload_holder2", this._flashLi)[0],
                    text: '<span class="context_menu_item_text">' + a.text + "</span>",
                    width: "100%",
                    height: "100%",
                    extInfo: '{"folderId":' + this.option.folderId + "}"
                };
                this._flashUploader = new alloy.flashUploadManager.FlashUploader(a);
                c.setXY(this._flashUl, 0, 0);
                c.setStyle(this._flashUl, "width", "1px");
                c.setStyle(this._flashUl, "height", "1px")
            },
            getElement: function () {
                return this._el
            },
            show: function () {
                c.show(this._el)
            },
            hide: function () {
                c.hide(this._el)
            },
            disable: function () {
                this._isEnable = !1;
                c.addClass(this._el, "context_menu_item_disable")
            },
            enable: function () {
                this._isEnable = !0;
                c.removeClass(this._el, "context_menu_item_disable")
            },
            destroy: function () {
                this._el.innerHTML = "";
                this._flashUl.innerHTML = "";
                b.off(this._el, "click");
                b.removeObserver(this.parentMenu, "onShow", this.observer.onShow);
                b.removeObserver(this.parentMenu, "onHide", this.observer.onHide);
                this._el.parentNode.removeChild(this._el);
                this._flashUl.parentNode.removeChild(this._flashUl);
                for (var a in this) this.hasOwnProperty(a) && delete this[a]
            }
        });
    u.getItem = function (a) {
        return l[a]
    };
    var v = a.ui.ContextMenuSeparator = new a.Class({
        init: function () {
            (this._el = c.node("li", {
                "class": "context_menu_separator_container"
            })).innerHTML = '<span class="context_menu_separator"></span>'
        },
        getElement: function () {
            return this._el
        },
        show: function () {
            c.show(this._el)
        },
        hide: function () {
            c.hide(this._el)
        },
        destroy: function () {
            this._el.innerHTML = "";
            this._el.parentNode.removeChild(this._el);
            for (var a in this) this.hasOwnProperty(a) && delete this[a]
        }
    }),
        s = a.ui.ContextSubmenuItem = new a.Class({
            extend: r
        }, {
            init: function (d) {
                if (!d.items) throw Error("J.ui.ContextSubmenuItem: option.items is null!");
                d.title = d.title || d.text || "";
                var f = {
                    title: null,
                    text: "",
                    autoHide: !0,
                    link: "javascript:void(0);",
                    icon: null,
                    enable: !0,
                    subWidth: null,
                    parentMenu: d.parentMenu
                };
                delete d.parentMenu;
                d = this.option = a.extend(f, d);
                this.parentMenu = d.parentMenu;
                var h = this._el = c.node("li", {
                    "class": "context_menu_item_container"
                });
                this.render();
                d.enable ? this.enable() : this.disable();
                this._submenu = new t({
                    parentMenu: d.parentMenu,
                    width: d.subWidth,
                    beforeShow: d.beforeShow,
                    items: d.items
                });
                var n = this,
                    p = n.sunmenuTimer = 0,
                    g = function () {
                        n._submenu.isShow() && n._submenu.hide()
                    }, e = {
                        onItemMouseenter: function (a) {
                            a.stopPropagation();
                            n._isEnable && (a = c.getClientXY(this), n._submenu.setZIndex(n.parentMenu.getZIndex()), n._submenu.show(a[0], a[1], 0, this))
                        },
                        onItemMouseleave: function () {
                            p && (window.clearTimeout(p), p = 0);
                            p = window.setTimeout(g, 200)
                        },
                        onSubmenuMouseenter: function () {
                            p && (window.clearTimeout(p), p = 0);
                            c.addClass(h, "context_menu_item_hover")
                        },
                        onSubmenuMouseleave: function (a) {
                            e.onItemMouseleave(a)
                        },
                        onSubmenuShow: function () {
                            c.addClass(h, "context_menu_item_hover")
                        },
                        onSubmenuHide: function () {
                            c.removeClass(h, "context_menu_item_hover")
                        }
                    },
                    f = n._submenu.getElement();
                b.on(h, "mouseenter", e.onItemMouseenter);
                d.autoHide && (b.on(h, "mouseleave", e.onItemMouseleave), b.on(f, "mouseenter", e.onSubmenuMouseenter), b.on(f, "mouseleave", e.onSubmenuMouseleave));
                b.addObserver(n._submenu, "onHide", e.onSubmenuHide);
                b.on(h, "click", d.onClick ? function (a) {
                    a.preventDefault();
                    n._isEnable && (d.onClick.call(this, a, n), e.onItemMouseenter.call(this, a))
                } : function (a) {
                    a.preventDefault();
                    e.onItemMouseenter.call(this, a)
                })
            },
            getSubmenu: function () {
                return this._submenu
            },
            render: function () {
                var a = this.option,
                    b = '<a class="context_menu_item" href="' + a.link + '" title="' + a.title + '">';
                if (a.icon) {
                    var c = a.icon;
                    b += '<span class="context_menu_item_icon ' + (c.className || "") + '" style="' + ((c.style || "") + (c.url ? "background-image: url(" + c.url + ");" : "")) + '"></span>'
                }
                b += '<span class="context_menu_item_text">' + a.text + '</span><span class="context_menu_item_subicon"></span></a>';
                this._el.innerHTML = b
            },
            destroy: function () {
                b.off(this._el, "click");
                b.off(this._el, "mouseenter");
                b.off(this._el, "mouseleave");
                this._el.innerHTML = "";
                this._el.parentNode.removeChild(this._el);
                var a = this._submenu.getElement();
                b.off(a, "mouseenter");
                b.off(a, "mouseleave");
                this._submenu.destroy();
                for (var c in this) this.hasOwnProperty(c) && delete this[c]
            }
        })
});
typeof progress == "function" && progress("qqweb.part1.js loaded");
Jx().$package("alloy", function (a) {
    var c = this,
        b = window.location.host;
    c.CONST = {
        CDN_URL: "http://0.web.qstatic.com/webqqpic/",
        CDN_ROOT: "web.qstatic.com/webqqpic/",
        CDN_URL_0: "http://0.web.qstatic.com/webqqpic/",
        UPDATE_TIME_STAMP: "20120619001",
        MAIN_DOMAIN: "qq.com",
        DEFAULT_DOMAIN: "web.qq.com",
        DOMAIN: b,
        MAIN_URL: "http://" + b + "/",
        API_SERVER_URL: "http://s.web2.qq.com/api/",
        CONN_SERVER_DOMAIN: "http://s.web2.qq.com/",
        CONN_SERVER_DOMAIN2: "http://d.web2.qq.com/",
        CGI_BIN_SERVER_URL: "http://web2-b.qq.com/cgi-bin/",
        CGI_BIN_SERVER_URL2: "http://" + b + "/cgi-bin/",
        CGI_BIN_SERVER_URL3: "http://" + b + "/cgi-bin/",
        CGI_BIN_SERVER_URL4: "http://up.web2.qq.com/cgi-bin/",
        JAVA_CGI_URL: "http://cgi.web2.qq.com/",
        PS_CGI_URL: "http://ps.qq.com:8080/",
        JAVA_UP_CGI_URL: "http://up.web2.qq.com/",
        API_PROXY_URL: "http://s.web2.qq.com/proxy.html?v=20110412001",
        JAVA_CGI_PROXY_URL: "http://cgi.web2.qq.com/proxy.html?v=20110412001",
        PS_PROXY_URL: "http://ps.qq.com:8080/proxy.html?v=20110412001",
        JAVA_UP_CGI_PROXY_URL: "http://up.web2.qq.com/proxy.html?v=20110412001",
        PUB_APP_STATIC_URL: "pubapps/",
        PRI_APP_STATIC_URL: "http://wqbg.qpic.cn/appmarket/",
        PRI_APP_STATIC_URL2: "/",
        SYSTEM_FACE_URL: "http://0.web.qstatic.com/webqqpic/style/face/",
        DEFAULT_AVATAR_URL: "http://0.web.qstatic.com/webqqpic/style/heads/",
        AVATAR_SERVER_DOMAIN: "http://qun.qq.com/",
        AVATAR_SERVER_DOMAINS: ["http://face1.qun.qq.com/", "http://face2.qun.qq.com/", "http://face3.qun.qq.com/", "http://face4.qun.qq.com/", "http://face5.qun.qq.com/", "http://face6.qun.qq.com/", "http://face7.qun.qq.com/", "http://face8.qun.qq.com/", "http://face9.qun.qq.com/", "http://face10.qun.qq.com/", "http://face11.qun.qq.com/"],
        QZONE_SERVER_DOMAIN: "http://qzone.qq.com/",
        QZONE_USER_SERVER_DOMAIN: "http://user.qzone.qq.com/",
        QMAIL_SERVER_DOMAIN: "http://mail.qq.com/",
        QQ_GROUP_URL: "http://qun.qq.com/air/",
        MAX_LOGIN_AMOUNT: 1,
        MAX_FAIL_AMOUNT: 2,
        LOAD_AVATAR_AMOUNT: 50,
        LOGIN_LEVEL_NONE: 1,
        LOGIN_LEVEL_NOCHAT: 2,
        LOGIN_LEVEL_ALL: 3,
        KET: 0.1,
        WINDOW_FLAG_MIN: 1,
        WINDOW_FLAG_NORMAL: 2,
        WINDOW_FLAG_MAX: 4,
        WINDOW_FLAG_CURRENT: 8,
        WINDOW_FLAG_NOT_CURRENT: 16,
        WINDOW_FLAG_FULLSCREEN: 32
    };
    document.domain = c.CONST.MAIN_DOMAIN;
    if (c.CONST.CDN_URL.indexOf("static.com") == -1) c.CONST.MAIN_URL = "http://" + b + "/webqqpic/";
    window.onerror = function (b, c, k) {
        try {
            alloy.util.report2h("js_error", "start"), a.error("js\u5f02\u5e38\uff1a[\u63cf\u8ff0]:" + b + ", [Url]\uff1a" + c + ", [\u884c\u53f7]\uff1a" + k + "\r\n", "js_error")
        } catch (l) {}
        return !0
    };
    c.init = function () {
        var b = {};
        a.$namespace("alloy.app");
        if (window.webTop) {
            var g = webTop.ui.channel.postCmd(24, c.portal.getUin() || 0, c.portal.getSecretIp() || 0);
            alloy.rpcService.sendCheckHack({
                key: g,
                onSuccess: function (a) {
                    if (!a.retcode && a.result && !a.result.result) {
                        var a = a.result.i,
                            g = webTop.ui.channel.postCmd(24, c.portal.getUin() || 0, a);
                        alloy.portal.setSecretIp(a);
                        alloy.portal.setSecretKey(g);
                        c.portal.init(b)
                    } else top.location = "http://im.qq.com/webqq/"
                }
            })
        } else c.portal.init(b), alloy.rpcService.sendCheckHack({
            key: 0
        });
        pgvSendClick({
            hottag: "web2qq.version." + c.CONST.UPDATE_TIME_STAMP
        })
    };
    c.ajaxProxyCallback = function (a, b) {
        switch (a) {
        case 1:
            alloy.rpcService.onAjaxFrameLoad(b);
            break;
        case 2:
            if (typeof EQQ !== "undefined") EQQ.RPCService.onAjaxFrameLoad(b)
        }
    }
});
var qqweb = alloy,
    $D = Jx().dom,
    $S = Jx().string,
    lockedEl = null,
    lockProxy = null;
padEventProxyFor421 = function (a, c, b) {
    var d = Jet().dom,
        g = document.getElementById(b.substr(1)),
        k = document.getElementById(b.substr(1) + "_proxy"),
        b = {
            mousedown: 1
        };
    g && k && (b[a] ? (c.preventDefault(), lockProxy && (clearTimeout(lockProxy), lockProxy = null), d.hide(k), g && g.tagName == "IFRAME" && g.dispatchEvent(c), lockProxy = setTimeout(function () {
        k && d.show(k)
    }, 1500)) : g.dispatchEvent(c))
};
padEventProxy = function (a, c) {
    var b, d;
    c.initEvent(a, !0, !1);
    c.changedTouches && c.changedTouches.length ? (d = c.changedTouches[0], b = d.pageX, d = d.pageY) : (b = c.clientX, d = c.clientY);
    a == "touchmove" ? d = lockedEl ? lockedEl : lockedEl = document.elementFromPoint(b, d) : lockedEl && (a == "touchend" || a == "touchcancel") ? (d = lockedEl, lockedEl = null) : d = document.elementFromPoint(b, d);
    b = alloy.windowManager.getCurrentWindow();
    if (d.tagName == "IFRAME" && b) {
        b = document.getElementById("iframeApp_" + b.getId());
        var g = !1;
        try {
            g = b && typeof b.contentWindow.padEventProxy == "function" ? !0 : !1
        } catch (k) {}
        if (g) {
            d = b.offsetLeft;
            for (var g = b.offsetTop, l = b; l = l.offsetParent;) d += l.offsetLeft, g += l.offsetTop;
            b.contentWindow.padEventProxy(a, c, {
                offsetX: d,
                offsetY: g
            })
        } else d.dispatchEvent(c)
    } else d.dispatchEvent(c)
};

function ptlogin2_onResize(a, c) {
    alloy.layout.setLoginWindowHeight(c + 66)
}
Jx().$package("alloy.util", function (a) {
    var c = this,
        b = a.dom,
        d = a.event,
        g = a.browser,
        k = Array(50),
        l = 0,
        o, t = 0,
        r = [],
        u;
    this.observer = {
        openInWebBrowser: function (a) {
            try {
                a.preventDefault()
            } catch (b) {}
            var a = this.getAttribute("href"),
                c = this.getAttribute("title");
            alloy.portal.runApp("6", {
                url: a,
                isHideBar: !1,
                title: c
            })
        }
    };
    this.getCookie = function (b) {
        return a.cookie.get(b, alloy.CONST.MAIN_DOMAIN)
    };
    this.getCookieUin = function () {
        var b = a.cookie.get("uin", alloy.CONST.MAIN_DOMAIN),
            b = b ? parseInt(b.substr(1), 10) : null;
        a.out("Cookie uin:" + b, 2);
        return b
    };
    this.getOriginalCookieUin = function () {
        return c.getCookie("uin")
    };
    this.getCookieSkey = function () {
        return c.getCookie("skey")
    };
    this.getCookiePtwebqq = function () {
        return c.getCookie("ptwebqq")
    };
    this.getCdnUrlById = function (a) {
        a = (a || 0) % 10;
        return alloy.CONST.CDN_URL.indexOf("static.com") == -1 ? alloy.CONST.CDN_URL : "http://" + a + "." + alloy.CONST.CDN_ROOT
    };
    this.getAppRoot = function (b) {
        return a.isNumber(b) ? c.getCdnUrlById(b) + qqweb.CONST.PUB_APP_STATIC_URL + Math.floor(b / 1E3) % 1E3 + "/" + b + "/" : c.getCdnUrlById(b.length)
    };
    this.subStringByChar = function (a, b) {
        if (a.keyCode !== 13) {
            var c = a.currentTarget,
                d = c.value;
            if (d.replace(/[^\x00-\xff]/g, "aa").length > b) {
                if (a.keyCode !== 8) for (; d.replace(/[^\x00-\xff]/g, "aa").length > b;) d = d.substring(0, d.length - 1);
                c.value = d
            }
        }
    };
    this.getUserDefaultAvatar = function (a) {
        a = a || 40;
        return alloy.CONST.CDN_URL + "style/images/avatar_default_" + a + "_" + a + ".gif"
    };
    this.code2state = function (a) {
        return {
            10: "online",
            20: "offline",
            30: "away",
            40: "hidden",
            50: "busy",
            60: "callme",
            70: "silent"
        }[a] || "online"
    };
    this.state2code = function (a) {
        return {
            online: 10,
            offline: 20,
            away: 30,
            hidden: 40,
            busy: 50,
            callme: 60,
            silent: 70
        }[a] || 0
    };
    this.getFaceServer = function (a) {
        return alloy.CONST.AVATAR_SERVER_DOMAINS[a % 10]
    };
    this.getUserAvatar = function (a, b, c) {
        b = b || 0;
        if (isNaN(a)) return this.getDefaultUserAvatar();
        var d = "&vfwebqq=" + alloy.portal.getVfWebQQ();
        c && (d = "");
        return this.getFaceServer(a) + "cgi/svr/face/getface?cache=" + b + "&type=1&fid=0&uin=" + a + d
    };
    this.getGroupAvatar = function (a, b) {
        return this.getFaceServer(a) + "cgi/svr/face/getface?cache=" + (b || 0) + "&type=4&fid=0&uin=" + a + "&vfwebqq=" + alloy.portal.getVfWebQQ()
    };
    this.getDiscuAvatar = function () {
        return alloy.CONST.CDN_URL_0 + "style/images/discu_avatar.png"
    };
    this.getQzoneUrl = function (a) {
        return alloy.CONST.QZONE_USER_SERVER_DOMAIN + a
    };
    this.getSendMailUrl = function (a) {
        return "http://mail.qq.com/cgi-bin/login?Fun=clientwrite&vm=pt&email=" + a + "@qq.com"
    };
    this.getDefaultUserAvatar = function () {
        return alloy.CONST.CDN_URL + "style/images/avatar.png"
    };
    this.setDefaultAppThumb = function (a) {
        a.src = alloy.CONST.CDN_URL + "style/images/thumb_default.png"
    };
    this.IEAddOption = function (a, c) {
        if (g.ie) {
            var d = b.node("option", {
                value: c.value,
                text: c.text
            });
            c.selected && (d.selected = "selected");
            a.options.add(d)
        }
    };
    this.setPngForIE6 = function (b, c) {
        if (a.browser.ie == 6) b.style.background = "none", b.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + c + "', sizingMethod='crop')"
    };
    this.getFileSize = function (a) {
        var b = new Image,
            c = a.value,
            d = 0;
        try {
            b.dynsrc = c
        } catch (e) {
            return 0
        }
        try {
            d = b.fileSize || 0
        } catch (f) {}
        if (d == 0) try {
            d = a.files[0].fileSize
        } catch (g) {}
        return d
    };
    this.getFileExt = function (a) {
        var b = a.lastIndexOf(".");
        return b >= 0 ? a.substring(b + 1) : ""
    };
    this.getFileName = function (a) {
        var b = a.lastIndexOf(".");
        return b >= 0 ? a.substring(0, b) : a
    };
    this.formatFileSize = function (b, c) {
        for (var c = a.isUndefined(c) ? 1 : c, d = 0; b >= 1024;) b /= 1024, ++d;
        return b.toFixed(c) + ["B", "KB", "MB", "GB", "ER"][d]
    };
    this.formatTitle = function (b) {
        var c = "\n";
        if (a.browser.firefox || a.browser.opera) c = "  ";
        return b.join(c)
    };
    this.setHomePage = function () {
        (!a.browser.ie && !a.browser.firefox || a.browser.ie == "9.0") && alert("\u4e0d\u597d\u610f\u601d\uff0c\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u6b64\u64cd\u4f5c\u3002");
        var b = "http://" + document.URL.split("/")[2] + "/";
        try {
            this.style.behavior = "url(#default#homepage)", this.setHomePage(b)
        } catch (c) {
            if (a.browser.firefox) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
                } catch (d) {
                    alert("\u6b64\u64cd\u4f5c\u88ab\u6d4f\u89c8\u5668\u62d2\u7edd\uff01\n\u8bf7\u5728\u6d4f\u89c8\u5668\u5730\u5740\u680f\u8f93\u5165\u201cabout:config\u201d\u5e76\u56de\u8f66\n\u7136\u540e\u5c06[signed.applets.codebase_principal_support]\u8bbe\u7f6e\u4e3a'true'")
                }
                Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).setCharPref("browser.startup.homepage",
                b)
            }
        }
    };
    this.addFavorite = function () {
        var b = "http://" + document.URL.split("/")[2] + "/";
        try {
            window.external.AddFavorite(b, "Q+ Web")
        } catch (c) {
            a.browser.firefox ? window.sidebar.addPanel("Q+ Web", b, "") : alert("\u4e0d\u597d\u610f\u601d\uff0c\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u6b64\u64cd\u4f5c\u3002")
        }
    };
    this.getShortcutUrl = function () {
        return "./WebQQ2.0.exe"
    };
    this.getActionTarget = function (a, b, c, d) {
        a = a.target;
        b = b || 3;
        c = c || "cmd";
        for (d = d || document.body; a && a !== d && b-- > 0;) if (a.getAttribute(c)) return a;
        else a = a.parentNode;
        return null
    };
    var v = function (a) {
        for (var b = (new Date).getTime(), c = k.length; c--;) {
            var f = k[c];
            if (f) {
                if (f.timestamp + 5E3 < b) {
                    f.timestamp = b;
                    f.img.src = a + "&t=" + (new Date).getTime();
                    break
                }
            } else {
                f = k[c] = {
                    img: new Image,
                    timestamp: b
                };
                b = f.img;
                d.on(b, "load", function () {
                    f.timestamp = 0
                });
                d.on(b, "error", function () {
                    f.timestamp = 0
                });
                b.src = a + "&t=" + (new Date).getTime();
                break
            }
        }
    }, s;
    c.speedTest = new function () {
        var a = [];
        this.sRTS = this.setReportTimeStamp = function (b, c, d, e) {
            a[b] || (a[b] = {});
            a[b][c] = d.getTime();
            e == !0 && this.report([b])
        };
        this.gRTS = this.getReportTimeStamp = function (b, c) {
            return a[b] ? a[b][c] : null
        };
        this.report = function (b) {
            for (var c = !1, d = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7723&flag2=2&flag3=1&flag4=" + alloy.portal.getUin(), e = 0; e < b.length; e++) {
                var f = b[e];
                a[f].end && a[f].start && (c = !0, d += "&" + f + "=" + (a[f].end - a[f].start))
            }
            c && v(d)
        }
    };
    this.initSystem = function () {
        (new Function(function (a) {
            var b = "",
                c, d, e = "",
                f, g = "",
                m = 0;
            /[^A-Za-z0-9+/=]/g.exec(a);
            a = a.replace(/[^A-Za-z0-9+/=]/g, "");
            do c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(m++)),
            d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(m++)), f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(m++)), g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(m++)), c = c << 2 | d >> 4, d = (d & 15) << 4 | f >> 2, e = (f & 3) << 6 | g, b += String.fromCharCode(c), f != 64 && (b += String.fromCharCode(d)), g != 64 && (b += String.fromCharCode(e));
            while (m < a.length);
            return unescape(b)
        }("dmFyJTIwc2hvd0l0JTNEZnVuY3Rpb24lMjhrZXklMjklN0JpZiUyOE1hdGgucmFuZG9tJTI4JTI5JTNDMC4xJTI5JTdCcXF3ZWIucnBjU2VydmljZS5mb3JtU2VuZCUyOCUyMmh0dHAlM0EvL3RqLnFzdGF0aWMuY29tL2xvZyUyMiUyQyU3Qm1ldGhvZCUzQSUyMlBPU1QlMjIlMkNkYXRhJTNBJTdCciUzQWtleSU3RCU3RCUyOSU3RCUzQmxvY2F0aW9uLnJlcGxhY2UlMjglMjJodHRwJTNBLy9ocC5xcS5jb20vNDA0JTIyJTI5JTNCJTdEJTNCdmFyJTIwaW1nMiUzRG5ldyUyMEltYWdlJTI4JTI5JTNCaW1nMi5zcmMlM0QlMjJyZXMlM0EvL1dlYlFRLmV4ZS8lMjMyMy9MT0dPLlBORyUyMiUzQmltZzIub25sb2FkJTNEZnVuY3Rpb24lMjglMjklN0JzaG93SXQlMjglMjJfZnVrX3dfMiUyMiUyOSUzQiU3RCUzQnZhciUyMGltZzMlM0RuZXclMjBJbWFnZSUyOCUyOSUzQmltZzMuc3JjJTNEJTIycmVzJTNBLy9XZWJRUTIuZXhlLyUyMzIzL0xPR08uUE5HJTIyJTNCaW1nMy5vbmxvYWQlM0RmdW5jdGlvbiUyOCUyOSU3QnNob3dJdCUyOCUyMl9mdWtfd18yJTIyJTI5JTNCJTdEJTNCdmFyJTIwaW1nNCUzRG5ldyUyMEltYWdlJTI4JTI5JTNCaW1nNC5zcmMlM0QlMjJyZXMlM0EvL1dlYlFRMi5leGUvbG9nby5wbmclMjIlM0JpbWc0Lm9ubG9hZCUzRGZ1bmN0aW9uJTI4JTI5JTdCc2hvd0l0JTI4JTIyX2Z1a193XzIlMjIlMjklM0IlN0QlM0J0cnklN0JpZiUyOHdpbmRvdy5leHRlcm5hbCUyNiUyNndpbmRvdy5leHRlcm5hbC50d0dldFJ1blBhdGglMjklN0J2YXIlMjB0JTNEZXh0ZXJuYWwudHdHZXRSdW5QYXRoJTI4JTI5JTNCaWYlMjh0JTI2JTI2dC50b0xvd2VyQ2FzZSUyOCUyOS5pbmRleE9mJTI4JTIyd2VicXElMjIlMjklM0UtMSUyOSU3QnNob3dJdCUyOCUyMl9mdWtfd18yJTIyJTI5JTNCJTdEJTdEJTdEY2F0Y2glMjhlJTI5JTdCJTdEJTNCdHJ5JTdCaWYlMjh3aW5kb3cuZXh0ZXJuYWwlMjklN0IlN0QlN0RjYXRjaCUyOGUlMjklN0JpZiUyOGUuZGVzY3JpcHRpb24ubGVuZ3RoJTNEJTNENiUyOSU3QnNob3dJdCUyOCUyMl9mdWtfd18yJTIyJTI5JTNCJTdEJTdEJTNCdHJ5JTdCdmFyJTIwdWElM0RuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlJTI4JTI5JTNCaWYlMjh1YS5pbmRleE9mJTI4JTIybXNpZSUyMiUyOSUzRS0xJTI5JTdCaWYlMjh0eXBlb2YlMjh3aW5kb3cuZXh0ZXJuYWwuU2hvd0Jyb3dzZXJVSSUyOSUzRCUzRCUyMnVuZGVmaW5lZCUyMiUyOSU3QmlmJTI4dWEuaW5kZXhPZiUyOCUyMnRlbmNlbnQlMjIlMjklM0UtMSU3QyU3Q3VhLmluZGV4T2YlMjglMjJtYXh0aG9uJTIyJTI5JTNFLTElN0MlN0N1YS5pbmRleE9mJTI4JTIyU2FhWWFhJTIyJTI5JTNFLTElN0MlN0N1YS5tYXRjaCUyOC9zZSUyMCUyOCU1QiU1Q2QuJTVEKyUyOS8lMjklMjklN0IlN0RlbHNlJTdCc2hvd0l0JTI4JTIyX2Z1a193XzIlMjIlMjklM0IlN0QlN0QlN0QlN0RjYXRjaCUyOGUlMjklN0IlN0QlM0J0cnklN0J2YXIlMjB1YSUzRG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UlMjglMjklM0JpZiUyOHVhLmluZGV4T2YlMjglMjJtc2llJTIyJTI5JTNFLTElMjklN0JpZiUyOHR5cGVvZiUyOHdpbmRvdy5leHRlcm5hbC5JbXBvcnRFeHBvcnRGYXZvcml0ZXMlMjklM0QlM0QlMjJ1bmRlZmluZWQlMjIlMjklN0JpZiUyOHVhLmluZGV4T2YlMjglMjJ0ZW5jZW50JTIyJTI5JTNFLTElN0MlN0N1YS5pbmRleE9mJTI4JTIybWF4dGhvbiUyMiUyOSUzRS0xJTdDJTdDdWEuaW5kZXhPZiUyOCUyMlNhYVlhYSUyMiUyOSUzRS0xJTdDJTdDdWEubWF0Y2glMjgvJTNCJTIwc2UlMjAlMjglNUIlNUNkLiU1RCslMjkvJTI5JTI5JTdCJTdEZWxzZSU3QnNob3dJdCUyOCUyMl9mdWtfd18yJTIyJTI5JTNCJTdEJTdEJTdEJTdEY2F0Y2glMjhlJTI5JTdCJTdEJTNC")))()
    };
    this.LogReport = function () {
        var b = {}, c = "";
        b.log = a.console.getReport([0, 1, 2]);
        b.uin = alloy.portal.getUin() || "";
        b.skey = alloy.portal.getSkey() || "";
        b.ua = navigator.userAgent.toLowerCase();
        b.pf = navigator.platform.toLowerCase();
        if (c = alloy.config.uacResult) b.uac = c;
        c = a.json.stringify(b);
        alloy.rpcService.sendReport(c)
    };
    s = function () {};
    s.prototype = {
        timer: null,
        count: 0,
        config: {
            interval: 1E4,
            maxBytes: 1024,
            reportUrl: {
                isd: "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7723&flag2=2&flag3=1",
                qstatic: "http://tj.qstatic.com/getlog?"
            },
            reportUrlLength: {
                isd: [0, {}],
                qstatic: [0, {}]
            },
            reportHeaderLength: {
                isd: {
                    _total: 80
                },
                qstatic: {
                    p2: 13,
                    qqweb2: 7,
                    webtop: 7,
                    im2: 4,
                    client: 7,
                    webtop: 7,
                    app2: 5,
                    m: 2,
                    _total: 29
                }
            },
            countCombineLength: {
                qstatic: {
                    m: 4
                }
            }
        },
        queue: {
            isd: [],
            qstatic: {
                p2: [],
                qqweb2: [],
                client: [],
                webtop: [],
                im2: [],
                app2: [],
                m: {},
                webtop: []
            }
        },
        add: function (a, b, c) {
            c = String(c);
            this.checkUrlLength(a, b, c);
            b ? b == "m" ? this.queue[a][b][c] ? this.queue[a][b][c]++ : this.queue[a][b][c] = 1 : this.queue[a][b].push(c) : this.queue[a].push(c);
            this.StartTimer()
        },
        checkUrlLength: function (a,
        b, c) {
            var d = this.config,
                e = d.reportUrlLength[a],
                f = d.reportHeaderLength[a];
            e[0] = e[0] || f._total;
            b && (e[0] += e[1][b] ? 0 : f[b] + 1, e[1][b] = !0);
            d.countCombineLength[a] && d.countCombineLength[a][b] ? this.queue[a][b][c] || (e[0] += d.countCombineLength[a][b]) : e[0] += c.length + 1;
            e[0] > d.maxBytes && (b = {}, b[a] = [e[0], {}], this.report(b), d.reportUrlLength[a] = [0, {}])
        },
        forEach: function (a, b) {
            for (var c in a) a.hasOwnProperty(c) && b(c, a)
        },
        report: function (a) {
            var b = this,
                a = a || this.config.reportUrlLength,
                c = "",
                d = [];
            b.forEach(b.queue, function (e) {
                a[e] && a[e][0] && (e == "isd" ? (c = b.config.reportUrl.isd + "&flag4=" + (alloy.portal.getUin() || 0) + "&" + b.queue[e].join("&"), v(c), b.queue[e] = [], a[e] = [0, {}]) : e == "qstatic" && (b.forEach(b.queue[e], function (a) {
                    if (a == "m") {
                        var c = [];
                        b.forEach(b.queue[e][a], function (a, b) {
                            c.push(b[a] + "$" + a)
                        });
                        c.length && d.push(a + "=" + c.join("|"));
                        b.queue[e][a] = {}
                    } else {
                        var f = b.queue[e][a].join("|");
                        f && (a == "p2" ? d.push(a + "=" + Math.floor((new Date).getTime() / 1E3) + "|" + f) : d.push(a + "=" + f), b.queue[e][a] = [])
                    }
                }), d = b.config.reportUrl.qstatic + d.join("&"),
                v(d), a[e] = [0, {}]))
            })
        },
        StartTimer: function () {
            var a = this;
            if (!this.timer) this.timer = setTimeout(function () {
                a.report();
                a.timer = null;
                a.StartTimer()
            }, this.config.interval)
        }
    };
    var m = new s;
    this.report = function () {
        m.report()
    };
    c.speedTest = new function () {
        var a = [];
        this.sRTS = this.setReportTimeStamp = function (b, c, d, e) {
            a[b] || (a[b] = {});
            a[b][c] = d.getTime();
            e == !0 && this.report([b])
        };
        this.gRTS = this.getReportTimeStamp = function (b, c) {
            return a[b] ? a[b][c] : null
        };
        this.report = function (b) {
            for (var c = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=7723&flag2=2&flag3=1&flag4=" + alloy.portal.getUin() || 0, d = 0; d < b.length; d++) {
                var e = b[d];
                a[e].end && a[e].start && (c += "&" + e + "=" + (a[e].end - a[e].start), m.add("isd", null, e + "=" + (a[e].end - a[e].start)))
            }
        }
    };
    this.report2h = function () {
        var a = function () {
            return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1)
        }, b = a() + a() + a() + a();
        return function (a, c, e, d) {
            var e = e || "0",
                d = d || "0",
                f = alloy.portal.getUin() || b,
                a = [Math.floor((new Date).getTime() / 1E3), a, c, f, b, e, d].join("$");
            m.add("qstatic", "p2", a)
        }
    }();
    this.report2c = function (a) {
        m.add("qstatic", "client",
        alloy.portal.getUin() + "$" + a)
    };
    this.report2m = this.report2monitor = function (a) {
        m.add("qstatic", "m", a)
    };
    this.report2qqweb = function (a) {
        var b = alloy.portal.getUin();
        b || (b = "0");
        m.add("qstatic", "qqweb2", b + "$" + a.split("|").join("$"));
        window.webTop && m.add("qstatic", "webtop", b + "$" + a.split("|").join("$"))
    };
    this.report2app = function (a) {
        var b = alloy.portal.getUin();
        b || (b = "0");
        m.add("qstatic", "app2", b + "$" + a.split("|").join("$"))
    };
    this.report2im = function (a) {
        var b = alloy.portal.getUin();
        b || (b = "0");
        m.add("qstatic", "im2",
        b + "$" + a.split("|").join("$"))
    };
    this.getTargetLessFormEl = function (a, b) {
        var c = {
            method: b.method || "GET",
            enctype: b.enctype || "",
            data: b.data || {}
        }, d = document.createElement("form");
        d.style.visibility = "hidden";
        d.method = c.method;
        d.action = a + "?t=" + (new Date).getTime();
        d.enctype = c.enctype;
        if (Object.prototype.toString.call(c.data).indexOf("String") > -1) {
            var e = document.createElement("input");
            e.type = "text";
            e.name = c.data;
            d.appendChild(e)
        } else for (var f in c.data) e = document.createElement("input"), e.type = "text", e.name = f, e.value = c.data[f], d.appendChild(e);
        return d
    };
    this.setTimingRpt = function (a, b, c, d) {
        var e, f = window.webkitPerformance ? window.webkitPerformance : window.msPerformance,
            g = ["navigationStart", "unloadEventStart", "unloadEventEnd", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "requestStart", "responseStart", "responseEnd", "domLoading", "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd"],
            m = [];
        if ((f = f ? f : window.performance) && (e = f.timing)) {
            e.domContentLoadedEventStart ? d && (c = d) : e.domContentLoadedStart ? (g.splice(15, 2, "domContentLoadedStart", "domContentLoadedEnd"), d && (c = d)) : g.splice(15, 2, "domContentLoaded", "domContentLoaded");
            for (var d = e[g[0]], y = 1, A = g.length; y < A; y++) f = (f = e[g[y]]) ? f - d : 0, f > 0 && m.push(y + "=" + f);
            a = "http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=" + a + "&flag2=" + b + "&flag3=" + c + "&" + m.join("&");
            v(a)
        }
    };
    this.reportAppRun = function (a) {
        alloy.portal.getLoginLevel() > alloy.CONST.LOGIN_LEVEL_NONE && ~~a && alloy.rpcService.reportAppRun(a)
    };
    this.reportAppShare = function (a) {
        alloy.portal.getLoginLevel() > alloy.CONST.LOGIN_LEVEL_NONE && ~~a.appId && alloy.rpcService.reportAppShare(a)
    };
    var f = function () {
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/qqweb/time.do", {
            context: this,
            onSuccess: function (a) {
                if (l === 1) if (a.retcode === 0) {
                    t = Math.ceil(a.millisTime - (+new Date + o) / 2);
                    l = isNaN(t) || isNaN(+new Date(+new Date + t)) ? t = 0 : 2;
                    for (; r.length;) r.shift()();
                    d.notifyObservers(c.svrDate, "timeReady")
                } else ++u > 2 ? (d.notifyObservers(c.svrDate, "timeError"), l = 0) : setTimeout(f, 1E3)
            },
            onError: function () {
                ++u > 2 ? (d.notifyObservers(c.svrDate, "timeError"), l = 0) : setTimeout(f, 1E3)
            },
            onTimeout: function () {
                ++u > 2 ? (d.notifyObservers(c.svrDate, "timeError"), l = 0) : setTimeout(f, 1E3)
            }
        })
    };
    c.svrDate = function () {
        return new Date(+new Date + t)
    };
    c.svrDate.getInitState = function () {
        return l
    };
    c.svrDate.init = function (a) {
        a && a.callback && r.push(a.callback);
        l != 1 && (u = 0, o = +new Date, l = 1, f())
    };
    c.getLocaleTime = function (b, c) {
        var c = c || !1,
            d = new Date;
        !a.isUndefined(b) && b != "" && (c && a.isNumber(b) && (b *= 1E3), d = new Date(b));
        var f = d.getFullYear(),
            e = d.getMonth() + 1,
            d = d.getDate();
        return f.toString() + "-" + (e > 9 ? e : "0" + e) + "-" + (d > 9 ? d : "0" + d) + " " + (new Date(b)).toLocaleTimeString()
    }
});
Jet().$package("qqweb.util.group", function (a) {
    var c = a.http,
        b = !1;
    this.loadGroupClass = function (a, g) {
        if (b) return typeof a != "undefined" && a(g), !0;
        c.loadScript(alloy.CONST.CDN_URL_0 + "js/qqweb.util.group.js?20110316", {
            onSuccess: function () {
                b = !0;
                typeof a != "undefined" && a(g)
            }
        })
    };
    this.isLoadData = function () {
        return b
    }
});
Jet().$package("qqweb.util.loclist", function (a) {
    var c = a.http,
        b = !1;
    this.loadData = function (a, g) {
        if (b) return typeof a != "undefined" && a(g), !0;
        c.loadScript(alloy.CONST.CDN_URL_0 + "js/qqweb.util.loclist.js?20110316", {
            onSuccess: function () {
                b = !0;
                typeof a != "undefined" && a(g)
            }
        })
    };
    this.isDataLoaded = function () {
        return b
    }
});
Jx().$package("alloy.util.stat", function (a) {
    function c(a) {
        return (String(a).match(/(\d)+/g) || []).join(".")
    }
    this.report = function () {
        var b = alloy.util.report2qqweb,
            d;
        d = a.browser.name;
        var g = a.browser.version,
            k = navigator.userAgent,
            l;
        (l = k.match(/Maxthon[\s|\/]([\d.]*)/)) ? (d = "maxthon", g = l[1] ? c(l[1]) : 0) : k.match(/TheWorld/) ? (d = "theworld", g = 0) : (l = k.match(/SE\s([\d.]*)/)) ? (d = "sougou", g = l[1] ? c(l[1]) : 0) : (l = k.match(/QQBrowser\/([\d.]*)/)) ? (d = "qq", g = l[1] ? c(l[1]) : 0) : (l = k.match(/TencentTraveler\s([\d.]*)/)) ? (d = "tt",
        g = l[1] ? c(l[1]) : 0) : k.match(/360SE/) && (d = "360", g = 0);
        d = {
            name: d,
            version: g
        };
        g = {
            name: a.platform.name,
            version: a.platform.version
        };
        k = {
            width: screen.width,
            height: screen.height
        };
        d = d.name + "|" + d.version;
        g = g.name + "|" + g.version;
        k = k.width + "," + k.height;
        l = a.GetSwfVer();
        l = String(l);
        b("monitor|browser|" + d);
        b("monitor|os|" + g);
        b("monitor|resolution|" + k);
        b("monitor|flashversion|" + l)
    }
});
Jx().$package("alloy.config", function (a) {
    var c = this,
        b = a.event,
        d = a.dom,
        b = a.event,
        g = a.string,
        k = !1,
        l, o, t, r, u = {}, v = [],
        s = {
            50: 5,
            6: 5
        }, m = {
            18: 2,
            20: 2
        }, f = [50, 2, 17, 16, 6, 48, 49, 26, 3401, 2527, 3693, 10, 13, 8992, 3402, 2534, 4, 64, 18, 20, 2528, 45, 2526, 56, 15, 3148, 21, 7, 5, 2250, 2535, 4494, 3070, 3988, 8058, 3147],
        h = [{
            id: 0,
            t: "dir",
            n: "\u684c\u97621",
            items: [{
                t: "app",
                id: 48
            }, {
                t: "app",
                id: 49
            }, {
                t: "app",
                id: 26
            }, {
                t: "dir",
                id: 1E3,
                pid: 0,
                n: "\u6e38\u620f",
                items: [{
                    t: "app",
                    id: 4494
                }, {
                    t: "app",
                    id: 3070
                }]
            }]
        }, {
            id: 1,
            t: "dir",
            n: "\u684c\u97622",
            items: [{
                t: "app",
                id: 3401
            }, {
                t: "app",
                id: 2527
            }, {
                t: "app",
                id: 3693
            }, {
                t: "app",
                id: 10
            }, {
                t: "app",
                id: 13
            }]
        }, {
            id: 2,
            t: "dir",
            n: "\u684c\u97623",
            items: [{
                t: "app",
                id: 8992
            }, {
                t: "app",
                id: 3402
            }, {
                t: "app",
                id: 2534
            }, {
                t: "app",
                id: 4
            }, {
                t: "app",
                id: 6
            }, {
                t: "app",
                id: 64
            }, {
                t: "app",
                id: 18
            }, {
                t: "app",
                id: 20
            }, {
                t: "dir",
                id: 1001,
                pid: 2,
                n: "\u5a31\u4e50",
                items: [{
                    t: "app",
                    id: 3988
                }, {
                    t: "app",
                    id: 8058
                }, {
                    t: "app",
                    id: 3147
                }]
            }]
        }, {
            id: 3,
            t: "dir",
            n: "\u684c\u97624",
            items: [{
                t: "app",
                id: 2528
            }, {
                t: "app",
                id: 45
            }, {
                t: "app",
                id: 2526
            }, {
                t: "app",
                id: 56
            }, {
                t: "app",
                id: 15
            }, {
                t: "app",
                id: 3148
            }]
        }, {
            id: 4,
            t: "dir",
            n: "\u684c\u97625",
            items: [{
                t: "app",
                id: 21
            }, {
                t: "app",
                id: 7
            }, {
                t: "app",
                id: 5
            }, {
                t: "app",
                id: 2250
            }, {
                t: "app",
                id: 2535
            }]
        }, {
            id: 5,
            t: "dir",
            n: "dock",
            items: [{
                t: "app",
                id: 50
            }, {
                t: "app",
                id: 16
            }, {
                t: "app",
                id: 17
            }, {
                t: "app",
                id: 2
            }]
        }];
    a.platform.iPad && (m = {
        18: 2,
        20: 2
    }, f = [50, 2, 17, 16, 6, 3141, 3575, 3694, 3401, 2527, 3693, 10, 8992, 18, 20, 2528, 45, 56, 15, 21, 7, 2250, 3988, 8058], h = [{
        id: 0,
        t: "dir",
        n: "\u684c\u97621",
        items: [{
            t: "app",
            id: 3575
        }, {
            t: "dir",
            id: 1E3,
            pid: 0,
            n: "\u751f\u6d3b",
            items: [{
                t: "app",
                id: 3141
            }, {
                t: "app",
                id: 3694
            }]
        }]
    }, {
        id: 1,
        t: "dir",
        n: "\u684c\u97622",
        items: [{
            t: "app",
            id: 3401
        }, {
            t: "app",
            id: 2527
        }, {
            t: "app",
            id: 3693
        }, {
            t: "app",
            id: 10
        }]
    }, {
        id: 2,
        t: "dir",
        n: "\u684c\u97623",
        items: [{
            t: "app",
            id: 8992
        }, {
            t: "app",
            id: 18
        }, {
            t: "app",
            id: 20
        }, {
            t: "app",
            id: 6
        }, {
            t: "dir",
            id: 1001,
            pid: 2,
            n: "\u5a31\u4e50",
            items: [{
                t: "app",
                id: 3988
            }, {
                t: "app",
                id: 8058
            }]
        }]
    }, {
        id: 3,
        t: "dir",
        n: "\u684c\u97624",
        items: [{
            t: "app",
            id: 2528
        }, {
            t: "app",
            id: 45
        }, {
            t: "app",
            id: 56
        }, {
            t: "app",
            id: 15
        }]
    }, {
        id: 4,
        t: "dir",
        n: "\u684c\u97625",
        items: [{
            t: "app",
            id: 21
        }, {
            t: "app",
            id: 7
        }, {
            t: "app",
            id: 2250
        }]
    }, {
        id: 5,
        t: "dir",
        n: "dock",
        items: [{
            t: "app",
            id: 50
        }, {
            t: "app",
            id: 16
        }, {
            t: "app",
            id: 17
        }, {
            t: "app",
            id: 2
        }]
    }]);
    window.webTop && (f = [50, 2, 17, 16, 6, 48, 49, 26, 3401, 3693, 10, 13, 8992, 3402, 2534, 64, 18, 20, 2528, 45, 2526, 56, 15, 3148, 21, 7, 5, 2250, 2535, 4494, 3070, 3988, 8058, 3147], h = [{
        id: 0,
        t: "dir",
        n: "\u684c\u97621",
        items: [{
            t: "app",
            id: 48
        }, {
            t: "app",
            id: 49
        }, {
            t: "app",
            id: 26
        }, {
            t: "dir",
            id: 1E3,
            pid: 0,
            n: "\u6e38\u620f",
            items: [{
                t: "app",
                id: 4494
            }, {
                t: "app",
                id: 3070
            }]
        }]
    }, {
        id: 1,
        t: "dir",
        n: "\u684c\u97622",
        items: [{
            t: "app",
            id: 3401
        }, {
            t: "app",
            id: 3693
        }, {
            t: "app",
            id: 10
        }, {
            t: "app",
            id: 13
        }]
    }, {
        id: 2,
        t: "dir",
        n: "\u684c\u97623",
        items: [{
            t: "app",
            id: 8992
        }, {
            t: "app",
            id: 3402
        }, {
            t: "app",
            id: 2534
        }, {
            t: "app",
            id: 6
        }, {
            t: "app",
            id: 64
        }, {
            t: "app",
            id: 18
        }, {
            t: "app",
            id: 20
        }, {
            t: "dir",
            id: 1001,
            pid: 2,
            n: "\u5a31\u4e50",
            items: [{
                t: "app",
                id: 3988
            }, {
                t: "app",
                id: 8058
            }, {
                t: "app",
                id: 3147
            }]
        }]
    }, {
        id: 3,
        t: "dir",
        n: "\u684c\u97624",
        items: [{
            t: "app",
            id: 2528
        }, {
            t: "app",
            id: 45
        }, {
            t: "app",
            id: 2526
        }, {
            t: "app",
            id: 56
        }, {
            t: "app",
            id: 15
        }, {
            t: "app",
            id: 3148
        }]
    }, {
        id: 4,
        t: "dir",
        n: "\u684c\u97625",
        items: [{
            t: "app",
            id: 21
        }, {
            t: "app",
            id: 7
        }, {
            t: "app",
            id: 5
        }, {
            t: "app",
            id: 2250
        }, {
            t: "app",
            id: 2535
        }]
    }, {
        id: 5,
        t: "dir",
        n: "dock",
        items: [{
            t: "app",
            id: 50
        }, {
            t: "app",
            id: 16
        }, {
            t: "app",
            id: 17
        }, {
            t: "app",
            id: 2
        }]
    }]);
    l = {
        id: "theme_blue_glow"
    };
    window.webTop && (l = {
        id: "theme_blue_glow"
    });
    o = {
        id: "",
        mode: "repeat",
        url: ""
    };
    t = {};
    var n = ["app_id", "app_lang", "app_nonce", "app_openid", "app_openkey", "app_ts", "sig"];
    this.configList = {
        theme: a.clone(l),
        wallpaper: a.clone(o),
        wallpaperList: [].concat(),
        appearance: a.clone(t),
        dockLoca: "left",
        navTop: 1,
        defaultScreen: 3,
        desktopList: h.concat(),
        hasRecentFolder: !1,
        defaultSetupAppList: f,
        setupAppList: f.concat()
    };
    this.onSetConfig = function () {};
    this.onEQQConfigGetSuc = function (b) {
        a.profile("getEQQCustomSuccess start!");
        this.uacResult = b = b.result ? b.result : [];
        for (var c in b) {
            var e = b;
            if (e.chatboxMode) this.configList.chatboxMode = "free";
            if (e.isNotNeedCtrlKey) this.configList.isNotNeedCtrlKey = e.isNotNeedCtrlKey;
            if (e.fontFormat) this.configList.fontFormat = e.fontFormat
        }
    };
    var p = /^http(s)?:\/\/.+/i;
    this.onConfigGetSuc = function (e) {
        a.profile("getCustomSuccess start!");
        alloy.portal.speedTest.sRTS(4, "end", new Date, !0);
        var d = e.result ? e.result : [];
        this.uacResult = d;
        var f = 0;
        e.retcode == 20554 ? k = c.isNewUser = !0 : c.isNewUser = !1;
        for (var h in d) {
            if (h == "0") {
                e = d["0"];
                if (e.theme && e.theme != "") this.configList.theme.id = e.theme;
                if (e.wallpaper && e.wallpaper != "" && e.wallpaper.id != "" && (this.configList.wallpaper = e.wallpaper, !p.test(this.configList.wallpaper.url))) this.configList.wallpaper = a.clone(o);
                if (e.wallpaperList && e.wallpaperList != "") this.configList.wallpaperList = e.wallpaperList;
                if (e.appearance && e.appearance != "") this.configList.appearance.id = e.appearance;
                this.configList.runStatus = e.runWidgets ? e.runWidgets : "";
                if (e.dockLoca) this.configList.dockLoca = e.dockLoca;
                if (e.navTop !== null) this.configList.navTop = e.navTop;
                if (e.defaultScreen) this.configList.defaultScreen = e.defaultScreen;
                if (e.isShowTip) this.configList.isShowTip = e.isShowTip;
                if (e.notifySetting) this.configList.notifySetting = e.notifySetting;
                if (e.msgBubblePos) this.configList.msgBubblePos = e.msgBubblePos;
                if (e.isNoContactNotify) this.configList.isNoContactNotify = e.isNoContactNotify;
                if (e.hasRecentFolder) this.configList.hasRecentFolder = e.hasRecentFolder;
                if (e.desktopIconStyle) this.configList.desktopIconStyle = e.desktopIconStyle;
                if (e.setupAppList) {
                    var j = e.setupAppList;
                    if (a.isArray(j)) this.configList.setupAppList = j.length == 0 ? [] : j;
                    else {
                        if (a.isObject(j)) {
                            var g = [],
                                n;
                            for (f in j)(n = parseInt(j[f])) && g.push(n);
                            this.configList.setupAppList = g
                        } else this.configList.setupAppList = [];
                        k = !0;
                        x();
                        alloy.util.report2m(151400)
                    }
                    k = !0
                } else k = !0, x();
                if (e.diskList) this.configList.diskList = e.diskList;
                if (e.defaultDisk) this.configList.defaultDisk = e.defaultDisk;
                a.out("isSetupAppListLoaded: " + k)
            }
            if (h == "50") {
                e = d["50"];
                if (e.chatboxMode) this.configList.chatboxMode = "free";
                if (e.isNotNeedCtrlKey) this.configList.isNotNeedCtrlKey = e.isNotNeedCtrlKey;
                if (e.fontFormat) this.configList.fontFormat = e.fontFormat;
                this.configList.useBigHead = e.useBigHead != null ? e.useBigHead : 7
            }
        }
        b.notifyObservers(alloy.portal, "SimpleUACReady", {
            uacLoaded: 0
        });
        a.profile("getUACCustomSuccess finish!");
        qqweb.util.report2h("get_custom", "end", "ok")
    };
    var D = function () {
        B()
    }, e = function () {
        k = !1
    }, j = 1,
        B = function () {
            for (var e = c.getSetupAppList(), d = {
                0: ["notifications"]
            }, f = 0; f < e.length; f++) d[e[f]] = ["notifications"];
            qqweb.rpcService.sendGetConfig({
                action: "mget",
                context: this,
                data: {
                    r: {
                        appid: d
                    }
                },
                onSuccess: function (e) {
                    j = 2;
                    if (e.retcode == 0 || e.retcode == 20554) {
                        if (e.retcode == 20554) {
                            e.result = {};
                            for (var d = c.getSetupAppList(), f = 0; f < d.length; f++) e.result[d[f]] = {
                                notifications: null
                            }
                        }
                        c.myAppConfigList = c.myAppConfigList || {};
                        e.result[0] && a.isNumber(e.result[0].notifications) ? c.setGlobalNotifications(e.result[0].notifications) : c.setGlobalNotifications(alloy.notifier && alloy.notifier.ENABLE_FLAGS.ENABLE_ALL);
                        for (var h in e.result) h != 0 && (a.isNumber(e.result[h].notifications) ? c.setNotifications(h, e.result[0].notifications) : c.setNotifications(h, null));
                        j = 0
                    }
                    b.notifyObservers(alloy.system, "notifySettingReady")
                }
            })
        };
    this.getGlobalNotifications = function () {
        return j == 0 ? c.myAppConfigList[0].notifications : 0
    };
    this.setGlobalNotifications = function (a) {
        0 in c.myAppConfigList || (c.myAppConfigList[0] = {});
        c.myAppConfigList[0].notifications = a
    };
    this.getMergedNotifications = function (a) {
        if (j != 0) return 0;
        a = c.getNotifications(a);
        if (a === null) a = alloy.notifier.ENABLE_FLAGS.ENABLE_ALL;
        return a & c.getGlobalNotifications()
    };
    this.getNotifications = function (a) {
        return (a = c.myAppConfigList[a]) ? a.notifications : null
    };
    this.setNotifications = function (b, e) {
        a.isNumber(e) || (e = null);
        b in c.myAppConfigList || (c.myAppConfigList[b] = {});
        c.myAppConfigList[b].notifications = e
    };
    this.getNotificationsStatus = function () {
        return j
    };
    var x = c.sendSetSetupAppList = function () {
        if (alloy.portal.getLoginLevel() != 1 && k) {
            var a = {
                onSuccess: function () {},
                context: c,
                data: {
                    retype: 1,
                    r: {
                        appid: 0,
                        value: {
                            setupAppList: c.getSetupAppList()
                        }
                    }
                }
            };
            alloy.rpcService.sendSetConfig(a)
        }
    };
    this.getDesktopList = function () {
        return this.configList.desktopList
    };
    this.setDesktopList = function (a) {
        this.configList.desktopList = a
    };
    this.getDefaultDesktopList = function () {
        return h
    };
    this.getMustInstallAppList = function () {
        return s
    };
    this.setAppListQueue = function (a) {
        var b = [],
            c;
        for (c in a) b.push(parseInt(a[c]));
        this.configList.setupAppList = b;
        x()
    };
    this.isInSetupAppList = function (b) {
        return a.array.indexOf(this.getSetupAppList(),
        b) == -1 ? !1 : !0
    };
    this.sendGetAppInfo = function (b, e) {
        var d = function (a) {
            u[a] || (u[a] = 0);
            return ++u[a] > 1
        };
        b.vfwebqq = alloy.portal.getVfWebQQ();
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/qqweb/market/getappinfo.do", {
            context: c,
            method: "POST",
            data: {
                appattrib: a.json.stringify(b),
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: b,
            onSuccess: function (c) {
                c.retcode === 0 ? (c = c.result.resultData, c.folderId = alloy.desktopManager.getCurrentDesktopIndex(), e(c)) : (d("appInfo") || setTimeout(function () {
                    sendGetAppInfo(b)
                },
                3E3), a.out("\u5e94\u7528\u4ecb\u7ecd\u62c9\u53d6\u5931\u8d25" + c.errmsg))
            },
            onError: function () {
                d("appInfo") || setTimeout(function () {
                    sendGetAppInfo(b)
                }, 3E3);
                a.out("\u5e94\u7528\u62c9\u53d6\u5931\u8d25")
            }
        })
    };
    this.addSetupApp = function (a) {
        c.sendGetAppInfo({
            appid: a,
            loadMethod: 0
        }, c.add2SetupAppList)
    };
    this.add2SetupAppList = function (e) {
        if (e.flag == 4 && alloy.portal.getPortalSelf("vipInfo") <= 0) return alloy.layout.confirm('                <div style="margin-top:25px;margin-left:50px;">                <img style="float:left;" src="' + qqweb.CONST.CDN_URL_0 + 'style/images/yellow_warning.png" alt="\u60a8\u8fd8\u672a\u5f00\u901a\u4f1a\u5458"/>                <div style="width:180px;height:60px; font-size:14px;float:left;margin-left:5px;">\u5bf9\u4e0d\u8d77\uff01\u60a8\u8fd8\u4e0d\u662fQQ\u4f1a\u5458\uff0c\u4e0d\u80fd\u4f18\u5148\u4f53\u9a8c\u4f1a\u5458\u4e13\u5c5e\u5e94\u7528</div >                </div>                ', function () {
            window.open("http://pay.qq.com/qqvip/index.shtml?aid=vip.client.webqq.addapp.kaitong")
        }, {
            okButtonDecorator: {
                background: "url(" + qqweb.CONST.CDN_URL_0 + "style/images/vip_open_button.png) -1px",
                width: "83px",
                textIndent: "-999px"
            },
            height: 180,
            autoClose: !0
        }), !1;
        if (c.getSetupAppList().length >= 200) return qqweb.layout.alert("\u5e94\u7528\u6dfb\u52a0\u91cf\u6700\u591a\u4e3a200\u4e2a,\u8bf7\u5220\u51cf\u90e8\u5206\u5e94\u7528\u540e\u518d\u6dfb\u52a0\u3002"), !1;
        else if (!c.isInSetupAppList(e.id) && !d.id("appAlert_category_select_" + e.id)) return a.profile("add2SetupAppList"), qqweb.appconfig.addAppConfig(e), c.getSetupAppList().unshift(e.id),
        x(), b.notifyObservers(c, "AddSetupAppList", e), e.id < 1E5 && alloy.util.report2app("appbar|menu|addapp|" + e.id), !0
    };
    this.setDeleteAppList = function (a) {
        v.push(a)
    };
    this.getDeleteAppList = function () {
        return v
    };
    this.removeSetupAppList = function (e, d, f) {
        a.profile("removeSetupAppList");
        if (e.cannotUninstall) return alloy.layout.alert("\u62b1\u6b49\uff0c\u6b64\u5e94\u7528\u3010" + e.appName + "\u3011\u4e0d\u80fd\u5220\u9664\uff01"), !1;
        alloy.appconfig.removeAppConfig(e);
        this.removeFromRunStatusList(e.id, !0);
        a.array.remove(this.getSetupAppList(),
        parseInt(e.id));
        d !== !1 && (x(), e.id < 1E5 && alloy.util.report2app("appbar|menu|delapp|" + e.id));
        f || b.notifyObservers(c, "RemoveSetupAppList", e)
    };
    this.getSetupAppList = function () {
        return this.configList.setupAppList
    };
    this.getDefaultSetupAppList = function () {
        return this.configList.defaultSetupAppList
    };
    this.isSetupAppListLoaded = function () {
        return k
    };
    this.offlineSetupAppList = function () {
        k = !1;
        this.configList.setupAppList = f.concat()
    };
    this.removeFromRunStatusList = function (b, e) {
        if (this.configList.runStatus) {
            var d = this.configList.runStatus,
                f = !1;
            a.isArray(b) || (b = [b]);
            for (var h in d) {
                var j = Number(h);
                a.array.indexOf(this.getSetupAppList(), j) == -1 && (d[h] = null, delete d[h], f = !0)
            }
            for (var g in b) h = b[g], d[h] && (d[h] = null, delete d[h], f = !0);
            f && !e && (d = {
                data: {
                    retype: 1,
                    r: {
                        appid: 0,
                        value: {
                            runWidgets: c.getRunStatus()
                        }
                    }
                }
            }, alloy.rpcService.sendSetConfig(d))
        }
    };
    this.restoreConfig = function (a) {
        var e = !1,
            d = {};
        if (a.appConfig) e = !0, d.setupAppList = f, b.notifyObservers(c, "RestoreAppList");
        if (a.theme) e = !0, d.theme = l.id, d.wallpaper = o, d.appearance = t;
        if (a.desktopSetting) e = !0, d.dockLoca = "left", d.navTop = 1, d.defaultScreen = 3;
        e && alloy.rpcService.sendSetConfig({
            data: {
                retype: 1,
                r: {
                    appid: 0,
                    value: d
                }
            }
        })
    };
    this.getTheme = function () {
        return this.configList.theme
    };
    this.setTheme = function (b) {
        a.profile("setTheme");
        if (!(alloy.portal.getLoginLevel() < 2) && b) {
            var c = {};
            c.data = {
                retype: 1,
                r: {
                    appid: 0,
                    value: {
                        theme: b
                    }
                }
            };
            alloy.rpcService.sendSetConfig(c);
            this.configList.theme.id = b
        }
    };
    this.getWallpaper = function () {
        return this.configList.wallpaper
    };
    this.setWallpaper = function (b) {
        a.profile("setWallpaper");
        if (!(alloy.portal.getLoginLevel() < 2) && b) {
            var c = {};
            c.data = {
                retype: 1,
                r: {
                    appid: 0,
                    value: {
                        wallpaper: b
                    }
                }
            };
            alloy.rpcService.sendSetConfig(c);
            this.configList.wallpaper = b
        }
    };
    this.getWallpaperList = function () {
        return this.configList.wallpaperList
    };
    this.getRunStatus = function () {
        return this.configList.runStatus
    };
    this.getDefaultRunWidget = function () {
        return m
    };
    this.addWallpaper = function (b) {
        a.array.indexOf(this.configList.wallpaperList, b.id) == -1 && this.configList.wallpaperList.push(b.fileId)
    };
    this.removeWallpaper = function (b) {
        a.array.remove(this.getWallpaperList(),
        b.fileId)
    };
    this.getAppearance = function () {
        return this.configList.appearance
    };
    this.setAppearance = function (b) {
        a.profile("setAppearance");
        if (!(alloy.portal.getLoginLevel() < 2) && b) {
            var c = {};
            c.data = {
                retype: 1,
                r: {
                    appid: 0,
                    value: {
                        appearance: b
                    }
                }
            };
            alloy.rpcService.sendSetConfig(c);
            this.configList.appearance.id = b
        }
    };
    this.setCustomTheme = function (b) {
        a.profile("setCustomTheme");
        if (!(alloy.portal.getLoginLevel() < 2) && b.wallpaper) {
            var c = b.skin,
                e = b.wallpaper,
                b = {};
            b.data = {
                retype: 1,
                r: {
                    appid: 0,
                    value: {
                        appearance: c,
                        wallpaper: e
                    }
                }
            };
            alloy.rpcService.sendSetConfig(b);
            this.configList.appearance.id = c;
            this.configList.wallpaper = e
        }
    };
    this.isDeveloper = function () {
        return !!qqweb.config.uacResult["0"].isDeveloper
    };
    this.setThemeAndCustomTheme = function (a, b, c) {
        if (!(alloy.portal.getLoginLevel() < 2)) {
            c = c || "";
            this.configList.appearance.id = c;
            this.configList.wallpaper = b;
            this.configList.theme.id = a;
            var e = {};
            if (a) e.theme = a;
            if (b) e.appearance = c, e.wallpaper = b;
            a = {};
            a.data = {
                retype: 1,
                r: {
                    appid: 0,
                    value: e
                }
            };
            alloy.rpcService.sendSetConfig(a)
        }
    };
    this.getDiskList = function () {
        return this.configList.diskList
    };
    this.getDefaultDisk = function () {
        return this.configList.defaultDisk
    };
    this.init = function () {
        alloy.util.report2h("get_custom", "start");
        b.addObserver(alloy.system, "UACReady", D);
        b.addObserver(alloy.appconfig, "GetAppConfigError", e);
        var d = {
            appid: {
                0: ["theme", "wallpaper", "wallpaperList", "appearance", "setupAppList", "isShowTip", "runWidgets", "msgBubblePos", "notifySetting", "isDeveloper", "dockLoca", "defaultScreen", "navTop", "hasRecentFolder", "defaultDisk", "diskList", "desktopIconStyle"],
                50: ["chatboxMode", "isNotNeedCtrlKey", "fontFormat", "useBigHead"]
            }
        };
        a.profile("getCustom");
        typeof progress == "function" && progress("get_uac start");
        var f = 0,
            h = function () {
                j.data.r = d;
                qqweb.rpcService.sendGetConfig(j);
                f++
            }, j = {
                onSuccess: qqweb.config.onConfigGetSuc,
                action: "mget",
                context: this,
                onError: function () {
                    typeof progress == "function" && progress("get_uac error", 0);
                    alloy.util.report2qqweb("config|uac|error");
                    f == 0 ? h() : timeoutConfirm("\u81ea\u5b9a\u4e49\u4fe1\u606f\u83b7\u53d6\u51fa\u9519,\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f\n\u70b9\u53d6\u6d88\u4f7f\u7528\u9ed8\u8ba4\u914d\u7f6e\u3002") || b.notifyObservers(alloy.portal, "SimpleUACReady", {
                        uacLoaded: 1
                    })
                },
                onTimeout: function () {
                    alloy.util.report2qqweb("config|uac|timeout");
                    typeof progress == "function" && progress("get_uac timeout", 0);
                    f == 0 ? h() : timeoutConfirm("\u81ea\u5b9a\u4e49\u4fe1\u606f\u83b7\u53d6\u8d85\u65f6,\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f\n\u70b9\u53d6\u6d88\u4f7f\u7528\u9ed8\u8ba4\u914d\u7f6e\u3002") || b.notifyObservers(alloy.portal, "SimpleUACReady", {
                        uacLoaded: 2
                    })
                },
                data: {
                    r: d
                }
            };
        b.notifyObservers(c, "BeforeGetUAC");
        qqweb.rpcService.sendGetConfig(j)
    };
    c.__eqqid = 50;
    this.sendsetAppNotify = function (b, e) {
        a.profile("sendsetAppNotify");
        alloy.portal.getLoginLevel() != 1 && k && alloy.rpcService.sendSetConfig({
            onSuccess: function () {},
            context: c,
            data: {
                retype: 1,
                r: {
                    appid: b,
                    value: {
                        notifications: e
                    }
                }
            }
        })
    };
    this.requestGrant = function (e) {
        var d = !0;
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/qqweb/app/loadappnew.do", {
            context: c,
            data: {
                r: a.json.stringify({
                    appid: e.gaid ? 0 : e.appId,
                    id: e.gaid,
                    loginParam: e.loginParam || ""
                })
            },
            method: "POST",
            arguments: e,
            onSuccess: function (c) {
                if (0 !== c.retcode) a.isFunction(e.onSuccess) && e.onSuccess({
                    auth: !1
                });
                else {
                    d = !1;
                    var f = c.result,
                        c = c.arguments,
                        h = alloy.portal.getAllConfig(c.appId);
                    h.exinfo.isAuth = 1;
                    var j = g.parseURL(h.appUrl);
                    if (null !== j) {
                        var m = {};
                        j.query && (m = g.mapQuery("?" + j.query));
                        for (var x = 0, p = n.length; x < p; x++) {
                            var k = n[x];
                            k in f && (m[k] = f[k])
                        }
                        j.query = g.toQueryString(m);
                        h.selfConfig.appUrl = g.buildURL(j)
                    }
                    alloy.portal.cacheOpenkey({
                        appId: c.appId,
                        gaid: f.app_id,
                        openId: f.app_openid,
                        openKey: f.app_openkey
                    });
                    (e.authType || 0) != 1 && alloy.portal.runApp(h.id);
                    var c = ["app_id", "app_nonce", "app_lang", "app_userip", "app_ts", "sig"],
                        l;
                    for (l in c) a.isUndefined(f[c[l]]);
                    a.isFunction(e.onSuccess) && e.onSuccess({
                        auth: !0,
                        param: f
                    });
                    l = alloy.system.getApp(e.appId);
                    b.notifyObservers(l, "openId", {
                        openId: f.app_openid
                    })
                }
            },
            onComplete: function () {
                d && alloy.layout.alert("\u6388\u6743\u4fe1\u606f\u67e5\u8be2\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01");
                d = null
            }
        })
    };
    this.renewalGrant = function (a) {
        var b = alloy.portal.getAllConfig(a.appId);
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "api/system/redoauth", {
            context: c,
            data: {
                appid: b.gaid,
                gaid: b.gaid,
                app_openkey: a.openKey,
                app_openid: a.openId
            },
            method: "GET",
            arguments: a,
            onSuccess: function (a) {
                0 === a.retcode && alloy.portal.cacheOpenkey({
                    renewal: !0,
                    appId: a.arguments.appId
                })
            }
        })
    };
    this.reRequestGrant = function (b) {
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/qqweb/app/loadappnew.do", {
            context: c,
            data: {
                r: a.json.stringify(appid > 2E8 ? {
                    appid: 0,
                    id: b.appId
                } : {
                    appid: b.appId
                })
            },
            method: "POST",
            arguments: b,
            onSuccess: function (b) {
                var c = b.result,
                    e = b.arguments;
                0 === b.retcode && alloy.portal.cacheOpenkey({
                    appId: e.appId,
                    gaid: c.app_id,
                    openId: c.app_openid,
                    openKey: c.app_openkey
                });
                a.isFunction(e.onSuccess) && e.onSuccess(b)
            }
        })
    };
    this.setPortalConfig = function (a, b) {
        alloy.config.configList[a] = b;
        var e = {
            retype: 1,
            r: {
                appid: 0
            }
        };
        e.r.value = {};
        e.r.value[a] = b;
        alloy.rpcService.sendSetConfig({
            onSuccess: function () {},
            context: c,
            data: e
        })
    };
    this.getHttpsSetting = function () {
        a.isUndefined(r) && (r = Number(a.cookie.get("usehttps")));
        return r
    };
    this.setHttpsSetting = function (b) {
        r = Number(b);
        a.cookie.set("usehttps",
        r, alloy.CONST.DOMAIN, "/", 87600)
    }
});
Jx().$package("alloy.fileSystem", function (a) {
    var c = this,
        b = a.event,
        b = a.event,
        d = a.string,
        g = this.FILE_TYPE = {
            FOLDER: "dir",
            FILE: "file",
            APP: "app",
            BUDDY: "uin",
            GROUP: "gid"
        }, k = {}, l = {}, o = this.MAX_FOLDER_AMOUNT = 200,
        t = !1,
        r = !1,
        u, v = !1,
        s = !1,
        m = 0,
        f = function (a) {
            return a === null || typeof a === "undefined"
        }, h = function () {
            return s || alloy.portal.getLoginLevel() == alloy.CONST.LOGIN_LEVEL_NONE
        }, n = function () {
            var a = alloy.config.getDesktopList() || [];
            u = {
                t: g.FOLDER,
                id: -1,
                n: "root",
                items: a
            }
        }, p = this.getRootFolder = function () {
            u || n();
            return u
        },
        D = function (a, b, c) {
            if (a.items) for (var e in a.items) {
                var d = a.items[e];
                if (b(d, a.items) === !1) break;
                d.t == g.FOLDER && c && D(d, b, !0)
            }
        }, e = function (a) {
            a = a || p();
            D(a, function (a) {
                k[a.t] || (k[a.t] = {});
                k[a.t][a.id] || l[a.t]++;
                if (a.t == alloy.fileSystem.FILE_TYPE.FOLDER && !a.c) a.c = "folder";
                k[a.t][a.id] = a
            }, !0)
        }, j = function (a, b, c) {
            if (!a.items) return null;
            for (var e in a.items) {
                var d = a.items[e];
                if (d.t == g.FOLDER) if (d.id == b) return d;
                else if (c && (d = j(d, b, c))) return d
            }
            return null
        }, B = function (a, b, c) {
            if (!a.items) return null;
            for (var e in a.items) {
                var d = a.items[e];
                if (d.id == b.id && d.t == b.t) return a;
                else if (d.t == g.FOLDER && c && (d = B(d, b, c))) return d
            }
            return null
        }, x = function (a, b, c) {
            if (!a.items) return null;
            for (var e = 0, d = a.items.length; e < d; e++) {
                var f = a.items[e];
                if (f.id == b.id && f.t == b.t) return {
                    parent: a,
                    file: f,
                    position: e
                };
                else if (f.t == g.FOLDER && c && (f = x(f, b, c))) return f
            }
            return null
        };
    this.getFolderById = function (a, b) {
        return a == -1 ? p() : k[g.FOLDER][a] ? k[g.FOLDER][a] : (b = b || p(), j(b, a, !0))
    };
    this.getFolderByName = function (a) {
        var b = k[g.FOLDER] || {}, c;
        for (c in b) if (b[c].n === a) return b[c];
        return null
    };
    this.getFolderByFile = function (a, b) {
        b = b || p();
        return a.t == g.FOLDER ? this.getFolderById(a.pid, b) : B(b, a, !0)
    };
    this.getFolderIdByFile = function (a, b) {
        var c = this.getFolderByFile(a, b);
        return c ? c.id : null
    };
    this.getFolderInfoByFolder = function (a, b) {
        b = b || p();
        if (f(a.pid)) {
            var c = x(b, a, !0);
            if (c) return {
                file: c.file,
                parent: c.folder,
                position: c.position
            }
        } else {
            for (var c = this.getFolderById(a.pid, b), e = 0, d = c.items.length; e < d; e++) {
                var h = c.items[e];
                if (h.id == a.id && h.t == g.FOLDER) return {
                    file: h,
                    parent: c,
                    position: e
                }
            }
            throw Error("the parent folder id is not correct!");
        }
        return null
    };
    this.getFileInfoByFile = function (a, b, c) {
        b = b || p();
        f(c);
        return x(b, a, !0)
    };
    this.getFileByFile = function (a) {
        return k[a.t] ? k[a.t][a.id] : null
    };
    this.getFilesByType = function (a) {
        return k[a] ? k[a] : null
    };
    this.getFilesByParent = function (a, b) {
        var c = this.getFolderById(a);
        if (c) if (b) {
            var e = [],
                d, f;
            for (f in c.items) d = c.items[f], d.t == b && e.push(d);
            return e
        } else return c.items;
        else throw Error("the parent folder id is not correct!");
    };
    this.getFileAmount = function (a) {
        if (a) return l[a];
        else {
            var a = 0,
                b;
            for (b in l) a += l[b];
            return a
        }
    };
    this.getFileByFileName = function (b, c, e, d) {
        var e = e || p(),
            d = a.isUndefined(d) ? !0 : d,
            c = c || [],
            f = [];
        D(e, function (a) {
            if (c && !(String(c).toLowerCase().indexOf(a.t) > -1)) return !0;
            if (a.n && a.n == b) return f.push(a), !1
        }, d);
        return f
    };
    this.searchFileByFileName = function (b, c, e, d) {
        var e = e || p(),
            d = a.isUndefined(d) ? !0 : d,
            c = c || "",
            f = [];
        D(e, function (a) {
            if (c && !(String(c).toLowerCase().indexOf(a.t) > -1)) return !0;
            a.n && String(a.n).toLowerCase().indexOf(b) > -1 && f.push(a)
        }, d);
        return f
    };
    this.isInFolder = function (a, b, c) {
        return !!x(b, a, c)
    };
    var y = function (a, e, d, h) {
        var j = e.items ? e.items : e.items = [];
        !f(d) && d !== -1 ? j.splice(d, 0, a) : (j.push(a), d = j.length - 1);
        if (a.t == g.FOLDER || a.t == g.FILE) a.pid = e.id;
        k[a.t][a.id] || l[a.t]++;
        k[a.t][a.id] = a;
        a = {
            parent: e,
            file: a,
            position: d
        };
        h || b.notifyObservers(c, "FileAdd", a);
        return a
    };
    this.createFile = function (a, b, c, e, d) {
        var j = !0;
        h() && (j = !1);
        var q = this.getFolderById(b);
        if (q) {
            if (a.t == g.FOLDER) a.pid = b, a.items = a.items || [];
            if (f(c)) c = q.items.length;
            j ? (b = {
                fileList: [a],
                parent: q,
                position: c,
                callback: e
            }, b.noProcessStatus = d, F([a], q.id, c, null, b)) : (a.id = +new Date + m++, y(a, q, c, d))
        }
    };
    this.addFile = function (a, b, c, e, d) {
        h() && (e = !1);
        var b = f(b) ? 2 : Number(b),
            j = this.getFolderById(b);
        if (j) {
            a.id = Number(a.id);
            if (f(c) || c == -1) c = j.items.length;
            if (e) F([a], b, c, null, {
                fileList: [a],
                parent: j,
                position: c
            });
            else return y(a, j, c, d)
        } else throw Error("folder: " + b + " is not exist!");
    };
    this.addFiles = function (a, b, c, e, d) {
        h() && (e = !1);
        var b = f(b) ? 2 : Number(b),
            j = this.getFolderById(b);
        if (j) {
            if (f(c) || c == -1) c = j.items.length;
            if (e) F(a, b, c, null, {
                fileList: a,
                parent: j,
                position: c
            });
            else for (var q in a) this.addFile(a[q], b, null, !1, d)
        } else throw Error("folder: " + b + " is not exist!");
    };
    var A = function (a, e, d, h, j) {
        if (f(d)) d = c.getFileInfoByFile(a).position;
        e.items.splice(d, 1);
        if (a.t === g.FOLDER) {
            if (h && a.items && a.items.length) for (h = a.items.length - 1; h >= 0; h--) A(a.items[h], a, h, !0, j);
            delete a.pid
        }
        k[a.t][a.id] && l[a.t]--;
        k[a.t][a.id] = null;
        delete k[a.t][a.id];
        a = {
            parent: e,
            file: a,
            position: d
        };
        j || b.notifyObservers(c, "FileDelete",
        a);
        return a
    };
    this.deleteFile = function (a, b, c, e, d, j) {
        h() && (d = !1);
        if (a.t == g.FOLDER && f(b)) b = a.pid;
        var q, z = !1;
        if (f(b)) {
            if (a = this.getFileInfoByFile(a)) z = a.file, q = a.parent, c = a.position
        } else if (q = this.getFolderById(b), f(c)) {
            if (a = this.getFileInfoByFile(a, q, !1)) z = a.file, q = a.parent, c = a.position
        } else z = q.items[c];
        if (q && z) {
            if (z.t === g.FOLDER && z.items && z.items.length && !e) throw Error("the folder " + z.id + ' is not empty and isCascade is "' + !! e + '"!');
            if (d) G([z], q.id, null, {
                fileList: [z],
                parent: q,
                position: c,
                isCascade: e
            });
            else return A(z, q, c, e, j)
        } else return !1
    };
    this.deleteFiles = function (a, b, c, e) {
        h() && (c = !1);
        var d = this.getFolderById(b);
        if (d) if (c) G(a, d.id, null, {
            fileList: a,
            parent: d
        });
        else for (c = a.length - 1; c >= 0; c--) this.deleteFile(a[c], b, null, !0, !1, e);
        else return !1
    };
    var w = function (a, e, d, f, h, j) {
        A(a, f, h, !1, !0);
        y(a, e, d, !0);
        a = {
            file: a,
            targetId: e.id,
            targetPosition: d,
            sourceId: f.id,
            sourcePosition: h
        };
        j || b.notifyObservers(c, "FileMove", a);
        return a
    };
    this.moveFile = function (a, b, c, e, d, j, q) {
        h() && (j = !1);
        var z, n;
        f(e) ? a = this.getFileInfoByFile(a) : (n = this.getFolderById(e), a = this.getFileInfoByFile(a, n));
        if (a) n = a.parent, e = a.parent.id, d = a.position;
        else return !1;
        a = a.file;
        z = this.getFolderById(b);
        if (f(c) || c == -1) c = z.items.length;
        if (e == b) {
            if (c > z.items.length) c = z.items.length;
            c > d && c--;
            if (c == d) return !1
        }
        if (j) J([a], b, c, e, d, null, {
            fileList: [a],
            targetFolder: z,
            targetPosition: c,
            sourceFolder: n,
            sourcePosition: d
        }), (a.t == g.BUDDY || a.t == g.GROUP) && qqweb.util.report2qqweb("deskcontact|use|move");
        else return b == 5 && b != e && W(!1), w(a, z, c, n, d, q)
    };
    this.copyFile = function (a,
    b, c) {
        var e = {}, d = {};
        arguments = {};
        var f = this.getFolderById(b),
            e = {
                objs: [a],
                dest: f
            };
        arguments = {
            fileList: [a],
            parent: f
        };
        d.data = e;
        d.arguments = arguments;
        d.onSuccess = c || H.onCopyFileSuccess;
        N(d)
    };
    this.fileDownload = function (a, b) {
        var c = {}, e = {};
        arguments = {};
        c = {
            objs: [a]
        };
        arguments = {
            fileList: [a]
        };
        e.data = c;
        e.arguments = arguments;
        e.onSuccess = b || function () {};
        e.action = "get_files";
        e.methon = "POST";
        C(e)
    };
    this.getFolderItems = function (a, b) {
        var c = {}, e = {};
        arguments = {};
        c = {
            obj: a,
            providers: alloy.storage.getBoundDisk()
        };
        arguments = {
            obj: a
        };
        e.data = c;
        e.arguments = arguments;
        e.onSuccess = b || H.onGetFolderItemSuccess;
        M(e)
    };
    this.openFile = function (b, c) {
        b.cookie_name && a.cookie.set(b.cookie_name, b.cookie_value, alloy.CONST.MAIN_DOMAIN, "", 0.5);
        var e = alloy.util.getFileExt(b.n).toLowerCase(),
            d = {};
        switch (e) {
        case "jpg":
        case "jpeg":
        case "bmp":
        case "png":
        case "gif":
            d = {
                type: e,
                files: [{
                    url: c,
                    title: b.n
                }]
            };
            break;
        case "txt":
        case "doc":
        case "docx":
        case "ppt":
        case "pptx":
        case "xls":
        case "xlsx":
        case "pdf":
            d = {
                type: e,
                files: [{
                    obj: b,
                    url: c,
                    title: b.n
                }]
            }
        }
        alloy.system.openFile(d)
    };
    this.cleanFiles = function (a, b) {
        var c = {}, e = {};
        arguments = {};
        c = {
            provider: a
        };
        arguments = {
            provider: a
        };
        e.data = c;
        e.arguments = arguments;
        e.onSuccess = b || H.onCleanFilesSuccess;
        e.action = "clean_files_by_provider";
        e.method = "POST";
        C(e)
    };
    var q = function (a, e) {
        var d = c.getFileByFile(a);
        if (!d) return !1;
        if (!f(a.n)) d.n = a.n;
        e || b.notifyObservers(c, "FileUpdate", d);
        return d
    };
    this.isFileNameExist = function (b, c, e) {
        var c = a.isUndefined(e) ? k[c] : this.getFilesByParent(e),
            d;
        for (d in c) if (c[d].n == b) return !0;
        return !1
    };
    this.isFileNameAvailable = function (a, b, e) {
        var f = "\u6587\u4ef6\u5939";
        b == g.FILE && (f = "\u6587\u4ef6");
        if (a.replace(/[\\/:*?"<>|]/g, "") != a) return f + '\u540d\u79f0\u4e0d\u80fd\u5305\u542b\\/:*?"<>|\u7b49\u7279\u6b8a\u5b57\u7b26';
        if (a.replace(/\s/g, "") == "") return f + "\u540d\u79f0\u4e0d\u80fd\u53ea\u5305\u542b\u7a7a\u5b57\u7b26";
        else if (d.byteLength(a) > 48) return f + "\u540d\u79f0\u8fc7\u957f\uff08\u5b57\u6570\u6700\u591a\u4e3a24\u4e2a\u6c49\u5b57\u621648\u4e2a\u5b57\u7b26\uff09";
        else if (c.isFileNameExist(a, b, e)) return f + "\u540d\u79f0\u6709\u51b2\u7a81\uff0c\u8bf7\u8f93\u5165\u65b0\u7684\u540d\u79f0";
        return 0
    };
    this.getDefaultFolderName = function () {
        for (var a = "\u6587\u4ef6\u5939", b = 2; b < o; ++b) {
            if (!alloy.fileSystem.isFileNameExist(a, g.FOLDER)) break;
            a = "\u6587\u4ef6\u5939" + b + ""
        }
        b == o && (a = +new Date);
        return a
    };
    this.updateFile = function (a, b, c) {
        h() && (b = !1);
        var e = this.getFileInfoByFile(a);
        if (!e) return !1;
        a.on = e.file.n;
        if (b) K([a], e.parent.id, null, {
            fileList: [a],
            parent: e.parent
        });
        else return q(a, c)
    };
    this.updateFiles = function (a, b, c, e) {
        h() && (c = !1);
        var d = this.getFolderById(b);
        if (d) if (c) K(a, b, null, {
            fileList: a,
            parent: d
        });
        else for (var f in a) this.updateFile(a[f], !1, e);
        else return !1
    };
    var C = function (b) {
        if (alloy.portal.getLoginLevel() != alloy.CONST.LOGIN_LEVEL_NONE) {
            var b = b || {}, c = b.data || {};
            c.vfwebqq = alloy.portal.getVfWebQQ();
            for (var e in c) if (a.isObject(c[e]) || a.isArray(c[e])) c[e] = a.json.stringify(c[e]);
            b.data = c;
            b.method = b.method || "GET";
            b.onError = b.onError || H.onRequestError;
            b.onTimeout = b.onTimeout || H.onRequestTimeout;
            alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/top/" + b.action, b)
        }
    }, F = function (a, e, d, h, j, q) {
        !q && r ? b.notifyObservers(c, "FileProcessing", a) : (r = !0, e = {
            objs: a,
            pid: e,
            ti: d < 0 ? 0 : d
        }, j = j || {}, j.noProcessStatus = f(j.noProcessStatus) ? q : j.noProcessStatus, j = {
            data: e,
            arguments: j
        }, j.onSuccess = h || H.onAddFileSuccess, j.onError = H.onAddFileError, j.onTimeout = H.onAddFileTimeout, j.action = "create", j.method = "POST", C(j), I(a, "create"))
    }, G = function (a, e, d, h, j) {
        if (!j && r) b.notifyObservers(c, "FileProcessing", a);
        else {
            r = !0;
            var q = [],
                z;
            for (z in a) {
                var n = a[z];
                if (!j && P(n, !0)) return;
                q.push({
                    t: n.t,
                    id: n.id
                })
            }
            e = {
                did: e,
                objs: q
            };
            h = h || {};
            h.noProcessStatus = f(h.noProcessStatus) ? j : h.noProcessStatus;
            h = {
                data: e,
                arguments: h
            };
            h.onSuccess = d || H.onDeleteFileSuccess;
            h.action = "remove";
            h.method = "POST";
            C(h);
            I(a, "del")
        }
    }, J = function (a, e, d, h, j, q, z, n) {
        if (!n && r) b.notifyObservers(c, "FileProcessing", a);
        else {
            r = !0;
            var g = [],
                m;
            for (m in a) {
                var A = a[m];
                if (!n && P(A, !0)) return;
                g.push({
                    t: A.t,
                    id: A.id
                })
            }
            z = z || {};
            z.noProcessStatus = f(z.noProcessStatus) ? n : z.noProcessStatus;
            z = {
                arguments: z
            };
            if (e == h) z.action = "order", z.data = {
                did: h,
                from: j,
                to: d,
                count: g.length
            };
            else if (z.action = "move", z.data = {
                objs: g,
                did: h,
                tid: e,
                ti: d < 0 ? 0 : d
            }, e === 5) z.data.limit = 5, z.data.ofd = h;
            z.onSuccess = q || H.onMoveFileSuccess;
            z.method = "POST";
            C(z);
            I(a, "move")
        }
    }, K = this.sendUpdateFiles = function (a, e, d, h, j) {
        if (!j && r) b.notifyObservers(c, "FileProcessing", a);
        else {
            r = !0;
            var z = [],
                q;
            for (q in a) {
                var n = a[q];
                if (!j && P(n, !0)) return;
                var g = {
                    t: n.t,
                    id: n.id,
                    n: n.n
                };
                if (!f(n.n)) g.n = n.n, g.on = n.on;
                z.push(g)
            }
            e = {
                did: e,
                objs: z
            };
            h = h || {};
            h.noProcessStatus = f(h.noProcessStatus) ? j : h.noProcessStatus;
            h = {
                data: e,
                arguments: h
            };
            h.onSuccess = d || H.onUpdateFileSuccess;
            h.action = "modify";
            h.method = "POST";
            C(h);
            I(a, "modify")
        }
    };
    this.sendUpdateProgress = function (a) {
        a.action = "update_progress";
        a.method = "POST";
        C(a)
    };
    var N = this.sendCopyFile = function (a) {
        a.action = "copy_file";
        a.method = "POST";
        C(a)
    };
    this.sendFileMove = function (a) {
        a.action = "file_move";
        a.method = "POST";
        C(a)
    };
    var M = this.sendGetFolderItem = function (a) {
        a.action = "get_folder";
        a.method = "POST";
        C(a)
    }, I = function (a, b) {
        var c = a[0];
        c.t == g.FOLDER ? alloy.util.report2qqweb("file|" + b + "|folder") : c.t == g.APP ? alloy.util.report2qqweb("file|" + b + "|app") : (c.t == g.BUDDY || c.t == g.GROUP) && alloy.util.report2qqweb("file|" + b + "|contact")
    }, Q = function () {
        alloy.util.report2h("get_file_system", "start");
        a.profile("getDesktopStart");
        typeof progress == "function" && progress("get_file_system start");
        var b = 0,
            c = "pc";
        a.platform.iPad ? c = "pad" : window.webTop && (c = "air");
        var e = {
            onSuccess: H.onGetFileSystemConfigSuccess,
            context: this,
            data: {
                from: c
            },
            onError: function () {
                alloy.util.report2m(151396);
                alloy.util.report2qqweb("config|file|error");
                a.error("getDesktopError");
                typeof progress == "function" && progress("get_file_system error", 0);
                b == 0 ? (R(e), b++) : timeoutConfirm("\u8bfb\u53d6\u6587\u4ef6\u4fe1\u606f\u51fa\u9519\uff0c\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f\n\u70b9\u53d6\u6d88\u4f7f\u7528\u9ed8\u8ba4\u6587\u4ef6\u914d\u7f6e\u3002") || (s = !0, alloy.config.offlineSetupAppList(), L())
            },
            onTimeout: function () {
                alloy.util.report2m(151395);
                alloy.util.report2qqweb("config|file|timeout");
                a.error("getDesktopTimeout");
                typeof progress == "function" && progress("get_file_system timeout", 0);
                b == 0 ? (R(e),
                b++) : timeoutConfirm("\u8bfb\u53d6\u6587\u4ef6\u4fe1\u606f\u8d85\u65f6\uff0c\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f\n\u70b9\u53d6\u6d88\u4f7f\u7528\u9ed8\u8ba4\u6587\u4ef6\u914d\u7f6e\u3002") || (s = !0, alloy.config.offlineSetupAppList(), L())
            }
        };
        R(e)
    }, R = function (a) {
        a.action = "get_desk";
        a.method = "GET";
        C(a)
    }, H = {
        onBeforeGetUAC: function () {
            t = !1
        },
        onSimpleUACReady: function (a) {
            a.uacLoaded ? (s = !0, v = !1) : (s = !1, v = !0);
            v && alloy.portal.getLoginLevel() > alloy.CONST.LOGIN_LEVEL_NONE ? alloy.config.isNewUser ? (alloy.config.restoreConfig({
                appConfig: 1
            }),
            L()) : Q() : (s = !0, L())
        },
        onGetFileSystemConfigSuccess: function (b) {
            if (b && b.retcode == 0) if (alloy.util.report2h("get_file_system", "end", "ok"), a.profile("getDesktopSuccess"), b = b.result.values, f(b) || alloy.config.setDesktopList(b), b = alloy.config.getDesktopList(), b.length < 5) alloy.util.report2m(151401), a.error("getDesktopFail : desktop data part missing"), timeoutConfirm("\u8bfb\u53d6\u5230\u7684\u684c\u9762\u6570\u636e\u90e8\u5206\u6570\u636e\u4e22\u5931, \u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f\n\u70b9\u53d6\u6d88\u4f7f\u7528\u9ed8\u8ba4\u6587\u4ef6\u914d\u7f6e\u3002") || (s = !0, alloy.config.offlineSetupAppList(), alloy.config.setDesktopList(alloy.config.getDefaultDesktopList()), L());
            else {
                var c = 0,
                    e;
                for (e in b) b[e].items && b[e].items.length && (c += b[e].items.length);
                c ? (v && (s = !1), L()) : (alloy.util.report2m(151398), a.error("getDesktopFail : empty desktop"), timeoutConfirm("\u8bfb\u53d6\u5230\u7684\u684c\u9762\u6570\u636e\u4e0d\u6b63\u786e, \u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f\n\u70b9\u53d6\u6d88\u4f7f\u7528\u9ed8\u8ba4\u6587\u4ef6\u914d\u7f6e\u3002") || (s = !0, alloy.config.offlineSetupAppList(),
                alloy.config.setDesktopList(alloy.config.getDefaultDesktopList()), L()))
            } else alloy.util.report2m(151397), alloy.util.report2h("get_file_system", "end", "error"), a.error("getDesktopFail : retcode=" + b.retcode), timeoutConfirm("\u8bfb\u53d6\u684c\u9762\u6570\u636e\u51fa\u9519\uff0c\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f\n\u70b9\u53d6\u6d88\u4f7f\u7528\u9ed8\u8ba4\u6587\u4ef6\u914d\u7f6e\u3002") || (s = !0, alloy.config.offlineSetupAppList(), L())
        },
        onAddSetupAppList: function (a) {
            var b = a.folderId;
            c.getFolderById(b);
            c.addFile({
                t: g.APP,
                id: a.id
            }, b, - 1, !0)
        },
        onRemoveSetupAppList: function (a) {
            c.deleteFile({
                t: g.APP,
                id: a.id
            }, null, null, !1, !a.noSave)
        },
        onRestoreAppList: function () {
            var a = alloy.config.getDefaultDesktopList(),
                b = [g.APP, g.BUDDY, g.GROUP, g.FOLDER, g.FILE],
                c = [],
                e;
            for (e in a) c.push(a[e].items);
            C({
                data: {
                    objects: c,
                    types: b
                },
                onSuccess: void 0,
                action: "reset",
                method: "POST"
            })
        },
        onRequestError: function (e) {
            r = !1;
            var d = e.arguments.fileList,
                f;
            for (f in d) P(d[f], !1);
            a.error("FileOperateError");
            e.arguments.noProcessStatus || b.notifyObservers(c, "FileOperateError", e.arguments)
        },
        onRequestTimeout: function (e) {
            r = !1;
            var d = e.arguments.fileList,
                f;
            for (f in d) P(d[f], !1);
            a.error("FileOperateTimeout");
            e.arguments.noProcessStatus || b.notifyObservers(c, "FileOperateTimeout", e.arguments);
            d = e.arguments;
            delete e.arguments;
            alloy.rpcService.sendFileErrorReport({
                request: d,
                response: e
            })
        },
        onAddFileError: function (e) {
            a.error("AddFileError");
            r = !1;
            e.arguments.noProcessStatus || b.notifyObservers(c, "FileOperateError", e.arguments)
        },
        onAddFileTimeout: function (e) {
            a.error("AddFileTimeout");
            r = !1;
            e.arguments.noProcessStatus || b.notifyObservers(c, "FileOperateTimeout", e.arguments);
            var d = e.arguments;
            delete e.arguments;
            alloy.rpcService.sendFileErrorReport({
                request: d,
                response: e
            })
        },
        onAddFileSuccess: function (e) {
            r = !1;
            if (e.retcode == 0 && e.result && e.result.code == 0) {
                var d = e.result.objs || [],
                    e = e.arguments,
                    h = f(e.position) ? e.parent.items.length : e.position,
                    j;
                for (j in d) {
                    var z = d[j];
                    if (z.t == g.FILE) z.upload = 1;
                    y(z, e.parent, h);
                    h += 1;
                    a.isFunction(e.callback) && e.callback(z)
                }
            } else a.error("AddFileFail"), e.arguments.noProcessStatus || b.notifyObservers(c, "AddFileFail", e), e.arguments.fileList && e.arguments.fileList[0] && (z = e.arguments.fileList[0], z.t == g.FOLDER ? alloy.util.report2m(151383) : z.t == g.APP ? alloy.util.report2m(151387) : (z.t == g.BUDDY || z.t == g.GROUP) && alloy.util.report2m(151391)), d = e.arguments, delete e.arguments, alloy.rpcService.sendFileErrorReport({
                request: d,
                response: e
            })
        },
        onDeleteFileSuccess: function (e) {
            r = !1;
            if (e.retcode == 0 && e.result && e.result.code == 0) {
                var e = e.arguments,
                    d = e.fileList,
                    f;
                for (f in d) {
                    var h = d[f];
                    P(h, !1);
                    A(h, e.parent,
                    e.position, e.isCascade)
                }
            } else a.error("DeleteFileFail"), E(e.arguments.fileList, !1), e.arguments.noProcessStatus || b.notifyObservers(c, "DeleteFileFail", e.arguments), e.arguments.fileList && e.arguments.fileList[0] && (h = e.arguments.fileList[0], h.t == g.FOLDER ? alloy.util.report2m(151385) : h.t == g.APP ? alloy.util.report2m(151389) : (h.t == g.BUDDY || h.t == g.GROUP) && alloy.util.report2m(151393)), f = e.arguments, delete e.arguments, alloy.rpcService.sendFileErrorReport({
                request: f,
                response: e
            })
        },
        onMoveFileSuccess: function (e) {
            r = !1;
            if (e.retcode == 0 && e.result && e.result.code == 0) {
                var e = e.arguments,
                    d = e.fileList,
                    f = e.targetFolder.id,
                    h;
                for (h in d) {
                    var j = d[h];
                    P(j, !1);
                    f == 5 && f != e.sourceFolder.id && W(!1);
                    w(j, e.targetFolder, e.targetPosition, e.sourceFolder, e.sourcePosition)
                }
            } else a.error("MoveFileFail"), E(e.arguments.fileList, !1), e.arguments.noProcessStatus || b.notifyObservers(c, "MoveFileFail", e.arguments), e.arguments.fileList && e.arguments.fileList[0] && (j = e.arguments.fileList[0], j.t == g.FOLDER ? alloy.util.report2m(151384) : j.t == g.APP ? alloy.util.report2m(151388) : (j.t == g.BUDDY || j.t == g.GROUP) && alloy.util.report2m(151392)), h = e.arguments, delete e.arguments, alloy.rpcService.sendFileErrorReport({
                request: h,
                response: e
            })
        },
        onCopyFileSuccess: function (a) {
            if (a.retcode == 0 && a.result && a.result.code == 0) {
                var e = a.arguments,
                    a = a.result.objs,
                    d;
                for (d in a) {
                    var f = a[d];
                    P(f, !1);
                    alloy.storage.useSpace(f.s, f.size);
                    y(f, e.parent, null, null)
                }
            } else E(a.arguments.fileList, !1), a.arguments.noProcessStatus || b.notifyObservers(c, "CopyFileFail", a.arguments), e = a.arguments, delete a.arguments, alloy.rpcService.sendFileErrorReport({
                request: e,
                response: a
            })
        },
        onGetFolderItemSuccess: function (a) {
            a.retcode == 0 && a.result && a.result.code == 0 ? b.notifyObservers(c, "GetFolderItemSuccess", a) : b.notifyObservers(c, "GetFolderItemFail", a)
        },
        onCleanFilesSuccess: function (a) {
            if (a.retcode == 0 && a.result && a.result.code == 0) {
                var e = k[g.FILE],
                    d;
                for (d in e) {
                    var f = e[d];
                    f.s === a.arguments.provider && c.deleteFile(f, null, null, null, !1, !1)
                }
                b.notifyObservers(c, "CleanFilesSuccess", a.arguments.provider)
            } else alloy.layout.alert("\u89e3\u9664\u7ed1\u5b9a\u5931\u8d25\uff01")
        },
        onUpdateFileSuccess: function (e) {
            r = !1;
            if (e.retcode == 0 && e.result && e.result.code == 0) {
                var e = e.arguments.fileList,
                    d;
                for (d in e) {
                    var f = e[d];
                    P(f, !1);
                    q(f)
                }
            } else a.error("UpdateFileFail"), E(e.arguments.fileList, !1), e.arguments.noProcessStatus || b.notifyObservers(c, "UpdateFileFail", e.arguments), e.arguments.fileList && e.arguments.fileList[0] && (f = e.arguments.fileList[0], f.t == g.FOLDER ? alloy.util.report2m(151386) : f.t == g.APP ? alloy.util.report2m(151390) : (f.t == g.BUDDY || f.t == g.GROUP) && alloy.util.report2m(151394)), d = e.arguments, delete e.arguments, alloy.rpcService.sendFileErrorReport({
                request: d,
                response: e
            })
        }
    }, W = function (a) {
        var b = alloy.fileSystem.getFolderById(5);
        if (b.items.length >= 5) for (var e = alloy.desktopManager.getCurrentDesktopIndex(), b = b.items; b.length >= 5;) {
            var d = b.length - 1;
            c.moveFile(b[d], e, null, 5, d, !! a)
        }
    }, P = function (a, e) {
        if (e) {
            if (a.processing) return b.notifyObservers(c, "FileProcessing", a), !0;
            a.processing = !0;
            b.notifyObservers(c, "FileBeforeProcess", a)
        } else delete a.processing, b.notifyObservers(c, "FileProcessed", a)
    }, E = function (b, e) {
        if (a.isArray(b)) for (var c in b) P(b[c], e);
        else P(b, e)
    },
    L = function () {
        n();
        k = {};
        k[g.FOLDER] = {};
        k[g.FILE] = {};
        k[g.APP] = {};
        k[g.BUDDY] = {};
        k[g.GROUP] = {};
        l = {};
        l[g.FOLDER] = 0;
        l[g.FILE] = 0;
        l[g.APP] = 0;
        l[g.BUDDY] = 0;
        l[g.GROUP] = 0;
        e();
        h() || z();
        t = !0;
        b.notifyObservers(c, "FileSystemReady");
        b.notifyObservers(alloy.portal, "UACReady")
    }, V = [],
        T = function () {}, S = function (b) {
            r = !1;
            if (!(b.retcode == 0 && b.result && b.result.code == 0)) {
                a.error("AddFileFail");
                var e = b.arguments;
                delete b.arguments;
                alloy.rpcService.sendFileErrorReport({
                    request: e,
                    response: b
                })
            }
        }, U = function (a) {
            V.push(a)
        }, Z = function () {
            for (var a; a = V.shift();) setTimeout(a, 500)
        }, z = function () {
            var b = alloy.config.getSetupAppList(),
                e = alloy.config.configList.defaultScreen,
                e = f(e) ? 2 : e - 1,
                d = c.getFolderById(e),
                h = c.getFolderById(5),
                j = [],
                z, q = !1,
                n = alloy.config.getMustInstallAppList(),
                m;
            for (m in n) {
                var A = Number(m);
                alloy.config.isInSetupAppList(A) || (q = !0, z = {
                    t: g.APP,
                    id: A
                }, b.push(A), c.getFileByFile(z) || (j.push(z), c.addFile(z, 5, 0, !1, !0)))
            }
            if (q && (a.profile("forceInstallApp"), alloy.config.sendSetSetupAppList(), j.length)) {
                var E = h.items.length,
                    x = j.concat();
                U(function () {
                    F(x,
                    5, E, S, {
                        fileList: x
                    }, !0)
                })
            }
            j = [];
            if (h.items.length > 5) for (z = h.items; z.length > 5;) A = z.length - 1, j.push(z[A]), c.moveFile(z[A], e, null, 5, A, !1, !0);
            if (j.length && (a.profile("checkDock"), !q)) {
                var O = j.concat();
                U(function () {
                    J(O, e, 0, 5, null, T, {
                        fileList: O
                    }, !0)
                })
            }
            j = [];
            q = c.getFilesByType(g.APP);
            for (m in b) q[b[m]] || (z = {
                t: g.APP,
                id: b[m]
            }, j.push(z));
            if (j.length) {
                a.profile("addMissApp");
                c.addFiles(j, e, - 1, !1, !0);
                var w = j.concat(),
                    p = d.items.length;
                U(function () {
                    F(w, e, p, S, {
                        fileList: w
                    }, !0)
                })
            }
            var d = {}, j = !1,
                l;
            for (l in q) if ((A = Number(q[l].id)) && a.array.indexOf(b, A) == -1) j = !0, z = q[l], m = c.getFileInfoByFile(z), d[m.parent.id] || (d[m.parent.id] = {}), d[m.parent.id][z.id] = z, c.deleteFile(z, null, null, !1, !1, !0);
            if (j) {
                a.profile("removeSurplusApp");
                for (var k in d) {
                    b = [];
                    l = Number(k);
                    for (var r in d[k]) b.push(d[k][r]);
                    U(a.bind(function (a) {
                        G(a.fileList, a.folderId, T, null, !0)
                    }, c, {
                        fileList: b,
                        folderId: l
                    }))
                }
            }
            Z()
        };
    this.createRecentContactFolder = function (a) {
        if (!h()) {
            var b = c.getFolderByName("\u5e38\u7528\u8054\u7cfb\u4eba");
            if (b) {
                if (a.length) {
                    var e = 16 - b.items.length;
                    a.length > e && a.splice(e);
                    c.addFiles(a, b.id, null, !1);
                    F(a, b.id, 0, S, null, !0)
                }
                alloy.config.setPortalConfig("hasRecentFolder", 1)
            } else b = {
                t: g.FOLDER,
                n: "\u5e38\u7528\u8054\u7cfb\u4eba"
            }, c.createFile(b, alloy.config.configList.defaultScreen - 1, null, function (b) {
                alloy.config.setPortalConfig("hasRecentFolder", 1);
                a.length && (c.addFiles(a, b.id, null, !1), F(a, b.id, 0, S, null, !0))
            }, !0)
        }
    };
    this.isFileSystemReady = function () {
        return t
    };
    this.init = function () {
        b.addObserver(alloy.portal, "SimpleUACReady", H.onSimpleUACReady);
        b.addObserver(alloy.config, "BeforeGetUAC", H.onBeforeGetUAC);
        b.addObserver(alloy.config, "AddSetupAppList", H.onAddSetupAppList);
        b.addObserver(alloy.config, "RemoveSetupAppList", H.onRemoveSetupAppList);
        b.addObserver(alloy.config, "RestoreAppList", H.onRestoreAppList)
    }
});
Jx().$package("alloy.storage.rpcService", function (a) {
    var c = {
        onRequestError: function () {},
        onRequestTimeout: function () {}
    }, b = function (b) {
        if (alloy.portal.getLoginLevel() != alloy.CONST.LOGIN_LEVEL_NONE) {
            var b = b || {}, g = b.data || {};
            g.vfwebqq = alloy.portal.getVfWebQQ();
            for (var k in g) if (a.isObject(g[k]) || a.isArray(g[k])) g[k] = a.json.stringify(g[k]);
            b.data = g;
            b.method = b.method || "GET";
            b.onError = b.onError || c.onRequestError;
            b.onTimeout = b.onTimeout || c.onRequestTimeout;
            alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cloud/cs/" + b.action, b)
        }
    };
    this.copyFile = function (a) {
        a.action = "copy_file";
        a.method = "POST";
        b(a)
    };
    this.fileMove = function (a) {
        a.action = "file_move";
        a.method = "POST";
        b(a)
    };
    this.createUser = function (a) {
        a.action = "create_user";
        a.method = "POST";
        b(a)
    };
    this.fileRename = function (a) {
        a.action = "file_rename";
        a.method = "POST";
        b(a)
    };
    this.createDir = function (a) {
        a.action = "create_dir";
        a.method = "POST";
        b(a)
    };
    this.fileContUpload = function () {};
    this.queryUser = function (a) {
        a.action = "query_user";
        a.method = "POST";
        b(a)
    };
    this.fileRemove = function (a) {
        a.action = "file_remove";
        a.method = "POST";
        b(a)
    };
    this.queryFile = function () {};
    this.fileUpload = function (a) {
        a.action = "file_upload";
        a.method = "POST";
        b(a)
    };
    this.fileDownload = function (a) {
        a.action = "file_download";
        b(a)
    };
    this.updateFileLength = function () {};
    this.getHomeKey = function () {};
    this.queryDir = function (a) {
        a.action = "query_dir";
        a.method = "POST";
        b(a)
    };
    this.checkPassword = function (a) {
        a.action = "check_pass";
        a.method = "POST";
        b(a)
    }
});
Jx().$package("alloy.storage", function (a) {
    var c = this,
        b = alloy.storage.rpcService,
        d = a.event,
        g = a.dom,
        d = a.event,
        k = a.string,
        l = null,
        o = [],
        t = [],
        r = this.DISK = {
            QQDISK: "qqdisk",
            KINGSOFT: "kingsoft"
        }, u = c.diskConfig = {
            qqdisk: {
                id: 0,
                key: r.QQDISK,
                icon: "./module/diskexplorer/images/qqdisk.png",
                name: "QQ\u7f51\u76d8",
                userUsedSpace: 0,
                userTotalSpace: 1073741824,
                isPwdOpen: 0,
                isLocked: 0,
                dataReady: !1
            },
            kingsoft: {
                id: 1,
                key: r.KINGSOFT,
                icon: "./module/diskexplorer/images/kingsoft.png",
                name: "\u91d1\u5c71\u5feb\u76d8",
                userUsedSpace: 0,
                userTotalSpace: 5368709120,
                isPwdOpen: 0,
                isLocked: 0,
                dataReady: !1
            }
        }, v = [];
    (function () {
        var a, b = 0;
        for (a in u) u.hasOwnProperty(a) && (v[b++] = u[a])
    })();
    this.getTotalUsedSpace = function () {
        for (var a = 0, b = 0; b < o.length; b++) a += u[o[b]].userUsedSpace;
        return a
    };
    this.getTotalSpace = function () {
        for (var a = 0, b = 0; b < o.length; b++) a += u[o[b]].userTotalSpace;
        return a
    };
    this.getTotalSpaceById = function (a) {
        if (a == r.QQDISK) switch (alloy.portal.getPortalSelf().vip) {
        case 1:
            return 3221225472;
        case 2:
            return 4294967296;
        case 3:
            return 5368709120;
        case 4:
            return 6442450944;
        case 5:
            return 7516192768;
        case 6:
            return 8589934592;
        case 7:
            return 10737418240;
        default:
            return 1073741824
        } else if (a == r.KINGSOFT) return 5368709120
    };
    this.getFreeSpaceById = function (a) {
        return u[a].userTotalSpace - u[a].userUsedSpace
    };
    this.getDiskById = function (a) {
        return u[a]
    };
    this.getBoundDisk = function () {
        return o
    };
    this.addBoundDisk = function (b) {
        a.array.indexOf(o, b) < 0 && o.push(b);
        t = this.getUnBoundDisk()
    };
    this.removeBoundDisk = function (b) {
        a.array.remove(o, b);
        t = this.getUnBoundDisk()
    };
    this.sendSetBoundDisk = function (a) {
        alloy.rpcService.sendSetConfig({
            data: {
                r: {
                    appid: 0,
                    value: {
                        diskList: a
                    }
                }
            }
        })
    };
    this.getUnBoundDisk = function () {
        t = [];
        for (var a = {}, b = 0; b < o.length; b++) a[o[b]] = 1;
        for (b = 0; b < v.length; b++) a[v[b].key] || t.push(v[b].key);
        return t
    };
    this.setDefaultDisk = function (a) {
        l = a
    };
    this.sendSetBoundAndDefaultDisk = function (a, b) {
        a = a || alloy.storage.getBoundDisk();
        b = b || l;
        alloy.rpcService.sendSetConfig({
            data: {
                r: {
                    appid: 0,
                    value: {
                        defaultDisk: b,
                        diskList: a
                    }
                }
            }
        })
    };
    this.getDefaultDisk = function () {
        l = l || "qqdisk";
        return u[l]
    };
    this.useSpace = function (b, h) {
        a.isNumber(h) && (u[b].userUsedSpace += h, d.notifyObservers(c, "StorageSpaceChanged", b))
    };
    this.releaseSpace = function (b, h) {
        if (a.isNumber(h)) u[b].userUsedSpace -= h, u[b].userUsedSpace = u[b].userUsedSpace > 0 ? u[b].userUsedSpace : 0, d.notifyObservers(c, "StorageSpaceChanged", b)
    };
    this.receiveFile = function (b) {
        b.cookie_name && a.cookie.set(b.cookie_name, b.cookie_value, alloy.CONST.MAIN_DOMAIN, "", 0.5);
        var c = g.id("fs_download");
        if (typeof c == "undefined" || c == null) c = document.createElement("IFRAME"), c.id = "fs_download",
        c.name = "fs_download", c.src = alloy.CONST.MAIN_URL + "domain.html", c.style.display = "none", document.body.appendChild(c);
        c.src = b.url
    };
    this.fileDownload = function (a, d) {
        b.fileDownload({
            data: {
                target: d,
                obj: a
            },
            onSuccess: function (a) {
                a.retcode == 0 && a.result && a.result.code == 0 && c.receiveFile(a.result)
            }
        })
    };
    this.fileView = function (c, d) {
        b.fileDownload({
            data: {
                target: d,
                obj: c
            },
            onSuccess: function (b) {
                if (b.retcode == 0 && b.result && b.result.code == 0) {
                    var d = a.extend({}, c, b.result, b.result.obj);
                    alloy.fileSystem.openFile(d, b.result.url)
                }
            }
        })
    };
    this.openFile = function (a, b) {
        var c = alloy.util.getFileExt(a.n).toLowerCase();
        alloy.system.isOpenFile(c) && this.fileView(a, b)
    };
    this.createFile = function (a, h) {
        var g = this.getExplorerInstance(),
            m = g.getCurFolder(),
            l = g.getCurDisk(),
            g = a.fileSize;
        alloy.storage.getFreeSpaceById(l) < g ? alloy.storage.storageFullAlert(l) : (m = {
            target: l,
            file: {
                t: alloy.fileSystem.FILE_TYPE.FILE,
                n: a.fileName,
                size: g,
                md5: "",
                sha: ""
            },
            parent: m
        }, m.parent == "root" && delete m.parent, b.fileUpload({
            data: m,
            onSuccess: function (a) {
                a.retcode == 0 && a.result && a.result.code == 0 ? (a = a.result.obj, a.upload = 1, c.useSpace(l, a.size), d.notifyObservers(c, "ExplorerFileAdd", a), h && h(a)) : a.retcode == 0 && a.result && a.result.code == 30001 ? alloy.storage.storageFullAlert() : alloy.layout.alert("\u4e0a\u4f20\u6587\u4ef6\u5931\u8d25\uff01")
            }
        }))
    };
    this.createDir = function () {
        var a = {}, b = {}, g = this.getExplorerInstance();
        a.target = g.getCurDisk();
        a.obj = g.getCurFolder();
        a.obj == "root" && delete a.obj;
        b.data = a;
        b.onSuccess = function (a) {
            a.retcode == 0 && a.result && a.result.code == 0 ? d.notifyObservers(c, "ExplorerFileAdd", a.result.obj) : alloy.layout.alert("\u521b\u5efa\u6587\u4ef6\u5939\u5931\u8d25\uff01")
        };
        alloy.storage.rpcService.createDir(b)
    };
    var s = function (a) {
        if (a.replace(/[\\/:*?"<>|]/g, "") != a) return '\u540d\u79f0\u4e0d\u80fd\u5305\u542b\\/:*?"<>|\u7b49\u7279\u6b8a\u5b57\u7b26';
        else if (k.byteLength(a) > 48) return "\u6587\u4ef6\u5939\u540d\u79f0\u8fc7\u957f\uff08\u5b57\u6570\u6700\u591a\u4e3a24\u4e2a\u6c49\u5b57\u621648\u4e2a\u5b57\u7b26\uff09";
        return 0
    };
    this.fileRename = function (a, b) {
        var g = s(b);
        if (g == 0) {
            var g = {}, m = {}, l = this.getExplorerInstance();
            g.target = l.getCurDisk();
            a.n = b;
            g.obj = a;
            m.data = g;
            m.arguments = {
                obj: a
            };
            m.onSuccess = function (a) {
                a.retcode == 0 && a.result && a.result.code == 0 ? d.notifyObservers(c, "ExplorerFileRename", a.arguments.obj) : a.result.code == 33333 ? alloy.layout.alert("\u7cfb\u7edf\u6587\u4ef6\u5939\u4e0d\u5141\u8bb8\u91cd\u547d\u540d") : alloy.layout.alert("\u91cd\u547d\u540d\u5931\u8d25\uff01")
            };
            alloy.storage.rpcService.fileRename(m)
        } else alloy.layout.alert(g, null, {
            title: "\u91cd\u547d\u540d"
        })
    };
    this.fileRemove = function (a) {
        var b = {}, g = {}, m = this.getExplorerInstance().getCurDisk();
        b.obj = a;
        b.target = m;
        g.data = b;
        g.arguments = {
            obj: a
        };
        g.onSuccess = function (a) {
            a.retcode == 0 && a.result && a.result.code == 0 ? (a = a.arguments.obj, c.releaseSpace(m, a.size), d.notifyObservers(c, "ExplorerFileRemove", a)) : a.result.code == 33333 ? alloy.layout.alert("\u7cfb\u7edf\u6587\u4ef6\u5939\u4e0d\u5141\u8bb8\u5220\u9664") : alloy.layout.alert("\u5220\u9664\u5931\u8d25\uff01")
        };
        alloy.storage.rpcService.fileRemove(g)
    };
    this.fileCopy = function (a,
    b) {
        var g = {}, m = {}, l = this.getExplorerInstance();
        g.target = l.getCurDisk();
        g.obj = a;
        g.dest = l.getCurFolder();
        g.dest == "root" && delete g.dest;
        m.data = g;
        m.onSuccess = function (a) {
            a.retcode == 0 && a.result && a.result.code == 0 ? (a = a.result.obj, c.useSpace(b, a.size), d.notifyObservers(c, "ExplorerFileCopy", a)) : a.retcode == 0 && a.result && a.result.code == 30001 ? alloy.storage.storageFullAlert() : alloy.layout.alert("\u590d\u5236\u5931\u8d25\uff01")
        };
        alloy.storage.rpcService.copyFile(m)
    };
    this.fileMove = function (a) {
        var b = {}, g = {}, m = this.getExplorerInstance();
        b.target = m.getCurDisk();
        b.obj = a;
        b.dest = m.getCurFolder();
        b.dest == "root" && delete b.dest;
        g.data = b;
        g.onSuccess = function (a) {
            a.retcode == 0 && a.result && a.result.code == 0 ? d.notifyObservers(c, "ExplorerFileMove", a.result.obj) : a.result.code == 33333 ? alloy.layout.alert("\u7cfb\u7edf\u6587\u4ef6\u5939\u4e0d\u5141\u8bb8\u79fb\u52a8") : alloy.layout.alert("\u7c98\u8d34\u5931\u8d25\uff01")
        };
        alloy.storage.rpcService.fileMove(g)
    };
    this.isDiskReady = function () {
        return !1
    };
    this.storageFullAlert = function (a) {
        a ? alloy.layout.alert("\u60a8\u7684" + u[a].name + "\u5269\u4f59\u7a7a\u95f4\u4e0d\u8db3\uff0c\u8bf7\u4fee\u6539\u9ed8\u8ba4\u786c\u76d8\u540e\u91cd\u65b0\u4e0a\u4f20", function () {
            alloy.system.runApp("diskExplorer")
        }) : alloy.layout.alert("\u78c1\u76d8\u7a7a\u95f4\u5df2\u6ee1\uff0c\u8bf7\u7ed1\u5b9a\u6216\u4f7f\u7528\u65b0\u7684\u786c\u76d8")
    };
    this.checkPassword = function (a, b) {
        var g = {}, m = {};
        this.getExplorerInstance();
        var l = function () {
            c._passwordErrorWin = null
        };
        g.target = a;
        g.pass_md5 = b;
        m.data = g;
        m.onSuccess = function (b) {
            if (b.retcode == 0 && b.result && b.result.code == 0) d.notifyObservers(c, "ExploreCheckPassword", {
                target: a,
                code: 1
            });
            else if (!c._passwordErrorWin) c._passwordErrorWin = alloy.layout.alert("\u5bc6\u7801\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5\uff01", l, null, l);
            d.notifyObservers(c, "ExploreCheckPasswordDone")
        };
        alloy.storage.rpcService.checkPassword(m)
    };
    this.getExplorerInstance = function () {
        if (alloy.app.diskExplorer) return alloy.app.diskExplorer.getInstance()
    };
    var m = {
        onPortalReady: function () {
            var b = alloy.config.getDiskList();
            l = alloy.config.getDefaultDisk();
            if (u[l]) u[l].isDefault = !0;
            b && (o = b);
            t = c.getUnBoundDisk();
            for (var h = 0, b = 0; b < o.length; b++) {
                var g = {};
                g.data = {
                    target: o[b]
                };
                g.arguments = {
                    target: o[b]
                };
                g.onSuccess = function (b) {
                    if (b.retcode == 0 && b.result && b.result.code == 0) {
                        var f = b.arguments.target,
                            e = b.result.config || {}, j = parseInt(b.result.userUsedSpaceBytes),
                            b = parseInt(b.result.userTotalSpaceBytes);
                        u[f].userUsedSpace = j > b ? b : j;
                        u[f].userTotalSpace = b;
                        u[f].dataReady = !0;
                        u[f].isPwdOpen = a.isUndefined(e.is_pwd_open) ? 0 : e.is_pwd_open;
                        u[f].isLocked = u[f].isPwdOpen == 0 ? 0 : 1;
                        h++;
                        d.notifyObservers(c, "StorageSpaceChanged", f)
                    } else a.out("\u52a0\u8f7d\u4e91\u5b58\u50a8\u4fe1\u606f\u9519\u8bef\uff01"), d.notifyObservers(c, "StorageError")
                };
                alloy.storage.rpcService.queryUser(g)
            }
            o.length == 0 && d.notifyObservers(c, "StorageReady")
        },
        onMessageUpdate: function (b) {
            if ((Number(b.appid) || Number(b.aid)) == 400011741) {
                var b = a.json.parse(a.string.decodeHtmlSimple(b.m)),
                    h = alloy.storage.getDiskById(b.source);
                if (h) {
                    var g = parseInt(b.userUsedSpaceBytes),
                        m = parseInt(b.userTotalSpaceBytes);
                    h.userUsedSpace = g > m ? m : g;
                    h.userTotalSpace = m;
                    d.notifyObservers(c, "StorageSpaceChanged", b.source)
                }
            }
        }
    };
    this.init = function () {
        d.addObserver(alloy.portal, "portalReady", m.onPortalReady);
        d.addObserver(alloy.portal, "message", m.onMessageUpdate)
    }
});
Jx().$package("alloy.desktopContact", function (a) {
    var c = this,
        b = a.event,
        b = a.event,
        d = alloy.fileSystem.FILE_TYPE,
        g = !1,
        k = {
            onBuddySelected: function (a, b) {
                var c = b;
                c == -1 && (c = alloy.desktopManager.getCurrentDesktopIndex());
                var g = [],
                    l;
                for (l in a) {
                    var k = a[l],
                        e;
                    k.gcode ? (e = Number(k.gcode), k = {
                        id: k.gcode,
                        n: k.name,
                        t: alloy.fileSystem.FILE_TYPE.GROUP,
                        gid: k.gid || 0
                    }) : (e = Number(k.uin), k = {
                        id: k.uin,
                        n: k.name,
                        t: alloy.fileSystem.FILE_TYPE.BUDDY
                    });
                    isNaN(e) || alloy.fileSystem.getFileByFile(k) || g.push(k)
                }
                g.length && (l = alloy.fileSystem.getFileAmount(d.BUDDY),
                e = alloy.fileSystem.getFileAmount(d.GROUP), l + e + g.length >= 200 ? alloy.layout.alert("\u684c\u9762\u8054\u7cfb\u4eba\u5df2\u8d85\u8fc7200\u4eba\u4e0a\u9650\uff0c\u8bf7\u5220\u51cf\u540e\u518d\u521b\u5efa\u3002") : alloy.fileSystem.getFolderById(c) ? alloy.fileSystem.addFiles(g, c, null, !0) : alloy.layout.alert("\u6587\u4ef6\u5939\u5df2\u7ecf\u4e0d\u5b58\u5728\uff0c\u6dfb\u52a0\u5931\u8d25\u3002"));
                qqweb.util.report2qqweb("deskcontact|create|context")
            },
            onBeforeGetRecentList: function () {
                b.addObserver(EQQ.Model.BuddyList, "RecentListChange", k.onRecentListChange)
            },
            onEQQLoginSuccess: function () {
                b.removeObserver(EQQ.Model.BuddyList, "BuddyStateChange", k.onBuddyStateChange);
                b.addObserver(EQQ.Model.BuddyList, "BuddyStateChange", k.onBuddyStateChange);
                g || (alloy.notifier.register("desktopContact", k.onMessageReceive, k.onMessageHandled), g = !0);
                v();
                var a = alloy.fileSystem.getFilesByType(d.BUDDY),
                    c;
                for (c in a) s(a[c].id);
                alloy.system.reportAppState("50", 1)
            },
            onDockLocationChanged: function () {},
            onBuddyStateChange: function (a) {
                s(a)
            },
            onLoginLevelChange: function (a) {
                if (a == 2 && a < alloy.portal.getOldLoginLevel()) {
                    var b = alloy.fileSystem.getFilesByType(d.BUDDY),
                        c;
                    for (c in b) b[c].notifyNumber = 0, alloy.iconFactory.updateNotifyNumber(b[c]);
                    var b = alloy.fileSystem.getFilesByType(d.GROUP),
                        g;
                    for (g in b) b[g].notifyNumber = 0, alloy.iconFactory.updateNotifyNumber(b[g])
                }
                a < 3 && alloy.portal.getOldLoginLevel() == 3 && alloy.system.reportAppState("50", 2)
            },
            onFileAddFail: function () {},
            onMessageReceive: function (a) {
                var b;
                b = alloy.config.configList.isNoContactNotify ? !1 : a.from != 50 ? !1 : a.body.extra.isChatBoxOpen ? !1 : !0;
                if (b) {
                    b = a.body;
                    var c;
                    a.type == "SingleChat" ? (a = b.uin, c = d.BUDDY) : (a = b.code, c = d.GROUP);
                    alloy.iconFactory.updateNotifyNumber({
                        id: a,
                        t: c,
                        notifyNumber: b.count
                    })
                }
            },
            onMessageHandled: function (a) {
                var b = a.body;
                a.type == "SingleChat" ? (a = b.uin, b = d.BUDDY) : (a = b.code, b = d.GROUP);
                alloy.iconFactory.updateNotifyNumber({
                    id: a,
                    t: b,
                    notifyNumber: 0
                })
            },
            onRecentListChange: function () {
                b.removeObserver(EQQ.Model.BuddyList, "RecentListChange", k.onRecentListChange);
                if (alloy.fileSystem.isFileSystemReady()) l();
                else {
                    var a = function () {
                        l();
                        b.removeObserver(alloy.fileSystem, "FileSystemReady", a)
                    };
                    b.addObserver(alloy.fileSystem, "FileSystemReady", a)
                }
            }
        }, l = function () {
            if (!alloy.config.configList.hasRecentFolder) {
                for (var a = EQQ.Model.BuddyList.getRecentList(), b = [], c, g, l = 0; l < a.length; l++) {
                    if (b.length >= 16) break;
                    c = null;
                    if (a[l].type == 0)(g = EQQ.Model.BuddyList.getBuddyByUin(a[l].uin)) && (c = {
                        t: d.BUDDY,
                        id: a[l].uin,
                        n: g.showName
                    });
                    else if (a[l].type == 1)(g = EQQ.Model.BuddyList.getGroupByGid(a[l].uin)) && (c = {
                        t: d.GROUP,
                        id: g.code,
                        n: g.showName,
                        gid: a[l].uin
                    });
                    else continue;
                    c && !alloy.fileSystem.getFileByFile(c) && b.push(c)
                }
                alloy.fileSystem.createRecentContactFolder(b)
            }
        }, o = [],
        t = function () {}, r = function (a) {
            o.push(a)
        }, u = function () {
            for (var a; a = o.shift();) setTimeout(a, 500)
        }, v = function () {
            var b = alloy.fileSystem.getFilesByType(d.BUDDY),
                f, h, g = !1,
                l = {}, k, e, j;
            for (j in b) {
                f = b[j];
                if ((h = EQQ.Model.BuddyList.getUserByUin(f.id)) && f.n !== h.showName) g = !0, f.n = h.showName, h = alloy.fileSystem.getFolderIdByFile(f), l[h] || (l[h] = {}), l[h][f.id] = f;
                e = alloy.iconFactory.getIcons(f.id, d.BUDDY) || [];
                h = 0;
                for (k = e.length; h < k; h++) e[h].refreshIcon(), e[h].setText(f.n)
            }
            var b = alloy.fileSystem.getFilesByType(d.GROUP),
                o;
            for (o in b) {
                f = b[o];
                if ((j = EQQ.Model.BuddyList.getGroupByCode(f.id)) && f.n !== j.showName) g = !0, f.n = j.showName, h = alloy.fileSystem.getFolderIdByFile(f), l[h] || (l[h] = {}), l[h][f.id] = f;
                e = alloy.iconFactory.getIcons(f.id, d.GROUP) || [];
                h = 0;
                for (k = e.length; h < k; h++) e[h].refreshIcon(), e[h].setText(f.n)
            }
            if (g) for (var x in l) {
                f = [];
                var g = Number(x),
                    s;
                for (s in l[x]) f.push(l[x][s]);
                r(a.bind(function (a) {
                    alloy.fileSystem.sendUpdateFiles(a.fileList,
                    a.folderId, t, null, !0)
                }, c, {
                    fileList: f,
                    folderId: g
                }))
            }
            u()
        }, s = this.updateContactIconState = function (a, b, c) {
            var b = alloy.iconFactory.getIcons(a, d.BUDDY),
                g;
            if (b) if (c = c || EQQ.Model.BuddyList.getState(a)) {
                a = 0;
                for (g = b.length; a < g; a++) b[a].showState(c)
            } else {
                a = 0;
                for (g = b.length; a < g; a++) b[a].hideState()
            }
        };
    this.init = function () {
        b.addObserver(alloy.portal, "EQQLoginSuccess", k.onEQQLoginSuccess);
        b.addObserver(alloy.portal, "BeforeGetRecentList", k.onBeforeGetRecentList);
        b.addObserver(alloy.portal, "loginLevelChange", k.onLoginLevelChange)
    };
    this.addContactIcon = function (a, b, c) {
        var g = alloy.fileSystem.getFileInfoByFile(a);
        if (g) a = g.parent.id, a == 5 ? b = "\u8be5\u8054\u7cfb\u4eba\u5df2\u6dfb\u52a0\uff0c\u4f4d\u4e8e\u201c\u5e94\u7528\u7801\u5934\u201d\u3002" : a >= 0 && a < 5 ? b = "\u8be5\u8054\u7cfb\u4eba\u5df2\u6dfb\u52a0\uff0c\u4f4d\u4e8e" + ("\u201c\u684c\u9762" + (a + 1) + "\u201d") + "\u3002" : a == b ? b = "\u8be5\u8054\u7cfb\u4eba\u5df2\u4f4d\u4e8e\u8be5\u6587\u4ef6\u5939\u3002" : (b = "\u6587\u4ef6\u5939\u201c" + (g.parent.n || g.parent.id) + "\u201d", b = "\u8be5\u8054\u7cfb\u4eba\u5df2\u6dfb\u52a0\uff0c\u4f4d\u4e8e" + b + "\u3002"), alloy.layout.alert(b);
        else {
            var g = alloy.fileSystem.getFileAmount(d.BUDDY),
                l = alloy.fileSystem.getFileAmount(d.GROUP);
            g + l >= 200 ? alloy.layout.alert("\u684c\u9762\u8054\u7cfb\u4eba\u5df2\u8d85\u8fc7200\u4eba\u4e0a\u9650\uff0c\u8bf7\u5220\u51cf\u540e\u518d\u521b\u5efa\u3002") : (b = b || alloy.desktopManager.getCurrentDesktopIndex(), g = a.t == d.BUDDY ? EQQ.Model.BuddyList.getUserByUin(a.id) : EQQ.Model.BuddyList.getGroupByCode(a.id), a.n = g.showName, alloy.fileSystem.addFile(a, b, c, !0))
        }
    };
    this.deleteContactIcon = function (a) {
        alloy.fileSystem.deleteFile(a, null, null, !1, !0)
    };
    this.getCurrentContacts = function () {
        var a = {}, b, c = alloy.fileSystem.getFilesByType(d.BUDDY),
            g;
        for (g in c) b = c[g], a[b.id] = {
            type: b.t,
            uin: b.id,
            name: b.n
        };
        c = alloy.fileSystem.getFilesByType(d.GROUP);
        for (g in c) b = c[g], a[b.id] = {
            type: b.t,
            uin: b.gid,
            name: b.n,
            gcode: b.id
        };
        return a
    };
    this.showSelectBuddyBox = function (a) {
        typeof a == "undefined" && (a = -1);
        if (alloy.portal.getLoginLevel() == alloy.CONST.LOGIN_LEVEL_NONE) alloy.layout.showLoginWindow("selectBuddy");
        else {
            var b = c.getCurrentContacts();
            alloy.portal.runApp("selectBuddy", {
                id: "desktopContact",
                title: "\u6dfb\u52a0\u684c\u9762\u8054\u7cfb\u4eba",
                isAddSelf: !1,
                maxBuddy: 0,
                initList: b,
                lockInitList: !0,
                onlyNewMember: !0,
                groupDisplayType: "group",
                cbParam: a,
                onSelected: k.onBuddySelected
            })
        }
    }
});
Jx().$package("alloy.desktopFolder", function (a) {
    var c = a.event,
        b = a.dom,
        c = a.event,
        d = a.string,
        g = alloy.fileSystem.MAX_FOLDER_AMOUNT,
        k = alloy.fileSystem.FILE_TYPE,
        l = {
            onFileUpdate: function (a) {
                var b = alloy.iconFactory.getIcons(a.id, a.t);
                if (b) for (var c = 0, d = b.length; c < d; c++) b[c].setText(a.n), b[c].file.n = a.n
            },
            onFileCreateSuccess: function (a) {
                var b = alloy.iconFactory.getIcons(a.id, a.t);
                if (b) for (var c = 0, g = b.length; c < g; c++) b[c].setText(d.encodeHtml(a.n))
            },
            onFileAdd: function (a) {
                if (a = alloy.iconFactory.getIcons(a.parent.id,
                a.parent.type)) for (var b = 0, c = a.length; b < c; b++) a[b].update()
            },
            onFileDelete: function (a) {
                if (a = alloy.iconFactory.getIcons(a.parent.id, a.parent.type)) for (var b = 0, c = a.length; b < c; b++) a[b].update()
            },
            onFileMove: function (a) {
                var b = a.targetId,
                    a = a.sourceId,
                    c = alloy.iconFactory.getIcons(b, k.FOLDER);
                if (c) for (var d = 0, g = c.length; d < g; d++) c[d].update();
                if (c = alloy.iconFactory.getIcons(a, k.FOLDER)) {
                    d = 0;
                    for (g = c.length; d < g; d++) c[d].update()
                }
                alloy.iconFactory.updateNotifyNumber(alloy.fileSystem.getFolderById(a));
                alloy.iconFactory.updateNotifyNumber(alloy.fileSystem.getFolderById(b))
            }
        };
    this.init = function () {
        c.addObserver(alloy.fileSystem, "FileUpdate", l.onFileUpdate);
        c.addObserver(alloy.fileSystem, "FileAdd", l.onFileAdd);
        c.addObserver(alloy.fileSystem, "FileDelete", l.onFileDelete);
        c.addObserver(alloy.fileSystem, "FileMove", l.onFileMove)
    };
    this.createFolder = function () {
        alloy.fileSystem.getFileAmount(k.FOLDER) >= g ? alloy.layout.alert("\u6587\u4ef6\u5939\u5df2\u8d85\u8fc7" + g + "\u4e2a\u4e0a\u9650\uff0c\u8bf7\u5220\u51cf\u540e\u518d\u521b\u5efa\u3002") : alloy.system.getLoginLevel() > 1 ? new t({
            callback: function (a) {
                var b = alloy.desktopManager.getCurrentDesktopIndex();
                alloy.fileSystem.createFile({
                    t: alloy.fileSystem.FILE_TYPE.FOLDER,
                    n: a.n,
                    c: a.c
                }, b, null, l.onFileCreateSuccess)
            }
        }) : alloy.layout.showLoginWindow("")
    };
    this.deleteFolder = function (a) {
        var b = alloy.fileSystem.getFolderById(a.id).items,
            c = !1,
            d = !1;
        b.length ? alloy.layout.confirm("\u60a8\u786e\u5b9a\u5220\u9664\u6587\u4ef6\u5939\u7684\u6240\u6709\u5185\u5bb9\u5417\uff1f", function () {
            for (var g = [], f = b.length - 1; f >= 0; f--) {
                var h = b[f];
                if (h.t == k.APP) {
                    var l = alloy.appconfig.getAppConfig(h.id);
                    if (l) l.noSave = !0, alloy.config.removeSetupAppList(l, !1, !0) === !1 ? d = !0 : (g.push(h), c = !0)
                } else g.push(h)
            }
            c && alloy.config.sendSetSetupAppList();
            d ? g.length && alloy.fileSystem.deleteFiles(g, a.id, !0) : alloy.fileSystem.deleteFile(a, null, null, !0, !0)
        }, {
            title: "\u5220\u9664\u6587\u4ef6\u5939"
        }) : alloy.fileSystem.deleteFile(a, null, null, !1, !0)
    };
    var o = function (b) {
        var c = alloy.CONST.CDN_URL + "style/images/filesys/" + b + ".png",
            d = alloy.CONST.CDN_URL + "style/images/transparent.gif";
        return a.browser.ie == 6 ? '<img class="fcDropdown_img" src="' + d + '" style="' + ("background:node;filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + c + "', sizingMethod='scale')") + '" idx="' + b + '" />' : '<img class="fcDropdown_img" src="' + c + '" idx="' + b + '" />'
    }, t = new a.Class({
        init: function (d) {
            var g = this,
                d = d || {};
            d.id = d.id || +new Date;
            d.callback = d.callback || function () {};
            g.option = d;
            var l = g.folderWindow = alloy.windowFactory.createWindow("Window", {
                title: "\u65b0\u5efa\u6587\u4ef6\u5939",
                modeSwitch: !0,
                dragable: !0,
                width: 380,
                height: 120,
                hasCloseButton: !0,
                hasOkButton: !0,
                hasCancelButton: !0,
                doubleClickModeSwitch: !1,
                isSetCentered: !0
            }),
                s = '\t\t\t\t<div class="folderCreator" id="folderCreator_' + d.id + '">\t\t\t\t\t<a class="folderSelector" id="folderSelector_' + d.id + '">' + o("folder") + '</a>\t\t\t\t\t<div class="folderNameTxt">\u8bf7\u8f93\u5165\u6587\u4ef6\u5939\u540d\u79f0\uff1a</div>\t\t\t\t\t<div class="folderInput"><input class="folderName" id="folderName_' + d.id + '"></input></div>\t\t\t\t\t<div class="folderNameError" id="folderNameError_' + d.id + '"></div>\t\t\t\t</div>\t\t\t';
            l.setHtml(s);
            g.container = b.id("folderCreator_" + d.id);
            g.selector = b.id("folderSelector_" + d.id);
            g.folderName = b.id("folderName_" + d.id);
            g.folderNameError = b.id("folderNameError_" + d.id);
            s = '\t\t\t\t<div class="fcDropdown_title" id="fcDropdown_title_' + d.id + '">\u56fe\u6807</div>\t\t\t\t<div class="fcDropdown_body" id ="fcDropdown_body_' + d.id + '">\t\t\t\t\t<a class="fcDropdown_item" title="\u9ed8\u8ba4">' + o("folder") + '</a>\t\t\t\t\t<a class="fcDropdown_item" title="\u8054\u7cfb\u4eba">' + o("contact") + '</a>\t\t\t\t\t<a class="fcDropdown_item" title="\u6587\u672c">' + o("doc") + '</a>\t\t\t\t\t<a class="fcDropdown_item" title="\u6e38\u620f">' + o("game") + '</a>\t\t\t\t\t<a class="fcDropdown_item" title="\u751f\u6d3b">' + o("life") + '</a>\t\t\t\t\t<a class="fcDropdown_item" title="\u97f3\u4e50">' + o("music") + '</a>\t\t\t\t\t<a class="fcDropdown_item" title="\u5de5\u5177">' + o("tool") + '</a>\t\t\t\t\t<a class="fcDropdown_item" title="\u89c6\u9891">' + o("video") + "</a>\t\t\t\t</div>\t\t\t";
            g.dropdown = b.node("div", {
                id: "fcDropdown_" + d.id,
                "class": "folderCreatorDropdown"
            });
            g.dropdown.innerHTML = s;
            document.body.appendChild(g.dropdown);
            g.dropdownTitle = b.id("fcDropdown_title_" + d.id);
            g.dropdownBody = b.id("fcDropdown_body_" + d.id);
            g.folderType = b.id("folderType_" + d.id);
            g.folderSelector = b.id("folderSelector_" + d.id);
            b.hide(g.dropdown);
            g.dropdownPanel = new a.ui.PopupBox({
                noCatchMouseUp: !0,
                container: g.dropdown
            });
            g.folderName.value = alloy.fileSystem.getDefaultFolderName();
            g.folderName.select();
            var m = {
                onClick: function (a) {
                    a.preventDefault();
                    a.stopPropagation();
                    g.showDropDown()
                },
                onKeyDown: function (a) {
                    b.hide(g.folderNameError);
                    a.keyCode == 13 && m.onClickOkButton() && l.close()
                },
                onDropdownClick: function (a) {
                    a = a.target.getAttribute("idx");
                    g._selectedCate = a;
                    g.folderSelector.innerHTML = o(a)
                },
                onClickOkButton: function () {
                    var a = g.getFolderByName(),
                        c = g.getSelectedCate(),
                        l = alloy.fileSystem.isFileNameAvailable(a, k.FOLDER);
                    if (l != 0) return b.show(g.folderNameError), g.folderNameError.innerHTML = l, !1;
                    d.callback({
                        c: c,
                        n: a
                    });
                    return !0
                },
                onDragStart: function () {
                    g.hideDropDown()
                },
                onWindowClose: function () {
                    document.body.removeChild(g.dropdown)
                }
            };
            c.on(g.selector, "click", m.onClick);
            c.on(g.folderName, "keydown", m.onKeyDown);
            c.on(g.dropdownBody, "click", m.onDropdownClick);
            c.addObserver(l, "clickOkButton", m.onClickOkButton);
            c.addObserver(l, "dragStart", m.onDragStart);
            c.addObserver(l, "close", m.onWindowClose);
            this._selectedCate = "folder"
        },
        getSelectedCate: function () {
            return this._selectedCate
        },
        getFolderByName: function () {
            return this.folderName.value
        },
        showDropDown: function () {
            var a = b.getXY(this.selector);
            this.dropdownPanel.show();
            var c = alloy.layout.themeManager.getCurrentSkin().currentWindow.ie6WindowCenterBackground || "##B6EAFD";
            b.setStyle(this.dropdownTitle, "backgroundColor", c);
            b.setStyle(this.dropdown, "zIndex", alloy.layout.getTopZIndex(1));
            b.setXY(this.dropdown, a[0] + "px", a[1] + 57 + "px")
        },
        hideDropDown: function () {
            this.dropdownPanel.hide()
        },
        destroy: function () {}
    })
});
Jx().$package("alloy.desktopFile", function (a) {
    var c = {
        onFileCreateSuccess: function () {}
    };
    this.init = function () {};
    this.createFile = function (b, d) {
        if (alloy.system.getLoginLevel() > 1) {
            var g = b.folderId,
                k = alloy.storage.getDefaultDisk().key;
            alloy.storage.getFreeSpaceById(k) < b.fileSize ? alloy.storage.storageFullAlert(k) : (g == -1 && (g = alloy.desktopManager.getCurrentDesktopIndex()), alloy.fileSystem.createFile({
                t: alloy.fileSystem.FILE_TYPE.FILE,
                n: b.fileName,
                size: b.fileSize,
                md5: "",
                sha: "",
                s: k
            }, g, null, a.bind(function (a) {
                c.onFileCreateSuccess(a);
                alloy.storage.useSpace(a.s, a.size);
                d && d(a)
            }, this)))
        } else alloy.layout.showLoginWindow("")
    };
    this.deleteFile = function (a) {
        alloy.fileSystem.deleteFile(a, null, null, !1, !0);
        alloy.storage.releaseSpace(a.s, a.size)
    }
});
Jx().$package("alloy.windowFactory", function (a) {
    var c = this,
        b = a.dom,
        d = a.event,
        g, k, l, o, t, r = {
            onDesktopResize: function () {
                var a, b = alloy.windowManager.getWindowList(),
                    c;
                for (c in b) {
                    a = b[c];
                    var d = a.getBoxStatus();
                    if (d == "max" || d == "fullscreen") a: {
                        var g = void 0,
                            l = void 0,
                            k = void 0,
                            e = d = void 0,
                            e = l = g = d = k = void 0,
                            e = a.getBoxStatus(),
                            k = alloy.layout.getAreaWidth("left"),
                            d = alloy.layout.getAreaHeight("top"),
                            g = alloy.layout.getClientWidth(),
                            l = alloy.layout.getClientHeight();
                        if (e == "fullscreen") e = 5, g += e * 2, l += e * 2, k = -k - e, d = -d - e;
                        else if (e == "max") e = 10, g += e * 2, l += e * 2, k = -k - e, d = -d - e;
                        else break a;
                        (a.windowType == "window" || a.windowType == "chatbox" || a.windowType == "messagebox") && a.adjustSize(g, l, k, d)
                    } else a.getY() < 0 && a.setY(0)
                }
            },
            onWindowSetCenter: function () {
                var a = alloy.layout.getClientWidth(),
                    b = alloy.layout.getClientHeight(),
                    a = a > this.getWidth() ? (a - this.getWidth()) / 2 : 0,
                    b = b > this.getHeight() ? (b - this.getHeight()) / 2 : 0;
                this.setXY(a, b)
            },
            onWindowSetCurrent: function () {
                alloy.windowManager.setCurrentWindow(this);
                v(this);
                this.subMode == 1 && this.isSubWinFloat && this.subWin && v(this.subWin)
            },
            onWindowTitleBarClick: function () {
                g && g.focus()
            },
            onWindowDestroy: function () {
                alloy.app.gravity && alloy.app.gravity.removeBox(this);
                k && b.hide(k);
                a.platform.iPad || g && g.focus()
            },
            onWindowResize: function () {
                alloy.app.gravity && alloy.app.gravity.resizeBox(this);
                if (this.subMode == 1 && this.isSubWinFloat && this.subWin && this.isShow()) {
                    a.info("subWindowResize", "subWindow");
                    var c = b.getRelativeXY(this._subBodyOuter, this.container.parentNode);
                    this.subWin.setXY(c[0], c[1] + (a.browser.ie ? 2 : 0))
                }
            },
            onWindowMax: function () {
                var a = alloy.layout.getClientWidth(),
                    b = alloy.layout.getClientHeight(),
                    c = alloy.layout.getAreaWidth("left"),
                    d = alloy.layout.getAreaHeight("top");
                this.setXY(-c - 10, - d - 10);
                this.setWinWidth(a + 20);
                this.setWinHeight(b + 20)
            },
            onWindowRestore: function () {},
            onWindowFullscreen: function () {
                var c = alloy.layout.getClientWidth(),
                    d = alloy.layout.getClientHeight(),
                    f = alloy.layout.getAreaWidth("left"),
                    g = alloy.layout.getAreaHeight("top");
                this.setXY(-f - 5, - g - 5);
                this.setWinWidth(c + 10);
                this.setWinHeight(d + 10);
                this.setZIndexLevel(3);
                v(this);
                a.browser.mobileSafari || (k || (k = b.node("div", {
                    id: "fullscreen_tip",
                    "class": "fullscreen_tip"
                }), document.body.appendChild(k)), b.setStyle(k, "zIndex", alloy.layout.getTopZIndex(3)), b.show(k), this.subMode == 1 && this.isSubWinFloat && this.subWin && this.isShow() && (this.subWin.setZIndexLevel(3), v(this.subWin)), setTimeout(function () {
                    b.hide(k)
                }, 3E3))
            },
            onWindowRestoreFull: function () {
                this.setZIndexLevel(0);
                v(this);
                this.subMode == 1 && this.isSubWinFloat && this.subWin && this.isShow() && (this.subWin.setZIndexLevel(0),
                v(this.subWin))
            },
            onWindowHide: function () {
                this.subMode == 1 && this.isSubWinFloat && this.subWin && this.subWin.hide(!0)
            },
            onWindowShow: function () {
                if (this.subMode == 1 && this.isSubWinFloat && this.subWin) {
                    var c = b.getRelativeXY(this._subBodyOuter, this.container.parentNode);
                    this.subWin.setXY(c[0], c[1] + (a.browser.ie ? 2 : 0));
                    this.subWin.show()
                }
            },
            onWindowSetRight: function () {
                var a = this.getBodySize()[0];
                this.setX(alloy.layout.getClientWidth() - a)
            },
            onWindowBeforeDragStart: function () {
                var a = -10 - alloy.layout.getAreaHeight("top"),
                    b = -this.getTitleBarHeight() - this.getHeight();
                this.setDragLimite({
                    topMargin: a,
                    bottomMargin: b
                })
            }
        }, u = function (b) {
            if (b) {
                var c = b.option || {};
                c.isSetCurrent ? b.setCurrent({
                    fromInit: !0
                }) : b.setNotCurrent({
                    fromInit: !0
                });
                var d = alloy.layout.getAvailableWidth(),
                    g = alloy.layout.getAvailableHeight(),
                    l = b.getWidth(),
                    k = b.getHeight();
                b.getX();
                b.getY();
                k > g && (k = g);
                l > d && (l = d);
                if (b.windowType == "window" || b.windowType == "chatbox" || b.windowType == "messagebox") b.setWinWidth(l), b.setWinHeight(k);
                a.isUndefined(c.defaultMode) || b.restore();
                switch (c.defaultMode) {
                case "max":
                    b.max();
                    b._restoreWidth = c.defaultWidth;
                    b._restoreHeight = c.defaultHeight;
                    break;
                case "min":
                    b.min();
                    break;
                case "fullscreen":
                    b.fullscreen()
                }
                if (alloy.app.gravity) b.b2Box = alloy.app.gravity.createBox(b);
                c.isSetCentered && b.setWindowCentered()
            }
        }, v = function (a) {
            if (!a.isLockZIndex()) {
                var b = a.getZIndexLevel() || 0,
                    b = alloy.layout.getTopZIndex(b);
                a.setZIndex(b)
            }
        };
    this.init = function () {
        l = {};
        o = 0;
        t = !1;
        g || (g = b.node("input", {
            id: "qqweb_focus_input"
        }), g.setAttribute("type", "text"), document.body.appendChild(g));
        d.addObserver(alloy.layout, "desktopResize", r.onDesktopResize);
        d.addObserver(alloy.dock, "DockLocationChanged", r.onDesktopResize)
    };
    this.createWindow = function (g, k, f) {
        var h = l[g],
            k = a.clone(k);
        k.level = k.level ? parseInt(k.level) : 0;
        k.dragProxy = k.dragProxy || t;
        k.zIndex = k.zIndex || alloy.layout.getTopZIndex();
        k.topMargin = k.bottomMargin = 0;
        if (h) {
            if (!k.appendTo) {
                if (a.isUndefined(k.desktopIndex)) k.desktopIndex = alloy.desktopManager.getCurrentDesktopIndex();
                g = alloy.desktopManager.getDesktop(k.desktopIndex).getElement();
                k.appendTo = g
            }
            k.windowId = k.windowId || o++;
            h = new h(k);
            d.notifyObservers(c, "WindowCreate", h);
            h.setZIndexLevel(k.level);
            h.setLockZIndex(k.lockZIndex || !1);
            d.addObserver(h, "setCenter", r.onWindowSetCenter);
            d.addObserver(h, "setCurrent", r.onWindowSetCurrent);
            d.addObserver(h, "clickTitleBar", r.onWindowTitleBarClick);
            d.addObserver(h, "destroy", r.onWindowDestroy);
            d.addObserver(h, "resize", r.onWindowResize);
            d.addObserver(h, "hide", r.onWindowHide);
            d.addObserver(h, "show", r.onWindowShow);
            d.addObserver(h, "beforeDragStart",
            r.onWindowBeforeDragStart);
            d.addObserver(h, "SetRight", r.onWindowSetRight);
            (h.windowType == "window" || h.windowType == "chatbox" || h.windowType == "messagebox") && d.addObserver(h, "max", r.onWindowMax);
            if (a.isUndefined(k.x) && a.isUndefined(k.y)) {
                var n, p;
                p = n = 0;
                var k = h.option.clientWidth || alloy.layout.getAvailableWidth(),
                    g = h.option.clientHeight || alloy.layout.getAvailableHeight(),
                    v = k - h.getWidth(),
                    e = g - h.getHeight(),
                    j = v > 0 ? v / 2 : 0,
                    B = e > 0 ? e / 2 : 0,
                    x = h.getId(),
                    x = alloy.windowManager.getWindowList().length == 1 ? 0 : x < 0 ? 0 : x;
                n = (j + x * 25) % v + n;
                p = (B + x * 25) % e + p;
                n = n > 0 ? n : 0;
                p = p > 0 ? p : 0;
                n = n + parseInt(h.getWidth()) >= k ? 0 : n;
                p = p + parseInt(h.getHeight()) >= g ? 0 : p;
                h.setXY(n, p)
            } else p = alloy.layout.getAvailableWidth(), k = alloy.layout.getAvailableHeight(), e = h.getX() || 0, g = h.getY() || 0, e + h.getWidth() > p && (p -= h.getWidth(), h.setX(p < 0 ? 0 : p)), g + h.getHeight() > k && (k -= h.getHeight(), h.setY(k < 0 ? 0 : k)), h.subMode == 1 && h.isSubWinFloat && h.subWin && (k = b.getRelativeXY(h._subBodyOuter, h.container.parentNode), h.subWin.setXY(k[0], k[1] + (a.browser.ie ? 2 : 0)), h.subWin.show());
            f || u(h);
            d.notifyObservers(c, "WindowCreated", h);
            return h
        } else throw Error('WindowFactory: class "' + g + '" has not register!');
    };
    this.registerWindow = function (a, b) {
        l[a] = b
    };
    this.initWindow = u
});
Jx().$package("alloy.windowManager", function (a) {
    var c = a.event,
        b, d, g, k, l = {
            onWidnowCreated: function (a) {
                b.push(a);
                d[a.getId()] = a;
                a.windowType == "widget" ? k.push(a) : g.push(a);
                c.addObserver(a, "destroy", l.onWindowDestroy)
            },
            onWindowDestroy: function (c) {
                d[c.getId()] = null;
                c.windowType == "widget" ? a.array.remove(k, c) : a.array.remove(g, c);
                a.array.remove(b, c)
            }
        };
    this.init = function () {
        b = [];
        d = {};
        g = [];
        k = [];
        c.addObserver(alloy.windowFactory, "WindowCreated", l.onWidnowCreated)
    };
    this.getWindow = function (a) {
        return d[a]
    };
    this.getWindowList = function () {
        return b
    };
    this.getOnlyWindowList = function () {
        return g
    };
    this.getOnlyWidgetList = function () {
        return k
    };
    this.setCurrentWindow = function (a) {
        var b = alloy.desktopManager.getCurrentDesktop();
        a.desktopIndex !== b.getIndex() && alloy.desktopManager.setCurrentDesktop(a.desktopIndex);
        b = alloy.desktopManager.getCurrentDesktop();
        b.getWindowManager().setCurrentWindow(a)
    };
    this.getCurrentWindow = function () {
        return alloy.desktopManager.getCurrentDesktop().getWindowManager().getCurrentWindow()
    }
});
Jx().$package("alloy.desktopManager", function (a) {
    var c = a.dom,
        b = a.event,
        d = a.fx.transitions,
        g = {
            NORMAL: 1,
            EDIT: 2,
            DRAG: 3,
            MANAGE: 4
        }, k, l, o, t, r, u, v, s, m, f, h = [],
        n = {}, p = [],
        D = [],
        e = {}, j = g.NORMAL,
        B = [],
        x = [],
        y, A, w, q = [0, 0, 0, 0, 0],
        C = alloy.fileSystem.FILE_TYPE,
        F = 142,
        G = 112,
        J = 0,
        K = 0,
        N = 0,
        M = function (a) {
            return a === null || typeof a === "undefined"
        }, I = function () {
            alloy.navbar && alloy.navbar.setZIndex(11);
            c.setStyle(alloy.layout.getArea("bottom"), "zIndex", 12)
        }, Q = function () {
            alloy.navbar && alloy.navbar.setZIndex(10);
            c.setStyle(alloy.layout.getArea("bottom"), "zIndex", 10)
        }, R = [{
            text: "\u4e0a\u4f20\u6587\u4ef6",
            type: "flash",
            icon: {
                className: "add_file_icon"
            },
            onClick: function () {}
        }, {
            text: "\u6dfb\u52a0\u5e94\u7528",
            icon: {
                className: "add_app_icon"
            },
            onClick: function () {
                alloy.portal.runApp("appMarket");
                qqweb.util.report2qqweb("screen|" + alloy.desktopManager.getCurrentDesktopIndex() + "|addapp")
            }
        }, {
            text: "\u6dfb\u52a0\u684c\u9762\u8054\u7cfb\u4eba",
            icon: {
                className: "add_contact_icon"
            },
            onClick: function () {
                alloy.desktopContact.showSelectBuddyBox();
                qqweb.util.report2qqweb("add|desktop|adddeskcontanct")
            }
        }, {
            type: "separator"
        }, {
            text: "\u65b0\u5efa\u6587\u4ef6\u5939",
            icon: {
                className: "add_folder_icon"
            },
            onClick: function () {
                alloy.desktopFolder.createFolder();
                qqweb.util.report2qqweb("add|desktop|addfolder")
            }
        }],
        H = {
            onWindowCreated: function (c) {
                if (this.isWindowInDesktop(c)) {
                    this._windowArray.push(c);
                    if (c.windowType != "widget") {
                        var e = this,
                            d = function () {
                                this.getBoxStatus() === "max" && (a.array.contains(e._maxWindowArray, this) || e._maxWindowArray.push(this), e._maxWindowArray.length > 0 && Q())
                            }, f = function () {
                                a.array.remove(e._maxWindowArray,
                                this);
                                e._maxWindowArray.length == 0 && I()
                            };
                        b.addObserver(c, "max", d);
                        b.addObserver(c, "show", d);
                        b.addObserver(c, "restore", f);
                        b.addObserver(c, "min", f);
                        d.apply(c)
                    }
                    b.addObserver(c, "destroy", a.bind(H.onWindowDestroy, this))
                }
            },
            onWindowDestroy: function (b) {
                if (b == this.getCurrentWindow()) {
                    this.setCurrentWindow(null);
                    var c;
                    if (!this._preCurrentWindow && (c = this._windowArray[this._windowArray.length - 1])) this._preCurrentWindow = c == b ? this._windowArray[this._windowArray.length - 2] || null : c;
                    this._preCurrentWindow && this._preCurrentWindow.isShow() && this._preCurrentWindow.setCurrent()
                } else if (b == this._preCurrentWindow) this._preCurrentWindow = null;
                a.array.remove(this._windowArray, b);
                b.windowType != "widget" && (a.array.remove(this._maxWindowArray, b), this._maxWindowArray.length == 0 && I())
            },
            onDesktopSwitch: function (a) {
                this._desktopIndex == a && (this._maxWindowArray.length == 0 ? I() : Q())
            }
        }, W = new a.Class({
            init: function (c) {
                this._desktopIndex = c.desktopIndex;
                this._windowArray = [];
                this._preCurrentWindow = this._currentWindow = null;
                this._maxWindowArray = [];
                b.addObserver(alloy.windowFactory, "WindowCreated", a.bind(H.onWindowCreated, this));
                b.addObserver(alloy.portal, "DesktopSwitch", a.bind(H.onDesktopSwitch, this))
            },
            isWindowInDesktop: function (a) {
                if (M(a.desktopIndex)) return this._desktopIndex == alloy.desktopManager.getCurrentDesktopIndex();
                else if (this._desktopIndex == a.desktopIndex) return !0;
                return !1
            },
            setCurrentWindow: function (a) {
                if (a) if (this._currentWindow) {
                    if (this._currentWindow != a) this._preCurrentWindow = this._currentWindow, this._currentWindow.setNotCurrent()
                } else this._preCurrentWindow = null;
                this._currentWindow = a
            },
            getCurrentWindow: function () {
                return this._currentWindow
            }
        }),
        P = new a.Class({
            init: function (e) {
                var d = this._index = e.index,
                    f = this._el = c.node("div", {
                        index: d,
                        "class": "desktopContainer"
                    }),
                    j = this._iconContainer = c.node("div", {
                        "class": "appListContainer",
                        customAcceptDrop: 1,
                        index: d
                    });
                b.addObserver(j, "dragmove", E.onDesktopContainerDragMove);
                b.addObserver(j, "drop", E.onDesktopContainerDrop);
                if (a.browser.mobileSafari) b.on(j, "touchstart", E.onTouchStart);
                f.appendChild(j);
                if (a.browser.mobileSafari) c.setStyle(j, "overflow-y", "auto"), c.setStyle(j, "overflow-x", "hidden"), new a.ui.TouchScroller(j);
                else {
                    var g = new a.ui.ScrollArea(j);
                    g.update();
                    B.push(g);
                    c.setStyle(j, "overflow-y", "hidden")
                }
                a.browser.engine.webkit && c.setStyle(this._el, "left", alloy.layout.getDesktopWidth() + "px");
                c.hide(j);
                e.appendTo.appendChild(f);
                this._windowManager = new W({
                    desktopIndex: d
                });
                if (a.browser.engine.webkit) {
                    c.addClass(l, "desktopsContainerEx");
                    var h = this;
                    b.on(this._el, "webkitTransitionEnd", function () {
                        h._isCurrent || c.setClass(this, "desktopContainer");
                        q[h._index]--;
                        a: {
                            for (var a in q) if (q[a] > 0) break a;
                            c.addClass(l, "desktopsContainerEx")
                        }
                    })
                }
            },
            getElement: function () {
                return this._el
            },
            getIconContainer: function () {
                return this._iconContainer
            },
            getIndex: function () {
                return this._index
            },
            getWindowManager: function () {
                return this._windowManager
            },
            setCurrent: function (b, e) {
                this._isCurrent = !0;
                var d = this._el,
                    f = this;
                c.setClass(d, "desktopContainer desktop_current");
                if (e || j === g.DRAG) a.browser.engine.webkit && (c.addClass(l, "desktopsContainerEx"), c.addClass(d, "desktop_current_noanimation"));
                else if (a.browser.engine.webkit && (q[this._index] = 2, c.removeClass(l, "desktopsContainerEx")), a.browser.engine.webkit || a.browser.firefox) this._showAnimationTimer && clearTimeout(this._showAnimationTimer), this._disappearAnimationTimer && clearTimeout(this._disappearAnimationTimer), c.addClass(d, "desktop_show_prepare" + b), this._showAnimationTimer = setTimeout(function () {
                    c.addClass(d, "desktop_show_animation" + b);
                    f._showAnimationTimer = 0
                }, 100)
            },
            setNotCurrent: function (b, e) {
                c.removeClass(l, "desktopsContainerEx");
                this._isCurrent = !1;
                var d = this._el,
                    f = this;
                c.setClass(d, "desktopContainer");
                if (!(e || j === g.DRAG)) if (a.browser.engine.webkit) a.browser.engine.webkit && (q[this._index] = 1, c.removeClass(l, "desktopsContainerEx")), c.addClass(d, "desktop_disappear_prepare" + b), c.addClass(d, "desktop_disappear_animation" + b);
                else if (a.browser.firefox) this._showAnimationTimer && clearTimeout(this._showAnimationTimer), this._disappearAnimationTimer && clearTimeout(this._disappearAnimationTimer), c.addClass(d, "desktop_disappear_prepare" + b), this._disappearAnimationTimer = setTimeout(function () {
                    c.addClass(d, "desktop_disappear_animation" + b);
                    f._disappearAnimationTimer = 0
                }, 100)
            }
        }),
        E = {
            onTouchStart: function (a) {
                var e = a.target;
                if (c.hasClass(e, "appListContainer")) J = a.changedTouches[0].pageX, K = (new Date).getTime(), b.on(e, "touchmove", E.onTouchMove), b.on(e, "touchend", E.onTouchEnd)
            },
            onTouchMove: function () {},
            onTouchEnd: function (a) {
                var c = a.target;
                b.off(c, "touchmove", E.onTouchMove);
                b.off(c, "touchend", E.onTouchEnd);
                N = a.changedTouches[0].pageX - J;
                a = (new Date).getTime() - K;
                a = N / a;
                a > 50 ? T(!0) : a < -50 ? V(!0) : N > 60 ? T(!0) : N < -60 ? V(!0) : N = 0
            },
            onSwipe: function () {},
            onDesktopContainerDragMove: function () {},
            onDesktopContainerDrop: function (a) {
                var b = a.pos,
                    d = b.x,
                    f = b.y;
                f += this.scrollTop;
                var b = a.dragEl,
                    a = this.getAttribute("index") || t,
                    j = c.getClientXY(this);
                d -= j[0];
                f -= j[1];
                d = Math.floor(d / F);
                f = Math.floor(f / G);
                d = f >= v ? f * s + d : d * v + f;
                if (d > n[a].length) d = n[a].length;
                var g, h = b.getAttribute("type"),
                    f = {
                        t: h
                    }, j = alloy.fileSystem.FILE_TYPE;
                g = parseInt(b.getAttribute("fileId"));
                if (!isNaN(g)) {
                    if (h == j.FILE) {
                        var z = alloy.iconFactory.getIcons(g,
                        alloy.fileSystem.FILE_TYPE.FILE);
                        i = 0;
                        for (len = z.length; i < len; i++) if (z[i].isUploading()) return
                    }
                    f.id = g;
                    if (h == j.GROUP) f.gid = parseInt(b.getAttribute("gid"));
                    b = b.getAttribute("from");
                    g = n[a][d];
                    b == "buddy" ? (g && e[g] && e[g].type == j.FOLDER ? alloy.fileSystem.moveFile(f, e[g].fileId, null, null, null, !0) : alloy.desktopContact.addContactIcon(f, a, d), qqweb.util.report2qqweb("deskcontact|create|drag")) : alloy.fileSystem.isInFolder(f, alloy.fileSystem.getRootFolder(), !0) && (g && e[g] && e[g].type == j.FOLDER && f.t != j.FOLDER ? alloy.fileSystem.moveFile(f,
                    e[g].fileId, null, null, null, !0) : alloy.fileSystem.moveFile(f, a, d, null, null, !0))
                }
            },
            onGetAppConfigComplete: function () {
                ea();
                u = {};
                a.array.forEach(D, function (a) {
                    clearTimeout(a)
                });
                a.array.forEach(p, function (a) {
                    a && a.stop()
                });
                p = [];
                D = [];
                var c = alloy.fileSystem.getRootFolder(),
                    e = c.items,
                    c = alloy.fileSystem.getFolderById(t, c);
                aa(c.items, c.id, function () {
                    b.notifyObservers(alloy.portal, "FirstScreenReady");
                    for (var a = 0, c = 1; a < 5; ++a) t != e[a].id && (function (a, b) {
                        D[a] = setTimeout(function () {
                            aa(e[a].items, e[a].id)
                        }, b * 5E3)
                    }(a,
                    c), c++)
                })
            },
            onClearDefaultApp: function () {
                ea()
            },
            onFileMove: function (a) {
                if (a.targetId >= 0 && a.targetId < 5) {
                    if (a.targetId == a.sourceId) var b = X(a.file.id, a.file.t);
                    else a.sourceId >= 0 && a.sourceId < 5 && (b = X(a.file.id, a.file.t)) && da(b, a.sourceId, a.sourcePosition), b = z(a.file, o[a.targetId].getIconContainer(), a.targetId);
                    b && $(b, a)
                } else a.sourceId >= 0 && a.sourceId < 5 && (b = X(a.file.id, a.file.t)) && da(b, a.sourceId, a.sourcePosition)
            },
            onFileAdd: function (a) {
                var b = a.parent.id;
                if (b >= 0 && b < 5) {
                    var c = {
                        targetId: b,
                        targetPosition: a.position,
                        sourceId: -1,
                        sourcePosition: -1
                    };
                    (a = z(a.file, o[b].getIconContainer(), b)) && $(a, c)
                }
            },
            onFileDelete: function (a) {
                var b = a.parent.id;
                if (b >= 0 && b < 5) {
                    var c = X(a.file.id, a.file.t);
                    c && da(c, b, a.position)
                }
            },
            onFileOperateTimeout: function () {
                alloy.layout.alert("\u64cd\u4f5c\u8d85\u65f6\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")
            },
            onFileOperateError: function () {
                alloy.layout.alert("\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")
            },
            onAddFileFail: function (a) {
                a.retcode == 0 && a.result && a.result.code == 30001 ? alloy.storage.storageFullAlert() : alloy.layout.alert("\u6dfb\u52a0\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")
            },
            onCopyFileFail: function (a) {
                a.retcode == 0 && a.result && a.result.code == 30001 ? alloy.storage.storageFullAlert() : alloy.layout.alert("\u590d\u5236\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")
            },
            onMoveFileFail: function (a) {
                a.retcode == 0 && a.result && a.result.code == 30001 ? alloy.storage.storageFullAlert() : alloy.layout.alert("\u79fb\u52a8\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")
            },
            onUpdateFileFail: function () {
                alloy.layout.alert("\u66f4\u65b0\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")
            },
            onDeleteFileFail: function () {
                alloy.layout.alert("\u5220\u9664\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002")
            },
            onDesktopResize: function () {
                var b = alloy.layout.getAvailableWidth(),
                    e = alloy.layout.getAvailableHeight(),
                    b = {
                        width: b,
                        height: e
                    };
                if (b.width) {
                    var e = alloy.layout.getAreaWidth("left"),
                        d = alloy.layout.getAreaWidth("right");
                    y = b.width;
                    A = y + e + d;
                    c.setStyle(l, "width", y + "px");
                    for (var d = 0, f = o.length; d < f; ++d) e = o[d], c.setStyle(e.getIconContainer(), "width", b.width - 28 + "px"), c.setStyle(e.getIconContainer(), "marginLeft", "28px"), a.browser.engine.webkit && c.setStyle(e.getElement(), "left", A + "px"), c.setStyle(e.getElement(), "width", b.width + "px")
                }
                if (b.height) {
                    w = b.height - alloy.layout.getAreaHeight("bottom");
                    c.setStyle(l, "height", w + "px");
                    d = 0;
                    for (f = o.length; d < f; ++d) c.setStyle(o[d].getIconContainer(), "height", w - 46 + "px"), c.setStyle(o[d].getIconContainer(), "marginTop", "46px"), c.setStyle(o[d].getElement(), "height", w + "px")
                }
                c.setStyle(k, "left", alloy.layout.getAreaWidth("left") + "px");
                c.setStyle(k, "right", alloy.layout.getAreaWidth("right") + "px");
                b = w - 46;
                s = Math.floor((y - 28) / F);
                v = Math.floor(b / G);
                fa()
            },
            onDockLocationChanged: function () {
                var a = alloy.layout.getAreaHeight("top");
                c.setStyle(l, "top", a + "px");
                E.onDesktopResize()
            },
            onSortControllerDragEnd: function (a) {
                alloy.util.report2qqweb("screen|screendrag");
                j === g.DRAG && S(g.NORMAL);
                var b = a.apperceiveEl,
                    a = b.getAttribute("fileId"),
                    b = b.getAttribute("type");
                if (a && b && (a = {
                    id: a,
                    t: b
                }, (a = alloy.fileSystem.getFileByFile(a)) && a.processing)) if (a = alloy.iconFactory.getIcons(a.id, a.t)) for (var b = 0, c = a.length; b < c; b++) a[b].disable()
            },
            onSortControllerDragStart: function () {
                S(g.DRAG)
            },
            onUACReady: function () {
                L(ga() - 1, !0);
                ha(ia())
            }
        }, L = function (e, d) {
            if (e === t || M(e) || !o[e]) return !1;
            if (u && !u[e]) {
                var f = alloy.fileSystem.getFolderById(e);
                aa(f.items, f.id)
            }
            f = e > t ? 1 : 2;
            M(t) || o[t].setNotCurrent(f, d);
            t = e;
            o[e].setCurrent(f, d);
            a.browser.ie == 6 && c.setStyle(document.body, "height", c.getStyle(document.body, "height"));
            x[e] && Y(e);
            b.notifyObservers(alloy.portal, "DesktopSwitch", t);
            return !0
        }, V = function () {
            var a = t + 1;
            a >= o.length || L(a)
        }, T = function () {
            var a = t - 1;
            a < 0 ? alloy.portal.isWebTop() && alloy.portal.switchToDesktop() : L(a)
        }, S = function (a) {
            a = a || g.NORMAL;
            if (a === g.EDIT) {
                if (j === g.DRAG) return;
                c.addClass(k, "appButtonEditState");
                for (var e = 0, d = h.length; e < d; ++e) h[e].setAttribute("title", "\u8fd4\u56de"), h[e].lastChild.firstChild.innerHTML = "\u8fd4\u56de";
                r.lock()
            } else if (a === g.NORMAL) {
                c.removeClass(k, "appButtonEditState");
                e = 0;
                for (d = h.length; e < d; ++e) h[e].setAttribute("title", "\u6dfb\u52a0"), h[e].lastChild.firstChild.innerHTML = "\u6dfb\u52a0"
            }
            a !== g.EDIT && r.isLock() && r.unlock();
            j = a;
            b.notifyObservers(alloy.portal, "DesktopSwitchStatus", {
                status: a
            });
            return a
        }, U = document.createElement("div");
    U.className = "appButton addQuickLinkButton";
    U.setAttribute("title", "\u6dfb\u52a0");
    U.innerHTML = '<div class="addQuickLinkButtonInner"></div>        <div class="appButton_appName"><div class="appButton_appName_inner">\u6dfb\u52a0</div><div class="appButton_appName_inner_right"></div></div>';
    var Z = function (a) {
        a.stopPropagation();
        j === g.EDIT ? (S(g.NORMAL), alloy.util.report2qqweb("screen|ipad|edited")) : (alloy.layout.showContextMenu({
            x: a.clientX,
            y: a.clientY
        }, {
            items: R
        }), alloy.util.report2qqweb("add|add|" + alloy.desktopManager.getCurrentDesktopIndex()))
    }, z = function (b, c) {
        var d = {
            parentNode: c
        }, f;
        if (b.t == C.APP) {
            var j = b.id;
            f = alloy.appconfig.getAppConfig(j);
            if (!f) return a.profile('createFileIcon. id="' + j + '" appConfig is null', "DesktopManager"), alloy.fileSystem.deleteFile(b, null, null, null, !1), null;
            f = alloy.iconFactory.createIcon(b.t, d, f)
        } else if (b.t == C.BUDDY || b.t == C.GROUP) f = alloy.iconFactory.createIcon(b.t, d, b);
        else if (b.t == C.FOLDER || b.t == C.FILE) f = alloy.iconFactory.createIcon(b.t, d, b);
        f && (e[f.getId()] = f, r.addDragClass(f.getElement()));
        return f
    }, $ = function (a, b) {
        var c = b.targetId,
            e = b.targetPosition,
            d = b.sourcePosition,
            f = -1;
        b.sourceId == c ? (n[c].splice(d, 1), n[c].splice(e, 0, a.getId()), d > e ? (f = d, d = e) : f = e) : (d = e, n[c].splice(e, 0, a.getId()));
        Y(c, d, f)
    }, aa = function (b, e, f) {
        typeof progress == "function" && progress("screen:" + e);
        if (!u[e]) {
            u[e] = !0;
            var j = o[e].getIconContainer();
            c.hide(j);
            var g = new a.fx.Animation({
                element: j,
                property: "opacity",
                from: 0,
                to: 1,
                unit: !1,
                duration: 2E3,
                fps: 30,
                transition: d.sinusoidal.easeOut
            });
            p[e] = new a.Chunk(b, function (a) {
                a && (a = z(a, j, e)) && n[e].push(a.getId())
            }, this, !1, function () {
                fa();
                setTimeout(function () {
                    a.browser.ie == 7 || a.browser.ie == 6 ? c.show(j) : (c.setStyle(j, "opacity", 0), c.show(j), g.start())
                }, 500);
                f && f()
            })
        }
    }, da = function (a, b, c) {
        n[b].splice(c, 1);
        a = e[a.getId()];
        delete e[a.getId()];
        a.destroy();
        Y(b,
        c)
    }, ea = function () {
        for (var a = 0, b = o.length; a < b; ++a) n[a].length = 0;
        for (a in e) b = e[a], e[a] = null, delete e[a], b.destroy && b.destroy()
    }, X = function (a, b) {
        typeof b !== "undefined" && (a = b + "_" + a);
        return e[a]
    }, ba = {}, fa = function () {
        for (var a = 0, b = o.length; a < b; ++a) ba["" + a] || function (a) {
            ba[a] = setTimeout(function () {
                Y(a);
                ba["" + a] = null
            }, 500)
        }(a)
    }, ca = function (a, b, e) {
        var d = m || (m = c.getWidth(a)),
            j = f || (f = c.getHeight(a)),
            b = (F - d) / 2 + b,
            e = (G - j) / 2 + e;
        c.setStyle(a, "left", b + "px");
        c.setStyle(a, "top", e + "px")
    }, Y = function (a, b, c) {
        var b = 0,
            c = -1,
            e = n[a],
            d = e.length;
        if (d == 0) ca(h[a], 0, 0);
        else {
            b !== void 0 ? b > d - 1 && (b = d - 1) : b = 0;
            if (c == void 0 || c == -1 || c > d - 1) c = d - 1;
            var f = Math.floor(b / v) * F,
                j = b % v * G,
                g = v * s <= b + 1;
            g && (f = b % s * F, j = Math.floor(b / s) * G);
            for (; b <= c; b++) if (g = e[b], g != void 0 && (g = X(g))) ca(g.getElement(), f, j), (g = v * s <= b + 1) ? (b + 1) % s == 0 ? (f = 0, j += G) : f += F : (b + 1) % v == 0 ? (j = 0, f += F) : j += G;
            c == d - 1 && ca(h[a], f, j);
            B[a] && B[a].update(a);
            x[a] = 0
        }
    }, ga = function () {
        return alloy.config.configList.defaultScreen || 3
    }, ia = function () {
        return alloy.config.configList.desktopIconStyle || 0
    }, ha = function (a, e, d) {
        alloy.config.configList.desktopIconStyle = a;
        a == 0 ? (F = 142, G = 112, c.removeClass(l, "desktopSmallIcon")) : (G = F = 90, c.addClass(l, "desktopSmallIcon"));
        var j = w - 46;
        s = Math.floor((y - 28) / F);
        v = Math.floor(j / G);
        f = m = 0;
        x = [1, 1, 1, 1, 1];
        Y(t);
        e && alloy.portal.getLoginLevel() > alloy.CONST.LOGIN_LEVEL_NONE && (d ? alloy.rpcService.sendMSetConfigDelay({
            data: {
                0: {
                    desktopIconStyle: a
                }
            },
            delay: d
        }) : alloy.rpcService.sendSetConfig({
            data: {
                r: {
                    appid: 0,
                    value: {
                        desktopIconStyle: a
                    }
                }
            }
        }));
        b.notifyObservers(alloy.desktopManager, "DesktopIconStyleChanged",
        a)
    };
    this.init = function (e) {
        var d = e.initializeLength || 5,
            e = e.currentDesktopIndex || Math.floor(d / 2);
        k = alloy.layout.getArea("main");
        k.innerHTML = '            <div id="desktopsContainer"></div>';
        l = c.id("desktopsContainer");
        c.setClass(l, "desktopsContainer");
        r = new a.ui.Sortables([], "id");
        var f;
        o = [];
        for (var j = 0; j < d; ++j) {
            f = new P({
                index: j,
                appendTo: l
            });
            o.push(f);
            r.addDropTarget({
                el: f.getIconContainer(),
                level: 0
            });
            n[j] = [];
            f = j;
            var g = U.cloneNode(!0);
            g.setAttribute("screen", f);
            o[f].getIconContainer().appendChild(g);
            b.on(g, "click", Z);
            h.push(g)
        }
        L(e, !0);
        b.addObserver(r, "start", E.onSortControllerDragStart);
        b.addObserver(r, "end", E.onSortControllerDragEnd);
        b.addObserver(alloy.layout, "desktopResize", E.onDesktopResize);
        b.addObserver(alloy.dock, "DockLocationChanged", E.onDockLocationChanged);
        b.addObserver(alloy.appconfig, "GetAppConfigComplete", E.onGetAppConfigComplete);
        b.addObserver(alloy.appconfig, "GetDefaultAppConfigComplete", E.onGetAppConfigComplete);
        b.addObserver(alloy.appconfig, "ClearDefaultApp", E.onClearDefaultApp);
        b.addObserver(alloy.fileSystem, "FileMove", E.onFileMove);
        b.addObserver(alloy.fileSystem, "FileAdd", E.onFileAdd);
        b.addObserver(alloy.fileSystem, "FileDelete", E.onFileDelete);
        b.addObserver(alloy.fileSystem, "FileOperateTimeout", E.onFileOperateTimeout);
        b.addObserver(alloy.fileSystem, "FileOperateError", E.onFileOperateError);
        b.addObserver(alloy.fileSystem, "AddFileFail", E.onAddFileFail);
        b.addObserver(alloy.fileSystem, "CopyFileFail", E.onCopyFileFail);
        b.addObserver(alloy.fileSystem, "DeleteFileFail", E.onDeleteFileFail);
        b.addObserver(alloy.fileSystem, "MoveFileFail", E.onMoveFileFail);
        b.addObserver(alloy.fileSystem, "UpdateFileFail", E.onUpdateFileFail);
        b.addObserver(alloy.portal, "UACReady", E.onUACReady)
    };
    this.DESK_STATUS = g;
    this.setCurrentDesktop = L;
    this.goNextDesktop = V;
    this.goPrevDesktop = T;
    this.refreshDesktop = function () {
        r.refreshDropTarget()
    };
    this.getDesktop = function (a) {
        return o[a]
    };
    this.getDesktopList = function () {
        return o
    };
    this.getCurrentDesktopIndex = function () {
        return t
    };
    this.getCurrentDesktop = function () {
        return o[t]
    };
    this.setDesktopStatus = S;
    this.getDesktopStatus = function () {
        return j
    };
    this.getDragController = function () {
        return r
    };
    this.getDefaultDesktop = ga;
    this.setDefaultDesktop = function (a, b, c) {
        a = Number(a);
        if (b && alloy.portal.getLoginLevel() > alloy.CONST.LOGIN_LEVEL_NONE) alloy.config.configList.defaultScreen = a, c ? alloy.rpcService.sendMSetConfigDelay({
            data: {
                0: {
                    defaultScreen: a
                }
            },
            delay: c
        }) : alloy.rpcService.sendSetConfig({
            data: {
                r: {
                    appid: 0,
                    value: {
                        defaultScreen: a
                    }
                }
            }
        })
    };
    this.getDesktopIconStyle = ia;
    this.setDesktopIconStyle = ha
});
Jx().$package("alloy.portal", function (a) {
    var c = this,
        b = a.dom,
        d = a.event,
        g = a.http,
        k, l = !1,
        o, t = alloy.CONST.LOGIN_LEVEL_NONE,
        r = 0,
        u, v = 1,
        s, m, f = !1,
        h = !1,
        n = 0,
        p = 0,
        D, e = !1,
        j = "",
        B, x, y = "",
        A = "",
        w = null,
        q = 0,
        C = !1,
        F, G, J, K, N = !1,
        M, I, Q = [],
        R = [],
        H = 0,
        W = "socket",
        P, E = 0,
        L = {}, V, T = null,
        S = !0;
    alloy.system = c;
    c.speedTest = alloy.util.speedTest;
    c.isWebTop = function () {
        return window.webTop ? !0 : !1
    };
    c.isWebTopAir = function () {
        return /AIR/.test(webTop.type) ? !0 : !1
    };
    c.isWebTopQT = function () {
        return /QT\//.test(webTop.type) ? !0 : !1
    };
    c.isWebTopWin = function () {
        return /WIN/.test(webTop.type) ? !0 : !1
    };
    this.setPortalSelf = function (b) {
        c.self = c.self || {};
        c.self.uin = b.uin || c.getUin();
        c.self.allow = b.allow;
        c.self.age = b.age;
        c.self.nick = b.nick;
        c.self.vip = b.vip_info;
        c.self.vipRoam = null;
        c.self.htmlNick = a.string.encodeHtml(String(b.nick));
        c.self.titleNick = String(b.nick);
        c.self.country = b.country;
        c.self.province = b.province;
        c.self.city = b.city;
        c.self.gender = b.gender;
        c.self.face = b.face;
        c.self.phone = b.phone;
        c.self.mobile = b.mobile;
        c.self.email = b.email;
        c.self.uiuin = b.uiuin || b.uin
    };
    this.setPortalSelfItem = function (a,
    b) {
        c.self[a] = b
    };
    this.getPortalSelf = function (a) {
        return typeof c.self == "undefined" ? {} : typeof a == "undefined" ? c.self : c.self[a]
    };
    this.isNewUser = function () {
        return e
    };
    this.setIsNewUser = function (a) {
        e = a
    };
    var U = function () {
        a.profile("runCoreApps Start!", "portal!");
        alloy.notifier.init();
        c.runApp("tips", {
            callback: function () {
                a.profile("runCoreApps Finish!", "portal!")
            }
        })
    }, Z = function () {
        var a = c.getLoginLevel(),
            b;
        a == 1 ? b = "panel" : a == 2 ? b = "go" : a == 3 && (b = "logined");
        return b
    };
    this.setReRunAppList = function (a) {
        Q = a
    };
    this.getReRunAppList = function () {
        return Q
    };
    var z = function () {
        a.profile("reRunBeforeLoginApps Start!", "portal!");
        if (Q) {
            for (var b = 0; b < Q.length; ++b) {
                var e, d;
                a.isArray(Q[b]) ? (e = Q[b][0], d = Q[b][1], d = c.getUrlOption(e) || d, c.removeUrlOption(e)) : e = Q[b];
                var f = c.getApp(e);
                f && !f.isRunning() && (e == alloy.config.__eqqid ? (e = Z(), a.debug("run EQQ in [reRunBeforeLoginApps],level:" + c.getLoginLevel() + ": " + e, "_plogin"), c.runApp(alloy.config.__eqqid, {
                    loginMode: e
                })) : d ? c.runApp(e, d) : c.runApp(e))
            }
            c.setReRunAppList([])
        }
        a.profile("reRunBeforeLoginApps Finish!", "portal!")
    };
    this.getDefaultRunApps = function () {
        T = T == null ? [] : T;
        return [].concat([], [], T)
    };
    var $ = function () {
        var b = decodeURIComponent(window.location.search);
        if (b.indexOf("appUrl") == -1 && (b = a.string.mapQuery(b).run || "")) return a.json.parse(b)
    }, aa = function () {
        var b = $();
        if (a.isObject(b)) for (var e in b) alloy.portal.runApp(e, c.getUrlOption(e) || {
            runFrom: "url"
        });
        window.location.search.indexOf("_APPBOX") > -1 && alloy.util.report2qqweb("monitor|signin|fromqqclient");
        window.location.search.indexOf("CLIENT.QQ.PROFILE") > -1 && alloy.util.report2qqweb("monitor|signin|fromqqclientminicard")
    }, da = function (b) {
        if (a.isObject(b)) for (var c in b) if (a.isObject(b[c]) || a.isArray(b[c])) {
            if (!arguments.callee.call(this, b[c])) return !1
        } else {
            if (!a.isNumber(b[c]) && /(\'|\")/g.test(b[c])) return a.error("urlApp option\u4e2dvalue\u503c\u7684\u5b57\u7b26\u4e32\u4e0d\u80fd\u5305\u542b\u5355\u53cc\u5f15\u53f7\uff01"), !1
        } else if (a.isArray(b)) for (var e = 0; e < b.length; e++) if (a.isObject(b[e]) || a.isArray(b[e])) {
            if (!arguments.callee.call(this, b[e])) return !1
        } else {
            if (!a.isNumber(b[e]) && /(\'|\")/g.test(b[c])) return a.error("urlApp option\u4e2dvalue\u503c\u7684\u5b57\u7b26\u4e32\u4e0d\u80fd\u5305\u542b\u5355\u53cc\u5f15\u53f7\uff01"), !1
        } else return !1;
        return !0
    }, ea = function () {
        var b = $();
        if (a.isObject(b)) for (var e in b) if (a.isObject(b[e])) da(b[e]) ? (b[e].runFrom = "url", m = {}, ~~e != 0 && !c.getAllConfig(e) && (m.appMarket = {
            page: "introduce",
            option: {
                appid: e
            },
            runFrom: "url"
        }), m[e] = b[e]) : b[e].runFrom = "url"
    };
    this.getUrlOption = function (a) {
        return m && m[a] || null
    };
    this.removeUrlOption = function (a) {
        m && delete m[a];
        m && !a && (m = null)
    };
    this.getIsAlloyJsReady = function () {
        return u
    };
    var X = function () {
        a.profile("reset start!", "portal!");
        if (u) {
            var b = c.getRunningAppStatus();
            if (b) {
                N = !0;
                for (var e = 0; e < b.appList.length; e++) {
                    var j = b.appList[e].appId;~~j && (j = "app" + j);
                    (j = alloy.app[j]) && j.isRunning() && j.exit()
                }
                N = !1
            }
        }
        f = !1;
        d.notifyObservers(alloy.portal, "reset", c.getLoginLevel());
        a.profile("reset finish!", "portal!")
    }, ba = function () {
        M = s = !0;
        a.profile("tryLogin start, tryLoginLevel:" + t, "portal!");
        qqweb.util.report2h("pass_ptlogin", "start");
        typeof progress == "function" && progress("pass_ptlogin");
        if (t > alloy.CONST.LOGIN_LEVEL_NONE) if (alloy.util.report2h("get_vfwebqq", "start"), r = c.getCookieUin(), G) {
            if (c.setUin(r), ca() ? X() : M = !1, t == alloy.CONST.LOGIN_LEVEL_ALL) {
                c.setLoginLevel(alloy.CONST.LOGIN_LEVEL_ALL);
                a.debug("run EQQ in [tryLogin],tryLoginLevel:" + t, "_plogin");
                var b = {
                    directLogin: !0
                };
                if (c.getTryLoginState()) b.loginState = c.getTryLoginState();
                c.runApp(alloy.config.__eqqid, b)
            }
        } else alloy.rpcService.sendGetSeftInfo(r);
        else r = 0, c.setUin(r), fa();
        a.profile("tryLogin finish!", "portal!")
    }, fa = function () {
        d.notifyObservers(c, "SimpleUACReady", {
            uacLoaded: 3
        })
    }, ca = function () {
        return c.getUin() === c.getOldUin() ? (a.debug("uin not change: " + c.getUin(), "_plogin"), !1) : (a.debug("uin change: " + c.getOldUin() + " -> " + c.getUin(), "_plogin"), !0)
    }, Y = function () {
        return v === o ? (a.debug("loginLevel not change: " + v, "_plogin"), !1) : (a.debug("loginLevel change: " + o + " -> " + v, "_plogin"), !0)
    }, ga = function () {
        l || alloy.portal.recoverCookie()
    };
    this.longPoll = function (b) {
        if (b) b = b.r,
        H = b.ssid, R = b.al;
        alloy.rpcService.psSend(alloy.CONST.PS_CGI_URL + "kl/poll", {
            context: c,
            method: "GET",
            timeout: 61E3,
            data: {
                ssid: H
            },
            onSuccess: function (b) {
                if (b.c == 0) for (var b = b.r, e = b.ml, d = 0; d < e.length; ++d) a.event.notifyObservers(qqweb.portal, "message", e[d]);
                b.c != 22905 ? c.longPollIn() : E < 3 && (c.longPollLogin(), ++E)
            },
            onError: function () {},
            onTimeout: function () {}
        })
    };
    this.longPollIn = function () {
        alloy.rpcService.psSend(alloy.CONST.PS_CGI_URL + "kl/poll", {
            context: c,
            method: "GET",
            timeout: 61E3,
            data: {
                ssid: H
            },
            onSuccess: function (b) {
                if (b.c == 0) for (var b = b.r, e = b.ml, d = 0; d < e.length; ++d) a.event.notifyObservers(qqweb.portal, "message", e[d]);
                b.c != 22905 ? c.longPollIn() : E < 3 && (c.longPollLogin(), ++E)
            },
            onError: function () {},
            onTimeout: function () {}
        })
    };
    this.longPollLogin = function () {
        alloy.rpcService.psSend(alloy.CONST.PS_CGI_URL + "kl/login", {
            context: c,
            method: "GET",
            timeout: 1E4,
            data: {
                ct: 1,
                sl: 0,
                ua: 1
            },
            onSuccess: function (a) {
                a.c == 0 ? c.longPoll(a) : E < 3 && (c.longPollLogin(), ++E)
            },
            onError: function () {},
            onTimeout: function () {}
        })
    };
    this.initPushService = function () {
        a.browser.plugins.flash ? b.id("socketFlash").innerHTML = '<object style="position:absolute;left:1px;top:1px;" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9.0.45.0" width="1" height="1" id="Socket" align="middle">\t\t\t\t<param name="allowScriptAccess" value="always" />\t\t\t\t<param name="allowFullScreen" value="false" />\t\t\t\t<param name="movie" value="swf/Socket.swf?t=20111011001" /><param name="quality" value="high" /><param name="wmode" value="opaque" /><param name="bgcolor" value="#ffffff" /><embed src="swf/Socket.swf?t=20111011001" quality="high" wmode="opaque" bgcolor="#ffffff" width="1" height="1" name="Socket" align="middle" allowScriptAccess="sameDomain" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer_cn" />\t\t\t\t</object>' : (c.longPollLogin(), W = "longPoll")
    };
    var ia = function () {
        a.cookie.remove("ptwebqq", alloy.CONST.MAIN_DOMAIN)
    }, ha = function () {
        var a = alloy.windowManager.getOnlyWidgetList(),
            b = {}, c, e;
        for (e in a) c = a[e], b[c.getAppId()] = c.desktopIndex;
        return b
    }, O = {
        onPortalReady: function (b) {
            typeof progress == "function" && progress("portalReady", 0);
            f = !0;
            q++;
            a.profile("onPortalReady, portalReadyCount:" + q + ", currentLevel:" + b + ", oldLevel:" + o, "portal!");
            if (ca() || q == 1) {
                b = 0;
                if (a.browser.ie == 6 || a.browser.ie == 7) b = 500;
                setTimeout(function () {
                    var b = $();
                    if (a.isObject(b)) ea(), aa();
                    else {
                        ea();
                        a.profile("runAppsInRunStatus Start!", "portal!");
                        c.getLoginLevel() < alloy.CONST.LOGIN_LEVEL_NOCHAT ? b = alloy.config.getDefaultRunWidget() : (alloy.config.removeFromRunStatusList(alloy.config.getDeleteAppList()), b = alloy.config.getRunStatus());
                        if (b) {
                            T = T == null ? [] : T;
                            for (var e in b) T.push(e);
                            var d, f;
                            for (f in b) e = Number(f), d = b[f], c.runApp(e, {
                                desktopIndex: d
                            });
                            a.profile("runAppsInRunStatus Finish!", "portal!")
                        }
                        if (c.getLoginLevel() < alloy.CONST.LOGIN_LEVEL_NOCHAT) {
                            a.profile("runDefaultApps Start!", "portal!");
                            f = [];
                            b = c.getLoginLevel();
                            for (e = 0; e < f.length; ++e) f[e] == alloy.config.__eqqid ? b != 3 && (d = Z(), a.debug("run EQQ in [runDefaultApps],level:" + b + ": " + d, "_plogin"), c.runApp(alloy.config.__eqqid, {
                                loginMode: d
                            })) : c.runApp(f[e]);
                            a.profile("runDefaultApps Finish!", "portal!")
                        }
                        z();
                        aa();
                        a.profile("runPopApps Start!", "portal!");
                        f = [];
                        for (b = 0; b < f.length; ++b) switch (f[b]) {
                            default: c.runApp(f[b])
                        }
                        a.profile("runPopApps Finish!", "portal!")
                    }
                    U()
                }, b)
            }
            if (q == 1) {
                window.webTop && webTop.ui.channel.postCmd(19);
                try {
                    typeof pgvMain == "function" && (window.webTop ? pgvMain("", {
                        virtualDomain: "web2.qq.com"
                    }) : pgvMain("", {
                        virtualDomain: alloy.CONST.DEFAULT_DOMAIN
                    })), qqweb.util.report2h("portal", "end", "ok"), qqweb.portal.speedTest.sRTS(8, "end", new Date, !0)
                } catch (e) {}
            }
            c.getLoginLevel() > qqweb.CONST.LOGIN_LEVEL_NONE && c.initPushService();
            b = a.string.mapQuery(location.href.toLowerCase());
            b.adtag && b.adtag == "desktop" && alloy.util.report2qqweb("monitor|signin|fromqqclient165desktop");
            alloy.system.runApp("explorer")
        },
        onExitSuccess: function () {
            location.reload()
        },
        onGetVfWebQQError: function () {
            a.profile("onGetVfWebQQError", "portal!");
            qqweb.util.report2h("get_vfwebqq", "end", "error");
            c.setUin(0);
            c.setLoginLevel(qqweb.CONST.LOGIN_LEVEL_NONE);
            fa()
        },
        onGetVfWebQQSuccess: function (b) {
            c.setLoginLevel(alloy.CONST.LOGIN_LEVEL_NOCHAT);
            c.setUin(r);
            w = b.result ? b.result.vfwebqq : null;
            a.profile("onGetVfWebQQSuccess, vfwebqq:" + w, "portal!");
            qqweb.util.report2h("get_vfwebqq", "end", "ok");
            X();
            d.notifyObservers(alloy.portal, "GetLoginInfoSuccess", {
                isSelfInfoLoad: !0
            })
        },
        onGetLoginInfoSuccess: function (a) {
            typeof progress == "function" && progress("get_vfwebqq");
            qqweb.util.report2h("pass_ptlogin", "end", "ok");
            if (!a || !a.isSelfInfoLoad) alloy.util.report2h("get_selfinfo", "start"), alloy.rpcService.sendGetUserInfo(alloy.portal.getUin())
        },
        onGetSelfInfoSuccess: function (b) {
            if (b.retcode == 0) {
                var c = b.arguments.uin,
                    e = b.result;
                if (alloy.portal.getUin() == c) e.uiuin = alloy.portal.getCookiePTUiUin(), alloy.portal.setPortalSelf(e), d.notifyObservers(alloy.portal, "selfInfoReady", alloy.portal.getPortalSelf()), qqweb.util.report2h("get_selfinfo", "end", ["ok"][b.retcode] || b.retcode), alloy.util.stat.report()
            } else a.error("[sendGetUserInfo\uff1a\u6570\u636e\u683c\u5f0f\u9519\u8bef] error: " + b.retcode + "-" + b.errmsg)
        },
        onSelfInfoReady: function () {
            a.profile("onSelfInfoReady", "portal!");
            s && (s = !1, M ? (M = !1, alloy.config.init()) : Y() && z())
        },
        onReset: function () {},
        onUACReady: function () {
            u ? d.notifyObservers(alloy.portal, "AlloyReady") : d.notifyObservers(alloy.portal, "FrameWorkReady")
        },
        onFrameWorkReady: function () {
            typeof progress == "function" && progress("FrameWorkReady",
            100);
            alloy.layout.hideStartingCover();
            var b;
            b = a.browser.mobileSafari ? 1 : 0;
            var c = alloy.CONST.CDN_URL + "alloy/";
            g.loadCss(alloy.CONST.CDN_URL + "style/qqweb.main.2.css?t=" + alloy.CONST.UPDATE_TIME_STAMP, {
                onSuccess: function () {}
            });
            g.loadScript(c + b + "/qqweb.part2.js?t=" + alloy.CONST.UPDATE_TIME_STAMP, {
                onSuccess: function () {
                    u = !0;
                    d.notifyObservers(alloy.portal, "AlloyJsReady");
                    d.notifyObservers(alloy.portal, "AlloyReady")
                }
            })
        },
        onAlloyJsReady: function () {
            typeof progress == "function" && progress("AlloyJsReady", 0);
            alloy.navbar.init();
            alloy.sound.init();
            alloy.hotkeyManager.init();
            alloy.hotkey.init();
            alloy.messageSystem.init();
            alloy.pushService.init();
            alloy.localStorage.init();
            alloy.windowFactory.registerWindow("Window", alloy.businessClass.Window);
            alloy.windowFactory.registerWindow("EqqWindow", alloy.businessClass.EqqWindow);
            alloy.windowFactory.registerWindow("Widget", alloy.businessClass.Widget)
        },
        onFirstScreenReady: function () {
            typeof progress == "function" && progress("FirstScreenReady", 0);
            var b = c.getLoginLevel();
            a.profile("onGetAppConfigComplete", "portal!");
            try {
                d.notifyObservers(alloy.portal, "portalReady", b)
            } catch (e) {
                a.error("portalReady, but [portalReady notify] error, level:" + b)
            }
        },
        onGetAppConfigComplete: function () {},
        onLoginLevelChange: function () {},
        onUpdateAppConfig: function (a) {
            var b = c.getApp(a.id);
            b && b.updateAppConfig(a)
        },
        onRemoveAppConfig: function (a) {
            var b = c.getApp(a.id);
            b && b.removeAppConfig(a);
            delete alloy.app["app" + a.id];
            c.setAppLoading(a.id, !1)
        },
        onAppRun: function (a) {
            if (!(alloy.portal.getLoginLevel() == alloy.CONST.LOGIN_LEVEL_NONE || !alloy.portal.getVfWebQQ() || !Number(a))) if ((a = alloy.portal.getAllConfig(a)) && !(a.preview || a.windowType != "widget")) a = ha(), alloy.rpcService.sendMSetConfigDelay({
                data: {
                    0: {
                        runWidgets: a
                    }
                },
                delay: 2E3
            })
        },
        onAppExit: function (a) {
            if (!(alloy.portal.getLoginLevel() == alloy.CONST.LOGIN_LEVEL_NONE || !alloy.portal.getVfWebQQ() || N || a.preview)) {
                var b = a.window || a.widget;
                if (b && (a = Number(a.option.id)) && /(window)|(widget)/.test(b.windowType)) {
                    var c = alloy.portal.getAllConfig(a);
                    if (c) if (c.selfConfig = c.selfConfig || {}, b.windowType == "widget") {
                        var e = b.getX(),
                            b = b.getY();
                        c.selfConfig.x = e;
                        c.selfConfig.y = b;
                        c = {};
                        c[a] = {
                            x: e,
                            y: b
                        };
                        b = ha();
                        b[a] = null;
                        delete b[a];
                        c[0] = {
                            runWidgets: b
                        };
                        alloy.rpcService.sendMSetConfigDelay({
                            data: c,
                            delay: 1E3
                        })
                    } else if (b.option.resize) {
                        var e = b.getBodyWidth(),
                            d = b.getBodyHeight(),
                            b = b.getBoxStatus();
                        c.selfConfig.defaultMode = b;
                        c.selfConfig.width = e;
                        c.selfConfig.height = d;
                        c = {};
                        c.defaultMode = b;
                        if (b != "fullscreen" && b != "max") c.width = e, c.height = d;
                        alloy.rpcService.sendSetConfig({
                            data: {
                                r: {
                                    appid: a,
                                    value: c
                                }
                            }
                        })
                    }
                }
            }
        },
        onThirdPartyAppExit: function (a) {
            alloy.portal.unCacheOpenkey(a.option.id)
        }
    };
    this.init = function () {
        typeof progress == "function" && progress("portal init");
        k = {};
        K = 0;
        qqweb.app.appKeyMap = {};
        d.addObserver(qqweb.portal, "exitSuccess", O.onExitSuccess);
        d.addObserver(alloy.rpcService, "GetVfWebQQError", O.onGetVfWebQQError);
        d.addObserver(alloy.rpcService, "GetVfWebQQSuccess", O.onGetVfWebQQSuccess);
        d.addObserver(alloy.portal, "GetLoginInfoSuccess", O.onGetLoginInfoSuccess);
        d.addObserver(alloy.rpcService, "GetUserInfoSuccess", O.onGetSelfInfoSuccess);
        d.addObserver(alloy.portal, "selfInfoReady",
        O.onSelfInfoReady);
        d.addObserver(alloy.portal, "reset", O.onReset);
        d.addObserver(alloy.portal, "UACReady", O.onUACReady);
        d.addObserver(alloy.portal, "FrameWorkReady", O.onFrameWorkReady);
        d.addObserver(alloy.portal, "FirstScreenReady", O.onFirstScreenReady);
        d.addObserver(alloy.appconfig, "GetAppConfigComplete", O.onGetAppConfigComplete);
        d.addObserver(alloy.appconfig, "GetDefaultAppConfigComplete", O.onGetAppConfigComplete);
        d.addObserver(alloy.appconfig, "UpdateAppConfig", O.onUpdateAppConfig);
        d.addObserver(alloy.appconfig, "RemoveAppConfig", O.onRemoveAppConfig);
        d.addObserver(alloy.portal, "AlloyJsReady", O.onAlloyJsReady);
        d.addObserver(alloy.portal, "portalReady", O.onPortalReady);
        d.addObserver(alloy.portal, "appRun", O.onAppRun);
        d.addObserver(alloy.portal, "appExit", O.onAppExit);
        d.addObserver(alloy.portal, "appExit", O.onThirdPartyAppExit);
        d.addObserver(alloy.portal, "loginLevelChange", O.onLoginLevelChange);
        alloy.fileSystem.init();
        alloy.storage.init();
        alloy.desktopContact.init();
        alloy.desktopFolder.init();
        alloy.desktopFile.init();
        alloy.flashUploadManager.init();
        alloy.layout.init();
        alloy.layout.themeManager.init();
        d.addObserver(alloy.layout, "clickDesktop", ga);
        d.addObserver(alloy.layout, "desktopFocus", ga);
        a.profile("initAccount start!", "portal!");
        j = c.getOriginalCookieUin();
        A = c.getCookieSkey();
        y = c.getCookiePtwebqq();
        B = c.getCookieUin();
        t = c.getUin() && c.getSkey() ? 2 : 1;
        a.profile("initAccount finish!", "portal!");
        ba();
        d.on(window, "unload", ia);
        qqweb.util.report2h("portal", "end_runCoreApps", "ok")
    };
    var ka = 6E5,
        la = 6E6,
        ma = 42E6;
    this.changeCheckOpenKeyFrequency = function (b) {
        ka = b.check * 1E3;
        la = b.renewal * 1E3;
        ma = b.reload * 1E3;
        a.debug("set check frequency done", "OpenKey")
    };
    var qa = function () {
        var b = +new Date;
        a.debug("check open key: " + b, "OpenKey");
        var c, e, d = !1,
            f;
        for (f in L) if (e = Number(f)) d = !0, c = L[f], b - c.createTime >= ma ? (a.debug("\u8fc7\u671f\u91cd\u62c9(appId: " + e + "):" + (b - c.createTime) / 1E3, "OpenKey"), alloy.config.reRequestGrant({
            appId: e
        })) : b - c.lastUpdateTime >= la && (a.debug("\u7eed\u671f(appId: " + e + "):" + (b - c.lastUpdateTime) / 1E3, "OpenKey"), alloy.config.renewalGrant({
            appId: e,
            openId: c.openId,
            openKey: c.openKey
        }));
        d || (clearInterval(V), V = 0, a.debug("stop check open key", "OpenKey"))
    };
    this.cacheOpenkey = function (b) {
        var c = +new Date;
        b.renewal && L[b.appId] ? L[b.appId].lastUpdateTime = c : L[b.appId] = {
            gaid: b.gaid,
            openKey: b.openKey,
            openId: b.openId,
            createTime: c,
            lastUpdateTime: c
        };
        V || (V = setInterval(qa, ka), a.debug("start check open key", "OpenKey"))
    };
    this.unCacheOpenkey = function (a) {
        L[a] && (L[a] = null, delete L[a])
    };
    this.getCacheOpenkey = function (a) {
        return L[a]
    };
    this.getPtwebqq = function () {
        return y
    };
    this.setPtwebqq = function (a) {
        return y = a
    };
    this.getOldUin = function () {
        return x
    };
    this.getUin = function () {
        return B
    };
    this.getTryUin = function () {
        return r
    };
    this.getOriginalUin = function () {
        return j
    };
    this.setSecretKey = function (a) {
        n = a
    };
    this.getSecretKey = function () {
        return n
    };
    this.setSecretIp = function (a) {
        p = a
    };
    this.getSecretIp = function () {
        return p
    };
    this.acceptSocket = function (b) {
        var b = decodeURI(b),
            e = a.json.parse(b);
        if (e.e == 0) if (a.isUndefined(e.appid)) {
            if (e.sid) R = e.al, alloy.util.report2qqweb("push|loginsuccess")
        } else a.event.notifyObservers(qqweb.portal, "message", e);
        else c.longPollLogin(), W = "longPoll", a.error("PushService error: " + b), alloy.util.report2qqweb("push|loginfail")
    };
    this.reportAppState = function (e, d) {
        if (W == "socket") if (P) for (var f = 0; f < R.length; ++f) {
            if (e == R[f]) {
                P.reportAppState && P.reportAppState(e, d);
                break
            }
        } else P = a.browser.ie ? b.id("Socket") || window.Socket : document.Socket;
        else for (f = 0; f < R.length; ++f) if (e == R[f]) {
            alloy.rpcService.psSend(alloy.CONST.PS_CGI_URL + "kl/as", {
                context: c,
                method: "GET",
                timeout: 1E4,
                data: {
                    ssid: H,
                    aid: e,
                    s: d
                },
                onSuccess: function () {},
                onError: function () {},
                onTimeout: function () {}
            });
            break
        }
    };
    this.reportOpen = function (b) {
        var c = a.json.parse(b);
        if (c.appid) a.event.notifyObservers(qqweb.portal, "message", c), a.event.notifyObservers(qqweb.portal, "message" + c.appId, b);
        else if (c.sid) R = c.al
    };
    this.getSkey = function () {
        return A
    };
    this.getUinAndSkey = function () {
        return {
            uin: B,
            skey: A
        }
    };
    this.getLoginLevel = function () {
        return v
    };
    this.setLoginLevel = function (a) {
        a != v && (o = v, v = a, Y() && (d.notifyObservers(alloy.portal, "loginLevelChange", a), a > 1 && K < 1 && c.addExitConfirm()),
        a != 1 && (a == 2 ? o == 1 && (alloy.util.report2qqweb("signin|visitortoweakness"), c.getPtwebqq() ? alloy.util.report2qqweb("signin|visitortoweakness|signinwithptwebqq") : alloy.util.report2qqweb("signin|visitortoweakness|signin")) : a == 3 && (o == 1 ? (alloy.util.report2qqweb("signin|visitortostrength"), alloy.util.report2qqweb("signin|visitortostrength|" + c.getTryLoginState())) : o == 2 && (c.isWithPtwebqqLogin() ? (alloy.util.report2qqweb("signin|weaknesstostrength|signinwithptwebqq"), alloy.util.report2qqweb("signin|weaknesstostrength|signinwithptwebqq|" + c.getTryLoginState())) : (alloy.util.report2qqweb("signin|weaknesstostrength|signin"), alloy.util.report2qqweb("signin|weaknesstostrength|signin|" + c.getTryLoginState()))))), c.setWithPtwebqqLogin(c.getPtwebqq() || !1))
    };
    this.getOldLoginLevel = function () {
        return o
    };
    this.setWithPtwebqqLogin = function (a) {
        h = a
    };
    this.isWithPtwebqqLogin = function () {
        return h
    };
    this.isPortalReady = function () {
        return f
    };
    this.setUin = function (a) {
        x = B;
        return B = a
    };
    this.recoverCookie = function () {};
    this.validatePTLoginSuccess = function (b) {
        b = b || {};
        b = a.string.mapQuery(b.url);
        if (typeof b.login2qq === "undefined" && (alloy.util.report2qqweb("monitor|nologinquery"), G)) b.login2qq = 1;
        if (Number(b.login2qq) === 1) {
            t = 3;
            if (b = b.webqq_type || 0) b = alloy.util.code2state(b), alloy.portal.setTryLoginState(b);
            alloy.portal.setTryLoginType(!0)
        } else t = 2, alloy.portal.setTryLoginType(!1);
        a.profile("validatePTLoginSuccess, tryLoginLevel:" + t, "portal!");
        alloy.util.report2h("pass_ptlogin", "start");
        j = c.getOriginalCookieUin();
        A = c.getCookieSkey();
        y = c.getCookiePtwebqq();
        ba();
        alloy.layout.hideLoginWindow()
    };
    this.setTryLoginState = function (a) {
        F = a
    };
    this.getTryLoginState = function () {
        return F
    };
    this.setTryLoginType = function (a) {
        G = a
    };
    this.getSSOForm = function (b) {
        b = b || window.location.search;
        b = a.string.mapQuery(b).sso;
        if (!b) return {};
        var b = a.json.parse(b),
            e = b.skey,
            d = b.cgi,
            f = b.custom,
            j = {};
        j[b.uin] = c.getUin();
        j[e] = c.getCookieSkey();
        a.extend(j, f);
        return {
            option: {
                method: "POST",
                data: j
            },
            cgi: d
        }
    };
    this.getCookieUin = function () {
        var b = a.cookie.get("uin", alloy.CONST.MAIN_DOMAIN),
            b = b ? parseInt(b.substr(1),
            10) : null;
        a.out("Cookie uin:" + b);
        return b
    };
    this.getCookiePTUiUin = function () {
        var b = a.cookie.get("ptui_loginuin", alloy.CONST.MAIN_DOMAIN);
        b || (b = void 0);
        a.out("PTUI uin:" + b);
        return b
    };
    this.getOriginalCookieUin = function () {
        return a.cookie.get("uin", alloy.CONST.MAIN_DOMAIN)
    };
    this.getCookieSkey = function () {
        return a.cookie.get("skey", alloy.CONST.MAIN_DOMAIN)
    };
    this.getCookiePtwebqq = function () {
        return a.cookie.get("ptwebqq", alloy.CONST.MAIN_DOMAIN)
    };
    var ra = function (a, b) {
        alloy.rpcService.getAppInfo(a, ["appName", "appType", "appUrl", "iconUrl", "id", "category", "exinfo", "al", "gaid"], function (c) {
            if (c.retcode === 0) c = c.result.resultData, c.preview = !0, alloy.appconfig.addAppConfigTemp(c), alloy.portal.runApp(a, b)
        })
    };
    this.runApp = function (b, e) {
        if (u) {
            var e = e || {}, b = b == "eqq" ? alloy.config.__eqqid : b,
                d = this.getAllConfig(b);
            if (!d) return a.out("id:" + b), d = e.runFrom, b = Number(b), e.preview ? ra(b, e) : b != 19 && (f ? alloy.portal.runApp("appMarket", {
                page: "introduce",
                option: {
                    appid: b
                },
                runFrom: d
            }) : alert("\u56e0\u7f51\u7edc\u73af\u5883\u95ee\u9898\u5bfc\u81f4\u52a0\u8f7d\u5f02\u5e38\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u767b\u5f55\u3002")), !1;
            if (b == "appMarket" && !f) return alert("\u56e0\u7f51\u7edc\u73af\u5883\u95ee\u9898\u5bfc\u81f4\u52a0\u8f7d\u5f02\u5e38\uff0c\u8bf7\u5c1d\u8bd5\u91cd\u65b0\u767b\u5f55\u3002"), !1;
            var j = this.getApp(b),
                e = c.getUrlOption(b) || e;
            j ? (j.run && (~~b > 0 && !d.preview && !d.selfConfigLoaded && c.getLoginLevel() > alloy.CONST.LOGIN_LEVEL_NONE ? (j = ["width", "height", "defaultMode"], d.windowType == "widget" && (j = ["x", "y"]), alloy.rpcService.sendGetConfig({
                arguments: {
                    appConfig: d,
                    option: e
                },
                data: {
                    r: {
                        appid: d.id,
                        itemlist: j
                    }
                },
                action: "get",
                onSuccess: na,
                onError: na
            })) : (d.selfConfig && a.extend(e, d.selfConfig), j.run(e), c.removeUrlOption(b))), e && a.isFunction(e.callback) && e.callback()) : d && (~~b > 0 ? d.appType == 1 ? alloy.portal.loadApp(d, e) : d.appType == 2 && (qqweb.app["app" + b] = new qqweb.businessClass.App(d), alloy.portal.runApp(b, e)) : d.appType == 1 ? alloy.portal.loadApp(d, e) : d.appType == 2 && (alloy.app[b] = new alloy.businessClass.App(d), alloy.portal.runApp(b, e)), c.removeUrlOption(b), c.removeUrlOption(b));
            d && (S = !1);
            b == alloy.config.__eqqid && a.platform.iPad && alloy.sound.createIpadAudioObj();
            return !0
        } else alert("\u7cfb\u7edf\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u540e\u3002\u3002\u3002")
    };
    this.loadApp = function (b, c) {
        b = b || {};
        if (!this.getAppLoading(b.id)) {
            this.setAppLoading(b.id, !0);
            var e = b.id,
                d = alloy.util.getAppRoot(e),
                f = d + (b.css || "style.css");
            d += b.js || "main.js";
            (b.css || a.isNumber(e)) && g.loadCss(f + "?" + alloy.CONST.UPDATE_TIME_STAMP);
            g.loadScript(d + "?" + alloy.CONST.UPDATE_TIME_STAMP, {
                onSuccess: function () {
                    alloy.portal.runApp(b.id, c)
                }
            })
        }
    };
    var na = function (b) {
        var e = b.arguments.appConfig,
            d = b.arguments.option;
        if (b.retcode == 0 && b.result) {
            if (!a.isObject(b.result)) b.result = a.json.parse(b.result);
            var b = b.result || {}, f = ["width", "height", "defaultMode"];
            e.windowType == "widget" && (f = ["x", "y"]);
            var j = !0,
                g;
            for (g in f) f[g] in b || (j = !1), (b[f[g]] === null || typeof b[f[g]] === "undefined") && delete b[f[g]];
            e.selfConfig = j ? b : {}
        } else e.selfConfig = {};
        e.selfConfigLoaded = !0;
        c.runApp(e.id, d)
    };
    this.getAppConfigList = function () {
        return alloy.appconfig.appConfigList
    };
    this.getAppConfig = function (a) {
        return alloy.appconfig.getAppConfig(a)
    };
    this.getSystemConfig = function (a) {
        return alloy.appconfig.getSystemConfig(a)
    };
    this.getAllConfig = function (a) {
        return alloy.appconfig.getAllConfig(a)
    };
    this.getApp = function (a) {
        return ~~a > 0 ? alloy.app["app" + a] : alloy.app[a]
    };
    this.shutdownApp = function (a) {
        var b;
        if (b = c.getApp(a)) b.isRunning() && b.exit(), delete alloy.app["app" + a]
    };
    this.setAppLoading = function (a, b) {
        return k[a] = b
    };
    this.getAppLoading = function (a) {
        return k[a]
    };
    var ja = "\u60a8\u786e\u5b9a\u8981\u79bb\u5f00\u201cQ+ Web\u201d\u5417\uff1f";
    this.setCloseHookMessage = function (a) {
        ja = a
    };
    this.getCloseHookMessage = function () {
        return ja
    };
    this.closeHook = function (b) {
        var c = ja;
        pgvSendClick({
            hottag: "web2qq.qqpanel.status.exitQQ"
        });
        if (a.browser.safari || a.browser.chrome) return c;
        else a.browser.ie > 0 ? window.event.returnValue = c : b.returnValue = c
    };
    this.closeHookForHotKey = function () {
        alloy.hotkey.unstall()
    };
    var sa = function () {
        if (alloy.portal.getLoginLevel() == alloy.CONST.LOGIN_LEVEL_ALL) {
            EQQ.logout();
            WebqCore.api.log("browser-close-ok");
            if (EQQ.RPCService._proxy) try {
                EQQ.RPCService._proxy.abort()
            } catch (a) {}
            EQQ.View.ChatBox && EQQ.View.ChatBox.scaptureHotkey && EQQ.View.ChatBox.scaptureHotkey.unstall()
        }
    };
    this.addCloseHook = function () {
        C || (C = !0, d.on(window, "beforeunload", this.closeHook), d.on(window, "unload", sa))
    };
    this.addCloseHookForHotKey = function () {
        d.on(window, "unload", this.closeHookForHotKey)
    };
    this.removeCloseHook = function () {
        d.off(window, "beforeunload");
        C = !1
    };
    this.getCloseHook = function () {
        return C
    };
    this.addExitConfirm = function (a) {
        K += a || 1;
        K > 0 && this.addCloseHook();
        return K
    };
    this.removeExitConfirm = function (a) {
        K -= a || 1;
        K < 1 && this.removeCloseHook();
        return K
    };
    this.getExitConfirm = function () {
        return K
    };
    var oa = function (b) {
        var e = alloy.windowManager.getCurrentWindow();
        e && e.getAppId();
        d.notifyObservers(alloy.portal, "exit");
        l = !0;
        H && alloy.rpcService.psSend(alloy.CONST.PS_CGI_URL + "kl/logout", {
            context: c,
            method: "GET",
            timeout: 1E4,
            data: {
                ssid: H
            },
            onSuccess: function () {},
            onError: function () {},
            onTimeout: function () {}
        });
        b || (a.cookie.remove("ptwebqq", alloy.CONST.MAIN_DOMAIN), a.cookie.remove("skey", alloy.CONST.MAIN_DOMAIN), a.cookie.remove("uin", alloy.CONST.MAIN_DOMAIN),
        a.cookie.remove("vfwebqq", alloy.CONST.MAIN_DOMAIN), a.out(">>>>> cookie.remove"));
        alloy.layout.hideDesktop();
        setTimeout(function () {
            d.notifyObservers(alloy.portal, "exitSuccess")
        }, 1E3);
        S && pgvSendClick({
            hottag: "WEB2QQ.NOAPP.USER.ALL"
        })
    };
    this.exit = function (a) {
        this.getExitConfirm() > 0 ? J ? (J.setWindowCentered(), J.setCurrent()) : J = alloy.layout.confirm("\u60a8\u786e\u8ba4\u8981\u6ce8\u9500  Q+ Web \u5417\uff1f", function () {
            c.removeCloseHook();
            pgvSendClick({
                hottag: "web2qq.qqpanel.status.exitQQ"
            });
            alloy.util.report2qqweb("taskabr|start|exit|ok");
            oa(a)
        }, {
            modal: !0,
            onClose: function () {
                J = null
            }
        }) : oa(a)
    };
    this.restart = function () {
        this.exit(!0)
    };
    this.close = function () {
        window.webTop && (qqweb.util.report2c(webTop.ui.channel.postCmd(25)), qqweb.util.report(), webTop.ui.channel.postCmd(21));
        alloy.portal.exit();
        d.notifyObservers(alloy.portal, "Exit");
        alloy.util.report2qqweb("taskbar|start|close")
    };
    this.getVfWebQQ = function () {
        return typeof EQQ !== "undefined" && EQQ.getVfWebQQ && EQQ.getVfWebQQ() && EQQ.getIsLogin() ? EQQ.getVfWebQQ() : w ? w : ""
    };
    this.setVfWebQQ = function (a) {
        w = a
    };
    this.getRunningAppStatus = function () {
        var a = alloy.windowManager.getCurrentWindow(),
            b = "",
            c;
        a && (b = a.getAppId());
        for (var a = {
            currentAppId: b,
            appList: []
        }, b = alloy.windowManager.getWindowList(), e = 0; e < b.length; e++) {
            var d = b[e],
                f = d.getAppId();
            if (!(f === "eqq--" || f === "sceneChristmas")) {
                c = d.getX();
                var j = d.getY();
                if (d.windowType === "window") {
                    var g = d.getBoxStatus();
                    if (g !== "min") {
                        var h = d.getWidth(),
                            d = d.getHeight();
                        c = {
                            appId: f,
                            defaultMode: g,
                            x: c,
                            y: j,
                            width: h,
                            height: d
                        };
                        f && a.appList.push(c)
                    }
                } else d.windowType === "widget" && (c = {
                    appId: f,
                    x: c,
                    y: j
                }, a.appList.push(c))
            }
        }
        return a
    };
    c.runSettingCenter = function (a) {
        var b = ["config_page_general", "config_page_msg", "config_page_bkg"];
        switch (a && a.pageID || b[0]) {
        case b[0]:
            return c.runApp("settingCenter");
        case b[1]:
            return c.runApp("notifications");
        case b[2]:
            return c.runApp("themeSetting")
        }
    };
    c.runAppMarket = function (a) {
        return c.runApp("appMarket", a)
    };
    c.runBrowser = function (a) {
        return c.runApp("6", a)
    };
    c.runQQ = function (a) {
        return c.runApp(alloy.config.__eqqid, a)
    };
    c.runIME = function (a) {
        return c.runApp("qqWebIme",
        a)
    };
    c.runHandWrite = function (a) {
        return c.runApp("qqHandWrite", a)
    };
    this.openInWebBrowser = function (b) {
        var b = b || {}, c = this.getApp(6);
        return a.isUndefined(c) || !c.isRunning() ? (b.isOpenNewTab = !0, alloy.portal.runApp("6", b)) : (c.openUrl(b), b.callback && b.callback(), !0)
    };
    this.isOpenFile = function (b) {
        return a.array.indexOf(["jpg", "jpeg", "bmp", "png", "gif", "txt", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf"], b) >= 0 ? 1 : 0
    };
    this.openFile = function (a) {
        if ("type" in a) switch (a.type) {
        case "image":
        case "img":
        case "pic":
        case "photo":
        case "jpg":
        case "jpeg":
        case "bmp":
        case "png":
        case "gif":
            alloy.portal.runApp("imgViewer",
            a);
            break;
        case "sound":
        case "music":
        case "audio":
            alloy.portal.runApp("audioPlayer", a);
            break;
        case "txt":
        case "doc":
        case "docx":
        case "ppt":
        case "pptx":
        case "xls":
        case "xlsx":
        case "pdf":
            alloy.portal.runApp("docViewer", a);
            break;
        default:
            alloy.system.alert("\u672a\u77e5\u6587\u4ef6\u7c7b\u578b")
        }
    };
    c.getLoginState = c.getLoginLevel;
    c.isAppInstalled = function (b) {
        if (a.isArray(b.appId)) {
            for (var c = {}, e = 0; e < b.appId.length; e++) c[b.appId[e]] = alloy.config.isInSetupAppList(b.appId[e]) ? !0 : !1;
            return c
        } else return alloy.config.isInSetupAppList(b.appId) ? !0 : !1
    };
    c.isAppRunning = function (a) {
        return (a = c.getApp(a.appId)) && a.isRunning() ? !0 : !1
    };
    c.getAppInfo = function (b) {
        var c = {};
        c.appList = b.appList;
        c.onSuccess = b.onSuccess;
        c.onError = b.onError;
        if (!a.isArray(b.appList)) c.appList = [], c.appList.push(b.appList);
        alloy.rpcService.getAppInfoMulti(c)
    };
    c.isLocked = function () {
        return qqweb.app.screenLocker && qqweb.app.screenLocker.isLocked() ? !0 : !1
    };
    c.openURL = c.openInWebBrowser;
    c.search = function (a) {
        a = a.keyword;
        if (a == "") return !1;
        a = "http://www.soso.com/q?bid=203&cid=webq.a&ie=utf-8&w=" + encodeURIComponent(a);
        c.openURL({
            url: a,
            title: "\u641c\u641csoso"
        })
    };
    c.onAirClientReady = function () {
        I = {};
        var a = document.getElementById("webtopInstallerFlash");
        a.detectAppVersion("alloy.portal.onDetectAppVersion");
        a.setOnClick("alloy.portal.onWebTopInstallClick")
    };
    c.onAirInstallerInitFail = function (b) {
        a.error(b)
    };
    c.onDetectAppVersion = function (a) {
        I.appVersion = a || 0
    };
    c.onWebTopSystemClickCb = function (a) {
        c.onDetectAppVersion(a);
        alloy.navbar.showRunWebTopTip()
    };
    c.onWebTopInstallClick = function () {
        alloy.navbar.closeTip()
    };
    c.getAirRunTime = function () {
        return I
    };
    c.switchToDesktop = function (a, b) {
        typeof a !== "undefined" && webTop.ui.channel.postCmd(17, a, b);
        webTop.ui.channel.postCmd(18, 255)
    };
    c.setWebTopNavBarOnTop = function (a) {
        webTop.ui.channel.postCmd(26, a)
    };
    if (window.webTop) {
        var pa = function () {
            var b = arguments[0];
            a.info("onWebTopCommand:" + b);
            var c = ta[b];
            c ? c.apply(null, Array.prototype.slice.call(arguments, 1)) : alert("no such callback! - cmd: " + b)
        }, ta = {
            16: function (a) {
                c.openInWebBrowser({
                    url: a,
                    title: "\u6d4f\u89c8\u7f51\u9875"
                })
            },
            17: function (a, b) {
                alloy.navbar.setNavBarPosition(Number(a), Number(b));
                if (webTop.ui.channel.postCmd(22)) {
                    var c = alloy.layout.createBubble({
                        hasCloseButton: !1
                    });
                    c.setTitle("\u8fd4\u56de\u7cfb\u7edf\u684c\u9762");
                    c.setContent('<div class="webtop-sysbtn-thumb"></div>');
                    c.showButton("ok", "\u77e5\u9053\u5566");
                    c.show({
                        pointerPosition: "top left",
                        target: alloy.navbar.getSystemButton()
                    })
                }
            },
            18: function (a) {
                alloy.desktopManager.setCurrentDesktop(a)
            },
            20: function () {
                if (!D) {
                    var a = "\u60a8\u786e\u5b9a\u8981\u9000\u51fa  Q+ Web \u5417\uff1f";
                    window.webTop && (a = "\u60a8\u786e\u5b9a\u8981\u9000\u51fa\u201c\u5ba2\u6237\u7aef\u201d\u5417\uff1f");
                    D = alloy.layout.confirm(a, function () {
                        alloy.portal.close()
                    }, {
                        modal: !0,
                        onClose: function () {
                            D = null
                        }
                    })
                }
            },
            26: function (a) {
                alloy.navbar.setNavBarOnTop(a, !0)
            },
            27: function (a) {
                alloy.util.report2qqweb(a)
            },
            28: function (a) {
                alloy.util.report2c(a)
            },
            29: function (b) {
                a.info(b);
                eval("(" + b + ")")
            }
        };
        /QT\//.test(webTop.type) ? webTop.ui.channel.onCmd.connect(pa) : webTop.ui.channel.onCmd = pa
    }
});
Jet().$package("alloy.layout", function (a) {
    var c = this,
        b = a.dom,
        d = a.event,
        g = a.fx.transitions,
        k = b.getDocumentElement(),
        l = document.body,
        o = b.id("startingCover"),
        t = document.title,
        r = null,
        u = b.id("desktop"),
        v = !0,
        s, m, f = !1,
        h = {}, n = [10, 1E5, 2E5, 3E5, 4E5],
        p, D, e, j, B, x, y, A, w = [],
        q = null,
        C = [{
            text: "\u663e\u793a\u684c\u9762",
            onClick: function () {
                qqweb.layout.showDesktop();
                qqweb.rpcService.reportQstatic("contextmenu|desktop|dispdesk")
            }
        }, {
            text: "\u9501\u5b9a",
            onClick: function () {
                qqweb.portal.runApp("screenLocker");
                qqweb.rpcService.reportQstatic("contextmenu|desktop|lock")
            }
        }, {
            type: "separator"
        }, {
            text: "\u6dfb\u52a0",
            type: "submenu",
            items: [{
                text: "\u6dfb\u52a0\u5e94\u7528",
                icon: {
                    className: "add_app_icon"
                },
                onClick: function () {
                    alloy.system.runApp("appMarket");
                    qqweb.util.report2qqweb("add|contextmenu|addapp")
                }
            }, {
                text: "\u6dfb\u52a0\u684c\u9762\u8054\u7cfb\u4eba",
                icon: {
                    className: "add_contact_icon"
                },
                onClick: function () {
                    alloy.desktopContact.showSelectBuddyBox();
                    qqweb.util.report2qqweb("add|contextmenu|adddeskcontanct")
                }
            }]
        }, {
            text: "\u4e0a\u4f20\u6587\u4ef6",
            type: "flash",
            icon: {
                className: "add_file_icon"
            },
            onClick: function () {}
        }, {
            text: "\u65b0\u5efa\u6587\u4ef6\u5939",
            icon: {
                className: "add_folder_icon"
            },
            onClick: function () {
                alloy.desktopFolder.createFolder();
                qqweb.util.report2qqweb("add|contextmenu|createfolder")
            }
        }, {
            text: "\u7c98\u8d34",
            onClick: function () {
                var a = alloy.clipBoard.getData();
                if (a) {
                    var b = a.data,
                        c = alloy.desktopManager.getCurrentDesktopIndex();
                    a.pasteType == alloy.clipBoard.PASTE_TYPE.COPY ? alloy.fileSystem.copyFile(b, c) : alloy.fileSystem.moveFile(b, c, null, null, null, !0)
                }
                alloy.clipBoard.clear()
            }
        }, {
            type: "separator"
        }, {
            text: "QQ\u4e91\u8bcd\u5178",
            onClick: function () {
                qqweb.portal.runApp("qqWebDict");
                qqweb.rpcService.reportQstatic("contextmenu|desktop|clouddic")
            }
        }, {
            type: "separator"
        }, {
            text: "\u4e3b\u9898\u8bbe\u7f6e",
            onClick: function () {
                qqweb.portal.runApp("themeSetting");
                qqweb.rpcService.reportQstatic("contextmenu|desktop|theme")
            }
        }, {
            text: "\u7cfb\u7edf\u8bbe\u7f6e",
            onClick: function () {
                qqweb.portal.runApp("settingCenter");
                qqweb.rpcService.reportQstatic("contextmenu|desktop|config")
            }
        }, {
            text: "\u56fe\u6807\u8bbe\u7f6e",
            type: "submenu",
            beforeShow: function (a) {
                alloy.desktopManager.getDesktopIconStyle() ? (a.getItemAt(0).setIcon({
                    className: "desktop_icon_style_checked"
                }), a.getItemAt(1).setIcon()) : (a.getItemAt(0).setIcon(), a.getItemAt(1).setIcon({
                    className: "desktop_icon_style_checked"
                }))
            },
            items: [{
                text: "\u5c0f\u56fe\u6807",
                onClick: function () {
                    alloy.desktopManager.getDesktopIconStyle() != 1 && (alloy.desktopManager.setDesktopIconStyle(1, !0), qqweb.util.report2qqweb("iconchange|right|icon|small"))
                }
            }, {
                text: "\u5927\u56fe\u6807",
                onClick: function () {
                    alloy.desktopManager.getDesktopIconStyle() != 0 && (alloy.desktopManager.setDesktopIconStyle(0, !0), qqweb.util.report2qqweb("iconchange|right|icon|big"))
                }
            }]
        }, {
            type: "separator"
        }, {
            text: "\u53cd\u9988",
            onClick: function () {
                window.open("http://support.qq.com/discuss/513_1.shtml")
            }
        }, {
            text: "\u6ce8\u9500",
            onClick: function () {
                qqweb.portal.exit();
                d.notifyObservers(qqweb.portal, "Exit");
                qqweb.rpcService.reportQstatic("contextmenu|desktop|quit")
            }
        }],
        F = {
            layout_showdesktop: function () {
                qqweb.layout.showDesktop();
                alloy.util.report2qqweb("hotkey|showdesk")
            },
            layout_lock: function () {
                qqweb.portal.getLoginLevel() > qqweb.CONST.LOGIN_LEVEL_NONE && (qqweb.portal.runApp("screenLocker"), alloy.util.report2qqweb("hotkey|lock"))
            },
            layout_exit: function () {
                qqweb.portal.getLoginLevel() > qqweb.CONST.LOGIN_LEVEL_NONE && (alloy.util.report2qqweb("hotkey|signout"), qqweb.portal.exit(), d.notifyObservers(qqweb.portal, "Exit"))
            },
            layout_window_current_close: function () {
                var a = alloy.windowManager.getCurrentWindow();
                a && a.isShow() && (a.close(), alloy.util.report2qqweb("hotkey|close"))
            },
            layout_window_closeall: function () {
                for (var a = alloy.windowManager.getWindowList(),
                b, c = a.length - 1; c >= 0; c--) b = a[c], b.windowType == "window" && b.close();
                alloy.util.report2qqweb("hotkey|closeallapp")
            },
            layout_window_goleft: function () {
                I(-1);
                alloy.util.report2qqweb("hotkey|tableft")
            },
            layout_window_goright: function () {
                I(1);
                alloy.util.report2qqweb("hotkey|tabright")
            },
            eqq_chatbox_classall: function () {
                for (var a = alloy.windowManager.getWindowList(), b, c = a.length - 1; c >= 0; c--) b = a[c], b.windowType == "chatbox" && b.close();
                alloy.util.report2qqweb("hotkey|closeallchat")
            },
            eqq_chatbox_read: function () {
                if (qqweb.portal.getLoginLevel() == qqweb.CONST.LOGIN_LEVEL_ALL) {
                    var a = alloy.messageSystem.getLatestMessage();
                    a && (alloy.messageSystem.handleNotification(a.id), alloy.util.report2qqweb("hotkey|getmsg"))
                }
            },
            layout_screencaptrue: function () {
                if (alloy.portal.isWebTop()) if (alloy.portal.getLoginLevel() == alloy.CONST.LOGIN_LEVEL_ALL) {
                    var a = alloy.windowManager.getCurrentWindow();
                    a ? alloy.portal.runApp("screenCapture2", {
                        mode: a.mode,
                        uin: a.uin,
                        chatBoxType: a.chatBoxType
                    }) : alloy.portal.runApp("screenCapture2")
                } else alloy.portal.runApp("screenCapture2");
                else alloy.portal.runApp("screenCapture")
            },
            layout_desktop_goleft: function () {
                alloy.desktopManager.goPrevDesktop();
                alloy.util.report2qqweb("hotkey|screenleft")
            },
            layout_desktop_goright: function () {
                alloy.desktopManager.goNextDesktop();
                alloy.util.report2qqweb("hotkey|screenright")
            },
            layout_desktop_gospecific: function (a) {
                a = Number(a.keyCode);
                a = a > 96 ? a - 97 : a - 49;
                alloy.desktopManager.setCurrentDesktop(a);
                alloy.util.report2qqweb("hotkey|screen" + a)
            },
            layout_desktop_gosystem: function (a) {
                alloy.portal.switchToDesktop();
                a = Number(a.keyCode);
                a == 48 || a == 96 ? alloy.util.report2qqweb("hotkey|0systemdesk") : a == 113 ? alloy.util.report2qqweb("hotkey|f2systemdesk") : a == 192 ? alloy.util.report2qqweb("hotkey|wavesystemdesk") : alloy.util.report2qqweb("hotkey|othersystemdesk")
            },
            layout_desktop_manage: function () {
                alloy.appManager.tooglePanel()
            },
            open_msg_manager: function () {
                alloy.portal.runApp("messageManager")
            }
        }, G = {};
    this.Panel = a.ui.Panel;
    this.PopupBox = a.ui.PopupBox;
    var J = {
        stopPropagation: function (a) {
            a.stopPropagation()
        },
        onClickDesktop: function (a) {
            var b;
            a.target.tagName === "A" && (b = a.target.getAttribute("href")) && (b === "###" || b === "#") && a.preventDefault();
            v = !0;
            d.notifyObservers(qqweb.layout, "clickDesktop")
        },
        onFocusDesktop: function () {
            v = !0;
            d.notifyObservers(alloy.layout, "desktopFocus")
        },
        onBlurDesktop: function () {
            v = !1;
            d.notifyObservers(alloy.layout, "desktopBlur")
        },
        onKeydownDesktop: function (a) {
            d.notifyObservers(alloy.layout, "desktopKeydown", a)
        },
        onKeyupDesktop: function (a) {
            d.notifyObservers(alloy.layout, "desktopKeyup", a)
        },
        onWindowResize: function () {
            var c = b.getClientWidth(),
                f = b.getClientHeight();
            a.browser.ie == 6 && (c = c % 2 + c, f = f % 2 + f);
            if (p == c && D == f) a.out("resize nothing");
            else {
                c = b.getClientWidth();
                f = b.getClientHeight();
                a.browser.ie == 6 && (c = c % 2 + c, f = f % 2 + f);
                p = c;
                D = f;
                var g = !1;
                c >= x ? (b.setStyle(k, "overflowX", "hidden"), b.setStyle(u, "width", ""), e = c) : (g = !0, b.setStyle(k, "overflowX", "auto"), b.setStyle(u, "width", x + "px"), e = x);
                f >= y ? (b.setStyle(k, "overflowY", "hidden"), b.setStyle(u, "height", ""), j = f) : (g = !0, b.setStyle(k, "overflowY", "auto"), b.setStyle(u, "height", y + "px"), j = y);
                g ? b.setStyle(u, "position", "absolute") : b.setStyle(u, "position", "static");
                b.setStyle(l, "height", j + "px");
                o && (b.setStyle(o, "width", e + "px"), b.setStyle(o, "height", j + "px"));
                d.notifyObservers(alloy.layout, "desktopResize")
            }
        },
        onDesktopContextmenu: function (a) {
            if (b.hasClass(a.target, "zoomWallpaper") || b.hasClass(a.target, "desktopContainer") || b.hasClass(a.target, "appListContainer")) {
                a.preventDefault();
                var c;
                alloy.portal.getLoginLevel() == alloy.CONST.LOGIN_LEVEL_NONE ? (c = C.concat(), c.splice(5, 2)) : c = C;
                alloy.layout.showContextMenu({
                    x: a.clientX,
                    y: a.clientY
                }, {
                    beforeShow: H,
                    items: c
                });
                qqweb.rpcService.reportQstatic("contextmenu|desktop")
            }
        }
    }, K = function () {
        G = {};
        if (window.webTop) alloy.hotkeyManager.getHotkeyInfo("layout_desktop_gosystem").disable = !1;
        for (var a in F) {
            var b = F[a],
                c = alloy.hotkeyManager.getHotkeyInfo(a);
            if (!c.disable) for (var e in c.keys) {
                var d = c.keys[e];
                G["" + (d.ctrlKey ? 1 : 0) + (d.shiftKey ? 1 : 0) + (d.altKey ? 1 : 0) + "_" + d.keyCode] = {
                    keyId: a,
                    action: b
                }
            }
        }
    };
    this.removeHotKeyAction = function (a) {
        F[a] = null;
        delete F[a];
        K()
    };
    this.getIsFocusOnDesktop = function () {
        return v
    };
    var N = function () {
        alloy.iconFactory.init()
    }, M = function (a) {
        if (alloy.hotkeyManager.isHotkeyEnable()) {
            var b = "" + (a.ctrlKey ? 1 : 0) + (a.shiftKey ? 1 : 0) + (a.altKey ? 1 : 0) + "_" + a.keyCode;
            if (G[b]) {
                var c = alloy.hotkeyManager.getHotkeyInfo(G[b].keyId);
                !c.disable && (!alloy.hotkeyManager.isHotkeyLimited() || !c.limit) && G[b].action(a)
            }
        }
    }, I = function (a) {
        var b = alloy.windowManager.getOnlyWindowList(),
            c = alloy.windowManager.getCurrentWindow(),
            e;
        if (c) for (var d = 0, f = b.length; d < f; d++) {
            if (e = b[d], c == e) {
                c = d;
                (e = b[c += a]) ? e.setCurrent() : c < 0 ? (e = b[b.length - 1], e.setCurrent()) : c >= b.length && (e = b[0], e.setCurrent());
                break
            }
        } else b.length > 0 && b[b.length - 1].setCurrent()
    }, Q = new a.fx.Animation({
        element: o,
        property: "opacity",
        from: 1,
        to: 0,
        unit: !1,
        duration: 1E3,
        fps: 30,
        transition: g.sinusoidal.easeOut
    });
    d.addObserver(Q, "end", function () {
        b.hide(o)
    });
    var R = new a.fx.Animation({
        element: u,
        property: "opacity",
        from: 1,
        to: 0,
        unit: !1,
        duration: 1E3,
        fps: 30,
        transition: g.sinusoidal.easeOut
    });
    d.addObserver(R, "end", function () {
        b.hide(u)
    });
    var H = function (a) {
        if (alloy.portal.getLoginLevel() != alloy.CONST.LOGIN_LEVEL_NONE) {
            var b = alloy.clipBoard.getData(),
                c = alloy.clipBoard.CLIP_BOARD_TYPE;
            b && (b.type == c.FILE || b.type == c.FOLDER) ? a.getItemAt(6).enable() : a.getItemAt(6).disable()
        }
    }, W = function () {
        a.profile("DesktopCreate");
        var e = b.id("desktopWrapper"),
            f = b.id("topBar"),
            j = b.id("bottomBar"),
            g = b.id("rightBar"),
            q = b.id("leftBar");
        h.topArea = f;
        h.bottomArea = j;
        h.mainArea = e;
        h.leftArea = q;
        h.rightArea = g;
        if (a.browser.mobileSafari) e = b.id("touchpad"), b.show(e), e.src = qqweb.CONST.MAIN_URL + "./touchpad.html?20101021001",
        d.on(l, "touchmove", function (a) {
            a.touches && a.touches.length == 1 && a.preventDefault()
        }, !0);
        e = A.createPanel({
            id: "desktop",
            name: "desktop",
            container: c.getBody(),
            body: u,
            html: ""
        });
        d.on(u, "contextmenu", J.onDesktopContextmenu);
        d.on(window, "resize", J.onWindowResize);
        if (a.browser.mobileSafari) d.on(window, "orientationchange", J.onWindowResize);
        d.on(u, "click", J.onClickDesktop);
        d.on(document, "keydown", J.onKeydownDesktop);
        d.on(document, "keyup", J.onKeyupDesktop);
        "onfocusin" in document ? (d.on(document, "focusin", J.onFocusDesktop),
        d.on(document, "focusout", J.onBlurDesktop)) : (d.on(window, "focus", J.onFocusDesktop), d.on(window, "blur", J.onBlurDesktop));
        a.profile("DesktopCreateFinish");
        return e
    }, P = a.Class({
        init: function () {
            this.panelList = []
        },
        createPanel: function (b) {
            var b = b || {}, c = new a.ui.Panel(b);
            this.panelList[b.id] = c;
            a.out("createPanel:" + b.name, "layout");
            return c
        },
        getPanel: function (a) {
            return this.panelList[a]
        }
    });
    this.init = function () {
        a.browser.mobileSafari ? (x = 680, y = 640) : (x = 320, y = 100);
        A = this.panelManager = new P;
        W();
        alloy.windowFactory.init();
        alloy.windowManager.init();
        alloy.desktopManager.init({
            initializeLength: 5
        });
        if (a.browser.firefox) setTimeout(J.onWindowResize, 100);
        else J.onWindowResize();
        d.addObserver(qqweb.portal, "AlloyJsReady", N);
        d.addObserver(alloy.layout, "desktopKeyup", M);
        alloy.dock.init({
            dragController: alloy.desktopManager.getDragController()
        });
        alloy.taskBar.init();
        K()
    };
    this.getArea = function (a) {
        return h[a + "Area"]
    };
    this.getAreaWidth = function (a) {
        return (a = h[a + "Area"]) ? b.getWidth(a) : 0
    };
    this.getAreaHeight = function (a) {
        return a === "bottom" ? 30 : (a = h[a + "Area"]) ? b.getHeight(a) : 0
    };
    this.getAvailableWidth = function () {
        return this.getDesktopWidth() - this.getAreaWidth("left") - this.getAreaWidth("right")
    };
    this.getAvailableHeight = function () {
        return this.getDesktopHeight() - this.getAreaHeight("top") - this.getAreaHeight("bottom")
    };
    this.setDesktopWidth = function (a) {
        return e = a
    };
    this.setDesktopHeight = function (a) {
        return j = a
    };
    this.getDesktopWidth = function () {
        return e
    };
    this.getDesktopHeight = function () {
        return j
    };
    this.getDesktopSize = function () {
        return {
            width: e,
            height: j
        }
    };
    this.getAvailSize = function () {
        return {
            width: this.getAvailableWidth(),
            height: this.getAvailableHeight()
        }
    };
    this.getClientWidth = function () {
        return p = p || b.getClientWidth()
    };
    this.getClientHeight = function () {
        return D = D || b.getClientHeight()
    };
    this.getClientSize = function () {
        return {
            width: c.getClientWidth(),
            height: c.getClientHeight()
        }
    };
    this.getDesktop = function () {
        return A.getPanel("desktop")
    };
    this.getBody = function () {
        return l
    };
    this.getMaskLayer = function (b) {
        return b ? (b = new a.ui.MaskLayer({
            appendTo: this.getDesktop().body,
            zIndex: 1,
            opacity: 0.5
        }), b.reset(), b) : (m || (m = new a.ui.MaskLayer({
            appendTo: this.getDesktop().body,
            zIndex: 1,
            opacity: 0.5
        })), m.reset(), m)
    };
    this.getPanel = function (a) {
        return A.getPanel(a)
    };
    this.getTopZIndex = function (b) {
        if (a.isUndefined(b) || !n[b]) b = 0;
        return n[b]++
    };
    this.getThemeManager = function () {};
    this.showDesktop = function () {
        for (var a = [], b, c = alloy.windowManager.getCurrentWindow(), e = alloy.windowManager.getWindowList(), d = 0; d < e.length; d++) b = e[d], b.windowType !== "widget" && b.isShow && b.isShow() && (b.min(), a.push(b));
        if (a.length > 0) w = a, q = c;
        else {
            q && !q.isDestroy && q.setCurrent();
            for (d = 0; d < w.length; d++) w[d].show()
        }
    };
    this.setTitle = function (a, b) {
        b.roll = b.roll || !1;
        b.speed = b.speed || 500;
        if (b.roll) {
            if (!(a.length < 1)) t = document.title, r && clearInterval(r), r = setInterval(function () {
                document.title = a;
                a = a.substr(1) + a.charAt(0)
            }, b.speed)
        } else t = document.title, document.title = a
    };
    this.resetTitle = function () {
        r && (clearInterval(r), r = null);
        document.title = t
    };
    this.setIe9IconOverLay = function (a) {
        var b = alloy.CONST.DOMAIN,
            c = ["overlay1", "overlay2", "overlay3", "overlay4", "overlay5", "overlay6", "overlay7", "overlay8", "overlay9", "overlay10"];
        if (a == 0) try {
            window.external.msSiteModeClearIconOverlay()
        } catch (e) {} else if (a < 10) try {
            window.external.msSiteModeSetIconOverlay("http://" + b + "/" + c[a - 1] + ".ico", "overlay " + a), window.external.msSiteModeActivate()
        } catch (d) {} else if (a >= 10) try {
            window.external.msSiteModeSetIconOverlay("http://" + b + "/" + c[9] + ".ico", "overlay 10"), window.external.msSiteModeActivate()
        } catch (f) {}
    };
    this.messagebox = function (a, b) {
        b = b || {};
        b.innerHtml = a;
        b.appendTo = b.appendTo || alloy.desktopManager.getCurrentDesktop().getElement();
        return (new alloy.businessClass.MessageBox(b)).Window
    };
    this.alert = function (a, b, c, e) {
        c = c || {};
        c.onAccept = b;
        c.onClose = e;
        c.innerHtml = a;
        c.appendTo = c.appendTo || alloy.desktopManager.getCurrentDesktop().getElement();
        return (new alloy.businessClass.MessageBox.Alert(c)).Window
    };
    this.confirm = function (a, b, c) {
        c = c || {};
        c.onAccept = b;
        c.innerHtml = a;
        c.appendTo = c.appendTo || alloy.desktopManager.getCurrentDesktop().getElement();
        return (new alloy.businessClass.MessageBox.Confirm(c)).Window
    };
    this.createBubble = function (b) {
        b = b || {};
        b.bubbleParent = b.bubbleParent || qqweb.layout.getDesktop().body;
        b.zIndex = b.zIndex || qqweb.layout.getTopZIndex(4);
        return new a.ui.Bubble(b)
    };
    this.getBubble = function () {
        B || (B = this.createBubble());
        return B
    };
    this.showContextMenu = function (b, c) {
        s || (s = new a.ui.ContextMenu({
            container: alloy.layout.getDesktop().body
        }));
        s.setZIndex(alloy.layout.getTopZIndex(3));
        s.setStyle("width", c.width ? c.width + "px" : "140px");
        s.clearItems();
        s.addItems(c.items);
        s.setArgument(c.argument);
        c.beforeShow && c.beforeShow.call(s, s);
        s.show(b.x, b.y, b.offset);
        c.afterShow && c.afterShow.call(s, s);
        return s
    };
    this.hideLoginWindow = function () {
        var a;
        if (a = b.id("ifram_login")) a.src = alloy.CONST.MAIN_URL + "domain.html";
        try {
            f.close(), f = null
        } catch (c) {}
    };
    this.showLoginBox = this.showLoginWindow = function (b, e, d, j) {
        b = {
            width: 380,
            height: 320,
            title: "\u767b\u5f55Q+ Web",
            hasCloseButton: !0,
            isSetCurrent: !0,
            isSetCentered: !0,
            dragable: !0,
            src: "",
            modal: !0,
            zIndex: c.getTopZIndex(3),
            appendTo: c.getDesktop().body,
            onClose: function () {
                f = null
            }
        };
        alloy.portal.setTryLoginType(e);
        d = d || "online";
        alloy.portal.setTryLoginState(d);
        d = alloy.util.state2code(d);
        alloy.portal.setWithPtwebqqLogin( !! alloy.portal.getPtwebqq());
        var g = encodeURIComponent(window.location.protocol + "//" + window.location.host + "/loginproxy.html"),
            h = "",
            j = j || "",
            h = "";
        if (j) e ? (c.loginWindowInfoHeight = !1, h = '<div id="login_window_info" class ="login_window_info login_window_info2">' + j + "</div>") : (c.loginWindowInfoHeight = !0, h = '<div id="login_window_info" class ="login_window_info">' + j + "</div>");
        e ? (b.src = "http://ui.ptlogin2.qq.com/cgi-bin/login?target=self&style=5&mibao_css=m_webqq&appid=1003903&enable_qlogin=0&no_verifyimg=1&s_url=" + g + "&f_url=loginerroralert&strong_login=1&login_state=" + d + "&t=" + alloy.CONST.UPDATE_TIME_STAMP, h = '            <div id="login_window_content_area" class="login_content_area"><div class="login_logo_qq"></div>' + h + '<div class="login_window_wrap">            <iframe id="ifram_login"  src="' + b.src + '" scrolling="no" frameborder="no" allowtransparency="true" scrolling="hidden" hidefocus ></iframe>                    </div></div>') : (b.src = "http://ui.ptlogin2.qq.com/cgi-bin/login?target=self&style=5&mibao_css=m_webqq&appid=1003903&enable_qlogin=0&no_verifyimg=1&s_url=" + g + "&f_url=loginerroralert&strong_login=0&login_state=" + d + "&t=" + alloy.CONST.UPDATE_TIME_STAMP, h = '<div id="login_window_content_area" class="login_content_area"><div class="login_logo_webqq"></div>' + h + '<div class="login_window_wrap">            <iframe id="ifram_login"  src="' + b.src + '" scrolling="no" frameborder="no" allowtransparency="true" scrolling="hidden" hidefocus ></iframe>                    </div></div>');
        f = new a.ui.Boxy(b);
        f.getPanel().setHtml(h);
        return f
    };
    this.setLoginWindowHeight = function (e) {
        c.loginWindowInfoHeight && (e += 18);
        f.getPanel().setHeight(e);
        if (a.browser.ie && a.browser.ie < 7) {
            var d = b.id("login_window_content_area");
            b.setStyle(d, "height", e + "px")
        }
    };
    this.hideStartingCover = function () {
        a.browser.ie == 6 ? setTimeout(function () {
            b.hide(o)
        }, 500) : Q.start();
        window.webTop && webTop.ui.channel.postCmd(23)
    };
    this.hideDesktop = function () {
        R.start()
    };
    this.showWebTopInstallBox = function () {
        if (a.platform.win) window.open("http://dl_dir.qq.com/qqfile/web/webqq/WebQQ_1.2.46.400.exe", "_blank");
        else {
            var c = alloy.CONST.CDN_URL + "swf/webtopInstall.swf?t=" + alloy.CONST.UPDATE_TIME_STAMP,
                e = alloy.layout.messagebox('<div class="airInstallPopup">        <div class="airInstallPopupContent">            <object id="webtopInstallFlash" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="385" height="164" align="middle">                <param name="movie" value="' + c + '" />                <param name="quality" value="high" />                <param name="bgcolor" value="#ffffff" />                <param name="play" value="true" />                <param name="loop" value="true" />                <param name="wmode" value="window" />                <param name="scale" value="showall" />                <param name="menu" value="true" />                <param name="devicefont" value="false" />                <param name="salign" value="" />                <param name="allowScriptAccess" value="always" />                <param name="flashvars" value="oninstall=alloy.layout.onAirInstallSuccess&onruntimeready=alloy.layout.onRuntimeReady&version=1.1.30&url=http://dl_dir.qq.com/qqfile/web/webqq/WebQQ.air" />                <embed src="' + c + '" FlashVars="oninstall=alloy.layout.onAirInstallSuccess&onruntimeready=alloy.layout.onRuntimeReady&version=1.1.30&url=http://dl_dir.qq.com/qqfile/web/webqq/WebQQ.air"                     quality="high" wmode="transparent" bgcolor="#ffffff" width="385" height="164" name="main" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer_cn" />            </object>        </div>        <div id="airInstallTip">            <span class="mytip">\u201c\u5ba2\u6237\u7aef\u201d\u652f\u6301Windows\u3001Mac\u3001Linux\u7b49\u7cfb\u7edf\u3002</span>            <div class="mytip2">\u5982\u679c\u5728\u7ebf\u5b89\u88c5\u5931\u8d25\uff0c\u60a8\u4e5f\u53ef\u4ee5\u624b\u52a8\u4e0b\u8f7d\u5b89\u88c5\uff0c\u6b65\u9aa4\u5982\u4e0b\uff1a</div>            <ol class="mylinks">                <li id="airDownloadLinkArea" class="link">                <a href="http://dl_dir.qq.com/qqfile/web/webqq/win/AdobeAIRInstaller.exe" target="_blank"  class="webtop_down_link_win">\u4e0b\u8f7dAdobe Air\u73af\u5883</a>                <a href="http://dl_dir.qq.com/qqfile/web/webqq/mac/AdobeAIR.dmg" target="_blank" class="webtop_down_link_mac">\u4e0b\u8f7dAdobe Air\u73af\u5883</a>                <select id="airDownloadSelect" class="webtop_down_link_linux" >                    <option value="">\u4e0b\u8f7dAdobe Air\u73af\u5883</option>                    <option value="http://dl_dir.qq.com/qqfile/web/webqq/lin/AdobeAIRInstaller.bin">Adobe AIR for Linux(.bin)</option>                    <option value="http://dl_dir.qq.com/qqfile/web/webqq/lin/adobeair.i386.rpm">Adobe AIR for Linux(.rpm)</option>                    <option value="http://dl_dir.qq.com/qqfile/web/webqq/lin/adobeair.deb">Adobe AIR for Linux(.deb)</option>                </select>                <span>\uff08\u82e5\u5df2\u5b89\u88c5\u53ef\u8df3\u8fc7\u6b64\u6b65\uff09</span>                </li>                <li id="airDownloadLinkArea2" class="link2">                    <a href="http://dl_dir.qq.com/qqfile/web/webqq/WebQQ.air" target="_blank">\u4e0b\u8f7dQ+ Web\u5ba2\u6237\u7aef</a></li>            </ol>        </div>        <div id="airCloseTip">            <div class="closeText">\u60a8\u73b0\u5728\u53ef\u4ee5\u5173\u95ed\u5f53\u524d\u6d4f\u89c8\u5668\u7a97\u53e3\uff0c\u4f7f\u7528"\u5ba2\u6237\u7aef"\u3002</div>            <a href="###" class="myBtn" id="airInstalledSureBtn">\u786e\u5b9a</a>        </div>    </div>', {
                    title: "\u201c\u5ba2\u6237\u7aef\u201d\u4e0b\u8f7d",
                    width: 385,
                    height: 268
                }),
                f = b.id("airInstalledSureBtn");
            d.on(f, "click", function (a) {
                a.preventDefault();
                d.off(f, "click");
                e.close()
            });
            c = b.id("airDownloadLinkArea");
            d.on(c, "click", function (a) {
                var b = a.target.href;
                if (b) return a.preventDefault(), window.open(b, "_blank"), !1
            });
            a.platform.linux && (c = b.id("airDownloadSelect"), d.on(c, "change", function () {
                var a = this.options[this.selectedIndex];
                a.value && window.open(a.value, "_blank")
            }))
        }
    };
    this.onAirInstallSuccess = function () {
        var a = b.id("airInstallTip"),
            c = b.id("airCloseTip");
        a && c && (b.hide(a), b.show(c))
    };
    this.onRuntimeReady = function () {
        var a = b.id("airDownloadLinkArea");
        a && b.hide(a)
    }
});
Jx().$package("alloy.dock", function (a) {
    var c = this,
        b = a.dom,
        d = a.event,
        g, k, l, o, t, r, u, v, s, m, f = 0,
        h = {}, n = {}, p, D, e, j = function (a, b) {
            A.onDockMenuItemClick(a, b)
        }, B = [{
            text: "\u5411\u5de6\u505c\u9760",
            icon: {
                className: "dock_menu_item_left"
            },
            argument: {
                location: "left"
            },
            onClick: j
        }, {
            text: "\u5411\u4e0a\u505c\u9760",
            icon: {
                className: "dock_menu_item_top"
            },
            argument: {
                location: "top"
            },
            onClick: j
        }, {
            text: "\u5411\u53f3\u505c\u9760",
            icon: {
                className: "dock_menu_item_right"
            },
            argument: {
                location: "right"
            },
            onClick: j
        }],
        x = function () {
            var a = alloy.portal.getSystemConfig("appMarket");
            e = alloy.iconFactory.createIcon("app", {
                className: "appMarket",
                longTouchable: !1,
                deleteable: !1,
                icon: {
                    url: alloy.CONST.CDN_URL + "style/images/appmarket.png?20111011001"
                },
                contextMenu: [{
                    text: "\u6253\u5f00\u5e94\u7528\u5e02\u573a",
                    onClick: function () {
                        alloy.portal.runApp("appMarket")
                    }
                }, {
                    type: "separator"
                }, {
                    text: "\u5378\u8f7d",
                    enable: !1
                }],
                onClick: function () {
                    if (e.isNotifyShow()) {
                        alloy.portal.runApp("appMarket", {
                            page: "all",
                            option: {
                                cat: -1,
                                orderBy: 2
                            }
                        });
                        if (alloy.portal.getLoginLevel() > 1) {
                            var a = {
                                context: this,
                                action: "reset",
                                data: {
                                    appid: 1E6,
                                    value: {
                                        appReadTime: (new Date).getTime()
                                    }
                                }
                            };
                            alloy.rpcService.sendSetConfigNew(a)
                        }
                        alloy.util.report2qqweb("screen|appmarket|new")
                    } else alloy.portal.runApp("appMarket"), alloy.util.report2qqweb("screen|appmarket");
                    e.hideNotify();
                    return !1
                }
            }, a);
            t.parentNode.insertBefore(e.getElement(), t);
            b.hide(e.getElement())
        }, y = function () {
            var a = alloy.portal.getSystemConfig("diskExplorer");
            D = alloy.iconFactory.createIcon("app", {
                className: "diskExplorer",
                longTouchable: !1,
                deleteable: !1,
                icon: {
                    url: alloy.CONST.CDN_URL + "style/images/diskexplorer.png?20111011001"
                },
                contextMenu: [{
                    text: "\u6253\u5f00\u6211\u7684\u7f51\u76d8",
                    onClick: function () {
                        alloy.system.getLoginLevel() > 1 ? alloy.system.runApp("diskExplorer") : alloy.layout.showLoginWindow("diskExplorer")
                    }
                }, {
                    type: "separator"
                }, {
                    text: "\u5378\u8f7d",
                    enable: !1
                }],
                onClick: function () {
                    alloy.system.getLoginLevel() > 1 ? alloy.system.runApp("diskExplorer") : alloy.layout.showLoginWindow("diskExplorer");
                    return !1
                }
            }, a);
            t.parentNode.insertBefore(D.getElement(),
            t);
            b.hide(D.getElement())
        }, A = {
            onQuickListContainerDragMove: function () {},
            onAlloyJsReady: function () {
                x();
                y();
                d.addObserver(alloy.sound, "SoundMuteChange", A.onSoundSettingChange)
            },
            onPortalReady: function () {
                b.show(e.getElement());
                b.show(D.getElement());
                alloy.portal.getLoginLevel() > alloy.CONST.LOGIN_LEVEL_NONE && alloy.rpcService.sendGetNewAppCount()
            },
            onGetNewAppCountSuccess: function (a) {
                var b = e;
                b && (a.result.allcount == 0 ? b.hideNotify() : b.showNotify(a.result.allcount), a.appReadTime && (p = a.appReadTime || (new Date).getTime()))
            },
            onDockContextMenu: function (a) {
                a.preventDefault();
                a.stopPropagation();
                alloy.layout.showContextMenu({
                    x: a.clientX,
                    y: a.clientY
                }, {
                    items: B,
                    beforeShow: function () {
                        this.setClass("dock_menu_select_" + s)
                    }
                })
            },
            onDockMenuItemClick: function (a, b) {
                var e = b.option.argument.location;
                c.setDockLocation(e, !0);
                alloy.util.report2qqweb("contextmenu|desktop|dock|" + e)
            },
            onQuickListContainerDrop: function (a) {
                var c = a.apperceiveEl,
                    e = c.getAttribute("type"),
                    d = a.pos,
                    f = b.getXY(t),
                    a = parseInt(c.getAttribute("fileId"));
                if (!isNaN(a)) {
                    d = s == "top" ? Math.ceil((d.x - f[0] - 29) / 58) : Math.ceil((d.y - f[1] - 29) / 58);
                    d < 0 ? d = 0 : d > 5 && (d = 5);
                    e = {
                        t: e,
                        id: a
                    };
                    c.getAttribute("from");
                    var j;
                    (j = alloy.fileSystem.getFileInfoByFile(e)) && alloy.fileSystem.moveFile(j.file, 5, d, j.parent.id, j.position, !0)
                }
            },
            onDesktopSwitchStatus: function (a) {
                a.status === alloy.desktopManager.DESK_STATUS.EDIT ? b.addClass(g.children[0], "appButtonEditState") : b.removeClass(g.children[0], "appButtonEditState")
            },
            onUACReady: function () {
                var a = alloy.config.configList.dockLoca || "left";
                s !== a && c.setDockLocation(a)
            },
            onDockDragStart: function () {
                b.show(l);
                b.show(o);
                b.show(k.top);
                b.show(k.left);
                b.show(k.right);
                w();
                alloy.util.report2qqweb("dockpositon|drag")
            },
            onDockDragEnd: function () {
                b.hide(l);
                b.hide(o);
                b.hide(k.top);
                b.hide(k.left);
                b.hide(k.right);
                v !== s && (setTimeout(function () {
                    c.setDockLocation(v, !0)
                }, 0), alloy.util.report2qqweb("dockpositon|dragto" + v))
            },
            onDockDragMove: function (a) {
                var b = a.orientEvent.pageX,
                    a = a.orientEvent.pageY,
                    c = alloy.layout.getClientWidth(),
                    e = alloy.layout.getClientHeight(),
                    b = a < e * 0.2 ? "top" : b < c / 2 ? "left" : "right";
                b !== v && w(b)
            },
            onFileAdd: function () {},
            onFileMove: function (a) {
                if (a.targetId == 5) if (a.sourceId == 5) {
                    var b = n[alloy.iconFactory.getIconId(a.file.t, a.file.id)],
                        c = a.targetPosition;
                    a.targetPosition > a.sourcePosition && c++;
                    C(b, c)
                } else q(a.file, a.targetPosition);
                else a.sourceId == 5 && F(a.file)
            },
            onFileDelete: function (a) {
                a.parent.id == 5 && F(a.file)
            },
            onClearDefaultApp: function () {
                G()
            },
            onGetAppConfigError: function () {
                G();
                alloy.appconfig.getAllConfig(50) && q({
                    id: 50,
                    t: "app"
                })
            },
            onGetAppConfigComplete: function () {
                a.profile("DockButton Create");
                var b = alloy.fileSystem.getFolderById(5).items;
                G();
                for (var c = 0; c < b.length && c < 5; c++) q(b[c]);
                a.profile("DockButton CreateFinish")
            },
            onPinyinClick: function () {
                alloy.portal.runApp("qqWebIme")
            },
            onSettingClick: function () {
                alloy.portal.runApp("settingCenter")
            },
            onThemeClick: function () {
                alloy.portal.runApp("themeSetting")
            },
            onSoundClick: function () {
                alloy.sound.isMute() ? alloy.sound.setMute(!1) : alloy.sound.setMute(!0)
            },
            stopPropagation: function (a) {
                a.stopPropagation()
            },
            onStartClick: function (a) {
                a.preventDefault();
                alloy.startMenu.toggleStartMenu(a.target)
            },
            onSoundSettingChange: function (a) {
                a ? (b.addClass(h.sound, "dock_tool_sound_mute"), h.sound.title = "\u53d6\u6d88\u9759\u97f3") : (b.removeClass(h.sound, "dock_tool_sound_mute"), h.sound.title = "\u9759\u97f3")
            },
            onToolListClick: function (a) {
                var b = qqweb.util.getActionTarget(a);
                if (b) {
                    var c = b.getAttribute("cmd");
                    c && A["on" + c + "Click"] && (a.preventDefault(), A["on" + c + "Click"](b))
                }
            },
            onStorageSpaceChanged: function () {
                var a = alloy.util.formatFileSize(alloy.storage.getTotalUsedSpace()),
                    b = alloy.util.formatFileSize(alloy.storage.getTotalSpace());
                D.setTitle("\u6211\u7684\u7f51\u76d8 " + a + "/" + b)
            }
        }, w = function (a) {
            v = a || s;
            b.setClass(k.top, "dock_drap_effect dock_drap_effect_top");
            b.setClass(k.left, "dock_drap_effect dock_drap_effect_left");
            b.setClass(k.right, "dock_drap_effect dock_drap_effect_right");
            b.setClass(k[v], "dock_drap_effect dock_drap_effect_" + v + " dock_drap_effect_current")
        };
    this.setDockLocation = function (a, c, e) {
        if ("left right top".indexOf(a) != -1) {
            var f = s;
            v = s = a;
            var j = alloy.layout.getArea(a);
            j.appendChild(g);
            u && (b.setStyle(u, "width", "0px"),
            b.setStyle(u, "height", "0px"));
            u = j;
            a == "left" || a == "right" ? (b.setStyle(j, "width", "73px"), b.setStyle(j, "height", "100%")) : (b.setStyle(j, "width", "100%"), b.setStyle(j, "height", "73px"));
            b.setClass(g, "dock_container dock_pos_" + a);
            if (c) {
                if (alloy.portal.getLoginLevel() > alloy.CONST.LOGIN_LEVEL_NONE) alloy.config.configList.dockLoca = a, e ? alloy.rpcService.sendMSetConfigDelay({
                    data: {
                        0: {
                            dockLoca: a
                        }
                    },
                    delay: e
                }) : alloy.rpcService.sendSetConfig({
                    data: {
                        r: {
                            appid: 0,
                            value: {
                                dockLoca: a
                            }
                        }
                    }
                });
                alloy.util.report2qqweb("dockpositon|" + a)
            }
            d.notifyObservers(alloy.dock, "DockLocationChanged", {
                loca: a,
                oldLoca: f
            })
        }
    };
    this.getDockLocation = function () {
        return s
    };
    this.getDockHeight = function () {
        return parseInt(b.getClientHeight(g))
    };
    var q = function (b, c) {
        var e;
        a: {
            e = {
                parentNode: t
            };
            var d = alloy.fileSystem.FILE_TYPE;
            if (b.t == d.APP) {
                d = alloy.appconfig.getAppConfig(b.id);
                if (!d) {
                    a.profile('Dock createFileIcon. id="' + b.id + '" appConfig is null', "Dock");
                    alloy.fileSystem.deleteFile(b, null, null, null, !1);
                    e = null;
                    break a
                }
                e = alloy.iconFactory.createIcon(b.t, e, d)
            } else if (b.t == d.BUDDY || b.t == d.GROUP) e = alloy.iconFactory.createIcon(b.t, e, b);
            else if (b.t == d.FOLDER || b.t == d.FILE) e.file = b, e = alloy.iconFactory.createIcon(b.t, e, b);
            else {
                e = null;
                break a
            }
            e && (n[e.getId()] = e, f++, m.addDragClass(e.getElement()))
        }
        e && C(e, c)
    }, C = function (b, c) {
        var e = b.getElement();
        if (a.isUndefined(c)) t.appendChild(e);
        else {
            var d = t.childNodes;
            d[c] ? t.insertBefore(e, d[c]) : t.appendChild(e)
        }
    }, F = function (a) {
        if (a = n[a.t + "_" + a.id]) n[a.getId()] = null, delete n[a.getId()], f--, a.destroy()
    }, G = function () {
        for (var a in n) {
            var b = n[a];
            n[a] = null;
            delete n[a];
            b.destroy()
        }
        f = 0
    };
    this.isInDock = function (b) {
        return !a.isUndefined(n[b])
    };
    this.getDockItemCount = function () {
        return f
    };
    this.getMaxDockItemCount = function () {
        return 5
    };
    this.getDragController = function () {
        return m
    };
    this.getAppIdList = function () {
        for (var a = [], b = t.children, c = 0, e = b.length; c < e; c++) a.push(parseInt(b[c].getAttribute("appId")));
        return a
    };
    this.setUpdateUacTime = function (a) {
        p = a
    };
    this.getUpdateUacTime = function () {
        return p
    };
    this.init = function (e) {
        n = {};
        f = 0;
        a.profile("Dock Create");
        m = e.dragController;
        g = b.node("div", {
            id: "dockContainer",
            "class": "dock_container"
        });
        g.innerHTML = '            <div class="dock_middle">                <div id="dockItemList" class="dock_item_list"></div>                <div id="dockToolList" class="dock_tool_list">                    <div class="dock_tool_item">                        <a href="###" class="dock_tool_icon dock_tool_pinyin" cmd="Pinyin" title="QQ\u4e91\u8f93\u5165\u6cd5"></a>                        <a href="###" class="dock_tool_icon dock_tool_sound" cmd="Sound" title="\u9759\u97f3"></a>                    </div>                    <div class="dock_tool_item">                        <a href="###" class="dock_tool_icon dock_tool_setting" cmd="Setting" title="\u7cfb\u7edf\u8bbe\u7f6e"></a>                        <a href="###" class="dock_tool_icon dock_tool_theme" cmd="Theme" title="\u4e3b\u9898\u8bbe\u7f6e"></a>                    </div>                    <div class="dock_tool_item2">                        <a href="###" class="dock_tool_icon dock_tool_start" title="\u70b9\u51fb\u8fd9\u91cc\u5f00\u59cb"></a>                    </div>                </div>            </div>        ';
        e = alloy.layout.getDesktop().body;
        e.appendChild(g);
        t = b.id("dockItemList");
        r = b.id("dockToolList");
        h.pinyin = b.mini(".dock_tool_pinyin", r)[0];
        h.sound = b.mini(".dock_tool_sound", r)[0];
        h.setting = b.mini(".dock_tool_setting", r)[0];
        h.theme = b.mini(".dock_tool_theme", r)[0];
        h.start = b.mini(".dock_tool_start", r)[0];
        d.on(r, "click", A.onToolListClick);
        d.on(h.start, "click", A.stopPropagation);
        d.on(h.start, "click", A.onStartClick);
        b.setStyle(g, "zIndex", alloy.layout.getTopZIndex());
        c.setDockLocation("left");
        d.on(g, "contextmenu",
        A.onDockContextMenu);
        t.setAttribute("customAcceptDrop", 1);
        d.addObserver(t, "dragmove", A.onQuickListContainerDragMove);
        d.addObserver(t, "drop", A.onQuickListContainerDrop);
        m.addDropTarget({
            el: t,
            level: 1
        });
        k = {
            top: b.node("div", {
                "class": "dock_drap_effect dock_drap_effect_top"
            }),
            left: b.node("div", {
                "class": "dock_drap_effect dock_drap_effect_left"
            }),
            right: b.node("div", {
                "class": "dock_drap_effect dock_drap_effect_right"
            })
        };
        e.appendChild(k.top);
        e.appendChild(k.left);
        e.appendChild(k.right);
        l = b.node("div", {
            "class": "dock_drap_proxy"
        });
        e.appendChild(l);
        o = b.node("div", {
            "class": "dock_drap_mask"
        });
        o.innerHTML = '<div class="dock_drop_region_top" name="top" cmd="region"></div><div class="dock_drop_region_left" name="left" cmd="region"></div><div class="dock_drop_region_right" name="right" cmd="region"></div>';
        e.appendChild(o);
        e = new a.ui.Drag(g, l);
        d.addObserver(e, "start", A.onDockDragStart);
        d.addObserver(e, "move", A.onDockDragMove);
        d.addObserver(e, "end", A.onDockDragEnd);
        d.addObserver(alloy.rpcService, "SendGetNewAppCountSuccess", A.onGetNewAppCountSuccess);
        d.addObserver(qqweb.portal, "AlloyJsReady", A.onAlloyJsReady);
        d.addObserver(alloy.portal, "portalReady", A.onPortalReady);
        d.addObserver(alloy.storage, "StorageSpaceChanged", A.onStorageSpaceChanged);
        a.profile("Dock CreateFinish");
        d.addObserver(alloy.fileSystem, "FileMove", A.onFileMove);
        d.addObserver(alloy.fileSystem, "FileAdd", A.onFileAdd);
        d.addObserver(alloy.fileSystem, "FileDelete", A.onFileDelete);
        d.addObserver(alloy.appconfig, "ClearDefaultApp", A.onClearDefaultApp);
        d.addObserver(alloy.appconfig, "GetAppConfigComplete",
        A.onGetAppConfigComplete);
        d.addObserver(alloy.appconfig, "GetDefaultAppConfigComplete", A.onGetAppConfigComplete);
        d.addObserver(alloy.appconfig, "GetAppConfigError", A.onGetAppConfigError);
        d.addObserver(alloy.portal, "UACReady", A.onUACReady);
        d.addObserver(alloy.portal, "DesktopSwitchStatus", A.onDesktopSwitchStatus)
    }
});
Jx().$package("alloy.startMenu", function (a) {
    var c = this,
        b = a.dom,
        d = a.event,
        g, k, l, o, t, r, u, v = {
            weibo: {
                url: "http://t.qq.com/Qplus_Web",
                title: "\u5b98\u65b9\u5fae\u535a"
            },
            support: {
                url: "http://support.qq.com/portal/discuss_pdt/513_1.html",
                title: "\u53cd\u9988\u8bba\u575b"
            },
            blog: {
                url: "http://webqq.qzone.qq.com",
                title: "\u5b98\u65b9\u535a\u5ba2"
            },
            question: {
                url: "http://service.qq.com/category/webQQ.html",
                title: "\u5e38\u89c1\u95ee\u9898"
            },
            imqq: {
                url: "http://www.qplus.com/productForWeb.shtml",
                title: "Q+\u5b98\u65b9\u7f51\u7ad9 -\u4ea7\u54c1\u4e2d\u5fc3"
            },
            download: {
                url: "http://www.qplus.com/productForPC.shtml",
                title: "Q+\u5b98\u65b9\u7f51\u7ad9 -\u4ea7\u54c1\u4e2d\u5fc3"
            }
        }, s = {
            stopPropagation: function (a) {
                a.stopPropagation()
            },
            onStartMenuBodyClick: function (a) {
                var b = alloy.util.getActionTarget(a, 2);
                if (b && b != "help") switch (l.hide(), a.preventDefault(), a.stopPropagation(), a = b.getAttribute("cmd"), a) {
                case "home":
                    pgvSendClick({
                        hottag: "WEB2QQ.TASKBAR.HOMEPAGE.LOGIN"
                    });
                    alloy.util.report2qqweb("taskbar|start|homepage");
                    alloy.util.setHomePage();
                    break;
                case "favorite":
                    pgvSendClick({
                        hottag: "WEB2QQ.TASKBAR.FAVORITE.LOGIN"
                    });
                    alloy.util.report2qqweb("taskbar|start|favorite");
                    alloy.util.addFavorite();
                    break;
                case "shortcut":
                    pgvSendClick({
                        hottag: "WEB2QQ.TASKBAR.SHORTCUT.LOGIN"
                    });
                    alloy.util.report2qqweb("taskbar|start|desktop");
                    open("./QPlusWeb.url");
                    break;
                case "lock":
                    alloy.portal.runApp("screenLocker");
                    pgvSendClick({
                        hottag: "WEB2QQ.TASKBAR.SCREENLOCKER.LOGIN"
                    });
                    alloy.util.report2qqweb("taskbar|start|screenlocker");
                    break;
                case "setting":
                    alloy.portal.runApp("settingCenter");
                    pgvSendClick({
                        hottag: "WEB2QQ.TASKBAR.SETTING.LOGIN"
                    });
                    alloy.util.report2qqweb("taskbar|start|setting");
                    break;
                case "logout":
                    alloy.portal.exit();
                    d.notifyObservers(alloy.portal, "Exit");
                    window.webTop && webTop.ui.channel.postCmd(23);
                    pgvSendClick({
                        hottag: "WEB2QQ.TASKBAR.EXIT.LOGIN"
                    });
                    alloy.util.report2qqweb("taskbar|start|exit");
                    break;
                case "exit":
                    h();
                    break;
                case "download":
                    e(v.download);
                    break;
                case "support":
                    window.open(v[a].url);
                    break;
                case "helper":
                    B();
                    break;
                case "about":
                    n()
                }
            },
            onHelpMenuClick: function (a) {
                var b = alloy.util.getActionTarget(a, 2);
                if (b) switch (a.preventDefault(),
                a = b.getAttribute("cmd"), a) {
                case "hot":
                    alloy.util.report2qqweb("taskbar|help|tips");
                    alloy.app.tips.showNews();
                    break;
                case "weibo":
                    e(v[a]);
                    alloy.util.report2qqweb("taskbar|help|officialmicroblog");
                    break;
                case "support":
                    window.open(v[a].url);
                    alloy.util.report2qqweb("taskbar|help|support");
                    break;
                case "report":
                    j();
                    break;
                case "blog":
                    e(v[a]);
                    alloy.util.report2qqweb("taskbar|help|officialblog");
                    break;
                case "helper":
                    B();
                    break;
                case "question":
                    e(v[a]);
                    alloy.util.report2qqweb("taskbar|help|faq");
                    break;
                case "imqq":
                    e(v[a])
                }
            },
            onHelpMenuMouseenter: function () {
                u && (clearTimeout(u), u = 0)
            },
            onHelpMenuMouseleave: function () {
                D()
            },
            onStartHeplerBtnMouseover: function () {
                n()
            },
            onStartHeplerBtnClick: function (a) {
                a.preventDefault();
                a.stopPropagation();
                n()
            },
            onStartHeplerBtnMouseout: function () {
                D()
            },
            onStartMenuBodyMouseover: function (a) {
                var c;
                ((c = a.target).tagName == "LI" || (c = a.target.parentNode).tagName == "LI") && b.setClass(c, "taskbar_start_menu_hover")
            },
            onStartMenuBodyMouseout: function (a) {
                var c;
                ((c = a.target).tagName == "LI" || (c = a.target.parentNode).tagName == "LI") && b.setClass(c, "")
            },
            onHelpMenuMouseover: function (a) {
                (a = alloy.util.getActionTarget(a, 2)) && b.setClass(a, "taskbar_help_menu_hover")
            },
            onHelpMenuMouseout: function (a) {
                (a = alloy.util.getActionTarget(a, 2)) && b.setClass(a, "")
            },
            onSelfInfoAreaClick: function (a) {
                a.preventDefault();
                if (alloy.portal.getLoginLevel() == alloy.CONST.LOGIN_LEVEL_NONE) alloy.layout.showLoginWindow(""), alloy.util.report2qqweb("taskbar|start|signin");
                else if (a = parseInt(this.getAttribute("uin"), 10)) alloy.portal.runApp("userDetails", a), alloy.util.report2qqweb("taskbar|start|profile")
            },
            onSelfInfoReady: function (a) {
                r.title = "\u7f16\u8f91\u4e2a\u4eba\u8d44\u6599";
                r.innerHTML = a.htmlNick;
                r.setAttribute("uin", a.uin)
            },
            onUserAvatarChanged: function () {}
        }, m = function () {
            k || c.init();
            l.setZIndex(alloy.layout.getTopZIndex(3));
            var a = alloy.dock.getDockLocation(),
                e = b.getXY(g),
                d, f;
            a == "left" ? (d = e[0] + 60, f = e[1] - 200) : a == "right" ? (d = e[0] - 210, f = e[1] - 200) : a == "top" && (d = e[0] - 120, f = e[1] + 60);
            l.setXY(d, f);
            l.show()
        }, f = function () {
            l.hide()
        };
    this.showStartMenu = m;
    this.hideStartMenu = f;
    this.toggleStartMenu = function (a) {
        g = a || g;
        l && l.isShow() ? f() : m();
        pgvSendClick({
            hottag: "WEB2QQ.TASKBAR.START.LOGIN"
        });
        alloy.util.report2qqweb("taskbar|start")
    };
    this.getStartMenuHeight = function () {
        return b.getClientHeight(t)
    };
    this.getStartMenuPos = function () {
        return b.getXY(t)
    };
    var h = function () {
        var a = "\u60a8\u786e\u5b9a\u8981\u9000\u51fa  Q+ Web \u5417\uff1f";
        window.webTop && (a = "\u60a8\u786e\u5b9a\u8981\u9000\u51fa\u201c\u5ba2\u6237\u7aef\u201d\u5417\uff1f");
        alloy.layout.confirm(a, function () {
            alloy.portal.close()
        }, {
            modal: !0
        });
        alloy.util.report2qqweb("taskbar|start|quit")
    },
    n = function () {
        if (!o) {
            var c = '                <div class="taskbar_help_menu_head">                </div>                <div class="taskbar_help_menu_body">                    <div class="taskbar_help_menu_text">\u4f60\u7684\u5728\u7ebf\u5e94\u7528\u6570\u636e\u5e73\u53f0\uff0c\u5b9e\u73b0\u672c\u5730\u4e0e\u4e91\u7aef\u65e0\u7f1d\u5207\u6362</div>                    <a href="###" cmd="imqq" class="taskbar_help_menu_link" title="http://www.qplus.com/productForWeb.shtml">http://www.qplus.com/productForWeb.shtml</a>                    <a href="###" cmd="report" class="taskbar_help_menu_link" title="\u9519\u8bef\u4e0a\u62a5">\u9519\u8bef\u4e0a\u62a5</a>                </div>                <div class="taskbar_help_menu_bottom">                    <span class="taskbar_help_menu_bottom_text">\u53cd\u9988:</span>                    <a href="###" cmd="weibo" class="helpMenuImg taskbar_help_menu_weibo" title="\u5b98\u65b9\u5fae\u535a">&nbsp;</a>\t\t\t\t\t<a href="###" cmd="blog" class="helpMenuImg taskbar_help_menu_blog" title="\u5b98\u65b9\u535a\u5ba2">&nbsp;</a>\t\t\t\t\t<a href="###" cmd="question" class="helpMenuImg taskbar_help_menu_question" title="\u5e38\u89c1\u95ee\u9898">&nbsp;</a>                </div>';
            a.browser.ie && (c += '<iframe width="100%" height="100%" class="fullscreen_bg_iframe"></iframe>');
            var e = b.node("div", {
                "class": "helpMenuImg taskbar_help_menu_container"
            });
            b.hide(e);
            alloy.layout.getDesktop().body.appendChild(e);
            o = new alloy.layout.PopupBox({
                container: e,
                parentPopupBox: l,
                html: c
            });
            d.on(e, "click", s.onHelpMenuClick)
        }
        u && (clearTimeout(u), u = 0);
        o.setZIndex(alloy.layout.getTopZIndex(3));
        o.show()
    }, p = function () {
        o.hide()
    }, D = function () {
        u && (clearTimeout(u), u = 0);
        u = setTimeout(p, 200)
    }, e = function (a) {
        alloy.portal.openInWebBrowser(a)
    },
    j = function () {
        alloy.layout.confirm("<div style='margin:10px 20px 20px;text-indent:24px;text-align:left;line-height:24px;'>\u5982\u679c\u60a8\u9047\u5230\u9875\u9762\u5f02\u5e38\uff0c\u53ef\u4ee5\u53cd\u9988\u9875\u9762\u9519\u8bef\u65e5\u5fd7\uff0c\u4ee5\u4fbf\u7cfb\u7edf\u5c3d\u5feb\u5b9a\u4f4d\u95ee\u9898\uff0c\u53cd\u9988\u8fc7\u7a0b\u4e2d\u4e0d\u4f1a\u66b4\u9732\u60a8\u7684\u4efb\u4f55\u9690\u79c1\u4fe1\u606f\u3002\u662f\u5426\u53cd\u9988\u672c\u6b21\u9875\u9762\u9519\u8bef\u65e5\u5fd7\uff1f<div>",

        function () {
            alloy.util.LogReport()
        }, {
            title: "\u9519\u8bef\u62a5\u544a",
            width: 365,
            height: 100,
            modal: !0
        });
        alloy.util.report2qqweb("taskbar|help|report")
    }, B = function () {
        alloy.portal.runApp("helper");
        pgvSendClick({
            hottag: "WEB2QQ.TASKBAR.HELPER.LOGIN"
        });
        alloy.util.report2qqweb("taskbar|help|helper")
    }, x = ['<li cmd="home"><a href="###" title="\u8bbe\u4e3a\u4e3b\u9875">\u8bbe\u4e3a\u4e3b\u9875</a></li>', '<li cmd="favorite"><a href="###" title="\u6dfb\u52a0\u5230\u6536\u85cf\u5939">\u6dfb\u52a0\u5230\u6536\u85cf\u5939</a></li>', '<li cmd="shortcut"><a href="###" target="_blank" title="\u4fdd\u5b58\u684c\u9762\u5feb\u6377\u65b9\u5f0f">\u4fdd\u5b58\u684c\u9762\u5feb\u6377\u65b9\u5f0f</a></li>', '<li cmd="lock"><a href="###" title="\u9501\u5b9a">\u9501\u5b9a</a></li>', '<li cmd="setting"><a href="###" title="\u7cfb\u7edf\u8bbe\u7f6e">\u7cfb\u7edf\u8bbe\u7f6e</a></li>', '<li id="taskbar_helpButton" cmd="about"  title="\u5173\u4e8eQ+ Web"><a href="###">\u5173\u4e8eQ+ Web</a></li>', '<li cmd="logout"><a href="###"  title="\u9000\u51fa" class="logout_botton"></a></li>', '<li cmd="exit"><a href="###" title="\u9000\u51fa">\u9000\u51fa</a></li>', '<li cmd="download"><a href="###" title="\u4e0b\u8f7d\u5ba2\u6237\u7aef">\u4e0b\u8f7d\u5ba2\u6237\u7aef</a></li>', '<li cmd="helper"><a href="###" title="\u65b0\u624b\u6307\u5bfc">\u65b0\u624b\u6307\u5bfc</a></li>'],
        y = [1, 2, 8, 5, 9];
    this.init = function () {
        for (var c = [], e = 0; e < y.length; ++e) c.push(x[y[e]]);
        c = '            <div id="taskbar_start_menu_body" class="startMenuImg taskbar_start_menu_body">                <div id="startMenuSelfInfo" class="taskbar_start_menu_selfinfo" uin="0">                    <div id="startMenuSelfNick" class="taskbar_start_menu_nick">\u8bf7&nbsp;<a href="###">\u767b\u5f55</a></div>                    <a cmd="support" class="startMenuImg startMenuTopControl_support" href="###" title="\u53cd\u9988">&nbsp;</a>                    <a cmd="lock" class="startMenuImg startMenuTopControl_lock" href="###" title="\u9501\u5b9a">&nbsp;</a>                </div>                <ul class="taskbar_start_menu">' + c.join("") + '</ul>                <a href="###" cmd="logout" title="\u6ce8\u9500\u5f53\u524d\u7528\u6237" class="startMenuImg logout_botton"></a>            </div>            ';
        a.browser.ie && (c += '<iframe width="100%" height="100%" class="fullscreen_bg_iframe"></iframe>');
        t = b.node("div", {
            "class": "taskbar_start_menu_container",
            id: "startMenuContainer"
        });
        t.innerHTML = c;
        alloy.layout.getDesktop().body.appendChild(t);
        c = !1;
        a.browser.mobileSafari && (c = !0);
        l = new alloy.layout.PopupBox({
            container: t,
            noCatchMouseUp: c
        });
        r = b.id("startMenuSelfNick");
        b.id("startMenuSelfInfo");
        if (alloy.portal.getLoginLevel() > alloy.CONST.LOGIN_LEVEL_NONE) s.onSelfInfoReady(alloy.system.getPortalSelf());
        c = b.id("taskbar_start_menu_body");
        d.on(r, "click", s.onSelfInfoAreaClick);
        d.on(c, "click", s.onStartMenuBodyClick);
        a.browser.ie == 6 && (d.on(c, "mouseover", s.onStartMenuBodyMouseover), d.on(c, "mouseout", s.onStartMenuBodyMouseout));
        k = !0;
        d.addObserver(alloy.portal, "selfInfoReady", s.onSelfInfoReady);
        d.addObserver(alloy.portal, "UserAvatarChanged", s.onUserAvatarChanged);
        d.addObserver(alloy.portal, "SelfInfoChanged", s.onSelfInfoReady)
    }
});
Jx().$package("alloy.appManager", function (a) {
    var c = this,
        b = a.dom,
        d = a.event,
        g, k = [],
        l, o, t, r, u, v = {}, s, m = function () {
            g = b.node("div", {
                id: "appManagerPanel",
                "class": "appManagerPanel"
            });
            g.innerHTML = '                <a class="aMg_close" href="###"></a>                <div class="aMg_dock_container" customAcceptDrop=1 index=5></div>                <div class="aMg_line_x"></div>                <div class="aMg_folder_container">                    <div class="folderItem">                        <div class="folder_bg folder_bg1"></div>                        <div class="folderOuter" customAcceptDrop=1 index=0><div class="folderInner" customAcceptDrop=1 index=0></div></div>                    </div>                    <div class="folderItem ">                        <div class="folder_bg folder_bg2"></div>                        <div class="folderOuter" customAcceptDrop=1 index=1><div class="folderInner" customAcceptDrop=1 index=1></div></div>                        <div class="aMg_line_y"></div>                    </div>                    <div class="folderItem ">                        <div class="folder_bg folder_bg3"></div>                        <div class="folderOuter" customAcceptDrop=1 index=2><div class="folderInner" customAcceptDrop=1 index=2></div></div>                        <div class="aMg_line_y"></div>                    </div>                    <div class="folderItem ">                        <div class="folder_bg folder_bg4"></div>                        <div class="folderOuter" customAcceptDrop=1 index=3><div class="folderInner" customAcceptDrop=1 index=3></div></div>                        <div class="aMg_line_y"></div>                    </div>                    <div class="folderItem ">                        <div class="folder_bg folder_bg5"></div>                        <div class="folderOuter" customAcceptDrop=1 index=4><div class="folderInner" customAcceptDrop=1 index=4></div></div>                        <div class="aMg_line_y"></div>                    </div>                </div>';
            document.body.appendChild(g);
            l = b.mini(".aMg_dock_container", g)[0];
            s = b.mini(".aMg_folder_container", g)[0];
            o = b.mini(".folderItem", g);
            t = b.mini(".folderInner", g);
            r = b.mini(".folderOuter", g);
            u = new a.ui.Sortables([], "id");
            a.array.forEach(r, function (b, c) {
                k[c] = new a.ui.ScrollBar(b, {
                    ipadTouchArea: !0
                })
            });
            u.addDropTarget({
                el: l,
                level: 0
            });
            d.addObserver(l, "drop", f.onDockContainerDrop);
            a.array.forEach(r, function (a) {
                u.addDropTarget({
                    el: a,
                    level: 0
                });
                d.addObserver(a, "drop", f.onFolderContainerDrop)
            });
            var c = b.mini(".aMg_close", g)[0];
            d.on(c, "click",
            p);
            d.addObserver(u, "start", f.onDragStart);
            d.addObserver(alloy.layout, "desktopResize", y);
            d.addObserver(alloy.fileSystem, "FileMove", f.onFileMove)
        }, f = {
            onDragStart: function () {
                alloy.util.report2app("navbar|fullview|move")
            },
            onFolderContainerDrop: function (a) {
                var c = a.apperceiveEl,
                    e = c.getAttribute("type"),
                    d = a.pos,
                    f = a.currentDropTarget,
                    a = parseInt(f.getAttribute("index"));
                xy = b.getXY(f);
                f = parseInt(c.getAttribute("fileId"));
                if (!isNaN(f)) {
                    d = Math.floor((d.y + k[a].getScrollTop() - xy[1]) / 35);
                    e = {
                        t: e,
                        id: f
                    };
                    c.getAttribute("from");
                    var j;
                    (j = alloy.fileSystem.getFileInfoByFile(e)) && alloy.fileSystem.moveFile(j.file, a, d, null, null, !0)
                }
            },
            onDockContainerDrop: function (a) {
                var c = a.apperceiveEl,
                    e = c.getAttribute("type"),
                    d = a.pos,
                    f = a.currentDropTarget,
                    a = parseInt(f.getAttribute("index"));
                xy = b.getXY(f);
                f = parseInt(c.getAttribute("fileId"));
                if (!isNaN(f)) {
                    d = Math.floor((d.x - 80) / 70);
                    d > 5 && (d = 5);
                    d < 0 && (d = 0);
                    e = {
                        t: e,
                        id: f
                    };
                    c.getAttribute("from");
                    var j;
                    (j = alloy.fileSystem.getFileInfoByFile(e)) && alloy.fileSystem.moveFile(j.file, a, d, j.parent.id, j.position, !0)
                }
            },
            onFileMove: function (a) {
                if (a.targetId >= 0 && a.targetId < 5) {
                    if (a.targetId == a.sourceId) {
                        var b = n(a.file.id, a.file.t);
                        if (b) {
                            var b = b.getElement(),
                                c = b.parentNode;
                            c.removeChild(b);
                            var e = a.targetPosition;
                            c.childNodes[e] ? c.insertBefore(b, c.childNodes[e]) : c.appendChild(b)
                        }
                    } else if ((b = n(a.file.id, a.file.t)) && h(b, a.sourceId, a.sourcePosition), b = B([a.file], a.targetId)[0]) b = b.getElement(), c = b.parentNode, e = a.targetPosition, c.childNodes[e] && c.insertBefore(b, c.childNodes[e]);
                    k[a.targetId] && k[a.targetId].update();
                    k[a.sourceId] && k[a.sourceId].update()
                } else if ((b = n(a.file.id, a.file.t)) && h(b, a.sourceId, a.sourcePosition), b = j([a.file], a.targetId)[0]) b = b.getElement(), c = b.parentNode, e = a.targetPosition + 1, a.sourceId == 5 && c.removeChild(b), c.childNodes[e] && c.insertBefore(b, c.childNodes[e])
            }
        }, h = function (a) {
            a = v[a.getId()];
            delete v[a.getId()];
            a.destroy()
        }, n = function (a, b) {
            typeof b !== "undefined" && (a = b + "_" + a);
            return v[a]
        }, p = function (a) {
            a && a.preventDefault();
            g && (c.hide(), b.show(alloy.layout.getDesktop().body))
        };
    this.close = p;
    var D = function () {
        l.innerHTML = "";
        a.array.forEach(t, function (a) {
            a.innerHTML = ""
        });
        var b = alloy.fileSystem.getFolderById(5);
        e();
        j(b.items);
        for (var b = [], c = 0; c < 5; c++) {
            var d = alloy.fileSystem.getFolderById(c);
            b.push(d);
            B(d.items, c)
        }
    }, e = function () {
        var a = alloy.portal.getSystemConfig("appMarket");
        appMarketButton = alloy.iconFactory.createIcon(alloy.fileSystem.FILE_TYPE.APP, {
            className: "appMarket",
            longTouchable: !1,
            deleteable: !1,
            isShowNotify: !1,
            parentNode: l,
            icon: {
                url: alloy.CONST.CDN_URL + "style/images/appmarket.png?20111011001"
            },
            onClick: function () {
                c.close();
                alloy.portal.runApp("appMarket");
                return !1
            }
        }, a)
    }, j = function (b) {
        var e = [],
            f = {
                parentNode: l,
                longTouchable: !1,
                isShowNotify: !1
            }, j = function () {
                c.close();
                alloy.util.report2app("navbar|fullview|runapp")
            }, g;
        for (g in b) {
            var h = x(b[g], a.clone(f));
            e.push(h);
            d.addObserver(h, "iconclick", j)
        }
        return e
    }, B = function (b, e) {
        var f = [],
            j = {
                parentNode: t[e],
                longTouchable: !1,
                isShowNotify: !1,
                className: "amg_folder_appbutton"
            }, g = function () {
                c.close();
                alloy.util.report2app("navbar|fullview|runapp")
            }, h;
        for (h in b) {
            var k = x(b[h], a.clone(j));
            f.push(k);
            d.addObserver(k, "iconclick", g)
        }
        return f
    }, x = function (b, c) {
        var e, d = alloy.fileSystem.FILE_TYPE;
        if (b.t == d.APP) e = alloy.appconfig.getAppConfig(b.id), e = alloy.iconFactory.createIcon(b.t, c, e);
        else if (b.t == d.BUDDY || b.t == d.GROUP) e = alloy.iconFactory.createIcon(b.t, c, b);
        else if (b.t == d.FOLDER || b.t == d.FILE) c.file = b, e = alloy.iconFactory.createIcon(b.t, c, b);
        v[e.getId()] = e;
        a.platform.iPad || u.addDragClass(e.getElement());
        return e
    }, y = function () {
        var c = alloy.layout.getDesktopHeight() - 80;
        b.setStyle(s, "height", c + "px");
        a.browser.ie == 6 && (c = alloy.layout.getClientWidth(), b.setStyle(s, "width", (c / 5 % 1 > 0.5 ? c + 2 : c) + "px"));
        a.array.forEach(k, function (a) {
            a.update()
        })
    };
    this.tooglePanel = function () {
        g && b.isShow(g) ? this.close() : this.show()
    };
    this.show = function () {
        g || m();
        alloy.util.report2app("navbar|fullview");
        alloy.desktopManager.setDesktopStatus(alloy.desktopManager.DESK_STATUS.MANAGE);
        D();
        b.hide(alloy.layout.getDesktop().body);
        b.show(g);
        a.array.forEach(o, function (a) {
            setTimeout(function () {
                b.addClass(a, "folderItem_turn")
            },
            0)
        });
        y()
    };
    this.hide = function () {
        b.hide(g);
        alloy.util.report2app("navbar|fullview|exit");
        alloy.desktopManager.setDesktopStatus(alloy.desktopManager.DESK_STATUS.NORMAL);
        a.array.forEach(o, function (a) {
            b.removeClass(a, "folderItem_turn")
        })
    }
});
Jx().$package("alloy.taskBar", function (a) {
    var c = this,
        b = a.dom,
        d = a.event,
        g = a.string;
    this.init = function () {
        alloy.layout.getArea("bottom").innerHTML = '<div class="taskNextBox" id="taskNextBox"><a href="#" class="taskNext" id="taskNext" hidefocus="true"></a></div>\t\t\t\t\t\t\t\t<div class="taskContainer" id="taskContainer"><div class="taskContainerInner" id="taskContainerInner"></div></div>\t\t\t\t\t\t\t\t<div class="taskPreBox" id="taskPreBox"><a href="#" class="taskPre" id="taskPre" hidefocus="true"></a></div>';
        k = b.id("taskContainer");
        l = b.id("taskContainerInner");
        w.init();
        q.init();
        d.addObserver(this, "NewTaskItem", C.onNewTaskItem);
        d.addObserver(this, "RemoveTaskItem", C.onRemoveTaskItem);
        d.addObserver(this, "NotifyTaskItem", C.onNotifyTaskItem);
        d.addObserver(this, "FlashTaskItem", C.onFlashTaskItem);
        d.addObserver(this, "UpdateTaskName", C.onUpdateTaskName);
        d.addObserver(this, "UpdateTaskTitle", C.onUpdateTaskTitle);
        d.addObserver(alloy.windowFactory, "WindowCreate", F);
        d.addObserver(this, "NotifyBeat_250", P);
        d.addObserver(alloy.layout, "desktopResize", K);
        d.addObserver(this, "EQQBuddyStateChange", V);
        d.addObserver(this, "EQQSelfStateChange", T);
        d.addObserver(alloy.dock, "DockLocationChanged", Z)
    };
    this.getTask = function (b) {
        return a.isUndefined(b) ? !1 : p(b)
    };
    this.getTaskItem = function (b, c) {
        if (a.isUndefined(b) || a.isUndefined(c)) return !1;
        var e = M({
            appId: b,
            id: c
        });
        if (e = p(e.appId)) return e.getItem(c)
    };
    var k = null,
        l = null,
        o = !1,
        t = !1,
        r = !1,
        u = alloy.CONST.CDN_URL + "style/images/transparent.gif",
        v = alloy.CONST.CDN_URL + "style/images/mid.png",
        s = {
            appId: "5_0",
            appName: "\u6b63\u5728\u804a\u5929...",
            appIcon: alloy.CONST.CDN_URL + "style/images/task/eqq_chatbox.png"
        }, m = {
            appId: "_folder",
            appName: "\u6587\u4ef6\u5939"
        }, f = {
            appId: "_diskAdmin",
            appName: "\u8d44\u6e90\u7ba1\u7406\u5668"
        }, h = 0,
        n = {}, p = function (a) {
            return a == 0 ? !1 : n[a]
        }, D = function (b, c) {
            if (a.isUndefined(b) || a.isUndefined(c)) return !1;
            var e = p(b);
            return e ? e.getItem(c) : !1
        }, e = function (b) {
            return b == "" ? "" : a.browser.ie == 6 ? '<img src="' + u + '" style="' + ("background:node;filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + b + "', sizingMethod='scale')") + '" />' : '<img src="' + b + '" />'
        }, j = function (c) {
            if (a.browser.ie == 6) return !1;
            if (c = b.mini(".taskItemIcon img", c)[0]) d.on(c, "error", function () {
                this.src = v
            })
        }, B = 0,
        x = null,
        y = function (f) {
            var h = f.id,
                q = f.icon || "",
                k = f.name.toString() || "\u4efb\u52a1\u680f\u9879",
                l = f.title || k,
                x = f.win,
                n = B++,
                o = f._appId,
                y = g.encodeHtmlSimple(k),
                m = null;
            this.setName = function (a) {
                k = a.toString() || "";
                y = g.encodeHtmlSimple(k);
                l = k;
                m.title = l;
                b.mini(".taskItemTxt", m)[0].innerHTML = y
            };
            this.setTitle = function (b) {
                if (a.isUndefined(b)) return !1;
                l = b;
                m.title = l
            };
            this.getId = function () {
                return h
            };
            this.getDid = function () {
                return n
            };
            this.setAppId = function (a) {
                o = a;
                m.setAttribute("appid", a)
            };
            this.createDom = function () {
                var a = b.node("a", {
                    id: "taskItem_" + n,
                    "class": "taskItem",
                    href: "#",
                    appid: o,
                    tid: h,
                    title: l
                });
                a.innerHTML = '<div class="taskItemIcon">' + e(q) + '<div class="taskItemIconState"></div>\t\t\t\t\t\t\t </div>\t\t\t\t\t\t\t <div class="taskItemTxt">' + y + "</div>";
                m = a;
                d.on(a, "click", this.onClick);
                d.on(a, "contextmenu", this.onRightClick);
                j(a);
                return a
            };
            this.removeDom = function () {
                m.parentNode.removeChild(m);
                d.off(m, "click")
            };
            this.getDom = function () {
                return m
            };
            this.addClass = function (a) {
                b.addClass(m, a)
            };
            this.removeClass = function (a) {
                b.removeClass(m, a)
            };
            this.onClick = function (b) {
                a.isUndefined(b) || b.preventDefault();
                x.desktopIndex === alloy.desktopManager.getCurrentDesktopIndex() ? x.getWindowFlags && x.getWindowFlags() & alloy.CONST.WINDOW_FLAG_CURRENT ? x.min() : x.setCurrent() : x.setCurrent();
                d.notifyObservers(c, "TaskItemClick", h)
            };
            this.onRightClick = function (a) {
                a.preventDefault();
                var b = U(o, h);
                b && alloy.layout.showContextMenu({
                    x: a.clientX,
                    y: a.clientY
                }, {
                    argument: {
                        appId: o,
                        id: h
                    },
                    items: b
                })
            };
            this.setCurrent = function () {
                this.jumpDown()
            };
            this.setNotCurrent = function () {};
            this.jumpUp = function () {
                var a = "",
                    a = b.hasClass(m, "fistTaskItem") ? "firstTaskItemHight" : "taskItemHight";
                b.addClass(m, a);
                w.isShow() && w.getCurAppId() == o && w.jumpUpItem("taskItem_" + n, a)
            };
            this.jumpDown = function () {
                var a = "",
                    a = b.hasClass(m, "fistTaskItem") ? "firstTaskItemHight" : "taskItemHight";
                b.removeClass(m, a)
            };
            this.winMax = function () {
                x.setCurrent();
                x.max()
            };
            this.winMin = function () {
                x.min()
            };
            this.close = function () {
                x.close()
            };
            this.getWinStatus = function () {
                return x.getBoxStatus()
            };
            this.isWinShow = function () {
                return x.isShow()
            };
            this.getWin = function () {
                return x
            }
        }, A = function (c) {
            var f = c.appId || 0,
                h = c.srcAppId || 0,
                k = c.groupId || f,
                x = c.groupType || "single",
                B = c.appIcon || "",
                o = c.preSiblingAppId || null,
                m = c.appName.toString() || "",
                C = c.appType,
                r = this,
                t = g.encodeHtmlSimple(m),
                p = {}, A = [],
                s = null,
                u = null,
                v = null,
                F = null,
                D = 0;
            this.init = function () {
                p = {};
                A = [];
                var c = b.node("div", {
                    id: "taskGroup_" + f,
                    "class": "taskGroup"
                });
                c.innerHTML = '<div class="taskItemBox"></div>';
                s = c;
                u = b.mini(".taskItemBox", c)[0];
                if (l.innerHTML == "") l.appendChild(c);
                else {
                    var e = a.browser.ie && a.browser.ie < 9 ? l.firstChild : l.firstElementChild;
                    if (o) {
                        var d = b.id("taskGroup_" + o);
                        d && (e = d)
                    }
                    l.insertBefore(c, e)
                }
                e = b.getWidth(l);
                b.setStyle(l, "width", e + 114 + "px");
                b.addClass(c, "taskGroupAnaWidth")
            };
            this.getAppId = function () {
                return f
            };
            this.setAppId = function (a) {
                for (var b in A) A[b].setAppId(a);
                f = a
            };
            this.getGroupId = function () {
                return k
            };
            this.getGroupType = function () {
                return x
            };
            this.getSrcAppId = function () {
                return h
            };
            this.getCurrentItemId = function () {
                return D
            };
            this.addItem = function (b) {
                p || (p = {});
                if (!a.isUndefined(p[b.id]) && p[b.id]) return !1;
                D = b.id;
                b.id = b.id;
                b._appId = f;
                b._appType = C;
                if (a.isUndefined(b.icon) || b.icon == "") b.icon = B;
                var c = new y(b),
                    e = c.createDom();
                p[b.id] = c;
                A.push(c);
                u.appendChild(e);
                this.checkTask();
                q.resize();
                H();
                K()
            };
            this.removeItem = function (a) {
                D == a && (D = 0);
                if (this.getItemCount() > 1) {
                    for (var b in A) if (A[b].getId() == a) {
                        A.splice(b, 1);
                        break
                    }
                    p[a].removeDom();
                    p[a] = null;
                    delete p[a];
                    this.checkTask();
                    H();
                    q.resize();
                    K();
                    return this.getItemCount()
                } else return this.removeTask(), K(), 0
            };
            this.getItem = function (a) {
                return p[a]
            };
            this.getItemList = function () {
                return p
            };
            this.getItemArr = function () {
                return A
            };
            this.getItemWinSatus = function (a) {
                if (p[a]) return p[a].getWinStatus()
            };
            this.isItemWinShow = function (a) {
                if (p[a]) return p[a].isWinShow()
            };
            this.setItemName = function (b, c) {
                !a.isUndefined(p[b]) && p[b] && p[b].setName(c)
            };
            this.removeTask = function () {
                v && d.off(v, "click");
                s.parentNode.removeChild(s);
                p = null;
                A = [];
                s = null;
                E();
                var c = b.getWidth(l);
                b.setStyle(l, "width", c - 114 + "px");
                q.resize();
                c = f;
                a.isUndefined(n[c]) || (n[c] = null, delete n[c])
            };
            this.onClick = function (b) {
                if (a.isUndefined(b)) return !1;
                p[b].onClick()
            };
            this.onRightClick = function (a) {
                a.preventDefault();
                var b = U(f);
                b && alloy.layout.showContextMenu({
                    x: a.clientX,
                    y: a.clientY
                }, {
                    argument: {
                        appId: f
                    },
                    items: b
                })
            };
            this.checkTask = function () {
                if (this.getItemCount() > 1) {
                    if (v) b.show(v);
                    else {
                        var a = b.node("div", {
                            id: "taskGroupItem_" + f,
                            "class": "taskItem taskGroupItem",
                            title: m
                        });
                        a.innerHTML = '<div class="taskItemIcon">' + e(B) + '</div>\t\t\t\t\t\t\t  <div class="taskItemCount"></div>\t\t\t\t\t\t\t  <div class="taskItemTxt">' + t + '</div>\t\t\t\t\t\t\t  <div class="taskItemGroupIcon"></div>';
                        v = a;
                        F = b.mini(".taskItemCount", a)[0];
                        s.appendChild(a);
                        d.on(a, "click", G);
                        d.on(a, "contextmenu", r.onRightClick);
                        j(a)
                    }
                    b.hide(u)
                } else v && b.hide(v), b.show(u)
            };
            this.getItemCount = function () {
                var a = 0;
                if (!p) return 0;
                for (var b in p) a++;
                return a
            };
            this.setCurrent = function (a) {
                if (!s) return !1;
                D = a;
                (a = this.getItem(a)) && a.setCurrent();
                b.addClass(s, "taskCurrent")
            };
            this.setNotCurrent = function (a) {
                if (!s) return !1;
                (a = this.getItem(a)) && a.setNotCurrent();
                b.removeClass(s, "taskCurrent")
            };
            this.jumpUp = function (a) {
                b.addClass(s, "taskJumpUp");
                (a = this.getItem(a)) && a.jumpUp()
            };
            this.jumpDown = function () {
                b.removeClass(s, "taskJumpUp")
            };
            this.winMin = function () {
                for (var a in p) p[a].winMin()
            };
            this.close = function () {
                for (var a in p) p[a].close()
            };
            this.resetTaskGroupOpen = function () {
                b.removeClass(v, "taskGroupItemOpen");
                d.off(document.body, "mouseup")
            };
            this.getItemsWidth = function () {
                return this.getItemCount() * 114
            };
            this.getContainer = function () {
                return s
            };
            var G = function () {
                if (w.isShow()) E();
                else {
                    w.setContent(u.innerHTML, f);
                    var a = b.getClientXY(this);
                    w.setPostion(a[0]);
                    w.show();
                    b.addClass(v, "taskGroupItemOpen");
                    d.on(document.body, "mouseup", J)
                }
            }, E = function () {
                w.hide();
                v && b.removeClass(v, "taskGroupItemOpen");
                d.off(document.body, "mouseup")
            }, J = function (a) {
                if (b.contains(v, a.target)) return !1;
                E()
            }, H = function () {
                if (!F) return !1;
                F.innerHTML = r.getItemCount()
            }, K = function () {
                if (!p) return !1;
                var a = 0,
                    b;
                for (b in p) {
                    a++;
                    var c = p[b];
                    a == 1 ? c.addClass("fistTaskItem") : c.removeClass("fistTaskItem")
                }
            }
        }, w = {
            _curAppId: 0,
            _mainDom: null,
            _contentDom: null,
            _contentInnerDom: null,
            _maskIframe: null,
            _domPageUp: null,
            _domPageDown: null,
            _turnPageMaxHeight: 120,
            _turnPageHeight: 40,
            _touchStartY: 0,
            _touchEndY: 0,
            _isMove: !1,
            init: function () {
                var a = alloy.layout.getArea("bottom"),
                    c = b.node("iframe", {
                        id: "taskMenuMask",
                        name: "taskMenuMask",
                        "class": "taskMenuMask",
                        frameBorder: "0",
                        allowtransparency: "true",
                        scrolling: "no",
                        style: "display:none",
                        src: "./domain.html"
                    });
                this._maskIframe = c;
                a.parentNode.insertBefore(c, a);
                c = b.node("div", {
                    id: "taskMenuBox",
                    "class": "taskMenuBox ",
                    style: "display:none"
                });
                c.innerHTML = '<div class="taskMenuContentBox"><div class="taskMenuContentInner"></div></div>';
                this._mainDom = c;
                this._contentDom = b.mini(".taskMenuContentBox", c)[0];
                this._contentInnerDom = b.mini(".taskMenuContentInner", c)[0];
                a.parentNode.insertBefore(c, a)
            },
            getCurAppId: function () {
                return this._curAppId
            },
            getMainDom: function () {
                return this._mainDom
            },
            getMenuInnerDom: function () {
                return this._contentInnerDom
            },
            setContent: function (a, b) {
                this._curAppId = b;
                this.unbindDom();
                this._contentInnerDom.innerHTML = a;
                this.bindDom();
                setTimeout(this.resizeMask, 0)
            },
            bindDom: function () {
                var a = b.mini(".taskItem", this._mainDom),
                    c;
                for (c in a) d.on(a[c], "click", this.onClick), d.on(a[c], "mouseup", this.onMouseUp), d.on(a[c], "contextmenu", this.onRightClick)
            },
            unbindDom: function () {
                var a = b.mini(".taskItem", this._mainDom),
                    c;
                for (c in a) d.off(a[c], "click"), d.off(a[c], "mouseup"), d.off(a[c], "contextmenu")
            },
            getItemCount: function () {
                return b.mini(".taskItem",
                this._mainDom).length
            },
            resizeMask: function () {
                var a = b.getClientHeight(w._mainDom);
                b.setStyle(w._maskIframe, "height", a + "px")
            },
            setPostion: function (a) {
                b.setStyle(this._mainDom, "left", a - 1 + "px");
                b.setStyle(this._maskIframe, "left", a + "px")
            },
            show: function () {
                if (!this._mainDom) return !1;
                b.show(this._mainDom);
                b.show(this._maskIframe);
                this.setPage()
            },
            isShow: function () {
                return b.isShow(this._mainDom)
            },
            hide: function () {
                this._mainDom && (b.hide(this._mainDom), b.hide(this._maskIframe))
            },
            jumpUpItem: function (a, c) {
                var e = b.mini(".taskItem", this._contentInnerDom),
                    d;
                for (d in e) {
                    var f = e[d];
                    if (f.getAttribute("id") == a) {
                        b.addClass(f, c);
                        break
                    }
                }
            },
            jumpDownItem: function (a, c) {
                var e = b.mini(".taskItem", this._contentInnerDom),
                    d;
                for (d in e) {
                    var f = e[d];
                    if (f.getAttribute("id") == a) {
                        b.removeClass(f, c);
                        break
                    }
                }
            },
            onClick: function (a) {
                a.preventDefault();
                var b = this.getAttribute("appid"),
                    a = this.getAttribute("tid"),
                    b = p(b);
                b.onClick(a);
                b.resetTaskGroupOpen();
                w.hide()
            },
            onRightClick: function (a) {
                a.preventDefault();
                var b = this.getAttribute("appid"),
                    c = this.getAttribute("tid"),
                    e = U(b, c);
                e && alloy.layout.showContextMenu({
                    x: a.clientX,
                    y: a.clientY
                }, {
                    argument: {
                        appId: b,
                        id: c
                    },
                    items: e
                })
            },
            onMouseUp: function (a) {
                a.stopPropagation()
            },
            setPageMaxHeight: function () {
                var a = alloy.layout.getAvailableHeight();
                this._turnPageMaxHeight = a - a % 40 - 80
            },
            setPage: function () {
                this.setPageMaxHeight();
                this.resetPage();
                var c = this._turnPageMaxHeight;
                b.getClientHeight(this._mainDom);
                var e = b.getClientHeight(this._contentInnerDom);
                if (e > c) {
                    if (!this._domPageUp) this._domPageUp = e = b.node("a", {
                        "class": "taskMenuUp taskMenuUpDisable",
                        href: "#",
                        hidefocus: "true"
                    }), d.on(e, "click", this.menuUp), d.on(e, "mouseup", function (a) {
                        a.stopPropagation()
                    }), this._mainDom.insertBefore(e, a.browser.ie && a.browser.ie < 9 ? this._mainDom.firstChild : this._mainDom.firstElementChild), e = b.node("a", {
                        "class": "taskMenuDown",
                        href: "#",
                        hidefocus: "true"
                    }), d.on(e, "click", this.menuDown), d.on(e, "mouseup", function (a) {
                        a.stopPropagation()
                    }), this._domPageDown = e, this._mainDom.appendChild(e);
                    b.setStyle(this._contentDom, "height", c + "px");
                    a.platform.iPad && this.setIpad();
                    this.downToBottom()
                } else this._domPageUp && (b.hide(this._domPageUp), b.hide(this._domPageDown), a.platform.iPad && this.removeIpad()), b.setStyle(this._contentDom, "height", e + "px")
            },
            resetPage: function () {
                if (!w._contentInnerDom || !w._domPageUp) return !1;
                b.setStyle(w._contentInnerDom, "marginTop", "0px");
                b.getClientHeight(this._mainDom);
                var a = b.getClientHeight(this._contentInnerDom);
                this._domPageUp && this._turnPageMaxHeight < a ? (b.show(this._domPageUp), b.show(this._domPageDown), b.addClass(w._domPageUp, "taskMenuUpDisable"), b.removeClass(w._domPageDown, "taskMenuDownDisable")) : (b.hide(this._domPageUp), b.hide(this._domPageDown), b.addClass(w._domPageUp, "taskMenuUpDisable"), b.addClass(w._domPageDown, "taskMenuDownDisable"))
            },
            resize: function () {
                this.isShow() && this.hide()
            },
            menuUp: function (a, c) {
                a && (a.preventDefault(), a.stopPropagation());
                c = c || w._turnPageHeight;
                if (b.hasClass(w._domPageUp, "taskMenuUpDisable")) return !1;
                var e = parseInt(b.getStyle(w._contentInnerDom, "marginTop") || 0),
                    d = b.getHeight(w._contentDom),
                    f = b.getClientHeight(w._contentInnerDom);
                if (e >= 0 || d >= f) return !1;
                b.setStyle(w._contentInnerDom, "marginTop", (-e > c ? e + c : 0) + "px"); - e <= c && b.addClass(w._domPageUp, "taskMenuUpDisable");
                b.hasClass(w._domPageDown, "taskMenuDownDisable") && b.removeClass(w._domPageDown, "taskMenuDownDisable")
            },
            menuDown: function (a, c) {
                a && (a.preventDefault(), a.stopPropagation());
                c = c || w._turnPageHeight;
                if (b.hasClass(w._domPageDown, "taskMenuUpDisable")) return !1;
                var e = parseInt(b.getStyle(w._contentInnerDom, "marginTop") || 0),
                    d = b.getHeight(w._contentDom),
                    f = b.getClientHeight(w._contentInnerDom);
                if (f + e <= d || d >= f) return !1;
                var j = f - d + e;
                b.setStyle(w._contentInnerDom, "marginTop", (j > c ? e - c : -(f - d)) + "px");
                j <= c && b.addClass(w._domPageDown, "taskMenuDownDisable");
                b.hasClass(w._domPageUp, "taskMenuUpDisable") && b.removeClass(w._domPageUp, "taskMenuUpDisable")
            },
            downToBottom: function () {
                var a = b.getClientHeight(this._mainDom),
                    c = b.getClientHeight(this._contentInnerDom);
                c > a && (b.removeClass(this._contentInnerDom, "taskMenuContentInnerAnm"), this.menuDown(null, c), b.addClass(this._contentInnerDom, "taskMenuContentInnerAnm"))
            },
            setIpad: function () {
                var a = this._contentInnerDom;
                a.addEventListener("touchstart", function (a) {
                    w._touchStartY = a.targetTouches[0].clientY
                }, !0);
                a.addEventListener("touchmove", function (a) {
                    w._touchEndY = a.targetTouches[0].clientY;
                    a = w._touchEndY - w._touchStartY;
                    if (a < -5) {
                        if (b.isShow(w._domPageUp)) w.menuDown(null, - a), w._isMove = !0
                    } else if (a > 5) {
                        if (b.isShow(q._domPageDown)) w.menuUp(null, a), w._isMove = !0
                    } else return !1;
                    w._touchStartY = w._touchEndY
                }, !0);
                a.addEventListener("touchend", function (a) {
                    w._isMove && (a.preventDefault(), a.stopPropagation());
                    w._isMove = !1
                }, !0)
            },
            removeIpad: function () {
                var a = this._contentInnerDom;
                a.removeEventListener("touchstart");
                a.removeEventListener("touchmove");
                a.removeEventListener("touchend")
            }
        }, q = {
            _pre: null,
            _preBox: null,
            _next: null,
            _nextBox: null,
            _dockMarginDom: null,
            _dockMarginWidth: -1,
            _touchStartX: 0,
            _touchEndX: 0,
            _isMove: !1,
            init: function () {
                this._pre = b.id("taskPre");
                this._preBox = b.id("taskPreBox");
                this._next = b.id("taskNext");
                this._nextBox = b.id("taskNextBox");
                d.on(this._pre, "click",
                this.onPre);
                d.on(this._next, "click", this.onNext);
                var c = q.getAvailableWidth();
                a.isNumber(c) && this.setContainerWidth(c - 114);
                this.setDockMargin();
                a.platform.iPad && this.setIpad()
            },
            setInnerRight: function (c) {
                var e = a.browser;
                e.ie > 0 && e.ie < 8 ? b.setStyle(l, "right", c + "px") : b.setStyle(l, "marginRight", c + "px")
            },
            getInnerRight: function () {
                var c = a.browser;
                return c.ie > 0 && c.ie < 8 ? parseInt(b.getStyle(l, "right")) : parseInt(b.getStyle(l, "marginRight"))
            },
            resize: function () {
                if (r) return !1;
                if (!t) {
                    t = !0;
                    var a = q.getAvailableWidth(),
                        c = 0,
                        e;
                    for (e in n) c += n[e].getItemsWidth();
                    if (c > a) {
                        if (!o) {
                            o = !0;
                            var d = [],
                                f;
                            for (f in n) d.push(n[f]);
                            var j = x.getGroupId(),
                                a = x.getCurrentItemId(),
                                c = -1;
                            n = {};
                            for (f in d) if (e = d[f], e.getGroupType() == "group") {
                                var g = e.getItemList(),
                                    h = e.getAppId(),
                                    k = e.getGroupId(),
                                    B;
                                for (B in g) {
                                    var m = g[B],
                                        y = m.getWin();
                                    F(y, h);
                                    k == j && m.getId() == a && (x = p(k), c = a);
                                    W(h, m.getId()) && (y = N(y), H(h, m.getId()), R(y))
                                }
                                e.removeTask()
                            } else g = e.getSrcAppId(), g = M({
                                appId: g,
                                id: g
                            }), e.setAppId(g.appId), n[g.appId] = e;
                            c != -1 && x.setCurrent(a)
                        }
                    } else if (o) {
                        o = !1;
                        f = [];
                        for (d in n) f.push(n[d]);
                        B = x.getGroupId();
                        a = x.getCurrentItemId();
                        c = -1;
                        n = {};
                        for (d in f) if (e = f[d], e.getGroupType() == "group") {
                            e.getItemList();
                            h = e.getItemArr();
                            g = [];
                            if (h.length > 1 && h[0].getDid() > h[1].getDid()) for (j = h.length - 1; j >= 0; j--) g.push(h[j].getId());
                            else for (j in h) g.push(h[j].getId());
                            k = h = e.getAppId();
                            m = e.getGroupId();
                            for (j in g) {
                                var y = e.getItem(g[j]),
                                    w = y.getWin();
                                F(w, k);
                                var C = N(w),
                                    k = C.appId;
                                if (m == B && y.getId() == a) x = p(C.appId), c = C.id;
                                e.removeItem(y.getId());
                                W(h, y.getId()) && (C = N(w), H(h, y.getId()),
                                R(C))
                            }
                        } else g = e.getSrcAppId(), g = M({
                            appId: g,
                            id: g
                        }), e.setAppId(g.appId), n[g.appId] = e;
                        c != -1 && x.setCurrent(a)
                    }
                    t = !1
                }
                d = q.getAvailableWidth();
                j = b.getWidth(l);
                j > d ? (q.setContainerWidth(d - 114), q.resizeCurrentTask(), q.showBtn()) : (q.setContainerWidth(j), q.setInnerRight(0), q.hideBtn());
                q.checkShowDockMargin()
            },
            setContainerWidth: function (c) {
                b.setStyle(k, "width", c + "px");
                if (a.browser.ie == 6) {
                    var e = alloy.layout.getArea("bottom");
                    b.setStyle(e, "width", c + 114 + 6 + "px")
                }
            },
            setBottomAreaWidth: function () {
                var a = alloy.layout.getArea("bottom");
                b.setStyle(a, "right", this._dockMarginWidth + "px")
            },
            setDockMargin: function () {
                if (alloy.dock.getDockLocation() == "right") {
                    if (this._dockMarginWidth == -1) {
                        var a = q.getAvailableWidth();
                        this._dockMarginWidth = b.getClientWidth() - a;
                        this.setBottomAreaWidth()
                    }
                } else if (this._dockMarginWidth > 0) this._dockMarginWidth = -1, this.setBottomAreaWidth()
            },
            checkShowDockMargin: function () {
                if (this._dockMarginWidth == -1) return !1;
                var a = alloy.dock.getDockHeight();
                if ((b.getClientHeight() - a) /2-64<0){if(this._dockMarginWidth==0)a=q.getAvailableWidth(),
this._dockMarginWidth=b.getClientWidth()-a,this.setBottomAreaWidth()}else this._dockMarginWidth=0,this.setBottomAreaWidth()},resizeCurrentTask:function(){var a=q.getAvailableWidth(),c=b.getWidth(l);if(!x)return!1;x.getAppId();var e=b.mini(".taskGroup",l);q.getInnerRight();var d=0,f;for(f in e)if(d++,b.hasClass(e[f],"taskCurrent"))break;d=e.length-d+1;a-=114;d=c-d*114;c-d<a&&(d=c-a);q.setInnerRight(-d)},hideBtn:function(){b.hide(this._preBox);b.hide(this._nextBox);d.off(k,"mousewheel",this.onMouseWheel)},
showBtn:function(){b.show(this._preBox);b.show(this._nextBox);this.checkPreBtn();this.checkNextBtn();d.on(k,"mousewheel",this.onMouseWheel)},onPre:function(a,c){a&&a.preventDefault();if(b.hasClass(q._pre,"taskPreDisable"))return!1;var c=c||114,e=b.getWidth(l),d=b.getWidth(k),f=q.getInnerRight();if(d>=e||d-f>=e)return!1;e=e-d+f;q.setInnerRight(f-(e>c?c:e));q.checkPreBtn();q.checkNextBtn()},checkPreBtn:function(){var a=b.getWidth(l),c=b.getWidth(k),e=q.getInnerRight(),d=this._pre;a-c+e>10?b.hasClass(d,
"taskPreDisable")&&b.removeClass(d,"taskPreDisable"):b.hasClass(d,"taskPreDisable")||b.addClass(d,"taskPreDisable")},onNext:function(a,c){a&&a.preventDefault();if(b.hasClass(q._next,"taskNextDisable"))return!1;var c=c||114,e=b.getWidth(l),d=b.getWidth(k),f=q.getInnerRight();if(d>=e||f>=0)return!1;e=c;q.setInnerRight(f+(-f>c?c:-f));-f<=c&&q.checkNextBtn();q.checkPreBtn()},checkNextBtn:function(){var a=this._next;q.getInnerRight()<0?b.hasClass(a,"taskNextDisable")&&b.removeClass(a,"taskNextDisable"):
b.hasClass(a,"taskNextDisable")||b.addClass(a,"taskNextDisable")},onMouseWheel:function(a){if(a.wheelDelta>0){if(b.isShow(q._preBox))q.onPre()}else if(a.wheelDelta<0&&b.isShow(q._nextBox))q.onNext()},getAvailableWidth:function(){var a=alloy.dock.getDockHeight();return(b.getClientHeight()-a)/2 - 64 < 0 ? alloy.layout.getAvailableWidth() : b.getClientWidth()
                }, setIpad: function () {
                    var a = l;
                    a.addEventListener("touchstart", function (a) {
                        q._isMove = !1;
                        q.touchStartX = a.targetTouches[0].clientX
                    }, !0);
                    a.addEventListener("touchmove",

                    function (a) {
                        q.touchEndX = a.targetTouches[0].clientX;
                        a = q.touchEndX - q.touchStartX;
                        if (a > 50) {
                            if (b.isShow(q._preBox)) q.onPre(null, a), q._isMove = !0
                        } else if (a < -50) {
                            if (b.isShow(q._nextBox)) q.onNext(null, - a), q._isMove = !0
                        } else return !1;
                        q.touchStartX = q.touchEndX
                    }, !0);
                    a.addEventListener("touchend", function (a) {
                        q._isMove && (a.preventDefault(), a.stopPropagation());
                        q._isMove = !1
                    }, !0)
                }
            },
            C = {
                onNewTaskItem: function (b) {
                    var c = b.appId || "task_" + h++,
                        e = p(c);
                    if (a.isUndefined(e) || !e) e = new A(b), e.init(), n[c] = e;
                    e.addItem({
                        id: b.id,
                        name: b.name,
                        title: b.title,
                        preSiblingAppId: b.preSiblingAppId,
                        icon: b.icon,
                        win: b.win
                    })
                },
                onNotifyTaskItem: function (a) {
                    a = M(a);
                    R(a)
                },
                onFlashTaskItem: function (a) {
                    a = M(a);
                    E(a);
                    setTimeout(function () {
                        L(a)
                    }, 200)
                },
                onRemoveTaskItem: function (b) {
                    var c = p(b.appId);
                    a.isUndefined(c) || (a.isUndefined(b.id) ? c.removeTask() : c.removeItem(b.id))
                },
                onUpdateTaskName: function (b) {
                    var b = M(b),
                        c = p(b.appId);
                    a.isUndefined(c) || c.setItemName(b.id, b.name)
                },
                onUpdateTaskTitle: function (b) {
                    var c = p(b.appId);
                    a.isUndefined(c) || c.getItem(b.id).setTitle(b.title)
                },
                onSetCurrent: function (b) {
                    var c = p(b.appId);
                    a.isUndefined(c) || (x && c.getAppId() != x.getAppId() && x.setNotCurrent(), c.setCurrent(b.id), x = c, q.resize())
                },
                onSetNotCurrent: function (b) {
                    b = p(b.appId);
                    a.isUndefined(b) || b.setNotCurrent()
                }
            },
            F = function (b, e) {
                var j = b.option.taskType || "";
                if (j == "app") {
                    var j = b.option,
                        g = alloy.portal.getAllConfig(j.appId);
                    if (!(a.isUndefined(g) || g.appLevel && g.appLevel == "system" && !g.quickPanel)) {
                        var h = h = c.getAppIcon(g),
                            j = {
                                appId: j.appId,
                                srcAppId: j.appId,
                                appName: g.appName,
                                appIcon: h,
                                appType: "app",
                                groupType: "single",
                                id: j.appId,
                                name: g.appName,
                                icon: h,
                                win: b
                            }, j = M(j);
                        C.onNewTaskItem(j)
                    }
                } else if (j == "chatBox") {
                    g = b.option;
                    j = g.chatBoxType;
                    g = g.userOrGroup;
                    h = {
                        appId: s.appId,
                        srcAppId: s.appId,
                        appName: s.appName,
                        appIcon: s.appIcon,
                        appType: "chatBox",
                        groupType: "group",
                        preSiblingAppId: e,
                        win: b
                    };
                    if (j == "single") h.id = g.uin, h.name = g.markName || g.nick, h.title = h.name + " - " + EQQ.hash.onlineStatusText[g.state], h.icon = alloy.util.getUserAvatar(g.uin);
                    else if (j == "group") h.id = g.gid, h.name = g.markName || g.name, h.icon = alloy.util.getGroupAvatar(g.code);
                    else if (j == "discu") h.id = g.did, h.name = g.name, h.icon = alloy.util.getDiscuAvatar(g.did);
                    if (!o) h.groupId = h.appId, h.appId = h.appId + "_" + h.id;
                    C.onNewTaskItem(h);
                    j == "single" && V({
                        id: g.uin,
                        state: g.state
                    })
                } else if (j == "folder") {
                    j = b.option;
                    g = alloy.CONST.CDN_URL + "/style/images/filesys/folder.png?t=20111011001";
                    j = {
                        appId: m.appId,
                        srcAppId: m.appId,
                        appName: m.appName,
                        appIcon: g,
                        appType: "folder",
                        groupType: "group",
                        preSiblingAppId: e,
                        id: j.windowId,
                        name: j.title,
                        icon: g,
                        win: b
                    };
                    if (!o) j.groupId = j.appId, j.appId = j.appId + "_" + j.id;
                    C.onNewTaskItem(j)
                } else if (j == "diskAdmin") {
                    j = b.option;
                    g = alloy.CONST.CDN_URL + "/style/images/diskexplorer.png?t=20111011001";
                    j = {
                        appId: f.appId,
                        srcAppId: f.appId,
                        appName: f.appName,
                        appIcon: g,
                        appType: "diskAdmin",
                        groupType: "group",
                        preSiblingAppId: e,
                        id: j.windowId,
                        name: j.title,
                        icon: g,
                        win: b
                    };
                    if (!o) j.groupId = j.appId, j.appId = j.appId + "_" + j.id;
                    C.onNewTaskItem(j)
                }
                d.addObserver(b, "close", G);
                d.addObserver(b, "setCurrent", a.bind(J, this, b))
            },
            G = function (a) {
                if (N(a)) C.onRemoveTaskItem(N(a))
            },
            J = function (a) {
                if (a = N(a)) C.onSetCurrent(a),
                H(a.appId, a.id)
            },
            K = function () {
                q.resize();
                w.resize()
            },
            N = function (a) {
                var b = a.option,
                    c = b.taskType || "",
                    e = {};
                if (c == "app") e = {
                    appId: b.appId,
                    id: b.appId
                };
                else if (c == "chatBox") e = {
                    appId: s.appId,
                    id: a.uin
                };
                else if (c == "folder") e = {
                    appId: m.appId,
                    id: b.windowId
                };
                else if (c == "diskAdmin") e = {
                    appId: f.appId,
                    id: b.windowId
                };
                else return !1;
                return M(e)
            },
            M = function (a) {
                if (!o) a.appId = a.appId + "_" + a.id;
                return a
            },
            I = [],
            Q = 1,
            R = function (b) {
                if (a.isUndefined(b.appId)) return !1;
                if (x && x.getAppId() == b.appId && x.getCurrentItemId() == b.id && x.isItemWinShow(b.id)) return !1;
                var e = p(b.appId);
                if (a.isUndefined(e) || a.isUndefined(e.getItem(b.id))) return !1;
                var e = !1,
                    f;
                for (f in I) {
                    var j = I[f];
                    if (j.appId == b.appId && j.id == b.id) {
                        e = !0;
                        break
                    }
                }
                e || I.push(b);
                d.notifyObservers(c, "TaskBarNotifyBeatStart")
            },
            H = function (a, b) {
                if (!I || I.length < 1) return !1;
                for (var e in I) {
                    var f = I[e];
                    if (f.appId == a && f.id == b) {
                        L(f);
                        I.splice(e, 1);
                        break
                    }
                }
                I.length < 1 && d.notifyObservers(c, "TaskBarNotifyBeatStop")
            },
            W = function (a, b) {
                if (!I || I.length < 1) return !1;
                for (var c in I) {
                    var e = I[c];
                    if (e.appId == a && e.id == b) return !0
                }
                return !1
            },
            P = function () {
                for (var a in I) {
                    var b = I[a],
                        c = p(b.appId);
                    c && (Q == 1 ? c.jumpUp(b.id) : c.jumpDown(b.id))
                }
                Q = -Q
            },
            E = function (a) {
                var b = p(a.appId);
                b && b.jumpUp(a.id)
            },
            L = function (a) {
                var b = p(a.appId);
                b && b.jumpDown(a.id)
            };
            this.getAppIcon = function (a) {
                var b = a.id;
                if (alloy.appconfig.isQplusApp(b) && a.icon) return a.icon;
                var a = a.iconUrl || "",
                    c = alloy.util.getAppRoot(b) + "images/",
                    e = alloy.CONST.PRI_APP_STATIC_URL;
                if (b == "appMarket") return b = alloy.CONST.CDN_URL_0 + "/style/images/appbar_manage.png";
                else if (b == "docViewer") return b = alloy.CONST.CDN_URL_0 + "/style/images/docviewer.png";
                else if (b == "imgViewer") return b = alloy.CONST.CDN_URL_0 + "/style/images/imgviewer.png";
                else if (b == "messageCenter") return b = alloy.CONST.CDN_URL_0 + "/style/images/messagecenter.png";
                if (a && a.smallIcon && a.smallIcon.indexOf("priapps") > -1) e = alloy.CONST.PRI_APP_STATIC_URL2;
                var d = a.type || a;
                return b = (d & 10) > 0 ? b > 99999 ? e + a.midIcon : c + "mid.png" : (d & 1) > 0 ? b > 99999 ? e + a.smallIcon : c + "small.png" : alloy.CONST.CDN_URL + "module/appmarket/images/mid.png"
            };
            var V = function (b) {
                if (a.isUndefined(EQQ) || a.isUndefined(EQQ.hash.onlineStatus[b.state])) return !1;
                var c = M({
                    appId: s.appId,
                    id: b.id
                }),
                    c = p(c.appId);
                a.isUndefined(c) || (c = c.getItem(b.id), a.isUndefined(c) || c.getDom().setAttribute("class", "taskItem taskItem_" + EQQ.hash.onlineStatus[b.state]))
            }, T = function (b) {
                var c = M({
                    appId: 50,
                    id: 50
                }),
                    e = p(c.appId);
                a.isUndefined(e) || (c = e.getItem(c.id), a.isUndefined(c) || c.getDom().setAttribute("class", "taskItem taskItem_" + b.state))
            }, S = {
                _default: [{
                    text: "\u6700\u5927\u5316",
                    onClick: function (a, b, c) {
                        a = c.getArgument();
                        (a = D(a.appId,
                        a.id)) && a.winMax()
                    }
                }, {
                    text: "\u6700\u5c0f\u5316",
                    onClick: function (a, b, c) {
                        a = c.getArgument();
                        (a = D(a.appId, a.id)) && a.winMin()
                    }
                }, {
                    type: "separator"
                }, {
                    text: "\u5173\u95ed",
                    onClick: function (a, b, c) {
                        a = c.getArgument();
                        (a = D(a.appId, a.id)) && a.close()
                    }
                }],
                _defaultNoMax: [{
                    text: "\u6700\u5c0f\u5316",
                    onClick: function (a, b, c) {
                        a = c.getArgument();
                        (a = D(a.appId, a.id)) && a.winMin()
                    }
                }, {
                    type: "separator"
                }, {
                    text: "\u5173\u95ed",
                    onClick: function (a, b, c) {
                        a = c.getArgument();
                        (a = D(a.appId, a.id)) && a.close()
                    }
                }],
                _defaultGroup: [{
                    text: "\u6700\u5c0f\u5316\u7ec4",
                    onClick: function (a, b, e) {
                        a = e.getArgument();
                        c.getTask(a.appId).winMin()
                    }
                }, {
                    type: "separator"
                }, {
                    text: "\u5173\u95ed\u7ec4",
                    onClick: function (a, b, e) {
                        a = e.getArgument();
                        a = c.getTask(a.appId);
                        r = !0;
                        a.close();
                        r = !1;
                        q.resize()
                    }
                }]
            }, U = function (b, c) {
                if (a.isUndefined(b)) return !1;
                var e = b,
                    d = [];
                if (a.isUndefined(c)) d = S[e], a.isUndefined(d) && (d = S._defaultGroup);
                else if (e += "_" + c, d = S[e], e.indexOf("50_") > -1 && alloy.portal.getLoginLevel() == alloy.CONST.LOGIN_LEVEL_ALL && (d = !1), a.isUndefined(d)) {
                    e = D(b, c);
                    d = !0;
                    try {
                        d = e.getWin().option.hasMaxButton
                    } catch (f) {}
                    d = d ? S._default : S._defaultNoMax
                }
                return !d ? !1 : d
            }, Z = function () {
                q.setDockMargin();
                q.resize()
            }
        });
Jx().$package("alloy.rpcService", function (a) {
    var c = this,
        b = a.dom,
        d = a.event,
        g, k, l = 0,
        o, t = new a.Class({
            init: function (a) {
                this._ajaxRequestInstant = a
            },
            send: function (b, c) {
                c = c || {};
                c.cacheTime = c.cacheTime || 0;
                c.onSuccess = c.onSuccess || function () {};
                c.onError = c.onError || function () {};
                c.onTimeout = c.onTimeout || function () {};
                c.onComplete = c.onComplete || function () {};
                var d = {
                    iframeName: c.iframeName,
                    method: c.method || "GET",
                    contentType: c.contentType || "",
                    enctype: c.enctype || "",
                    data: c.data || {},
                    param: c.param || {},
                    arguments: c.arguments || {},
                    context: c.context || null,
                    timeout: c.timeout || 3E4,
                    onSuccess: function (b) {
                        var b = b.responseText || "-",
                            e = {};
                        try {
                            e = a.json.parse(b)
                        } catch (d) {
                            a.error("alloy.rpcservice: JSON \u683c\u5f0f\u51fa\u9519", "HttpRequest")
                        }
                        e.arguments = c.arguments || {};
                        c.onSuccess.call(c.context, e)
                    },
                    onError: function (a) {
                        c.onError.call(c.context, a)
                    },
                    onTimeout: function () {
                        var a = {};
                        a.arguments = c.arguments || {};
                        c.onTimeout.call(c.context, a)
                    },
                    onComplete: function () {
                        var a = {};
                        a.arguments = c.arguments || {};
                        c.onComplete.call(c.context, a)
                    }
                };
                alloy.portal.recoverCookie();
                d.data = a.string.toQueryString(d.data);
                if (d.method == "GET") {
                    var f = d.data;
                    c.cacheTime === 0 && (f += f ? "&t=" + (new Date).getTime() : "t=" + (new Date).getTime());
                    f && (b = b + "?" + f);
                    d.data = null
                } else d.contentType = "application/x-www-form-urlencoded", b.indexOf("?");
                this._ajaxRequestInstant(b, d)
            }
        }),
        r = new a.Class({
            init: function (e, d) {
                var f = "qqweb_proxySendIframe_" + e,
                    g = this,
                    h;
                this.iframeName = f;
                this._ajaxCallbacks = [];
                this._proxyAjaxSend = this._proxySend = null;
                d += (/\?/.test(d) ? "&" : "?") + "id=" + e;
                a.out("ProxyRequest >>>>> init: " + d, "ProxyRequest");
                var k = function () {
                    var b = window.frames[f];
                    a.out("ProxyRequest >>>>> load: " + b.location.href, "ProxyRequest");
                    try {
                        if (b.ajax) {
                            g._proxyAjaxSend = b.ajax;
                            for (var c = g._ajaxCallbacks, b = 0, e = c.length; b < e; b++) g.proxySend(c[b].url, c[b].option);
                            g._ajaxCallbacks = []
                        } else a.warn("ProxyRequest >>>>> ajaxProxy error: ajax is undefined!!!!", "ProxyRequest"), alloy.util.report2h("proxyrequest_error", "start")
                    } catch (d) {
                        a.error("ProxyRequest >>>>> ajaxProxy error: " + d.message + " !!!!", "ProxyRequest"), alloy.util.report2h("proxyrequest_error2", "start")
                    }
                };
                h = document.body;
                var l = b.node("div", {
                    "class": "hiddenIframe"
                });
                l.innerHTML = '<iframe id="' + f + '" class="hiddenIframe" name="' + f + '" src="' + d + '" width="1" height="1"></iframe>';
                h.appendChild(l);
                h = b.id(f);
                this.id = e;
                this.onAjaxFrameLoad = k;
                c.onAjaxFrameLoad2 = k;
                a.browser.firefox && h.setAttribute("src", d)
            },
            send: function (a, b) {
                this._proxyAjaxSend ? (this.proxySend(a, b), this.send = this.proxySend) : this._ajaxCallbacks.push({
                    url: a,
                    option: b
                })
            },
            proxySend: function (a, b) {
                if (!this._proxySend) this._proxySend = new t(this._proxyAjaxSend);
                b.iframeName = this.iframeName;
                this._proxySend.send(a, b)
            }
        }),
        u = new a.Class({
            init: function (c, f) {
                var g = "qqweb_proxySendIframe" + c;
                this.iframeName = g;
                var h = this;
                this._ajaxCallbacks = [];
                this._proxyAjaxSend = this._proxySend = null;
                a.out("ProxyRequest >>>>> init: " + f, "ProxyRequest");
                var k = document.body,
                    l = b.node("div", {
                        "class": "hiddenIframe"
                    });
                l.innerHTML = '<iframe id="' + g + '" class="hiddenIframe" name="' + g + '" src="' + f + '" width="1" height="1"></iframe>';
                k.appendChild(l);
                proxyIframe = b.id(g);
                d.on(proxyIframe, "load",

                function () {
                    h._proxyAjaxSend = h.cfProxySend;
                    for (var a = h._ajaxCallbacks, b = 0, c = a.length; b < c; b++) h.proxySend(a[b].url, a[b].option);
                    h._ajaxCallbacks = []
                });
                proxyIframe.setAttribute("src", f)
            },
            send: function (a, b) {
                this._proxyAjaxSend ? (this.proxySend(a, b), this.send = this.proxySend) : this._ajaxCallbacks.push({
                    url: a,
                    option: b
                })
            },
            proxySend: function (a, b) {
                if (!this._proxySend) this._proxySend = new t(this._proxyAjaxSend);
                b.iframeName = this.iframeName;
                this._proxySend.send(a, b)
            },
            cfProxySend: function (c, d) {
                var g = m++;
                f[g] = d;
                c = c.replace("http://", "https://");
                g = a.json.stringify({
                    id: g,
                    option: {
                        method: d.method || "GET",
                        data: d.data || null,
                        isAsync: d.isAsync || !0,
                        timeout: d.timeout,
                        contentType: d.contentType || "",
                        type: d.type,
                        uri: c
                    },
                    uri: c,
                    iframeName: d.iframeName,
                    host: alloy.CONST.MAIN_URL,
                    timestamp: +new Date
                });
                RegExp(/(^http(s)?:\/\/[\w\.]+)\//).test(c);
                var h = RegExp.$1;
                if (!a.isUndefined(window.postMessage) && !a.browser.ie) window.frames[d.iframeName].postMessage(g, h);
                else {
                    var k = b.node("div");
                    k.innerHTML = '<iframe class="hiddenCFProxy" name="' + encodeURIComponent(g) + '" src="' + (h + "/app.rpc.proxy.html") + '" onload="alloy.rpcService.removeCF(this)"></iframe>';
                    document.body.appendChild(k)
                }
            }
        });
    this.rpcProxyCallback = function (b) {
        var b = a.json.parse(decodeURIComponent(b)),
            c = b.type,
            d = b.id,
            g = f[d];
        delete f[d];
        if (g) g[c](b.option)
    };
    var v = function (a) {
        c.rpcProxyCallback(encodeURIComponent(a.data))
    };
    if (!a.isUndefined(window.postMessage)) window.addEventListener ? window.addEventListener("message", v, !1) : window.attachEvent ? window.attachEvent("onmessage", v) : window.onmessage = v;
    this.removeCF = function (a) {
        a && window.setTimeout(function () {
            var b = a.parentNode;
            b.parentNode.removeChild(b)
        }, 1E3)
    };
    var s = new a.Class({
        init: function () {
            this._proxyArr = {};
            this._cFproxyArr = {};
            this._proxyId = 1
        },
        getProxyId: function () {
            return this._proxyId++
        },
        getProxy: function (a) {
            var b = this._proxyArr[a];
            b || (b = new r(this.getProxyId(), a), this._proxyArr[a] = b);
            return b
        },
        getProxyById: function (a) {
            for (var b in this._proxyArr) if (this._proxyArr[b].id == a) return this._proxyArr[b];
            return null
        },
        getCfProxy: function (a) {
            var a = a.replace("proxy.html", "cfproxy.html").replace("http://", "https://"),
                b = this._cFproxyArr[a];
            b || (b = new u(this.getProxyId(), a), this._cFproxyArr[a] = b);
            return b
        }
    }),
        m = 0,
        f = {};
    this.selfSend = function (b, c) {
        g || (g = new t(a.http.ajax));
        g.send(b, c)
    };
    this.proxySend = function (a, b, c, d) {
        k || (k = new s);
        c = c || alloy.CONST.API_PROXY_URL;
        c += (/\?/.test(c) ? "&" : "?") + "callback=1";
        (d ? k.getCfProxy(c) : k.getProxy(c)).send(a, b)
    };
    this.sSend = this.send = function (a, b, d) {
        d = d || alloy.CONST.API_PROXY_URL;
        c.proxySend(a, b, d)
    };
    this.cgiSend = function (a,
    b, d) {
        d = d || alloy.CONST.JAVA_CGI_PROXY_URL;
        c.proxySend(a, b, d)
    };
    this.eqqSend = function (a, b, d, f) {
        d = d || alloy.CONST.JAVA_CGI_PROXY_URL;
        c.proxySend(a, b, d, f)
    };
    this.psSend = function (a, b, d) {
        d = d || alloy.CONST.PS_PROXY_URL;
        c.proxySend(a, b, d)
    };
    this.upSend = function (a, b, d) {
        d = d || alloy.CONST.JAVA_UP_CGI_PROXY_URL;
        c.proxySend(a, b, d)
    };
    this.onAjaxFrameLoad = function (b) {
        if (a.isUndefined(b)) this.onAjaxFrameLoad2();
        else(b = k.getProxyById(b)) && b.onAjaxFrameLoad()
    };
    var h = {
        _iframes: [],
        _tick: 0,
        _select: function () {
            this._tick++;
            return this._iframes[(this._tick - 1) % this._len]
        },
        init: function (a) {
            if (this._isInit != !0) {
                this._len = a;
                for (var c = document.body, d, f = 0; f < a; f++) d = b.node("div", {
                    "class": "RPCService_hDiv"
                }), b.hide(d), d.innerHTML = '<iframe id="RPCService_hIframe_' + f + '" name="RPCService_hIframe_' + f + '" src="' + alloy.CONST.MAIN_URL + 'domain.html"></iframe>', c.appendChild(d), this._iframes[f] = [d, null, "RPCService_hIframe_" + f];
                this._isInit = !0
            }
        },
        take: function (a) {
            var b = this._select();
            b[1] && b[0].removeChild(b[1]);
            a.setAttribute("target", b[2]);
            b[1] = a;
            b[0].appendChild(a)
        }
    };
    this.formSend = function (a, c) {
        h.init(2);
        var d = {
            method: c.method || "GET",
            enctype: c.enctype || "",
            data: c.data || {},
            onSuccess: c.onSuccess || function () {},
            onError: c.onError || function () {},
            onComplete: c.onComplete || function () {},
            onTimeout: c.onTimeout || function () {},
            timeout: c.timeout ? c.timeout : 1E4
        }, f = b.node("form", {
            "class": "RPCService_form",
            method: d.method,
            action: a + "?t=" + (new Date).getTime(),
            enctype: d.enctype
        });
        if (Object.prototype.toString.call(d.data).indexOf("String") > -1) {
            var g = b.node("input");
            g.type = "text";
            g.name = d.data;
            f.appendChild(g)
        } else for (var k in d.data) g = b.node("input"), g.type = "text", g.name = k, g.setAttribute("value", d.data[k]), f.appendChild(g);
        h.take(f);
        f.submit()
    };
    this.sendGetVfWebQQ = function (b, c, f) {
        alloy.portal.getTryUin() && alloy.portal.getSkey() ? (alloy.portal.speedTest.sRTS(1, "start", new Date), this.send(alloy.CONST.API_SERVER_URL + "get_vfwebqq2", {
            context: this,
            data: {},
            arguments: {
                uin: b
            },
            onSuccess: c || function (b) {
                b.retcode === 0 && b.result && b.result.length === 2 && b.result[0] == "vfwebqq" ? (a.out(":GetVfWebQQSuccess..."),
                d.notifyObservers(this, "GetVfWebQQSuccess", b)) : (a.out("[sendGetVfWebQQ\uff1a\u6570\u636e\u683c\u5f0f\u9519\u8bef] error: " + b.retcode + "-" + b.errmsg), d.notifyObservers(this, "GetVfWebQQError", b));
                alloy.portal.speedTest.sRTS(1, "end", new Date, !0);
                alloy.portal.speedTest.sRTS(4, "start", new Date);
                alloy.portal.speedTest.sRTS(5, "start", new Date)
            },
            onError: f || function (b) {
                a.out("\u83b7\u53d6\u4e00\u4e2a\u4eba\u7684\u767b\u5f55\u4fe1\u606f\u5931\u8d25");
                d.notifyObservers(this, "GetVfWebQQError", b);
                alloy.portal.speedTest.sRTS(1, "end", new Date, !0)
            }
        })) : d.notifyObservers(this, "GetVfWebQQError", {})
    };
    this.sendGetSeftInfo = function (b, c, f) {
        alloy.portal.getTryUin() && alloy.portal.getSkey() ? (alloy.portal.speedTest.sRTS(1, "start", new Date), this.send(alloy.CONST.API_SERVER_URL + "get_self_info2", {
            context: this,
            data: {},
            arguments: {
                uin: b
            },
            timeout: 2E4,
            onSuccess: c || function (b) {
                b.retcode === 0 && b.result ? (alloy.util.report2qqweb("config|vfwebqq|success"), a.out(":GetVfWebQQSuccess..."), d.notifyObservers(this, "GetVfWebQQSuccess", b), d.notifyObservers(this, "GetUserInfoSuccess", b)) : (a.out("[sendGetVfWebQQ\uff1a\u6570\u636e\u683c\u5f0f\u9519\u8bef] error: " + b.retcode + "-" + b.errmsg), d.notifyObservers(this, "GetVfWebQQError", b));
                alloy.portal.speedTest.sRTS(1, "end", new Date, !0);
                alloy.portal.speedTest.sRTS(4, "start", new Date);
                alloy.portal.speedTest.sRTS(5, "start", new Date)
            },
            onError: f || function (b) {
                a.out("\u83b7\u53d6\u4e00\u4e2a\u4eba\u7684\u767b\u5f55\u4fe1\u606f\u5931\u8d25");
                alloy.util.report2qqweb("config|vfwebqq|error");
                timeoutConfirm("\u83b7\u53d6\u4e2a\u4eba\u767b\u5f55\u4fe1\u606f\u5931\u8d25,\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f(\u70b9\u51fb\u53d6\u6d88\u5c06\u4ee5\u6e38\u5ba2\u6001\u767b\u5f55)") || d.notifyObservers(this, "GetVfWebQQError", b);
                alloy.portal.speedTest.sRTS(1, "end", new Date, !0)
            },
            onTimeout: function () {
                alloy.util.report2qqweb("config|vfwebqq|timeout");
                timeoutConfirm("\u83b7\u53d6\u4e2a\u4eba\u767b\u5f55\u4fe1\u606f\u8d85\u65f6,\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f(\u70b9\u51fb\u53d6\u6d88\u5c06\u4ee5\u6e38\u5ba2\u6001\u767b\u5f55)") || d.notifyObservers(this, "GetVfWebQQError");
                alloy.util.report2h("get_vfwebqq", "timeout")
            }
        })) : d.notifyObservers(this, "GetVfWebQQError", {})
    };
    var n, p = function (c, f) {
        n = alloy.layout.messagebox('<div style="width:100%; height:100%; line-height:30px;">\t\t\t\t\t\t<div style ="text-align: left; padding-left: 10px;">\t\t\t\t\t\t\t<div>\u4e3a\u4e86\u60a8\u7684\u8d26\u53f7\u5b89\u5168\uff0c\u8bf7\u6267\u884c\u8eab\u4efd\u9a8c\u8bc1\uff0c\u5728\u8f93\u5165\u6846\u8f93\u5165\u4e0b\u56fe\u4e2d\u7684\u9a8c\u8bc1\u7801</div>\t\t\t\t\t\t\t<div>\u9a8c\u8bc1\u7801:&nbsp&nbsp<input id="verify_input_code" type="text" style="vertical-align:middle;" />&nbsp;&nbsp;<span id="buddyfinder_code_gf" style="color:red"></span></div>\t\t\t\t\t\t\t<img style="float:left;margin-right:10px" id="verify_img_code" src="" />\t\t\t\t\t\t\t<a style="display:inline;line-height:60px;" id="verify_a_code" alt="\u770b\u4e0d\u6e05\u6362\u4e00\u5f20" href="">\u770b\u4e0d\u6e05\u6362\u4e00\u5f20</a>\t\t\t\t\t\t\t<div id="verify_img_code_wrong" style="display:none;color:red;width:65px;">\u9a8c\u8bc1\u7801\u9519\u8bef</div>\t\t\t\t\t\t</div>\t\t\t\t\t</div>', {
            title: "\u8eab\u4efd\u9a8c\u8bc1",
            resize: !0,
            width: 380,
            height: 123,
            hasOkButton: !0,
            windowType: "EqqWindow",
            isSetCentered: !0
        });
        var g = b.id("verify_img_code"),
            h = b.id("verify_a_code"),
            k = b.id("verify_input_code"),
            l = null;
        d.on(g, "load", function () {
            l = a.cookie.get("verifysession", alloy.CONST.MAIN_DOMAIN)
        });
        d.on(h, "click", function (a) {
            a.preventDefault();
            b.id("verify_img_code").src = "http://captcha.qq.com/getimage?aid=1003901&" + Math.random()
        });
        d.addObserver(n, "clickOkButton", function () {
            var a = k.value;
            if (a && l) return f(c,
            a, l), !1;
            k.focus();
            b.id("verify_input_code").innerHTML = "\u8bf7\u5148\u8f93\u5165\u9a8c\u8bc1\u7801\uff01";
            return !1
        });
        k.focus();
        d.on(k, "keydown", function (a) {
            a.keyCode == 13 && d.notifyObservers(n, "clickOkButton") && setTimeout(function () {
                n.close()
            }, 0)
        });
        b.id("verify_img_code").src = "http://captcha.qq.com/getimage?aid=1003901&" + Math.random()
    };
    this.sendGetUserInfo = function (a, f, g, h) {
        this.send(alloy.CONST.API_SERVER_URL + "get_friend_info2", {
            context: this,
            data: {
                tuin: a,
                verifysession: g || "",
                code: f || "",
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: {
                uin: a
            },
            onSuccess: function (f) {
                f.retcode === 0 ? (setTimeout(function () {
                    try {
                        n && n.close()
                    } catch (a) {}
                }, 0), h ? h.call(this, f) : d.notifyObservers(this, "GetUserInfoSuccess", f)) : f.retcode === 1E3 ? p(a, function (a, b, e) {
                    c.sendGetUserInfo(a, b, e, h)
                }) : f.retcode === 1001 ? (b.id("verify_img_code_wrong").style.display = "inline", b.id("verify_img_code").src = "http://captcha.qq.com/getimage?aid=1003901&" + Math.random(), b.id("verify_input_code").value = "", b.id("verify_input_code").focus()) : (setTimeout(function () {
                    try {
                        n && n.close()
                    } catch (a) {}
                },
                0), d.notifyObservers(this, "GetUserInfoError", f))
            },
            onError: function (a) {
                d.notifyObservers(this, "GetUserInfoError", a)
            }
        })
    };
    this.sendGetSingleInfo = function (a, f, g, h) {
        !f || !g ? p(a, function (a, b, e) {
            c.sendGetSingleInfo(a, b, e, h)
        }) : this.send(alloy.CONST.API_SERVER_URL + "get_single_info2", {
            context: this,
            data: {
                tuin: a,
                verifysession: g || "",
                code: f || "",
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: {
                uin: a
            },
            onSuccess: function (f) {
                f.retcode === 0 ? (f.result.uin = f.result.tuin, setTimeout(function () {
                    try {
                        n && n.close()
                    } catch (a) {}
                }, 0),
                h ? h.call(this, f) : d.notifyObservers(this, "GetUserInfoSuccess", f)) : f.retcode === 1E3 ? p(a, function (a, b, e) {
                    c.sendGetSingleInfo(a, b, e, h)
                }) : f.retcode === 1001 ? (b.id("verify_img_code_wrong").style.display = "inline", b.id("verify_img_code").src = "http://captcha.qq.com/getimage?aid=1003901&" + Math.random(), b.id("verify_input_code").value = "", b.id("verify_input_code").focus()) : (setTimeout(function () {
                    try {
                        n && n.close()
                    } catch (a) {}
                }, 0), d.notifyObservers(this, "GetUserInfoError", f))
            },
            onError: function (a) {
                d.notifyObservers(this, "GetUserInfoError", a)
            }
        })
    };
    this.sendGetUserInfo_with_code = function (e, f, g, h, k) {
        f = f || "";
        this.send(alloy.CONST.API_SERVER_URL + "get_stranger_info2", {
            context: this,
            data: {
                tuin: e,
                verifysession: g || "",
                gid: 0,
                code: f,
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: {
                uin: e,
                code: f
            },
            onSuccess: h || function (a) {
                a.retcode === 0 ? (setTimeout(function () {
                    try {
                        n && n.close()
                    } catch (a) {}
                }, 0), h && h.call(this, a), d.notifyObservers(this, "GetUserInfoSuccess", a)) : a.retcode === 1E3 ? p(e, function (a, b, e) {
                    c.sendGetUserInfo_with_code(a, b, e)
                }) : a.retcode === 1001 ? (b.id("verify_img_code_wrong").style.display = "inline", b.id("verify_img_code").src = "http://captcha.qq.com/getimage?aid=1003901&" + Math.random(), b.id("verify_input_code").value = "", b.id("verify_input_code").focus()) : (setTimeout(function () {
                    try {
                        n && n.close()
                    } catch (a) {}
                }, 0), d.notifyObservers(this, "GetUserInfoError", a))
            },
            onError: k || function (b) {
                a.out("\u83b7\u53d6\u4e00\u4e2a\u4eba\u7684\u4fe1\u606f\u5931\u8d25");
                d.notifyObservers(this, "GetUserInfoError", b)
            }
        })
    };
    this.sendGetFriendUin2 = function (e, f, g, h,
    k, l) {
        this.send(alloy.CONST.API_SERVER_URL + "get_friend_uin2", {
            context: this,
            data: {
                tuin: e,
                verifysession: k || "",
                type: f,
                code: h || "",
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: {
                uin: e
            },
            onSuccess: function (a) {
                a.retcode === 0 ? (l || setTimeout(function () {
                    try {
                        n && n.close()
                    } catch (a) {}
                }, 0), g && g(a), d.notifyObservers(this, "GetFriendUinSuccess", a)) : a.retcode === 1E3 ? p(e, function (a, b, e) {
                    c.sendGetFriendUin2(a, f, g, b, e)
                }) : a.retcode === 1001 ? (b.id("verify_img_code_wrong").style.display = "inline", b.id("verify_img_code").src = "http://captcha.qq.com/getimage?aid=1003901&" + Math.random(), b.id("verify_input_code").value = "", b.id("verify_input_code").focus()) : (setTimeout(function () {
                    try {
                        n && n.close()
                    } catch (a) {}
                }, 0), d.notifyObservers(this, "GetFriendUinError", a))
            },
            onError: function (b) {
                a.out("\u83b7\u53d6\u4e00\u4e2a\u4eba\u7684uin\u5931\u8d25");
                d.notifyObservers(this, "GetFriendUinError", b)
            }
        })
    };
    this.sendModifyMyDetails = function (b) {
        b.vfwebqq = alloy.portal.getVfWebQQ();
        this.send(alloy.CONST.API_SERVER_URL + "modify_my_details2", {
            context: this,
            method: "POST",
            data: {
                r: a.json.stringify(b)
            },
            arguments: {},
            onSuccess: function (b) {
                b.retcode === 0 ? (a.out(":ModifyMyDetailsSuccess..."), d.notifyObservers(this, "ModifyMyDetailsSuccess", b)) : (a.out("[sendModifyMyDetails\uff1a\u6570\u636e\u683c\u5f0f\u9519\u8bef] error: " + b.retcode + "-" + b.errmsg), d.notifyObservers(this, "ModifyMyDetailsError", b))
            },
            onError: function (b) {
                a.out("\u4fee\u6539\u81ea\u5df1\u7684\u7684\u8be6\u7ec6\u8d44\u6599\u5931\u8d25");
                d.notifyObservers(this, "ModifyMyDetailsError", b)
            }
        })
    };
    this.sendModifyMyAvatar = function (b) {
        b.vfwebqq = alloy.portal.getVfWebQQ();
        this.send(alloy.CONST.API_SERVER_URL + "modify_my_head", {
            context: this,
            method: "POST",
            data: {
                r: a.json.stringify(b)
            },
            arguments: {},
            onSuccess: function (a) {
                a.retcode === 0 ? d.notifyObservers(this, "ModifyMyAvatarSuccess", a) : d.notifyObservers(this, "ModifyMyAvatarError", a)
            },
            onError: function (a) {
                d.notifyObservers(this, "ModifyMyAvatarError", a)
            }
        })
    };
    this.sendGetGroupInfoByGid = function (b) {
        this.send(alloy.CONST.API_SERVER_URL + "get_group_info_ext2", {
            context: this,
            data: {
                gcode: b,
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: {
                gcode: b
            },
            onSuccess: function (b) {
                b.retcode === 0 ? (a.out(":GetUserInfoSuccess..."), d.notifyObservers(this, "GetGroupInfoByGidSuccess", b)) : (a.out("[sendGetUserInfo\uff1a\u6570\u636e\u683c\u5f0f\u9519\u8bef] error: " + b.retcode + "-" + b.errmsg), d.notifyObservers(this, "GetGroupInfoByGidError", b))
            },
            onError: function (b) {
                a.out("\u83b7\u53d6\u7fa4\u7684\u4fe1\u606f\u5931\u8d25");
                d.notifyObservers(this, "GetUserInfoError", b)
            }
        })
    };
    this.sendGetGroupPublicInfo = function (b, c, f, g) {
        this.send(alloy.CONST.API_SERVER_URL + "get_group_public_info2", {
            context: this,
            data: {
                gcode: b,
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: c || {
                gcode: b
            },
            onSuccess: f || function (b) {
                b.retcode === 0 ? (a.out(":GetGroupPublicInfoSuccess..."), d.notifyObservers(this, "GetGroupPublicInfoSuccess", b)) : (a.out("[GetGroupPublicInfoError\uff1a\u6570\u636e\u683c\u5f0f\u9519\u8bef] error: " + b.retcode + "-" + b.errmsg), d.notifyObservers(this, "GetGroupPublicInfoError", b))
            },
            onError: g || function (b) {
                a.out("\u83b7\u53d6\u7fa4\u7684\u516c\u5171\u4fe1\u606f\u5931\u8d25");
                d.notifyObservers(this, "GetGroupPublicInfoError",
                b)
            }
        })
    };
    this.sendGetGCardInfo = function (b) {
        this.send(alloy.CONST.API_SERVER_URL + "get_self_business_card2", {
            context: this,
            data: {
                gcode: b,
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: {
                gcode: b
            },
            onSuccess: function (b) {
                b.retcode === 0 ? (a.out(":GetGCardInfoSuccess..."), d.notifyObservers(this, "GetGCardInfoSuccess", b)) : (a.out("[sendGetUserInfo\uff1a\u6570\u636e\u683c\u5f0f\u9519\u8bef] error: " + b.retcode + "-" + b.errmsg), d.notifyObservers(this, "GetGCardInfoError", b))
            },
            onError: function (b) {
                a.out("\u83b7\u53d6\u7fa4\u7684\u4fe1\u606f\u5931\u8d25");
                d.notifyObservers(this, "GetGCardInfoError", b)
            }
        })
    };
    this.sendGetBuddyList = function (b, c, f) {
        b = b || {};
        b.vfwebqq = alloy.portal.getVfWebQQ();
        alloy.portal.speedTest.sRTS(3, "start", new Date);
        this.send(alloy.CONST.API_SERVER_URL + "get_user_friends2", {
            context: this,
            arguments: b,
            method: "POST",
            data: {
                r: a.json.stringify(b)
            },
            onSuccess: c || function (b) {
                if (b.retcode === 0) {
                    for (var c = b.result.categories || [], e = !1, f = 0; f < c.length; f++) c[f].index == 0 && (e = !0);
                    e || c.unshift({
                        index: 0,
                        name: "\u6211\u7684\u597d\u53cb"
                    });
                    a.out(":GetBuddyListSuccess...1");
                    d.notifyObservers(this, "GetBuddyListSuccess", b.result);
                    a.out(":GetBuddyListSuccess...2")
                } else a.out("[sendGetBuddyList] error: " + b.retcode + "-" + b.errmsg), d.notifyObservers(this, "GetBuddyListError", b), a.out("[sendGetBuddyList] error: end")
            },
            onError: f || function (b) {
                a.out("\u597d\u53cb\u5217\u8868\u5931\u8d25");
                d.notifyObservers(this, "GetBuddyListError", b)
            }
        })
    };
    this.sendBatchGetVipInfo = function (b, c, f, g) {
        param = {};
        param.ul = a.json.stringify(b);
        param.vfwebqq = alloy.portal.getVfWebQQ();
        this.send(alloy.CONST.API_SERVER_URL + "batch_get_vipinfo", {
            context: this,
            arguments: c || param,
            method: "POST",
            data: param,
            onSuccess: f || function (b) {
                b.retcode === 0 ? d.notifyObservers(this, "BatchGetVipInfoSuccess", b.result) : (a.out("\u6279\u91cf\u62c9\u53d6\u4f1a\u5458\u4fe1\u606f\u5931\u8d25"), d.notifyObservers(this, "BatchGetVipInfoError", b))
            },
            onError: g || function (b) {
                a.out("\u6279\u91cf\u62c9\u53d6\u4f1a\u5458\u4fe1\u606f\u51fa\u9519");
                d.notifyObservers(this, "BatchGetVipInfoError", b)
            }
        })
    };
    this.sendGetGroupList = function (b, c, f) {
        b = b || {};
        b.vfwebqq = alloy.portal.getVfWebQQ();
        this.send(alloy.CONST.API_SERVER_URL + "get_group_name_list_mask2", {
            context: this,
            arguments: b,
            method: "POST",
            data: {
                r: a.json.stringify(b)
            },
            onSuccess: c || function (b) {
                b.retcode === 0 ? (d.notifyObservers(this, "GetGroupListSuccess", b.result), a.out(":GetGroupListSuccess...")) : (a.out("[sendGetGroupList] error: " + b.retcode + "-" + b.errmsg), d.notifyObservers(this, "GetGroupListError", b))
            },
            onError: f || function (b) {
                a.out("\u7fa4\u5217\u8868\u5931\u8d25");
                d.notifyObservers(this, "GetGroupListError", b)
            }
        })
    };
    this.sendGetRecentList = function (b, c, f) {
        b = b || {};
        b.vfwebqq = alloy.portal.getVfWebQQ();
        this.send(alloy.CONST.API_SERVER_URL + "get_recent_contact2", {
            context: this,
            method: "POST",
            data: {
                r: a.json.stringify(b)
            },
            onSuccess: c || function (b) {
                b.retcode === 0 ? (d.notifyObservers(this, "GetRecentListSuccess", b.result), a.out(":GetRecentListSuccess...")) : (a.out("[sendGetRecentList] error: " + b.retcode + "-" + b.errmsg), d.notifyObservers(this, "GetRecentListError", b))
            },
            onError: f || function (b) {
                a.out("\u6700\u8fd1\u8054\u7cfb\u4eba\u5217\u8868\u5931\u8d25");
                d.notifyObservers(this, "GetRecentListError", b)
            }
        })
    };
    this.sendChangeGroupMask = function () {};
    this.sendGetGroupInfo = function (b, c, f) {
        b = b || {};
        b.vfwebqq = alloy.portal.getVfWebQQ();
        this.send(alloy.CONST.API_SERVER_URL + "get_group_info_ext2", {
            context: this,
            data: b,
            arguments: b,
            onSuccess: c || function (b) {
                b.retcode === 0 ? (a.out(":GetGroupInfoSuccess 1..."), d.notifyObservers(this, "GetGroupInfoSuccess", b.result), a.out(":GetGroupInfoSuccess 2...")) : (a.out("[sendGetGroupInfo] error: " + b.retcode + "-" + b.errmsg), d.notifyObservers(this, "GetGroupInfoError", b))
            },
            onError: f || function (b) {
                a.out("\u7fa4\u8d44\u6599\u5931\u8d25");
                d.notifyObservers(this, "GetGroupInfoError", b)
            }
        })
    };
    this.sendGetQQAllow = function (a, b) {
        this.send(alloy.CONST.API_SERVER_URL + "get_allow_info2", {
            context: this,
            method: "GET",
            data: {
                tuin: a,
                retainKey: "allow",
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: {
                uin: a
            },
            onSuccess: b || function () {},
            onError: function () {}
        })
    };
    this.sendGetQQLevel = function (b) {
        this.send(alloy.CONST.API_SERVER_URL + "get_qq_level2", {
            context: this,
            method: "GET",
            data: {
                tuin: b,
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: {
                uin: b
            },
            onSuccess: function (b) {
                b.retcode === 0 ? (a.out(":GetQQLevelSuccess 1..."), d.notifyObservers(c, "GetQQLevelSuccess", b), a.out(":GetQQLevelSuccess 2...")) : (a.out("[sendGetQQLevel] error: " + b.retcode + "-" + b.errmsg), d.notifyObservers(c, "GetQQLevelError", b))
            },
            onError: function (b) {
                a.out("QQ\u7b49\u7ea7\u62c9\u53bb\u5931\u8d25");
                d.notifyObservers(c, "GetQQLevelError", b)
            }
        })
    };
    this.sendSetSignature = function (b) {
        alloy.rpcService.send(alloy.CONST.API_SERVER_URL + "set_long_nick2", {
            context: c,
            method: "POST",
            data: {
                r: a.json.stringify({
                    nlk: b,
                    vfwebqq: alloy.portal.getVfWebQQ()
                })
            },
            arguments: {
                nlk: b
            },
            onSuccess: function (f) {
                f.retcode === 0 ? d.notifyObservers(c, "SetBuddySignatureSuccess", b) : (d.notifyObservers(c, "SetBuddySignatureError", b), a.error("[sendSetSelfSignature] error: " + f.retcode + "-" + f.errmsg))
            }
        })
    };
    this.sendGetSignature = function (b) {
        this.send(alloy.CONST.API_SERVER_URL + "get_single_long_nick2", {
            context: this,
            method: "GET",
            data: {
                tuin: b,
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: {
                uin: b
            },
            onSuccess: function (b) {
                b.retcode === 0 ? d.notifyObservers(c, "GetBuddySignatureSuccess", b) : a.out("[sendGetSignature] error: " + b.retcode + "-" + b.errmsg)
            },
            onError: function () {
                a.out(" sendGetSignatureError")
            }
        })
    };
    this.sendGetMultiSignature = function (b) {
        this.send(alloy.CONST.API_SERVER_URL + "get_long_nick", {
            context: this,
            method: "GET",
            data: {
                tuin: b,
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            onSuccess: function (b) {
                b.retcode === 0 ? d.notifyObservers(c, "GetMultiBuddySignatureSuccess", b) : a.out("[sendGetSignature] error: " + b.retcode + "-" + b.errmsg)
            },
            onError: function () {
                a.out(" sendGetSignatureError")
            }
        })
    };
    this.sendGetTipsInfo = function (b) {
        b = b || {};
        alloy.rpcService.selfSend(alloy.CONST.MAIN_URL + "web2/get_msg_tip", {
            context: c,
            method: "GET",
            data: {
                uin: b.uin || "",
                tp: b.tp || 1,
                id: b.id || 0,
                retype: b.retype || 1,
                rc: b.rc || 0,
                lv: alloy.portal.getLoginLevel() || ""
            },
            onSuccess: b.onSuccess ? b.onSuccess : function (b) {
                b.c === 0 ? d.notifyObservers(c, "GetTipsInfoSuccess", b) : b.c !== 1 && a.error("[sendGetTipsInfo] error!")
            }
        })
    };
    this.sendQuitGroup = function (b) {
        b.vfwebqq = alloy.portal.getVfWebQQ();
        alloy.rpcService.send(alloy.CONST.API_SERVER_URL + "quit_group2", {
            context: this,
            method: "POST",
            data: {
                r: a.json.stringify(b)
            },
            arguments: b,
            onSuccess: function (b) {
                b.retcode === 0 ? (a.out(":sendQuitGroup..."), d.notifyObservers(alloy.rpcService, "sendQuitGroupSuccess", b)) : (a.out("[sendModifyMyDetails\uff1a\u6570\u636e\u683c\u5f0f\u9519\u8bef] error: " + b.retcode + "-" + b.errmsg), d.notifyObservers(alloy.rpcService, "sendQuitGroupError", b))
            },
            onError: function (b) {
                a.out("\u9000\u51fa\u5931\u8d25");
                d.notifyObservers(alloy.rpcService, "sendQuitGroupError", b)
            }
        })
    };
    this.getAppInfo = function (b, c, d, f) {
        b = {
            appid: parseInt(b),
            loadMethod: 0
        };
        if (c) b.val = c;
        b.vfwebqq = alloy.portal.getVfWebQQ();
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/qqweb/market/getappinfo.do", {
            context: b.context || this,
            method: "GET",
            data: {
                appattrib: a.json.stringify(b)
            },
            arguments: b,
            onSuccess: d || function () {},
            onError: f || function () {}
        })
    };
    this.setAppVote = function (b, f, g) {
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/qqweb/market/updateapphot.do", {
            context: b.context || this,
            method: "POST",
            data: {
                appattrib: a.json.stringify(b),
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: b,
            onSuccess: f || function () {},
            onError: g || function (b) {
                a.out("\u5e94\u7528\u8bc4\u5206\u5931\u8d25");
                d.notifyObservers(c, "SetAppVoteError", b)
            }
        })
    };
    this.createAppComment = function (a, b, c) {
        a.ni = a.ni || alloy.portal.getPortalSelf("nick") || alloy.portal.getPortalSelf("uin");
        a.vfwebqq = alloy.portal.getVfWebQQ();
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/qqweb/market/createappcomment.do", {
            context: a.context || this,
            method: "POST",
            data: a,
            arguments: a,
            onSuccess: b || function () {},
            onError: c || function () {}
        })
    };
    this.createAppComplain = function (b, c, d) {
        b.ni = b.ni || alloy.portal.getPortalSelf("nick") || alloy.portal.getPortalSelf("uin");
        b.vfwebqq = alloy.portal.getVfWebQQ();
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/qqweb/market/appusercomplain.do", {
            context: b.context || this,
            method: "POST",
            data: {
                appattrib: a.json.stringify(b)
            },
            arguments: b,
            onSuccess: c || function () {},
            onError: d || function () {}
        })
    };
    this.sendSetConfig = function (b) {
        if (alloy.portal.getTryUin() && alloy.portal.getSkey()) {
            b.data.vfwebqq = alloy.portal.getVfWebQQ();
            var c = b.action || "set";
            b.data && b.data.r && (b.data.r = a.json.stringify(b.data.r));
            this.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/qqweb/newuac/" + c + ".do", {
                method: "POST",
                data: b.data,
                onSuccess: b.onSuccess,
                context: b.context
            })
        }
    };
    this.sendMessageFilterConfig = function (a) {
        a.data.vfwebqq = qqweb.portal.getVfWebQQ();
        this.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/qqweb/uac/messagefilter.do", {
            method: "POST",
            data: a.data,
            onSuccess: a.onSuccess,
            context: a.context
        })
    };
    this.sendSetConfigNew = function (b) {
        this.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/qqweb/newuac/" + (b.action || "set") + ".do", {
            method: "POST",
            data: {
                r: a.json.stringify(b.data),
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: b.arguments,
            onSuccess: b.onSuccess,
            context: b.context
        })
    };
    this.sendMSetConfig = function (b) {
        this.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/qqweb/newuac/mset.do", {
            method: "POST",
            data: {
                r: a.json.stringify(b.data),
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            onSuccess: b.onSuccess,
            context: b.context
        })
    };
    var D = function () {
        o && (c.sendMSetConfig({
            data: o
        }), o = null)
    };
    this.sendMSetConfigDelay = function (a) {
        l && clearTimeout(l);
        o = o || {};
        var b = a.data,
            c;
        for (c in b) {
            o[c] = o[c] || {};
            for (var d in b[c]) o[c][d] = b[c][d]
        }
        l = setTimeout(D, a.delay || 5E3)
    };
    this.sendGetConfig = function (b) {
        b.data = b.data || {};
        b.data.uin = qqweb.portal.getUin();
        b.data && b.data.r && (b.data.r = a.json.stringify(b.data.r));
        this.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/qqweb/newuac/" + b.action + ".do", {
            data: b.data,
            arguments: b.arguments,
            method: "POST",
            timeout: 2E4,
            onSuccess: b.onSuccess,
            onError: b.onError,
            onComplete: b.onComplete,
            onTimeout: b.onTimeout,
            context: b.context
        })
    };
    this.sendGetAllConfig = function (b) {
        b.data = b.data || {};
        b.data.uin = alloy.portal.getUin();
        b.data && b.data.r && (b.data.r = a.json.stringify(b.data.r));
        this.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/qqweb/newuac/getall.do", {
            data: b.data,
            arguments: b.arguments,
            method: "POST",
            onSuccess: b.onSuccess,
            context: b.context
        })
    };
    this.sendGetNewAppCount = function () {
        var a = {};
        this.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/qqweb/market/getnewappnumber.do", {
            context: this,
            method: "GET",
            data: {
                r: '{"appid":1000000,"type":[1,-1]}'
            },
            onSuccess: function (b) {
                b.retcode === 0 ? d.notifyObservers(alloy.rpcService, "SendGetNewAppCountSuccess", b) : d.notifyObservers(alloy.rpcService, "SendMsgError", {
                    uin: a.to,
                    retcode: b.retcode,
                    errmsg: b.errmsg
                })
            },
            onError: function () {}
        })
    };
    this.sendGetDefaultAppIntroduce = function (b, f, g) {
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/qqweb/market/getdefaultappinfo.do", {
            context: c,
            method: "POST",
            data: {
                appattrib: a.json.stringify(b),
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: b,
            onSuccess: f || function (b) {
                b.retcode === 0 ? onGetAppIntroduceSuccess(b.result.resultData) : a.out("\u5e94\u7528\u4ecb\u7ecd\u62c9\u53d6\u5931\u8d25" + b.errmsg)
            },
            onError: g || function (b) {
                a.out("\u5e94\u7528\u62c9\u53d6\u5931\u8d25");
                d.notifyObservers(c, "GetAppIntroduceError", b)
            }
        })
    };
    this.sendReport = function (b) {
        alloy.rpcService.formSend("http://tj.qstatic.com/log", {
            method: "POST",
            data: {
                r: a.string.trim(b)
            }
        })
    };
    this.reportQstatic = function (a) {
        qqweb.util.report2qqweb(a)
    };
    this.sendSearchGroup = function (a) {
        a.data.vfwebqq = qqweb.portal.getVfWebQQ();
        this.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/qqweb/group/search.do", {
            data: a.data,
            arguments: a.data,
            onSuccess: a.onSuccess,
            onError: a.onError,
            context: a.context
        })
    };
    this.sendGetGroupLog2 = function (b, f, g) {
        var h, k;
        b.mode == 1 ? (h = b.lastbs ? b.lastbs - b.ps : 0, k = b.lastbs ? b.lastbs - 1 : 0) : b.mode == 2 && (h = b.lastes ? b.lastes + 1 : 0, k = b.lastes ? b.lastes + b.ps : 0);
        h = {
            ps: b.ps,
            bs: h,
            es: k,
            gid: b.gcode,
            mode: b.mode,
            vfwebqq: qqweb.portal.getVfWebQQ()
        };
        this.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/top/groupchatlog", {
            context: this,
            data: h,
            arguments: {
                gid: b.gid,
                gcode: b.gcode
            },
            onSuccess: f || function (a) {
                d.notifyObservers(c, "SendGetGroupLogSuccess", a)
            },
            onError: g || function () {
                a.out("[SendGetGroupLog] error")
            }
        })
    };
    this.sendGetGroupLogDates = function (b, c, d) {
        b.vfwebqq = qqweb.portal.getVfWebQQ();
        this.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/top/chatlogdates", {
            context: this,
            data: b,
            onSuccess: c || function () {},
            onError: d || function () {
                a.out("[SendGetGroupLog] error")
            }
        })
    };
    this.sendGetDiscuLog = function (b, c, d) {
        var f = {
            p: b.p,
            gid: b.did.slice(1),
            c: b.c,
            ty: 2,
            vfwebqq: qqweb.portal.getVfWebQQ()
        };
        this.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/top/get_one_page", {
            context: this,
            data: f,
            arguments: {
                did: b.did,
                p: b.p,
                c: b.c
            },
            onSuccess: c || function () {},
            onError: d || function () {
                a.out("[SendGetGroupLog] error")
            }
        })
    };
    this.sendGetGroupLogByTime = function (b, f, g) {
        arguments = {
            gid: b.gid,
            gcode: b.gcode
        };
        var h = b;
        h.gid = b.gcode;
        h.vfwebqq = qqweb.portal.getVfWebQQ();
        this.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/qqweb/group/uintimechatlog.do", {
            context: this,
            data: h,
            arguments: arguments,
            onSuccess: f || function (a) {
                d.notifyObservers(c, "sendGetGroupLogByTime", a)
            },
            onError: g || function () {
                a.out("[SendGetGroupLog] error")
            }
        })
    };
    this.reportAppRun = function (b) {
        b = {
            appid: 0,
            rappid: parseInt(b)
        };
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/qqweb/market/record.do", {
            context: b.context || this,
            method: "POST",
            data: {
                appattrib: a.json.stringify(b),
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: b
        })
    };
    this.reportAppShare = function (b) {
        b = {
            type: parseInt(b.type),
            appid: parseInt(b.appId)
        };
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/qqweb/market/appshare.do", {
            context: b.context || this,
            method: "POST",
            data: {
                appattrib: a.json.stringify(b),
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: b
        })
    };
    this.sendGetAPISkey = function (b) {
        b = b || {};
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/qqweb/app/loadapp.do", {
            context: c,
            method: "GET",
            data: {
                r: a.json.stringify({
                    appid: b.appid
                })
            },
            timeout: 1E4,
            onSuccess: b.onSuccess,
            onError: b.onError,
            onTimeout: b.onTimeout
        })
    };
    this.sendCheckHack = function (a) {
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/qqweb/check.do", {
            context: c,
            method: "POST",
            data: {
                k: a.key
            },
            onSuccess: a.onSuccess
        })
    };
    this.sendGetVipConfig = function (a, b, f) {
        if (alloy.portal.getLoginLevel() > alloy.CONST.LOGIN_LEVEL_NONE) {
            var g = {
                level: a.level
            };
            g.vfwebqq = qqweb.portal.getVfWebQQ();
            this.send(alloy.CONST.API_SERVER_URL + "get_vipconfig", {
                context: a.context || this,
                data: g,
                onSuccess: b || function (a) {
                    a.retcode === 0 && a.result ? d.notifyObservers(c, "GetVipConfigSuccess", a) : d.notifyObservers(c, "GetVipConfigError")
                },
                onError: f || function () {
                    d.notifyObservers(c, "GetVipConfigError")
                },
                onTimeout: function () {
                    d.notifyObservers(c, "GetVipConfigError")
                }
            })
        }
    };
    this.sendSetVipConfig = function (b, f, g) {
        if (alloy.portal.getLoginLevel() > alloy.CONST.LOGIN_LEVEL_NONE) {
            var h = {};
            h.vfwebqq = qqweb.portal.getVfWebQQ();
            h.roamall = b.roamall || 0;
            if (b.setuinlist && b.setuinlist.length) h.setuinlist = a.json.stringify(b.setuinlist);
            if (b.unsetuinlist && b.unsetuinlist.length) h.unsetuinlist = a.json.stringify(b.unsetuinlist);
            this.send(alloy.CONST.API_SERVER_URL + "set_vipconfig", {
                context: b.context || this,
                method: "POST",
                arguments: b.arguments,
                data: h,
                onSuccess: f || function (a) {
                    a.retcode === 0 && a.result ? d.notifyObservers(c, "SetVipConfigSuccess", a) : d.notifyObservers(c, "SetVipConfigError", a)
                },
                onError: g || function (a) {
                    d.notifyObservers(c, "SetVipConfigError", a)
                },
                onTimeout: function () {
                    d.notifyObservers(c, "SetVipConfigError", data)
                }
            })
        }
    };
    this.getAppInfoMulti = function (b) {
        var c = {
            appid: b.appList,
            loadMethod: 4
        };
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "keycgi/qqweb/market/getappinfo.do", {
            context: c.context || this,
            method: "GET",
            data: {
                appattrib: a.json.stringify(c)
            },
            arguments: c,
            onSuccess: b.onSuccess || function () {},
            onError: b.onError || function () {},
            onTimeout: b.onError || function () {}
        })
    };
    this.sendGetRecentChat = function (a) {
        this.send(alloy.CONST.API_SERVER_URL + "recent_chat", {
            context: this,
            method: "GET",
            timeout: 1E4,
            data: {
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            onSuccess: a.onSuccess,
            onError: a.onError
        })
    };
    this.sendFileErrorReport = function (b) {
        this.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/top/save_logs", {
            context: c,
            method: "POST",
            data: {
                logdata: a.json.stringify(b),
                vfwebqq: alloy.portal.getVfWebQQ()
            }
        })
    }
});
Jx().$package("alloy.layout.themeManager", function (a) {
    var c = this,
        b = a.dom,
        d = a.event,
        g, k, l, o, t = {
            id: "theme_blue_glow"
        }, r = null,
        u = 0;
    window.webTop && (t = {
        id: "theme_blue_glow"
    });
    var v;
    this.themeConfig = {
        theme_blue: {
            id: "theme_blue",
            name: "\u68a6\u5e7b\u5149\u5f71",
            skin: "blue",
            wallpaper: {
                url: "blue.jpg?t=20111011001",
                mode: "centerRepeat"
            }
        },
        theme_pinky_night: {
            id: "theme_pinky_night",
            name: "\u7c89\u7ea2\u4e4b\u591c",
            skin: "pink",
            wallpaper: {
                url: "pinky_night.jpg?t=20111011001",
                mode: "centerRepeat"
            }
        },
        theme_green: {
            id: "theme_green",
            name: "\u9752\u9752\u4e16\u754c",
            skin: "light_green",
            wallpaper: {
                url: "green.jpg",
                mode: "centerRepeat"
            }
        },
        theme_wood1: {
            id: "theme_wood1",
            name: "\u6e29\u99a8\u6728\u7eb9",
            skin: "dark_brown",
            wallpaper: {
                url: "wood1.jpg",
                mode: "centerRepeat"
            }
        },
        theme_wood2: {
            id: "theme_wood2",
            name: "\u9ed1\u8272\u6728\u7eb9",
            skin: "black",
            wallpaper: {
                url: "wood2.jpg",
                mode: "centerRepeat"
            }
        },
        theme_universe: {
            id: "theme_universe",
            name: "\u795e\u79d8\u661f\u9645",
            skin: "dark_blue",
            wallpaper: {
                url: "universe.jpg?t=20111011001",
                mode: "centerRepeat"
            }
        },
        theme_metal: {
            id: "theme_metal",
            name: "\u9177\u70ab\u91d1\u5c5e",
            skin: "grey",
            wallpaper: {
                url: "metal.jpg?t=20111011001",
                mode: "centerRepeat"
            }
        },
        theme_pinky_light: {
            id: "theme_pinky_light",
            name: "\u5e7b\u5f69\u8367\u5149",
            skin: "light_violet",
            wallpaper: {
                url: "pinky_light.jpg?t=20111011001",
                mode: "fill"
            }
        },
        theme_pinky_flower: {
            id: "theme_pinky_flower",
            name: "\u7eda\u70c2\u7e41\u82b1",
            skin: "dark_voilet",
            wallpaper: {
                url: "pinky_flower.jpg?t=20111011001",
                mode: "fill"
            }
        },
        theme_christmas: {
            id: "theme_christmas",
            name: "\u5723\u8bde\u5feb\u4e50",
            skin: "light_blue",
            wallpaper: {
                url: "christmas.jpg?t=20111011001",
                mode: "fill"
            },
            scene: "sceneChristmas"
        },
        theme_2011: {
            id: "theme_2011",
            name: "\u6b22\u5e86\u5143\u65e6",
            skin: "black",
            wallpaper: {
                url: "2011.jpg",
                mode: "fill"
            }
        },
        theme_blue1: {
            id: "theme_blue1",
            name: "\u5e7b\u5f69\u84dd\u5929",
            skin: "dark_blue",
            wallpaper: {
                url: "blue1.jpg?t=20111011001",
                mode: "fill"
            }
        },
        theme_spring_festival: {
            id: "theme_spring_festival",
            name: "\u559c\u8fce\u65b0\u6625",
            skin: "grey",
            wallpaper: {
                url: "spring_festival.jpg?t=20111011001",
                mode: "centerRepeat"
            }
        },
        theme_valentinesDay: {
            id: "theme_valentinesDay",
            name: "\u751c\u871c\u60c5\u4eba\u8282",
            skin: "valentinesDay",
            wallpaper: {
                url: "valentinesDay.jpg?t=20111011001",
                mode: "fill"
            }
        },
        theme_cloud: {
            id: "theme_cloud",
            name: "\u6674\u7a7a\u884c\u4e91",
            skin: "blue",
            wallpaper: {
                url: "cloud.jpg?t=20111011001",
                mode: "centerRepeat"
            },
            scene: "cloud"
        },
        theme_gravity: {
            id: "theme_gravity",
            name: "\u84b2\u516c\u82f1",
            skin: "blue",
            wallpaper: {
                url: "cloud.jpg?t=20111011001",
                mode: "centerRepeat"
            },
            scene: "gravity"
        },
        theme_blue_glow: {
            id: "theme_blue_glow",
            name: "\u6df1\u6d77\u4ef0\u671b",
            skin: "grey",
            wallpaper: {
                url: "blue_glow.jpg",
                mode: "zoom"
            }
        },
        theme_green_glow: {
            id: "theme_green_glow",
            name: "\u6668\u5149\u5fae\u66e6",
            skin: "grey",
            wallpaper: {
                url: "green_glow.jpg",
                mode: "zoom"
            }
        },
        theme_orange_glow: {
            id: "theme_orange_glow",
            name: "\u68a6\u9192\u65f6\u5206",
            skin: "grey",
            wallpaper: {
                url: "orange_glow.jpg",
                mode: "zoom"
            }
        },
        theme_7_7: {
            id: "theme_7_7",
            name: "\u4e03\u5915",
            skin: "7_7",
            wallpaper: {
                url: "7_7.jpg",
                mode: "fill"
            }
        },
        theme_teachersDay: {
            id: "theme_teachersDay",
            name: "\u6559\u5e08\u8282",
            skin: "teachersDay",
            wallpaper: {
                url: "teachersDay.jpg",
                mode: "zoom"
            }
        },
        theme_midAutumn: {
            id: "theme_midAutumn",
            name: "\u4e2d\u79cb\u8282",
            skin: "pink",
            wallpaper: {
                url: "midAutumn.jpg",
                mode: "fill"
            }
        },
        theme_lookUpSky: {
            id: "theme_lookUpSky",
            name: "\u4ef0\u671b\u82cd\u7a79",
            skin: "blue",
            wallpaper: {
                url: "lookUpSky.jpg",
                mode: "fill"
            }
        },
        theme_grass: {
            id: "theme_grass",
            name: "\u832b\u832b\u91ce\u8349",
            skin: "grey",
            wallpaper: {
                url: "grass.jpg",
                mode: "fill"
            }
        },
        theme_childhood: {
            id: "theme_childhood",
            name: "\u7ae5\u5e74\u8bb0\u5fc6",
            skin: "pink",
            wallpaper: {
                url: "childhood.jpg",
                mode: "fill"
            }
        },
        theme_skyBlue: {
            id: "theme_skyBlue",
            name: "\u7a7a\u7075\u84dd\u8c03",
            skin: "blue",
            wallpaper: {
                url: "skyBlue.jpg",
                mode: "fill"
            }
        },
        theme_dandelionDream: {
            id: "theme_dandelionDream",
            name: "\u84b2\u82f1\u4e4b\u68a6",
            skin: "blue",
            wallpaper: {
                url: "dandelionDream.jpg",
                mode: "fill"
            }
        },
        theme_paintingTime: {
            id: "theme_paintingTime",
            name: "\u6c34\u58a8\u5e74\u534e",
            skin: "dark_brown",
            wallpaper: {
                url: "paintingTime.jpg",
                mode: "fill"
            }
        },
        theme_dreamSky: {
            id: "theme_dreamSky",
            name: "\u68a6\u7fd4\u5929\u9645",
            skin: "blue",
            wallpaper: {
                url: "dreamSky.jpg",
                mode: "fill"
            }
        }
    };
    var s = [];
    (function () {
        var a, b = 0;
        for (a in c.themeConfig) c.themeConfig.hasOwnProperty(a) && (s[b++] = c.themeConfig[a])
    })();
    this.themeArray = s;
    this.getThemeArray = function (b) {
        var d = [],
            e;
        for (e = 0; e < b.length; e++) a.browser.mobileSafari && b[e] == "theme_gravity" || d.push(c.themeConfig[b[e]]);
        return d
    };
    var m = {
        skinRoot: "",
        timeStamp: 20111011001,
        window: {
            titleColor: "#6d6d6d",
            titleHeight: "25px",
            textColor: "#666666",
            titleFontWeight: "bold",
            bodyAreaTop: "0",
            actionButtonWidth: "21px",
            actionButtonHeight: "19px",
            bodyColor: "#fff",
            ie6WindowCenterBackground: "#C2D2C8",
            ipadContainerBackColor: "rgba(168, 218, 127, .8)"
        },
        currentWindow: {
            titleColor: "#393836",
            textColor: "#333333",
            ipadContainerBackColor: "rgba(168, 218, 127, 1)",
            windowCenterBackground: "#A8DA7F",
            ie6WindowCenterBackground: "#A8DA7F"
        },
        appbar: {
            aColor: "white"
        },
        panel: {
            ie6Background: "#fff"
        },
        indicator: {
            bgHeight: "40px",
            ie6BgHeight: "28px",
            wrapperTop: "0",
            wrapperPosition: "static",
            ipadSystemBtn: ".mobileSafari #navbar{width:222px;} .mobileSafari #navbar .system_button{display:none;visibility:visible;}"
        }
    },
    f = this.skinConfig = {
        blue: {
            id: 0,
            key: "blue",
            name: "\u6de1\u84dd",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#C4DCEA",
                ipadContainerBackColor: "rgba(182,234,253,.8)",
                ie6WindowCenterBackground: "#C4DEED"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(182,234,253,1)",
                ie6WindowCenterBackground: "#B6EAFD"
            }
        },
        black: {
            id: 1,
            key: "black",
            name: "\u9ed1\u8272",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#E9E9E9",
                ipadContainerBackColor: "rgba(232,232,232,.8)",
                ie6WindowCenterBackground: "#C4C4C4"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(232,232,232,1)",
                ie6WindowCenterBackground: "#e8e8e8"
            }
        },
        light_green: {
            id: 2,
            key: "light_green",
            name: "\u5ae9\u7eff",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#AFDD8B",
                ipadContainerBackColor: "rgba(168,218,127,.8)",
                ie6WindowCenterBackground: "#C2D2C8"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(168,218,127,1)",
                ie6WindowCenterBackground: "#A8DA7F"
            }
        },
        pink: {
            id: 3,
            key: "pink",
            name: "\u6c34\u7c89",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#EFDEE5",
                ipadContainerBackColor: "rgba(255,225,229,.8)",
                ie6WindowCenterBackground: "#CCCCCC"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(255,225,229,1)",
                ie6WindowCenterBackground: "#FFE1E5"
            }
        },
        light_violet: {
            id: 4,
            key: "light_violet",
            name: "\u6d45\u7d2b",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#EFDEE5",
                ipadContainerBackColor: "rgba(255,225,229,.8)",
                ie6WindowCenterBackground: "#CCCCCC"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(255,225,229,1)",
                ie6WindowCenterBackground: "#FFE1E5"
            }
        },
        dark_voilet: {
            id: 5,
            key: "dark_voilet",
            name: "\u7d20\u7d2b",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#EFDEE5",
                ipadContainerBackColor: "rgba(255,225,229,.8)",
                ie6WindowCenterBackground: "#CCCCCC"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(255,225,229,1)",
                ie6WindowCenterBackground: "#FFE1E5"
            }
        },
        grey: {
            id: 6,
            key: "grey",
            name: "\u94f6\u7070",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#E9E9E9",
                ipadContainerBackColor: "rgba(232,232,232,.8)",
                ie6WindowCenterBackground: "#C4C4C4"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(232,232,232,1)",
                ie6WindowCenterBackground: "#e8e8e8"
            }
        },
        dark_brown: {
            id: 7,
            key: "dark_brown",
            name: "\u6d45\u68d5",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#E2D3BB",
                ipadContainerBackColor: "rgba(234,222,197,.8)",
                ie6WindowCenterBackground: "#C4C4C4"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(234,222,197,1)",
                ie6WindowCenterBackground: "#EADEC5"
            }
        },
        dark_blue: {
            id: 8,
            key: "dark_blue",
            name: "\u6df1\u84dd",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#E9E9E9",
                ipadContainerBackColor: "rgba(232,232,232,.8)",
                ie6WindowCenterBackground: "#C4C4C4"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(232,232,232,1)",
                ie6WindowCenterBackground: "#e8e8e8"
            }
        },
        light_blue: {
            id: 9,
            key: "light_blue",
            name: "\u6d45\u84dd",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#C4DCEA",
                ipadContainerBackColor: "rgba(232,232,232,.8)",
                ie6WindowCenterBackground: "#C4DEED"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(232,232,232,1)",
                ie6WindowCenterBackground: "#B6EAFD"
            }
        },
        valentinesDay: {
            id: 10,
            key: "valentinesDay",
            name: "\u6d45\u84dd",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#E9E9E9",
                ipadContainerBackColor: "rgba(232,232,232,.8)",
                ie6WindowCenterBackground: "#C4C4C4"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(232,232,232,1)",
                ie6WindowCenterBackground: "#e8e8e8"
            }
        },
        red: {
            id: 11,
            key: "red",
            name: "\u4eae\u7ea2",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#F1B7B7",
                ipadContainerBackColor: "rgba(245,194,194,.8)",
                ie6WindowCenterBackground: "#F7CECE"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(245,194,194,1)",
                ie6WindowCenterBackground: "#F5C2C2"
            }
        },
        cyan: {
            id: 12,
            key: "cyan",
            name: "\u78a7\u9752",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#BAE3D7",
                ipadContainerBackColor: "rgba(194,245,226,.8)",
                ie6WindowCenterBackground: "#CEF7E8"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(194,245,226,1)",
                ie6WindowCenterBackground: "#C2F5E2"
            }
        },
        purple: {
            id: 13,
            key: "purple",
            name: "\u7d20\u7d2b",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#CAB7DE",
                ipadContainerBackColor: "rgba(224,194,245,.8)",
                ie6WindowCenterBackground: "#E6CEF7"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(224,194,245,1)",
                ie6WindowCenterBackground: "#E0C2F5"
            }
        },
        "7_7": {
            id: 14,
            key: "7_7",
            name: "\u6c34\u7c89",
            timeStamp: 20111011001,
            window: {
                bodyColor: "#EFDEE5",
                ipadContainerBackColor: "rgba(255,225,229,.8)",
                ie6WindowCenterBackground: "#CCCCCC"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(255,225,229,1)",
                ie6WindowCenterBackground: "#FFE1E5"
            }
        },
        teachersDay: {
            id: 15,
            key: "teachersDay",
            name: "\u6de1\u84dd",
            timeStamp: 20111011001,
            window: {
                ipadContainerBackColor: "rgba(182,234,253,.8)",
                ie6WindowCenterBackground: "#C4DEED"
            },
            currentWindow: {
                ipadContainerBackColor: "rgba(182,234,253,1)",
                ie6WindowCenterBackground: "#B6EAFD"
            }
        }
    };
    this.getSkinArray = function (a) {
        var b = [],
            c;
        for (c = 0; c < a.length; c++) b[c] = f[a[c]];
        return b
    };
    var h = {}, n = {
        repeat: {
            isHackNeeded: !1,
            hackType: ""
        },
        center: {
            isHackNeeded: !1,
            hackType: ""
        },
        centerRepeat: {
            isHackNeeded: !1,
            hackType: ""
        },
        zoom: {
            isHackNeeded: !0,
            hackType: "img"
        },
        adapt: {
            isHackNeeded: !0,
            hackType: "img"
        },
        fill: {
            isHackNeeded: !0,
            hackType: "img"
        },
        iframe: {
            isHackNeeded: !0,
            hackType: "iframe"
        }
    }, p = function () {
        c.applyTheme(t ? t.id : c.themeArray[Math.floor(Math.random() * 100 % c.themeArray.length)].id, !0)
    }, D = function (a, b) {
        var b = b || function () {}, c = [],
            d = a.length;
        if (a.length) for (var e = function () {
            --d < 1 && (b(c), c = null)
        }, f = function () {
            this.onerror = this.onload = null;
            e()
        }, g = function () {
            this.onerror = this.onload = null;
            e()
        }; a.length > 0;) {
            var h = new Image;
            c.push(h);
            h.onload = f;
            h.onerror = g;
            h.src = a.shift()
        } else b(c)
    }, e = new a.Class({
        init: function () {
            this._iframeWallpaperContainter = this._zoomWallpaperContainer = null;
            this._mode = "repeat";
            var a = this;
            this._onWindowResize = function () {
                a.setWallpaperSize.apply(a)
            }
        },
        getMode: function () {
            return this._mode
        },
        isHackLayerNeeded: function () {
            return !0
        },
        isHackLayerNeed2Change: function () {
            return n[this._mode].hackType != n[this._nMode].hackType
        },
        isModeHackNeeded: function (a) {
            return n[a].isHackNeeded
        },
        initHackLayer: function () {
            if (this.isHackLayerNeeded() && (!this.isModeHackNeeded(this._mode) || this.isHackLayerNeed2Change())) this.onInitHackLayer(n[this._nMode].hackType)
        },
        onInitHackLayer: function (a) {
            (this._zoomWallpaperContainer = b.id("zoomWallpaperGrid")) && document.body.removeChild(this._zoomWallpaperContainer);
            switch (a) {
            case "img":
                this._zoomWallpaperContainer = b.node("div", {
                    id: "zoomWallpaperGrid",
                    "class": "zoomWallpaperGrid",
                    style: "position:absolute;z-index:-10;left:0;top:0;overflow:hidden;"
                });
                this._zoomWallpaperContext = b.node("img", {
                    id: "zoomWallpaper",
                    "class": "zoomWallpaper",
                    style: "position:absolute;"
                });
                this._zoomWallpaperContainer.appendChild(this._zoomWallpaperContext);
                document.body.appendChild(this._zoomWallpaperContainer);
                d.on(window, "resize", this._onWindowResize);
                break;
            case "iframe":
                this._zoomWallpaperContainer = b.node("div", {
                    id: "zoomWallpaperGrid",
                    "class": "zoomWallpaperGrid",
                    style: "position:absolute;left:0;top:0;overflow:hidden;width:100%;height:100%;z-index:-1;"
                }), this._zoomWallpaperContext = b.node("div"), this._zoomWallpaperContext.innerHTML = '<iframe id ="iframeWallpaper" frameborder="no" border="0" class ="iframeWallpaper" style ="position:absolute;left:0;top:0;overflow:hidden;width:100%;height:100%;"></iframe>', this._zoomWallpaperContainer.appendChild(this._zoomWallpaperContext), document.body.appendChild(this._zoomWallpaperContainer)
            }
        },
        removeHackLayout: function () {
            if (this.isHackLayerNeeded() && this.isModeHackNeeded(this._mode)) {
                if (this._zoomWallpaperContainer && (b.setStyle(this._zoomWallpaperContainer, "display", "none"), this._mode == "iframe")) b.id("iframeWallpaper").src = "domain.html";
                d.off(window, "resize", this._onWindowResize)
            } else this.isModeHackNeeded(this._mode) && b.removeClass(document.body, "wallpaperCss3" + this._mode)
        },
        getCurrentWallpaper: function () {
            return this._wallpaper.src
        },
        getCurrentMode: function () {
            return this._wallpaper.mode
        },
        applyWallpaper: function (a, b) {
            this._wallpaper = {
                src: a,
                mode: b
            };
            this._nMode = b;
            b == "iframe" ? this.applyIframeWallpaper(a) : this.applyImageWallpaper(a, b)
        },
        applyImageWallpaper: function (b) {
            D([b], a.bind(this.onWallpaperLoaded, this))
        },
        applyIframeWallpaper: function (a) {
            this.initHackLayer();
            this._mode = this._nMode;
            if (this._zoomWallpaperContext) b.id("iframeWallpaper").src = a
        },
        applyBackColor: function (a) {
            b.setStyle(document.body, "backbroundColor", a)
        },
        onWallpaperLoaded: function (a) {
            this._wallpaper.height = a[0].height;
            this._wallpaper.width = a[0].width;
            a = "url(" + this._wallpaper.src + ")";
            this._nMode = this._nMode || t && t.mode || "repeat";
            switch (this._nMode) {
            case "repeat":
                this.removeHackLayout();
                this._mode = "repeat";
                b.setStyle(document.body, "backgroundImage", a);
                b.setStyle(document.body, "backgroundRepeat", "repeat");
                b.setStyle(document.body, "backgroundPosition", "0 0");
                break;
            case "center":
                this.removeHackLayout();
                this._mode = "center";
                b.setStyle(document.body, "backgroundImage", a);
                b.setStyle(document.body, "backgroundRepeat", "no-repeat");
                b.setStyle(document.body, "backgroundPosition", "center center");
                break;
            case "centerRepeat":
                this.removeHackLayout();
                this._mode = "centerRepeat";
                b.setStyle(document.body, "backgroundImage", a);
                b.setStyle(document.body, "backgroundRepeat", "repeat");
                b.setStyle(document.body, "backgroundPosition", "center center");
                break;
            case "zoom":
            case "adapt":
            case "fill":
                this.initHackLayer(), this._mode = this._nMode, this.isHackLayerNeeded() ? (b.setStyle(this._zoomWallpaperContainer, "display", "none"), this.zoomWallpaper(), b.setStyle(document.body, "background", "none")) : (b.setStyle(document.body, "backgroundImage", a), b.setStyle(document.body, "backgroundRepeat", "no-repeat"), b.addClass(document.body, "wallpaperCss3" + this._mode))
            }
        },
        setWallpaperSize: function () {
            var a = alloy.layout.getDesktopHeight(),
                c = alloy.layout.getDesktopWidth(),
                d = this._wallpaper.height,
                e = this._wallpaper.width,
                f = c * d / e,
                g = a * e / d;
            b.setStyle(this._zoomWallpaperContainer, "height", a + "px");
            b.setStyle(this._zoomWallpaperContainer, "width", c + "px");
            switch (this._mode) {
            case "zoom":
                b.setStyle(this._zoomWallpaperContext, "height", a + "px");
                b.setStyle(this._zoomWallpaperContext, "width", c + "px");
                break;
            case "adapt":
                e / d > c / a ? (b.setStyle(this._zoomWallpaperContext, "height", Math.round(f) + "px"), b.setStyle(this._zoomWallpaperContext, "width", c + "px"), b.setStyle(this._zoomWallpaperContext, "top", Math.floor((a - f) / 2) + "px"), b.setStyle(this._zoomWallpaperContext, "left", "0")) : (b.setStyle(this._zoomWallpaperContext, "height", a + "px"), b.setStyle(this._zoomWallpaperContext, "width", Math.round(g) + "px"), b.setStyle(this._zoomWallpaperContext, "left", Math.floor((c - g) / 2) + "px"), b.setStyle(this._zoomWallpaperContext, "top", "0"));
                break;
            case "fill":
                e / d > c / a ? (b.setStyle(this._zoomWallpaperContext, "height", a + "px"), b.setStyle(this._zoomWallpaperContext, "width", Math.ceil(g) + "px"), b.setStyle(this._zoomWallpaperContext, "left", Math.floor((c - g) / 2) + "px"), b.setStyle(this._zoomWallpaperContext, "top", "0")) : (b.setStyle(this._zoomWallpaperContext, "height", Math.ceil(f) + "px"), b.setStyle(this._zoomWallpaperContext, "width", c + "px"), b.setStyle(this._zoomWallpaperContext, "top", Math.floor((a - f) / 2) + "px"), b.setStyle(this._zoomWallpaperContext, "left", "0"))
            }
        },
        zoomWallpaper: function () {
            this._mode == "zoom" && (b.setStyle(this._zoomWallpaperContext, "top", "0"), b.setStyle(this._zoomWallpaperContext, "left", "0"));
            this.setWallpaperSize();
            b.setStyle(this._zoomWallpaperContainer, "display", "");
            this._zoomWallpaperContext.src = this._wallpaper.src
        },
        reset: function () {
            this.removeHackLayout();
            this._mode = "repeat";
            a.browser.ie ? (document.body.style.removeAttribute("backgroundImage"), document.body.style.removeAttribute("backgroundRepeat"), document.body.style.removeAttribute("backgroundPosition")) : b.setStyle(document.body, "background", "")
        }
    }),
        j = new a.Class({
            init: function () {
                this._oldStyleNode = b.id("skinStyleNode");
                this._cacheStyle = {}
            },
            getCurrentSkin: function () {
                return this._skin
            },
            applySkin: function (b) {
                this._skin = b = this.getConfig(b);
                D(this._getPreloadImages(b.skinRoot, b.timeStamp), a.bind(this._onImagePreloaded, this))
            },
            getConfig: function (b) {
                var c = {
                    name: "",
                    timeStamp: "",
                    window: {
                        ie6WindowCenterBackground: "",
                        ipadContainerBackColor: ""
                    },
                    currentWindow: {
                        ie6WindowCenterBackground: "",
                        ipadContainerBackColor: ""
                    },
                    skinRoot: ""
                };
                if (a.isObject(b)) c.id = (new Date).getTime(), c.name = b.name || "", c.timeStamp = b.timeStamp || "", c.window.ipadContainerBackColor = b.window.ipadContainerBackColor || "", c.window.ie6WindowCenterBackground = b.window.ie6WindowCenterBackground || "", c.currentWindow.ipadContainerBackColor = b.currentWindow.ipadContainerBackColor || "", c.currentWindow.ie6WindowCenterBackground = b.currentWindow.ie6WindowCenterBackground || "", c.skinRoot = b.skinRoot;
                else if (f[b]) {
                    a.extend(c, f[b]);
                    var d = h[b];
                    d || (d = alloy.util.getCdnUrlById(f[b].id) + "style/skin/" + b, h[b] = d);
                    c.skinRoot = d
                }
                return c
            },
            applySkinStyle: function (a) {
                if (this._newStyleNode) this._oldStyleNode && b.getDocHead().removeChild(this._oldStyleNode), this._oldStyleNode = this._newStyleNode;
                this._newStyleNode = b.createStyleNode(a, "skinStyleNode" + u++)
            },
            _onImagePreloaded: function () {
                var b = this._cacheStyle[this._skin.id];
                if (!b) {
                    var b = this._skin,
                        c;
                    c = v;
                    b = a.extend({}, m, b);
                    b = a.string.template(c, b);
                    this._cacheStyle[this._skin.id] = b
                }
                this.applySkinStyle(b)
            },
            _getPreloadImages: function (b, c) {
                return a.browser.ie == 6 || a.browser.ie == 7 ? [] : [b + "/images/suggess_list_bg.png?t=" + c, b + "/images/sprite_repeat_x_png.png?t=" + c, b + "/images/sprite_main_png.png?t=" + c]
            }
        }),
        B = new a.Class({
            init: function () {
                this.isInit = !0;
                this.curScene = null
            },
            getCurrentScene: function () {
                return this.curScene
            },
            applyScene: function (a) {
                this.curScene && this.closeScene();
                if (this.curScene = a) if (alloy.appconfig.getAllConfig(a)) alloy.portal.runApp(a);
                else {
                    this._iframeContainer = b.node("div", {
                        id: "sceneGrid",
                        "class": "sceneGrid",
                        style: "position:absolute;left:0;top:0;overflow:hidden;width:100%;height:100%;z-index:-1;"
                    });
                    this._iframeContext = b.node("div");
                    this._iframeContext.innerHTML = '<iframe id ="iframeScene" frameborder="no" border="0" class ="iframeScene" allowtransparency="true" style ="position:absolute;left:0;top:0;overflow:hidden;width:100%;height:100%;background-color:transparent;"></iframe>';
                    this._iframeContainer.appendChild(this._iframeContext);
                    var c = b.id("zoomWallpaperGrid");
                    c ? alloy.layout.getDesktop().body.insertBefore(this._iframeContainer, c) : alloy.layout.getDesktop().body.appendChild(this._iframeContainer);
                    b.id("iframeScene").src = a
                }
            },
            closeScene: function (a) {
                a = a || this.curScene;
                if (alloy.appconfig.getAllConfig(a))(a = alloy.portal.getApp(a)) && a.isRunning() && a.exit();
                else if (a = b.id("sceneGrid")) b.id("iframeScene").src = "domain.html", a.parentNode.removeChild(a)
            }
        }),
        x = new a.Class({
            init: function () {},
            getCurrentTheme: function () {
                return this._themeId
            },
            applyTheme: function (a, b) {
                this._themeId = a;
                var c = this.getConfig(a),
                    d = c.skin,
                    e = c.scene,
                    c = c.wallpaper;
                l.applyWallpaper(c.url, c.mode);
                k.applySkin(d);
                b || o.applyScene(e)
            },
            getConfig: function (b) {
                if (a.isObject(b)) return b;
                else if (c.themeConfig[b]) {
                    var d = c.themeConfig[b];
                    d.wallpaper.url = d.wallpaper.url.indexOf("http://") >= 0 ? d.wallpaper.url : alloy.util.getCdnUrlById(d.wallpaper.url.length) + "style/wallpaper/" + d.wallpaper.url;
                    return c.themeConfig[b]
                }
                return {}
            }
        });
    this.applyTheme = function (b, c) {
        a.browser.mobileSafari && b == "theme_gravity" && (b = "theme_cloud");
        g.applyTheme(b, c)
    };
    this.setTheme = function (b) {
        b.wallpaper.id = "themeSetting_urlWallpaper";
        this.applyTheme(b);
        if (a.isObject(b)) {
            b = {};
            b.skin = k.getCurrentSkin();
            var d = l.getCurrentWallpaper(),
                d = {
                    id: "themeSetting_urlWallpaper",
                    mode: l.getCurrentMode(),
                    url: d
                };
            b.wallpaper = d;
            alloy.config.setCustomTheme(b)
        } else c.themeConfig[b] && alloy.config.setTheme(b)
    };
    this.getCurrentThemeID = function () {
        return g.getCurrentTheme()
    };
    this.applyWallpaper = function (a, b) {
        l.applyWallpaper(a, b)
    };
    this.setWallpaper = function (a, b) {
        l.applyWallpaper(a, b);
        /(\.jpg)|(\.jpeg)|(\.bmp)|(\.gif)|(\.png)$/i.test(a) || (b = "iframe");
        var c = {
            id: "themeSetting_urlWallpaper",
            mode: b,
            url: a
        }, c = {
            skin: k.getCurrentSkin(),
            wallpaper: c
        };
        alloy.config.setCustomTheme(c)
    };
    this.getCurrentWallpaper = function () {
        return l.getCurrentWallpaper()
    };
    this.resetWallpaper = function () {
        l.reset()
    };
    this.applySkin = function (a) {
        k.applySkin(a)
    };
    this.setSkin = function (a) {
        k.applySkin(a);
        a = l.getCurrentWallpaper();
        a = {
            id: "themeSetting_urlWallpaper",
            mode: l.getCurrentMode(),
            url: a
        };
        a = {
            skin: k.getCurrentSkin(),
            wallpaper: a
        };
        alloy.config.setCustomTheme(a)
    };
    this.applyScene = function (a) {
        o.applyScene(a)
    };
    this.setScene = function () {};
    this.getCurrentSkin = function () {
        return k.getCurrentSkin()
    };
    this.init = function () {
        var a = b.id("skinTemplate");
        v = a.innerHTML;
        document.body.removeChild(a);
        g = new x;
        k = new j;
        l = new e;
        o = new B;
        d.addObserver(alloy.portal, "UACReady", A);
        d.addObserver(alloy.portal, "portalReady", y);
        typeof progress == "function" && progress("themenanager init")
    };
    var y = function () {
        if (!alloy.config.getWallpaper().id) {
            var b = alloy.config.getTheme().id,
                d = c.themeConfig[b].scene,
                b = 0;
            if (a.browser.ie == 6 || a.browser.ie == 7) b = 500;
            setTimeout(function () {
                o.applyScene(d)
            }, b)
        }
    }, A = function () {
        if (alloy.portal.getUin() && alloy.portal.getSkey()) {
            var a = alloy.config.getTheme().id,
                b = alloy.config.getWallpaper().id,
                d = alloy.config.getWallpaper().mode,
                e = alloy.config.getWallpaper().url,
                f = alloy.config.getAppearance().id;
            b ? (c.applyWallpaper(e, d), c.applySkin(f),
            c.applyScene()) : c.applyTheme(a, !0)
        } else r ? w(r) : p();
        r && r.done && c.themeArray.push(r) && (r = null)
    }, w = function (a) {
        t = t || {
            id: "",
            mode: "repeat"
        };
        alloy.rpcService.selfSend(alloy.CONST.MAIN_URL + "web2/get_msg_tip?retype=1&tp=3", {
            method: "get",
            onSuccess: function (b) {
                if (b.f == 1) a.done = !0, t.id = "theme_" + a.id;
                p()
            },
            onError: function () {
                p()
            }
        })
    }
});
Jx().$package("alloy.appconfig", function (a) {
    var c = this,
        b = a.event,
        d = a.localStorage,
        c = this,
        g = !1,
        k = !1,
        l = 0,
        o = 0,
        t = 0,
        r = 0;
    this.appConfigList = {};
    this.appTempList = {};
    this.systemConfigList = {
        50: {
            id: 50,
            appUrl: "",
            appName: "QQ",
            al: null,
            category: 7,
            iconUrl: "111",
            "New Property": "Value..",
            minWidth: "260",
            width: "280",
            settingCenter: "0",
            windowMode: "none",
            ipadincompatible: 0,
            provider: "Tencent \u817e\u8baf",
            ver: "2.3",
            alterMode: "",
            flashMode: "",
            appDesc: "WebQQ\u662f\u7531Tencent\u63d0\u4f9b\u7684\u7f51\u9875IM\u670d\u52a1\uff0c\u652f\u6301\u5728\u7ebf\u804a\u5929\u3001\u4f20\u8f93\u6587\u4ef6\u3001\u622a\u56fe\u3001\u6d88\u606f\u8bb0\u5f55\u6f2b\u6e38\u7b49\u591a\u79cd\u529f\u80fd\u3002",
            height: "560",
            loginLevel: "1",
            defaultMode: "",
            cannotUninstall: "1",
            powerLevel: "3",
            reportName: "eqq",
            appType: 1
        },
        taskBar: {
            id: "taskBar",
            appName: "\u4efb\u52a1\u680f",
            appType: 1,
            appLevel: "system",
            js: "./js/qqweb.system.module.js",
            windowMode: "none",
            customLoginValidate: !0,
            settingCenter: 0
        },
        dock: {
            id: "dock",
            appName: "dock",
            appType: 1,
            appLevel: "system",
            css: "./module/dock/style.css",
            js: "./module/dock/main.js",
            windowMode: "none"
        },
        tips: {
            id: "tips",
            appName: "tips",
            appType: 1,
            appLevel: "system",
            js: "./js/qqweb.system.module.js",
            windowMode: "none",
            customLoginValidate: !1,
            settingCenter: 0
        },
        shareComponent: {
            id: "shareComponent",
            appName: "shareComponent",
            appType: 1,
            appLevel: "system",
            js: "./module/sharecomponent/main.js",
            css: "./module/sharecomponent/style.css",
            windowMode: "none",
            customLoginValidate: !1,
            settingCenter: 0
        },
        helper: {
            id: "helper",
            appName: "WebQQ\u5c0f\u52a9\u624b",
            appName: "Q+ Web\u5c0f\u52a9\u624b",
            appType: 1,
            appLevel: "system",
            css: "./module/helper/style.css",
            js: "./module/helper/main.js",
            width: 358,
            height: 230,
            right: 5,
            bottom: 5,
            hasCloseButton: !0,
            settingCenter: 0
        },
        bubbleTip: {
            id: "bubbleTip",
            appName: "\u6c14\u6ce1\u63d0\u793a",
            appType: 1,
            appLevel: "system",
            css: "./module/bubbletip/qqweb.app.bubbletip.css",
            js: "./module/bubbletip/qqweb.app.bubbletip.js",
            windowMode: "none"
        },
        qqWebIme: {
            id: "qqWebIme",
            appName: "QQ\u4e91\u8f93\u5165\u6cd5",
            appType: 1,
            appLevel: "system",
            css: "./module/qqwebime/style.css",
            js: "./module/qqwebime/main.js",
            windowMode: "none",
            customLoginValidate: !1,
            click2run: 1,
            quickPanelIcon: "./style/images/pinyin.png",
            settingCenter: 0
        },
        qqHandWrite: {
            id: "qqHandWrite",
            appName: "QQ\u4e91\u624b\u5199\u677f",
            appType: 2,
            appLevel: "system",
            appUrl: qqweb.CONST.MAIN_URL + "module/qqhandwrite/qqhandwrite.html?" + qqweb.CONST.UPDATE_TIME_STAMP,
            hasCloseButton: !0,
            hasMaxButton: !1,
            hasMinButton: !1,
            modeSwitch: !1,
            resize: !1,
            width: 445,
            height: 292,
            right: 1,
            bottom: 1,
            hasToolBar: 0,
            loginLevel: alloy.CONST.LOGIN_LEVEL_NONE
        },
        qqWebDict: {
            id: "qqWebDict",
            appName: "QQ\u4e91\u8bcd\u5178",
            appType: 1,
            appLevel: "system",
            css: "./module/qqwebdict/style.css",
            js: "./module/qqwebdict/main.js",
            windowMode: "none",
            customLoginValidate: !1,
            settingCenter: 0
        },
        appBar: {
            id: "appBar",
            appName: "appBar",
            appType: 1,
            appLevel: "system",
            css: "./module/appbar/qqweb.app.appbar.css",
            js: "./module/appbar/qqweb.app.appbar.js",
            windowMode: "none",
            settingCenter: 0
        },
        appMarket: {
            id: "appMarket",
            appName: "\u5e94\u7528\u5e02\u573a",
            appType: 2,
            appDesc: "\u5e94\u7528\u5e02\u573a\u662fWebQQ\u7ed9\u7f51\u53cb\u6dfb\u52a0\u5e94\u7528\u7684\u5e73\u53f0\uff0c\u63d0\u4f9b\u6700\u70ed\uff0c\u6700\u65b0\u7684\u5e94\u7528\uff0c\u7f51\u53cb\u5206\u4eab\u4e5f\u5c3d\u5728\u5176\u4e2d\u3002",
            appDesc: "\u5e94\u7528\u5e02\u573a\u662fQ+ Web\u7ed9\u7f51\u53cb\u6dfb\u52a0\u5e94\u7528\u7684\u5e73\u53f0\uff0c\u63d0\u4f9b\u6700\u70ed\uff0c\u6700\u65b0\u7684\u5e94\u7528\uff0c\u7f51\u53cb\u5206\u4eab\u4e5f\u5c3d\u5728\u5176\u4e2d\u3002",
            appLevel: "system",
            appUrl: qqweb.CONST.MAIN_URL + "module/appmarket/appmarket.html?" + qqweb.CONST.UPDATE_TIME_STAMP,
            hasCloseButton: !0,
            hasMinButton: !0,
            hasMaxButton: !0,
            modeSwitch: !0,
            resize: !0,
            width: 900,
            height: 570,
            hasToolBar: 0,
            loginLevel: alloy.CONST.LOGIN_LEVEL_NONE,
            quickPanel: 1,
            titleIcon: "http://0.web.qstatic.com/webqqpic/style/images/appmarket_icon.png",
            quickPanelIcon: "./style/images/appmarket.png?20111011001",
            settingCenter: 0
        },
        notifications: {
            id: "notifications",
            appName: "\u901a\u77e5\u8bbe\u7f6e",
            appType: 1,
            appLevel: "system",
            css: "./module/notifications/qqweb.app.notifications.css",
            js: "./module/notifications/qqweb.app.notifications.js",
            hasMinButton: !1,
            hasMaxButton: !1,
            hasOkButton: !0,
            hasCancelButton: !0,
            hasToolBar: 0,
            settingCenter: 0
        },
        themeSetting: {
            id: "themeSetting",
            appName: "\u4e3b\u9898\u8bbe\u7f6e",
            appType: 1,
            appLevel: "system",
            css: "./module/themesetting/qqweb.app.themesetting.css",
            js: "./module/themesetting/qqweb.app.themesetting.js",
            hasMinButton: !1,
            hasMaxButton: !1,
            hasToolBar: 0,
            resize: !1,
            settingCenter: 0
        },
        themeSetting2: {
            id: "themeSetting2",
            appName: "\u4e3b\u98982",
            appType: 1,
            appLevel: "system",
            css: "./module/themesetting2/qqweb.app.themesetting2.css",
            js: "./module/themesetting2/qqweb.app.themesetting2.js",
            hasMinButton: !1,
            hasMaxButton: !1,
            hasToolBar: 0,
            resize: !1,
            windowMode: "none",
            settingCenter: 0
        },
        notifySetting: {
            id: "notifySetting",
            appName: "QQ\u63d0\u9192",
            appType: 1,
            appLevel: "system",
            css: "./module/notifysetting/qqweb.app.notifysetting.css",
            js: "./module/notifysetting/qqweb.app.notifysetting.js",
            hasMinButton: !1,
            hasMaxButton: !1,
            hasOkButton: !0,
            hasCancelButton: !0,
            resize: !1,
            hasToolBar: 0,
            settingCenter: 0
        },
        desktopSetting: {
            id: "desktopSetting",
            appName: "\u684c\u9762\u8bbe\u7f6e",
            appType: 1,
            appLevel: "system",
            css: "./module/desktopsetting/style.css",
            js: "./module/desktopsetting/main.js",
            hasMinButton: !1,
            hasMaxButton: !1,
            hasOkButton: !0,
            hasCancelButton: !0,
            resize: !1,
            minWidth: 600,
            minHeight: 450,
            hasToolBar: 0,
            settingCenter: 0
        },
        hotkeySetting: {
            id: "hotkeySetting",
            appName: "\u70ed\u952e",
            appType: 1,
            appLevel: "system",
            css: "./module/hotkeysetting/qqweb.app.hotkeysetting.css",
            js: "./module/hotkeysetting/qqweb.app.hotkeysetting.js",
            hasMinButton: !1,
            hasMaxButton: !1,
            hasOkButton: !0,
            hasCancelButton: !0,
            resize: !1,
            hasToolBar: 0,
            settingCenter: 0
        },
        ienotification: {
            id: "ienotification",
            appType: 1,
            appLevel: "system",
            appName: "IE\u6d88\u606f\u63d0\u9192",
            css: "./module/ienotification/qqweb.app.ienotification.css",
            js: "./module/ienotification/qqweb.app.ienotification.js",
            windowMode: "none"
        },
        msgBubble: {
            id: "msgBubble",
            appType: 1,
            appLevel: "system",
            appName: "\u6d88\u606f\u8d70\u9a6c\u706f",
            css: "./module/messagebubble/qqweb.app.msgbubble.css",
            js: "./module/messagebubble/qqweb.app.msgbubble.js",
            windowMode: "none",
            settingCenter: 0
        },
        messageManager: {
            id: "messageManager",
            appType: 1,
            appLevel: "system",
            appName: "\u6d88\u606f\u7ba1\u7406\u5668",
            css: "./module/messagemanager/style.css",
            js: "./module/messagemanager/main.js",
            windowMode: "none"
        },
        chatLogViewer: {
            id: "chatLogViewer",
            appName: "\u804a\u5929\u8bb0\u5f55\u7ba1\u7406\u5668",
            appDesc: "WebQQ\u4e3a\u60a8\u63d0\u4f9b\u7684\u7fa4\u804a\u5929\u8bb0\u5f55\u6f2b\u6e38\u670d\u52a1\uff0c\u652f\u6301\u67e5\u770b7\u5929\u5185\u7fa4\u5185\u6d88\u606f\uff0c\u8fd8\u53ef\u4ee5\u76f4\u63a5\u4ece\u804a\u5929\u8bb0\u5f55\u91cc\u548c\u7fa4\u53cb\u53d1\u8d77\u4e34\u65f6\u4f1a\u8bdd\uff0c\u8d76\u5feb\u6765\u4f53\u9a8c\u5427\uff01",
            appDesc: "Q+ Web\u4e3a\u60a8\u63d0\u4f9b\u7684\u7fa4\u804a\u5929\u8bb0\u5f55\u6f2b\u6e38\u670d\u52a1\uff0c\u652f\u6301\u67e5\u770b7\u5929\u5185\u7fa4\u5185\u6d88\u606f\uff0c\u8fd8\u53ef\u4ee5\u76f4\u63a5\u4ece\u804a\u5929\u8bb0\u5f55\u91cc\u548c\u7fa4\u53cb\u53d1\u8d77\u4e34\u65f6\u4f1a\u8bdd\uff0c\u8d76\u5feb\u6765\u4f53\u9a8c\u5427\uff01",
            appType: 1,
            appLevel: "system",
            css: "./module/chatlogviewer/qqweb.app.chatlogviewer.css",
            js: "./module/chatlogviewer/qqweb.app.chatlogviewer.js",
            loginLevel: alloy.CONST.LOGIN_LEVEL_ALL,
            windowMode: "multi",
            needApp: ["eqq"],
            settingCenter: 0
        },
        userDetails: {
            id: "userDetails",
            appName: "\u8be6\u7ec6\u8d44\u6599",
            appType: 1,
            appLevel: "system",
            css: "./module/userdetails/qqweb.app.userdetails.css",
            js: "./module/userdetails/qqweb.app.userdetails.js",
            loginLevel: alloy.CONST.LOGIN_LEVEL_NOCHAT,
            windowMode: "multi",
            hasToolBar: 0,
            needApp: ["eqq"],
            settingCenter: 0
        },
        avatarChanger: {
            id: "avatarChanger",
            appName: "\u66f4\u6362\u5934\u50cf",
            appType: 1,
            appLevel: "system",
            css: "./module/avatarchanger/qqweb.app.avatarchanger.css",
            js: "./module/avatarchanger/qqweb.app.avatarchanger.js",
            loginLevel: alloy.CONST.LOGIN_LEVEL_NOCHAT,
            needApp: ["eqq"],
            width: 550,
            windowType: "EqqWindow",
            height: 395,
            resize: !1,
            hasMinButton: !1,
            hasMaxButton: !1,
            hasOkButton: !0,
            hasCancelButton: !0,
            hasToolBar: 0,
            settingCenter: 0
        },
        groupDetails: {
            id: "groupDetails",
            appName: "\u7fa4\u8be6\u7ec6\u8d44\u6599",
            appType: 1,
            appLevel: "system",
            css: "./module/groupdetails/qqweb.app.groupdetails.css",
            js: "./module/groupdetails/qqweb.app.groupdetails.js",
            loginLevel: alloy.CONST.LOGIN_LEVEL_NOCHAT,
            windowMode: "multi",
            hasToolBar: 0,
            needApp: ["eqq"],
            settingCenter: 0
        },
        groupSystemMsg: {
            id: "groupSystemMsg",
            appName: "\u7fa4\u7cfb\u7edf\u6d88\u606f",
            appType: 1,
            appLevel: "system",
            css: "./module/groupsystemmsg/qqweb.app.groupsystemmsg.css",
            js: "./module/groupsystemmsg/qqweb.app.groupsystemmsg.js",
            loginLevel: alloy.CONST.LOGIN_LEVEL_NOCHAT,
            windowMode: "multi",
            hasToolBar: 0,
            windowType: "EqqWindow",
            needApp: ["eqq"],
            settingCenter: 0
        },
        appIntroduce: {
            id: "appIntroduce",
            appType: 1,
            appName: "\u5e94\u7528\u4ecb\u7ecd",
            appLevel: "system",
            appDesc: "\u5728\u8fd9\u91cc\uff0c\u5e94\u7528\u4ecb\u7ecd",
            provider: "Tencent \u817e\u8baf",
            ver: "1.0",
            css: "./module/appintroduce/qqweb.app.appintroduce.css",
            js: "./module/appintroduce/qqweb.app.appintroduce.js",
            loginLevel: alloy.CONST.LOGIN_LEVEL_NOCHAT,
            width: 620,
            height: 500,
            windowMode: "multi",
            hasToolBar: 0,
            resize: !1,
            hasMinButton: !1,
            hasMaxButton: !1,
            settingCenter: 0
        },
        buddyAdder: {
            id: "buddyAdder",
            appName: "\u6dfb\u52a0\u597d\u53cb",
            appType: 1,
            appLevel: "system",
            css: "./module/buddyadder/qqweb.app.buddyadder.css",
            js: "./module/buddyadder/qqweb.app.buddyadder.js",
            loginLevel: alloy.CONST.LOGIN_LEVEL_ALL,
            windowMode: "multi",
            windowType: "EqqWindow",
            hasToolBar: 0,
            needApp: ["eqq"],
            settingCenter: 0
        },
        buddyFinder: {
            id: "buddyFinder",
            appName: "\u67e5\u627e\u597d\u53cb/\u7fa4",
            appDesc: "WebQQ\u4e3a\u4f60\u63d0\u4f9b\u7684\u67e5\u627eQQ\u7fa4\u670d\u52a1\uff0c\u652f\u6301\u901a\u8fc7\u7fa4\u53f7\u7801\uff0c\u5173\u952e\u5b57\u67e5\u627e\u60a8\u6240\u9700\u8981\u7684\u7fa4\u3002\u8be5\u670d\u52a1\u9700\u8981\u767b\u9646QQ\u624d\u80fd\u4f7f\u7528\u3002",
            appDesc: "Q+ Web\u4e3a\u4f60\u63d0\u4f9b\u7684\u67e5\u627eQQ\u7fa4\u670d\u52a1\uff0c\u652f\u6301\u901a\u8fc7\u7fa4\u53f7\u7801\uff0c\u5173\u952e\u5b57\u67e5\u627e\u60a8\u6240\u9700\u8981\u7684\u7fa4\u3002\u8be5\u670d\u52a1\u9700\u8981\u767b\u9646QQ\u624d\u80fd\u4f7f\u7528\u3002",
            appType: 1,
            appLevel: "system",
            css: "./module/buddyfinder/qqweb.app.buddyfinder.css",
            js: "./module/buddyfinder/qqweb.app.buddyfinder.js",
            loginLevel: alloy.CONST.LOGIN_LEVEL_ALL,
            width: 540,
            height: 362,
            modeSwitch: !1,
            resize: !1,
            hasMinButton: !1,
            hasToolBar: 0,
            hasMaxButton: !1,
            hasNextButton: !0,
            windowType: "EqqWindow",
            hasCancelButton: !0,
            needApp: ["eqq"],
            settingCenter: 0
        },
        screenLocker: {
            id: "screenLocker",
            appName: "\u9501\u5c4f",
            appType: 1,
            appLevel: "system",
            css: "./module/screenlocker/qqweb.app.screenlocker.css",
            js: "./module/screenlocker/qqweb.app.screenlocker.js",
            windowMode: "none",
            hasToolBar: 0,
            settingCenter: 0
        },
        screenCapture: {
            id: "screenCapture",
            appName: "\u622a\u5c4f",
            appType: 1,
            appLevel: "system",
            css: "./module/screencapture/qqweb.app.screencapture.css",
            js: "./module/screencapture/qqweb.app.screencapture.js",
            windowMode: "none",
            settingCenter: 0
        },
        screenCapture2: {
            id: "screenCapture2",
            appName: "webtop\u622a\u5c4f",
            appType: 1,
            appLevel: "system",
            css: "./module/screencapture2/style.css",
            js: "./module/screencapture2/main.js",
            windowMode: "none",
            settingCenter: 0
        },
        settingCenter: {
            id: "settingCenter",
            appName: "\u7cfb\u7edf\u8bbe\u7f6e",
            appType: 1,
            appLevel: "system",
            css: "./module/settingcenter/qqweb.app.settingcenter.css",
            js: "./module/settingcenter/qqweb.app.settingcenter.js",
            hasCloseButton: !0,
            hasMinButton: !1,
            hasMaxButton: !1,
            resize: !1,
            hasToolBar: 0,
            settingCenter: 0
        },
        explorer: {
            id: "explorer",
            appName: "\u8d44\u6e90\u7ba1\u7406\u5668",
            appType: 1,
            appLevel: "system",
            css: "./module/explorer/style.css",
            js: "./module/explorer/main.js",
            hasCloseButton: !0,
            hasMinButton: !0,
            hasMaxButton: !0,
            resize: !0,
            hasToolBar: 0,
            settingCenter: 0,
            windowMode: "multi"
        },
        diskExplorer: {
            id: "diskExplorer",
            appName: "\u6211\u7684\u7f51\u76d8",
            appType: 1,
            appLevel: "system",
            css: "./module/diskexplorer/style.css",
            js: "./module/diskexplorer/main.js",
            hasCloseButton: !0,
            hasMinButton: !0,
            hasMaxButton: !0,
            resize: !0,
            hasToolBar: 0,
            settingCenter: 0,
            windowMode: "multi"
        },
        layoutSaver: {
            id: "layoutSaver",
            appName: "\u8bb0\u5fc6\u684c\u9762\u5e03\u5c40",
            appType: 1,
            appLevel: "system",
            css: "./module/layoutsaver/qqweb.app.layoutsaver.css",
            js: "./module/layoutsaver/qqweb.app.layoutsaver.js",
            windowMode: "none",
            settingCenter: 0
        },
        sceneChristmas: {
            id: "sceneChristmas",
            appName: "\u5723\u8bde\u5feb\u4e50",
            appType: 1,
            appLevel: "system",
            css: "./scene/christmas/style.css",
            js: "./scene/christmas/main.js",
            settingCenter: 0
        },
        gravity: {
            id: "gravity",
            appName: "\u83ca\u82b1",
            appType: 1,
            appLevel: "system",
            css: "./scene/gravity/style.css",
            js: "./scene/gravity/main.js",
            settingCenter: 0
        },
        urlSave: {
            id: "urlSave",
            appType: 1,
            appName: "\u4e00\u952e\u53e6\u5b58\u4e3a\u5e94\u7528",
            appLevel: "system",
            appDesc: "\u5728\u8fd9\u91cc\uff0c\u4e00\u952e\u53e6\u5b58\u4e3a",
            ver: "1.0",
            css: "./module/urlsave/qqweb.app.urlsave.css",
            js: "./module/urlsave/qqweb.app.urlsave.js",
            loginLevel: alloy.CONST.LOGIN_LEVEL_NOCHAT,
            width: 688,
            height: 398,
            hasMinButton: !1,
            hasMaxButton: !1,
            resize: !1,
            hasOkButton: !0,
            hasCancelButton: !0,
            hasToolBar: 0,
            settingCenter: 0
        },
        activityGameCollection: {
            id: "activityGameCollection",
            appName: "WebGame\u5927\u96c6\u5408",
            appDesc: "WebGame\u5927\u96c6\u5408,\u7cbe\u9009WebGame,\u7545\u4eab\u5a31\u4e50",
            appType: 1,
            appLevel: "system",
            css: "./activity/gamecollection/style.css",
            js: "./activity/gamecollection/main.js",
            hasCloseButton: !0,
            hasMinButton: !1,
            hasToolBar: 0,
            width: 740,
            height: 530,
            loginLevel: alloy.CONST.LOGIN_LEVEL_NONE,
            settingCenter: 0
        },
        activityChildsday: {
            id: "activityChildsday",
            appName: "\u513f\u7ae5\u8282\u5927\u96c6\u5408",
            appDesc: "\u513f\u7ae5\u8282\u5927\u96c6\u5408,\u7545\u4eab\u5a31\u4e50",
            appType: 1,
            appLevel: "system",
            css: "./activity/childsday/style.css",
            js: "./activity/childsday/main.js",
            hasCloseButton: !0,
            hasMinButton: !1,
            hasToolBar: 0,
            width: 940,
            height: 550,
            loginLevel: alloy.CONST.LOGIN_LEVEL_NONE,
            settingCenter: 0
        },
        activity3366: {
            id: "activity3366",
            appName: "3366\u6d3b\u52a8",
            appDesc: "3366\u6d3b\u52a8",
            appType: 1,
            appLevel: "system",
            css: "./activity/3366/style.css",
            js: "./activity/3366/main.js",
            hasCloseButton: !0,
            hasMinButton: !1,
            hasToolBar: 0,
            width: 940,
            height: 550,
            loginLevel: alloy.CONST.LOGIN_LEVEL_NONE,
            settingCenter: 0
        },
        restoreSetting: {
            id: "restoreSetting",
            appName: "\u7cfb\u7edf\u8fd8\u539f",
            appType: 1,
            appLevel: "system",
            css: "./module/restoresetting/style.css",
            js: "./module/restoresetting/main.js",
            hasMinButton: !1,
            hasMaxButton: !1,
            hasOkButton: !0,
            hasCancelButton: !0,
            resize: !1,
            hasToolBar: 0,
            settingCenter: 0
        },
        mapLocation: {
            id: "mapLocation",
            appName: "html5\u5730\u56fe\u5b9a\u4f4d",
            appType: 2,
            x: 1,
            y: 420,
            appDesc: "html5\u5730\u56fe\u5b9a\u4f4d",
            appLevel: "system",
            appUrl: qqweb.CONST.MAIN_URL + "module/maplocation/maplocation.html",
            width: 224,
            height: 185,
            windowType: "widget",
            hasToolBar: 0,
            loginLevel: alloy.CONST.LOGIN_LEVEL_NONE,
            settingCenter: 0
        },
        selectBuddy: {
            id: "selectBuddy",
            appName: "\u9009\u62e9\u8054\u7cfb\u4eba",
            appDesc: "\u9009\u62e9\u8054\u7cfb\u4eba",
            appType: 1,
            appLevel: "system",
            css: "./module/selectbuddy/style.css",
            js: "./module/selectbuddy/main.js",
            loginLevel: alloy.CONST.LOGIN_LEVEL_NOCHAT,
            windowMode: "multi",
            settingCenter: 0
        },
        99999: {
            id: "99999",
            appName: "\u89c6\u9891\u804a\u5929",
            appType: 2,
            width: 384,
            height: 320,
            hasMinButton: !1,
            hasMaxButton: !1,
            appLevel: "system",
            appUrl: "http://vcall.hehehi.com",
            hasToolBar: 0,
            powerLevel: 3
        },
        cloud: {
            id: "cloud",
            appName: "\u4e91\u6735",
            appType: 1,
            appLevel: "system",
            css: "./scene/cloud/style.css",
            js: "./scene/cloud/main.js",
            settingCenter: 0
        },
        activitySaturday: {
            id: "activitySaturday",
            appName: "\u793c\u62dc\u516d\u56e2\u961f\u4e13\u8bbf",
            appDesc: "\u793c\u62dc\u516d\u56e2\u961f\u4e13\u8bbf\u3002",
            appType: 1,
            appLevel: "system",
            css: "./activity/saturday/style.css",
            js: "./activity/saturday/main.js",
            hasCloseButton: !0,
            hasMinButton: !1,
            hasMaxButton: !0,
            resize: !0,
            hasToolBar: 0,
            width: 900,
            height: 550,
            loginLevel: alloy.CONST.LOGIN_LEVEL_NONE,
            settingCenter: 0
        },
        activityXindongfang: {
            id: "activityXindongfang",
            appName: "\u6dfb\u52a0\u65b0\u4e1c\u65b9\u5e94\u7528\uff0c\u8d62\u53d6\u8d2d\u8bfe\u4ee3\u91d1\u5238",
            appDesc: "\u6dfb\u52a0\u65b0\u4e1c\u65b9\u5e94\u7528\uff0c\u8d62\u53d6\u8d2d\u8bfe\u4ee3\u91d1\u5238",
            appType: 1,
            appLevel: "system",
            css: "./activity/xindongfang/style.css",
            js: "./activity/xindongfang/main.js",
            hasCloseButton: !0,
            hasMinButton: !1,
            hasMaxButton: !0,
            hasToolBar: 0,
            width: 780,
            height: 530,
            loginLevel: alloy.CONST.LOGIN_LEVEL_NONE,
            settingCenter: 0
        },
        appGrant: {
            id: "appGrant",
            appName: "\u5e94\u7528\u6388\u6743",
            appType: 1,
            appLevel: "system",
            css: "./module/appgrant/qqweb.app.grant.css",
            js: "./module/appgrant/qqweb.app.grant.js",
            windowMode: "none",
            hasToolBar: 0,
            settingCenter: 0
        },
        imgViewer: {
            id: "imgViewer",
            appName: "Q+ Web\u56fe\u7247\u64ad\u653e\u5668",
            appDesc: "Q+ Web\u56fe\u7247\u64ad\u653e\u5668",
            appType: 1,
            css: "./module/imgviewer/qqweb.img.viewer.css",
            js: "./module/imgviewer/qqweb.img.viewer.js",
            hasToolBar: 0,
            width: 760,
            height: 502,
            minWidth: 390,
            minHeight: 155,
            loginLevel: alloy.CONST.LOGIN_LEVEL_NONE,
            quickPanel: 1,
            settingCenter: 0
        },
        docViewer: {
            id: "docViewer",
            appName: "Q+ Web\u6587\u6863\u6d4f\u89c8\u5668",
            appDesc: "Q+ Web\u6587\u6863\u6d4f\u89c8\u5668",
            appType: 2,
            appUrl: qqweb.CONST.MAIN_URL + "module/docviewer/docviewer.html",
            hasToolBar: 0,
            width: 1E3,
            height: 540,
            minWidth: 300,
            minHeight: 320,
            exinfo: {
                powerLevel: 20
            },
            powerLevel: 20,
            quickPanel: 1,
            loginLevel: alloy.CONST.LOGIN_LEVEL_NONE,
            settingCenter: 0
        },
        audioPlayer: {
            id: "audioPlayer",
            appName: "Q+ Web\u97f3\u9891\u64ad\u653e\u5668",
            appDesc: "Q+ Web\u97f3\u9891\u64ad\u653e\u5668",
            appType: 2,
            appUrl: qqweb.CONST.MAIN_URL + "module/audioplayer/audioplayer.html?" + qqweb.CONST.UPDATE_TIME_STAMP,
            windowType: "widget",
            hasToolBar: 0,
            hasMinButton: !0,
            hasMaxButton: !1,
            width: 228,
            height: 84,
            loginLevel: alloy.CONST.LOGIN_LEVEL_NONE,
            quickPanel: 1,
            quickPanelIcon: "./style/images/audioplayer.gif",
            settingCenter: 0,
            powerLevel: 200,
            exinfo: {
                powerLevel: 200
            }
        },
        messageCenter: {
            id: "messageCenter",
            appName: "\u6d88\u606f\u4e2d\u5fc3",
            appDesc: "Q+ Web \u6d88\u606f\u4e2d\u5fc3",
            appType: 2,
            appLevel: "system",
            appUrl: qqweb.CONST.MAIN_URL + "module/messagecenter/messagecenter.html?" + qqweb.CONST.UPDATE_TIME_STAMP,
            hasCloseButton: !0,
            hasMinButton: !0,
            hasMaxButton: !1,
            modeSwitch: !0,
            resize: !1,
            width: 640,
            height: 482,
            hasToolBar: 0,
            loginLevel: alloy.CONST.LOGIN_LEVEL_NOCHAT,
            settingCenter: 0,
            quickPanel: 1
        }
    };
    this.getAppConfigList = function () {
        return this.appConfigList
    };
    this.getAllConfig = function (a) {
        return u(a, this.appConfigList) || u(a, this.systemConfigList)
    };
    this.getAppConfig = function (b) {
        if ((b = u(b, this.appConfigList)) && (a.isUndefined(b.id) || a.isUndefined(b.appName))) b = null, alloy.util.report2m(151399);
        return b
    };
    this.getSystemConfig = function (a) {
        return u(a, this.systemConfigList)
    };
    this.isAppConfigLoad = function () {
        return k
    };
    var u = function (a, b) {
        if (a && a.call) {
            var c = [],
                d;
            for (d in b) {
                var g = b[d];
                a(g) && c.push(g)
            }
            return c
        } else return b[a]
    };
    this.clearConfig = function () {
        this.appConfigList = {}
    };
    this.addAppConfigList = function (d) {
        var g = d.result.resultData;
        a.profile("AddAppConfigList");
        for (var k in g) g[k] ? g[k].isDel ? (alloy.config.setDeleteAppList(g[k].id), delete g[k]) : (g[k].title = g[k].appName, g[k].type = g[k].appType, a.extend(g[k], g[k].exinfo)) : delete g[k];
        a.extend(this.appConfigList, g);
        a.profile("AddAppConfigListEnd");
        b.notifyObservers(c, "AddAppConfigList", d)
    };
    this.addAppConfig = function (d) {
        a.profile("addAppConfig");
        this.appConfigList[d.id] = a.extend(d, d.exinfo);
        var g = {
            appid: d.id,
            value: 1,
            type: 0
        };
        d.id < 1E5 && v(g);
        b.notifyObservers(c, "AddAppConfig", d);
        if ((g = alloy.system.getApp("appMarket")) && g._iframe) g._iframe.contentWindow.appMarket.onAddAppConfig(d)
    };
    this.addAppConfigTemp = function (b) {
        a.profile("addAppConfig Temp");
        this.appConfigList[b.id] = a.extend(b, b.exinfo)
    };
    this.updateAppConfig = function (d) {
        a.profile("updateAppConfig");
        this.appConfigList[d.id] = d;
        b.notifyObservers(c, "UpdateAppConfig", d)
    };
    this.removeAppConfig = function (d) {
        a.profile("removeAppConfig");
        delete this.appConfigList[d.id];
        var g = {
            appid: d.id,
            value: -1,
            type: 0
        };
        d.id < 1E5 && v(g);
        b.notifyObservers(c, "RemoveAppConfig", d);
        if ((g = alloy.system.getApp("appMarket")) && g._iframe) g._iframe.contentWindow.appMarket.onRemoveAppConfig(d)
    };
    this.setNewSystemAppCount = function (a) {
        o = a
    };
    this.setNewAllAppCount = function (a) {
        t = a
    };
    this.getNewSystemAppCount = function () {
        return o
    };
    this.getNewAllAppCount = function () {
        return t
    };
    this.isQplusApp = function (a) {
        if (isNaN(a)) return !1;
        a = c.getAppConfig(a);
        return !a ? !1 : (a = a.gaid) && a >= 2E8 && a < 3E8 ? !0 : !1
    };
    var v = function (d) {
        alloy.config.isSetupAppListLoaded() && alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + "cgi/qqweb/market/updateapphot.do", {
            context: c,
            method: "POST",
            data: {
                appattrib: a.json.stringify(d),
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            arguments: d,
            onSuccess: function (b) {
                b.retcode !== 0 && a.out("\u5e94\u7528\u6b21\u6570\u6dfb\u52a0\u5931\u8d25" + b.errmsg)
            },
            onError: function (d) {
                a.out("\u5e94\u7528\u6b21\u6570\u6dfb\u52a0\u5931\u8d25");
                b.notifyObservers(c, "SetAppCountError", d)
            }
        })
    }, s = function (f, h) {
        alloy.rpcService.cgiSend(alloy.CONST.JAVA_CGI_URL + h, {
            context: c,
            method: "POST",
            arguments: f.appid,
            timeout: 2E4,
            data: {
                appattrib: a.json.stringify(f),
                vfwebqq: alloy.portal.getVfWebQQ()
            },
            onSuccess: function (n) {
                if (n.retcode === 0) if (typeof progress == "function" && progress("get_appinfo end"), alloy.util.report2qqweb("config|appconfig|success"), g) alloy.util.report2h("get_def_appinfo", "end"), this.addAppConfigList(n), d.setItem("UPDATE_TIME_STAMP", alloy.CONST.UPDATE_TIME_STAMP), d.setItem("defaultAppConfig", a.json.stringify(c.getAppConfigList())), b.notifyObservers(c, "GetDefaultAppConfigComplete", this.getAppConfigList()), a.profile("\u9ed8\u8ba4app config\u5b8c\u6210"),
                alloy.util.report2h("def_appinfo", "end");
                else {
                    alloy.util.report2h("get_appinfo", "end");
                    b.notifyObservers(c, "GetAppConfigAsPartSuccess", n.result);
                    l++;
                    var m = alloy.config.getSetupAppList(),
                        o = l * 100,
                        e = (l + 1) * 100;
                    this.addAppConfigList(n);
                    o < m.length ? (m = m.slice(o, e), s({
                        appid: m,
                        loadMethod: 3,
                        val: ["appName", "appType", "appUrl", "iconUrl", "id", "category", "exinfo", "al"]
                    }, "keycgi/qqweb/market/getappinfonew.do")) : (k = !0, a.isUndefined(n.userflag) || alloy.portal.setIsNewUser(n.userflag == 0 ? !0 : !1), b.notifyObservers(c, "GetAppConfigComplete",
                    this.getAppConfigList()), alloy.portal.speedTest.sRTS(5, "end", new Date, !0), a.profile("\u81ea\u5b9a\u4e49app config\u5b8c\u6210"))
                } else n.retcode == 1E5 ? (timeoutConfirm("\u767b\u5f55\u4fe1\u606f\u8d85\u65f6,\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f"), alloy.util.report2qqweb("config|appconfig|logintimeout"), r < 1 ? (++r, s(f, h)) : (timeoutConfirm("\u767b\u5f55\u4fe1\u606f\u8d85\u65f6,\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f"), alloy.util.report2qqweb("config|appconfig|logintimeout"))) : (timeoutConfirm("\u83b7\u53d6\u5e94\u7528\u4fe1\u606f\u51fa\u9519,\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f"),
                alloy.util.report2qqweb("config|appconfig|reterror"), b.notifyObservers(c, "GetAppConfigError", n.resutlt), a.error("get app config \u8fd4\u56de\u7ed3\u679c\u4e0d\u6b63\u786e. data: " + n, "AppConfig"), r < 1 ? (++r, s(f, h)) : (timeoutConfirm("\u83b7\u53d6\u5e94\u7528\u4fe1\u606f\u51fa\u9519,\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f"), alloy.util.report2qqweb("config|appconfig|reterror"), b.notifyObservers(c, "GetAppConfigError", n.resutlt), a.error("get app config \u8fd4\u56de\u7ed3\u679c\u4e0d\u6b63\u786e. data: " + n, "AppConfig")));
                qqweb.util.report2h("appinfo", "end", ["ok"][n.retcode] || n.retcode)
            },
            onError: function (d) {
                a.profile("GetAppConfigError");
                qqweb.util.report2h(g ? "def_appinfo" : "appinfo", "end", "error");
                b.notifyObservers(c, "GetAppConfigError", d.resutlt);
                timeoutConfirm("\u83b7\u53d6\u5e94\u7528\u4fe1\u606f\u51fa\u9519,\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f");
                alloy.util.report2qqweb("config|appconfig|error");
                r < 1 ? (++r, s(f, h)) : (qqweb.util.report2h(g ? "def_appinfo" : "appinfo", "end", "error"), b.notifyObservers(c, "GetAppConfigError", d.resutlt), timeoutConfirm("\u83b7\u53d6\u5e94\u7528\u4fe1\u606f\u51fa\u9519,\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f"), alloy.util.report2qqweb("config|appconfig|error"))
            },
            onTimeout: function (a) {
                timeoutConfirm("\u83b7\u53d6\u5e94\u7528\u4fe1\u606f\u8d85\u65f6,\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f");
                alloy.util.report2qqweb("config|appconfig|timeout");
                b.notifyObservers(c, "GetAppConfigError", a.resutlt);
                qqweb.util.report2h(g ? "def_appinfo" : "appinfo", "end", "timeout");
                r < 1 ? (++r, s(f,
                h)) : (timeoutConfirm("\u83b7\u53d6\u5e94\u7528\u4fe1\u606f\u8d85\u65f6,\u662f\u5426\u5237\u65b0\u91cd\u8bd5\uff1f"), alloy.util.report2qqweb("config|appconfig|timeout"), b.notifyObservers(c, "GetAppConfigError", a.resutlt), qqweb.util.report2h(g ? "def_appinfo" : "appinfo", "end", "timeout"))
            }
        })
    }, m = {
        onAlloyReady: function () {
            a.profile("UACReady\uff1a" + alloy.config.isSetupAppListLoaded());
            if (alloy.config.isSetupAppListLoaded()) if (k) b.notifyObservers(c, "GetAppConfigComplete");
            else {
                b.notifyObservers(c, "ClearDefaultApp");
                var f;
                f = alloy.config.getSetupAppList();
                c.clearConfig();
                g = !1;
                l = 0;
                f = f.slice(0, 100);
                a.profile("\u62c9\u53d6\u81ea\u5b9a\u4e49app config");
                alloy.util.report2h("appinfo", "start");
                typeof progress == "function" && progress("get_appinfo start");
                s({
                    appid: f,
                    loadMethod: 3,
                    val: ["appName", "appType", "appUrl", "iconUrl", "id", "category", "exinfo", "al", "gaid"]
                }, "keycgi/qqweb/market/getappinfonew.do")
            } else {
                g = !0;
                a.profile("\u62c9\u53d6\u9ed8\u8ba4app config", a.console.TYPE.WARNING);
                alloy.util.report2h("def_appinfo", "start");
                typeof progress == "function" && progress("get_def_appinfo start");
                if (d.getItem("UPDATE_TIME_STAMP") == alloy.CONST.UPDATE_TIME_STAMP && (f = d.getItem("defaultAppConfig"))) {
                    c.appConfigList = a.json.parse(f);
                    b.notifyObservers(c, "GetDefaultAppConfigComplete", c.getAppConfigList());
                    a.profile("\u9ed8\u8ba4app config\u5b8c\u6210");
                    alloy.util.report2h("def_appinfo", "end");
                    return
                }
                s({
                    appid: alloy.config.getDefaultSetupAppList(),
                    loadMethod: 3,
                    val: ["appName", "appType", "appUrl", "iconUrl", "id", "category", "exinfo", "al", "gaid"]
                }, "keycgi/qqweb/market/getdefaultappinfonew.do")
            }
        },
        onReset: function () {
            k = !1
        }
    };
    b.addObserver(alloy.portal, "reset", m.onReset);
    b.addObserver(alloy.portal, "AlloyReady", m.onAlloyReady)
});
Jx().$package("alloy.hotkeyManager", function (a) {
    var c = a.event,
        b = this,
        d = !0,
        g = !1,
        k = {
            eqq_chatbox_read: {
                id: "eqq_chatbox_read",
                name: "\u63d0\u53d6\u6700\u65b0\u6d88\u606f",
                limit: !0,
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 90,
                    des: "Ctrl + Alt + Z"
                }, {
                    ctrlKey: 0,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 87,
                    des: "Alt + W"
                }]
            },
            eqq_chatbox_sendmsg: {
                id: "eqq_chatbox_sendmsg",
                name: "\u53d1\u9001\u6d88\u606f",
                limit: !0,
                mutexKeys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 0,
                    keyCode: 13,
                    selected: !0,
                    des: "Ctrl + Enter"
                }, {
                    ctrlKey: 0,
                    shiftKey: 0,
                    altKey: 0,
                    keyCode: 13,
                    des: "Enter"
                }],
                keys: [{
                    ctrlKey: 0,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 83,
                    des: "Alt + S"
                }]
            },
            eqq_chatbox_classall: {
                id: "eqq_chatbox_classall",
                name: "\u5173\u95ed\u6240\u6709\u804a\u5929\u7a97\u53e3",
                limit: !0,
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 67,
                    des: "Ctrl + Alt + C"
                }]
            },
            open_msg_manager: {
                id: "open_msg_manager",
                name: "\u6253\u5f00\u6d88\u606f\u7ba1\u7406\u5668",
                limit: !0,
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 83,
                    des: "Ctrl + Alt + S"
                }]
            },
            layout_window_current_close: {
                id: "layout_window_current_close",
                name: "\u5173\u95ed\u5f53\u524d\u7a97\u53e3",
                disable: !1,
                keys: [{
                    ctrlKey: 0,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 67,
                    des: "Alt + C"
                }]
            },
            layout_window_closeall: {
                id: "layout_window_closeall",
                name: "\u5173\u95ed\u6240\u6709\u5e94\u7528\u7a97\u53e3",
                limit: !0,
                keys: [{
                    ctrlKey: 0,
                    shiftKey: 1,
                    altKey: 1,
                    keyCode: 81,
                    des: "Alt + Shift + Q"
                }]
            },
            layout_window_goleft: {
                id: "layout_window_goleft",
                name: "\u5207\u6362\u5230\u4e0a\u4e00\u4e2a\u7a97\u53e3",
                limit: !0,
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 0,
                    keyCode: 37,
                    des: "Ctrl + \u2190"
                }]
            },
            layout_window_goright: {
                id: "layout_window_goright",
                name: "\u5207\u6362\u5230\u4e0b\u4e00\u4e2a\u7a97\u53e3",
                limit: !0,
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 0,
                    keyCode: 39,
                    des: "Ctrl + \u2192"
                }]
            },
            layout_showdesktop: {
                id: "layout_showdesktop",
                name: "\u663e\u793a\u684c\u9762",
                limit: !0,
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 68,
                    des: "Ctrl + Alt + D"
                }]
            },
            layout_screencaptrue: {
                id: "layout_screencaptrue",
                name: "\u622a\u5c4f",
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 65,
                    des: "Ctrl + Alt + A"
                }, {
                    ctrlKey: 1,
                    shiftKey: 1,
                    altKey: 1,
                    keyCode: 65,
                    des: "Ctrl + Shift + Alt + A"
                }]
            },
            layout_lock: {
                id: "layout_lock",
                name: "\u9501\u5b9a",
                limit: !0,
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 76,
                    des: "Ctrl + Alt + L"
                }]
            },
            layout_exit: {
                id: "layout_exit",
                name: "\u6ce8\u9500",
                limit: !0,
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 69,
                    des: "Ctrl + Alt + E"
                }]
            },
            layout_desktop_goleft: {
                id: "layout_desktop_goleft",
                name: "\u5207\u6362\u5230\u4e0a\u4e00\u4e2a\u684c\u9762",
                limit: !0,
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 37,
                    des: "Ctrl + Alt + \u2190"
                }]
            },
            layout_desktop_goright: {
                id: "layout_desktop_goright",
                name: "\u5207\u6362\u5230\u4e0b\u4e00\u4e2a\u684c\u9762",
                limit: !0,
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 39,
                    des: "Ctrl + Alt + \u2192"
                }]
            },
            layout_desktop_gospecific: {
                id: "layout_desktop_gospecific",
                name: "\u5207\u6362\u5230\u6307\u5b9a\u684c\u9762",
                limit: !0,
                des: "Ctrl + Alt + (1/2/3/4/5)",
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 49,
                    des: "Ctrl + Alt + 1"
                }, {
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 50,
                    des: "Ctrl + Alt + 2"
                }, {
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 51,
                    des: "Ctrl + Alt + 3"
                }, {
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 52,
                    des: "Ctrl + Alt + 4"
                }, {
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 53,
                    des: "Ctrl + Alt + 5"
                }, {
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 97,
                    des: "Ctrl + Alt + 1"
                }, {
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 98,
                    des: "Ctrl + Alt + 2"
                }, {
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 99,
                    des: "Ctrl + Alt + 3"
                }, {
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 100,
                    des: "Ctrl + Alt + 4"
                }, {
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 101,
                    des: "Ctrl + Alt + 5"
                }]
            },
            layout_desktop_gosystem: {
                id: "layout_desktop_gosystem",
                name: "\u5feb\u901f\u6536\u8d77Q+ Web\u684c\u9762",
                limit: !0,
                disable: !0,
                des: "F2",
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 48,
                    des: "Ctrl + Alt + 0"
                }, {
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 96,
                    des: "Ctrl + Alt + 0"
                }, {
                    ctrlKey: 0,
                    shiftKey: 0,
                    altKey: 0,
                    keyCode: 113,
                    des: "F2"
                }, {
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 192,
                    des: "Ctrl + Alt + `"
                }]
            },
            layout_desktop_manage: {
                id: "layout_desktop_manage",
                name: "\u5168\u5c40\u89c6\u56fe",
                limit: !0,
                keys: [{
                    ctrlKey: 1,
                    shiftKey: 0,
                    altKey: 1,
                    keyCode: 38,
                    des: "Ctrl + Alt + \u2191"
                }]
            }
        };
    this.addHotkeyInfo = function (a) {
        k[a.id] = a
    };
    this.getHotkeyInfo = function (a) {
        return k[a]
    };
    this.setHotkeyInfo = function (a, b) {
        k[a] = b
    };
    this.removeHotkeyInfo = function (a) {
        return k[a] ? (k[a] = null, delete k[a], !0) : !1
    };
    this.setHotkeyState = function (a) {
        d = a;
        c.notifyObservers(alloy.hotkeyManager, "hotkeyStateChanged", a)
    };
    this.isHotkeyEnable = function () {
        return d
    };
    this.setHotkeyLimitState = function (a) {
        g = a
    };
    this.isHotkeyLimited = function () {
        return g
    };
    this.setSendHotKey = function (a) {
        var c = b.getHotkeyInfo("eqq_chatbox_sendmsg");
        a.toString() == "true" ? (c.mutexKeys[0].selected = !1, c.mutexKeys[1].selected = !0) : (c.mutexKeys[0].selected = !0, c.mutexKeys[1].selected = !1);
        alloy.config.configList.isNotNeedCtrlKey = a
    };
    var l = function () {
        var a = alloy.config.configList.isNotNeedCtrlKey;
        a && b.setSendHotKey(a)
    };
    this.init = function () {
        c.addObserver(alloy.portal, "UACReady", l)
    }
});
Jx().$package("alloy.hotkey", function (a) {
    var c = this,
        b = a.dom,
        d = "\u622a\u5c4f",
        g = !1,
        k = new a.Class({
            hotkeyctrl: null,
            init: function () {
                if (this.detectPlugin()) if (a.browser.ie) {
                    var c = document.createElement("div");
                    b.addClass(c, "hidden_div");
                    c.innerHTML = '<object id="hotkeyctrlid" CLASSID="CLSID:E9E96A86-4CEC-4DBF-A5A2-37C8C7E66F1A" ></object>';
                    document.body.appendChild(c);
                    this.hotkeyctrl = document.getElementById("hotkeyctrlid").object
                } else if (a.browser.firefox) c = document.createElement("div"), b.addClass(c, "hidden_div"),
                c.innerHTML = '<embed id="hotkeyctrlid" type="application/tencent-WebQQ-hotkey" hidden="true"></embed>', document.body.appendChild(c), this.hotkeyctrl = document.getElementById("hotkeyctrlid");
                else if (a.browser.chrome) c = document.createElement("div"), b.addClass(c, "hidden_div"), c.innerHTML = '<embed id="hotkeyctrlid" type="application/tencent-webqq-hotkey" hidden="true"></embed>', document.body.appendChild(c), this.hotkeyctrl = document.getElementById("hotkeyctrlid")
            },
            install: function () {
                if ((a.browser.ie || a.browser.firefox || a.browser.chrome) && this.detectPlugin()) {
                    var b = this.reghotkey(1, 3, 65);
                    b ? d = "\u622a\u5c4f(Ctrl + Alt + A)" : (b = this.reghotkey(1, 7, 65)) && (d = "\u622a\u5c4f(Ctrl + Alt + Shift + A)");
                    if (b) return this.regCallback(function () {
                        alloy.portal.runApp("screenCapture")
                    }), alloy.layout.removeHotKeyAction("layout_screencaptrue"), !0;
                    else setTimeout(function () {}, 1E3)
                }
                return !1
            },
            hotKeyBusy: function () {
                alloy.windowFactory.createWindow("Window", {
                    title: "\u6e29\u99a8\u63d0\u793a",
                    modeSwitch: !0,
                    dragable: !0,
                    resize: !0,
                    width: 380,
                    height: 120,
                    hasCloseButton: !0,
                    hasOkButton: !0,
                    isSetCentered: !0
                }).setHtml('<div style="width:100%; height:100%; background-color:#FFFFFF; line-height:60px;text-align:center; vertical-align:middle;">\t\t\t\t\t\t\t\u622a\u5c4f\u5feb\u6377\u952e\u5df2\u88ab\u5176\u4ed6\u7a0b\u5e8f\u5360\u7528,\u82e5\u8981\u8fdb\u884c\u622a\u5c4f,\u8bf7\u624b\u52a8\u70b9\u51fb\u622a\u5c4f\u6309\u94ae!\t\t\t\t\t\t   </div>')
            },
            detectPlugin: function () {
                try {
                    if (new ActiveXObject("hotkeyctrl.Hotkey")) return !0
                } catch (a) {
                    var b = navigator.mimeTypes["application/tencent-WebQQ-hotkey"];
                    if (b) {
                        if (b = b.enabledPlugin) return !0
                    } else {
                        if (b = navigator.mimeTypes["application/tencent-webqq-hotkey"]) if (b = b.enabledPlugin) return !0;
                        return !1
                    }
                }
            },
            reghotkey: function (a, b, c) {
                if (this.hotkeyctrl) return 0 == this.hotkeyctrl.reg(a, b, c) ? !0 : !1
            },
            regCallback: function (a) {
                if (this.hotkeyctrl) this.hotkeyctrl.onhotkey = a
            },
            unreg: function (a) {
                this.hotkeyctrl && this.hotkeyctrl.unreg(a)
            },
            unstall: function () {
                this.hotkeyctrl && this.hotkeyctrl.unreg(1);
                this.hotkeyctrl = null
            }
        });
    this.init = function () {
        c.scaptureHotkey = new k;
        g = c.scaptureHotkey.install();
        alloy.portal.addCloseHookForHotKey()
    };
    this.unstall = function () {
        c.scaptureHotkey && c.scaptureHotkey.unstall()
    };
    this.getHotKeyTitle = function () {
        return d
    };
    this.isRegisterSuccess = function () {
        return g
    }
});
Jx().$package(function (a) {
    var c = a.event;
    if (top.location.host != location.host) alloy.util.report2h("be_iframed", "start"), top.location = location;
    c.on(window, "load", function () {
        alloy.util.setTimingRpt(7723, 2, 2, 3)
    });
    a.profile("Hello everyone, welcome to Q+ Web, 100% loaded, we're starting... time: " + a.now());
    alloy.util.report2h("portal", "start");
    alloy.portal.speedTest.sRTS(7, "start", window._SPEEDTIME_WINDOWSTART);
    alloy.portal.speedTest.sRTS(7, "end", new Date, !0);
    alloy.portal.speedTest.sRTS(8, "start", new Date);
    c.on(window, "load", function () {
        alloy.init()
    })
});
