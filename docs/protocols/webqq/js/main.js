Jx().$package(alloy.app.explorer = new alloy.businessClass.App(alloy.portal.getSystemConfig("explorer")), function (n) {
    var d = n.dom,
        f = n.event,
        w, C, j = alloy.fileSystem.FILE_TYPE,
        k = {}, m = {};
    this.folderList = k;
    var J = function (c) {
        c && n.browser.mobileSafari && n.platform.iPad.split(".")[0] >= 4 && c.addEventListener("touchstart", function (a) {
            var b = document.createEvent("MouseEvents");
            b.initEvent("click", !1, !1);
            a.target.dispatchEvent(b)
        }, !0)
    }, K = function (c) {
        c.stopPropagation();
        c.preventDefault()
    }, L = function (c) {
        c.preventDefault()
    },
    M = function (c) {
        for (var c = c.getElementsByTagName("a"), a = 0; a < c.length; ++a) {
            var b = c[a],
                d = b.getAttribute("href");
            if (d && d.substr(0, 1) == "#") f.on(b, "click", L)
        }
    }, D = function (c, a) {
        var b;
        switch (a.t) {
        case j.FILE:
            b = {
                longTouchable: !1,
                parentNode: c
            };
            b = alloy.iconFactory.createIcon(a.t, b, a);
            break;
        case j.FOLDER:
            b = {
                deleteable: !1,
                longTouchable: !1,
                parentNode: c
            };
            b = alloy.iconFactory.createIcon(a.t, b, a);
            b.disable();
            b.setTitle("Q+ Web\u684c\u9762\u6682\u65f6\u4e0d\u652f\u6301\u591a\u7ea7\u76ee\u5f55");
            break;
        case j.APP:
            var d = alloy.appconfig.getAppConfig(a.id);
            if (!d) return n.profile('createFileIcon. id="' + a.id + '" appConfig is null', "Explorer"), alloy.fileSystem.deleteFile(a, null, null, null, !1), null;
            b = {
                longTouchable: !1,
                parentNode: c
            };
            b = alloy.iconFactory.createIcon(a.t, b, d);
            break;
        case j.GROUP:
        case j.BUDDY:
            b = {
                longTouchable: !1,
                parentNode: c
            }, b = alloy.iconFactory.createIcon(a.t, b, a)
        }
        b && C.addDragClass(b.getElement());
        return b
    }, P = function (c) {
        var a = c.file.id,
            b = alloy.fileSystem.getFolderById(a).items,
            x = alloy.layout.getDesktopHeight(),
            N = alloy.layout.getDesktopWidth(),
            h = b.length,
            e = this,
            g = d.node("div", {
                "class": "quick_view_container",
                id: "quickViewContainer_" + a
            });
        w.appendChild(g);
        f.on(g, "contextmenu", K);
        var l = new alloy.layout.Panel({
            container: g
        }),
            o = new O(g, a);
        this.box = o;
        o.setHtml('<div class="quick_view_container_control"><a href="###" class="quick_view_container_open" id="quick_view_container_open_' + a + '">\u6253\u5f00<a></div><div class="quick_view_container_list" id="quick_view_container_list_' + a + '"><div class="quick_view_container_list_in" id="quick_view_container_list_in_' + a + '"></div></div>');
        C.addDropTarget({
            el: g,
            level: 999
        });
        g.setAttribute("customacceptdrop", "1");
        f.on(d.id("quick_view_container_open_" + a), "click", function (b) {
            b.preventDefault();
            k[a] || (k[a] = new H(c));
            qqweb.util.report2qqweb("contextmenu|folder|previewopen")
        });
        var o = d.id("quick_view_container_list_in_" + a),
            z = d.id("quick_view_container_list_" + a),
            E = {};
        if (h == 0) o.innerHTML = "\u6587\u4ef6\u5939\u4e3a\u7a7a";
        else {
            o.innerHTML = "";
            for (var s, p = 0; p < h; ++p) {
                var r = b[p];
                if (s = D(o, r))(r.t == j.FILE || r.t == j.FOLDER) && s.contextMenuDisable(), E[r.id] = s
            }
        }
        this.quickViewPopup = l;
        this.quickViewContainer = g;
        this.id = a;
        this.iconList = E;
        this.destroy = function () {
            f.removeObserver(alloy.layout, "clickDesktop", e.destroy);
            for (var a = 0; a < e.iconList.length; ++a) e.iconList[a].destroy();
            w.removeChild(e.quickViewContainer);
            delete m[e.id];
            for (var b in e) e.hasOwnProperty(b) && delete e[b]
        };
        l.setZIndex(alloy.layout.getTopZIndex(3));
        this.scrollBar = new n.ui.ScrollBar(z, {
            showBarContainer: !0,
            ipadTouchArea: !0,
            stopClick: !0
        });
        setTimeout(function () {
            f.addObserver(alloy.layout, "clickDesktop", e.destroy)
        }, 0);
        l.show();
        J(g);
        this.length = h;
        var q = function () {
            var a = Math.max(60, Math.min(x - 30, Math.min(450, Math.floor((e.length - 1) / 4 + 1) * 70 + 30)));
            e.length > 24 ? (e.quickViewContainer.style.width = "350px", e.iconContainer.style.height = "420px") : (e.quickViewContainer.style.width = "340px", e.iconContainer.style.height = a - 30 + "px");
            e.scrollBar.refresh();
            e.box.init(15, 15, 10, 10, a);
            e.box.createArrow();
            a = Math.max(0, c.y - a + 40);
            e.quickViewPopup.setY(a, 0);
            c.x + 395 < N || c.x < 335 ? (e.quickViewPopup.setX(c.x + 85), e.box.setArrowPos(0,
            Math.max(c.y - a, 0))) : (e.quickViewPopup.setX(c.x - 340), e.box.setArrowPos(1, Math.max(c.y - a, 0)))
        };
        this.addFileIcon = function (a) {
            if (e.length == 0) e.iconContainer.innerHTML = "";
            var b = D(e.iconContainer, a);
            b && ((a.t == j.FILE || a.t == j.FOLDER) && b.contextMenuDisable(), e.iconList[a.id] = b, ++e.length, q())
        };
        this.deleteFileIcon = function (a) {
            var b = e.iconList[a.id];
            b && b.destroy();
            --e.length;
            delete e.iconList[a.id];
            q();
            if (e.length == 0) e.iconContainer.innerHTML = "\u6587\u4ef6\u5939\u4e3a\u7a7a"
        };
        this.iconContainer = o;
        q()
    }, O = function (c,
    a) {
        c.innerHTML = '<div class="perfect_nine_box" id="perfect_nine_box_' + a + '">\t\t\t\t<div id="perfect_nine_top_' + a + '" class="perfect_nine_top"><div id="perfect_nine_t_m_' + a + '" class="perfect_nine_t_m"></div></div>\t\t\t\t<span id="perfect_nine_t_l_' + a + '" class="perfect_nine_t_l"></span>\t\t\t\t<span id="perfect_nine_t_r_' + a + '" class="perfect_nine_t_r"></span>\t\t\t\t<div id="perfect_nine_middle_' + a + '" class="perfect_nine_middle">\t\t\t\t\t<span id="perfect_nine_m_l_' + a + '" class="perfect_nine_m_l"></span>\t\t\t\t\t<span id="perfect_nine_m_r_' + a + '" class="perfect_nine_m_r"></span>\t\t\t\t\t<div id="perfect_nine_context_' + a + '" class="perfect_nine_context">\t\t\t\t\t</div>\t\t\t\t</div>\t\t\t\t<div id="perfect_nine_b_m_' + a + '" class="perfect_nine_b_m">\t\t\t\t\t<div id="perfect_nine_b_m_m_' + a + '" class="perfect_nine_b_m_m">\t\t\t\t\t</div>\t\t\t\t</div>\t\t\t\t<span id="perfect_nine_b_l_' + a + '" class="perfect_nine_b_l"></span>\t\t\t\t<span id="perfect_nine_b_r_' + a + '" class="perfect_nine_b_r"></span></div>';
        var b = this;
        b.container = c;
        b.dom = d.id("perfect_nine_box_" + a);
        this.init = function (c, f, h, e, g) {
            var j = d.id("perfect_nine_box_" + a),
                k = d.id("perfect_nine_top_" + a),
                l = d.id("perfect_nine_t_l_" + a),
                m = d.id("perfect_nine_t_r_" + a),
                n = d.id("perfect_nine_t_m_" + a),
                p = d.id("perfect_nine_m_l_" + a),
                r = d.id("perfect_nine_m_r_" + a),
                q = d.id("perfect_nine_b_m_" + a),
                y = d.id("perfect_nine_b_m_m_" + a),
                t = d.id("perfect_nine_b_l_" + a),
                u = d.id("perfect_nine_b_r_" + a),
                v = d.id("perfect_nine_context_" + a);
            v.style.height = g + "px";
            j.style.height = g + h + e + "px";
            b.context_height = g;
            q.style.paddingLeft = p.style.width = t.style.width = v.style.marginLeft = l.style.width = k.style.paddingLeft = c + "px";
            k.style.paddingRight = q.style.paddingRight = r.style.width = m.style.width = u.style.width = v.style.marginRight = f + "px";
            n.style.height = m.style.height = l.style.height = h + "px";
            t.style.height = u.style.height = q.style.height = y.style.height = e + "px";
            l.style.marginTop = m.style.marginTop = "-" + h + "px";
            t.style.marginTop = u.style.marginTop = "-" + e + "px"
        };
        this.createArrow = function () {
            d.id("perfect_nine_m_l_" + a).innerHTML = '<div class="perfect_nine_m_l_t"></div><div class="perfect_nine_m_l_m"></div><div class="perfect_nine_m_l_b"></div>';
            d.id("perfect_nine_m_r_" + a).innerHTML = '<div class="perfect_nine_m_r_t"></div><div class="perfect_nine_m_r_m"></div><div class="perfect_nine_m_r_b"></div>'
        };
        this.setXY = function (a, c) {
            b.container.style.left = a + "px";
            b.container.style.top = c + "px"
        };
        this.setArrowPos = function (c, f) {
            if (f > b.context_height) f = b.context_height;
            var h = b.context_height % 2,
                e = (b.context_height - h) / 2,
                h = e + h;
            c ? (d.id("perfect_nine_m_r_" + a).firstChild.style.height = f + "px", d.id("perfect_nine_m_r_" + a).childNodes[1].style.top = f + "px", d.id("perfect_nine_m_r_" + a).childNodes[1].style.height = "20px", d.id("perfect_nine_m_r_" + a).childNodes[1].style.display = "block", d.id("perfect_nine_m_r_" + a).childNodes[2].style.top = f + 20 + "px", d.id("perfect_nine_m_r_" + a).childNodes[2].style.height = b.context_height - f - 20 + "px", d.id("perfect_nine_m_l_" + a).firstChild.style.height = h + "px", d.id("perfect_nine_m_l_" + a).childNodes[1].style.display = "none", d.id("perfect_nine_m_l_" + a).childNodes[2].style.height = e + "px", d.id("perfect_nine_m_l_" + a).childNodes[2].style.top = h + "px") : (d.id("perfect_nine_m_l_" + a).firstChild.style.height = f + "px", d.id("perfect_nine_m_l_" + a).childNodes[1].style.top = f + "px", d.id("perfect_nine_m_l_" + a).childNodes[1].style.height = "20px", d.id("perfect_nine_m_l_" + a).childNodes[2].style.top = f + 20 + "px", d.id("perfect_nine_m_l_" + a).childNodes[1].style.display = "block", d.id("perfect_nine_m_l_" + a).childNodes[2].style.height = b.context_height - f - 20 + "px", d.id("perfect_nine_m_r_" + a).firstChild.style.height = h + "px", d.id("perfect_nine_m_r_" + a).childNodes[1].style.display = "none", d.id("perfect_nine_m_r_" + a).childNodes[2].style.height = e + "px", d.id("perfect_nine_m_r_" + a).childNodes[2].style.top = h + "px")
        };
        this.setHtml = function (b) {
            d.id("perfect_nine_context_" + a).innerHTML = b
        };
        this.destroy = function () {
            b.container.removeChild(b.dom)
        }
    }, I = function (c, a) {
        var b = a;
        if (c.compareDocumentPosition) return (c.compareDocumentPosition(a) & 8) === 8;
        if (c.sourceIndex) {
            var d = c.sourceIndex,
                f = a.sourceIndex,
                h = a.nextSibling;
            if (!h) {
                do a = a.parentNode;
                while (!(h = a.nextSibling) && a.parentNode)
            }
            if (h && h.sourceIndex) return d > f && d < h.sourceIndex
        }
        for (; c = c.parentNode;) if (c == b) return !0;
        return !1
    }, Q = function (c) {
        var a = alloy.clipBoard.getData(),
            b = alloy.clipBoard.CLIP_BOARD_TYPE;
        a && (a.type == b.FILE || a.type == b.FOLDER) ? c.getItemAt(2).enable() : c.getItemAt(2).disable()
    }, H = function (c) {
        var a = c.file.id,
            b = this,
            x = b.folderInfo = alloy.fileSystem.getFolderById(a),
            l = alloy.desktopManager.getCurrentDesktop().getElement(),
            h = [{
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
                folderId: a,
                icon: {
                    className: "add_file_icon"
                },
                onClick: function () {}
            }, {
                text: "\u65b0\u5efa\u6587\u4ef6\u5939",
                icon: {
                    className: "add_folder_icon"
                },
                enable: !1,
                onClick: function () {}
            }, {
                text: "\u7c98\u8d34",
                onClick: function () {
                    var a = alloy.clipBoard.getData();
                    if (a) {
                        var b = a.data,
                            c = x.id;
                        a.pasteType == alloy.clipBoard.PASTE_TYPE.COPY ? alloy.fileSystem.copyFile(b, c) : alloy.fileSystem.moveFile(b, c, null, null, !0, !0)
                    }
                }
            }],
            e = alloy.windowFactory.createWindow("Window", {
                title: x.n,
                modeSwitch: !0,
                dragable: !0,
                resize: !0,
                hasMinButton: !0,
                hasMaxButton: !0,
                hasCloseButton: !0,
                width: 760,
                height: 475,
                taskType: "folder"
            });
        e.hide();
        e.setHtml('<div class="explorer_container" id="explorer_container_' + a + '"><div class="explorer_bar"><a class="explorer_flashLink" href="###" id="explorer_flashLink_' + a + '"></a><div class="explorer_bar_separate"></div><a class="explorer_link explorer_add_app" href="###" id="explorer_add_app_' + a + '"><div class="add_app_icon"></div><div>\u6dfb\u52a0\u5e94\u7528</div></a><div class="explorer_bar_separate"></div><a href="###" class="explorer_link explorer_add_contact" id="explorer_add_contact_' + a + '"><div class="add_contact_icon"></div><div>\u6dfb\u52a0\u684c\u9762\u8054\u7cfb\u4eba</div></a></div><div class="explorer_category"><div class="explorer_title_bar"><div class="explorer_title">\u6587\u4ef6</div><div class="explorer_title_line"></div></div><div class="explorer_item_list"></div></div><div class="explorer_category"><div class="explorer_title_bar"><div class="explorer_title">\u6587\u4ef6\u5939</div><div class="explorer_title_line"></div></div><div class="explorer_item_list"></div></div><div class="explorer_category"><div class="explorer_title_bar"><div class="explorer_title">\u5e94\u7528</div><div class="explorer_title_line"></div></div><div class="explorer_item_list"></div></div><div class="explorer_category"><div class="explorer_title_bar"><div class="explorer_title">\u8054\u7cfb\u4eba</div><div class="explorer_title_line"></div></div><div class="explorer_item_list"></div></div><div class="explorer_empty_tip">\u6587\u4ef6\u5939\u4e3a\u7a7a</div><div class="explorer_tips"></div></div>');
        var g = d.id("explorer_container_" + a);
        M(g);
        this.flashUploadNode = d.id("explorer_flashUploadNode_" + a);
        if (!this.flashUploadNode) this.flashUploadNode = d.node("div", {
            id: "explorer_flashUploadNode_" + a,
            "class": "explorer_flashLinkHolder"
        }), this.flashUploadNode.innerHTML = '<a class="explorer_link explorer_add_file" href="###" id="explorer_upload_' + a + '"><div class="add_file_icon"></div><div style="width:75px;"></div><div id ="explorer_upload_holder_' + a + '" style="float:none;" class="explorer_upload_holder"></div></a>',
        l.appendChild(this.flashUploadNode);
        var m = d.id("explorer_add_app_" + a),
            o = d.id("explorer_add_contact_" + a),
            z = d.id("explorer_upload_" + a),
            E = d.id("explorer_flashLink_" + a),
            s = d.mini(".explorer_tips", g)[0];
        d.hide(s);
        c = {
            callback: "alloy.flashUploadManager.flashEventListener",
            mode: 0,
            text: '<span style="margin-left:30px;">\u4e0a\u4f20\u6587\u4ef6</span>',
            holder: d.id("explorer_upload_holder_" + a),
            width: "92px",
            height: "22px",
            extInfo: '{"folderId":' + a + "}"
        };
        this.flashUploader = new alloy.flashUploadManager.FlashUploader(c);
        c = function () {
            alloy.portal.getLoginLevel() > 1 && alloy.storage.getDefaultDisk() ? b.flashUploader.showFileSelector() : b.flashUploader.hideFileSelector()
        };
        c();
        f.addObserver(alloy.portal, "loginLevelChange", c);
        var p = b.showflashUploadNode = function () {
            var a = d.getXY(E),
                c = d.getXY(l),
                e = 0;
            n.browser.ie == 6 && (e = -2);
            d.setXY(b.flashUploadNode, a[0] - c[0] + e, a[1] - c[1]);
            d.setStyle(b.flashUploadNode, "width", "96px");
            d.setStyle(b.flashUploadNode, "height", "24px");
            d.setStyle(b.flashUploadNode, "zIndex", alloy.layout.getTopZIndex());
            alloy.portal.getLoginLevel() > 1 && alloy.storage.getDefaultDisk() ? b.flashUploader.showFileSelector() : b.flashUploader.hideFileSelector()
        }, r = b.hideFlashUploadNode = function () {
            d.setXY(b.flashUploadNode, 0, 0);
            d.setStyle(b.flashUploadNode, "width", "1px");
            d.setStyle(b.flashUploadNode, "height", "1px")
        };
        f.addObserver(e, "setCurrent", p);
        f.addObserver(e, "dragMove", p);
        f.addObserver(e, "dragEnd", p);
        f.addObserver(e, "resize", function () {
            e.isShow() ? p() : r()
        });
        f.addObserver(e, "positionChanged", p);
        f.addObserver(e, "show", p);
        f.addObserver(e, "hide", r);
        f.addObserver(e, "beforeClose", r);
        f.on(m, "click", function () {
            alloy.portal.runApp("appMarket", {
                option: {
                    folderId: a
                }
            });
            qqweb.util.report2qqweb("add|folder|addapp")
        });
        f.on(o, "click", function () {
            alloy.desktopContact.showSelectBuddyBox(a);
            qqweb.util.report2qqweb("add|folder|adddeskcontanct")
        });
        f.on(z, "click", function () {});
        f.on(g, "click", function (a) {
            a = document.elementFromPoint(a.pageX, a.pageY);
            if ((a == g || a.parentNode.parentNode == g || a.parentNode == g) && alloy.desktopManager.getDesktopStatus() === alloy.desktopManager.DESK_STATUS.EDIT) alloy.desktopManager.setDesktopStatus(alloy.desktopManager.DESK_STATUS.NORMAL), alloy.util.report2qqweb("screen|ipad|edited")
        });
        f.on(g, "contextmenu", function (a) {
            a.stopPropagation();
            a.preventDefault();
            if (!b.contextMenu) b.contextMenu = new n.ui.ContextMenu({
                id: "ex_contextMenu_" + b._id,
                container: alloy.layout.getDesktop().body,
                items: h,
                beforeShow: Q
            });
            b.contextMenu.setZIndex(alloy.layout.getTopZIndex(3));
            b.contextMenu.show(a.clientX, a.clientY)
        });
        var q = g.childNodes[1],
            y = g.childNodes[2],
            t = g.childNodes[3],
            u = g.childNodes[4],
            v = g.childNodes[5],
            A = {}, F = {}, w = {}, B = {};
        this.appIconList = A;
        this.fileIconList = F;
        this.folderIconList = w;
        this.contactIconList = B;
        this.appColumn = t;
        this.fileColumn = q;
        this.folderColumn = y;
        this.contactColumn = u;
        this.emptyColumn = v;
        var o = function () {
            d.hide(t);
            d.hide(q);
            d.hide(y);
            d.hide(u);
            C.addDropTarget({
                el: g,
                level: 999
            });
            g.setAttribute("customacceptdrop", "1");
            var a = x.items,
                c = a.length;
            b.appListCount = 0;
            b.folderListCount = 0;
            b.fileListCount = 0;
            b.contactListCount = 0;
            for (var e in A) A[e].destroy();
            for (var f in B) B[f].destroy();
            if (c == 0) d.show(v);
            else {
                d.hide(v);
                for (e = 0; e < c; ++e) D(a[e])
            }
        }, D = function (a) {
            var c;
            switch (a.t) {
            case j.FILE:
                c = {
                    parentNode: q.childNodes[1]
                };
                c = F[a.id] = alloy.iconFactory.createIcon(j.FILE, c, a);
                b.fileColumnTitle.innerHTML = "\u6587\u4ef6(" + ++b.fileListCount + ")";
                d.show(b.fileColumn);
                break;
            case j.FOLDER:
                c = {
                    parentNode: y.childNodes[1]
                };
                c = w[a.id] = alloy.iconFactory.createIcon(j.FOLDER, c, a);
                b.folderColumnTitle.innerHTML = "\u6587\u4ef6\u5939(" + ++b.folderListCount + ")";
                d.show(b.folderColumn);
                c.disable();
                c.setTitle("Q+ Web\u684c\u9762\u6682\u65f6\u4e0d\u652f\u6301\u591a\u7ea7\u76ee\u5f55");
                break;
            case j.APP:
                c = {
                    parentNode: t.childNodes[1]
                };
                var e = alloy.appconfig.getAppConfig(a.id);
                if (!e) return n.profile('createFileIcon. id="' + item.id + '" appConfig is null', "Explorer"), alloy.fileSystem.deleteFile(a, null, null, null, !1), null;
                if (c = alloy.iconFactory.createIcon(j.APP, c, e)) A[a.id] = c, b.appColumnTitle.innerHTML = "\u5e94\u7528(" + ++b.appListCount + ")", d.show(b.appColumn);
                break;
            case j.BUDDY:
            case j.GROUP:
                c = {
                    parentNode: u.childNodes[1]
                }, c = B[a.id] = alloy.iconFactory.createIcon(a.t, c, a), b.contactColumnTitle.innerHTML = "\u8054\u7cfb\u4eba(" + ++b.contactListCount + ")", d.show(b.contactColumn)
            }
            C.addDragClass(c.getElement());
            d.hide(b.emptyColumn)
        }, z = function (a) {
            s.innerHTML = a || "\u6b63\u5728\u4ece\u7f51\u76d8\u540c\u6b65\u6587\u4ef6...";
            d.show(s)
        }, G = function () {
            f.removeObserver(e, "close", G);
            delete k[b.id];
            for (var a in b) b.hasOwnProperty(a) && delete b[a]
        };
        f.addObserver(e, "close", G);
        this.folderColumnTitle = y.firstChild.firstChild;
        this.fileColumnTitle = q.firstChild.firstChild;
        this.appColumnTitle = t.firstChild.firstChild;
        this.contactColumnTitle = u.firstChild.firstChild;
        this.id = a;
        this.addAppLink = m;
        this.containerEl = g;
        this._window = e;
        this.init = o;
        this.destroy = G;
        this.deleteFileIcon = function (c) {
            switch (c.t) {
            case j.FILE:
                F[c.id].destroy();
                delete F[c.id];
                --b.fileListCount;
                b.fileListCount == 0 ? d.hide(b.fileColumn) : b.fileColumnTitle.innerHTML = "\u6587\u4ef6(" + b.fileListCount + ")";
                break;
            case j.APP:
                A[c.id].destroy();
                delete A[c.id];
                --b.appListCount;
                b.appListCount == 0 ? d.hide(b.appColumn) : b.appColumnTitle.innerHTML = "\u5e94\u7528(" + b.appListCount + ")";
                break;
            case j.BUDDY:
            case j.GROUP:
                var e = B[c.id];
                e && e.destroy();
                delete B[c.id];
                --b.contactListCount;
                b.contactListCount == 0 ? d.hide(b.contactColumn) : b.contactColumnTitle.innerHTML = "\u8054\u7cfb\u4eba(" + b.contactListCount + ")"
            }
            alloy.fileSystem.getFolderById(a).items.length == 0 && d.show(b.emptyColumn)
        };
        this.addFileIcon = D;
        this.showLoading = z;
        this.hideLoading = function () {
            d.hide(s)
        };
        this._window = e;
        o();
        alloy.portal.getLoginLevel() < 2 || (z(), alloy.fileSystem.getFolderItems(x));
        e.show();
        this.showWindow = function () {
            e.show();
            e.setCurrent()
        }
    };
    this.createWindow = function () {};
    var l = {
        onRunFirst: function () {
            f.addObserver(alloy.fileSystem, "FileAdd", l.onFileAdd);
            f.addObserver(alloy.fileSystem, "FileDelete", l.onFileDelete);
            f.addObserver(alloy.fileSystem, "FileMove", l.onFileMove);
            f.addObserver(alloy.fileSystem, "GetFolderItemSuccess", l.getFolderItemsSuccess);
            f.addObserver(alloy.fileSystem, "GetFolderItemFail", l.getFolderItemsError);
            f.addObserver(alloy.fileSystem, "FileUpdate", l.onFileUpdate);
            w = alloy.layout.getDesktop().body;
            C = alloy.desktopManager.getDragController();
            f.addObserver(n.ui, "drop", l.fileDrop)
        },
        onRunAgain: function () {},
        onRun: function (c) {
            c.file && (c.type == "quick" ? m[c.file.id] || (m[c.file.id] = new P(c)) : k[c.file.id] ? k[c.file.id].showWindow() : k[c.file.id] = new H(c))
        },
        fileDrop: function (c) {
            for (var a in k) {
                var b = k[a];
                if (I(c.dropEl, b._window.body)) {
                    var d = c.apperceiveEl,
                        f = d.getAttribute("type"),
                        h = parseInt(d.getAttribute("fileId"));
                    if (f == j.FOLDER) return;
                    else if (f == j.FILE) {
                        var e = alloy.iconFactory.getIcons(h, alloy.fileSystem.FILE_TYPE.FILE);
                        i = 0;
                        for (len = e.length; i < len; i++) if (e[i].isUploading()) return
                    }
                    var h = {
                        t: f,
                        id: h
                    }, g, e = d.getAttribute("from");
                    if (e == "buddy") {
                        if (f == j.GROUP) h.gid = parseInt(d.getAttribute("gid"));
                        alloy.desktopContact.addContactIcon(h, b.id, 0)
                    } else(g = alloy.fileSystem.getFileInfoByFile(h)) && g.parent.id != b.id && alloy.fileSystem.moveFile(g.file, b.id, - 1, g.parent.id, g.position, !0);
                    break
                }
            }
            for (a in m) if (I(c.dropEl, m[a].quickViewContainer)) {
                d = c.apperceiveEl;
                f = d.getAttribute("type");
                if (f == j.FOLDER) break;
                h = parseInt(d.getAttribute("fileId"));
                h = {
                    t: f,
                    id: h
                };
                e = d.getAttribute("from");
                if (e == "buddy") {
                    if (f == j.GROUP) h.gid = parseInt(d.getAttribute("gid"));
                    alloy.desktopContact.addContactIcon(h, a, 0)
                } else(g = alloy.fileSystem.getFileInfoByFile(h)) && g.parent.id != a && alloy.fileSystem.moveFile(g.file, a, - 1, g.parent.id, g.position, !0);
                break
            }
        },
        onFileAdd: function (c) {
            var a = c.parent.id,
                c = c.file,
                b = k[a];
            b && b.addFileIcon(c);
            (a = m[a]) && a.addFileIcon(c)
        },
        onFileDelete: function (c) {
            var a = c.parent.id,
                c = c.file,
                b = k[a];
            b && b.deleteFileIcon(c);
            (a = m[a]) && a.deleteFileIcon(c);
            (b = k[c.id]) && b._window.close()
        },
        onFileUpdate: function (c) {
            k[c.id] && f.notifyObservers(alloy.taskBar, "UpdateTaskName", {
                appId: "_folder",
                id: k[c.id]._window.option.windowId,
                name: c.n
            })
        },
        onDesktopSwitch: function (c) {
            for (c in m) m[c].destroy();
            for (var a in k) {
                var b = k[a];
                b.folderInfo.pid == c ? b.showflashUploadNode() : b.hideFlashUploadNode()
            }
        },
        onFileMove: function (c) {
            var a = c.targetId,
                b = c.sourceId,
                c = c.file,
                d = k[a];
            d && d.addFileIcon(c);
            (a = m[a]) && a.addFileIcon(c);
            (a = k[b]) && a.deleteFileIcon(c);
            (b = m[b]) && b.deleteFileIcon(c)
        },
        getFolderItemsSuccess: function (c) {
            var a = c.arguments.obj,
                b = a.id,
                d = k[b];
            d && (d.hideLoading(), c.result.is_modify == 1 && (alloy.fileSystem.deleteFiles(a.items, b, !1), alloy.fileSystem.addFiles(c.result.obj.items, b, !1)))
        },
        getFolderItemsError: function (c) {
            (c = k[c.arguments.obj.id]) && c.showLoading("\u4ece\u7f51\u76d8\u540c\u6b65\u6587\u4ef6\u5931\u8d25\uff01")
        },
        onExit: function () {},
        stopPropagation: function (c) {
            c.stopPropagation()
        }
    };
    f.addObserver(this, "runFirst", l.onRunFirst);
    f.addObserver(this, "run", l.onRun);
    f.addObserver(alloy.system, "DesktopSwitch", l.onDesktopSwitch)
});
