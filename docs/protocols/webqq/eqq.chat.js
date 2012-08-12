(function () {
    WebqCore.register("EQQ.View.ChatBox", function (e) {
        var d = this,
            b = e.dom,
            c = e.event,
            n = EQQ.getChatboxMode(),
            p = 0,
            k = alloy.layout.getPanel("desktop").body,
            h, m, r, I = !1,
            v = !1,
            w = null,
            x, s = null,
            D, t, E, o, i, G, C, A, F, a, f = !1,
            g, j, y, l, z = [],
            u = [],
            H = {}, K = {}, J = [],
            M = function () {
                for (var a = 0; a < J.length;) {
                    var c = J[a],
                        d = c.parentNode.offsetTop,
                        f = r.scrollTop;
                    e.out("top: " + f + ", y: " + d);
                    d > f - 70 && d < f + 300 ? (b.addClass(c.parentNode, "loading"), e.array.remove(J, c), alloy.portal.recoverCookie(), c.src = c.getAttribute("lazySrc")) : a++
                }
            },
            O = function () {
                var a, c;
                this.setAttribute("loaded", "true");
                b.replaceClass(this.parentNode, "loading", "loaded");
                this.width > 60 || this.height > 60 ? this.width > this.height ? (a = 60 / this.width, a *= this.height, c = (60 - a) / 2, b.setStyle(this, "width", "60px"), b.setStyle(this, "height", a + "px"), b.setStyle(this, "marginTop", c + "px")) : this.width < this.height ? (a = 60 / this.height, c = this.width * a, a = (60 - c) / 2, b.setStyle(this, "width", c + "px"), b.setStyle(this, "height", "60px"), b.setStyle(this, "marginLeft", a + "px")) : (b.setStyle(this, "width", "60px"),
                b.setStyle(this, "height", "60px")) : (a = (60 - this.width) / 2, c = (60 - this.height) / 2, b.setStyle(this, "marginLeft", a + "px"), b.setStyle(this, "marginTop", c + "px"))
            }, N = function (a) {
                a.stopPropagation()
            }, L = function () {
                if (L.timer) window.clearTimeout(L.timer), L.timer = null;
                L.timer = window.setTimeout(M, 500)
            }, P = function (a) {
                a.preventDefault();
                a.stopPropagation();
                d.sendOptionPanel.hide();
                c.notifyObservers(d, "SetNotNeedCtrlKey");
                EQQ.setSendMsgKey("true");
                a = d.getCurrent();
                alloy.util.report2qqweb(a.chatBoxType + "mask|bottom|send|setenter")
            };
        this.setSendKey = function (a) {
            a == "true" ? (d.sendOptionPanel.hide(), c.notifyObservers(d, "SetNotNeedCtrlKey"), d.isNotNeedCtrlKey = !0) : (d.sendOptionPanel.hide(), c.notifyObservers(d, "SetNeedCtrlKey"), d.isNotNeedCtrlKey = !1)
        };
        var Q = function (a) {
            a.preventDefault();
            a.stopPropagation();
            d.sendOptionPanel.hide();
            c.notifyObservers(d, "SetNeedCtrlKey");
            EQQ.setSendMsgKey("false");
            alloy.util.report2qqweb(chatBox.chatBoxType + "mask|bottom|send|setctrlenter")
        }, q = function (a) {
            a.preventDefault();
            a.stopPropagation();
            d.chatLogOptionPanel.hide();
            a = d.getCurrent();
            a.chatBoxType == "group" ? c.notifyObservers(d, "ViewGroupChatLog", a.uin) : a.chatBoxType == "discu" ? c.notifyObservers(d, "ViewDiscuChatLog", a.did) : c.notifyObservers(d, "ViewChatLog", a.uin);
            pgvSendClick({
                hottag: "web2qq.c2cmask.toolbar.msghistoryview"
            });
            alloy.util.report2qqweb(a.chatBoxType + "mask|smalltoolbar|msghistory|msghistoryview")
        }, S = function (a) {
            a.preventDefault();
            a.stopPropagation();
            d.chatLogOptionPanel.hide();
            a = d.getCurrent();
            a.chatBoxType == "group" ? c.notifyObservers(d, "ExportGroupCurrentChatLog",
            a.uin) : a.chatBoxType == "discu" ? c.notifyObservers(d, "ExportDiscuCurrentChatLog", a.did) : c.notifyObservers(d, "ExportCurrentChatLog", a.uin);
            pgvSendClick({
                hottag: "web2qq.c2cmask.toolbar.msghistoryexport"
            });
            alloy.util.report2qqweb(a.chatBoxType + "mask|smalltoolbar|msghistory|msghistoryexport")
        }, T = function () {
            var a = d.getCurrent();
            alloy.util.report2qqweb(a.chatBoxType + "mask|smalltoolbar|msghistory|msghistoryexportall")
        };
        this.init = function () {
            n = EQQ.getChatboxMode();
            p = 0;
            r = h = null;
            I = !1;
            a = F = A = C = G = i = o = D = s = x = w = null;
            f = !1;
            y = j = g = null;
            J = [];
            u = [];
            H = {};
            c.addObserver(d, "runScreenCapture", d.onRunScreenCapture);
            d.createSendOptionPanel();
            d.setSendKey(EQQ.getSendMsgKey())
        };
        this.getChatBox = function (a) {
            return H[a]
        };
        this.setBuddyState = function (a) {
            var b = d.getChatBox(a.uin);
            b && b.updateUserState(a.state)
        };
        this.setClientType = function (a) {
            var c = d.getChatBox(a.uin);
            if (c && c.uin == a.uin) {
                var c = b.id("chatBox_clientType_" + a.uin) || {}, f = b.id("chatBox_clientTypeImg_" + a.uin) || {}, e = EQQ.hash.clientType[a.clientType || "10000"];
                f.ImgclassName = "chatBox_clientType_" + EQQ.hash.clientType[a.clientType || "10000"];
                f.style.display = e == "PC" ? "none" : "inline";
                c.title = a.allName + " - \u4f7f\u7528" + EQQ.hash.clientTypeText[a.clientType || "10000"] + "\u4e2d";
                c.innerHTML = "\u4f7f\u7528" + EQQ.hash.clientTypeText[a.clientType || "10000"] + "\u4e2d]";
                if (e == "PC") b.id("chatBox_clientTypeAll_" + a.uin).style.display = "none"
            }
        };
        this.updateUserInfo = function (a) {
            var b = d.getChatBox(a.uin);
            b && b.updateUserInfo(a)
        };
        this.addChatBox = function (a) {
            a = alloy.windowFactory.createWindow("UserChatBox", {
                modeSwitch: !0,
                dragable: !0,
                resize: !0,
                hasCloseButton: !0,
                hasMaxButton: !0,
                noFullButton: !0,
                hasMinButton: !0,
                bodyBorder: 0,
                width: 425,
                height: 346,
                minWidth: 310,
                minHeight: 280,
                userOrGroup: a,
                chatBoxType: "single"
            });
            H[a.uin] = a;
            u.push(a);
            c.notifyObservers(d, "ChatBoxAdd", a);
            return a
        };
        this.addGroupChatBox = function (a) {
            a = alloy.windowFactory.createWindow("GroupChatBox", {
                modeSwitch: !0,
                dragable: !0,
                resize: !0,
                hasCloseButton: !0,
                hasMaxButton: !0,
                noFullButton: !0,
                hasMinButton: !0,
                bodyBorder: 0,
                width: 425,
                height: 346,
                minWidth: 410,
                minHeight: 280,
                userOrGroup: a,
                chatBoxType: "group",
                hasSideBar: !0
            });
            H[a.uin] = a;
            u.push(a);
            c.notifyObservers(d, "ChatBoxAdd", a);
            return a
        };
        this.addLiteChatBox = function (a) {
            a = alloy.windowFactory.createWindow("LiteChatBox", {
                modeSwitch: !0,
                dragable: !0,
                resize: !0,
                hasCloseButton: !0,
                hasMaxButton: !0,
                hasMinButton: !0,
                noFullButton: !0,
                bodyBorder: 0,
                width: 425,
                height: 346,
                minWidth: 310,
                minHeight: 280,
                userOrGroup: a,
                chatBoxType: "single"
            });
            H[a.uin] = a;
            u.push(a);
            c.notifyObservers(d, "ChatBoxAdd", a);
            return a
        };
        this.shiftChatBox = function () {
            var a = u.shift();
            a && a.close()
        };
        this.removeChatBox = function (a) {
            e.array.remove(u, a);
            delete H[a.uin]
        };
        this.setChatboxSignature = function (a) {
            var c = b.id("chatBox_signature_" + a.uin);
            if (c) e.out(a.htmlSignature), c.innerHTML = a.htmlSignature, c.title = a.signature
        };
        this.getCurrent = function () {
            var a = alloy.windowManager.getCurrentWindow();
            return a && a.windowType == "chatbox" ? a : null
        };
        this.setCurrent = function (a) {
            alloy.windowManager.setCurrentWindow(a)
        };
        this.getCurrentUin = function () {
            var a = this.getCurrent();
            return a && a.uin ? a.uin : null
        };
        this.getChatBoxList = function () {
            return u
        };
        this.setAdsorbMode = function () {
            this.getCurrent();
            for (var a = 0; a < u.length; a++) u[a].setAdsorbMode();
            n = "adsorb"
        };
        this.setFreeMode = function () {
            this.getCurrent();
            for (var a = 0; a < u.length; a++) u[a].setFreeMode();
            n = "free"
        };
        this.getMode = function () {
            return n
        };
        this.createFacePanel = function () {
            h = b.node("div", {
                id: "EQQ_facePanel",
                "class": "facePanel"
            });
            for (var a = b.node("div", {
                "class": "defaultFacePanel"
            }), f = "", g = 0; g <= 104; g++) f += '<a class="faceIcon" faceCode="[face' + g + ']" title="[face' + g + ']" href="###"></a>';
            a.innerHTML = f;
            h.appendChild(a);
            c.on(a, "click", function (a) {
                var b = d.getCurrent();
                a.preventDefault();
                a = a.target.getAttribute("faceCode");
                b && (b.focusEditor(), b.editor.isEnable() ? b.editor.insertSystemFace(a) : b.editor.insertText(a), c.notifyObservers(d, "HideFacePanel"))
            });
            r = b.node("div", {
                "class": " customFacePanel"
            });
            r.innerHTML = '<div class="EQQ_Logining">\u8f7d\u5165\u4e2d...</div>';
            h.appendChild(r);
            g = b.node("div", {
                "class": "tabArea"
            });
            f = '\t\t\t\t<a id="defaultFaceTab" class="defaultFaceTab" href="###">\u9ed8\u8ba4</a>\t\t\t\t<a id="customFaceTab" class="customFaceTab" href="###">\u81ea\u5b9a\u4e49\u8868\u60c5</a>\t\t\t\t<a id="addCustomFaceButton" class="addCustomFaceButton" href="###"><div class="addCustomFaceIcon"></div>\u6dfb\u52a0\u8868\u60c5</a>\t\t\t\t<iframe id="uploadCustomFaceIframe" name="uploadCustomFaceIframe" src="' + alloy.CONST.MAIN_URL + 'domain.html"></iframe>\t\t\t\t<form id="uploadCustomFaceForm" target="uploadCustomFaceIframe" action="' + EQQ.CONST.UPLOAD_CUSTOM_FACE_SERVER + '" method="POST" enctype="multipart/form-data">\t\t\t\t\t<input id="uploadCustomFaceButton" class="uploadCustomFaceButton" name="custom_face" type="file" size="1" />\t\t\t\t\t<input name="f" type="hidden" value="EQQ.View.ChatBox.uploadCustomFaceCallback" />\t\t\t\t    <input name="vfwebqq" type="hidden" value="' + alloy.portal.getVfWebQQ() + '" />\t\t\t\t</form>\t\t\t\t<div id="facePanelNotice"></div>\t\t\t';
            g.innerHTML = f;
            h.appendChild(g);
            k.appendChild(h);
            c.on(h, "click", N);
            c.on(h, "mouseup", N);
            c.on(r, "scroll", L);
            x = b.id("defaultFaceTab");
            s = b.id("customFaceTab");
            D = b.id("addCustomFaceButton");
            m = new e.ui.Tab;
            m.add({
                trigger: x,
                sheet: a
            });
            m.add({
                trigger: s,
                sheet: r
            });
            c.on(x, "click", function (a) {
                var b = d.getCurrent();
                a.preventDefault();
                alloy.util.report2qqweb(b.chatBoxType + "mask|smalltoolbar|emotion|defaulttab")
            });
            c.on(D, "click", function (a) {
                var b = d.getCurrent();
                a.preventDefault();
                alloy.util.report2qqweb(b.chatBoxType + "mask|smalltoolbar|emotion|add")
            });
            c.on(s, "click", function (a) {
                var b = d.getCurrent();
                a.preventDefault();
                alloy.util.report2qqweb(b.chatBoxType + "mask|smalltoolbar|emotion|customtab")
            });
            m.config.triggerEvent = "click";
            m.config.slideEnabled = !1;
            v = !0;
            c.addObserver(m, "show", function (a) {
                switch (a.trigger) {
                case s:
                    I || (I = !0, c.notifyObservers(d, "LoadCustomFace"))
                }
            });
            m.init();
            var q = b.id("facePanelNotice");
            this.facePanelNotice = function (a, c) {
                var B = c ? 0 : 1;
                if (this.facePanelNotice.timer) clearTimeout(this.facePanelNotice.timer), this.facePanelNotice.timer = null;
                q.innerHTML = a;
                b.setStyle(q, "background", ["#BDFDB8", "#FDDFB8"][B]);
                b.show(q);
                this.facePanelNotice.timer = setTimeout(function () {
                    b.hide(q)
                }, [1E3, 3E3][B])
            };
            t = b.id("uploadCustomFaceButton");
            E = b.id("uploadCustomFaceForm");
            e.browser.mobileSafari && (b.hide(D), b.hide(E));
            c.on(t, "change", function (a) {
                a.preventDefault();
                e.out("change");
                if (!/\.(jpeg|jpg|gif|bmp|png|tiff)$/i.test(this.value)) return d.facePanelNotice("\u7981\u6b62\u4e0a\u4f20\u7684\u6587\u4ef6\u7c7b\u578b"),
                0;
                a = d.getFileSize(this);
                if (a > 0 && a > 256E3) return d.facePanelNotice("\u6587\u4ef6\u5927\u5c0f\u8d85\u8fc7250KB"), 0;
                alloy.portal.recoverCookie();
                E.vfwebqq.value = alloy.portal.getVfWebQQ();
                E.submit();
                E.reset();
                e.out("submit")
            }, this);
            this.facePanel = new alloy.layout.PopupBox({
                container: h,
                html: "",
                noCatchMouseUp: !1
            });
            c.addObserver(d, "HideFacePanel", e.bind(this.hideFacePanel, this))
        };
        this.uploadCustomFaceCallback = function (a) {
            e.out("uploadCustomFaceCallback");
            if (a.ret === 0) {
                m.select({
                    trigger: s,
                    sheet: r
                });
                this.facePanelNotice("\u4e0a\u4f20\u6210\u529f", !0);
                var b = w.length,
                    c = [];
                c[0] = a.msg;
                c[1] = 0;
                w.push(c);
                if (b == 0) r.innerHTML = "";
                this.addCustomFace(c, b, null, !0);
                window.setTimeout(function () {
                    r.scrollTop = r.scrollHeight
                }, 1500)
            } else switch (a.ret) {
            case 1:
                this.facePanelNotice("\u6587\u4ef6\u683c\u5f0f\u9519\u8bef");
                break;
            case 3:
                this.facePanelNotice("\u6587\u4ef6\u5927\u5c0f\u8d85\u8fc7250KB");
                break;
            case 4:
                this.facePanelNotice("\u6b64\u81ea\u5b9a\u4e49\u8868\u60c5\u5df2\u5b58\u5728");
                break;
            default:
                this.facePanelNotice("\u53d1\u751f\u4e0a\u4f20\u9519\u8bef")
            }
        };
        this.showTip = function (a, b) {
            var c = d.getCurrent();
            c && (b != "" && (c = d.getChatBox(b)), c.tips(a))
        };
        this.getFileSize = function (a) {
            var b = new Image,
                c = a.value,
                d = 0;
            try {
                b.dynsrc = c
            } catch (f) {
                return 0
            }
            try {
                d = b.fileSize || 0
            } catch (e) {}
            if (d == 0) try {
                d = a.files[0].fileSize
            } catch (B) {}
            return d
        };
        this.onSendDeleteCustomFaceSuccess = function (a) {
            a()
        };
        this.createCustomFaceList = function (a) {
            var f = this;
            w = a;
            w.length === 0 ? r.innerHTML = '<div class="noCustomFaceText">\u6682\u65e0\u81ea\u5b9a\u4e49\u8868\u60c5</div><a class="noCustomFaceAddButton"><div class="addCustomFaceIcon"></div>\u7acb\u5373\u6dfb\u52a0</a>' : (r.innerHTML = "", e.array.forEach(w, this.addCustomFace), c.on(r, "click", function (a) {
                a.preventDefault();
                var e = b.getAttributeByParent("customFaceCode", a.target, this),
                    g = b.getAttributeByParent("code", a.target, a.target),
                    q = a.target.parentNode,
                    B = this;
                if (g) c.notifyObservers(d, "DeleteCustomFace", {
                    img: g,
                    callback: function () {
                        f.facePanelNotice("\u5220\u9664\u6210\u529f", !0);
                        B.removeChild(q)
                    }
                });
                else if (e) {
                    if (a = d.getCurrent()) a.focusEditor(), a.editor.isEnable() ? a.editor.insertCustomFace(e) : a.editor.insertText(e);
                    c.notifyObservers(d, "HideFacePanel")
                }
            }))
        };
        this.addCustomFace = function (a, d, f, e) {
            var g = b.node("a", {
                title: "[\u81ea\u5b9a\u4e49\u8868\u60c5" + d + "]",
                customFaceCode: "[\u81ea\u5b9a\u4e49\u8868\u60c5" + d + "]",
                href: "###",
                hidefocus: ""
            }),
                f = b.node("img");
            c.on(f, "load", O);
            f.setAttribute("loaded", "false");
            var q = b.node("span", {
                title: "\u5220\u9664\u6b64\u8868\u60c5",
                "class": "customFacePanel_delImgBtn",
                code: a[0]
            });
            g.appendChild(f);
            g.appendChild(q);
            r.appendChild(g);
            c.on(g, "mouseover", function () {
                b.setStyle(q, "display", "block")
            });
            c.on(g, "mouseout",

            function () {
                b.setStyle(q, "display", "none")
            });
            e === !0 || d < 18 ? (b.addClass(f.parentNode, "loading"), alloy.portal.recoverCookie(), d = "&vfwebqq=" + alloy.portal.getVfWebQQ(), f.src = EQQ.CONST.CONN_SERVER_DOMAIN2 + "cgi-bin/webqq_app/?cmd=2&bd=" + a[0] + d) : (d = "&vfwebqq=" + alloy.portal.getVfWebQQ(), f.setAttribute("lazySrc", EQQ.CONST.CONN_SERVER_DOMAIN2 + "cgi-bin/webqq_app/?cmd=2&bd=" + a[0] + d), J.push(f))
        };
        this.showFacePanel = function (a) {
            var f = a.xy,
                a = a.showCustom;
            this.facePanel ? c.addObserver(d, "HideFacePanel", e.bind(this.hideFacePanel,
            this)) : this.createFacePanel();
            if (f) {
                var g = this.facePanel.getWidth(),
                    q = this.facePanel.getHeight(),
                    j = alloy.layout.getClientWidth(),
                    y = alloy.layout.getClientHeight(),
                    B = f[0] - g / 2,
                    f = f[1] - q - 3;
                B < 2 && (B = 2);
                f < 2 && (f = 2);
                B > j - g - 2 && (B = j - g - 2);
                f > y - q - 2 && (f = y - q - 2);
                this.facePanel.setX(B);
                this.facePanel.setY(f)
            }
            a && !v ? (m.add({
                trigger: s,
                sheet: r
            }), e.browser.mobileSafari || (b.show(D), b.show(E)), v = !0) : !a && v && (m.remove({
                trigger: s,
                sheet: r
            }), b.hide(D), b.hide(E), v = !1);
            this.facePanel.setZIndex(alloy.layout.getTopZIndex(3));
            this.facePanel.show()
        };
        this.hideFacePanel = function () {
            this.facePanel && this.facePanel.hide()
        };
        this.getSelection = function () {
            return window.getSelection ? window.getSelection() : document.selection
        };
        this.uploadSendFile = function () {
            var a = b.id("panel_uploadFile_" + this.getCurrentUin()),
                f = b.id("upload_file_" + this.getCurrentUin()),
                e = d.getCurrent(),
                g = "",
                g = f.value;
            if (g == "") return d.getCurrent().tips("\u8bf7\u9009\u62e9\u6587\u4ef6!"), 0;
            if (d.getFileSize(f) > 10485760) return d.getCurrent().tips("\u6587\u4ef6\u5927\u5c0f\u8d85\u51fa10M\u9650\u5236!"),
            a.reset(), 0;
            var f = EQQ.Model.BuddyList.getSelf(),
                q = (new Date).getTime() % 4096;
            a.action = EQQ.CONST.FILE_SERVER + "v2/" + f.uin + "/" + e.uin + "/" + q + "/" + EQQ.index + "/" + EQQ.port + "/1/f/1/0/0?psessionid=" + EQQ.getPsessionid();
            alloy.portal.recoverCookie();
            a.submit();
            a.reset();
            c.notifyObservers(this, "sendFile", {
                filename: g,
                to_uin: e.uin,
                lcid: q
            });
            alloy.util.report2m(133175);
            d.hideSendFilePanel(e.uin)
        };
        this.uploadOffFile = function () {
            var a = d.getCurrent(),
                f = b.id("panel_uploaOffFile_" + a.uin),
                g = b.id("offline_f_" + a.uin).value.split("\\"),
                g = e.string.encodeHtmlSimple(g[g.length - 1]);
            if (/\.(exe)$/i.test(g)) return a.tips("\u8be5\u7c7b\u578b\u6587\u4ef6\u4e0d\u652f\u6301\u4f20\u9001\uff0c\u8bf7\u91cd\u65b0\u9009\u62e9\uff01"), d.hideSendFilePanel(a.uin), !1;
            f.action = EQQ.CONST.OFFLINE_FILE_SERVER + "upload_offline_file?time=" + (new Date).getTime();
            f.skey.value = alloy.portal.getCookieSkey();
            var q = EQQ.Model.BuddyList.getSelf();
            f.uin.value = q.uin;
            var j = (new Date).getTime();
            K[j] = !1;
            f.fileid.value = a.uin + "_" + j;
            var y = EQQ.Model.BuddyList.getUserByUin(a.uin);
            f.senderviplevel.value = q.vip || 0;
            f.reciverviplevel.value = y.vip || 0;
            f.vfwebqq.value = alloy.portal.getVfWebQQ();
            q = b.node("div", {
                id: "panel_uploadOffFilBox_" + j
            });
            q.innerHTML = '<iframe id="panel_uploadOffFilIframe_' + j + '" name="panel_uploadOffFilIframe_' + j + '" style="display:none" src="./domain.html"></iframe>';
            f.parentNode.insertBefore(q, f);
            f.target = "panel_uploadOffFilIframe_" + j;
            alloy.portal.recoverCookie();
            f.submit();
            f.reset();
            alloy.util.report2im("singlemask|offlinefile|upload");
            c.notifyObservers(d, "SendMsgToSelf", {
                type: "single",
                from_uin: 0,
                to: a.uin,
                content: [
                    ["uploadingofffile", "\u60a8\u6b63\u5728\u4f20\u8f93\u79bb\u7ebf\u6587\u4ef6\u201c" + g + "\u201d..."]
                ],
                attach: {
                    type: "uploadingofffile",
                    name: g,
                    from_uin: a.uin,
                    time: j,
                    ts: j
                }
            });
            d.hideSendFilePanel(a.uin)
        };
        this.getOffFileUploadState = function (a) {
            return K[a] || !1
        };
        this.setOffFileUploadState = function (a) {
            K[a] = !0
        };
        this.uploadSendPic = function () {
            var a = b.id("uploadSendPicfile_" + this.getCurrentUin()),
                c = d.getCurrent(),
                f = "",
                g = "";
            if (c.chatBoxType == "single") {
                f = a.file.value;
                a.action = EQQ.CONST.OFFLINE_FILE_SERVER + "upload_offline_pic?time=" + (new Date).getTime();
                a.skey.value = alloy.portal.getCookieSkey();
                g = EQQ.Model.BuddyList.getSelf();
                a.uin.value = g.uin;
                var q = EQQ.Model.BuddyList.getUserByUin(c.uin);
                a.senderviplevel.value = g.vip || 0;
                a.reciverviplevel.value = q.vip || 0;
                a.vfwebqq.value = alloy.portal.getVfWebQQ();
                g = a.file
            } else g = a.custom_face, f = a.custom_face.value, a.action = EQQ.CONST.UPLOAD_CUSTOM_FACE_SERVER + "?time=" + (new Date).getTime();
            if (d.getFileSize(g) > 1048576) return d.getCurrent().tips("\u6587\u4ef6\u5927\u5c0f\u8d85\u51fa1M\u9650\u5236!"),
            a.reset(), 0;
            if (!/\.(jpeg|jpg|gif|bmp|png)$/i.test(f)) return e.out(f), d.getCurrent().tips("\u8bf7\u9009\u62e9\u56fe\u7247\u6587\u4ef6!"), a.reset(), 0;
            f = d.geneSendPicId();
            a.fileid.value = f;
            a.vfwebqq.value = alloy.portal.getVfWebQQ();
            alloy.portal.recoverCookie();
            a.submit();
            a.reset();
            c.chatBoxType == "single" && (d.getCurrent(), d.insertLoading(f))
        };
        this.insertSendPic = function (a) {
            d.getCurrent();
            var b = "[\u53d1\u9001\u56fe\u7247" + a.result.file_path + "]",
                c = e.dom.id("loading_" + a.fileid);
            if (c) alloy.portal.recoverCookie(),
            c.src = a.result.url, c.setAttribute("mark", b)
        };
        this.insertSendPicGroup = function (a) {
            var b = d.getCurrent(),
                c = "[\u56fe\u7247" + a + "]",
                f = EQQ.CONST.CONN_SERVER_DOMAIN2 + "cgi-bin/webqq_app/?cmd=2&bd=";
            b.focusEditor();
            var g = "&vfwebqq=" + alloy.portal.getVfWebQQ();
            b.editor.insertImage(c, f + a + g)
        };
        this.geneSendPicId = function () {
            return ++p
        };
        this.insertLoading = function (a) {
            var b = d.getCurrent();
            b && b.isShow() && b.editor && (a = '<img mark="[\u53d1\u9001\u56fe\u7247loading]" class="custom" src="' + alloy.CONST.CDN_URL + 'style/images/img_loading.gif" id="loading_' + a + '"  style="vertical-align:bottom" />', b.focusEditor(), b.editor.insertHtml(a))
        };
        this.removeLoading = function (a) {
            if (typeof a == "undefined" && a == "") return !1;
            (a = e.dom.id("loading_" + a)) && a.parentNode.removeChild(a)
        };
        this.showSendOptionPanel = function (a) {
            this.sendOptionPanel ? f === !0 ? this.setNotNeedCtrlKey() : this.setNeedCtrlKey() : this.createSendOptionPanel();
            if (a) {
                var b = this.sendOptionPanel.getWidth(),
                    c = this.sendOptionPanel.getHeight(),
                    d = alloy.layout.getClientWidth(),
                    g = alloy.layout.getClientHeight(),
                    q = a[0],
                    a = a[1] + 23;
                q < 2 && (q = 2);
                a < 2 && (a = 2);
                q > d - b - 2 && (q = d - b - 2);
                a > g - c - 2 && (a = g - c - 2);
                e.out("xy:" + q + "," + a + " height:" + c + ", width:" + b);
                this.sendOptionPanel.setXY(q, a)
            }
            this.sendOptionPanel.setZIndex(alloy.layout.getTopZIndex(3));
            this.sendOptionPanel.show()
        };
        this.hideSendOptionPanel = function () {
            this.sendOptionPanel && this.sendOptionPanel.hide()
        };
        this.createSendOptionPanel = function () {
            g = b.node("div", {
                id: "sendOptionPanel",
                "class": "sendOptionPanel"
            });
            k.appendChild(g);
            d.sendOptionPanel = new alloy.layout.PopupBox({
                container: g,
                html: ' <a id="sendOption_enterKey" class="simpleMenuItem" href="###"><div class="selectedIcon"></div>\u6309Enter\u952e\u53d1\u9001</a>\t\t\t\t\t<a id="sendOption_ctrlEnterKey" class="simpleMenuItem" href="###"><div class="selectedIcon"></div>\u6309Ctrl+Enter\u952e\u53d1\u9001</a>'
            });
            j = b.id("sendOption_enterKey");
            y = b.id("sendOption_ctrlEnterKey");
            c.on(j, "click", P);
            c.on(y, "click", Q);
            f === !0 ? d.setNotNeedCtrlKey() : d.setNeedCtrlKey()
        };
        this.setNotNeedCtrlKey = function () {
            f = !0;
            this.sendOptionPanel && (b.removeClass(y, "simpleMenuItemSelected"), b.addClass(j, "simpleMenuItemSelected"))
        };
        this.setNeedCtrlKey = function () {
            f = !1;
            this.sendOptionPanel && (b.removeClass(j, "simpleMenuItemSelected"), b.addClass(y, "simpleMenuItemSelected"))
        };
        this.getSendMsgKey = function () {
            return f
        };
        this.showChatLogOptionPanel = function (a) {
            this.chatLogOptionPanel || this.createChatLogOptionPanel();
            if (a) {
                var c = this.chatLogOptionPanel.getWidth(),
                    f = this.chatLogOptionPanel.getHeight(),
                    g = alloy.layout.getClientWidth(),
                    e = alloy.layout.getClientHeight(),
                    q = a[0],
                    a = a[1] + 25;
                q < 2 && (q = 2);
                a < 2 && (a = 2);
                q > g - c - 2 && (q = g - c - 2);
                a > e - f - 2 && (a = e - f - 2);
                this.chatLogOptionPanel.setXY(q, a)
            }
            this.chatLogOptionPanel.setZIndex(alloy.layout.getTopZIndex(3));
            c = d.getCurrent();
            c.chatBoxType == "group" ? (c = alloy.CONST.JAVA_CGI_URL + "keycgi/top/downloadgroupchatlog?retype=4&callback=parent.EQQ.View.ChatBox.exAllLogRes&gid=" + c.group.code, c += "&vfwebqq=" + alloy.portal.getVfWebQQ(), C.href = c + "&t=" + (new Date).getTime(), b.addClass(o, "chatLogOptionPanelEx")) : b.removeClass(o, "chatLogOptionPanelEx");
            this.chatLogOptionPanel.show()
        };
        this.hideChatLogOptionPanel = function () {
            this.chatLogOptionPanel && this.chatLogOptionPanel.hide()
        };
        this.exAllLogRes = function (a) {
            a.retcode == 5555 ? alloy.layout.alert("\u672c\u7fa4\u6682\u65e0\u6d88\u606f\u8bb0\u5f55\u3002", null, {
                windowType: "EqqWindow"
            }) : a.retcode != 0 && alloy.layout.alert("\u5bfc\u51fa\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\uff01", null, {
                windowType: "EqqWindow"
            })
        };
        this.createChatLogOptionPanel = function () {
            o = b.id("chatLogOptionPanel") || b.node("div", {
                id: "chatLogOptionPanel",
                "class": "chatLogOptionPanel"
            });
            k.appendChild(o);
            d.chatLogOptionPanel = new alloy.layout.PopupBox({
                container: o,
                html: ' <a id="viewChatLog" class="simpleMenuItem" href="###">\u67e5\u770b\u5386\u53f2\u6d88\u606f</a>\t\t\t\t\t<a id="exportCurrentChatLog" class="simpleMenuItem" href="###">\u5bfc\u51fa\u5f53\u524d\u6d88\u606f</a>\t\t\t\t\t<a id="exportAllChatLog" class="simpleMenuItem" href="###" target="exportCurrentChatLogIframe">\u5bfc\u51fa\u6240\u6709\u6d88\u606f</a>\t\t\t\t\t<iframe id="exportCurrentChatLogIframe" name="exportCurrentChatLogIframe" class="exportCurrentChatLogIframe" src="' + alloy.CONST.MAIN_URL + 'domain.html"></iframe>\t\t\t\t\t<form id="exportCurrentChatLogForm" target="exportCurrentChatLogIframe" action="' + EQQ.CONST.DOWNLOAD_CHAT_LOG_SERVER + '" method="POST">\t\t\t\t\t\t<input id="exportCurrentChatLogFileName" name="filename" type="hidden" value="" />\t\t\t\t\t\t<input id="exportCurrentChatLogFileContent" name="filecontent" type="hidden" value="" />\t\t\t\t\t</form>\t\t\t'
            });
            i = b.id("viewChatLog");
            G = b.id("exportCurrentChatLog");
            C = b.id("exportAllChatLog");
            A = b.id("exportCurrentChatLogForm");
            F = b.id("exportCurrentChatLogFileName");
            a = b.id("exportCurrentChatLogFileContent");
            c.off(i, "click");
            c.on(i, "click", q);
            c.off(G, "click");
            c.on(G, "click", S);
            c.off(C, "click");
            c.on(C, "click", T)
        };
        this.removeChatLogOptionPanel = function () {
            d.chatLogOptionPanel && (d.chatLogOptionPanel.hide(), d.chatLogOptionPanel.destroy())
        };
        this.createGroupMaskPanelDom = function () {
            var a = b.mini(".groupMaskPanel"),
                f;
            for (f in a) a[f].parentNode.removeChild(a[f]);
            a = b.node("div", {
                "class": "groupMaskPanel"
            });
            k.appendChild(a);
            d.getCurrent();
            d.groupMaskPanel = new alloy.layout.PopupBox({
                container: a,
                html: ' <a id="SingleMask_Prompt" state="0" class="simpleMenuItem" href="###"><div class="selectedIcon"></div>\u63a5\u6536\u5e76\u63d0\u793a\u6d88\u606f</a>\t\t\t\t\t<a id="SingleMask_NoPrompt" state="1" class="simpleMenuItem" href="###"><div class="selectedIcon"></div>\u63a5\u6536\u4e0d\u63d0\u793a\u6d88\u606f</a>\t\t\t\t\t<a id="SingleMask_Mask" state="2" class="simpleMenuItem" href="###"><div class="selectedIcon"></div>\u5b8c\u5168\u963b\u6b62\u6d88\u606f</a>'
            });
            this.promptDom = b.id("SingleMask_Prompt");
            this.noPromptDom = b.id("SingleMask_NoPrompt");
            this.maskDom = b.id("SingleMask_Mask");
            e.array.forEach([this.promptDom, this.noPromptDom, this.maskDom], function (a) {
                c.on(a, "click", U)
            })
        };
        var U = function (a) {
            a.preventDefault();
            var a = this.getAttribute("state"),
                f = d.getCurrent();
            if (!b.hasClass(this, "simpleMenuItemSelected")) {
                var g = "SetSingleGroupMaskState";
                f.chatBoxType == "discu" && (g = "SetSingleDiscuMaskState");
                c.notifyObservers(d, g, {
                    type: "single",
                    uin: f.uin,
                    mask: a
                });
                alloy.util.report2qqweb(f.chatBoxType + "mask|smalltoolbar|msgsetting|" + ["withalert", "withoutalert", "block"][parseInt(a)])
            }
        };
        this.setGroupMaskState = function (a) {
            b.removeClass(this.promptDom, "simpleMenuItemSelected");
            b.removeClass(this.noPromptDom, "simpleMenuItemSelected");
            b.removeClass(this.maskDom, "simpleMenuItemSelected");
            switch (a) {
            case "0":
            case 0:
                b.addClass(this.promptDom, "simpleMenuItemSelected");
                break;
            case "1":
            case 1:
                b.addClass(this.noPromptDom, "simpleMenuItemSelected");
                break;
            case "2":
            case 2:
                b.addClass(this.maskDom, "simpleMenuItemSelected")
            }
        };
        this.toggleGroupMaskStatePanel = function (a, b) {
            this.groupMaskPanel && this.groupMaskPanel.isShow() ? this.hideGroupMaskStatePanel() : (this.showGroupMaskStatePanel(a), this.setGroupMaskState(b))
        };
        this.showGroupMaskStatePanel = function (a) {
            this.groupMaskPanel || this.createGroupMaskPanelDom();
            if (a) {
                var b = this.groupMaskPanel.getWidth(),
                    c = this.groupMaskPanel.getHeight(),
                    f = alloy.layout.getClientWidth(),
                    d = alloy.layout.getClientHeight(),
                    g = a[0],
                    a = a[1] + 20;
                g < 2 && (g = 2);
                a < 2 && (a = 2);
                g > f - b - 2 && (g = f - b - 2);
                a > d - c - 2 && (a = d - c - 2);
                this.groupMaskPanel.setXY(g,
                a)
            }
            this.groupMaskPanel.setZIndex(alloy.layout.getTopZIndex(3));
            this.groupMaskPanel.show();
            e.out("groupMaskPanelshow")
        };
        this.hideGroupMaskStatePanel = function () {
            this.groupMaskPanel && this.groupMaskPanel.hide()
        };
        this.exportChatLog = function (b, c) {
            var f = new Date,
                d = e.date.format(f, "YYYY-MM-DD"),
                f = e.date.format(f, "YYYY-MM-DD hh:mm:ss"),
                g = this.getChatBox(c.uin);
            if (g) {
                g = EQQ.Model.ChatMsg.getHtmlMsg(g.uin);
                if (g == "") return alloy.layout.alert("\u6682\u65e0\u6d88\u606f\u8bb0\u5f55\u3002", null, {
                    windowType: "EqqWindow"
                }), !1;
                F.value = "WebQQ_" + b.uin + "_" + c.uin + "_" + d + ".html";
                a.value = "<!DOCTYPE HTML><html><head>\t<title>\u4e0e" + c.allName + '\u7684\u804a\u5929\u8bb0\u5f55 - Q+ Web</title>\t<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\t<style type="text/css">\t<\!-- \t\tbody{\t\t\tfont:12px/1.5 tahoma, helvetica, clean, sans-serif;\t\t}\t\th3#title {\t\t\tfont-size:14px;\t\t\tfont-weight:bold;\t\t}\t\t#chatInfo {\t\t\tclear:both;\t\t\tcolor:#808080;\t\t\ttext-align:left;\t\t}\t\t#saveDate {\t\t\tpadding-left:20px;\t\t}\t\t#footer {\t\t\tpadding-top:30px;\t\t}\t\t#footer img {\t\t\tborder:0px;\t\t}\t\t.chatBox_myMsg{\t\t\tdisplay:block;\t\t\tmargin:0;\t\t\tpadding:5px;\t\t}\t\t.chatBox_myMsg .msgHead{\t\t\tcolor:#004868;\t\t\toverflow:hidden;\t\t\tzoom:1;\t\t}\t\t.chatBox_myMsg .msgBody{\t\t\tmargin:0 0 0 13px;\t\t\tword-wrap:break-word;\t\t}\t\t.chatBox_buddyMsg{\t\t\tdisplay:block;\t\t\tmargin:0;\t\t\tpadding:5px;\t\t}\t\t.chatBox_buddyMsg .msgHead{\t\t\tcolor:#4a7200;\t\t}\t\t.chatBox_buddyMsg .msgBody{\t\t\tmargin:0 0 0 13px;\t\t\tword-wrap:break-word;\t\t}\t--\> \t</style></head><body>\t<h3 id="title">\u4e0e' + c.htmlAllName + '\u7684\u804a\u5929\u8bb0\u5f55 - Q+ Web</h3>\t<div id="chatInfo">\t\t<span id="buddyInfo">\u804a\u5929\u5bf9\u8c61\uff1a' + c.htmlAllName + '</span>\t\t<span id="saveDate">\u4fdd\u5b58\u65f6\u95f4\uff1a' + f + "</span>\t</div>\t<hr/>\t<\!-- \u804a\u5929\u5185\u5bb9\u5f00\u59cb --\>\t\t\t\t" + g + '\t<\!-- \u804a\u5929\u5185\u5bb9\u7ed3\u675f --\>\t<div id="footer">\t\t<hr/>\t\t<a href="' + EQQ.CONST.EQQ_SERVER_URL + '" target="_blank" title="Q+ Web"><img src="' + EQQ.CONST.EQQ_SERVER_URL + 'style/images/qqweb_logo.png?t=20111011001" alt="Q+ Web Logo"/></a>\t</div></body></html>\t\t\t';
                alloy.portal.recoverCookie();
                A.submit()
            }
        };
        this.exportGroupChatLog = function (b, c) {
            var f = new Date,
                d = e.date.format(f, "YYYY-MM-DD"),
                f = e.date.format(f, "YYYY-MM-DD hh:mm:ss"),
                g = this.getChatBox(c.gid);
            if (g) {
                g = EQQ.Model.ChatMsg.getHtmlMsg(g.uin);
                if (g == "") return alloy.layout.alert("\u672c\u7fa4\u6682\u65e0\u6d88\u606f\u8bb0\u5f55\u3002", null, {
                    windowType: "EqqWindow"
                }), !1;
                F.value = "WebQQ_" + b.uin + "_" + c.code + "_" + d + ".html";
                a.value = "<!DOCTYPE HTML><html><head>\t<title>" + c.htmlShowName + '\u7684\u804a\u5929\u8bb0\u5f55 - Q+ Web</title>\t<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\t<style type="text/css">\t<\!-- \t\tbody{\t\t\tfont:12px/1.5 tahoma, helvetica, clean, sans-serif;\t\t}\t\th3#title {\t\t\tfont-size:14px;\t\t\tfont-weight:bold;\t\t}\t\t#chatInfo {\t\t\tclear:both;\t\t\tcolor:#808080;\t\t\ttext-align:left;\t\t}\t\t#saveDate {\t\t\tpadding-left:20px;\t\t}\t\t#footer {\t\t\tpadding-top:30px;\t\t}\t\t#footer img {\t\t\tborder:0px;\t\t}\t\t.chatBox_myMsg{\t\t\tdisplay:block;\t\t\tmargin:0;\t\t\tpadding:5px;\t\t}\t\t.chatBox_myMsg .msgHead{\t\t\tcolor:#004868;\t\t\toverflow:hidden;\t\t\tzoom:1;\t\t}\t\t.chatBox_myMsg .msgBody{\t\t\tmargin:0 0 0 13px;\t\t\tword-wrap:break-word;\t\t}\t\t.chatBox_buddyMsg{\t\t\tdisplay:block;\t\t\tmargin:0;\t\t\tpadding:5px;\t\t}\t\t.chatBox_buddyMsg .msgHead{\t\t\tcolor:#4a7200;\t\t}\t\t.chatBox_buddyMsg .msgBody{\t\t\tmargin:0 0 0 13px;\t\t\tword-wrap:break-word;\t\t}\t--\> \t</style></head><body>\t<h3 id="title">' + c.htmlShowName + '\u7684\u804a\u5929\u8bb0\u5f55 - Q+ Web</h3>\t<div id="chatInfo">\t\t<span id="buddyInfo">\u7fa4\uff1a' + c.htmlShowName + '</span>\t\t<span id="saveDate">\u4fdd\u5b58\u65f6\u95f4\uff1a' + f + "</span>\t</div>\t<hr/>\t<\!-- \u804a\u5929\u5185\u5bb9\u5f00\u59cb --\>\t\t\t\t" + g + '\t<\!-- \u804a\u5929\u5185\u5bb9\u7ed3\u675f --\>\t<div id="footer">\t\t<hr/>\t\t<a href="' + EQQ.CONST.EQQ_SERVER_URL + '" target="_blank" title="Q+ Web"><img src="' + EQQ.CONST.EQQ_SERVER_URL + 'style/images/qqweb_logo.png?t=20111011001" alt="Q+ Web Logo"/></a>\t</div></body></html>\t\t\t';
                alloy.portal.recoverCookie();
                A.submit()
            }
        };
        this.exportDiscuChatLog = function (b, c) {
            var f = new Date,
                d = e.date.format(f, "YYYY-MM-DD"),
                f = e.date.format(f, "YYYY-MM-DD hh:mm:ss"),
                g = this.getChatBox(c.did);
            if (g) {
                g = EQQ.Model.ChatMsg.getHtmlMsg(g.did);
                if (g == "") return alloy.layout.alert("\u672c\u7fa4\u6682\u65e0\u6d88\u606f\u8bb0\u5f55\u3002"), !1;
                F.value = "WebQQ_" + b.uin + "_" + c.did + "_" + d + ".html";
                a.value = "<!DOCTYPE HTML><html><head>\t<title>" + c.htmlName + '\u7684\u804a\u5929\u8bb0\u5f55 - Q+ Web</title>\t<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\t<style type="text/css">\t<\!-- \t\tbody{\t\t\tfont:12px/1.5 tahoma, helvetica, clean, sans-serif;\t\t}\t\th3#title {\t\t\tfont-size:14px;\t\t\tfont-weight:bold;\t\t}\t\t#chatInfo {\t\t\tclear:both;\t\t\tcolor:#808080;\t\t\ttext-align:left;\t\t}\t\t#saveDate {\t\t\tpadding-left:20px;\t\t}\t\t#footer {\t\t\tpadding-top:30px;\t\t}\t\t#footer img {\t\t\tborder:0px;\t\t}\t\t.chatBox_myMsg{\t\t\tdisplay:block;\t\t\tmargin:0;\t\t\tpadding:5px;\t\t}\t\t.chatBox_myMsg .msgHead{\t\t\tcolor:#004868;\t\t\toverflow:hidden;\t\t\tzoom:1;\t\t}\t\t.chatBox_myMsg .msgBody{\t\t\tmargin:0 0 0 13px;\t\t\tword-wrap:break-word;\t\t}\t\t.chatBox_buddyMsg{\t\t\tdisplay:block;\t\t\tmargin:0;\t\t\tpadding:5px;\t\t}\t\t.chatBox_buddyMsg .msgHead{\t\t\tcolor:#4a7200;\t\t}\t\t.chatBox_buddyMsg .msgBody{\t\t\tmargin:0 0 0 13px;\t\t\tword-wrap:break-word;\t\t}\t--\> \t</style></head><body>\t<h3 id="title">' + c.htmlName + '\u7684\u804a\u5929\u8bb0\u5f55 - Q+ Web</h3>\t<div id="chatInfo">\t\t<span id="buddyInfo">\u8ba8\u8bba\u7ec4\uff1a' + c.htmlName + '</span>\t\t<span id="saveDate">\u4fdd\u5b58\u65f6\u95f4\uff1a' + f + "</span>\t</div>\t<hr/>\t<\!-- \u804a\u5929\u5185\u5bb9\u5f00\u59cb --\>\t\t\t\t" + g + '\t<\!-- \u804a\u5929\u5185\u5bb9\u7ed3\u675f --\>\t<div id="footer">\t\t<hr/>\t\t<a href="' + EQQ.CONST.EQQ_SERVER_URL + '" target="_blank" title="Q+ Web"><img src="' + EQQ.CONST.EQQ_SERVER_URL + 'style/images/qqweb_logo.png?t=20111011001" alt="Q+ Web Logo"/></a>\t</div></body></html>\t\t\t';
                alloy.portal.recoverCookie();
                A.submit()
            }
        };
        this.onRunScreenCapture = function (a) {
            a = a ? a : d.getCurrent();
            alloy.portal.isWebTop() ? (e.info("run - capture2 - opt"), alloy.portal.runApp("screenCapture2", a)) : alloy.portal.runApp("screenCapture", a)
        };
        this.receiveFile = function (a, c) {
            var f = EQQ.CONST.CONN_SERVER_DOMAIN + "channel/get_file2?lcid=" + a.session_id + "&guid=" + a.name + "&to=" + a.from_uin + "&psessionid=" + EQQ.getPsessionid();
            f += "&count=1&time=" + (new Date).getTime() + "&clientid=" + c;
            var d = b.id("f_download");
            if (typeof d == "undefined" || d == null) d = document.createElement("IFRAME"), d.id = "f_download", d.name = "f_download", d.src = alloy.CONST.MAIN_URL + "domain.html", d.style.display = "none", document.body.appendChild(d);
            d.src = f;
            alloy.util.report2m(133164)
        };
        this.removeReceiveFileLink = function (a) {
            var f = b.id("agree_" + a);
            if (typeof f == "undefined" || f == null) return !1;
            b.id("agree_" + a).style.color = "gray";
            b.id("agree_" + a).style.cursor = "default";
            b.id("refuse_" + a).style.color = "gray";
            b.id("refuse_" + a).style.cursor = "default";
            c.off(b.id("agree_" + a), "click");
            c.off(b.id("refuse_" + a), "click");
            c.on(b.id("agree_" + a), "click", function (a) {
                a.preventDefault()
            });
            c.on(b.id("refuse_" + a), "click", function (a) {
                a.preventDefault()
            })
        };
        this.receiveOffFile = function (a) {
            var c = b.id("agree_" + a.fileid);
            if (typeof c === "undefined" || c == null) return !1;
            c = c.getAttribute("rkey");
            a = "http://" + a.ip + ":" + a.port + "/" + a.name + "?ver=2173&rkey=" + c + "&range=0";
            c = b.id("f_download");
            if (typeof c == "undefined" || c == null) c = document.createElement("IFRAME"), c.id = "f_download", c.name = "f_download",
            c.src = alloy.CONST.MAIN_URL + "domain.html", c.style.display = "none", document.body.appendChild(c);
            c.src = a
        };
        this.nextOffFile = function (a) {
            a = b.id("next_" + a);
            a.style.color = "gray";
            a.style.cursor = "default";
            c.off(a, "click")
        };
        this.cancelOffFile = function (a) {
            var c = b.id("panel_uploadOffFilIframe_" + a.ts);
            c && c.parentNode.removeChild(c);
            this.resetCancelOffFile(a)
        };
        this.resetCancelOffFile = function (a) {
            a = b.id("cancal_uploadOffFile_" + a.ts);
            a.style.color = "gray";
            a.style.cursor = "default";
            c.off(a, "click")
        };
        this.addDiscuChatBox = function (a) {
            a = alloy.windowFactory.createWindow("DiscuChatBox", {
                modeSwitch: !0,
                dragable: !0,
                resize: !0,
                hasCloseButton: !0,
                hasMaxButton: !0,
                hasMinButton: !0,
                noFullButton: !0,
                bodyBorder: 0,
                width: 425,
                height: 346,
                minWidth: 340,
                minHeight: 260,
                userOrGroup: a,
                chatBoxType: "discu",
                hasSideBar: !0
            });
            H[a.uin] = a;
            u.push(a);
            c.notifyObservers(d, "ChatBoxAdd", a);
            return a
        };
        this.createSendFilePanel = function () {
            var a = d.getCurrent();
            if (!a) return e.out("chatBox is null"), !1;
            var f = a.uin;
            l = b.node("div", {
                "class": "sendFilePanel"
            });
            k.appendChild(l);
            z[f] = new alloy.layout.PopupBox({
                container: l,
                html: '<iframe id="panel_uploadOffFilIframe_' + f + '" name="panel_uploadOffFilIframe_' + f + '" style="display:none" src="./domain.html"></iframe>\t\t\t\t\t<form id="panel_uploaOffFile_' + f + '" name="panel_uploaOffFile_' + f + '"  title="\u53d1\u9001\u79bb\u7ebf\u6587\u4ef6..." class="panelSendForm" target="panel_uploadOffFilIframe_' + f + '" action="" method="POST" enctype="multipart/form-data">\t\t\t\t\t   <a href="#" hidefocus="true" id="panel_offFileButton_' + f + '" class="simpleMenuItem panel_sendOffFileButton" title="\u53d1\u9001\u79bb\u7ebf\u6587\u4ef6...">\t\t\t\t\t\t\t<input name="callback" type="hidden" value="parent.EQQ.Model.ChatMsg.callbackSendOffFile">\t\t\t\t\t\t\t<input name="locallangid" type="hidden" value="2052">\t\t\t\t\t\t\t<input name="clientversion" type="hidden" value="1409">\t\t\t\t\t\t\t<input name="uin" type="hidden" value="' + f + '">\t\t\t\t\t\t\t<input name="skey" type="hidden" value="@325fz2vag">\t\t\t\t\t\t\t<input name="appid" type="hidden" value="1002101">\t\t\t\t\t\t\t<input name="peeruin" type="hidden" value="' + f + '">\t\t\t\t\t\t\t<input name="vfwebqq" type="hidden" value="">\t\t\t\t\t\t\t<input id="offline_f_' + f + '" class="f" name="file" type="file">\t\t\t\t\t\t\t<input name="fileid" type="hidden" value="' + f + '">\t\t\t\t\t\t\t<input name="senderviplevel" type="hidden" value="">\t\t\t\t\t\t\t<input name="reciverviplevel" type="hidden" value="">\t\t\t\t\t   </a>\t\t\t\t\t</form>\t\t\t\t\t<iframe id="panel_uploadFilIframe_' + f + '" name="panel_uploadFilIframe_' + f + '" style="display:none" src="./domain.html"></iframe>\t\t\t\t\t<form id="panel_uploadFile_' + f + '" name="panel_uploadFile_' + f + '"  title="\u53d1\u9001\u6587\u4ef6..." class="panelSendForm" target="panel_uploadFilIframe_' + f + '" action="" method="POST" enctype="multipart/form-data">\t\t\t\t\t   <a href="#" id="panel_fileButton_' + f + '" hidefocus="true" class="simpleMenuItem panel_sendFileButton" title="\u53d1\u9001\u6587\u4ef6...">\t\t\t\t\t\t\t<input id="upload_file_' + f + '" class="f" name="file" type="file" >\t\t\t\t\t   </a>\t\t\t\t\t</form>\t\t\t'
            });
            var g = b.id("panel_uploaOffFile_" + f),
                a = b.id("panel_uploadFile_" + f),
                g = b.mini("input.f", g)[0],
                a = b.mini("input.f", a)[0];
            c.on(g, "mousedown", function (a) {
                a.stopPropagation()
            });
            c.on(g, "mouseup", function (a) {
                a.stopPropagation();
                d.setSendFilePanelClass(f)
            });
            c.on(g, "click", function (a) {
                a.stopPropagation()
            });
            c.on(g, "change", function () {
                d.uploadOffFile()
            });
            c.on(a, "mousedown", function (a) {
                a.stopPropagation()
            });
            c.on(a, "mouseup", function (a) {
                a.stopPropagation();
                d.setSendFilePanelClass(f)
            });
            c.on(a, "click", function (a) {
                a.stopPropagation()
            });
            c.on(a, "change", function () {
                d.uploadSendFile()
            });
            return !0
        };
        this.cancalUploadOffFile = function (a) {
            b.id("panel_uploadOffFilIframe_" + a).reload()
        };
        this.showSendFilePanel = function (a) {
            var c = a.xy,
                a = a.uin;
            if ((e.isUndefined(z[a]) || !z[a]) && !this.createSendFilePanel()) return !1;
            a = z[a];
            b.removeClass(a.container, "sendFilePanelEx");
            if (c) {
                var f = a.getWidth(),
                    d = a.getHeight(),
                    g = alloy.layout.getClientWidth(),
                    q = alloy.layout.getClientHeight(),
                    B = c[0],
                    c = c[1] + 18;
                B < 2 && (B = 2);
                c < 2 && (c = 2);
                B > g - f - 2 && (B = g - f - 2);
                c > q - d - 2 && (c = q - d - 2);
                a.setXY(B, c)
            }
            a.setZIndex(alloy.layout.getTopZIndex(3));
            a.show()
        };
        this.hideSendFilePanel = function (a) {
            if (e.isUndefined(a) || !a) for (var b in z) a = z[b], a.hide();
            else if (a = z[a]) return a.hide()
        };
        this.setSendFilePanelClass = function (a) {
            if (e.isUndefined(a) || !a) for (var c in z) a = z[c], b.addClass(a.container, "sendFilePanelEx");
            else(a = z[a]) && b.addClass(a.container, "sendFilePanelEx")
        };
        this.isShowSendFilePanel = function (a) {
            return (a = z[a]) ? a.isShow() : !1
        };
        this.closeSendFilePanel = function (a) {
            var b = z[a];
            b && (b.destroy(), delete z[a])
        }
    })
})();
(function () {
    WebqCore.register("EQQ.View.TaskBar", function (e) {
        var d = e.dom,
            b = e.event,
            c = this,
            n = !1,
            p = EQQ.getChatboxMode(),
            k = {}, h = [];
        this.init = function () {
            n = !1;
            p = EQQ.getChatboxMode();
            h = [];
            this.EQQ_Container = d.id("EQQ_Container");
            this.EQQ_ChatBuddyList = d.id("EQQ_ChatBuddyList")
        };
        this.toggleModel = function (d) {
            p = d;
            d == "adsorb" ? b.notifyObservers(c, "ClickAdsorbModelButton") : b.notifyObservers(c, "ClickFreeModelButton")
        };
        this.showFreeModelButton = function () {};
        this.showAdsorbModelButton = function () {};
        this.createTaskDom = function (m, p) {
            var k = document.createElement("div");
            k.className = "EQQ_taskBar_buddy";
            k.id = "BuddyInTaskbar_" + m.uin;
            k.title = m.showName + " - " + EQQ.hash.onlineStatusText[m.state];
            var h = '<div id="mask_BuddyInTaskbar_<%=uin%>" class="EQQ_taskBar_buddy_mask">\t\t\t\t<div id="EQQ_FlashDiv_<%=uin%>" class="EQQ_TaskBar_FlashDiv">\t\t\t\t\t<div id="EQQ_TaskBar_BuddyState_<%=uin%>" class="EQQ_taskBar_<%=state%>Buddy">\t\t\t\t\t\t<img class="EQQ_taskBar_avatar" src="' + EQQ.getUserAvatar(m.uin) + '" />\t\t\t\t\t\t<div class="EQQ_taskBar_state"><%=state%></div>                        <div id="EQQ_taskBar_typing_<%=uin%>" class="EQQ_taskBar_typing">                            <img title="typing" src="http://0.web.qstatic.com/webqqpic/pubapps/0/50/images/typing.gif" />                        </div>\t\t\t\t\t</div>\t\t\t\t\t<div class="EQQ_taskBar_nick" id="EQQ_taskBar_nick_<%=uin%>"><%=htmlShowName%></div>\t\t\t\t</div>\t\t\t\t<div id="EQQ_TaskBar_CloseChatboxButton_<%=uin%>" class="EQQ_TaskBar_CloseChatboxButton" title="\u5173\u95ed\u4f1a\u8bdd\u7a97\u53e3">X</div>\t\t\t</div>',
                h = e.string.template(h, m);
            k.innerHTML = h;
            this.EQQ_ChatBuddyList.appendChild(k);
            if (h = d.id("EQQ_TaskBar_CloseChatboxButton_" + m.uin)) b.on(h, "click", function (d) {
                d.stopPropagation();
                b.notifyObservers(c, "ClickCloseButton", m.uin)
            });
            b.on(k, "click", function (c) {
                c.preventDefault();
                b.notifyObservers(p, "TaskClick")
            });
            return k
        };
        this.createGroupTaskDom = function (m, p) {
            var k = document.createElement("div");
            k.className = "EQQ_taskBar_buddy";
            k.id = "BuddyInTaskbar_" + m.gid;
            k.title = m.titleShowName;
            var h = '<div id="mask_BuddyInTaskbar_<%=gid%>" class="EQQ_taskBar_buddy_mask">\t\t\t\t<div id="EQQ_FlashDiv_<%=gid%>" class="EQQ_TaskBar_FlashDiv">\t\t\t\t\t<div id="EQQ_TaskBar_BuddyState_<%=gid%>" class="EQQ_taskBar_<%=type%>Buddy">\t\t\t\t\t\t<img class="EQQ_taskBar_avatar" src="' + EQQ.getGroupAvatar(m.code) + '" />\t\t\t\t\t\t<div class="EQQ_taskBar_state"><%=type%></div>\t\t\t\t\t</div>\t\t\t\t\t<div id="EQQ_taskBar_nick_<%=gid%>" class="EQQ_taskBar_nick"><%=htmlShowName%></div>\t\t\t\t</div>\t\t\t\t<div id="EQQ_TaskBar_CloseChatboxButton_<%=gid%>" class="EQQ_TaskBar_CloseChatboxButton" title="\u5173\u95ed\u4f1a\u8bdd\u7a97\u53e3">X</div>\t\t\t</div>',
                h = e.string.template(h, m);
            k.innerHTML = h;
            this.EQQ_ChatBuddyList.appendChild(k);
            if (h = d.id("EQQ_TaskBar_CloseChatboxButton_" + m.gid)) b.on(h, "click", function (d) {
                d.stopPropagation();
                b.notifyObservers(c, "ClickCloseButton", m.gid)
            });
            b.on(k, "click", function (c) {
                c.preventDefault();
                b.notifyObservers(p, "TaskClick")
            });
            return k
        };
        this.getClientWidth = function () {
            return alloy.layout.getClientWidth()
        };
        this.updateGroupMarkName = function (b) {
            var c = d.id("EQQ_taskBar_nick_" + b.gid);
            if (c) c.innerHTML = b.htmlShowName
        };
        this.updateBuddyName = function (b) {
            var c = d.id("EQQ_taskBar_nick_" + b.uin);
            if (c) c.innerHTML = b.nick
        };
        this.showTyping = function (b) {
            k[b] && (clearTimeout(k[b]),
            k[b] = null);
            var c = d.id("EQQ_taskBar_typing_" + b);
            c && (d.setStyle(c, "display", "inline"), k[b] = setTimeout(function () {
                c && d.setStyle(c, "display", "none");
                clearTimeout(k[b]);
                k[b] = null
            }, 7E3))
        };
        this.hideTyping = function (b) {
            k[b] && (clearTimeout(k[b]), k[b] = null);
            (b = d.id("EQQ_taskBar_typing_" + b)) && d.setStyle(b, "display", "none")
        };
        this.setNotCurrent = function (e) {
            d.setClass(e, "EQQ_taskBar_buddy");
            d.setClass(d.id("mask_" + e.id), "EQQ_taskBar_buddy_mask");
            b.on(e, "mouseover", c.changeColor);
            b.on(e, "mouseout", c.resetColor)
        };
        this.setCurrent = function (e) {
            b.off(e, "mouseover", c.changeColor);
            b.off(e, "mouseout", c.resetColor);
            d.setClass(e, "EQQ_taskBar_buddy");
            d.addClass(e, "EQQ_taskBar_currentBuddy");
            p === "adsorb" ? d.addClass(d.id("mask_" + e.id), "EQQ_taskBar_buddy_mask_arr") : d.setClass(d.id("mask_" + e.id), "EQQ_taskBar_buddy_mask")
        };
        this.removeTask = function (b) {
            this.EQQ_ChatBuddyList.removeChild(b)
        };
        this.resetTaskBar = function () {};
        this.getRight = function (b) {
            return alloy.layout.getClientWidth() - d.getClientXY(b)[0]
        };
        this.getLeft = function (b) {
            return d.getClientXY(b)[0]
        };
        this.setBuddyState = function (b) {
            var c = d.id("EQQ_TaskBar_BuddyState_" + b.uin);
            c && d.setClass(c, "EQQ_taskBar_" + b.state + "Buddy");
            if (c = d.id("BuddyInTaskbar_" + b.uin)) c.title = b.showName + " - " + EQQ.hash.onlineStatusText[b.state]
        };
        this.changeColor = function () {
            d.addClass(this, "task_BuddyInTaskbar_over")
        };
        this.resetColor = function () {
            d.setClass(this, "EQQ_taskBar_buddy")
        };
        this.setReceiveMsgColor = function () {
            d.addClass(this, "task_BuddyInTaskbar_msg")
        };
        this.resetJumpCount = function (b, c) {
            if (typeof h[b] === "undefined" || typeof h[b].time === "undefined" || h[b].time != c) {
                h[b] = {
                    count: 5,
                    time: c
                };
                var k = d.id("BuddyInTaskbar_" + b);
                k && e.bind(this.resetColor, k)()
            }
        };
        this.jumpUp = function (b) {
            n = !0;
            for (var c = 0; c < b.length; c++) {
                var k = d.id("BuddyInTaskbar_" + b[c]);
                k && (h[b[c]].count--, e.bind(this.setReceiveMsgColor, k)())
            }
        };
        this.jumpDown = function (b) {
            n = !1;
            for (var c = 0; c < b.length; c++) {
                var k = d.id("BuddyInTaskbar_" + b[c]);
                k && !(h[b[c]].count < 1) && e.bind(this.resetColor, k)()
            }
        };
        this.jumpAvatar = function (b) {
            n ? this.jumpDown(b) : this.jumpUp(b)
        };
        this.createDiscuTaskDom = function (k,
        p) {
            var h = document.createElement("div");
            h.className = "EQQ_taskBar_buddy";
            h.id = "BuddyInTaskbar_" + k.did;
            h.title = k.titleName;
            var n = '<div id="mask_BuddyInTaskbar_<%=did%>" class="EQQ_taskBar_buddy_mask">\t\t\t\t<div id="EQQ_FlashDiv_<%=did%>" class="EQQ_TaskBar_FlashDiv">\t\t\t\t\t<div id="EQQ_TaskBar_BuddyState_<%=did%>" class="EQQ_taskBar_Buddy">\t\t\t\t\t\t<img class="EQQ_taskBar_avatar" src="' + alloy.util.getDiscuAvatar(k.did) + '" />\t\t\t\t\t\t<div class="EQQ_taskBar_state"> </div>\t\t\t\t\t</div>\t\t\t\t\t<div id="EQQ_taskBar_nick_<%=did%>" class="EQQ_taskBar_nick"><%=htmlName%></div>\t\t\t\t</div>\t\t\t\t<div id="EQQ_TaskBar_CloseChatboxButton_<%=did%>" class="EQQ_TaskBar_CloseChatboxButton" title="\u5173\u95ed\u4f1a\u8bdd\u7a97\u53e3">X</div>\t\t\t</div>',
                n = e.string.template(n, k);
            h.innerHTML = n;
            this.EQQ_ChatBuddyList.appendChild(h);
            if (n = d.id("EQQ_TaskBar_CloseChatboxButton_" + k.did)) b.on(n, "click", function (d) {
                d.stopPropagation();
                b.notifyObservers(c, "ClickCloseButton", k.did)
            });
            b.on(h, "click", function (c) {
                c.preventDefault();
                b.notifyObservers(p, "TaskClick")
            });
            return h
        };
        this.updateDiscuName = function (b) {
            var c = d.id("EQQ_taskBar_nick_" + b.did);
            if (c) c.innerHTML = b.htmlName, d.id("BuddyInTaskbar_" + b.did).title = b.titleName
        }
    })
})();
(function () {
    WebqCore.register("EQQ.View.ChatBox", function (e) {
        var d = e.event,
            b = e.dom,
            c = e.browser,
            n = this.Editor = new e.Class({
                extend: e.ui.BaseEditor
            }, {
                init: function (b) {
                    var c = this;
                    this.callSuper = function (b) {
                        var d = Array.prototype.slice,
                            e = d.call(arguments, 1);
                        n.superClass[b].apply(c, e.concat(d.call(arguments)))
                    };
                    b = b || {};
                    b.nodeFilter = this.nodeFilter;
                    this.callSuper("init", b);
                    this.loadStyle()
                },
                nodeFilter: function (b) {
                    return b.tagName === "IMG" && b.getAttribute("mark") ? !0 : !1
                },
                focus: function () {
                    var c = b.getClientXY(this._container),
                        d = b.getClientWidth(this._container),
                        e = b.getClientHeight(this._container),
                        m = b.getClientWidth(),
                        n = b.getClientHeight();
                    c[0] + d > m || c[1] + e > n ? this.option.keepCursor && this.restoreRange() : this.callSuper("focus")
                },
                onKeyUp: function (b) {
                    d.notifyObservers(this, "Typing", b)
                },
                save: function () {
                    this.clearNodes();
                    var b = this.getHtml(),
                        b = b.replace(/\n|\t|\r/g, ""),
                        b = b.replace(/<img\s+.*?mark="(.+?)".*?\/?>/ig, "$1").replace(/<br>/ig, "\n").replace(/&nbsp;/g, " ").replace(/<([^>]+).*?>/ig, "").replace(/&lt;/ig, "<").replace(/&gt;/ig, ">").replace(/&amp;/ig, "&");
                    this.setText(b)
                },
                insertSystemFace: function (b) {
                    var c = b.match(/\d+/),
                        c = c ? c[0] : b;
                    this.insertHtml('<img mark="' + b + '" src="' + EQQ.CONST.SYSTEM_FACE_URL + c + '.gif" class="system" />')
                },
                insertCustomFace: function (b) {
                    var c = b.match(/\d+/),
                        c = c ? c[0] : b,
                        c = EQQ.Model.ChatMsg.getCustomFaceList()[c][0];
                    this.insertHtml('<img mark="' + b + '" src="' + EQQ.CONST.CONN_SERVER_DOMAIN2 + "cgi-bin/webqq_app/?cmd=2&bd=" + e.string.encodeUriComponent(c) + '" class="custom" />')
                },
                insertImage: function (b, c) {
                    this.insertHtml('<img mark="' + b + '" src="' + c + '" class="custom" />')
                },
                setStyle: function (c, d, e) {
                    b.setStyle(this._container, c, d);
                    e && this.setConfigStyles(this.getAllStyles().join("|"))
                },
                getStyle: function (c) {
                    return b.getStyle(this._container, c)
                },
                getAllStyles: function () {
                    var b = this.getStyle("fontWeight");
                    /\d+/.test(b) && (b = parseInt(b) >= 700 ? "bold" : "normal");
                    return [this.getStyle("fontFamily").replace(/'/g, ""), this.getStyle("fontSize"), b, this.getStyle("fontStyle"), this.getStyle("textDecoration"), this.getStyle("color")]
                },
                getConfigStyles: function () {
                    return c.mobileSafari ? null : alloy.config.configList.fontFormat
                },
                setConfigStyles: function (b) {
                    alloy.config.configList.fontFormat = b;
                    alloy.rpcService.sendSetConfig({
                        context: this,
                        data: {
                            r: {
                                appid: qqweb.config.__eqqid,
                                value: {
                                    fontFormat: b
                                }
                            }
                        },
                        action: "set"
                    })
                },
                loadStyle: function () {
                    var b = this.getConfigStyles();
                    if (b) {
                        var b = b.split("|"),
                            c = 0;
                        this.setStyle("fontFamily", b[c++]);
                        this.setStyle("fontSize", b[c++]);
                        this.setStyle("fontWeight", b[c++]);
                        this.setStyle("fontStyle", b[c++]);
                        this.setStyle("textDecoration", b[c++]);
                        this.setStyle("color",
                        b[c++])
                    } else this.setStyle("fontFamily", "\u5b8b\u4f53"), this.setStyle("fontSize", "10pt"), this.setStyle("fontWeight", "normal"), this.setStyle("fontStyle", "normal"), this.setStyle("textDecoration", "none"), this.setStyle("color", "#000000")
                }
            })
    })
})();
(function () {
    WebqCore.register("EQQ.Presenter.MainPanel", function (e) {
        var d = this,
            b = e.event,
            c = !1,
            n = [],
            p = [],
            k = [],
            h = [],
            m = [],
            r = !0,
            I = !1,
            v = !1,
            w = !1,
            x = !1;
        this.init = function () {
            c = !1;
            n = [];
            p = [];
            k = [];
            h = [];
            m = [];
            r = !0;
            x = w = v = I = !1;
            this.View = EQQ.View.MainPanel;
            if (e.browser.ie && e.browser.ie == 7) {
                var a = e.GetSwfVer();
                a != -1 ? (a = a.split(" ")[1].split(","), parseInt(a[0]) >= 10 ? (w = !0, this.View = EQQ.View.MainPanelFlex, b.addObserver(EQQ.Model.ChatMsg, "flexStartJump", e.bind(this.onFlexStartJump, this)), b.addObserver(EQQ.Model.ChatMsg, "flexStopJump", e.bind(this.onFlexStopJump, this))) : s()) : s()
            }
            this.View.createDom(this.getContainer());
            b.addObserver(EQQ, "CloseWebQQ", e.bind(this.onCloseWebQQ, this));
            b.addObserver(EQQ, "SelfOffline", e.bind(this.onSelfOffline, this));
            b.addObserver(EQQ, "LoginSuccess", i);
            b.addObserver(EQQ, "LoginFailure", e.bind(G, this));
            b.addObserver(EQQ, "PtwebqqFail", e.bind(C, this));
            b.addObserver(EQQ.RPCService, "ChangeStatusSuccess", e.bind(F, this));
            b.addObserver(alloy.portal, "UserAvatarChanged", e.bind(this.onUserAvatarChanged,
            this));
            b.addObserver(alloy.portal, "selfInfoReady", e.bind(this.onSelfInfoReady, this));
            b.addObserver(alloy.rpcService, "SetBuddySignatureSuccess", e.bind(this.onSetBuddySignatureSuccess, this));
            b.addObserver(alloy.rpcService, "ManageError", e.bind(this.onManageError, this));
            b.addObserver(EQQ.Model.BuddyList, "ManageError", e.bind(this.onManageError, this));
            b.addObserver(alloy.rpcService, "SetBuddySignatureError", e.bind(this.onSetBuddySignatureError, this));
            b.addObserver(EQQ.Model.BuddyList, "SelfInfoChange", e.bind(this.onSelfInfoChange,
            this));
            b.addObserver(EQQ.Model.BuddyList, "SelfStateChange", e.bind(this.updateSelfStateChange, this));
            b.addObserver(EQQ.Model.BuddyList, "SelfSignatureChange", e.bind(this.handleSelfSignatureChange, this));
            b.addObserver(EQQ.Model.BuddyList, "UserSignatureChange", D);
            b.addObserver(EQQ.Model.BuddyList, "UserQQLevelChange", t);
            b.addObserver(EQQ.Model.BuddyList, "GroupAnnouncementChange", E);
            b.addObserver(EQQ.Model.BuddyList, "LoginFail", e.bind(this.onLoginFail, this));
            b.addObserver(EQQ.Model.BuddyList, "GetUserInfoSuccess",
            e.bind(this.onGetUserInfoSuccess, this));
            b.addObserver(EQQ.Model.BuddyList, "BuddyClassChange", e.bind(this.onBuddyClassChange, this));
            b.addObserver(EQQ.Model.BuddyList, "BuddyClassMove", e.bind(this.onBuddyClassMove, this));
            b.addObserver(EQQ.Model.BuddyList, "AllClassOnlineBuddyReady", e.bind(this.onAllClassOnlineBuddyReady, this));
            b.addObserver(this.View, "SendGetRecentList", f);
            b.addObserver(EQQ.Model.BuddyList, "GroupNameChange", this.onOnGroupNameChange);
            b.addObserver(EQQ.Model.BuddyList, "AddBuddy", e.bind(this.onAddANewBuddy,
            this));
            b.addObserver(EQQ.Model.BuddyList, "RemoveBuddy", e.bind(this.onRemoveBuddy, this));
            b.addObserver(EQQ.Model.BuddyList, "MoveBuddyClass", e.bind(this.onMoveBuddyClass, this));
            b.addObserver(EQQ.Model.BuddyList, "GroupListChange", e.bind(this.onGroupListChange, this));
            b.addObserver(EQQ.Model.BuddyList, "AddNewGroupToList", e.bind(this.onAddNewGroupToList, this));
            b.addObserver(EQQ.Model.BuddyList, "GroupMaskChange", e.bind(this.onGroupMaskChange, this));
            b.addObserver(EQQ.Model.BuddyList, "SingleGroupMaskChange",
            e.bind(this.onSingleGroupMaskChange, this));
            b.addObserver(EQQ.Model.BuddyList, "RecentListChange", e.bind(this.onRecentListChange, this));
            b.addObserver(EQQ.Model.ChatMsg, "NewStranger", e.bind(this.onNewStranger, this));
            b.addObserver(EQQ.Model.ChatMsg, "MessageBoxUserListChange", e.bind(this.onMessageBoxUserListChange, this));
            b.addObserver(EQQ.Model.ChatMsg, "MessageBoxGroupListChange", e.bind(this.onMessageBoxGroupListChange, this));
            b.addObserver(EQQ.Model.ChatMsg, "MessageListChange", e.bind(this.onMessageListChange,
            this));
            b.addObserver(EQQ.Model.ChatMsg, "GroupMessageListChange", e.bind(this.onGroupMessageListChange, this));
            b.addObserver(this.View, "StartChat", j);
            b.addObserver(this.View, "AskVideo", y);
            b.addObserver(this.View, "StartGroupChat", l);
            b.addObserver(this.View, "StartDiscuChat", J);
            b.addObserver(this.View, "SelfStateChange", e.bind(this.onViewSelfStateChange, this));
            b.addObserver(this.View, "SetGroupMaskState", g);
            b.addObserver(this.View, "AddPObservers", e.bind(this.onAddPObservers, this));
            b.addObserver(this.View, "ExitPortal", e.bind(this.onExitPortal, this));
            b.addObserver(this.View, "CloseWebQQ", e.bind(z, this));
            b.addObserver(this.View, "MinMainPanel", e.bind(u, this));
            b.addObserver(this.View, "ReLogin", e.bind(H, this));
            b.addObserver(this.View, "MoveBuddyClass", e.bind(this.moveBuddyClass, this));
            b.addObserver(this.View, "RemoveBuddy", e.bind(this.removeBuddy, this));
            b.addObserver(this.View, "SetUserMarkName", e.bind(this.setUserMarkName, this));
            b.addObserver(this.View, "RemoveBuddyConfirm", e.bind(this.removeBuddyConfirm, this));
            b.addObserver(this.View, "GetSingleMenuClassItems", e.bind(this.getSingleMenuClassItems, this));
            b.addObserver(this.View, "Search", e.bind(this.onSearch, this));
            b.addObserver(this.View, "BuddyListReady", e.bind(this.onBuddyListDomReady, this));
            b.addObserver(this.View, "CloseYellowTipsFinish", e.bind(this.onCloseYellowTipsFinish, this));
            b.addObserver(this.View, "MiniCardShow", o);
            b.addObserver(EQQ.Model.BuddyList, "DiscuListChange", e.bind(this.onDiscuListChange, this));
            b.addObserver(EQQ.Model.BuddyList, "AddNewDiscuToList",
            e.bind(this.onAddNewDiscuToList, this));
            b.addObserver(EQQ.Model.BuddyList, "ToStartDiscuChat", J);
            b.addObserver(EQQ.Model.BuddyList, "ModifyDiscuTopicSuccess", M);
            b.addObserver(EQQ, "QuitDiscu", O);
            b.addObserver(EQQ.Model.BuddyList, "QuitDiscuSuccess", N);
            b.addObserver(EQQ.Model.ChatMsg, "MessageBoxDiscuListChange", e.bind(this.onMessageBoxDiscuListChange, this));
            b.addObserver(EQQ.Model.BuddyList, "SingleDiscuMaskChange", L);
            b.addObserver(EQQ.Model.ChatMsg, "ServerDiscuInfochange", P);
            b.addObserver(EQQ.Model.BuddyList, "DiscuInfoChange", M);
            b.addObserver(EQQ.Model.ChatMsg, "DiscuMessageListChange", e.bind(this.onDiscuMessageListChange, this));
            b.addObserver(EQQ, "GetDiscuListFail", Q);
            this.View.init();
            this.View.setNoneFlashStyle && this.View.setNoneFlashStyle()
        };
        var s = function () {
            alloy.windowFactory.createWindow("Window", {
                title: "\u6e29\u99a8\u63d0\u793a",
                modeSwitch: !0,
                dragable: !0,
                resize: !0,
                width: 400,
                height: 50,
                hasCloseButton: !0,
                hasOkButton: !0,
                isSetCentered: !0
            }).setHtml('<div style="width:100%; height:100%; background-color:#FFFFFF; line-height:60px;text-align:center; vertical-align:middle;">\t\t\t\t\t\t\u68c0\u6d4b\u5230\u60a8\u4e3aIE7\u5185\u6838\u7528\u6237\uff0c\u8bf7\u5b89\u88c5\u6700\u65b0<a target="_blank" href="http://get.adobe.com/flashplayer">Flash\u7248\u672c</a>\uff0c\u83b7\u5f97\u66f4\u597d\u4f53\u9a8c\uff01\t\t\t\t\t   </div>')
        };
        this.onAddPObservers = function () {
            r = !1;
            b.addObserver(EQQ.Model.BuddyList, "BuddyListChange", e.bind(this.onBuddyListChange, this));
            b.addObserver(EQQ.Model.BuddyList, "BuddyStateChange", e.bind(this.onBuddyStateChange, this));
            b.addObserver(EQQ.Model.BuddyList, "OnlineBuddyChange", e.bind(this.onOnlineBuddyChange, this))
        };
        this.onBuddyListDomReady = function () {
            if (!I) {
                if (r) this.onAddPObservers();
                b.addObserver(EQQ.Model.BuddyList, "UserNameChange", e.bind(this.onUserNameChange, this));
                I = !0
            }
            v = !0
        };
        this.getContainer = function () {
            return EQQ.panel.mainPanel
        };
        var D = function (a) {
            d.View.miniCardPanel && (e.out("onUserSignatureChange 33:" + a.uin), d.View.miniCardPanel.setSignature(a));
            d.View.updateBuddySignature(a)
        }, t = function (a) {
            d.View.miniCardPanel && (e.out("onUserQQLevelChange 33:" + a.uin), d.View.miniCardPanel.setQQLevel(a))
        }, E = function (a) {
            d.View.updateGroupAnnouncement(a)
        }, o = function (a) {
            a && (EQQ.Model.BuddyList.getUserSignature(a.uin), EQQ.Model.BuddyList.sendGetQQLevel(a.uin))
        };
        this.showYellowTips = function () {
            this.View.showYellowTips()
        };
        this.hideYellowTips = function () {
            this.View.hideYellowTips()
        };
        this.onCloseYellowTipsFinish = function () {
            this.setCookieTips("hide")
        };
        this.getCookieTips = function () {
            return e.cookie.get("is_close_tips", EQQ.CONST.MAIN_DOMAIN)
        };
        this.setCookieTips = function (a) {
            e.cookie.set("is_close_tips", a, EQQ.CONST.MAIN_DOMAIN, null, 120)
        };
        this.onSearch = function (a) {
            this.View.showSearchResult(EQQ.Model.BuddyList.searchBuddy(a, 5))
        };
        this.showMiniCardPanel = function (a, b) {
            this.View.showMiniCardPanel(a, b)
        };
        this.hideMiniCardPanel = function () {
            this.View.hideMiniCardPanel()
        };
        this.onLoginFail = function () {
            alloy.layout.alert("\u767b\u5f55\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5",
            null, {
                windowType: "EqqWindow"
            })
        };
        this.onSelfInfoChange = function (a) {
            this.View.updateSelfInfoChange(a)
        };
        this.onSelfInfoReady = function (a) {
            this.View.updateSelfInfoChange(a)
        };
        this.onSetBuddySignatureSuccess = function (a) {
            EQQ.Model.BuddyList.getSelf().setSignature(a);
            this.handleSelfSignatureChange({
                signature: a
            });
            alloy.util.report2im("personalinfo|personalmsg|personalmsgsucceed")
        };
        this.onManageError = function (a) {
            alloy.layout.alert({
                mark: "\u4fee\u6539\u5907\u6ce8",
                mod: "\u79fb\u52a8\u5206\u7ec4",
                del: "\u5220\u9664\u597d\u53cb"
            }[a] + "\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5", null, {
                windowType: "EqqWindow"
            });
            switch (a) {
            case "mark":
                qqweb.util.report2qqweb("contextmenu|contancts|changenamefail");
                break;
            case "del":
                qqweb.util.report2qqweb("contextmenu|contancts|deletefail");
                break;
            case "mod":
                qqweb.util.report2qqweb("contextmenu|contancts|movefail")
            }
        };
        this.onSetBuddySignatureError = function () {
            alloy.layout.alert("\u7b7e\u540d\u4fee\u6539\u5931\u8d25", null, {
                windowType: "EqqWindow"
            })
        };
        this.onUserAvatarChanged = function () {
            this.View.updateSelftAvatar()
        };
        this.onOnGroupNameChange = function (a) {
            typeof d.View != "undefined" && d.View.updateGroupMarkName(a)
        };
        this.updateSelfStateChange = function (a) {
            this.View.updateSelfStateChange(a)
        };
        this.handleSelfSignatureChange = function (a) {
            this.View.updateSelfSignatureChange(a)
        };
        this.onSelfOffline = function (a) {
            var b = EQQ.Model.BuddyList.getSelf();
            v = x = !1;
            EQQ.stopPoll();
            if (b) b.oldState = b.state, b.state = "offline";
            this.updateSelfStateChange("offline");
            a.action == "relogin" ? A(a.message) : EQQ.showEQQtips({
                title: "\u8fde\u63a5\u4e2d\u65ad",
                content: a.message,
                callback: function () {
                    EQQ.reLogin()
                }
            })
        };
        var i = function () {}, G = function () {
            this.updateSelfStateChange("offline")
        }, C = function () {
            this.updateSelfStateChange("offline")
        }, A = function (a) {
            EQQ.hideEQQtips();
            alloy.layout.showLoginWindow("eqq", !0, null, a)
        }, F = function (a) {
            EQQ.Model.BuddyList.setSelfState(a)
        };
        this.onBuddyClassChange = function (a) {
            this.clearBuddyList();
            this.View.createBuddyClass(a);
            this.View.hideLogin()
        };
        this.onAllClassOnlineBuddyReady = function () {
            x || (x = !0, this.onBuddyClassListReady())
        };
        this.onBuddyClassListReady = function () {
            EQQ.loginEnd = (new Date).getTime();
            var a = EQQ.loginEnd - EQQ.loginStart;
            a /= 1E3;
            e.out("time: " + a)
        };
        this.onBuddyListChange = function (a) {
            !v && !w && (this.updateAllBuddyClassCount(EQQ.Model.BuddyList.getClassList()), this.createBuddyList(a))
        };
        this.onGroupListChange = function (a) {
            this.View.createGroupList(a)
        };
        this.onAddNewGroupToList = function (a) {
            this.View.addGroup(a)
        };
        this.moveBuddyClass = function (a) {
            EQQ.Model.BuddyList.moveBuddyClass(a.uin, a.classId);
            qqweb.util.report2qqweb("contextmenu|contancts|move")
        };
        this.onMoveBuddyClass = function (a) {
            a && (w ? this.View.moveBuddyClassCallBack(a.user, a.oldClass.index, a.newClass.index) : (this.View.updateBuddyClassCount(a.oldClass), this.View.updateBuddyClassOnlineBuddy(a.oldClass), this.View.updateBuddyClassCount(a.newClass), this.View.updateBuddyClassOnlineBuddy(a.newClass), this.View.removeBuddy(a.user.uin), this.View.addBuddy(a.user)))
        };
        this.removeBuddy = function (a) {
            EQQ.Model.BuddyList.sendRemoveBuddy(a.uin, a.check)
        };
        this.removeBuddyConfirm = function (a) {
            this.View.removeBuddyConfirm(EQQ.Model.BuddyList.getUserByUin(a))
        };
        this.onRemoveBuddy = function (a) {
            if (w) this.View.removeBuddyCallBack(a.user, a.classObj.index);
            else {
                var b = a.classObj,
                    c = a.user;
                this.View.removeBuddy(c.uin);
                c.classId == EQQ.hash.userClassType.stranger ? (b = EQQ.Model.BuddyList.getStrangerList(), this.View.updateStrangerClassOnlineCount(b.length), this.View.updateStrangerClassCount(b)) : (this.View.updateBuddyClassCount(b), c.getState() != EQQ.hash.onlineStatus.offline && (this.View.removeOnlineBuddy(c), this.View.updateOnlineBuddyClass(EQQ.Model.BuddyList.getOnlineBuddy()),
                this.View.updateBuddyClassOnlineBuddy(b)))
            }
            this.View.removeRecentBuddy(a.user)
        };
        this.setUserMarkName = function (a) {
            EQQ.Model.BuddyList.setUserMarkName(a.uin, a.markname)
        };
        this.onAddANewBuddy = function (a) {
            var b = a.user;
            this.View.addBuddy(b);
            var c = EQQ.Model.BuddyList.getClassById(b.classId);
            this.View.updateBuddyClassCount(c);
            var f = EQQ.Model.BuddyList.getBuddyByUin(b.uin);
            a.markname && f.setMarkName(a.markname);
            b.getState() != EQQ.hash.onlineStatus.offline && (this.View.addOnlineBuddy(f), this.View.updateOnlineBuddyClass(EQQ.Model.BuddyList.getOnlineBuddy()),
            this.View.updateBuddyClassOnlineBuddy(c))
        };
        this.onBuddyStateChange = function (a) {
            w ? v && (a = EQQ.Model.BuddyList.getUserByUin(a), this.View.onBuddyStateChange({
                uin: a.uin,
                client_type: a.clientType,
                state: a.state,
                nick: a.nick
            })) : (a = EQQ.Model.BuddyList.getUserByUin(a), this.View.moveBuddy(a), this.View.moveOnlineBuddy(a), this.View.updateClientType(a), this.View.updateRecentState(a), this.View.miniCardPanel && this.View.miniCardPanel.setClientType(a))
        };
        this.onOnlineBuddyChange = function (a) {
            if (w) {
                if (v) {
                    var b = EQQ.Model.BuddyList.getUserByUin(a);
                    this.View.onOnlineBuddyChange({
                        uin: b.uin,
                        client_type: b.clientType,
                        state: b.state,
                        nick: b.showName
                    })
                }
            } else {
                var b = EQQ.Model.BuddyList.getUserByUin(a),
                    a = EQQ.Model.BuddyList.getClassByUin(a),
                    c = EQQ.hash.onlineStatus.offline,
                    f = EQQ.Model.BuddyList.getOnlineBuddy();
                this.View.updateBuddyClassOnlineBuddy(a);
                this.View.updateOnlineBuddyClass(f);
                b.state == c ? this.View.removeOnlineBuddy(b) : this.View.addOnlineBuddy(b)
            }
        };
        this.onRecentListChange = function (a) {
            for (var b = [], c = a.length - 1; c >= 0; c--) {
                if (a[c].type == 0) a[c].content = EQQ.Model.BuddyList.getBuddyByUin(a[c].uin);
                else if (a[c].type == 1) a[c].content = EQQ.Model.BuddyList.getGroupByGid(a[c].uin);
                else if (a[c].type == 2) a[c].content = EQQ.Model.BuddyList.getDiscuById(a[c].uin);
                b.push(a[c])
            }
            this.View.createRecentList(b)
        };
        this.onUserNameChange = function (a) {
            this.View.setUserName(a)
        };
        this.onGroupMaskChange = function (a) {
            for (var b = EQQ.Model.BuddyList.getGroupList(), c = 0; c < b.length; c++) {
                var f = b[c],
                    d = EQQ.Model.BuddyList.isGroupPrompt(f.gid);
                this.View.setGroupListMaskState(f.gid, d)
            }
            this.View.setGroupMask(a)
        };
        this.onSingleGroupMaskChange = function (a) {
            var b = EQQ.Model.BuddyList.isGroupPrompt(a.gid);
            this.View.setGroupListMaskState(a.gid, b)
        };
        this.onGetUserInfoSuccess = function () {};
        this.onNewStranger = function (a) {
            var b = EQQ.Model.BuddyList.getStrangerList();
            this.View.updateStrangerClassOnlineCount(b.length);
            this.View.updateStrangerClassCount(b);
            this.View.addBuddy(a)
        };
        this.updateAllBuddyClassCount = function (a) {
            for (var b = 0; b < a.length; b++) this.updateBuddyClassCount(a[b])
        };
        this.updateBuddyClassCount = function (a) {
            this.View.updateBuddyClassCount(a)
        };
        this.createBuddyList = function (a) {
            this.View.createBuddyList(a)
        };
        this.updateRecentByBuddy = function (a) {
            this.View.updateRecentByBuddy(a)
        };
        this.updateRecentByGroup = function (a) {
            this.View.updateRecentByGroup(a)
        };
        this.updateRecentByDiscu = function (a) {
            this.View.updateRecentByDiscu(a)
        };
        this.onFlexStartJump = function (a) {
            this.View.flexStartJump(a)
        };
        this.onFlexStopJump = function (a) {
            this.View.flexStopJump(a)
        };
        var a = function () {
            var a = alloy.windowManager.getCurrentWindow();
            return e.isUndefined(a) || !a ? 0 : !e.isUndefined(a.option) && a.option && !e.isUndefined(a.option.userOrGroup) ? a.option.userOrGroup.uin || a.option.userOrGroup.gid || a.option.userOrGroup.did || 0 : 0
        };
        this.onMessageBoxUserListChange = function (c) {
            EQQ.Model.BuddyList.getSelf();
            var f = a();
            this.View.jumpDown(n);
            this.View.flickerClassShow(k);
            n = [];
            p = [];
            k = [];
            for (var d = 0; d < c.length; d++) f != c[d].from_uin && (n.push(c[d].from_uin), EQQ.Model.BuddyList.getSelfState() == "callme" && j(c[d].from_uin));
            n.length !== 0 && (EQQ.addNeedBeat2("mainPanel"), b.addObserver(EQQ, "NotifyBeat_250", K))
        };
        this.onMessageBoxGroupListChange = function (c) {
            EQQ.Model.BuddyList.getSelf();
            var f = a();
            this.View.jumpDown(h);
            h = [];
            for (var d = 0; d < c.length; d++) f != c[d].from_uin && EQQ.Model.BuddyList.isGroupPrompt(c[d].from_uin) && h.push(c[d].from_uin), EQQ.Model.BuddyList.getSelfState() == "callme" && EQQ.Model.BuddyList.isGroupPrompt(c[d].from_uin) && l(c[d].group_code);
            h.length !== 0 && (EQQ.addNeedBeat2("mainPanel"), b.addObserver(EQQ, "NotifyBeat_250", K))
        };
        this.onMessageListChange = function (a) {
            (a = EQQ.Model.BuddyList.getBuddyByUin(a.uin)) && this.View.updateRecentByBuddy(a)
        };
        this.onGroupMessageListChange = function (a) {
            (a = EQQ.Model.BuddyList.getGroupByGid(a.gid)) && this.View.updateRecentByGroup(a)
        };
        this.onDiscuMessageListChange = function (a) {
            (a = EQQ.Model.BuddyList.getDiscuById(a.did)) && this.View.updateRecentByDiscu(a)
        };
        var f = function () {
            EQQ.Model.BuddyList.sendGetRecentList()()
        }, g = function (a) {
            EQQ.Model.BuddyList.sendChangeGroupMask({
                type: "global",
                uin: EQQ.Model.BuddyList.getSelfUin(),
                mask: a
            })
        }, j = function (a) {
            EQQ.handleNotification(a, "single") || WebqCore.api.call(["chat", ["single",
            a]])
        }, y = function (a) {
            a = a.uin;
            if (!EQQ.Model.ChatMsg.uinToVideo) EQQ.Model.ChatMsg.uinToVideo = [];
            EQQ.Model.ChatMsg.uinToVideo[a] = {};
            b.notifyObservers(d, "AskVideo", {
                uin: a
            })
        }, l = function (a) {
            var b = EQQ.Model.BuddyList.getGroupByCode(a).gid;
            EQQ.handleNotification(b, "group") || WebqCore.api.call(["chat", ["group", a]])
        };
        this.collapsedAllClass = function () {
            for (var a = EQQ.Model.BuddyList.getClassList(), b = 0; b < a.length; b++) this.View.collapsedClass(a[b].index)
        };
        var z = function () {
            EQQ.exit()
        }, u = function () {
            this.hide()
        }, H = function () {
            EQQ.reLogin()
        };
        this.onExitPortal = function () {
            alloy.portal.exit()
        };
        this.onCloseWebQQ = function () {
            v = x = !1;
            this.hide();
            this.View.showLogin()
        };
        this.clearBuddyList = function () {
            this.View.clearBuddyList()
        };
        this.showLogin = function () {
            this.View.showLogin()
        };
        this.show = function () {
            c = !0;
            this.View.show()
        };
        this.hide = function () {
            c = !1;
            this.View.hide()
        };
        this.toggleShow = function () {
            c ? this.hide() : this.show()
        };
        this.showReLoginPanel = function (a) {
            this.View.showReLoginPanel(a)
        };
        var K = function () {
            d.View.flickerClassShow(k, !0);
            p = [];
            k = [];
            var a = n.concat(h,
            m);
            a.length === 0 && (b.removeObserver(EQQ, "NotifyBeat_250", K), EQQ.removeNeedBeat2("mainPanel"));
            for (var c = 0; c < n.length; c++) {
                var f = n[c],
                    g = EQQ.Model.BuddyList.getClassIdByUin(f);
                d.View.getClassExpandFlag(g) ? p.push(f) : e.array.indexOf(k, g) == -1 && k.push(g)
            }
            n.length > 0 && d.View.jumpAvatar(n);
            k.length > 0 && d.View.flickerClass(k);
            h.length > 0 && d.View.groupJumpAvatar(h);
            a.length > 0 && d.View.recentJumpAvatar(a);
            m.length > 0 && d.View.discuJumpAvatar(m)
        };
        this.onViewSelfStateChange = function (a) {
            var b = "offline",
                c = EQQ.Model.BuddyList.getSelf();
            if (c) b = c.state;
            e.out("==onViewSelfStateChange, self: " + a + ", old: " + b);
            b == "offline" && a != "offline" ? EQQ.login(a) : EQQ.Model.BuddyList.sendChangeStatus(a);
            a == "offline" && (v = x = !1, EQQ.stopPoll())
        };
        this.removeGroup = function (a) {
            d.View.removeGroup(a);
            EQQ.Model.BuddyList.removeGroup(a)
        };
        this.removeDiscu = function (a) {
            d.View.removeDiscu(a)
        };
        var J = function (a) {
            EQQ.handleNotification(a, "discu") || WebqCore.api.call(["chat", ["discu", a]])
        };
        this.onDiscuListChange = function (a) {
            this.View.createDiscuList(a)
        };
        this.onAddNewDiscuToList = function (a) {
            this.View.addDiscu(a)
        };
        var M = function (a) {
            d.View.updateDiscuName(a)
        }, O = function (a) {
            EQQ.Model.BuddyList.sendQuitDisc(a)
        }, N = function (a) {
            d.removeDiscu(a.did)
        };
        this.onMessageBoxDiscuListChange = function (c) {
            EQQ.Model.BuddyList.getSelf();
            var f = a();
            this.View.discuJumpDown(m);
            m = [];
            for (var d = 0; d < c.length; d++) {
                var g = c[d];
                f != g.did && EQQ.Model.BuddyList.isDiscuPrompt(g.did) && m.push(g.did);
                EQQ.Model.BuddyList.getSelfState() == "callme" && EQQ.Model.BuddyList.isDiscuPrompt(g.did) && J(g.did)
            }
            m.length !== 0 && (EQQ.addNeedBeat2("mainPanel"),
            b.addObserver(EQQ, "NotifyBeat_250", K))
        };
        var L = function (a) {
            d.View.setDiscuListMaskState(a.did, a.mask)
        }, P = function (a) {
            EQQ.Model.BuddyList.refreshDiscuInfo(a.did)
        }, Q = function () {
            d.View.showReloadDiscuList()
        };
        this.saveBigHeadSetting = function (a) {
            alloy.config.configList.useBigHead = a;
            alloy.rpcService.sendSetConfig({
                data: {
                    r: {
                        appid: 50,
                        value: {
                            useBigHead: a
                        }
                    }
                }
            })
        };
        this.getSingleMenuClassItems = function (a) {
            for (var b = EQQ.Model.BuddyList.getBuddyByUin(a.u), c = EQQ.Model.BuddyList.getClassList(), f = [], d = 0; d < c.length; d++) b.classId != c[d].index && f.push({
                text: c[d].htmlName,
                classId: c[d].index
            });
            a.f(f)
        }
    })
})();
(function () {
    WebqCore.register("EQQ.Presenter.ChatBox", function (e) {
        var d = e.event,
            b = e.string,
            c = this;
        EQQ.getChatboxMode();
        var n = [],
            p = null,
            k = !1,
            h = !1;
        this.init = function () {
            EQQ.getChatboxMode();
            alloy.windowFactory.registerWindow("ChatBox", EQQ.businessClass.ChatBox);
            alloy.windowFactory.registerWindow("BaseChatBox", EQQ.businessClass.UserChatBox);
            alloy.windowFactory.registerWindow("UserChatBox", EQQ.businessClass.UserChatBox);
            alloy.windowFactory.registerWindow("GroupChatBox", EQQ.businessClass.GroupChatBox);
            alloy.windowFactory.registerWindow("DiscuChatBox", EQQ.businessClass.DiscuChatBox);
            alloy.windowFactory.registerWindow("LiteChatBox", EQQ.businessClass.LiteChatBox);
            n = [];
            p = null;
            h = k = !1;
            this.View = EQQ.View.ChatBox;
            d.addObserver(EQQ, "CloseWebQQ", this.onCloseWebQQ);
            d.addObserver(EQQ, "DesktopSwitch", v);
            d.addObserver(EQQ.Model.BuddyList, "GroupAnnouncementChange", this.onGroupAnnouncementChange);
            d.addObserver(EQQ.Model.BuddyList, "UserSignatureChange", this.handleSetChatboxSignature);
            d.addObserver(EQQ.Model.BuddyList, "BuddyStateChange", this.onBuddyStateChange);
            d.addObserver(EQQ.Model.BuddyList, "GroupMembersChange", this.onGroupMembersChange);
            d.addObserver(EQQ.Model.BuddyList, "GroupMemberStateChange", this.onGroupMemberStateChange);
            d.addObserver(EQQ.Model.BuddyList, "GroupMemberCardChange", this.onGroupMemberCardChange);
            d.addObserver(EQQ.Model.BuddyList, "GroupBuddySessionSignatureChange", this.onGroupBuddySessionSignatureChange);
            d.addObserver(EQQ.Model.BuddyList, "GroupInfoChange", this.onGroupInfoChange);
            d.addObserver(EQQ.Model.BuddyList, "SingleGroupMaskChange", this.onSingleGroupMaskChange);
            d.addObserver(EQQ.Model.ChatMsg, "MessageListChange", this.onMessageListChange);
            d.addObserver(EQQ.Model.ChatMsg, "BuddyTyping", this.showTyping);
            d.addObserver(EQQ.Model.ChatMsg, "StopTyping", this.hideTyping);
            d.addObserver(EQQ.Model.ChatMsg, "GroupMessageListChange", this.onGroupMessageListChange);
            d.addObserver(EQQ.Model.ChatMsg, "SendMsgError", this.onSendMsgError);
            d.addObserver(EQQ.Model.ChatMsg, "GetCustomFaceListSuccess", c.onGetCustomFaceListSuccess);
            d.addObserver(EQQ.Model.ChatMsg, "GetSendPicUrlSuccess", this.onGetSendPicUrlSuccess);
            d.addObserver(EQQ.Model.ChatMsg, "getSendPicUrlError", this.onSetSendPicUrlError);
            d.addObserver(EQQ.Model.ChatMsg, "uploadSendPicError", this.onUploadSendPicError);
            d.addObserver(EQQ.Model.ChatMsg, "getSendPicGroupSuccess", this.onGetSendPicGroupSuccess);
            d.addObserver(EQQ.Model.ChatMsg, "sendPicGroupError", this.onSendPicGroupError);
            d.addObserver(EQQ.Model.ChatMsg, "AskForVideo", this.onAskForVideo);
            d.addObserver(EQQ.Presenter.MainPanel, "AskVideo", this.onAskVideo);
            d.addObserver(EQQ.Model.ChatMsg, "runScreenCapture", this.onRunScreenCapture);
            d.addObserver(EQQ.Model.ChatMsg, "fromCancenFile", this.onFromCancelFile);
            d.addObserver(EQQ.Model.ChatMsg, "GetMoreLogSuccess", f);
            d.addObserver(EQQ.View.ChatBox, "ChatBoxAdd", this.onChatBoxAdd);
            d.addObserver(EQQ.View.ChatBox, "ChatBoxShow", this.onChatBoxShow);
            d.addObserver(EQQ.View.ChatBox, "ChatBoxSetCurrent", this.onSetCurrent);
            d.addObserver(EQQ.View.ChatBox, "ChatBoxSetNotCurrent", this.onSetNotCurrent);
            d.addObserver(EQQ.View.ChatBox, "ChatBoxClose", this.onChatBoxClose);
            d.addObserver(EQQ.View.ChatBox, "ChatBoxMin", this.onChatBoxMin);
            d.addObserver(EQQ.View.ChatBox, "AutoAlign", this.onAutoAlign);
            d.addObserver(EQQ.View.ChatBox, "ShakeButtonClick", D);
            d.addObserver(EQQ.View.ChatBox, "FaceButtonClick", o);
            d.addObserver(EQQ.View.ChatBox, "SendPicButtonClick", i);
            d.addObserver(EQQ.View.ChatBox, "SendFileButtonClick", G);
            d.addObserver(EQQ.View.ChatBox, "MaskButtonClick", C);
            d.addObserver(EQQ.View.ChatBox, "SetSingleGroupMaskState",
            A);
            d.addObserver(EQQ.View.ChatBox, "ClearChatLog", x);
            d.addObserver(EQQ.View.ChatBox, "ChatLogButtonClick", F);
            d.addObserver(EQQ.View.ChatBox, "AskVideoButtonClick", this.onAskVideo);
            d.addObserver(EQQ.View.ChatBox, "GetMoreLog", a);
            d.addObserver(EQQ.View.ChatBox, "SendMsg", this.onSendMsg);
            d.addObserver(EQQ.View.ChatBox, "SendOptionButtonClick", g);
            d.addObserver(EQQ.View.ChatBox, "SetNotNeedCtrlKey", K);
            d.addObserver(EQQ.View.ChatBox, "SetNeedCtrlKey", J);
            d.addObserver(EQQ.View.ChatBox, "ViewChatLog", j);
            d.addObserver(EQQ.View.ChatBox, "ViewGroupChatLog", y);
            d.addObserver(EQQ.View.ChatBox, "ViewDiscuChatLog", l);
            d.addObserver(EQQ.View.ChatBox, "ExportCurrentChatLog", z);
            d.addObserver(EQQ.View.ChatBox, "ExportGroupCurrentChatLog", u);
            d.addObserver(EQQ.View.ChatBox, "ExportDiscuCurrentChatLog", H);
            d.addObserver(EQQ.View.ChatBox, "StartChat", this.onStartChat);
            d.addObserver(EQQ.View.ChatBox, "LoadCustomFace", this.onLoadCustomFace);
            d.addObserver(EQQ.RPCService, "SendDeleteCustomFaceSuccess", r);
            d.addObserver(EQQ.View.ChatBox, "DeleteCustomFace", I);
            d.addObserver(EQQ.View.ChatBox, "Typing", Z);
            d.addObserver(EQQ.View.ChatBox, "MessageRead", this.onMessageRead);
            d.addObserver(EQQ.View.ChatBox, "agreeReceive", this.onAgreeReceiveFile);
            d.addObserver(EQQ.View.ChatBox, "refuseReceive", this.onRefuseReceiveFile);
            d.addObserver(EQQ.View.ChatBox, "AgreeOffFile", M);
            d.addObserver(EQQ.View.ChatBox, "RefuseOffFile", O);
            d.addObserver(EQQ.View.ChatBox, "NextOffFile", N);
            d.addObserver(EQQ.View.ChatBox, "CancelOffFile", L);
            d.addObserver(EQQ.Model.ChatMsg, "OffFileUploaded", P);
            d.addObserver(EQQ.View.ChatBox, "ShowSendFilePanel", Y);
            d.addObserver(EQQ.View.ChatBox, "sendFile", this.onSendFile);
            d.addObserver(EQQ.View.ChatBox, "SendMsgToSelf", R);
            d.addObserver(EQQ.View.ChatBox, "SendGetGroupNewestState", this.sendGetGroupNewestState);
            d.addObserver(EQQ.Model.BuddyList, "DiscuInfoChange", this.onDiscuInfoChange);
            d.addObserver(EQQ.View.ChatBox, "ModifyDiscuTopic", Q);
            d.addObserver(EQQ.Model.BuddyList, "ModifyDiscuTopicSuccess", q);
            d.addObserver(EQQ.Model.BuddyList, "QuitDiscuSuccess", S);
            d.addObserver(EQQ.Model.ChatMsg, "DiscuMessageListChange", this.onDiscuMessageListChange);
            d.addObserver(EQQ.View.ChatBox, "GetDiscuMemberStatus", T);
            d.addObserver(EQQ.Model.BuddyList, "GetDiscuMemberStatusSuccess", U);
            d.addObserver(EQQ.Model.BuddyList, "BatchGetDiscuVipInfoSuccess", V);
            d.addObserver(EQQ.View.ChatBox, "SetSingleDiscuMaskState", W);
            d.addObserver(EQQ.Model.BuddyList, "SingleDiscuMaskChange", X);
            d.addObserver(EQQ.RPCService, "ShakeWindowSuccess", t);
            d.addObserver(EQQ.RPCService, "ShakeWindowFail", E);
            d.addObserver(EQQ.Model.BuddyList, "UserNameChange", e.bind(this.onUserNameChange, this));
            d.addObserver(EQQ.Model.BuddyList, "RemoveBuddy", e.bind(this.onRemoveBuddy, this));
            EQQ.View.ChatBox.init();
            h ? c.setNotNeedCtrlKey() : c.setNeedCtrlKey();
            this.View.setSendKey(alloy.config.configList.isNotNeedCtrlKey);
            d.addObserver(EQQ, "eqqUacChange", m);
            setTimeout(function () {
                WebqCore.api.makeCall("chat")
            }, 0)
        };
        var m = function (a) {
            c.View.setSendKey(a.isNotNeedCtrlKey)
        }, r = function (a) {
            EQQ.View.ChatBox.onSendDeleteCustomFaceSuccess(a)
        }, I = function (a) {
            EQQ.Model.ChatMsg.deleteCustomFace(a)
        },
        v = function (a) {
            if (EQQ.getChatboxMode() == "adsorb") {
                var b = c.getCurrent();
                b && b.desktopIndex != a && b.min()
            }
        };
        this.onUserNameChange = function (a) {
            var b = this.View.getChatBox(a.uin);
            b && b.changeUserMarkName(a)
        };
        this.onRemoveBuddy = function (a) {
            (a = this.View.getChatBox(a.user.uin)) && a.close()
        };
        this.onSendMsgError = function (a) {
            var b = c.View.getChatBox(a.uin);
            if (b) switch (a.retcode) {
            case 103:
            case "103":
                b.appendErrorMsg("\u60a8\u7684\u767b\u5f55\u5df2\u5931\u6548\uff0c\u8bf7\u767b\u5f55\u540e\u518d\u5c1d\u8bd5\u3002");
                break;
            case 100:
            case "100":
                b.appendErrorMsg("\u60a8\u5df2\u7ecf\u5904\u4e8e\u79bb\u7ebf\u72b6\u6001\uff0c\u8bf7\u4e0a\u7ebf\u540e\u518d\u5c1d\u8bd5\u3002");
                break;
            case 123:
            case "123":
                b.appendErrorMsg("\u53d1\u9001\u6d88\u606f\u5185\u5bb9\u8d85\u957f\uff0c\u8bf7\u5206\u6761\u53d1\u9001\u3002");
                break;
            default:
                b.addSendMsgErr(a)
            }
        };
        this.onGetCustomFaceListSuccess = function (a) {
            c.View.createCustomFaceList(a)
        };
        this.getChatBoxList = function () {
            return this.View.getChatBoxList()
        };
        this.onCloseWebQQ = function () {
            for (var a = null, b = c.View.getChatBoxList(); a = b.pop();) a.close()
        };
        this.onMessageRead = function (a) {
            EQQ.Model.ChatMsg.setMessageRead(a)
        };
        this.onBuddyStateChange = function (a) {
            a = EQQ.Model.BuddyList.getUserByUin(a);
            c.View.setBuddyState(a);
            c.View.setClientType(a)
        };
        this.onGetUserInfoSuccess = function (a) {
            EQQ.Model.BuddyList.isStranger(a.uin) && c.View.updateUserInfo(a)
        };
        this._startPgvSendClick = function (a) {
            if (a && a.length > 0) {
                var b = function () {
                    var c = a.shift();
                    pgvSendClick({
                        hottag: c
                    });
                    a.length > 0 && setTimeout(b, 200)
                };
                setTimeout(b,
                200)
            }
        };
        this.onSendMsg = function (a) {
            if (EQQ.Model.BuddyList.getSelfState() == "offline") return a && a.tips("\u60a8\u5df2\u7ecf\u5904\u4e8e\u79bb\u7ebf\u72b6\u6001\uff0c\u8bf7\u4e0a\u7ebf\u540e\u518d\u5c1d\u8bd5"), !1;
            var b = [],
                f = [],
                d = /\[.*?\]/,
                g = /\[face\d{1,3}\]/,
                e = /\[\u81ea\u5b9a\u4e49\u8868\u60c5\d{1,10}\]/,
                j = /\[\u53d1\u9001\u56fe\u7247[/\-a-z0-9A-z]{1,50}\]/,
                y = /\[\u56fe\u7247[/.a-z0-9A-z]{1,50}\]/,
                o, l, i = a.editor.getText(),
                z = EQQ.Model.ChatMsg.getCustomFaceList(),
                k = EQQ.Model.ChatMsg.getSendPicList(),
                u = !1,
                h = [];
            o = "";
            for (var H = 0, m = 0, n = [], q = a.chatBoxType.toUpperCase(); f = i.match(d);) if (l = f[0], l.match(g)) f.index && b.push(i.slice(0, f.index)), o = parseInt(l.replace(/\[face|\]/, "")), o < 135 ? b.push(["face", o]) : b.push("[face" + o + "]"), i = i.slice(f.index + l.length);
            else if (l.match(e)) u = !0, f.index && b.push(i.slice(0, f.index)), o = parseInt(l.replace(/\[\u81ea\u5b9a\u4e49\u8868\u60c5|\]/, "")), o = z[o][0], a.chatBoxType === "single" ? b.push(["cface", o]) : (b.push(["cface", "group", o]), n.push("WEB2QQ.IM." + q + "IMG.CUSTOM")), i = i.slice(f.index + l.length);
            else if (l.match(j)) {
                H++;
                if (H > 10) return a.tips("\u56fe\u7247\u6570\u76ee\u8d85\u8fc710\u5f20\u9650\u5236\uff01"), !1;
                f.index && b.push(i.slice(0, f.index));
                o = l.replace(/\[\u53d1\u9001\u56fe\u7247|\]/g, "");
                if (o == "loading") return a.tips("\u56fe\u7247\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u5019\uff01"), !1;
                m += k[o].filesize;
                if (m > 1258291.2) return a.tips("\u56fe\u7247\u5bb9\u91cf\u8d85\u8fc71.2M\u9650\u5236\uff01"), !1;
                b.push(["offpic", o, k[o].filename, k[o].filesize]);
                i = i.slice(f.index + l.length)
            } else l.match(y) ? (u = !0, f.index && b.push(i.slice(0, f.index)), o = l.replace(/\[\u56fe\u7247|\]/g, ""), a.chatBoxType === "single" ? b.push(["cface", o]) : (b.push(["cface", "group", o]), n.push("WEB2QQ.IM." + q + "IMG.PICTURE")), i = i.slice(f.index + l.length)) : (f = f.index + l.length, b.push(i.slice(0, f)), i = i.slice(f));
            b.push(i);
            c._startPgvSendClick(n);
            h.push("font");
            a.editor.isEnable() ? (d = a.editor.getAllStyles(), (j = d[5].match(/^#([0-9a-f]{6})/)) ? j = j[1] : (j = d[5].match(/\d{1,3}/g), j.length == 3 ? (g = parseInt(j[0]).toString(16), e = parseInt(j[1]).toString(16),
            j = parseInt(j[2]).toString(16), g.length == 1 && (g = "0" + g), e.length == 1 && (e = "0" + e), j.length == 1 && (j = "0" + j), j = g + e + j) : j = "000000"), h.push({
                name: d[0],
                size: d[1].match(/\d+/)[0],
                style: [d[2] === "bold" ? 1 : 0, d[3] === "italic" ? 1 : 0, d[4] === "underline" ? 1 : 0],
                color: j
            })) : h.push({
                size: 10,
                color: "000000",
                style: [0, 0, 0],
                name: "\u5b8b\u4f53"
            });
            EQQ.Model.BuddyList.getSelf();
            d = EQQ.CONST.WEBQQMSGTIPS;
            if (a.chatBoxType == "single") {
                u = EQQ.Model.BuddyList.getUserByUin(a.uin);
                EQQ.Presenter.MainPanel.updateRecentByBuddy(u);
                if (!u.isFirstSend) w(b),
                b.push(d), u.isFirstSend = !0;
                b.push(h);
                EQQ.Model.ChatMsg.sendMsg({
                    type: "single",
                    to: a.uin,
                    content: b,
                    face: EQQ.Model.BuddyList.getSelf().face
                })
            } else {
                g = {};
                a.chatBoxType == "group" ? (g = EQQ.Model.BuddyList.getGroupByGid(a.gid), EQQ.Presenter.MainPanel.updateRecentByGroup(g)) : (g = EQQ.Model.BuddyList.getDiscuById(a.uin), EQQ.Presenter.MainPanel.updateRecentByDiscu(g));
                if (!g.isFirstSend) w(b), b.push(d), g.isFirstSend = !0;
                b.push(h);
                u ? EQQ.Model.ChatMsg.isGroupCustomFaceKeyTimeout() ? EQQ.Model.ChatMsg.sendGetGroupCustomFaceKey({
                    type: a.chatBoxType,
                    to: a.uin,
                    content: b
                }) : EQQ.Model.ChatMsg.sendGetGroupCustomFaceInfo({
                    type: a.chatBoxType,
                    to: a.uin,
                    content: b
                }) : EQQ.Model.ChatMsg.sendMsg({
                    type: a.chatBoxType,
                    to: a.uin,
                    content: b
                })
            }
            a.editor.clear();
            a.focusEditor()
        };
        var w = function (a) {
            a.length > 0 && (a[a.length - 1] = a[a.length - 1].replace(/\n+?$/, ""))
        };
        this.onGetSendPicUrlSuccess = function (a) {
            EQQ.View.ChatBox.insertSendPic(a)
        };
        this.onGetSendPicGroupSuccess = function (a) {
            EQQ.View.ChatBox.insertSendPicGroup(a)
        };
        this.onUploadSendPicError = function (a) {
            var b = c.getCurrent();
            if (b) {
                switch (a.retcode) {
                case "100":
                    b.tips("\u56fe\u7247\u5927\u5c0f\u8d85\u8fc7" + a.maxFileSize);
                    break;
                default:
                    b.tips("\u4e0a\u4f20\u56fe\u7247\u5931\u8d25\uff0c\u8bf7\u91cd\u65b0\u5c1d\u8bd5!")
                }
                EQQ.View.ChatBox.removeLoading(a.fileid)
            }
            alloy.util.report2m(133172)
        };
        this.onSendPicGroupError = function (a) {
            var b = c.getCurrent();
            if (b) switch (a.ret) {
            case 1:
                b.tips("\u6587\u4ef6\u683c\u5f0f\u9519\u8bef");
                break;
            case 3:
                b.tips("\u6587\u4ef6\u5927\u5c0f\u8d85\u8fc7250KB");
                break;
            case 4:
                b.tips("\u6b64\u81ea\u5b9a\u4e49\u8868\u60c5\u5df2\u5b58\u5728");
                break;
            case -1:
                break;
            default:
                b.tips("\u53d1\u751f\u4e0a\u4f20\u9519\u8bef")
            }
        };
        this.onAskVideo = function (a) {
            var b = a.uin;
            if (b && (a = c.View.getChatBox(b))) b = c.getVideoUrl({
                cu: b
            }), a.videoWin || qqweb.util.report2im("mining|invite"), c.initVideo(a, b), a.setCurrent()
        };
        this.checkIsOnVideo = function (a) {
            var b = a.uin;
            if (b && EQQ.Model.ChatMsg.uinToVideo && EQQ.Model.ChatMsg.uinToVideo[b] && (a = c.View.getChatBox(b))) {
                var f = EQQ.Model.ChatMsg.uinToVideo[b].k;
                delete EQQ.Model.ChatMsg.uinToVideo[b];
                b = c.getVideoUrl({
                    cu: b,
                    k: f
                });
                c.initVideo(a, b);
                a.setCurrent()
            }
        };
        this.onAskForVideo = function (a) {
            var b = a.uin;
            if (b) {
                var f = c.View.getChatBox(b);
                f && (a = c.getVideoUrl({
                    cu: b,
                    k: a.k
                }), c.initVideo(f, a), EQQ.Model.ChatMsg.uinToVideo[b] && delete EQQ.Model.ChatMsg.uinToVideo[b])
            }
        };
        this.getVideoUrl = function (a) {
            var c = alloy.portal.getAllConfig(alloy.config.__eqqid),
                f, d = EQQ.Model.BuddyList.getSelf(),
                g = EQQ.vfwebqq;
            a.cn = EQQ.Model.BuddyList.getUserByUin(a.cu).nick;
            a.n = d.nick;
            if (c && !c.appKey) {
                var j = c.id;
                f = c.appKey = Math.random();
                f = alloy.portal.getAllConfig("99999").appUrl;
                f = f.split("#");
                f[0] += (/\?/.test(f[0]) ? "&" : "?") + "u=" + d.uin + "&n=" + encodeURIComponent(b.encodeHtmlAttributeSimple(a.n)) + "&sk=" + g;
                c.appUrl = f.join("#");
                f = c.appKey = Math.random();
                d = c.wid = encodeURIComponent(e.json.stringify({
                    appid: j,
                    webqqkey: f,
                    webqqdomain: location.hostname
                }));
                qqweb.app.appKeyMap[f] = {
                    appId: j,
                    wid: d
                }
            }
            f = c.appUrl.split("#");
            f[0] += (/\?/.test(f[0]) ? "&" : "?") + "&cu=" + a.cu + "&cn=" + encodeURIComponent(b.encodeHtmlAttributeSimple(a.cn));
            a.k && (f[0] += "&k=" + a.k);
            f = f.join("#");
            return {
                uri: f,
                name: c.wid
            }
        };
        this.setVideoId = function (a, b) {
            var f = c.View.getChatBox(a);
            f && (clearTimeout(f.videoTimeout), EQQ.sendMsg(a, "\u3000  \u3000\u6211\u6b63\u5728\u4f7f\u7528Q+ Web\u5411\u60a8\u53d1\u9001\u89c6\u9891\u9080\u8bf7\uff0c\u5feb\u53bb\u770b\u770b\u5427" + (alloy.CONST.MAIN_URL + "v.html?vk=" + b)), qqweb.util.report2im("mining|invite|success"))
        };
        this.initVideo = function (a, b) {
            if (!e.platform.iPad && !a.videoWin) {
                a.videoTimeout && clearTimeout(a.videoTimeout);
                var c = alloy.windowFactory.createWindow("Window", {
                    width: 408,
                    height: 336,
                    title: "\u89c6\u9891",
                    bodyBorder: 1,
                    hasCloseButton: !1,
                    hideWinBorder: !0,
                    dragable: !0,
                    isVisibilityMode: !0
                });
                c.setHtml(' <iframe id="ifram_vedio"  src="' + b.uri + '" name="' + b.name + '" scrolling="no" frameborder="no" allowtransparency="true" scrolling="hidden" hidefocus height="100%" width="100%"></iframe>');
                a.videoWin = c;
                a.addSubordinate(c, {
                    mode: 1,
                    subWinWidth: 408,
                    isSubWinFloat: !0,
                    width: 291,
                    height: 348
                });
                d.addObserver(c, "close", function () {
                    a.videoWin = null
                })
            }
        };
        this.popVideoWindow = function (a) {
            if ((a = c.View.getChatBox(a)) && a.videoWin) a.getBoxStatus() == "fullscreen" && a.restorefull(), a.setWidth(a.option.width), a.setHeight(a.option.height), a.removeSubordinate(), a.videoWin.setZIndexLevel(1), a.videoWin.setCurrent()
        };
        this.innerVideoWindow = function (a) {
            if ((a = c.View.getChatBox(a)) && a.videoWin) a.isShow() || a.show(), a.videoWin.setZIndexLevel(0), a.videoWin.setZIndex(a.getZIndex() + 1), a.addSubordinate(a.videoWin, {
                mode: 1,
                subWinWidth: 408,
                isSubWinFloat: !0,
                width: 291,
                height: 348
            })
        };
        this.appendVideoMsg = function (a, b) {
            var f = c.View.getChatBox(a);
            f && f.videoWin && (f = {
                from_uin: a,
                time: new Date,
                content: [
                    ["video", b]
                ],
                attach: {
                    type: "video"
                },
                msg_id: EQQ.Model.ChatMsg.getMsgId()
            }, EQQ.Model.ChatMsg.addMessageBoxUserList(f), EQQ.Model.ChatMsg.receiveMsg(f))
        };
        this.closeVideo = function (a) {
            if ((a = c.View.getChatBox(a)) && a.videoWin) a.videoTimeout && clearTimeout(a.videoTimeout), this.removeVideo(a)
        };
        this.removeVideo = function (a) {
            a.removeSubordinate();
            a.videoWin.isDestroy() || a.videoWin.close();
            a.videoWin = null
        };
        this.onSetSendPicUrlError = function (a) {
            var b = c.getCurrent();
            b && (b.tips("\u7533\u8bf7\u56fe\u7247\u6587\u4ef6\u5730\u5740\u5931\u8d25\uff01"),
            typeof a.fileid !== "undefined" && a.fileid && EQQ.View.ChatBox.removeLoading(a.fileid))
        };
        var x = function (a) {
            a.clearChatLog();
            a.chatBoxType == "group" ? EQQ.Model.ChatMsg.clearChatLog(a.gid) : EQQ.Model.ChatMsg.clearChatLog(a.uin)
        };
        this.chatWithUser = function (a, b) {
            var f = this.getChatBox(a),
                d = EQQ.Model.BuddyList.getUserByUin(a);
            if (f) {
                if (f.setCurrent(), f.scrollToBottom(), d.type === "groupBuddy") d.currentId = f.currentId
            } else if (d) if (d.type === "buddy" || d.type === "stranger") f = this.addChatBox(d, b), c.checkIsOnVideo({
                uin: a
            }),
            f.setCurrent();
            else if (d.type === "groupBuddy")!d.currentId || d.chatSession[d.currentId] ? (f = this.addLiteChatBox(d, b), f.setCurrent(), f.currentId = d.currentId || 0) : (f = {
                id: isNaN(d.currentId) ? EQQ.Model.BuddyList.decodeDid(d.currentId) : d.currentId,
                to_uin: d.uin,
                service_type: isNaN(d.currentId) ? 1 : 0
            }, EQQ.Model.BuddyList.sendGetSessionSignature(f))
        };
        this.chatWithGroup = function (a) {
            var b = this.getChatBoxByCode(a);
            b ? (b.setCurrent(), b.scrollToBottom()) : (b = this.addGroupChatBox(EQQ.Model.BuddyList.getGroupByCode(a)), b.setCurrent())
        };
        this.closeByGroup = function (a) {
            if (a = this.getChatBoxByCode(a)) a.close(), this.View.removeChatBox(a)
        };
        this.updateGroupTitle = function (a, b) {
            var c = EQQ.Model.BuddyList.getGroupByCode(a);
            typeof b.name != "undefined" && c.setName(b.name);
            typeof b.markName != "undefined" && c.setMarkName(b.markName);
            typeof b.announcement != "undefined" && c.upAnnouncement(b.announcement);
            (c = this.getChatBoxByCode(a)) && c.upateGroupTitle()
        };
        this.updateGroupMemberCard = function (a, b) {
            var c = EQQ.Model.BuddyList.getGroupByCode(a);
            typeof b.uin != "undefined" && c.updateMemberCard(b)
        };
        this.addChatBox = function (a) {
            var b = this.View.addChatBox(a);
            d.notifyObservers(c, "ChatBoxAdd", a);
            return b
        };
        this.addGroupChatBox = function (a) {
            var b = this.View.addGroupChatBox(a);
            d.notifyObservers(c, "ChatBoxAdd", a);
            return b
        };
        this.addLiteChatBox = function (a) {
            var b = this.View.addLiteChatBox(a);
            d.notifyObservers(c, "ChatBoxAdd", a);
            return b
        };
        this.onGroupAnnouncementChange = function (a) {
            c.View.getChatBox(a.gid) && c.View.getChatBox(a.gid).updateAnnouncement()
        };
        this.onGroupMembersChange = function (a) {
            c.View.getChatBox(a.gid) && c.View.getChatBox(a.gid).updateMembers()
        };
        this.onGroupMemberStateChange = function (a) {
            a.t && c.View.getChatBox(a.t.gid) && c.View.getChatBox(a.t.gid).updateMemberState(a.arg)
        };
        this.onGroupMemberCardChange = function (a) {
            c.View.getChatBox(a.gid) && c.View.getChatBox(a.gid).updateUserName(a)
        };
        this.onGroupInfoChange = function (a) {
            c.View.getChatBox(a.gid) && c.View.getChatBox(a.gid).updateSettingButton()
        };
        this.onSingleGroupMaskChange = function (a) {
            var b = c.getChatBox(a.gid);
            if (b) {
                var f = EQQ.Model.BuddyList.getGroupMask();
                b.setMaskButton(a.mask);
                b.setWarning(a.mask, a.preMask, f)
            }
        };
        this.handleSetChatboxSignature = function (a) {
            EQQ.View.ChatBox.setChatboxSignature(a)
        };
        this.onChatBoxAdd = function (a) {
            if (a.chatBoxType === "discu") EQQ.Model.ChatMsg.getDiscuMsgHistory(a.did), EQQ.Model.BuddyList.getDiscuInfo(a.uin);
            else if (a.chatBoxType === "group") EQQ.Model.ChatMsg.getGroupMsgHistory(a.gid), EQQ.Model.BuddyList.getGroupInfo(a.code), k = !0;
            else {
                EQQ.Model.ChatMsg.getMsgHistory(a.uin);
                var b = EQQ.Model.BuddyList.getBuddyByUin(a.uin);
                b && (e.isUndefined(b.signature) ? EQQ.Model.BuddyList.getUserSignature(a.uin) : EQQ.View.ChatBox.setChatboxSignature(b))
            }
        };
        this.onChatBoxShow = function (a) {
            a.chatBoxType === "group" ? (EQQ.Model.ChatMsg.removeMessageBoxGroupList(a.gid), d.notifyObservers(EQQ, "ChatBoxShow", a.gid)) : a.chatBoxType === "discu" ? (EQQ.Model.ChatMsg.removeMessageBoxDiscuList(a.did), d.notifyObservers(EQQ, "ChatBoxShow", a.did)) : (EQQ.Model.ChatMsg.removeMessageBoxUserList(a.uin), d.notifyObservers(EQQ, "ChatBoxShow", a.uin))
        };
        this.onSetCurrent = function (a) {
            d.notifyObservers(c, "ChatBoxSetCurrent", a.uin);
            a.chatBoxType === "group" && k && (k = !1);
            EQQ.handleNotification(a.uin, a.chatBoxType)
        };
        this.onSetNotCurrent = function (a) {
            d.notifyObservers(c, "ChatBoxSetNotCurrent", a.uin)
        };
        this.onChatBoxMin = function (a) {
            d.notifyObservers(c, "ChatBoxMin", a.uin)
        };
        this.onChatBoxClose = function (a) {
            a.chatBoxType === "group" ? EQQ.Model.ChatMsg.clearChatLog(a.gid) : (EQQ.Model.ChatMsg.clearChatLog(a.uin), c.View.closeSendFilePanel(a.uin));
            a.videoWin && c.removeVideo(a);
            d.notifyObservers(c, "ChatBoxClose", a.uin);
            EQQ.handleNotification(a.uin, a.chatBoxType)
        };
        this.onStartChat = function (a) {
            EQQ.handleNotification(a, "single") || c.chatWithUser(a, "show")
        };
        this.onLoadCustomFace = function () {
            EQQ.Model.ChatMsg.loadCustomFaceList()
        };
        this.onGroupBuddySessionSignatureChange = function (a) {
            c.chatWithUser(a, "show")
        };
        this.onAutoAlign = function () {};
        this.getChatBox = function (a) {
            return this.View.getChatBox(a)
        };
        this.getChatBoxByCode = function (a) {
            return this.View.getChatBox(EQQ.Model.BuddyList.getGroupByCode(a).gid)
        };
        this.getChatBoxByGid = function (a) {
            return this.View.getChatBox(a)
        };
        this.onMessageListChange = function (a) {
            var b = c.View.getChatBox(a.uin);
            b && b.appendMsg(a)
        };
        this.onGroupMessageListChange = function (a) {
            var b = c.View.getChatBox(a.gid);
            b && b.appendMsg(a)
        };
        this.shiftChatBox = function () {
            return this.View.shiftChatBox()
        };
        this.getCurrent = function () {
            return this.View.getCurrent()
        };
        this.getCurrentChatBoxPointer = function () {
            var a, b;
            return this.View.getCurrent() ? (a = this.View.getCurrent().uin, b = EQQ.Model.ChatMsg.getMessagePointer(a), {
                uins: [a],
                msg_ids: [b]
            }) : {
                uins: [],
                msg_ids: []
            }
        };
        this.showDesktop = function () {
            for (var a = [], b = this.View.getCurrent(), c = this.View.getChatBoxList(), f = 0; f < c.length; f++) c[f].isShow() && (c[f].min(), a.push(c[f]));
            if (a.length > 0) n = a, p = b;
            else if (p && p.setCurrent(), a = this.View.getMode(), a !== "adsorb" && a === "free") for (f = 0; f < n.length; f++) n[f].show()
        };
        this.hasChatBoxOnDesktop = function () {
            for (var a = [], b = this.View.getChatBoxList(), c = 0; c < b.length; c++) b[c].isShow() && a.push(b[c]);
            return a.length > 0 ? a : !1
        };
        this.setMode = function (a) {
            switch (a) {
            case "adsorb":
                this.View.setAdsorbMode();
                break;
            case "free":
                this.View.setFreeMode()
            }
        };
        this.getMode = function () {
            return this.View.getMode()
        };
        this.toggleFacePanel = function (a) {
            this.View.facePanel && this.View.facePanel.isShow() ? this.View.hideFacePanel() : this.View.showFacePanel(a)
        };
        var s = function (a, b, c) {
            var f = EQQ.Model.BuddyList.getSelf(),
                b = {
                    uin: f.uin,
                    msgList: [{
                        from_uin: f.uin,
                        time: e.date.format(new Date, "YYYY-MM-DD hh:mm:ss"),
                        content: [
                            ["shake", b]
                        ],
                        attach: {
                            type: "shake",
                            icon: c || ""
                        },
                        msg_id: EQQ.Model.ChatMsg.getMsgId(),
                        type: "single",
                        sender: f,
                        sender_uin: f.uin
                    }]
                };
            a.appendMsg(b)
        }, D = function (a) {
            var b = EQQ.Model.BuddyList.getUserByUin(a),
                f = c.getChatBox(a);
            b.state == "offline" ? s(f, "\u60a8\u7684\u597d\u53cb\u4e0d\u5728\u7ebf\u6216\u9690\u8eab\uff0c\u56e0\u6b64\u60a8\u4e0d\u80fd\u53d1\u9001\u7a97\u53e3\u6296\u52a8\u3002", "warning") : (EQQ.RPCService.sendShakeWindow({
                to_uin: a
            }), f.shake(), f._lastShakeTime = +new Date, s(f, "\u60a8\u53d1\u9001\u4e86\u4e00\u4e2a\u7a97\u53e3\u6296\u52a8\u3002"))
        }, t = function () {}, E = function () {}, o = function (a) {
            c.toggleFacePanel(a)
        }, i = function (a) {
            if (EQQ.Model.BuddyList.getSelf().state == "offline") return a && a.tips("\u60a8\u5df2\u7ecf\u5904\u4e8e\u79bb\u7ebf\u72b6\u6001\uff0c\u8bf7\u4e0a\u7ebf\u540e\u518d\u5c1d\u8bd5"), !1;
            c.View.uploadSendPic()
        }, G = function (a) {
            if (EQQ.Model.BuddyList.getSelf().state == "offline") return a && a.tips("\u60a8\u5df2\u7ecf\u5904\u4e8e\u79bb\u7ebf\u72b6\u6001\uff0c\u8bf7\u4e0a\u7ebf\u540e\u518d\u5c1d\u8bd5"), !1;
            e.out("ready to upload file");
            c.View.uploadSendFile()
        }, C = function (a) {
            var b = c.getCurrent(),
                b = b.chatBoxType == "discu" ? EQQ.Model.BuddyList.getDiscuById(b.did) : EQQ.Model.BuddyList.getGroupByGid(b.gid);
            c.View.toggleGroupMaskStatePanel(a, b.mask)
        }, A = function (a) {
            EQQ.Model.BuddyList.sendChangeGroupMask(a)
        };
        this.toggleChatLogOptionPanel = function (a) {
            this.View.chatLogOptionPanel && this.View.chatLogOptionPanel.isShow() ? this.View.hideChatLogOptionPanel() : this.View.showChatLogOptionPanel(a)
        };
        var F = function (a) {
            c.toggleChatLogOptionPanel(a)
        }, a = function (a) {
            EQQ.Model.ChatMsg.getMoreLog(a)
        }, f = function (a) {
            c.View.getChatBox(a.arguments.gid).setMoreMsgList(a)
        };
        this.toggleSendOptionPanel = function (a) {
            this.View.sendOptionPanel && this.View.sendOptionPanel.isShow() ? this.View.hideSendOptionPanel() : this.View.showSendOptionPanel(a)
        };
        var g = function (a) {
            c.toggleSendOptionPanel(a)
        }, j = function (a) {
            alloy.portal.runApp("chatLogViewer", a)
        }, y = function (a) {
            var b = EQQ.Model.BuddyList.getGroupByGid(a),
                a = {
                    gid: a,
                    gcode: b.code,
                    from: "group"
                };
            pgvSendClick({
                hottag: "WEB2QQ.CHATBOX.RUN.CHATLOGVIEWER"
            });
            alloy.util.report2im("chatbox|run|chatlogviewer");
            qqweb.portal.runApp("chatLogViewer", a)
        }, l = function (a) {
            EQQ.Model.BuddyList.getDiscuById(a);
            a = {
                did: a,
                from: "discu"
            };
            pgvSendClick({
                hottag: "WEB2QQ.CHATBOX.RUN.CHATLOGVIEWER"
            });
            alloy.util.report2im("chatbox|run|chatlogviewer");
            qqweb.portal.runApp("chatLogViewer", a)
        }, z = function (a) {
            var b = EQQ.Model.BuddyList.getSelf(),
                a = EQQ.Model.BuddyList.getUserByUin(a);
            c.View.exportChatLog(b, a)
        }, u = function (a) {
            var b = EQQ.Model.BuddyList.getSelf(),
                a = EQQ.Model.BuddyList.getGroupByGid(a);
            c.View.exportGroupChatLog(b, a)
        }, H = function (a) {
            var b = EQQ.Model.BuddyList.getSelf(),
                a = EQQ.Model.BuddyList.getDiscuById(a);
            c.View.exportDiscuChatLog(b,
            a)
        }, K = function () {
            c.setNotNeedCtrlKey()
        }, J = function () {
            c.setNeedCtrlKey()
        };
        this.setNotNeedCtrlKey = function () {
            h = !0;
            this.View.setNotNeedCtrlKey()
        };
        this.setNeedCtrlKey = function () {
            h = !1;
            this.View.setNeedCtrlKey()
        };
        this.onRunScreenCapture = function () {};
        this.onAgreeReceiveFile = function (a) {
            var b = EQQ.Model.ChatMsg.getFilesList();
            b[a].isread = !0;
            c.View.removeReceiveFileLink(a);
            var f = EQQ.Model.ChatMsg.getClientidFromRpc();
            c.View.receiveFile(b[a], f);
            EQQ.Model.ChatMsg.agreeReceiveFile(b[a]);
            alloy.util.report2m(133163)
        };
        this.onRefuseReceiveFile = function (a) {
            var b = EQQ.Model.ChatMsg.getFilesList();
            b[a].isread = !0;
            c.View.removeReceiveFileLink(a);
            EQQ.Model.ChatMsg.refuseReceiveFile(b[a]);
            alloy.util.report2m(133162)
        };
        this.onFromCancelFile = function (a) {
            var b = EQQ.Model.ChatMsg.getFilesList();
            if (!b[a]) return !1;
            b[a].isread = !0;
            c.View.removeReceiveFileLink(a)
        };
        this.onSendFile = function (a) {
            EQQ.Model.ChatMsg.sendFile(a)
        };
        var M = function (a) {
            c.View.removeReceiveFileLink(a.fileid);
            c.View.nextOffFile(a.fileid);
            c.View.receiveOffFile(a);
            EQQ.Model.ChatMsg.agreeReceiveFile(a);
            alloy.util.report2im("singlemask|offlinefile|rec")
        }, O = function (a) {
            c.View.removeReceiveFileLink(a.fileid);
            c.View.nextOffFile(a.fileid);
            EQQ.RPCService.sendRefuseOffFile({
                to: a.from_uin,
                file_name: a.name,
                file_size: a.size,
                action: 2
            });
            var b = [
                ["refuseofffile", "\u60a8\u62d2\u7edd\u63a5\u6536\u201c" + a.name + "\u201d\uff0c\u6587\u4ef6\u4f20\u8f93\u5931\u8d25\u3002"]
            ],
                f = {
                    type: "refuseofffile",
                    name: a.name,
                    from_uin: a.from_uin,
                    time: (new Date).getTime()
                };
            R({
                type: "single",
                from_uin: 0,
                to: a.from_uin,
                content: b,
                attach: f
            });
            alloy.util.report2im("singlemask|offlinefile|refuserec")
        }, N = function (a) {
            c.View.removeReceiveFileLink(a.fileid);
            c.View.nextOffFile(a.fileid);
            var b = [
                ["nextofffile", '\u60a8\u53d6\u6d88\u4e86\u79bb\u7ebf\u6587\u4ef6"' + a.name + '"\u7684\u63a5\u6536\uff0c\u6211\u4eec\u5c06\u5728\u60a8\u4e0b\u6b21\u767b\u5f55\u540e\u8fdb\u884c\u63d0\u9192\u3002']
            ],
                f = {
                    type: "nextofffile",
                    name: a.name,
                    from_uin: a.from_uin,
                    time: (new Date).getTime()
                };
            R({
                type: "single",
                from_uin: 0,
                to: a.from_uin,
                content: b,
                attach: f
            });
            alloy.util.report2im("singlemask|offlinefile|recnexttime")
        }, L = function (a) {
            var b = [
                ["canceloffupload", "\u60a8\u7ec8\u6b62\u4e86\u201c" + a.name + "\u201d\u7684\u53d1\u9001\u3002"]
            ],
                f = {
                    type: "canceloffupload",
                    name: a.name,
                    from_uin: a.from_uin,
                    time: (new Date).getTime()
                };
            R({
                type: "single",
                from_uin: 0,
                to: a.from_uin,
                content: b,
                attach: f
            });
            c.View.cancelOffFile(a)
        }, P = function (a) {
            L(a);
            c.View.setOffFileUploadState(a.ts)
        };
        this.sendGetGroupNewestState = function (a) {
            EQQ.Model.BuddyList.sendGetGroupNewestState({
                gcode: a
            })
        };
        this.chatWithDiscu = function (a) {
            var b = this.View.getChatBox(a);
            if (b) b.setCurrent(), b.scrollToBottom();
            else {
                a = EQQ.Model.BuddyList.getDiscuById(a);
                if (e.isUndefined(a) || !a) return e.error("option.userOrGroup is null"), !1;
                b = this.addDiscuChatBox(a);
                b.setCurrent()
            }
        };
        this.closeByDiscu = function (a) {
            if (a = this.getChatBoxByDid(a)) a.close(), this.View.removeChatBox(a)
        };
        this.addDiscuChatBox = function (a) {
            var b = this.View.addDiscuChatBox(a);
            d.notifyObservers(c, "ChatBoxAdd", a);
            return b
        };
        this.onDiscuInfoChange = function (a) {
            c.View.getChatBox(a.did) && c.View.getChatBox(a.did).updateDiscInfo(a)
        };
        this.showTyping = function (a) {
            (a = c.getChatBox(a)) && a.showTyping()
        };
        this.hideTyping = function (a) {
            (a = c.getChatBox(a)) && a.hideTyping()
        };
        var Q = function (a) {
            EQQ.Model.BuddyList.sendModifyDiscuTopic(a)
        }, q = function (a) {
            c.View.getChatBox(a.did) && c.View.getChatBox(a.did).updateDiscTopic(a.topic)
        }, S = function (a) {
            c.View.getChatBox(a.did) && c.View.getChatBox(a.did).quitDiscuSuccess(a)
        };
        this.onDiscuMessageListChange = function (a) {
            var b = c.View.getChatBox(a.did);
            b && b.appendMsg(a)
        };
        var T = function (a) {
            EQQ.Model.BuddyList.sendGetDiscuMemberStatus(a)
        }, U = function (a) {
            c.View.getChatBox(a.did) && c.View.getChatBox(a.did).updateMemberState(a)
        }, V = function (a) {
            var b = c.View.getChatBox(a.did);
            b && b.updateMemberVipInfo(a)
        }, W = function (a) {
            EQQ.Model.BuddyList.sendChangeDiscuMask(a)
        }, X = function (a) {
            var b = c.getChatBox(a.did);
            b && (b.setMaskButton(a.mask), b.setWarning(a.mask, a.preMask, 0, !0))
        }, Y = function (a) {
            c.View.isShowSendFilePanel(a.uin) ? c.View.hideSendFilePanel(a.uin) : c.View.showSendFilePanel(a)
        },
        R = function (a) {
            EQQ.Model.ChatMsg.addMsgToList(a)
        }, Z = function (a) {
            EQQ.RPCService.sendTyping({
                to_uin: a
            })
        }
    })
})();
(function () {
    WebqCore.register("EQQ.Presenter.TaskBar", function (e) {
        var d = this,
            b = e.event,
            c = e.dom,
            n = [],
            p = [],
            k = [],
            h = [],
            m = [],
            r = {}, I = function (b) {
                (b = EQQ.Presenter.ChatBox.getChatBox(b)) && b.close()
            }, v = function () {
                d.setMode("free")
            }, w = function () {
                d.setMode("adsorb")
            }, x = {
                onChatBoxAdd: function (b) {
                    b.did && e.isUndefined(b.uin) ? d.addDiscuChatTask(b) : b.gid ? d.addGroupChatTask(b) : d.addChatTask(b)
                },
                onChatBoxClose: function (b) {
                    (b = d.getTask(b)) && b.close()
                },
                onChatBoxSetCurrent: function (b) {
                    (b = d.getTask(b)) && b.setCurrent()
                },
                onChatBoxSetNotCurrent: function (b) {
                    (b = d.getTask(b)) && b.setNotCurrent()
                },
                onChatBoxMin: function (b) {
                    (b = d.getTask(b)) && b.setNotCurrent()
                }
            }, s = new e.Class({
                init: function (c, i, k) {
                    this.type = k;
                    this.status = i;
                    k === "discu" ? (this.uin = this.did = c.did, this.discu = c, this._el = d.View.createDiscuTaskDom(this.discu, this)) : k === "group" ? (this.code = c.code, this.uin = this.gid = c.gid, this.group = c, this._el = d.View.createGroupTaskDom(this.group, this)) : (this.uin = c.uin, this.user = c, this._el = d.View.createTaskDom(this.user, this));
                    this.setCurrent();
                    m.length >= d.getMaxCount() && (s._current && s._current.setNotCurrent(), EQQ.Presenter.ChatBox.shiftChatBox());
                    b.notifyObservers(alloy, "resizeTask");
                    m.push(this);
                    r[this.uin] = this;
                    b.addObserver(this, "TaskClick", e.bind(this.toggleTaskStatus, this))
                },
                close: function () {
                    this.destroy();
                    var b = EQQ.Presenter.TaskBar.getCurrent();
                    b && this.uin != b.uin && (EQQ.Presenter.ChatBox.getChatBox(b.uin).min(), EQQ.Presenter.ChatBox.getChatBox(b.uin).setNotCurrent(), EQQ.Presenter.ChatBox.getChatBox(b.uin).setCurrent())
                },
                destroy: function () {
                    if (s._current && s._current.uin == this.uin) s._current = null, e.out("Task._current = null;");
                    e.array.remove(m, this);
                    delete r[this.uin];
                    d.View.removeTask(this._el);
                    EQQ.Presenter.ChatBox.getCurrent() && EQQ.Presenter.ChatBox.getMode();
                    m.length == 0 && d.View.resetTaskBar()
                },
                toggleTaskStatus: function () {
                    var b = EQQ.Presenter.ChatBox.getChatBox(this.uin);
                    this.status === "current" && alloy.desktopManager.getCurrentDesktopIndex() == b.desktopIndex ? (b.min(), b.setNotCurrent()) : (b.setCurrent(), b.scrollToBottom())
                },
                setCurrent: function () {
                    d.View.setCurrent(this._el);
                    this.status = "current";
                    s._current = this
                },
                isCurrent: function () {
                    return this.status == "current"
                },
                setNotCurrent: function () {
                    d.View.setNotCurrent(this._el);
                    this.status = "notCurrent";
                    if (s._current && s._current.uin == this.uin) s._current = null
                },
                getRight: function () {
                    return d.View.getRight(this._el)
                },
                getLeft: function () {
                    return d.View.getLeft(this._el)
                }
            });
        s._current = null;
        this.init = function () {
            n = [];
            p = [];
            k = [];
            h = [];
            m = [];
            r = {};
            this.View = EQQ.View.TaskBar;
            this.View.init();
            b.addObserver(EQQ, "NotifyBeat_250", t);
            b.addObserver(EQQ.Model.ChatMsg, "MessageBoxUserListChange", e.bind(this.onMessageBoxUserListChange, this));
            b.addObserver(EQQ.Model.ChatMsg, "MessageBoxGroupListChange", e.bind(this.onMessageBoxGroupListChange, this));
            b.addObserver(EQQ.Model.ChatMsg, "MessageBoxDiscuListChange", e.bind(this.onMessageBoxDiscuListChange, this));
            b.addObserver(EQQ.Model.BuddyList, "ModifyDiscuTopicSuccess", E);
            b.addObserver(EQQ.Model.BuddyList, "BuddyStateChange", this.onBuddyStateChange);
            b.addObserver(EQQ.Model.BuddyList, "GroupNameChange", this.onBuddyMarkNameChange);
            b.addObserver(EQQ.Presenter.ChatBox, "ChatBoxAdd", x.onChatBoxAdd);
            b.addObserver(EQQ.Presenter.ChatBox, "ChatBoxClose", x.onChatBoxClose);
            b.addObserver(EQQ.Presenter.ChatBox, "ChatBoxSetCurrent", x.onChatBoxSetCurrent);
            b.addObserver(EQQ.Presenter.ChatBox, "ChatBoxSetNotCurrent", x.onChatBoxSetNotCurrent);
            b.addObserver(EQQ.Presenter.ChatBox, "ChatBoxMin", x.onChatBoxMin);
            b.addObserver(EQQ.Model.ChatMsg, "BuddyTyping", this.showTyping);
            b.addObserver(EQQ.Model.ChatMsg, "StopTyping", this.hideTyping);
            b.addObserver(this.View, "ClickCloseButton", I);
            b.addObserver(this.View, "ClickFreeModelButton", v);
            b.addObserver(this.View, "ClickAdsorbModelButton", w);
            b.addObserver(alloy, "closeTaskBuddy", this.closeTaskBuddy);
            this.setMode("free");
            b.addObserver(EQQ, "eqqUacChange", D)
        };
        var D = function () {
            d.View.toggleModel("free")
        };
        this.getMaxCount = function () {
            var b = c.getClientWidth(c.id("taskBar_main"));
            return Math.floor(b / 122)
        };
        this.showTyping = function (b) {
            var c = d.getTask(b);
            c && !c.isCurrent() && d.View.showTyping(b)
        };
        this.hideTyping = function (b) {
            d.getTask(b) && d.View.hideTyping(b)
        };
        this.closeTaskBuddy = function () {
            if (m.length > d.getMaxCount()) for (var b = m.length - d.getMaxCount(), c = 0; c < b; c++) EQQ.Presenter.ChatBox.shiftChatBox()
        };
        this.addChatTask = function (b, c) {
            this.getTask(b.uin) || new s(b, c)
        };
        this.addGroupChatTask = function (b, c) {
            this.getTask(b.gid) || new s(b, c, "group")
        };
        this.getCurrent = function () {
            return s._current
        };
        this.getCurrentTaskUin = function () {
            var b = this.getCurrent();
            return b ? b.uin : null
        };
        this.getTask = function (b) {
            return r[b]
        };
        this.shiftTask = function () {
            m.shift().close()
        };
        this.getTaskLeft = function (b) {
            if (b = this.getTask(b)) return b.getLeft()
        };
        this.onBuddyStateChange = function (b) {
            d.getTask(b) && (b = EQQ.Model.BuddyList.getUserByUin(b), d.View.setBuddyState(b))
        };
        this.onGetUserInfoSuccess = function (b) {
            d.getTask(b.uin) && EQQ.Model.BuddyList.isStranger(b.uin) && d.View.updateBuddyName(b)
        };
        this.onBuddyMarkNameChange = function (b) {
            d.getTask(b.gid) && d.View.updateGroupMarkName(b)
        };
        this.onChatWinExist = function (b) {
            EQQ.Presenter.ChatBox.onChatWinExist(b)
        };
        this.getFacesArray = function () {
            for (var b = [], c = 0; c < m.length; c++) b.push(parseInt(m[c].uin));
            return b
        };
        this.onMessageBoxUserListChange = function (c) {
            var i = EQQ.Model.BuddyList.getSelf(),
                k = this.getCurrentTaskUin();
            p.length > 0 && (this.View.jumpDown(p), p = []);
            if (i.state != "callme") for (i = 0; i < c.length; i++) this.getTask(c[i].from_uin) && (k == c[i].from_uin ? (e.out("\u5f53\u524d\u7a97\u53e3\u7684\u5219\u76f4\u63a5\u8bbe\u7f6e\u4e3a\u5df2\u8bfb"), EQQ.Model.ChatMsg.removeMessageBoxUserList(k), e.out("\u8bbe\u7f6e\u4e3a\u5df2\u8bfbfinish")) : d.addJumpUserList("user",
            c[i]));
            else for (i = 0; i < c.length; i++) this.getTask(c[i].from_uin) ? k == c[i].from_uin ? (e.out("\u5f53\u524d\u7a97\u53e3\u7684\u5219\u76f4\u63a5\u8bbe\u7f6e\u4e3a\u5df2\u8bfb"), EQQ.Model.ChatMsg.removeMessageBoxUserList(k), e.out("\u8bbe\u7f6e\u4e3a\u5df2\u8bfbfinish")) : d.addJumpUserList("user", c[i]) : (this.addChatTask(c[i].from_uin, "notCurrent"), d.addJumpUserList("user", c[i]));
            p.length !== 0 && (EQQ.addNeedBeat2("taskBar"), b.addObserver(EQQ, "NotifyBeat_250", t))
        };
        this.onMessageBoxGroupListChange = function (c) {
            var i = this.getCurrentTaskUin();
            k.length > 0 && (this.View.jumpDown(k), k = []);
            for (var h = 0; h < c.length; h++) this.getTask(c[h].from_uin) && (i == c[h].from_uin ? (e.out("\u5f53\u524d\u7a97\u53e3\u7684\u5219\u76f4\u63a5\u8bbe\u7f6e\u4e3a\u5df2\u8bfb"), EQQ.Model.ChatMsg.removeMessageBoxGroupList(i), e.out("\u8bbe\u7f6e\u4e3a\u5df2\u8bfbfinish")) : d.addJumpUserList("group", c[h]));
            k.length !== 0 && (EQQ.addNeedBeat2("taskBar"), b.addObserver(EQQ, "NotifyBeat_250", t))
        };
        this.addJumpUserList = function (b, c) {
            d.View.resetJumpCount(c.from_uin,
            c.time);
            b === "user" ? p.push(c.from_uin) : b == "discu" ? (d.View.resetJumpCount(c.did, c.time), h.push(c.did)) : k.push(c.from_uin)
        };
        this.setMode = function (b) {
            switch (b) {
            case "adsorb":
                this.View.showFreeModelButton();
                EQQ.Presenter.ChatBox.setMode("adsorb");
                break;
            case "free":
                this.View.showAdsorbModelButton(), EQQ.Presenter.ChatBox.setMode("free")
            }
            b = this.getCurrentTaskUin();
            (b = d.getTask(b)) && b.setCurrent()
        };
        var t = function () {
            n = [];
            n = n.concat(p, k, h);
            n.length > 0 ? d.View.jumpAvatar(n) : (b.removeObserver(EQQ, "NotifyBeat_250",
            t), EQQ.removeNeedBeat2("taskBar"))
        };
        this.addDiscuChatTask = function (b, c) {
            this.getTask(b.did) || new s(b, c, "discu")
        };
        this.onMessageBoxDiscuListChange = function (c) {
            var k = this.getCurrentTaskUin();
            h.length > 0 && (this.View.jumpDown(h), h = []);
            for (var m = 0; m < c.length; m++) {
                var n = c[m];
                this.getTask(n.did) && (k == n.did ? (e.out("\u5f53\u524d\u7a97\u53e3\u7684\u5219\u76f4\u63a5\u8bbe\u7f6e\u4e3a\u5df2\u8bfb"), EQQ.Model.ChatMsg.removeMessageBoxDiscuList(k), e.out("\u8bbe\u7f6e\u4e3a\u5df2\u8bfbfinish")) : d.addJumpUserList("discu",
                n))
            }
            h.length !== 0 && (EQQ.addNeedBeat2("taskBar"), b.addObserver(EQQ, "NotifyBeat_250", t))
        };
        var E = function (b) {
            d.getTask(b.did) && d.View.updateDiscuName(b)
        }
    })
})();
(function () {
    WebqCore.register("EQQ.businessClass", function (e) {
        var d = EQQ.View.ChatBox,
            b = e.dom,
            c = e.event,
            n = alloy.layout.getPanel("desktop").body,
            p = function (a) {
                var a = b.getAttributeByParent("uin", a.target, this),
                    f = this.getAttribute("did") || this.getAttribute("gid") || "";
                if (a) {
                    var g = EQQ.Model.BuddyList.getUserByUin(a);
                    if (g) g.currentId = f, c.notifyObservers(d, "StartChat", a)
                }
                a = d.getCurrent();
                alloy.util.report2qqweb(a.chatBoxType + "mask|memlist|conversation")
            }, k = function () {
                b.setStyle(this, "backgroundColor", "#cbe7fc")
            },
            h = function () {
                b.setStyle(this, "backgroundColor", "transparent")
            }, m = function () {
                var a = Number(this.getAttribute("uin"));
                if (EQQ.avatarMouseoverTimer) clearTimeout(EQQ.avatarMouseoverTimer), EQQ.avatarMouseoverTimer = null;
                var f = b.getClientXY(this);
                f[0] -= 218;
                f[1] -= 5;
                EQQ.Presenter.MainPanel.showMiniCardPanel(a, f);
                c.notifyObservers(d, "AvatarMouseover", a)
            }, r = function () {
                EQQ.avatarMouseoverTimer = window.setTimeout(I, 500)
            }, I = function () {
                EQQ.Presenter.MainPanel.hideMiniCardPanel()
            }, v = function (a) {
                a.preventDefault();
                a = Number(this.getAttribute("uin"));
                alloy.portal.runApp("userDetails", a);
                pgvSendClick({
                    hottag: "web2qq.c2cmask.titlebar.nickname"
                });
                alloy.util.report2qqweb("singlemask|titlebar|nickname")
            }, w = function (a) {
                a.preventDefault();
                var a = Number(this.getAttribute("id").split("_")[2]),
                    b = EQQ.Model.BuddyList.getGroupByGid(a).code;
                alloy.portal.runApp("groupDetails", {
                    gid: a,
                    gcode: b,
                    from: "groupDetail"
                });
                alloy.util.report2qqweb("groupmask|titlebar|name")
            }, x = function (a) {
                a.preventDefault();
                a.stopPropagation();
                var a = Number(this.getAttribute("id").split("_")[3]),
                    b = EQQ.Model.BuddyList.getGroupByGid(a).code;
                alloy.portal.runApp("groupDetails", {
                    gid: a,
                    gcode: b,
                    from: "groupDetail"
                });
                alloy.util.report2qqweb("groupmask|bigtoolbar|profile")
            }, s = function (a) {
                a.preventDefault();
                a.stopPropagation();
                var a = Number(this.getAttribute("id").split("_")[3]),
                    b = EQQ.Model.BuddyList.getGroupByGid(a).code;
                alloy.portal.runApp("groupDetails", {
                    gid: a,
                    gcode: b,
                    from: "groupCard"
                });
                alloy.util.report2qqweb("groupmask|bigtoolbar|mycard")
            }, D = function (a) {
                e.out("stopPropagation");
                a.stopPropagation()
            },
            t = function (a, b) {
                return function (c) {
                    c.preventDefault();
                    c.stopPropagation();
                    var d = this.getAttribute("href") || null;
                    if (d && d != "###" && d.indexOf("###") == -1) {
                        var e = /\d+/,
                            l, k = this.getAttribute("uin");
                        if (!k) {
                            var i = d.match(e);
                            i && i.length > 0 && (k = parseInt(i[0]), this.setAttribute("uin", k))
                        }
                        var h = this;
                        k ? alloy.rpcService.sendGetFriendUin2(k, 4, function (k) {
                            l = k.result.account;
                            h.setAttribute("href", d.replace(e, l));
                            a.apply(h, [c]);
                            b && pgvSendClick({
                                hottag: b
                            })
                        }) : (a.apply(h, [c]), b && pgvSendClick({
                            hottag: b
                        }))
                    } else a.apply(h, [c]), b && pgvSendClick({
                        hottag: b
                    });
                    b.indexOf("single.toolbar.Insertimage") > -1 ? alloy.util.report2m(133170) : b.indexOf("group")
                }
            }, E = function (a, b) {
                b.preventDefault();
                c.notifyObservers(d, "ViewChatLog", a)
            }, o = {
                chatBox: '\t\t\t\t\t<div id="chatBox_sideBar2_<%=uin%>" class="chatBox_sideBar2" >\t\t\t\t\t\t</div>\t\t\t\t\t\t<div id="chatBox_sideBar_<%=uin%>" class="chatBox_sideBar">\t\t\t\t\t\t</div>\t\t\t\t\t<div class="chatBox_mainArea" id="chatBox_chatBox_mainArea_<%=uin%>">\t\t\t\t\t\t<div id="chatBox_chatBoard_<%=uin%>" class="chatBox_chatBoard">\t\t\t\t\t\t\t<div id="chatBox_<%=uin%>_moreMsgTip" class="chatBox_moreMsgTip"><span class="tipIcon"></span>\u6d88\u606f\u8bb0\u5f55\u672a\u5168\u90e8\u5c55\u793a\uff0c<a id="chatBox_<%=uin%>_moreMsgTipBtn" href="###" class="linkBtn">\u67e5\u770b\u66f4\u591a</a></div>\t\t\t\t\t\t\t<div id="chatBox_msgList_<%=uin%>" class="chatBox_msgList"></div>\t\t\t\t\t\t\t<a href="#" onclick="return false;" title="\u56de\u5230\u5e95\u90e8" ><div id="chatBox_msgList_backToBottom_<%=uin%>" class="chatBox_msgList_backToBottom"></div></a>\t\t\t\t\t\t\t<div id="chatBox_yellowTipsBar_<%=uin%>" class="chatBox_yellowTipsBar"></div>\t\t\t\t\t\t</div>\t\t\t\t\t\t<div id="chatBox_fontToolBar_<%=uin%>" class="editorToolbar" unselectable="on">\t\t\t\t\t\t\t<ul class="toolbar" unselectable="on">\t\t\t\t\t\t\t\t<li><select id="chatBox_fontToolBar_<%=uin%>_fontFamily" class="fontFamily"><option value="\u5b8b\u4f53">\u5b8b\u4f53</option><option value="\u9ed1\u4f53">\u9ed1\u4f53</option><option value="\u96b6\u4e66">\u96b6\u4e66</option><option value="\u5fae\u8f6f\u96c5\u9ed1">\u5fae\u8f6f\u96c5\u9ed1</option><option value="\u6977\u4f53_GB2312">\u6977\u4f53_GB2312</option><option value="\u5e7c\u5706">\u5e7c\u5706</option><option value="Arial">Arial</option><option value="Arial Black">Arial Black</option><option value="Times New Roman">Times New Roman</option><option value="Verdana">Verdana</option></select></li>\t\t\t\t\t\t\t\t<li><select id="chatBox_fontToolBar_<%=uin%>_fontSize" class="fontSize"><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option></select></li>\t\t\t\t\t\t\t\t<li><a id="chatBox_fontToolBar_<%=uin%>_bold" href="#" class="icon" title="\u7c97\u4f53"><span class="bold"></span></a></li>\t\t\t\t\t\t\t\t<li><a id="chatBox_fontToolBar_<%=uin%>_italic" href="#" class="icon" title="\u659c\u4f53"><span class="italic"></span></a></li>\t\t\t\t\t\t\t\t<li><a id="chatBox_fontToolBar_<%=uin%>_underline" href="#" class="icon" title="\u4e0b\u5212\u7ebf"><span class="underline"></span></a></li>\t\t\t\t\t\t\t\t<li><a id="chatBox_fontToolBar_<%=uin%>_color" href="#" class="icon" title="\u989c\u8272"><span class="color"></span></a></li>\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t\t<ul id="chatBox_fontToolBar_<%=uin%>_colorPanel"  class="colorPanel">\t\t\t\t\t\t\t\t<li><a href="#"><span style="background: #000000"></span></a></li><li><a href="#"><span style="background: #993300"></span></a></li><li><a href="#"><span style="background: #333300"></span></a></li><li><a href="#"><span style="background: #003300"></span></a></li><li><a href="#"><span style="background: #003366"></span></a></li><li><a href="#"><span style="background: #000080"></span></a></li><li><a href="#"><span style="background: #333399"></span></a></li><li><a href="#"><span style="background: #333333"></span></a></li>\t\t\t\t\t\t\t\t<li><a href="#"><span style="background: #800000"></span></a></li><li><a href="#"><span style="background: #FF6600"></span></a></li><li><a href="#"><span style="background: #808000"></span></a></li><li><a href="#"><span style="background: #008000"></span></a></li><li><a href="#"><span style="background: #008080"></span></a></li><li><a href="#"><span style="background: #0000FF"></span></a></li><li><a href="#"><span style="background: #666699"></span></a></li><li><a href="#"><span style="background: #808080"></span></a></li>\t\t\t\t\t\t\t\t<li><a href="#"><span style="background: #FF0000"></span></a></li><li><a href="#"><span style="background: #FF9900"></span></a></li><li><a href="#"><span style="background: #99CC00"></span></a></li><li><a href="#"><span style="background: #339966"></span></a></li><li><a href="#"><span style="background: #33CCCC"></span></a></li><li><a href="#"><span style="background: #3366FF"></span></a></li><li><a href="#"><span style="background: #800080"></span></a></li><li><a href="#"><span style="background: #999999"></span></a></li>\t\t\t\t\t\t\t\t<li><a href="#"><span style="background: #FF00FF"></span></a></li><li><a href="#"><span style="background: #FFCC00"></span></a></li><li><a href="#"><span style="background: #FFFF00"></span></a></li><li><a href="#"><span style="background: #00FFFF"></span></a></li><li><a href="#"><span style="background: #00FFFF"></span></a></li><li><a href="#"><span style="background: #00CCFF"></span></a></li><li><a href="#"><span style="background: #993366"></span></a></li><li><a href="#"><span style="background: #C0C0C0"></span></a></li>\t\t\t\t\t\t\t\t<li><a href="#"><span style="background: #FF99CC"></span></a></li><li><a href="#"><span style="background: #FFCC99"></span></a></li><li><a href="#"><span style="background: #FFFF99"></span></a></li><li><a href="#"><span style="background: #CCFFCC"></span></a></li><li><a href="#"><span style="background: #CCFFFF"></span></a></li><li><a href="#"><span style="background: #99CCFF"></span></a></li><li><a href="#"><span style="background: #CC99FF"></span></a></li><li><a href="#"><span style="background: #FFFFFF"></span></a></li>\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t</div>\t\t\t\t\t\t<div id="chatBox_toolBar_top_<%=uin%>" class="chatBox_toolBar_top">pull me</div>\t\t\t\t\t\t<div id="chatBox_toolBar_<%=uin%>" class="chatBox_toolBar">\t\t\t\t\t\t\t<a id="chatBox_fontButton_<%=uin%>"  href="###"><div class="chatBox_fontButton" title="\u8bbe\u7f6e\u5b57\u4f53\u989c\u8272\u548c\u683c\u5f0f"></div></a>\t\t\t\t\t\t\t<a href="###"><div id="chatBox_faceButton_<%=uin%>" class="chatBox_faceButton" title="\u8868\u60c5"></div></a>\t\t\t\t\t\t\t<a id="chatBox_handwriteButton_<%=uin%>" href="###"><div class="chatBox_handwriteButton" title="QQ\u4e91\u624b\u5199\u677f"></div></a>                            <a href="###" id="chatBox_shakeButton_<%=uin%>"><div class="chatBox_shakeButton" title="\u5411\u597d\u53cb\u53d1\u9001\u7a97\u53e3\u6296\u52a8"></div></a>\t\t\t\t\t\t\t<iframe id="uploadFilIframe_<%=uin%>" name="uploadFilIframe_<%=uin%>" style="display:none" src="./domain.html"></iframe>\t\t\t\t\t\t\t<a href="###" id="chatBox_sendPicButton_wrap_<%=uin%>"><form id="uploadSendPicfile_<%=uin%>" name="uploadSendPicfile_<%=uin%>"  title="\u53d1\u9001\u56fe\u7247..." class="sendPicForm" target="uploadFilIframe_<%=uin%>" action="" method="POST" enctype="multipart/form-data">\t\t\t\t\t\t\t   <div id="chatBox_sendPicButton_<%=uin%>" class="chatBox_sendPicButton" title="\u53d1\u9001\u56fe\u7247...">\t\t\t\t\t\t\t\t <input name="callback" type="hidden" value="parent.EQQ.Model.ChatMsg.callbackSendPic">\t\t\t\t\t\t\t\t <input name="locallangid" type="hidden" value="2052">\t\t\t\t\t\t\t\t <input name="clientversion" type="hidden" value="1409">\t\t\t\t\t\t\t\t <input name="uin" type="hidden" value="<%=uin%>">\t\t\t\t\t\t\t\t <input name="skey" type="hidden" value="@325fz2vag">                                 <input name="vfwebqq" type="hidden" value="@325fz2vag">\t\t\t\t\t\t\t\t <input name="appid" type="hidden" value="1002101">\t\t\t\t\t\t\t\t <input name="peeruin" type="hidden" value="<%=uin%>">\t\t\t\t\t\t\t\t <input id="offline_pic_<%=uin%>" class="f" name="file" type="file">\t\t\t\t\t\t\t\t <input name="fileid" type="hidden" value="">\t\t\t\t\t\t\t   </div>\t\t\t\t\t\t\t</form></a>\t\t\t\t\t\t\t<a id="chatBox_snapButton_<%=uin%>"  href="###"><div class="chatBox_snapButton" title="<%=hotKeyTitle%>"></div></a>\t\t\t\t\t\t\t<a id="chatBox_clearButton_<%=uin%>" href="###"><div class="chatBox_clearButton" title="\u6e05\u5c4f"></div></a>\t\t\t\t\t\t\t<a href="###"><div id="chatBox_maskButton_<%=uin%>" class="chatBox_acceptButton" title="\u7fa4\u5c4f\u853d"></div></a>\t\t\t\t\t\t\t<a id="chatBox_chatLogButton_<%=uin%>" class="chatBox_historyButtonCon" title="\u6d88\u606f\u8bb0\u5f55" href="###"><div class="chatBox_historyButton"></div><div class="chatBox_historyButtontxt">\u6d88\u606f\u8bb0\u5f55</div><div class="chatBox_Down"></div></a>\t\t\t\t\t\t</div>\t\t\t\t\t\t<div id="chatBox_inputBox_<%=uin%>" class="chatBox_inputBox"></div>\t\t\t\t\t\t<div class="chatBox_controlPanel">                            <input id="chatBox_speechButton_<%=uin%>" class="chatBox_speechButton" title="\u8bed\u97f3\u8f93\u5165" x-webkit-speech />\t\t\t\t\t\t\t<a href="###" id="chatBox_sendOptionButton_<%=uin%>" class="chatBox_sendOptionButton" title="\u4fee\u6539\u53d1\u9001\u5feb\u6377\u952e"></a>\t\t\t\t\t\t\t<a href="###" id="chatBox_sendMsgButton_<%=uin%>" class="chatBox_sendMsgButton" title="\u53d1\u9001">\u53d1\u3000\u9001</a>\t\t\t\t\t\t\t<a href="###" id="chatBox_closeButton_<%=uin%>" class="chatBox_closeButton" title="\u5173\u95ed">\u5173\u3000\u95ed</a>\t\t\t\t\t\t</div>\t\t\t\t\t</div>',
                chatBoxTitleBar: '<div id="chatBox_avatarArea_<%=uin%>" class="chatBox_buddyAvatarArea" uin="<%=uin%>"></div>\t\t\t\t\t\t\t<div id="chatBox_nameArea_<%=uin%>" class="chatBox_nameArea"></div>\t\t\t\t\t\t\t<div id="chatBox_moreInfoArea_<%=uin%>" class="chatBox_moreInfoArea"></div>\t\t\t\t\t\t\t<div id="chatBox_buttonBar_<%=uin%>" class="chatBox_buttonBar">\t\t\t\t\t\t\t\t<a href="###" id="chatBox_videoButton_<%=uin%>" title="\u5f00\u59cb\u89c6\u9891\u4f1a\u8bdd"><span class="chatBox_videoButton"></span></a>\t\t\t\t\t\t\t\t<a href="###" class="chatBox_fileButton chatBox_menuButton" hidefocus="true">\t\t\t\t\t\t\t\t   <div id="chatBox_fileButton_<%=uin%>" class="chatBox_sendFileButton" title="\u53d1\u9001\u6587\u4ef6..."></div>\t\t\t\t\t\t\t\t   <div class="chatBox_Down"></div>\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t<a href="###" id="chatBox_createDiscuButton_<%=uin%>" title="\u521b\u5efa\u8ba8\u8bba\u7ec4"><span class="chatBox_createDiscuButton"></span></a>\t\t\t\t\t\t\t</div>',
                userChatBoxTitleBarName: '<a id="chatBox_allName_<%=uin%>" class="chatBox_allName titleText" uin="<%=uin%>" title="<%=titleAllName%> " href="###">\t\t\t\t\t\t\t\t\t\t<span class="chatBox_mainName" id="chatBox_mainName_<%=uin%>"><%=htmlShowName%></span>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_clientTypeAll_<%=uin%>" style="display:inline"><span>[</span>\t\t\t\t\t\t\t\t\t\t<span id="chatBox_clientTypeImg_<%=uin%>" class="chatBox_clientType_<%=clientType%>">&nbsp;&nbsp;&nbsp;&nbsp;\t\t\t\t\t\t\t\t\t\t</span><span id="chatBox_clientType_<%=uin%>" title="<%=titleAllName%><%=clientTypeTips%>"><%=clientTypeTitle%></span>                                        </div><span id="chatBox_typing_<%=uin%>" style="display:none;" >-\u6b63\u5728\u8f93\u5165</span>\t\t\t\t\t\t\t\t\t</a>',
                userChatBoxTitleBarInfo: '<a id="EQQ_chatboxQzoneIcon_<%=uin%>" class="EQQ_chatboxQzoneIcon" title="\u67e5\u770bQQ\u7a7a\u95f4" href="' + EQQ.CONST.QZONE_USER_SERVER_DOMAIN + '<%=uin%>" target="_blank"></a>\t\t\t\t\t\t   \t\t\t<div class="chatBox_announcementArea"><span id="chatBox_signature_<%=uin%>" title="\u8f7d\u5165\u4e2d..."></span></div>',
                userSendPicFrom: '<input name="callback" type="hidden" value="parent.EQQ.Model.ChatMsg.callbackSendPic">\t\t\t\t\t\t\t <input name="locallangid" type="hidden" value="2052">\t\t\t\t\t\t\t <input name="clientversion" type="hidden" value="1409">\t\t\t\t\t\t\t <input name="uin" type="hidden" value="<%=uin%>">\t\t\t\t\t\t\t <input name="skey" type="hidden" value="@325fz2vag">\t\t\t\t\t\t\t <input name="appid" type="hidden" value="1002101">\t\t\t\t\t\t\t <input name="peeruin" type="hidden" value="593023668">\t\t\t\t\t\t\t <input id="offline_pic_<%=uin%>" class="f" name="file" type="file">\t\t\t\t\t\t\t <input name="fileid" type="hidden" value="">\t\t\t\t\t\t\t <input name="vfwebqq" type="hidden" value="">\t\t\t\t\t\t\t <input name="senderviplevel" type="hidden" value="">\t\t\t\t\t\t\t <input name="reciverviplevel" type="hidden" value="">',
                groupChatBoxTitleBarName: '<a id="chatBox_allName_<%=gid%>" class="chatBox_allName titleText" title="<%=titleAllName%> - <%=titleTypeText%>" target="_blank" href="' + EQQ.CONST.QQ_GROUP_URL + "" + this.code + '">\t\t\t\t\t\t\t\t\t\t<span class="chatBox_mainName"><%=htmlShowName%></span>\t\t\t\t\t\t\t\t\t</a>',
                groupChatBoxTitleBarInfo: '<a id="EQQ_chatboxGspaceIcon_<%=gid%>" class="EQQ_chatboxGspaceIcon EQQ_gspaceLevel_<%=level%>" title="<%=levelTitle%>" target="_blank" href="' + EQQ.CONST.QQ_GROUP_URL + '#<%=code%>"></a>\t\t\t\t\t\t\t\t\t<div class="chatBox_announcementArea">\t\t\t\t\t\t\t\t\t\t<a id="chatBox_announcement_<%=gid%>" title="\u8f7d\u5165\u4e2d..." target="_blank" href="' + EQQ.CONST.QQ_GROUP_URL + '#<%=code%>"></a>\t\t\t\t\t\t\t\t\t</div>',
                groupSideBarUnfold: '<div id="chatBox_groupMember_<%=gid%>" class="chatBox_groupMember">\t\t\t\t\t\t\t\t\t<div class="chatBox_groupMember_titleBar">\u7fa4\u6210\u5458(<span id="chatBox_groupMember_onlineCount_<%=gid%>">0</span>/<span id="chatBox_groupMember_count_<%=gid%>">0</span>)</div>\t\t\t\t\t\t\t\t\t<div id="chatBox_groupMember_mainArea_<%=gid%>" gid="<%=gid%>" class="chatBox_groupMember_mainArea">\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=gid%>_groupMember_callmeArea" class="chatBox_groupMember_callmeArea"></div>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=gid%>_groupMember_onlineArea" class="chatBox_groupMember_onlineArea"></div>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=gid%>_groupMember_busyArea" class="chatBox_groupMember_busyArea"></div>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=gid%>_groupMember_awayArea" class="chatBox_groupMember_awayArea"></div>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=gid%>_groupMember_silentArea" class="chatBox_groupMember_silentArea"></div>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=gid%>_groupMember_hiddenArea" class="chatBox_groupMember_hiddenArea"></div>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=gid%>_groupMember_offlineArea" class="chatBox_groupMember_offlineArea"></div>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>',
                groupSideBarFold: '<div id="chatBox_sideBar_trigger_<%=gid%>" class="chatBox_sideBar_trigger" title="\u70b9\u51fb\u5c55\u5f00">\t\t\t\t\t\t\t\t<div class="expand" >\u5728\u7ebf\u6210\u5458<span id="chatBox_sideBar2_online_member_count_<%=gid%>" class="online_member_count"></span></div>\t\t\t\t\t\t\t\t<a href="###" onclick="return false;" class="unexpand" ></a>\t\t\t\t\t\t\t</div>',
                groupSendPicFrom: '<input id="from_<%=gid%>" name="from" value="control" type="hidden">\t\t\t\t\t\t\t <input name="f" type="hidden" value="EQQ.Model.ChatMsg.callbackSendPicGroup">                            <input name="vfwebqq" type="hidden" value="@325fz2vag">\t\t\t\t\t\t\t <input id="custom_face_<%=gid%>" class="f" name="custom_face" type="file">\t\t\t\t\t\t\t <input name="fileid" type="hidden" value="">',
                discuSideBarUnfold: '\t<div id="chatBox_discuMember_<%=did%>" class="chatBox_groupMember">\t\t\t\t\t\t\t\t\t<div class="chatBox_groupMember_titleBar"><span class="discuMemberTitle">\u8ba8\u8bba\u6210\u5458(\t\t\t\t\t\t\t\t\t\t<span id="chatBox_discuMember_onlineCount_<%=did%>">0</span>/<span id="chatBox_discuMember_count_<%=did%>">0</span>)</span>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t<div id="chatBox_discuMember_mainArea_<%=did%>" did="<%=did%>" class="chatBox_discuMember_mainArea">\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=did%>_discuMember_callmeArea" class="chatBox_groupMember_callmeArea"></div>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=did%>_discuMember_onlineArea" class="chatBox_groupMember_onlineArea"></div>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=did%>_discuMember_busyArea" class="chatBox_groupMember_busyArea"></div>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=did%>_discuMember_awayArea" class="chatBox_groupMember_awayArea"></div>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=did%>_discuMember_silentArea" class="chatBox_groupMember_silentArea"></div>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=did%>_discuMember_hiddenArea" class="chatBox_groupMember_hiddenArea"></div>\t\t\t\t\t\t\t\t\t\t<div id="chatBox_<%=did%>_discuMember_offlineArea" class="chatBox_groupMember_offlineArea"></div>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t</div>',
                liteChatBoxTitleBarName: '<a id="chatBox_allName_<%=uin%>" class="chatBox_allName titleText" uin="<%=uin%>" title="<%=titleAllName%> " href="###">\t\t\t\t\t<span class="chatBox_mainName" id="chatBox_mainName_<%=uin%>"><%=htmlShowName%></span></a>'
            }, i = new e.Class({
                extend: alloy.businessClass.EqqWindow
            }, {
                uin: 0,
                _timer: null,
                _lastTime: null,
                _chatListRemainCount: 50,
                _isOverRemainCount: !1,
                _viewMoreClickCount: 0,
                init: function (a) {
                    var c = this;
                    this.uin = this.uin || a.userOrGroup.uin || a.userOrGroup.gid;
                    this.callSuper = function (a) {
                        var b = Array.prototype.slice,
                            d = b.call(arguments, 1);
                        i.superClass[a].apply(c, d.concat(b.call(arguments)))
                    };
                    a = this.parseOption(a);
                    this.callSuper("init", a);
                    this.handshake = 0;
                    this.titleBar = this.titleBar || {};
                    this.titleBarDom = this.titleBarDom || {};
                    this.toolBar = this.toolBar || {};
                    this.toolbarDom = this.toolBarDom || {};
                    this.type = a.type;
                    this.chatBoxType = a.chatBoxType;
                    this.windowType = "chatbox";
                    this.option.taskType = "chatBox";
                    this._minWidth = a.minWidth;
                    this._minHeight = a.minHeight;
                    this.tmpStorage = {};
                    this.initFrame();
                    this.initTitleBar();
                    this.initToolBar();
                    this.initSideBar();
                    this.initFontToolBar();
                    e.platform.iPad && (b.setStyle(this._fontButton, "display", "none"), b.setStyle(this._handwriteButton, "display", "none"), b.setStyle(this._sendPicFormCon, "display", "none"), b.setStyle(this._fileSendFormCon, "display", "none"), this.editor.setState(!1));
                    this.setBg("url(" + alloy.CONST.CDN_URL + "pubapps/0/50/images/bg.png) repeat-x #f4f9fc");
                    e.browser.chrome && this.initSpeech()
                },
                initFrame: function () {
                    var a = this,
                        f = function () {
                            if (a._chatBox_msgList) a._chatBox_msgList.scrollTop = a._chatBox_msgList.scrollHeight
                        }, g = function () {
                            a.focusEditor()
                        }, j = {
                            onBackToBottomClick: function () {
                                a._chatBox_msgList && (a._chatBox_msgList.scrollTop = a._chatBox_msgList.scrollHeight)
                            },
                            onCloseButtonClick: function (b) {
                                b.preventDefault();
                                a.close();
                                alloy.util.report2qqweb(a.chatBoxType + "mask|bottom|close")
                            },
                            onChatBoxKeyDown: function (b) {
                                if (b.keyCode === 13) b.preventDefault(), d.getSendMsgKey() ? !b.ctrlKey && !b.shiftKey ? a.checkInput() && c.notifyObservers(d, "SendMsg", a) : b.ctrlKey && a.editor.newline() : b.ctrlKey && !b.shiftKey ? a.checkInput() && c.notifyObservers(d, "SendMsg", a) : a.editor.newline();
                                else if ((b.keyCode === 83 || b.type === "keypress" && b.charCode === 115) && b.altKey && !b.ctrlKey) b.stopPropagation(), b.preventDefault(), a.checkInput() && (c.notifyObservers(d, "SendMsg", a), alloy.util.report2qqweb("hotkey|sendmsg|alts"))
                            },
                            onSendMsgButtonClick: function () {
                                a.focusEditor();
                                a.checkInput() && c.notifyObservers(d, "SendMsg", a);
                                alloy.util.report2qqweb(a.chatBoxType + "mask|bottom|send")
                            },
                            onSendOptionButtonClick: function (f) {
                                f.stopPropagation();
                                f = b.getClientXY(a._sendOptionButton);
                                c.notifyObservers(d, "SendOptionButtonClick", f);
                                alloy.util.report2qqweb(a.chatBoxType + "mask|bottom|send|pulldown")
                            },
                            onShow: function () {
                                e.out("onShow >>>>>>>>>>>>>>>>>>>>");
                                a.videoWin && a.videoWin.show();
                                window.setTimeout(g, 500);
                                c.notifyObservers(d, "ChatBoxShow", a);
                                (e.browser.chrome > 0 || e.browser.ie > 7) && a.scrollToBottom()
                            },
                            onMin: function () {
                                c.notifyObservers(d, "ChatBoxMin", a)
                            },
                            onMax: function (b) {
                                b == "fullscreen" && c.notifyObservers(a, "resize", b)
                            },
                            onRestore: function () {
                                var b = d.getMode();
                                if (b === "adsorb") a.setWidth(a._adsorbWidth), this.subMode == 1 ? a.setHeight(a._restoreHeight) : a.setHeight(a._adsorbHeight), a.autoAlign();
                                else if (b === "free") {
                                    a.setXY(a._x, a._y);
                                    if (a._restoreWidth < 0) a._restoreWidth = 0;
                                    a.setWidth(a._restoreWidth);
                                    if (a._restoreHeight < 0) a._restoreHeight = 0;
                                    a.setHeight(a._restoreHeight)
                                }
                                d.hideFacePanel();
                                b = a.getBoxStatus();
                                (b == "fullscreen" || b == "max") && c.notifyObservers(a, "resize", b)
                            },
                            onSetCurrent: function () {
                                e.out("ChatBoxSetCurrent1");
                                var b = a.getBoxStatus();
                                d.getMode() === "adsorb" && !(b == "max" || b == "fullscreen") && a.autoAlign();
                                e.out("ChatBoxSetCurrent2");
                                d.lastSelectedChatbox = this;
                                c.notifyObservers(d, "ChatBoxSetCurrent", a);
                                a.chatBoxType == "group" && a.delaySendGetGroupNewestState((new Date).getTime());
                                a.chatBoxType == "discu" && a.setTimingUpdateDiscuStatus((new Date).getTime())
                            },
                            onSetNotCurrent: function () {
                                d.getMode() === "adsorb" && a.min();
                                c.notifyObservers(d, "ChatBoxSetNotCurrent", a);
                                a.chatBoxType == "group" && a.pauseDelaySendGetGroupNewestState();
                                a.chatBoxType == "discu" && a.pauseDelaySendGetDiscuNewestState()
                            },
                            onChatBoxResize: function () {
                                var c = a.tmpStorage,
                                    d = a.getBodySize().height;
                                if (c.bottomHeight && d < 130 + c.bottomHeight) b.setStyle(a._inputBox, "height", c._init_bottomHeight + "px"), b.setStyle(a._chatBox_toolBar_top, "bottom", c._init_toolBar_top_bottom + "px"), b.setStyle(a._chatBox_toolBar, "bottom", c._init_toolBar_bottom + "px"), b.setStyle(a._chatBox_chatBoard, "bottom", c._init_charBoard_bottom + "px"), c.toolBar_top_bottom = c._init_toolBar_top_bottom, c.toolBar_bottom = c._init_toolBar_bottom, c.bottomHeight = c._init_bottomHeight,
                                c.charBoard_bottom = c._init_charBoard_bottom;
                                if (e.browser.ie && e.browser.ie <= 8 || c.toolBar_bottom) {
                                    var g = d - i.inputAndTipsHeight;
                                    c.toolBar_bottom && (g = d - c.toolBar_bottom - 25);
                                    if (g < i.tipsHeight) g = i.tipsHeight;
                                    a._isShowFontBar && (g -= 23, b.setStyle(a._chatBox_chatBoard, "bottom", c.charBoard_bottom - 28 + "px"), b.setStyle(a._fontToolBar, "bottom", c.toolBar_top_bottom + 3 + "px"));
                                    c = g;
                                    a._isShowTips && (c = g - i.tipsHeight);
                                    b.setStyle(a._chatBox_chatBoard, "height", g - 3 + "px");
                                    b.setStyle(a._chatBox_msgList, "height", c - 4 + "px");
                                    if (a.chatBoxType == "group") {
                                        g = d - i.groupSpaceHeight;
                                        if (g < i.groupMemberTitleBarHeight) g = i.groupMemberTitleBarHeight;
                                        b.setStyle(a._chatBox_groupMember, "height", g + "px");
                                        b.setStyle(a._chatBox_groupMember_mainArea, "height", g - i.groupMemberTitleBarHeight + "px");
                                        a.loadGroupMemberAvatar()
                                    }
                                    if (a.chatBoxType == "discu") {
                                        d -= e.browser.ie < 7 ? 3 : 10;
                                        if (d < i.groupMemberTitleBarHeight) d = i.groupMemberTitleBarHeight;
                                        b.setStyle(a._chatBox_discuMember, "height", d + "px");
                                        b.setStyle(a._chatBox_discuMember_mainArea, "height", d - i.groupMemberTitleBarHeight + 7 + "px")
                                    }
                                }
                                setTimeout(f, 0)
                            },
                            onChatBoxClose: function () {
                                c.notifyObservers(d, "ChatBoxClose", a);
                                a.shakeBeater && a.shakeBeater.end();
                                d.hideFacePanel();
                                d.removeChatBox(a);
                                this.stopChunk = !0;
                                window.clearTimeout(d.onListScrollTimer);
                                a.chatBoxType == "group" && a.pauseDelaySendGetGroupNewestState();
                                a.chatBoxType == "discu" && a.pauseDelaySendGetDiscuNewestState();
                                e.out("onChatBoxClose1: ")
                            },
                            onChatMsgScrollToTop: function () {
                                if (this.scrollTop <= 0 && a._isOverRemainCount) a._moreMsgBtn.innerHTML = a.chatBoxType == "group" && a._viewMoreClickCount < 3 ? "\u70b9\u51fb\u67e5\u770b\u524d3\u6761\u8bb0\u5f55" : "\u67e5\u770b\u66f4\u591a", b.show(a._moreMsgTip), setTimeout(function () {
                                    a && a._moreMsgTip && b.hide(a._moreMsgTip)
                                }, 5E3);
                                this.scrollHeight - this.scrollTop - this.offsetHeight >= 50 ? b.show(a._chatBox_msgList_backToBottom) : b.hide(a._chatBox_msgList_backToBottom)
                            },
                            onEditorPaste: function () {
                                a.mode = "paste";
                                c.notifyObservers(EQQ.View.ChatBox, "runScreenCapture", a)
                            },
                            about: function () {}
                        };
                    this.createFrameDom();
                    this._closeButton2 = b.id("chatBox_closeButton_" + this.uin);
                    this._chatBox_chatBoard = b.id("chatBox_chatBoard_" + this.uin);
                    this._chatBox_msgList = b.id("chatBox_msgList_" + this.uin);
                    this._chatBox_msgList_backToBottom = b.id("chatBox_msgList_backToBottom_" + this.uin);
                    this._yellowTipsBar = b.id("chatBox_yellowTipsBar_" + this.uin);
                    this._inputBox = b.id("chatBox_inputBox_" + this.uin);
                    this.editor = new EQQ.View.ChatBox.Editor({
                        appendTo: this._inputBox,
                        className: "rich_editor",
                        keepCursor: !0,
                        brNewline: !1,
                        clearNode: !0
                    });
                    c.addObserver(this.editor, "EditorPaste", j.onEditorPaste);
                    this._sendOptionButton = b.id("chatBox_sendOptionButton_" + this.uin);
                    this._sendMsgButton = b.id("chatBox_sendMsgButton_" + this.uin);
                    this._chatBox_chatBox_mainArea = b.id("chatBox_chatBox_mainArea_" + this.uin);
                    e.platform.iPad && new e.ui.TouchScroller(this._chatBox_msgList);
                    c.on(this._chatBox_msgList, "scroll", j.onChatMsgScrollToTop);
                    if (e.platform.linux && e.browser.firefox || e.platform.win && e.browser.opera) c.on(this._el, "keypress", j.onChatBoxKeyDown);
                    else c.on(this._el, "keydown", j.onChatBoxKeyDown);
                    c.on(this._chatBox_chatBoard, "mousedown",
                    e.bind(this.stopPropagationAndSetCurrentWithoutFocus, this));
                    c.on(this._sendOptionButton, "click", j.onSendOptionButtonClick);
                    c.on(this._sendMsgButton, "click", j.onSendMsgButtonClick);
                    c.on(this._closeButton2, "click", j.onCloseButtonClick);
                    c.on(this._chatBox_msgList_backToBottom, "click", j.onBackToBottomClick);
                    c.addObserver(this, "show", j.onShow);
                    c.addObserver(this, "restore", j.onRestore);
                    c.addObserver(this, "max", j.onMax);
                    c.addObserver(this, "min", j.onMin);
                    c.addObserver(this, "setCurrent", j.onSetCurrent);
                    c.addObserver(this, "setNotCurrent", j.onSetNotCurrent);
                    c.addObserver(this, "resize", j.onChatBoxResize);
                    c.addObserver(this, "close", j.onChatBoxClose);
                    j = d.getMode();
                    j === "adsorb" ? this.setAdsorbMode() : j === "free" && this.setFreeMode()
                },
                createFrameDom: function () {
                    this._el = this.container;
                    var a = {
                        uin: this.uin,
                        hotKeyTitle: alloy.hotkey.getHotKeyTitle()
                    };
                    this.setHtml(e.string.template(o.chatBox, a));
                    this.setTitleBarHeight(83)
                },
                setTitleBarAvatar: function (a) {
                    this.titleBar = this.titleBar || {};
                    this.titleBar.avatar = a || ""
                },
                setTitleBarName: function (a) {
                    this.titleBar = this.titleBar || {};
                    this.titleBar.name = a || ""
                },
                setTitleBarInfo: function (a) {
                    this.titleBar = this.titleBar || {};
                    this.titleBar.info = a || ""
                },
                initTitleBar: function () {
                    this.createTitleBarDom();
                    this.bindTitleBarDom()
                },
                createTitleBarDom: function () {
                    this.setTitleHtml(e.string.template(o.chatBoxTitleBar, {
                        uin: this.uin
                    }));
                    this.titleBarDom.avatarArea = b.id("chatBox_avatarArea_" + this.uin);
                    this.titleBarDom.nameArea = b.id("chatBox_nameArea_" + this.uin);
                    this.titleBarDom.infoArea = b.id("chatBox_moreInfoArea_" + this.uin);
                    this.titleBarDom.buttonBar = b.id("chatBox_buttonBar_" + this.uin);
                    this.titleBarDom.avatarArea.innerHTML = this.titleBar.avatar || "";
                    this.titleBarDom.nameArea.innerHTML = this.titleBar.name || "";
                    this.titleBarDom.infoArea.innerHTML = this.titleBar.info || ""
                },
                bindTitleBarDom: function () {},
                setSendPicForm: function (a) {
                    this.toolBar.picFormItems = a || ""
                },
                handShaking: function (a) {
                    this.handshake |= a
                },
                initSpeech: function () {
                    var a = this;
                    this._chatBox_speechButton = b.id("chatBox_speechButton_" + this.uin);
                    b.show(this._chatBox_speechButton);
                    this._chatBox_speechButton && (b.show(this._chatBox_speechButton), c.on(this._chatBox_speechButton, "webkitspeechchange", function () {
                        a.focusEditor();
                        a.editor.insertHtml(this.value);
                        this.value = ""
                    }))
                },
                initToolBar: function () {
                    this.createToolBarDom();
                    this.createToolBarEvent()
                },
                createToolBarDom: function () {
                    this._chatBox_toolBar_top = b.id("chatBox_toolBar_top_" + this.uin);
                    this._chatBox_toolBar = b.id("chatBox_toolBar_" + this.uin);
                    this._fontToolBar = b.id("chatBox_fontToolBar_" + this.uin);
                    this._fontButton = b.id("chatBox_fontButton_" + this.uin);
                    this._handwriteButton = b.id("chatBox_handwriteButton_" + this.uin);
                    this._faceButton = b.id("chatBox_faceButton_" + this.uin);
                    this._shakeButton = b.id("chatBox_shakeButton_" + this.uin);
                    this._selSendFile = b.id("offline_file_" + this.uin);
                    this._snapButton = b.id("chatBox_snapButton_" + this.uin);
                    this._sendPicButtonWrap = b.id("chatBox_sendPicButton_wrap_" + this.uin);
                    this._sendPicButton = b.id("chatBox_sendPicButton_" + this.uin);
                    this._sendPicButton.innerHTML = this.toolBar.picFormItems;
                    this._fileSendFormCon = b.id("chatBox_fileButton_" + this.uin).parentNode;
                    this._fileButton = b.id("chatBox_fileButton_" + this.uin).parentNode;
                    this._maskButton = b.id("chatBox_maskButton_" + this.uin);
                    this._maskButtonCon = this._maskButton.parentNode;
                    this._clearButton = b.id("chatBox_clearButton_" + this.uin);
                    this._videoButton = b.id("chatBox_videoButton_" + this.uin);
                    this._createDiscuButton = b.id("chatBox_createDiscuButton_" + this.uin);
                    this._chatLogButton = b.id("chatBox_chatLogButton_" + this.uin);
                    this._sendPicForm = b.id("uploadSendPicfile_" + this.uin);
                    this._sendPicFormCon = this._sendPicForm.parentNode;
                    this._moreMsgTip = b.id("chatBox_" + this.uin + "_moreMsgTip");
                    this._moreMsgBtn = b.id("chatBox_" + this.uin + "_moreMsgTipBtn");
                    alloy.portal.isWebTop() || (!e.platform.win || !e.browser.ie && !e.browser.firefox && !e.browser.chrome) && e.dom.hide(this._snapButton);
                    e.platform.iPad && b.hide(this._videoButton)
                },
                createToolBarEvent: function () {
                    var a = this,
                        f = {
                            onFontButtonClick: function () {
                                var f = a.tmpStorage;
                                if (b.isShow(a._fontToolBar)) {
                                    b.hide(a._fontToolBar);
                                    var d = parseInt(b.getStyle(a._chatBox_chatBoard, "bottom"));
                                    d -= 28;
                                    b.setStyle(a._chatBox_chatBoard, "bottom", d + "px");
                                    a._isShowFontBar = !1;
                                    f.toolBar_top_bottom && c.notifyObservers(a, "resize")
                                } else d = parseInt(b.getStyle(a._chatBox_chatBoard, "bottom")), d += 28, b.setStyle(a._chatBox_chatBoard, "bottom", d + "px"), a._isShowFontBar = !0, f.toolBar_top_bottom && (b.setStyle(a._fontToolBar, "bottom", f.toolBar_top_bottom + 3 + "px"), c.notifyObservers(a, "resize")), b.show(a._fontToolBar);
                                alloy.util.report2qqweb(a.chatBoxType + "mask|smalltoolbar|font")
                            },
                            onFaceButtonClick: function (f) {
                                f.stopPropagation();
                                f = b.getClientXY(a._faceButton);
                                c.notifyObservers(d, "FaceButtonClick", {
                                    xy: f,
                                    showCustom: !0
                                });
                                alloy.util.report2qqweb(a.chatBoxType + "mask|smalltoolbar|emotion")
                            },
                            onHandwriteButtonClick: function () {
                                var a = d.getCurrent(),
                                    b = a.getXY(),
                                    c = a.getWidth(),
                                    a = a.getHeight(),
                                    f = alloy.layout.getAvailableWidth();
                                alloy.layout.getAvailableHeight();
                                var e;
                                f - b.x - c > 445 && (e = {
                                    x: b.x + c - 12,
                                    y: b.y + a - 339
                                });
                                alloy.system.runHandWrite(e)
                            },
                            onSendFileButtonClick: function () {
                                c.notifyObservers(d, "SendFileButtonClick", a);
                                alloy.util.report2qqweb(a.chatBoxType + "mask|bigtoolbar|sendfiles")
                            },
                            onSnapButtonClick: function () {
                                a.mode = "cupture";
                                c.notifyObservers(d, "runScreenCapture", a);
                                alloy.util.report2qqweb(a.chatBoxType + "mask|smalltoolbar|screencapture")
                            },
                            onShakeButtonClick: function () {
                                a._isSaking || a._lastShakeTime && +new Date - a._lastShakeTime < 12E3 ? a.tips("\u60a8\u53d1\u9001\u7a97\u53e3\u6296\u52a8\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u5019\u518d\u53d1\u3002") : c.notifyObservers(d, "ShakeButtonClick", a.uin)
                            },
                            onSendPicButtonClick: function (b) {
                                b.stopPropagation();
                                c.notifyObservers(d, "SendPicButtonClick",
                                a);
                                alloy.util.report2qqweb(a.chatBoxType + "mask|smalltoolbar|insertimage")
                            },
                            onMaskButtonClick: function (f) {
                                f.stopPropagation();
                                f = b.getClientXY(a._maskButtonCon);
                                c.notifyObservers(d, "MaskButtonClick", f);
                                alloy.util.report2qqweb(a.chatBoxType + "mask|smalltoolbar|msgsetting")
                            },
                            onClearButtonClick: function (b) {
                                b.preventDefault();
                                c.notifyObservers(d, "ClearChatLog", a);
                                alloy.util.report2qqweb(a.chatBoxType + "mask|smalltoolbar|screenclean")
                            },
                            onVideoButtonClick: function (b) {
                                b.preventDefault();
                                c.notifyObservers(d, "AskVideoButtonClick", a);
                                alloy.util.report2qqweb(a.chatBoxType + "mask|bigtoolbar|videochat")
                            },
                            onChatLogButtonClick: function (f) {
                                f.preventDefault();
                                f.stopPropagation();
                                f = b.getClientXY(a._chatLogButton);
                                c.notifyObservers(d, "ChatLogButtonClick", f);
                                alloy.util.report2qqweb(a.chatBoxType + "mask|smalltoolbar|msghistory")
                            },
                            onGroupChatLogButtonClick: function (b) {
                                b.preventDefault();
                                b.stopPropagation();
                                b = {
                                    gid: a.group.gid,
                                    gcode: a.group.code,
                                    from: "group"
                                };
                                pgvSendClick({
                                    hottag: "WEB2QQ.CHATBOX.RUN.CHATLOGVIEWER"
                                });
                                alloy.util.report2im("chatbox|run|chatlogviewer");
                                qqweb.portal.runApp("chatLogViewer", b)
                            },
                            onGroupChatLogMoreLog: function (g) {
                                b.hide(a._moreMsgTip);
                                var j = "",
                                    y = "",
                                    l = 0,
                                    k;
                                for (k in a._chatBox_msgList.children) {
                                    var i = a._chatBox_msgList.children[k];
                                    if (typeof i != "undefined" && typeof i == "object") {
                                        y = i.getAttribute("duin");
                                        if (!e.isUndefined(y) && y) {
                                            j = i.getAttribute("time");
                                            break
                                        }
                                        l++
                                    }
                                }
                                a._chatListRemainCount = 1E4;
                                a._viewMoreClickCount++;
                                g.preventDefault();
                                g.stopPropagation();
                                if (j == "" || a._viewMoreClickCount > 3) return f.onGroupChatLogButtonClick(g), !1;
                                c.notifyObservers(d, "GetMoreLog", {
                                    gid: a.group.gid,
                                    gcode: a.group.code,
                                    uin: y,
                                    time: j,
                                    precount: l,
                                    total: 3
                                })
                            },
                            onDragInnerTab: function (f) {
                                var d = a.tmpStorage;
                                f.preventDefault();
                                f.stopPropagation();
                                var e = f.pageY,
                                    f = a.getBodySize().height;
                                d.bottomHeight ? f = f - d.toolBar_bottom - 23 : (d.bottomHeight = parseInt(b.getStyle(a._inputBox, "height")), d.toolBar_top_bottom = parseInt(b.getStyle(a._chatBox_toolBar_top, "bottom")), d.toolBar_bottom = parseInt(b.getStyle(a._chatBox_toolBar, "bottom")), d.charBoard_bottom = parseInt(b.getStyle(a._chatBox_chatBoard, "bottom")), f = f - d.toolBar_bottom - 23, d._init_toolBar_top_bottom = d.toolBar_top_bottom, d._init_toolBar_bottom = d.toolBar_bottom, d._init_bottomHeight = d.bottomHeight, d._init_charBoard_bottom = d.charBoard_bottom);
                                d.topHeight = parseInt(f);
                                var l = function (f) {
                                    f.preventDefault();
                                    f.stopPropagation();
                                    var f = f.pageY,
                                        g = f - e;
                                    if (Math.abs(g) > 3) {
                                        var l = d.topHeight + g,
                                            k = d.bottomHeight - g,
                                            i = d.toolBar_top_bottom - g,
                                            h = d.toolBar_bottom - g,
                                            g = d.charBoard_bottom - g;
                                        if (l >= 80 && k >= 45) c.notifyObservers(a, "resize"), b.setStyle(a._inputBox, "height",
                                        k + "px"), b.setStyle(a._chatBox_toolBar_top, "bottom", i + "px"), b.setStyle(a._chatBox_toolBar, "bottom", h + "px"), b.setStyle(a._chatBox_chatBoard, "bottom", g + "px"), a._isShowFontBar && (b.setStyle(a._chatBox_chatBoard, "bottom", g - 28 + "px"), b.setStyle(a._fontToolBar, "bottom", i + 3 + "px")), d.topHeight = l, d.bottomHeight = k, d.toolBar_top_bottom = i, d.toolBar_bottom = h, d.charBoard_bottom = g;
                                        e = f
                                    }
                                }, k = function () {
                                    c.off(document, "mousemove", l);
                                    c.off(document, "mouseup", k);
                                    a._chatBox_msgList.scrollTop = a._chatBox_msgList.scrollHeight;
                                    c.notifyObservers(a, "resize")
                                };
                                c.on(document, "mousemove", l);
                                c.on(document, "mouseup", k)
                            }
                        };
                    c.on(this._fontButton, "click", t(f.onFontButtonClick, "web2qq." + this.chatBoxType + ".toolbar.font"));
                    c.on(this._handwriteButton, "click", t(f.onHandwriteButtonClick, "web2qq." + this.chatBoxType + ".toolbar.handwrite"));
                    c.on(this._faceButton, "click", t(f.onFaceButtonClick, "web2qq." + this.chatBoxType + ".toolbar.emotion"));
                    c.on(this._snapButton, "click", t(f.onSnapButtonClick, "web2qq." + this.chatBoxType + ".toolbar.screencapture"));
                    this._selSendPic && c.on(this._selSendPic, "change", t(f.onSendPicButtonClick, "web2qq." + this.chatBoxType + ".toolbar.Insertimage"));
                    c.on(this._shakeButton, "click", t(f.onShakeButtonClick, "web2qq." + this.chatBoxType + ".toolbar.shake"));
                    c.on(this._clearButton, "click", t(f.onClearButtonClick, "web2qq." + this.chatBoxType + ".toolbar.screenclean"));
                    c.on(this._videoButton, "click", f.onVideoButtonClick);
                    if (this.chatBoxType == "group") c.on(this._moreMsgBtn, "click", f.onGroupChatLogMoreLog);
                    c.on(this._chatLogButton, "click",
                    f.onChatLogButtonClick);
                    c.on(this._moreMsgBtn, "click", e.bind(E, this, this.uin));
                    c.on(this._fileButton, "click", function (f) {
                        f.preventDefault();
                        f.stopPropagation();
                        f = b.getClientXY(this);
                        f[1] += 18;
                        c.notifyObservers(d, "ShowSendFilePanel", {
                            xy: f,
                            uin: a.uin
                        })
                    });
                    c.on(this._chatBox_toolBar_top, "mousedown", f.onDragInnerTab);
                    c.on(this._sendPicButton, "click", D);
                    c.on(this._sendPicButton, "mousedown", D);
                    c.on(this._maskButtonCon, "click", t(f.onMaskButtonClick, "web2qq.groupmask.toolbar.msgsetting.msgsetting"))
                },
                initFontToolBar: function () {
                    var a = "chatBox_fontToolBar_" + this.uin;
                    this._fontFamily = b.id(a + "_fontFamily");
                    this._fontSize = b.id(a + "_fontSize");
                    this._fontBold = b.id(a + "_bold");
                    this._fontItalic = b.id(a + "_italic");
                    this._fontUnderline = b.id(a + "_underline");
                    this._fontColor = b.id(a + "_color");
                    this._fontColorPanel = b.id(a + "_colorPanel");
                    this._colorPanel = new e.ui.PopupBox({
                        container: this._fontColorPanel
                    });
                    this.createFontToolBarEvent();
                    this.loadFontStyle(this.editor.getAllStyles())
                },
                createFontToolBarEvent: function () {
                    var a = this,
                        f = {
                            onFontFamilyButtonChange: function () {
                                a.editor.setStyle("fontFamily",
                                this.value, !0)
                            },
                            onFontSizeButtonChange: function () {
                                a.editor.setStyle("fontSize", this.value + "pt", !0)
                            },
                            onBoldButtonClick: function (c) {
                                c.preventDefault();
                                b.hasClass(this, "selected") ? (a.editor.setStyle("fontWeight", "normal", !0), b.removeClass(this, "selected")) : (a.editor.setStyle("fontWeight", "bold", !0), b.addClass(this, "selected"))
                            },
                            onItalicButtonClick: function (c) {
                                c.preventDefault();
                                b.hasClass(this, "selected") ? (a.editor.setStyle("fontStyle", "normal", !0), b.removeClass(this, "selected")) : (a.editor.setStyle("fontStyle", "italic", !0), b.addClass(this, "selected"))
                            },
                            onUnderlineButtonClick: function (c) {
                                c.preventDefault();
                                b.hasClass(this, "selected") ? (a.editor.setStyle("textDecoration", "none", !0), b.removeClass(this, "selected")) : (a.editor.setStyle("textDecoration", "underline", !0), b.addClass(this, "selected"))
                            },
                            onColorButtonClick: function (c) {
                                c.preventDefault();
                                c.stopPropagation();
                                a._colorPanel.isShow() ? (a._colorPanel.hide(), b.removeClass(this, "selected")) : (a._colorPanel.show(), b.addClass(this, "selected"))
                            },
                            onColorPanelClick: function (c) {
                                c.preventDefault();
                                c.stopPropagation();
                                var c = c.target,
                                    f = null;
                                if (c.tagName.toLowerCase() === "span") f = c;
                                else if (c.tagName.toLowerCase() === "a") f = c.firstChild;
                                f && (c = b.getStyle(f, "backgroundColor"), a.editor.setStyle("color", c, !0), a._colorPanel.hide(), b.removeClass(a._fontColor, "selected"))
                            }
                        };
                    c.on(this._fontFamily, "change", f.onFontFamilyButtonChange);
                    c.on(this._fontSize, "change", f.onFontSizeButtonChange);
                    c.on(this._fontBold, "click", f.onBoldButtonClick);
                    c.on(this._fontItalic, "click", f.onItalicButtonClick);
                    c.on(this._fontUnderline, "click", f.onUnderlineButtonClick);
                    c.on(this._fontColor, "click", f.onColorButtonClick);
                    c.on(this._fontColorPanel, "click", f.onColorPanelClick)
                },
                loadFontStyle: function (a) {
                    this._fontFamily.value = a[0];
                    this._fontSize.value = a[1].match(/\d+/)[0];
                    a[2] == "bold" && b.addClass(this._fontBold, "selected");
                    a[3] == "italic" && b.addClass(this._fontItalic, "selected");
                    a[4] == "underline" && b.addClass(this._fontUnderline, "selected")
                },
                initSideBar: function () {
                    if (this.option.hasSideBar) this._chatBox_sideBar = b.id("chatBox_sideBar_" + this.uin), this._chatBox_sideBar2 = b.id("chatBox_sideBar2_" + this.uin), this.createSideBarDom(), this.createSideBarEvent()
                },
                createSideBarDom: function () {
                    this._chatBox_sideBar.innerHTML = "";
                    this._chatBox_sideBar2.innerHTML = ""
                },
                createSideBarEvent: function () {
                    var a = this;
                    c.on(this._chatBox_sideBar2, "click", function () {
                        a._isExpandSidebar ? (a._isExpandSidebar = !1, a.setSideBarCollapse(), a.onSideBarCollapse(), alloy.util.report2qqweb("groupmask|sidebar|hide")) : (a._isExpandSidebar = !0, a.setSideBarExpand(), a.onSideBarExpand(),
                        alloy.util.report2qqweb("groupmask|sidebar|show"))
                    })
                },
                onSideBarExpand: function () {},
                setSideBarExpand: function () {
                    b.addClass(this._chatBox_sideBar2, "chatBox_sideBar2_expand");
                    b.setStyle(this._chatBox_chatBox_mainArea, "marginRight", "200px");
                    b.show(this._chatBox_sideBar);
                    b.setStyle(this._chatBox_sideBar2, "width", "10px");
                    b.setStyle(this._chatBox_sideBar2, "right", "190px");
                    this.getWindowFlags() & e.ui.BaseWindow.CONST.WINDOW_FLAG_MAX || (this.setWidth(this.getBodySize().width + 175), this._resizeController.setWidth(this.getSize().width))
                },
                onSideBarCollapse: function () {},
                setSideBarCollapse: function () {
                    b.hide(this._chatBox_sideBar);
                    b.setStyle(this._chatBox_chatBox_mainArea, "marginRight", "25px");
                    b.removeClass(this._chatBox_sideBar2, "chatBox_sideBar2_expand");
                    b.setStyle(this._chatBox_sideBar2, "width", "25px");
                    b.setStyle(this._chatBox_sideBar2, "right", "0");
                    if (!(this.getWindowFlags() & e.ui.BaseWindow.CONST.WINDOW_FLAG_MAX)) {
                        var a = this.getBodySize().width - 175;
                        a + 30 > this._minWidth && (this.setWidth(a), this._resizeController.setWidth(this.getSize().width))
                    }
                },
                stopPropagationAndSetCurrent: function (a) {
                    a.stopPropagation();
                    this.setCurrent()
                },
                stopPropagationAndSetCurrentWithoutFocus: function (a) {
                    a.stopPropagation();
                    this.setCurrentWithoutFocus()
                },
                focusEditor: function () {
                    this.editor && this.isShow() && this.editor.focus()
                },
                setFreeMode: function () {
                    var a = this.getBoxStatus();
                    if (a !== "max" && (a === "restore" || a === "min")) {
                        if (!this._freeX) this._freeX = this._x, this._freeY = this._y;
                        this.setX(this._freeX);
                        this.setY(this._freeY);
                        if (!e.isUndefined(this._freeHeight) || !e.isUndefined(this._freeWidth)) this.setHeight(this._freeHeight),
                        this.setWidth(this._freeWidth);
                        this.resize();
                        this.enableDrag()
                    }
                    this === d.getCurrent() && (e.out("1: " + a), this.show(), e.out("2: " + a))
                },
                setAdsorbMode: function () {
                    this !== d.getCurrent() && this.min();
                    var a = this.getBoxStatus();
                    if (a !== "max" && (a === "restore" || a === "min")) {
                        this.disableDrag();
                        this._freeX = this._x;
                        this._freeY = this._y;
                        this._freeWidth = this._restoreWidth;
                        this._freeHeight = this._restoreHeight;
                        if (!e.isUndefined(this._adsorbHeight) || !e.isUndefined(this._adsorbHeight)) this.setWidth(this._adsorbWidth), this.subMode != 1 && this.setHeight(this._adsorbHeight);
                        this.resize();
                        this.autoAlign()
                    }
                },
                clearChatLog: function () {
                    this._chatBox_msgList.innerHTML = ""
                },
                checkInput: function () {
                    this.editor.isEnable() && this.editor.save();
                    var a = this.editor.getText(),
                        b = e.string.byteLength(a);
                    if (b == 0 || a == "\n") return this.tips("\u63d0\u793a\uff1a\u6d88\u606f\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a\uff0c\u8bf7\u8f93\u5165\u5185\u5bb9"), !1;
                    else if (b > 15E3) return this.appendErrorMsg("\u53d1\u9001\u6d88\u606f\u5185\u5bb9\u8d85\u957f\uff0c\u8bf7\u5206\u6761\u53d1\u9001\u3002"), !1;
                    a = (new Date).getTime();
                    if (this._lastTime && a - this._lastTime < 1E3) return this.tips("\u63d0\u793a\uff1a\u60a8\u53d1\u9001\u6d88\u606f\u7684\u9891\u7387\u8fc7\u5feb\uff0c\u8bf7\u7a0d\u540e\u53d1\u9001"), !1;
                    this._lastTime = a;
                    this.closeTips();
                    return !0
                },
                closeTips: function () {
                    if (this._isShowTips) this._timer && clearTimeout(this._timer), this._isShowTips = !1, e.browser.ie && e.browser.ie < 8 ? (e.out("inputAndTipsHeight2: " + i.inputAndTipsHeight), c.notifyObservers(this, "resize")) : b.setStyle(this._chatBox_msgList, "bottom", "0px"), b.hide(this._yellowTipsBar)
                },
                tips: function (a) {
                    this._yellowTipsBar.innerHTML = e.string.encodeHtmlSimple(a);
                    this._isShowTips && this._timer && clearTimeout(this._timer);
                    this._isShowTips = !0;
                    e.browser.ie && e.browser.ie < 8 ? (e.out("inputAndTipsHeight1: " + i.inputAndTipsHeight), c.notifyObservers(this, "resize")) : b.setStyle(this._chatBox_msgList, "bottom", i.tipsHeight + "px");
                    b.show(this._yellowTipsBar);
                    this._timer = window.setTimeout(e.bind(this.closeTips, this), 3E3)
                },
                resize: function () {
                    if (e.browser.ie && e.browser.ie < 8) {
                        var a = this.getBodySize().height,
                            c = a - i.inputAndTipsHeight;
                        if (c < i.tipsHeight) c = i.tipsHeight;
                        var d = c;
                        this._isShowTips && (d = c - i.tipsHeight);
                        b.setStyle(this._chatBox_chatBoard, "height", c + "px");
                        b.setStyle(this._chatBox_msgList, "height", d + "px");
                        if (this.chatBoxType == "group") {
                            c = a - i.groupSpaceHeight;
                            if (c < i.groupMemberTitleBarHeight) c = i.groupMemberTitleBarHeight;
                            b.setStyle(this._chatBox_groupMember, "height", c + "px");
                            b.setStyle(this._chatBox_groupMember_mainArea, "height", c - i.groupMemberTitleBarHeight + "px")
                        }
                        if (this.chatBoxType == "discu") {
                            a -= e.browser.ie < 7 ? 3 : 10;
                            if (a < i.groupMemberTitleBarHeight) a = i.groupMemberTitleBarHeight;
                            b.setStyle(this._chatBox_discuMember, "height", a + "px");
                            b.setStyle(this._chatBox_discuMember_mainArea, "height", a - i.groupMemberTitleBarHeight + 7 + "px")
                        }
                    }
                },
                autoAlign: function () {
                    this.setBottom(3);
                    c.notifyObservers(d, "AutoAlign", this);
                    c.notifyObservers(this, "resize", this.getBodySize())
                },
                setHeight: function (a) {
                    var c;
                    c = this.option.hasOkButton ? 136 + a : 103 + a;
                    b.setStyle(this.body, "height", a + "px");
                    b.setStyle(this.container, "height", c + "px");
                    b.setStyle(this._window_outer, "height", c - 20 + "px");
                    this._bodyHeight = a;
                    this._height = c;
                    if (this.getBoxStatus() !== "max" && this.getBoxStatus() !== "fullscreen") this._restoreHeight = a
                },
                setTitleBarHeight: function (a) {
                    b.setStyle(this._titleBar, "height", a + "px");
                    b.setStyle(this._title, "height", a + "px");
                    b.setStyle(this._bodyOuter, "top", a + "px");
                    this._titleBarHeight = a
                },
                getChatMsgListLength: function () {
                    return this._chatBox_msgList ? this._chatBox_msgList.children.length : 0
                },
                checkMsgList: function () {
                    if (this._chatBox_msgList) {
                        var a = this._chatBox_msgList.children,
                            b = a.length - this._chatListRemainCount + 1;
                        if (b > 0) this._isOverRemainCount = !0;
                        for (; b-- > 0;) this._chatBox_msgList.removeChild(a[0])
                    }
                },
                changeUserMarkName: function (a) {
                    if (this.titleBarDom.mainName) this.titleBarDom.mainName.innerHTML = a.htmlShowName
                },
                appendMsg: function (a) {
                    var f, a = a.msgList;
                    this._isAutoScroll = !this._scrollChatAreaTimer && this._chatBox_msgList.scrollHeight - this._chatBox_msgList.scrollTop - this._chatBox_msgList.offsetHeight < 50 ? !0 : !1;
                    if (a[a.length - 1] && a[a.length - 1].from_uin == 0) this._isAutoScroll = !0;
                    e.out("\u3010\u8ffd\u52a0\u6d88\u606f\u6570\u3011\uff1a" + a + a.length);
                    for (var g = [], j = 0; j < a.length; j++) {
                        this.checkMsgList();
                        var k = [],
                            l = a[j];
                        f = document.createElement("dl");
                        var i = !1;
                        typeof l.attach != "undefined" && l.attach && (i = !0);
                        if (l.from_uin == 0) {
                            this.handShaking(1);
                            var h = EQQ.Model.BuddyList.getSelfUin(),
                                m = "";
                            f.className = "chatBox_myMsg";
                            var m = EQQ.util.translateChatMsg(l, !0),
                                n = EQQ.util.translateFontStyle(l.content[l.content.length - 1]),
                                o = l.sender.htmlShowName;
                            i && (o = this.getTitleIcon(l.attach));
                            l.type == "group" ? l.sender.usercard && l.sender.usercard[l.group_code] != void 0 ? (o = i ? o : l.sender.usercard[l.group_code].html, h = '<dt class="msgHead" title="' + l.sender.usercard[l.group_code].htmlAttribute + '">' + o + '<span style="margin-left:5px">' + l.time + '</span></dt>\t\t\t                \t<dd class="msgBody defaultFontStyle" style="' + n + '">' + m + "</dd>") : h = '<dt class="msgHead" title="' + l.sender.titleAllName + '">' + o + '<span style="margin-left:5px">' + l.time + '</span></dt>\t\t                  \t\t<dd class="msgBody defaultFontStyle" style="' + n + '">' + m + "</dd>" : h = '<dt class="msgHead" title="' + l.sender.titleAllName + '">' + o + '<span style="margin-left:5px">' + l.time + '</span></dt>\t\t            \t\t<dd class="msgBody defaultFontStyle" style="' + n + '">' + m + "</dd>";
                            alloy.portal.recoverCookie();
                            f.innerHTML = h;
                            this._chatBox_msgList.appendChild(f);
                            EQQ.Model.ChatMsg.saveHtmlMsg(this.uin, '<dl class="chatBox_myMsg">' + h + "</dl>");
                            h = h.replace(/_cface_[\d]{1,10}/g, function (a) {
                                k.push(a);
                                return a
                            });
                            i && this.parseSelfAttach(l.attach)
                        } else {
                            this.handShaking(2);
                            h = l.sender_uin;
                            l.sender = l.sender || EQQ.Model.BuddyList.getUserByUin(h);
                            g.push(String(l.msg_id));
                            if (!l.sender) l.sender = {}, l.sender.uin = h, l.sender.htmlShowName = h, l.sender.titleAllName = h, e.out("\u544a\u8b66\uff1a\u600e\u4e48\u8fd8\u62ff\u4e0d\u5230\u9700\u8981\u7684\u6570\u636e\uff1f");
                            f.setAttribute("duin", h);
                            f.setAttribute("time", l.time);
                            f.className = "chatBox_buddyMsg";
                            m = "";
                            m = EQQ.util.translateChatMsg(l, !1);
                            o = l.sender.htmlShowName;
                            n = EQQ.util.translateFontStyle(l.content[0]);
                            i && (o = this.getTitleIcon(l.attach));
                            var p = "";
                            l.type == "group" ? (this.isGroupMemberReady != !0 && (this.updateNameUinList.push({
                                uin: h,
                                msg_id: l.msg_id
                            }), e.out("1111:" + h), p = 'id="updateNameId_' + l.group_code + "_" + h + "_" + l.msg_id + '"'), l.sender.usercard && l.sender.usercard[l.group_code] != void 0 ? (o = i ? o : l.sender.usercard[l.group_code].html, h = '<dt class="msgHead"><span ' + p + ' class="clickable" uin="' + h + '" title="' + l.sender.usercard[l.group_code].htmlAttribute + '">' + o + '</span><span style="margin-left:5px">' + l.time + '</span></dt>\t\t\t\t\t\t\t\t\t\t<dd class="msgBody defaultFontStyle" style="' + n + '">' + m + "</dd>") : h = l.sender_uin == 1E4 ? '<dt class="msgHead"><span ' + p + ' uin="' + h + '" title="' + l.sender.titleAllName + '">' + l.sender_uin + "(" + l.sender_uin + ')</span><span style="margin-left:5px">' + l.time + '</span></dt>\t\t\t\t\t\t\t\t<dd class="msgBody defaultFontStyle" style="' + n + '">' + m + "</dd>" : '<dt class="msgHead"><span ' + p + ' class="clickable" uin="' + h + '" title="' + l.sender.titleAllName + '">' + o + '</span><span style="margin-left:5px">' + l.time + '</span></dt>\t\t\t\t\t\t\t\t<dd class="msgBody defaultFontStyle" style="' + n + '">' + m + "</dd>") : h = l.type == "discu" ? '<dt class="msgHead"><span ' + p + ' class="clickable" uin="' + h + '" title="' + l.sender.titleAllName + '">' + o + '</span><span style="margin-left:5px">' + l.time + '</span></dt>\t\t\t\t\t\t\t\t<dd class="msgBody defaultFontStyle" style="' + n + '">' + m + "</dd>" : '<dt class="msgHead"><span ' + p + ' title="' + l.sender.titleAllName + '">' + o + '</span><span style="margin-left:5px">' + l.time + '</span></dt>\t\t\t\t\t\t\t<dd class="msgBody defaultFontStyle" style="' + n + '">' + m + "</dd>";
                            h = h.replace(/_cface_[\d]{1,10}/g,

                            function (a) {
                                k.push(a);
                                return a
                            });
                            alloy.portal.recoverCookie();
                            f.innerHTML = h;
                            this._chatBox_msgList.appendChild(f);
                            EQQ.Model.ChatMsg.saveHtmlMsg(this.uin, '<dl class="chatBox_buddyMsg">' + h + "</dl>");
                            e.out("\u3010\u6dfb\u52a0\u6d88\u606f\u3011\uff1a" + l.content);
                            var s = this,
                                r = function (a) {
                                    a.parentNode.removeChild(a.previousSibling);
                                    c.off(a, "load");
                                    c.off(a, "error");
                                    s.scrollToBottom()
                                };
                            f = function () {
                                r(this);
                                var a;
                                if (a = this.getAttribute("rdata")) switch (a) {
                                case "offpic":
                                    alloy.util.report2m(133168);
                                    break;
                                case "cface":
                                    alloy.util.report2m(133159);
                                    break;
                                case "image":
                                    alloy.util.report2m(133155)
                                }
                                alloy.rpcService.reportQstatic("Monitor|Group|getimg|Succeed")
                            };
                            h = function () {
                                r(this);
                                this.src = alloy.CONST.CDN_URL + "style/images/img_error.gif";
                                var a;
                                if (a = this.getAttribute("rdata")) switch (a) {
                                case "offpic":
                                    alloy.util.report2m(133169);
                                    break;
                                case "cface":
                                    alloy.util.report2m(133160);
                                    break;
                                case "image":
                                    alloy.util.report2m(133156)
                                }
                                alloy.rpcService.reportQstatic("Monitor|Group|getimg|Failed")
                            };
                            m = 0;
                            for (n = k.length; m < n; m++) if (o = b.id(k[m])) p = b.node("img", {
                                src: alloy.CONST.CDN_URL + "style/images/img_loading.gif"
                            }), b.setStyle(p, "width", "42px"), b.setStyle(p, "height", "42px"), o.parentNode.insertBefore(p, o), c.on(o, "load", f), c.on(o, "error", h);
                            i && this.parseAttach(l.sender_uin, l.attach)
                        }
                    }
                    c.notifyObservers(d, "MessageRead", g);
                    this._isAutoScroll && this.scrollToBottom()
                },
                _isAutoScroll: !1,
                _scrollChatAreaTimer: null,
                scrollToBottom: function () {
                    var a = this;
                    this._scrollChatAreaTimer && clearTimeout(this._scrollChatAreaTimer);
                    this._scrollChatAreaTimer = window.setTimeout(function () {
                        clearTimeout(a._scrollChatAreaTimer);
                        a._scrollChatAreaTimer = null;
                        a._chatBox_msgList && (a._chatBox_msgList.scrollTop = a._chatBox_msgList.scrollHeight)
                    }, 50)
                },
                setMaskButton: function (a) {
                    switch (a) {
                    case "0":
                        this._maskButton.className = "chatBox_acceptButton";
                        break;
                    case "1":
                        this._maskButton.className = "chatBox_maskButton";
                        break;
                    case "2":
                        this._maskButton.className = "chatBox_maskButton";
                        break;
                    default:
                        this._maskButton.className = "chatBox_maskButton"
                    }
                },
                setWarning: function (a, b, c, d) {
                    var d = d || !1,
                        e = "\u7fa4";
                    d && (e = "\u8ba8\u8bba\u7ec4");
                    var l = "";
                    switch (a) {
                    case "0":
                        pgvSendClick({
                            hottag: "web2qq.groupmask.toolbar.msgsetting.withalerts"
                        });
                        break;
                    case "1":
                        b == "0" ? l = '<span class="warnning_yellow">&nbsp;</span>\u60a8\u5f00\u542f\u4e86\u5c4f\u853d\u6d88\u606f(\u63a5\u6536\u4e0d\u63d0\u793a\u6d88\u606f)\u529f\u80fd\uff0c\u8be5\u63d0\u793a\u4ec5\u672c\u4eba\u53ef\u89c1\u3002' : b == "2" && (l = '<span class="warnning_yellow">&nbsp;</span>\u60a8\u5207\u6362\u5230\u5c4f\u853d\u6d88\u606f(\u63a5\u6536\u4e0d\u63d0\u793a\u6d88\u606f)\u529f\u80fd\uff0c\u8be5\u63d0\u793a\u4ec5\u672c\u4eba\u53ef\u89c1\u3002');
                        this.addWarning(l);
                        pgvSendClick({
                            hottag: "web2qq.groupmask.toolbar.msgsetting.withoutalerts"
                        });
                        break;
                    case "2":
                        b == "0" ? l = '<span class="warnning_yellow">&nbsp;</span>\u60a8\u5f00\u542f\u4e86\u5c4f\u853d\u6d88\u606f(\u5b8c\u5168\u963b\u6b62' + e + "\u6d88\u606f)\u529f\u80fd\uff0c\u8be5\u63d0\u793a\u4ec5\u672c\u4eba\u53ef\u89c1\u3002" : b == "1" && (l = '<span class="warnning_yellow">&nbsp;</span>\u60a8\u5207\u6362\u5230\u5c4f\u853d\u6d88\u606f(\u5b8c\u5168\u963b\u6b62' + e + "\u6d88\u606f)\u529f\u80fd\uff0c\u8be5\u63d0\u793a\u4ec5\u672c\u4eba\u53ef\u89c1\u3002"), this.addWarning(l), pgvSendClick({
                            hottag: "web2qq.groupmask.toolbar.msgsetting.block"
                        })
                    }!d && c != "0" && this.addWarning('<span class="warnning_green">&nbsp;</span>\u60a8\u7684\u8bbe\u7f6e\u4ec5\u5728' + e + "\u6d88\u606f\u8bbe\u7f6e\u4e3a[\u4f7f\u7528" + e + "\u81ea\u8eab\u7684\u6d88\u606f\u8bbe\u7f6e]\u4e0b\u751f\u6548\uff01")
                },
                addWarning: function (a) {
                    e.out(a);
                    var b = document.createElement("dl");
                    b.className = "chatBox_buddyMsg";
                    a = '<dt class="msgHead" >' + this.toLocaleTimeString(new Date) + '</dt>\t\t\t\t\t\t<dd class="msgBody defaultFontStyle">' + a + "</dd>";
                    b.innerHTML = a;
                    this._chatBox_msgList.appendChild(b);
                    EQQ.Model.ChatMsg.saveHtmlMsg(this.uin, '<dl class="chatBox_buddyMsg">' + a + "</dl>");
                    this.scrollToBottom()
                },
                addSendMsgErr: function (a) {
                    var f = EQQ.util.transResendMsg(a.cbParam),
                        f = this.appendErrorMsg("\u53ef\u80fd\u7531\u4e8e\u7f51\u7edc\u539f\u56e0\uff0c\u201c" + f + '\u201d\u7684\u6d88\u606f\u53d1\u9001\u5931\u8d25\uff0c\u8bf7\u91cd\u65b0<a class="reSend" href="#">\u53d1\u9001</a>\u3002'),
                        f = b.mini("a.reSend", f)[0];
                    c.on(f, "click", function (f) {
                        f.preventDefault();
                        c.off(this, "click");
                        b.addClass(this, "clickdisable");
                        a.callback.apply(EQQ.RPCService, [a.cbParam])
                    })
                },
                appendErrorMsg: function (a) {
                    var b = document.createElement("dl");
                    b.className = "chatBox_buddyMsg error_tips";
                    a = '<dt class="msgHead" >' + this.toLocaleTimeString(new Date) + '</dt>\t\t\t\t\t\t<dd class="msgBody defaultFontStyle"><span class="icon_error">&nbsp;</span>' + a + "</dd>";
                    b.innerHTML = a;
                    this._chatBox_msgList.appendChild(b);
                    this.scrollToBottom();
                    return b
                },
                toLocaleTimeString: function (a) {
                    e.isNumber(a) && (a *= 1E3);
                    var b = new Date(a),
                        c = b.getFullYear(),
                        d = b.getMonth() + 1,
                        b = b.getDate();
                    return c.toString() + "-" + (d > 9 ? d : "0" + d) + "-" + (b > 9 ? b : "0" + b) + " " + (new Date(a)).toLocaleTimeString()
                },
                parseAttach: function (a, f) {
                    if (!f) return !1;
                    if (f.type !== "sendfile") if (f.isread === !1) {
                        var e = a + "_" + f.session_id,
                            j = b.id("agree_" + e);
                        if (j) c.on(j, "click", function (a) {
                            a.preventDefault();
                            qqweb.portal.recoverCookie();
                            c.notifyObservers(d, "agreeReceive", e)
                        });
                        if (j = b.id("refuse_" + e)) c.on(j, "click", function (a) {
                            a.preventDefault();
                            c.notifyObservers(d, "refuseReceive", e)
                        })
                    } else if (f.isCvideo == !0) {
                        var j = b.id("video_" + f.from_uin + "_" + f.msg_id),
                            k = f.from_uin;
                        if (j) c.on(j, "click", function (a) {
                            a.preventDefault();
                            qqweb.portal.recoverCookie();
                            qqweb.util.report2im("mining|c2w|click|invite");
                            c.notifyObservers(EQQ.Presenter.MainPanel, "AskVideo", {
                                uin: k
                            })
                        })
                    } else if (f.type === "offfile") {
                        e = a + "_" + f.msg_id;
                        if (j = b.id("agree_" + e)) c.on(j, "click", function (a) {
                            a.preventDefault();
                            qqweb.portal.recoverCookie();
                            f.fileid = e;
                            c.notifyObservers(d, "AgreeOffFile", f)
                        });
                        if (j = b.id("refuse_" + e)) c.on(j, "click", function (a) {
                            a.preventDefault();
                            f.fileid = e;
                            c.notifyObservers(d, "RefuseOffFile", f)
                        });
                        if (j = b.id("next_" + e)) c.on(j, "click", function (a) {
                            a.preventDefault();
                            f.fileid = e;
                            c.notifyObservers(d, "NextOffFile", f)
                        })
                    }
                },
                parseSelfAttach: function (a) {
                    if (a.type === "uploadingofffile") {
                        var f = b.id("cancal_uploadOffFile_" + a.ts);
                        if (f) c.on(f, "click", function (b) {
                            b.preventDefault();
                            c.notifyObservers(d, "CancelOffFile", a)
                        });
                        d.getOffFileUploadState() && c.notifyObservers(d, "CancelOffFile", a)
                    }
                },
                getTitleIcon: function (a) {
                    if (a.type) return a.type === "agfile" || a.type === "sendofffile" || a.type === "notifyagreeofffile" ? '<span class="icon_green">&nbsp;</span>' : a.type === "rffile" || a.type === "rtfile" || a.type === "wrffile" || a.type === "sendofffileerror" || a.type === "refuseofffile" || a.type === "notifyrefuseofffile" || a.type === "canceloffupload" ? '<span class="icon_red">&nbsp;</span>' : a.type === "shake" ? a.icon === "warning" ? '<span class="icon_blue">&nbsp;</span>' : '<span class="icon_green">&nbsp;</span>' : '<span class="icon_yellow">&nbsp;</span>'
                },
                setMoreMsgList: function (a) {
                    if (a.retcode != 0) return e.error("\u62c9\u53d6\u66f4\u591a\u8bb0\u5f55\u5931\u8d25:retcode:" + a.retcode), !1;
                    var d = this.group,
                        g = [],
                        j;
                    for (j in d.members) g[d.members[j].uin] = d.members[j].usercard;
                    d = a.data || {};
                    a.data.cl = a.data.cl || [];
                    var k = a.data.cl.length || 0,
                        l = "",
                        a = 0;
                    j = qqweb.portal.getPortalSelf("uin");
                    for (k -= 1; k >= 0; k--) {
                        for (var h = d.cl[k], i = this.toLocaleTimeString(h.t), l = "", m = 0; m < h.il.length; m++) {
                            var n = h.il[m];
                            n.t == 0 ? l += EQQ.util.transUrl(e.string.encodeHtml(EQQ.util.transUrl(n.v || "", 1)), 2) : n.t == 1 ? l += '<img src="' + EQQ.CONST.SYSTEM_FACE_URL + e.string.encodeHtml(n.v) + '.gif" />' : n.t == 2 && (a++, n = "http://qun.qq.com/cgi/svr/chatimg/get?pic=" + e.string.encodeHtml(n.v) + "&gid=" + h.g + "&time=" + h.t, l += '<img style="display:none" class="clImg" src="' + n + '" />')
                        }
                        l = '<dt class="msgHead">\t\t\t\t\t\t\t\t<span class="clickable" uin="' + h.u + '" title="' + (g[h.u] || h.u) + '">' + (g[h.u] || h.u) + '</span>\t\t\t\t\t\t\t\t<span style="margin-left:5px">' + i + '</span>\t\t\t\t\t\t\t</dt>\t\t\t\t\t\t\t<dd class="msgBody defaultFontStyle" >' + l + "</dd>";
                        m = document.createElement("dl");
                        m.className = h.u == j ? "chatBox_myMsg" : "chatBox_buddyMsg";
                        h.u == j ? m.className = "chatBox_myMsg" : (m.className = "chatBox_buddyMsg", m.setAttribute("duin", h.u), m.setAttribute("time", i));
                        m.innerHTML = l;
                        this._chatBox_msgList.insertBefore(m, this._chatBox_msgList.firstChild)
                    }
                    var o = function (a) {
                        a.parentNode.removeChild(a.previousSibling);
                        c.off(a, "load");
                        c.off(a, "error");
                        b.show(a)
                    }, g = function () {
                        o(this)
                    }, d = function () {
                        o(this);
                        this.src = alloy.CONST.CDN_URL + "style/images/img_error.gif"
                    }, a = b.mini(".clImg", this._chatBox_msgList);
                    j = 0;
                    for (k = a.length; j < k; j++) if (h = a[j]) i = b.node("img", {
                        src: alloy.CONST.CDN_URL + "style/images/img_loading.gif"
                    }),
                    b.setStyle(i, "width", "42px"), b.setStyle(i, "height", "42px"), h.parentNode.insertBefore(i, h), c.on(h, "load", g), c.on(h, "error", d);
                    var p = this;
                    setTimeout(function () {
                        p._chatListRemainCount = 50 + p._viewMoreClickCount * 3
                    }, 3E4)
                },
                _isSaking: !1,
                shake: function () {
                    var a = this;
                    if (a._isSaking) return !1;
                    else {
                        if (!a.shakeBeater) {
                            var b = a.shakeBeater = new e.fx.Beater({
                                duration: 30,
                                loop: 0
                            }),
                                d = 0,
                                j;
                            c.addObserver(b, "beater", function () {
                                a.setX(j + Math.sin(d / 180 * Math.PI) * 3);
                                (d += 60) > 1800 && b.end()
                            });
                            c.addObserver(b, "start", function () {
                                d = 0;
                                j = a.getX();
                                a.getY();
                                a._isSaking = !0
                            });
                            c.addObserver(b, "end", function () {
                                a.setX(j);
                                a._isSaking = !1
                            })
                        }
                        a.shakeBeater.start();
                        return !0
                    }
                }
            });
        i.groupMemberTitleBarHeight = 20;
        i.tipsHeight = 25;
        i.inputAndTipsHeight = 140;
        i.groupSpaceHeight = 0;
        this.BaseChatBox = i;
        var G = new e.Class({
            extend: this.BaseChatBox
        }, {
            init: function (a) {
                var b = this;
                this._adsorbWidth = 300;
                this._adsorbHeight = 291;
                this.user = a.userOrGroup;
                this.uin = this.user.uin;
                this.setUserTitleBar();
                this.callSuper = function (a) {
                    var c = Array.prototype.slice,
                        d = c.call(arguments,
                        1);
                    G.superClass[a].apply(b, d.concat(c.call(arguments)))
                };
                a = this.parseOption(a);
                this.callSuper("init", a);
                this.bindUserTitleBarDom()
            },
            initFrame: function () {
                var a = this;
                G.superClass.initFrame.apply(this);
                c.addObserver(this.editor, "Typing", function (b) {
                    a.onTyping(b)
                });
                this.typing_show = this.typing = null
            },
            onTyping: function (a) {
                if (a.keyCode != 13 && this.handshake == 3 && !this.typing) {
                    var b = this;
                    this.typing = setTimeout(function () {
                        clearTimeout(b.typing);
                        b.typing = null
                    }, 5E3);
                    c.notifyObservers(d, "Typing", this.uin)
                }
            },
            showTyping: function () {
                var a = this;
                if (this.typing_show) clearTimeout(this.typing_show), this.typing_show = null;
                var c = b.id("chatBox_typing_" + this.uin),
                    d = b.id("typingInChatbox_" + this.uin);
                if (c && d) b.setStyle(c, "display", "inline"), b.show(d), this.typing_show = setTimeout(function () {
                    c && d && (b.setStyle(c, "display", "none"), b.hide(d));
                    clearTimeout(a.typing_show);
                    a.typing_show = null
                }, 7E3)
            },
            hideTyping: function () {
                if (this.typing_show) clearTimeout(this.typing_show), this.typing_show = null;
                var a = b.id("chatBox_typing_" + this.uin),
                    c = b.id("typingInChatbox_" + this.uin);
                a && c && (b.setStyle(a, "display", "none"), b.hide(c))
            },
            initSideBar: function () {
                this._chatBox_sideBar2 = b.id("chatBox_sideBar2_" + this.uin);
                b.hide(this._chatBox_sideBar2)
            },
            setUserTitleBar: function () {
                var a = this.user,
                    b = '<img class="avatarInChatbox" src="' + EQQ.getUserAvatar(a.uin) + '" /><div class="stateInChatbox"></div>                <div id="typingInChatbox_' + this.uin + '" class="typingInChatbox"><img title="typing" src="http://0.web.qstatic.com/webqqpic/pubapps/0/50/images/typing.gif" /></div>';
                this.setTitleBarAvatar(b);
                var c = b = "",
                    d = EQQ.hash.clientType[a.clientType || "10000"],
                    h = EQQ.hash.clientTypeText[a.clientType || "10000"],
                    h = EQQ.hash.clientTypeText2readableText[h] || h;
                this.user.type !== "stranger" && (b = " - \u4f7f\u7528" + h + '\u4e2d"', c = "\u4f7f\u7528" + h + "\u4e2d]");
                b = e.string.template(o.userChatBoxTitleBarName, {
                    uin: a.uin,
                    titleAllName: a.titleAllName,
                    htmlShowName: a.htmlShowName,
                    clientType: d,
                    clientTypeTips: b,
                    clientTypeTitle: c
                });
                this.setTitleBarName(b);
                b = e.string.template(o.userChatBoxTitleBarInfo, {
                    uin: a.uin
                });
                this.setTitleBarInfo(b)
            },
            bindUserTitleBarDom: function () {
                b.addClass(this.titleBarDom.avatarArea, this.user.state + "BuddyInChatbox");
                EQQ.hash.clientType[this.user.clientType || "10000"] == "PC" && b.hide(b.id("chatBox_clientTypeAll_" + this.uin));
                this.titleBarDom.allName = b.id("chatBox_allName_" + this.uin);
                this.titleBarDom.mainName = b.id("chatBox_mainName_" + this.uin);
                this.titleBarDom.qzoneIcon = b.id("EQQ_chatboxQzoneIcon_" + this.uin);
                this.titleBarDom.signature = b.id("chatBox_signature_" + this.uin);
                var a = this,
                    d = this.titleBarDom;
                c.on(d.avatarArea, "mouseover", m);
                c.on(d.avatarArea, "mouseout", r);
                c.on(d.allName, "click", v);
                c.on(d.allName, "mousedown", e.bind(this.stopPropagationAndSetCurrentWithoutFocus, this));
                c.on(d.qzoneIcon, "mousedown", function (b) {
                    a.stopPropagationAndSetCurrentWithoutFocus.apply(this, [b]);
                    pgvSendClick({
                        hottag: "web2qq.c2cmask.titlebar.qzone"
                    })
                });
                c.on(d.qzoneIcon, "click", {
                    onQzoneIconClick: function (a) {
                        a.preventDefault();
                        var b = this.getAttribute("href"),
                            c = /\d+/,
                            a = parseInt(b.match(c)[0]);
                        alloy.rpcService.sendGetFriendUin2(a, 2, function (a) {
                            alloy.portal.runApp("6", {
                                url: b.replace(c, a.result.account)
                            })
                        });
                        alloy.util.report2qqweb("singlemask|titlebar|qzone")
                    }
                }.onQzoneIconClick);
                c.on(d.signature, "mousedown", e.bind(this.stopPropagationAndSetCurrentWithoutFocus, this));
                c.on(d.signature, "dblclick", e.bind(this.stopPropagationAndSetCurrentWithoutFocus, this));
                c.on(d.avatarArea, "click", function (a) {
                    a.preventDefault();
                    a.stopPropagation();
                    alloy.util.report2qqweb("groupmask|titlebar|name")
                })
            },
            initToolBar: function () {
                this.setSendPicForm(e.string.template(o.userSendPicFrom, {
                    uin: this.uin
                }));
                G.superClass.initToolBar.apply(this)
            },
            createToolBarDom: function () {
                G.superClass.createToolBarDom.apply(this);
                this._selSendPic = b.id("offline_pic_" + this.uin);
                b.hide(this._maskButtonCon);
                c.on(this._createDiscuButton, "click", e.bind(this.onCreateDiscu, this))
            },
            updateUserState: function (a) {
                b.setClass(this.titleBarDom.avatarArea, a + "BuddyInChatbox");
                this.titleBarDom.avatarArea.title = EQQ.hash.onlineStatusText[a].toString()
            },
            updateUserInfo: function (a) {
                this.titleBarDom.mainName.title = a.nick;
                this.titleBarDom.mainName.innerHTML = a.nick
            },
            beforeClose: function () {
                return this.videoWin ? !1 : !0
            },
            close: function () {
                var a = this;
                this.videoWin ? alloy.layout.confirm("\u5173\u95ed\u89c6\u9891\u7a97\u53e3\u5c06\u4f1a\u4e2d\u6b62\u89c6\u9891\u901a\u8bdd\uff0c\u662f\u5426\u5173\u95ed\uff1f", function () {
                    c.notifyObservers(a, "close", a);
                    a.destroy()
                }, {
                    windowType: "EqqWindow"
                }) : (c.notifyObservers(this, "close", this), this.destroy())
            },
            onCreateDiscu: function (a) {
                a.preventDefault();
                var a = [],
                    b = EQQ.Model.BuddyList.getUserByUin(this.uin);
                a.push({
                    uin: b.uin,
                    nick: b.htmlShowName
                });
                alloy.portal.runApp("selectBuddy", {
                    title: "\u521b\u5efa\u8ba8\u8bba\u7ec4",
                    windowType: "EqqWindow",
                    isAddSelf: !0,
                    maxBuddy: 20,
                    initList: a,
                    onSelected: EQQ.Model.BuddyList.createDiscu
                });
                alloy.util.report2qqweb("singlemask|bigtoolbar|creatdicussion")
            }
        });
        this.UserChatBox = G;
        var C = new e.Class({
            extend: this.BaseChatBox
        }, {
            init: function (a) {
                var b = this;
                this._adsorbWidth = 300;
                this._adsorbHeight = 291;
                this.group = a.userOrGroup;
                this.code = this.group.code;
                this.uin = this.gid = this.group.gid;
                this.updateNameUinList = [];
                this.setGroupTitleBar();
                this.callSuper = function (a) {
                    var c = Array.prototype.slice,
                        d = c.call(arguments, 1);
                    C.superClass[a].apply(b, d.concat(c.call(arguments)))
                };
                a = this.parseOption(a);
                this.callSuper("init", a);
                this.bindGroupTitleBarDom()
            },
            initFrame: function () {
                C.superClass.initFrame.apply(this)
            },
            setGroupTitleBar: function () {
                var a = this.group,
                    b = '<img class="chatBox_groupAvatar" src="' + EQQ.getGroupAvatar(a.code) + '" /><div class="chatBox_groupType"></div>';
                this.setTitleBarAvatar(b);
                b = e.string.template(o.groupChatBoxTitleBarName, {
                    gid: a.gid,
                    code: a.code,
                    titleAllName: a.titleAllName,
                    titleTypeText: a.titleTypeText,
                    htmlShowName: a.htmlShowName
                });
                this.setTitleBarName(b);
                var b = a.level || 0,
                    c = "\u70b9\u4eae\u7687\u51a0";
                parseInt(a.level) > 0 && (c = a.level + "\u7ea7\u7687\u51a0QQ\u7fa4");
                b = e.string.template(o.groupChatBoxTitleBarInfo, {
                    gid: a.gid,
                    code: a.code,
                    level: b,
                    levelTitle: c
                });
                this.setTitleBarInfo(b)
            },
            bindGroupTitleBarDom: function () {
                this.titleBarDom.allName = b.id("chatBox_allName_" + this.gid);
                this.titleBarDom.spaceIcon = b.id("EQQ_chatboxGspaceIcon_" + this.gid);
                this.titleBarDom.announcement = b.id("chatBox_announcement_" + this.gid);
                var a = this.titleBarDom;
                c.on(a.spaceIcon, "mousedown", e.bind(this.stopPropagationAndSetCurrentWithoutFocus, this));
                c.on(a.spaceIcon, "click", t(alloy.util.observer.openInWebBrowser, "web2qq.groupmask.titlebar"));
                c.on(a.spaceIcon, "click", function () {
                    alloy.util.report2qqweb("groupmask|titlebar|level")
                });
                c.on(a.allName, "mousedown", e.bind(this.stopPropagationAndSetCurrentWithoutFocus, this));
                c.on(a.allName, "click", w);
                c.on(a.announcement, "mousedown",
                e.bind(this.stopPropagationAndSetCurrentWithoutFocus, this));
                c.on(a.announcement, "dblclick", e.bind(this.stopPropagationAndSetCurrentWithoutFocus, this));
                c.on(a.announcement, "click", t(alloy.util.observer.openInWebBrowser, "web2qq.groupmask.titlebar"));
                c.on(a.announcement, "click", function () {
                    alloy.util.report2qqweb("groupmask|titlebar|updates")
                })
            },
            initTitleBar: function () {
                C.superClass.initTitleBar.apply(this);
                var a = b.node("a", {
                    title: "\u7fa4\u5171\u4eab",
                    hidefocus: "true",
                    href: "http://qun.qq.com/air/#" + this.code + "/share"
                });
                a.innerHTML = '<span class="chatBox_groupShareButton"></span>';
                var d = b.node("a", {
                    title: "\u7fa4\u76f8\u518c",
                    hidefocus: "true",
                    href: "http://qun.qq.com/air/#" + this.code + "/impress"
                });
                d.innerHTML = '<span class="chatBox_groupImpressButton"></span>';
                var g = b.node("a", {
                    title: "\u7fa4\u793e\u533a",
                    hidefocus: "true",
                    href: "http://qun.qq.com/air/#" + this.code
                });
                g.innerHTML = '<span class="chatBox_groupHomeButton"></span>';
                var j = b.node("a", {
                    title: "\u7fa4\u8bbe\u7f6e",
                    hidefocus: "true",
                    href: "###",
                    "class": "chatBox_menuButton"
                });
                j.innerHTML = '<span class="chatBox_groupSettingButton"></span><div class="chatBox_Down"></div>';
                this.titleBarDom.buttonBar.appendChild(g);
                this.titleBarDom.buttonBar.appendChild(a);
                this.titleBarDom.buttonBar.appendChild(d);
                this.titleBarDom.buttonBar.appendChild(b.id("chatBox_createDiscuButton_" + this.uin));
                this.titleBarDom.buttonBar.appendChild(j);
                c.on(a, "click", t(qqweb.util.observer.openInWebBrowser, "web2qq.groupmask.buttonbar.share"));
                c.on(d, "click", t(qqweb.util.observer.openInWebBrowser, "web2qq.groupmask.buttonbar.impress"));
                c.on(g, "click", t(qqweb.util.observer.openInWebBrowser, "web2qq.groupmask.buttonbar.home"));
                c.on(a, "click", function () {
                    alloy.util.report2qqweb("groupmask|bigtoolbar|share")
                });
                c.on(d, "click", function () {
                    alloy.util.report2qqweb("groupmask|bigtoolbar|impress")
                });
                c.on(g, "click", function () {
                    alloy.util.report2qqweb("groupmask|bigtoolbar|community")
                });
                this._settingButton = j;
                c.on(j, "click", e.bind(this.onSettingButtonClick, this));
                c.on(j, "click", function () {
                    alloy.util.report2qqweb("groupmask|bigtoolbar|setting")
                });
                a = b.node("div", {
                    id: "chatBox_settingPanel_" + this.gid,
                    "class": "settingPanel"
                });
                n.appendChild(a);
                this.settingPanel = new alloy.layout.PopupBox({
                    container: a,
                    html: ' <a id="chatBox_settingMenu_groupDetail_' + this.gid + '" href="###">\u67e5\u770b\u7fa4\u8d44\u6599</a>\t\t\t\t\t\t<a id="chatBox_settingMenu_groupCard_' + this.gid + '" href="###">\u4fee\u6539\u6211\u7684\u7fa4\u540d\u7247</a>\t\t\t\t\t\t<a id="chatBox_settingMenu_settingButton_' + this.gid + '" title="\u7fa4\u8bbe\u7f6e" hidefocus="true" href="' + EQQ.CONST.QQ_GROUP_URL + this.code + '/admin">\u7fa4\u8bbe\u7f6e</a>'
                });
                this._chatBox_groupDetailButton = b.id("chatBox_settingMenu_groupDetail_" + this.gid);
                c.on(this._chatBox_groupDetailButton, "click", x);
                c.on(a.children[1], "click", s);
                this._chatBox_groupSettingButton = b.id("chatBox_settingMenu_settingButton_" + this.gid);
                b.hide(this._chatBox_groupSettingButton);
                c.on(this._chatBox_groupSettingButton, "click", t(qqweb.util.observer.openInWebBrowser, "web2qq.settingmenu.setting"))
            },
            onSettingButtonClick: function (a) {
                a.preventDefault();
                a.stopPropagation();
                a = b.getClientXY(this._settingButton);
                this.settingPanel.setXY(a[0], a[1] + 36);
                this.settingPanel.setZIndex(alloy.layout.getTopZIndex(3));
                this.settingPanel.show()
            },
            initToolBar: function () {
                this.setSendPicForm(e.string.template(o.groupSendPicFrom, {
                    gid: this.group.gid
                }));
                C.superClass.initToolBar.apply(this)
            },
            createToolBarDom: function () {
                C.superClass.createToolBarDom.apply(this);
                this._selSendPic = b.id("custom_face_" + this.gid);
                this.setMaskButton(this.group.mask);
                b.hide(this._fileSendFormCon);
                b.hide(this._videoButton);
                b.hide(this._shakeButton);
                c.on(this._createDiscuButton, "click", e.bind(this.onCreateDiscu, this))
            },
            createSideBarDom: function () {
                var a = {
                    gid: this.gid,
                    code: this.code
                }, d = e.string.template(o.groupSideBarUnfold, a);
                this._chatBox_sideBar.innerHTML = d;
                d = e.string.template(o.groupSideBarFold, a);
                this._chatBox_sideBar2.innerHTML = d;
                this._chatBox_sidebar_trigger = b.id("chatBox_sideBar_trigger_" + this.uin);
                this._chatBox_sidebar_trigger_member_count = b.id("chatBox_sideBar2_online_member_count_" + this.uin);
                this._chatBox_groupMember = b.id("chatBox_groupMember_" + this.uin);
                this._chatBox_groupMember_onlineCount = b.id("chatBox_groupMember_onlineCount_" + this.uin);
                this._chatBox_groupMember_count = b.id("chatBox_groupMember_count_" + this.uin);
                this._chatBox_groupMember_mainArea = b.id("chatBox_groupMember_mainArea_" + this.uin);
                e.platform.iPad && new e.ui.TouchScroller(this._chatBox_groupMember_mainArea);
                this._chatBox_groupMember_callmeArea = b.id("chatBox_" + this.uin + "_groupMember_callmeArea");
                this._chatBox_groupMember_onlineArea = b.id("chatBox_" + this.uin + "_groupMember_onlineArea");
                this._chatBox_groupMember_busyArea = b.id("chatBox_" + this.uin + "_groupMember_busyArea");
                this._chatBox_groupMember_awayArea = b.id("chatBox_" + this.uin + "_groupMember_awayArea");
                this._chatBox_groupMember_silentArea = b.id("chatBox_" + this.uin + "_groupMember_silentArea");
                this._chatBox_groupMember_hiddenArea = b.id("chatBox_" + this.uin + "_groupMember_hiddenArea");
                this._chatBox_groupMember_offlineArea = b.id("chatBox_" + this.uin + "_groupMember_offlineArea");
                this.onListScrollTimer = null;
                this.delaySendGetGroupNewestState();
                c.on(this._chatBox_groupMember_mainArea, "click", p);
                c.on(this._chatBox_msgList, "click", p);
                c.on(this._chatBox_groupMember_mainArea, "scroll", e.bind(this.onListScroll, this));
                this.setSideBarCollapse()
            },
            onSideBarExpand: function () {
                this.updateMembers()
            },
            onSideBarCollapse: function () {
                this.clearMembersListBox()
            },
            isExpandSidebar: function () {
                return this._isExpandSidebar
            },
            delaySendGetGroupNewestState: function (a) {
                a ? (a = 9E5 - (a - this.delayLoadStatsTimeStamp), a < 0 ? (this.delayLoadStatsFlag && clearTimeout(this.delayLoadStatsFlag), this.delayLoadStatsFlag = null, this.sendGetGroupNewestState(), this.delayLoadStatsFlag = setTimeout(e.bind(this.sendGetGroupNewestState, this), 9E5), this.delayLoadStatsTimeStamp = (new Date).getTime()) : (this.delayLoadStatsFlag && clearTimeout(this.delayLoadStatsFlag), this.delayLoadStatsFlag = setTimeout(e.bind(this.sendGetGroupNewestState, this), a))) : (this.delayLoadStatsFlag = setTimeout(e.bind(this.sendGetGroupNewestState, this), 9E5), this.delayLoadStatsTimeStamp = (new Date).getTime())
            },
            pauseDelaySendGetGroupNewestState: function () {
                this.delayLoadStatsFlag && clearTimeout(this.delayLoadStatsFlag);
                this.delayLoadStatsFlag = null
            },
            sendGetGroupNewestState: function () {
                c.notifyObservers(d, "SendGetGroupNewestState", this.code);
                this.pauseDelaySendGetGroupNewestState();
                this.delaySendGetGroupNewestState()
            },
            upateGroupTitle: function () {
                var a = this.group;
                this.titleBarDom.allName.title = a.titleAllName + " - " + a.titleTypeText;
                this.titleBarDom.allName.innerHTML = '<span class="chatBox_mainName">' + a.htmlShowName + "</span>";
                this.updateAnnouncement()
            },
            updateAnnouncement: function () {
                var a = e.string.toSingleLine(this.group.announcement).toString();
                this.titleBarDom.announcement.innerHTML = e.string.encodeHtmlSimple(a);
                this.titleBarDom.announcement.title = a;
                this.updateGroupLevel()
            },
            updateGroupLevel: function () {
                var a = this.group,
                    c = this.titleBarDom.spaceIcon;
                b.setClass(c, "EQQ_chatboxGspaceIcon");
                b.addClass(c, "EQQ_gspaceLevel_" + (a.level || 0));
                var d = "\u70b9\u4eae\u7687\u51a0";
                parseInt(a.level) > 0 && (d = a.level + "\u7ea7\u7687\u51a0QQ\u7fa4");
                c.title = d
            },
            loadGroupMemberAvatar: function () {
                for (var a = this.unloadAvatarList || [], c = this._chatBox_groupMember_mainArea, d = parseInt(b.getClientHeight(c), 10), c = b.getXY(c)[1], e = 0; e < a.length;) {
                    var h = a[e],
                        l = h.imgEl,
                        h = h.uin,
                        k = b.getXY(l)[1] - c;
                    l && k > 0 && k < d ? (l.src = EQQ.getUserAvatar(h), a.splice(e, 1)) : e++
                }
            },
            onListScroll: function () {
                if (this.onListScrollTimer) window.clearTimeout(this.onListScrollTimer), this.onListScrollTimer = null;
                this.onListScrollTimer = window.setTimeout(e.bind(this.loadGroupMemberAvatar, this), 500)
            },
            addMember: function (a, d) {
                var e, j, i = a,
                    l = i.usercard,
                    m = "";
                switch (i.flag) {
                case "master":
                    j = "(\u521b\u5efa\u8005)";
                    e = "groupMaster";
                    m = '<div title="\u521b\u5efa\u8005" class="groupMember_icon"></div>';
                    break;
                case "manager":
                    j = "(\u7ba1\u7406\u5458)";
                    e = "groupManager";
                    m = '<div title="\u7ba1\u7406\u5458" class="groupMember_icon"></div>';
                    break;
                case "common":
                    e = j = ""
                }
                i.info ? i = i.info : i.state = "offline";
                if (this.group && (j = "                    " + (m ? m : "") + '\t\t\t\t\t<div class="chatBox_groupMember_avatarArea">\t\t\t\t\t\t<img id="chatBox_group_' + this.group.code + "_Member_avatar_" + i.uin + '" class="chatBox_groupMember_avatar" src="' + EQQ.CONST.EQQ_SERVER_URL + 'style/images/avatar_default_20_20.gif" />\t\t\t\t\t\t<div class="chatBox_groupMember_state"></div>\t\t\t\t\t</div>\t\t\t\t\t<div class="chatBox_groupMember_nameArea" title="' + i.htmlAllName + (j ? " - " + j : "") + '">\t\t\t\t\t\t<div id="chatBox_groupMember_nick_' + this.group.gid + "_" + i.uin + '" class="chatBox_groupMember_nick ' + (i.vip ? "EQQ_Vip_Nick" : "") + '">' + l + "</div>\t\t\t\t\t</div>", e = b.node("div", {
                    id: "chatBox_groupMember_buddy_" + i.uin,
                    "class": "chatBox_groupMember_buddy " + e,
                    uin: i.uin
                }), e.innerHTML = j, this["_chatBox_groupMember_" + (d || i.state) + "Area"])) if (this["_chatBox_groupMember_" + (d || i.state) + "Area"].appendChild(e), b.show(this["_chatBox_groupMember_" + (d || i.state) + "Area"]), d || i.state != "offline" && this._groupMemberCount++, c.on(e, "mouseover", k), c.on(e, "mouseout", h), e = b.id("chatBox_group_" + this.group.code + "_Member_avatar_" + i.uin), d) e.src = EQQ.getUserAvatar(i.uin);
                else if (this.unloadAvatarList.push({
                    imgEl: e,
                    uin: i.uin
                }), this.unloadAvatarList.length < 9) e.src = EQQ.getUserAvatar(i.uin)
            },
            createMembersDom: function (a) {
                var b = this;
                e.timedChunk(a, this.addMember, this, !1, function () {
                    b.groupMemberReady()
                })
            },
            updateMembers: function () {
                this.isGroupMemberReady = !0;
                this.clearMembersListBox();
                this.unloadAvatarList = [];
                var a = this.group.members;
                if (this.isExpandSidebar()) this.createMembersDom(a);
                else if (this.group.onlineMemberCount > 0) this._chatBox_sidebar_trigger_member_count.innerHTML = this.group.onlineMemberCount;
                this._groupMemberCount = 0;
                this._chatBox_groupMember_count.innerHTML = a.length;
                this.updateUserNames()
            },
            updateUserNames: function () {
                e.out("updateNameUinList.length: " + this.updateNameUinList.length);
                for (var a = 0; a < this.updateNameUinList.length; a++) {
                    var c = this.updateNameUinList[a],
                        d = b.id("updateNameId_" + this.code + "_" + c.uin + "_" + c.msg_id),
                        j = EQQ.Model.BuddyList.getUserByUin(c.uin);
                    if (d && j) {
                        var h = j.usercard && j.usercard[this.code] != void 0 ? j.usercard[this.code].title : j.titleShowName;
                        d.innerHTML = j.usercard && j.usercard[this.code] != void 0 ? j.usercard[this.code].html : j.htmlShowName;
                        d.title = h;
                        e.out("updateNameId_" + this.code + "_" + c.uin + "_" + c.msg_id + ", " + a + ", " + d)
                    }
                }
            },
            updateUserName: function (a) {
                var c = a.uin,
                    a = b.id("chatBox_groupMember_nick_" + a.gid + "_" + c);
                if (typeof a == "undefined" || !a) return !1;
                var d = this.group.members,
                    e = {}, h;
                for (h in d) if (e = d[h], e.uin == c) {
                    a.innerHTML = e.usercard;
                    break
                }
            },
            close: function () {
                b.id("chatBox_settingPanel_" + this.gid) && n.removeChild(b.id("chatBox_settingPanel_" + this.gid));
                c.notifyObservers(this, "close", this);
                this.destroy()
            },
            updateMemberState: function (a) {
                if (a.length > 0) {
                    for (var c = {}, d = 0, e = this.group.members, d = 0; d < a.length; d++) if (b.id("chatBox_groupMember_buddy_" + a[d].uin)) {
                        var h = b.id("chatBox_groupMember_buddy_" + a[d].uin);
                        h.parentNode.removeChild(h);
                        h = null;
                        delete h;
                        c[a[d].uin] = a[d];
                        a[d].stat == 20 && this._groupMemberCount--
                    }
                    for (d = 0; d < e.length; d++) c[e[d].uin] && (c[e[d].uin].oldStat == 20 && this._groupMemberCount++, this.addMember(e[d], alloy.util.code2state(c[e[d].uin].stat)));
                    this.group.onlineMemberCount = this._groupMemberCount;
                    this._chatBox_groupMember_onlineCount.innerHTML = this._groupMemberCount;
                    if (this._groupMemberCount > 0) this._chatBox_sidebar_trigger_member_count.innerHTML = this._groupMemberCount
                }
            },
            groupMemberReady: function () {
                if (this.group) {
                    this.group.onlineMemberCount = this._groupMemberCount;
                    this._chatBox_groupMember_onlineCount.innerHTML = this._groupMemberCount;
                    if (this._groupMemberCount > 0) this._chatBox_sidebar_trigger_member_count.innerHTML = this._groupMemberCount;
                    this.loadGroupMemberAvatar()
                }
            },
            updateSettingButton: function () {
                this.group.hasManageAuthority ? (b.show(this._chatBox_groupSettingButton), this._chatBox_groupDetailButton.innerHTML = "\u67e5\u770b/\u4fee\u6539\u7fa4\u8d44\u6599") : (b.hide(this._chatBox_groupSettingButton), this._chatBox_groupDetailButton.innerHTML = "\u67e5\u770b\u7fa4\u8d44\u6599")
            },
            clearMembersListBox: function () {
                this._chatBox_groupMember_callmeArea.innerHTML = "";
                this._chatBox_groupMember_onlineArea.innerHTML = "";
                this._chatBox_groupMember_busyArea.innerHTML = "";
                this._chatBox_groupMember_awayArea.innerHTML = "";
                this._chatBox_groupMember_silentArea.innerHTML = "";
                this._chatBox_groupMember_hiddenArea.innerHTML = "";
                this._chatBox_groupMember_offlineArea.innerHTML = "";
                b.hide(this._chatBox_groupMember_callmeArea);
                b.hide(this._chatBox_groupMember_onlineArea);
                b.hide(this._chatBox_groupMember_busyArea);
                b.hide(this._chatBox_groupMember_awayArea);
                b.hide(this._chatBox_groupMember_silentArea);
                b.hide(this._chatBox_groupMember_hiddenArea);
                b.hide(this._chatBox_groupMember_offlineArea)
            },
            onCreateDiscu: function (a) {
                a.preventDefault();
                alloy.portal.runApp("selectBuddy", {
                    title: "\u521b\u5efa\u8ba8\u8bba\u7ec4",
                    windowType: "EqqWindow",
                    isAddSelf: !0,
                    maxBuddy: 20,
                    initIndex: this.uin,
                    onSelected: EQQ.Model.BuddyList.createDiscu
                })
            }
        });
        this.GroupChatBox = C;
        var A = new e.Class({
            extend: this.BaseChatBox
        }, {
            init: function (a) {
                var b = this;
                this._adsorbWidth = 400;
                this._adsorbHeight = 291;
                this.discu = a.userOrGroup;
                this.uin = this.did = this.discu.did;
                this.setDiscuTitleBar();
                this.callSuper = function (a) {
                    var c = Array.prototype.slice,
                        d = c.call(arguments, 1);
                    A.superClass[a].apply(b, d.concat(c.call(arguments)))
                };
                a = this.parseOption(a);
                this.callSuper("init",
                a);
                this.bindDiscuTitleBarDom()
            },
            initFrame: function () {
                A.superClass.initFrame.apply(this)
            },
            setDiscuTitleBar: function () {
                var a = this.discu,
                    b = '<img class="chatBox_groupAvatar" src="' + alloy.util.getDiscuAvatar(a.did) + '" />';
                this.setTitleBarAvatar(b);
                this.setTitleBarName("\u8ba8\u8bba\u7ec4");
                b = "";
                b = '<a href="#" class="topic" title="' + (a.notSetName ? "\u70b9\u51fb\u7f16\u8f91\u4e3b\u9898" : a.titleTopic) + '">' + (a.notSetName ? "\u70b9\u51fb\u7f16\u8f91\u4e3b\u9898" : a.htmlTopic) + "</a>";
                this.setTitleBarInfo('<div class="chatBox_discuInfoArea"><span>\u4e3b\u9898&nbsp;-</span><div class="discuTopicBox" contenteditable="false" > ' + b + "</div></div>")
            },
            bindDiscuTitleBarDom: function () {
                b.addClass(this.titleBarDom.infoArea, "chatBoxDiscu_moreInfoArea");
                this.titleBarDom.topic = b.mini(".discuTopicBox", this.titleBarDom.infoArea)[0];
                var a = b.mini("a", this.titleBarDom.infoArea)[0];
                c.on(a, "click", e.bind(this.setTopicInput, this));
                c.on(a, "mousedown", function (a) {
                    a.preventDefault();
                    a.stopPropagation()
                })
            },
            initTitleBar: function () {
                A.superClass.initTitleBar.apply(this);
                var a = b.node("a", {
                    title: "\u9000\u51fa\u8ba8\u8bba\u7ec4",
                    href: "###"
                });
                a.innerHTML = '<span class="chatBox_quitButton"></span>';
                var d = b.node("a", {
                    title: "\u9080\u8bf7\u52a0\u5165\u8ba8\u8bba\u7ec4",
                    href: "###"
                });
                d.innerHTML = '<span class="chatBox_createDiscuButton"></span>';
                this.titleBarDom.buttonBar.appendChild(d);
                this.titleBarDom.buttonBar.appendChild(a);
                c.on(a, "click", e.bind(this.onQuitDiscu, this));
                c.on(d, "click", e.bind(this.inviteMember, this))
            },
            initToolBar: function () {
                this.setSendPicForm(e.string.template(o.groupSendPicFrom, {
                    gid: this.uin
                }));
                A.superClass.initToolBar.apply(this)
            },
            createToolBarDom: function () {
                A.superClass.createToolBarDom.apply(this);
                this._selSendPic = b.id("custom_face_" + this.uin);
                this.setMaskButton(this.discu.mask);
                b.hide(this._fileSendFormCon);
                b.hide(this._videoButton);
                b.hide(this._createDiscuButton);
                b.hide(this._shakeButton);
                this._maskButtonCon.title = "\u8ba8\u8bba\u7ec4\u5c4f\u853d"
            },
            createToolBarEvent: function () {
                A.superClass.createToolBarEvent.apply(this);
                c.off(this._maskButtonCon, "click");
                c.on(this._maskButtonCon, "click", e.bind(this.onDiscuMaskBtnClick, this))
            },
            updateDiscInfo: function () {
                this.updateDiscTopic();
                this.updateDiscMembers()
            },
            updateDiscTopic: function (a) {
                var d = this.discu.notSetName ? "\u70b9\u51fb\u7f16\u8f91\u4e3b\u9898" : this.discu.titleTopic,
                    a = this.discu.notSetName ? "\u70b9\u51fb\u7f16\u8f91\u4e3b\u9898" : this.discu.htmlTopic;
                this.titleBarDom.topic.innerHTML = '<a href="#" class="topic" title="' + d + '">' + a + "</a>";
                a = b.mini("a", this.titleBarDom.topic)[0];
                c.on(a, "click", e.bind(this.setTopicInput, this));
                c.on(a, "mousedown", function (a) {
                    a.preventDefault();
                    a.stopPropagation()
                })
            },
            setTopicInput: function (a) {
                a.preventDefault();
                a.stopPropagation();
                this.titleBarDom.topic.innerHTML = '<input name="topic" type="text" value="' + (this.discu.notSetName ? "" : this.discu.titleTopic || this.discu.titleName) + '" />';
                a = b.mini("input", this.titleBarDom.topic)[0];
                a.focus();
                a.select();
                var d = this;
                c.on(a, "click", function (a) {
                    a.preventDefault();
                    a.stopPropagation()
                });
                c.on(a, "mousedown", function (a) {
                    a.preventDefault();
                    a.stopPropagation()
                });
                c.on(a, "blur", function () {
                    d.saveNewTopic();
                    e.browser.firefox > 0 && d.editor.setEditable(!0)
                });
                c.on(a, "keydown", function (a) {
                    a.keyCode == 13 && (d.saveNewTopic(), e.browser.firefox > 0 && d.editor.setEditable(!0), a.preventDefault(), a.stopPropagation())
                });
                c.on(a, "keyup", function () {
                    var a = String(this.value);
                    if (e.string.byteLength(a) >= 20) this.value = a = e.string.cutByBytes(a, 20)
                })
            },
            saveNewTopic: function () {
                var a = b.mini("input", this.titleBarDom.topic)[0];
                if (e.isUndefined(a)) return !1;
                if ($S.byteLength(a.value) > 20) return !1;
                c.notifyObservers(d, "ModifyDiscuTopic", {
                    did: this.uin,
                    discu_name: a.value
                })
            },
            updateDiscMembers: function () {
                this.clearMembersListBox();
                this.updateMembers()
            },
            createSideBarDom: function () {
                this._chatBox_sideBar.innerHTML = e.string.template(o.discuSideBarUnfold, {
                    did: this.uin
                });
                this._chatBox_sideBar2.innerHTML = "";
                this._chatBox_sidebar_trigger = b.id("chatBox_sideBar_trigger_" + this.uin);
                this._chatBox_sidebar_trigger_member_count = b.id("chatBox_sideBar2_online_member_count_" + this.uin);
                this._chatBox_discuMember = b.id("chatBox_discuMember_" + this.uin);
                this._chatBox_discuMember_onlineCount = b.id("chatBox_discuMember_onlineCount_" + this.uin);
                this._chatBox_discuMember_count = b.id("chatBox_discuMember_count_" + this.uin);
                this._chatBox_discuMember_mainArea = b.id("chatBox_discuMember_mainArea_" + this.uin);
                e.platform.iPad && new e.ui.TouchScroller(this._chatBox_discuMember_mainArea);
                this._chatBox_discuMember_callmeArea = b.id("chatBox_" + this.uin + "_discuMember_callmeArea");
                this._chatBox_discuMember_onlineArea = b.id("chatBox_" + this.uin + "_discuMember_onlineArea");
                this._chatBox_discuMember_busyArea = b.id("chatBox_" + this.uin + "_discuMember_busyArea");
                this._chatBox_discuMember_awayArea = b.id("chatBox_" + this.uin + "_discuMember_awayArea");
                this._chatBox_discuMember_silentArea = b.id("chatBox_" + this.uin + "_discuMember_silentArea");
                this._chatBox_discuMember_hiddenArea = b.id("chatBox_" + this.uin + "_discuMember_hiddenArea");
                this._chatBox_discuMember_offlineArea = b.id("chatBox_" + this.uin + "_discuMember_offlineArea");
                this.onListScrollTimer = null;
                c.on(this._chatBox_discuMember_mainArea, "click", p);
                c.on(this._chatBox_msgList, "click", p);
                this.setSideBarExpand();
                b.setStyle(this._chatBox_sideBar2, "width", "0")
            },
            createSideBarEvent: function () {
                this._isExpandSidebar = !0
            },
            onSideBarExpand: function () {},
            setSideBarExpand: function () {
                b.addClass(this._chatBox_sideBar2, "chatBox_sideBar2_expand");
                b.setStyle(this._chatBox_sideBar, "width", "130px");
                b.setStyle(this._chatBox_chatBox_mainArea, "marginRight", "130px");
                b.show(this._chatBox_sideBar);
                b.setStyle(this._chatBox_sideBar2, "width", "0");
                b.setStyle(this._chatBox_sideBar2, "right", "130px")
            },
            onSideBarCollapse: function () {},
            addMember: function (a) {
                var d = "";
                a.uin == this.discu.owner && (d = "groupMaster");
                var e = a.htmlMarkName || a.htmlName || a.uin.toString(),
                    e = e == "" ? a.uin : e,
                    e = '\t\t\t\t\t<div class="chatBox_groupMember_avatarArea">\t\t\t\t\t\t<img id="chatBox_discu_' + this.discu.did + "_Member_avatar_" + a.uin + '" class="chatBox_groupMember_avatar" src="' + EQQ.CONST.EQQ_SERVER_URL + 'style/images/avatar_default_20_20.gif" />\t\t\t\t\t\t<div class="chatBox_groupMember_state"></div>\t\t\t\t\t</div>\t\t\t\t\t<div class="chatBox_groupMember_nameArea" title="' + a.titleName + '">\t\t\t\t\t\t<div id="chatBox_discuMember_nick_' + this.discu.did + "_" + a.uin + '" class="chatBox_groupMember_nick ' + (a.vip ? "EQQ_Vip_Nick" : "") + '">' + e + "</div>\t\t\t\t\t</div>",
                    d = b.node("div", {
                        id: "chatBox_discuMember_buddy_" + a.uin,
                        "class": "chatBox_groupMember_buddy " + d,
                        uin: a.uin
                    });
                d.innerHTML = e;
                e = "_chatBox_discuMember_" + a.status + "Area";
                if (this[e]) this[e].appendChild(d), b.show(this[e]), a.status != "offline" && this._discuOnlineMemberCount++, c.on(d, "mouseover", k), c.on(d, "mouseout", h), b.id("chatBox_discu_" + this.discu.did + "_Member_avatar_" + a.uin).src = EQQ.getUserAvatar(a.uin)
            },
            createMembersDom: function () {
                var a = this;
                e.timedChunk(this.discu.members,
                this.addMember, this, !1, function () {
                    a.discuMemberReady()
                })
            },
            updateMembers: function () {
                this.isDiscuMemberReady = !0;
                this.clearMembersListBox();
                this.unloadAvatarList = [];
                var a = this.discu.members;
                this._discuOnlineMemberCount = 0;
                this._chatBox_discuMember_count.innerHTML = a.length;
                this.createMembersDom(a)
            },
            discuMemberReady: function () {
                this._chatBox_discuMember_onlineCount.innerHTML = this._discuOnlineMemberCount;
                this.setTimingUpdateDiscuStatus()
            },
            clearMembersListBox: function () {
                this._chatBox_discuMember_callmeArea.innerHTML = "";
                this._chatBox_discuMember_onlineArea.innerHTML = "";
                this._chatBox_discuMember_busyArea.innerHTML = "";
                this._chatBox_discuMember_awayArea.innerHTML = "";
                this._chatBox_discuMember_silentArea.innerHTML = "";
                this._chatBox_discuMember_hiddenArea.innerHTML = "";
                this._chatBox_discuMember_offlineArea.innerHTML = "";
                b.hide(this._chatBox_discuMember_callmeArea);
                b.hide(this._chatBox_discuMember_onlineArea);
                b.hide(this._chatBox_discuMember_busyArea);
                b.hide(this._chatBox_discuMember_awayArea);
                b.hide(this._chatBox_discuMember_silentArea);
                b.hide(this._chatBox_discuMember_hiddenArea);
                b.hide(this._chatBox_discuMember_offlineArea)
            },
            onQuitDiscu: function (a) {
                a.preventDefault();
                var b = this.uin;
                qqweb.layout.confirm("\u60a8\u771f\u7684\u8981\u9000\u51fa\u8ba8\u8bba\u7ec4\u5417?", function () {
                    c.notifyObservers(EQQ, "QuitDiscu", {
                        did: b
                    });
                    alloy.util.report2im("dicussionsmask|toolbar|quit")
                }, {
                    windowType: "EqqWindow"
                });
                alloy.util.report2qqweb("dicussionsmask|bigtoolbar|quit")
            },
            quitDiscuSuccess: function () {
                this.close()
            },
            inviteMember: function () {
                var a = [],
                    b = this.discu.members,
                    c;
                for (c in b) a.push(b[c]);
                if (a.length >= 20) return alloy.layout.alert("\u8ba8\u8bba\u7ec4\u6210\u5458\u4e2a\u6570\u5df2\u7ecf\u8fbe\u5230\u4e0a\u9650\uff0c\u8bf7\u91cd\u65b0\u521b\u5efa\u8ba8\u8bba\u7ec4\u3002", null, {
                    windowType: "EqqWindow"
                }), !1;
                alloy.portal.runApp("selectBuddy", {
                    title: "\u9080\u8bf7\u6210\u5458",
                    windowType: "EqqWindow",
                    isAddSelf: !0,
                    maxBuddy: 20,
                    initList: a,
                    onlyNewMember: !0,
                    onSelected: EQQ.Model.BuddyList.modifyDiscuMembers,
                    cbParam: {
                        did: this.discu.did
                    }
                });
                alloy.util.report2im("dicussionsmask|memlist|add");
                alloy.util.report2qqweb("dicussionsmask|bigtoolbar|invite")
            },
            updateMemberState: function (a) {
                if (a.list.length < 1) return !1;
                for (var d in a.list) {
                    var e = a.list[d],
                        j = b.id("chatBox_discuMember_buddy_" + e.uin),
                        i = j.cloneNode(!0),
                        l = "_chatBox_discuMember_" + e.status + "Area";
                    this[l].appendChild(i);
                    b.show(this[l]);
                    l = "_chatBox_discuMember_" + e.old_status + "Area";
                    c.off(j, "mouseover");
                    c.off(j, "mouseout");
                    j.parentNode.removeChild(j);
                    b.mini(".chatBox_groupMember_buddy", j.parentNode).length < 1 && b.hide(this[l]);
                    c.on(i, "mouseover",
                    k);
                    c.on(i, "mouseout", h)
                }
                this._discuOnlineMemberCount = a.list.length;
                this._chatBox_discuMember_onlineCount.innerHTML = this._discuOnlineMemberCount
            },
            updateMemberVipInfo: function (a) {
                for (var c in a.list) {
                    var d = a.list[c];
                    d.vip && (d = b.id("chatBox_discuMember_nick_" + this.uin + "_" + d.uin)) && !b.hasClass(d, "EQQ_Vip_Nick") && b.addClass(d, "EQQ_Vip_Nick")
                }
            },
            setTimingUpdateDiscuStatus: function (a) {
                var b = 9E5,
                    c = this;
                e.isUndefined(a) || 9E5 - ((new Date).getTime() - a) < 0 && (b = 0);
                this.delayLoadStatsFlag && clearTimeout(this.delayLoadStatsFlag);
                this.delayLoadStatsFlag = null;
                this.delayLoadStatsFlag = setTimeout(function () {
                    c.delaySendGetDiscuNewestState(9E5)
                }, b)
            },
            delaySendGetDiscuNewestState: function (a) {
                var b = this;
                this.delayLoadStatsFlag && clearTimeout(this.delayLoadStatsFlag);
                this.delayLoadStatsFlag = null;
                c.notifyObservers(d, "GetDiscuMemberStatus", {
                    did: this.uin
                });
                this.delayLoadStatsFlag = setTimeout(function () {
                    b.delaySendGetDiscuNewestState(a)
                }, a)
            },
            pauseDelaySendGetDiscuNewestState: function () {
                this.delayLoadStatsFlag && clearTimeout(this.delayLoadStatsFlag);
                this.delayLoadStatsFlag = null
            },
            onDiscuMaskBtnClick: function (a) {
                a.stopPropagation();
                a = b.getClientXY(this._maskButtonCon);
                c.notifyObservers(d, "MaskButtonClick", a)
            }
        });
        this.DiscuChatBox = A;
        var F = new e.Class({
            extend: this.BaseChatBox
        }, {
            init: function (a) {
                var b = this;
                this._adsorbWidth = 300;
                this._adsorbHeight = 291;
                this.user = a.userOrGroup;
                this.uin = this.user.uin;
                this.setLiteTitleBar();
                this.callSuper = function (a) {
                    var c = Array.prototype.slice,
                        d = c.call(arguments, 1);
                    F.superClass[a].apply(b, d.concat(c.call(arguments)))
                };
                a = this.parseOption(a);
                this.callSuper("init", a);
                this.bindLiteTitleBarDom()
            },
            initFrame: function () {
                F.superClass.initFrame.apply(this)
            },
            setLiteTitleBar: function () {
                var a = this.user,
                    b = '<img class="avatarInChatbox" src="' + EQQ.getUserAvatar(a.uin) + '" /><div class="stateInChatbox"></div>';
                this.setTitleBarAvatar(b);
                b = e.string.template(o.liteChatBoxTitleBarName, {
                    uin: a.uin,
                    titleAllName: a.titleAllName,
                    htmlShowName: a.htmlShowName
                });
                this.setTitleBarName(b);
                a.currentId ? isNaN(a.currentId) ? (a = EQQ.Model.BuddyList.getDiscuById(a.currentId),
                b = '<div class="chatBox_liteInfoArea">\u4e34\u65f6\u4f1a\u8bdd - \u6765\u81ea\u8ba8\u8bba\u7ec4:' + (a ? a.htmlName : "") + "</div>") : b = '<div class="chatBox_liteInfoArea">\u4e34\u65f6\u4f1a\u8bdd - \u6765\u81ea\u7fa4:' + EQQ.Model.BuddyList.getGroupByGid(a.currentId).htmlShowName + "</div>" : b = '<div class="chatBox_liteInfoArea">\u4e34\u65f6\u4f1a\u8bdd</div>';
                this.setTitleBarInfo(b)
            },
            bindLiteTitleBarDom: function () {
                b.addClass(this.titleBarDom.avatarArea, this.user.state + "BuddyInChatbox");
                this.titleBarDom.allName = b.id("chatBox_allName_" + this.uin);
                this.titleBarDom.mainName = b.id("chatBox_mainName_" + this.uin);
                var a = this.titleBarDom;
                c.on(a.allName, "click", v);
                c.on(a.allName, "mousedown", e.bind(this.stopPropagationAndSetCurrentWithoutFocus, this))
            },
            initSideBar: function () {
                this._chatBox_sideBar2 = b.id("chatBox_sideBar2_" + this.uin);
                b.hide(this._chatBox_sideBar2)
            },
            createToolBarDom: function () {
                F.superClass.createToolBarDom.apply(this);
                b.hide(this._maskButtonCon);
                b.hide(this._createDiscuButton);
                b.hide(this._sendPicFormCon);
                b.hide(this._snapButton);
                b.hide(this._shakeButton);
                b.hide(this._fileSendFormCon)
            },
            createToolBarEvent: function () {
                F.superClass.createToolBarEvent.apply(this);
                c.off(this._faceButton, "click");
                c.on(this._faceButton, "click", e.bind(this.onFaceButtonClick, this))
            },
            updateUserState: function (a) {
                b.setClass(this.titleBarDom.avatarArea, a + "BuddyInChatbox");
                this.titleBarDom.avatarArea.title = EQQ.hash.onlineStatusText[a].toString()
            },
            beforeClose: function () {
                return this.videoWin ? !1 : !0
            },
            close: function () {
                var a = this;
                this.videoWin ? alloy.layout.confirm("\u5173\u95ed\u89c6\u9891\u7a97\u53e3\u5c06\u4f1a\u4e2d\u6b62\u89c6\u9891\u901a\u8bdd\uff0c\u662f\u5426\u5173\u95ed\uff1f", function () {
                    c.notifyObservers(a, "close", a);
                    a.destroy()
                }, {
                    windowType: "EqqWindow"
                }) : (c.notifyObservers(this, "close", this), this.destroy())
            },
            onFaceButtonClick: function (a) {
                a.stopPropagation();
                a = b.getClientXY(this._faceButton);
                c.notifyObservers(d, "FaceButtonClick", {
                    xy: a,
                    showCustom: !1
                })
            }
        });
        this.LiteChatBox = F
    })
})();
