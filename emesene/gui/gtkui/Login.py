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

import gtk
import base64
import gobject
import sys

import e3
import gui
import utils
import extension
import StatusButton
import stock

import logging
log = logging.getLogger('gtkui.Login')

class LoginBaseUI(gtk.Alignment):
    ''' base widget that holds the visual stuff '''
    def __init__(self, callback, args=None):
        gtk.Alignment.__init__(self, xalign=0.5, yalign=0.5, xscale=0.0,
            yscale=1.0)

        self.dialog = extension.get_default('dialog')
        Avatar = extension.get_default('avatar')
        NiceBar = extension.get_default('nice bar')

        self.liststore = gtk.ListStore(gobject.TYPE_STRING, gtk.gdk.Pixbuf)
        completion = gtk.EntryCompletion()
        completion.set_model(self.liststore)
        pixbufcell = gtk.CellRendererPixbuf()
        completion.pack_start(pixbufcell)
        completion.add_attribute(pixbufcell, 'pixbuf', 1)
        completion.set_text_column(0)
        completion.set_inline_selection(True)

        self.pixbuf = utils.safe_gtk_pixbuf_load(gui.theme.image_theme.user)

        self.cmb_account = gtk.ComboBoxEntry(self.liststore, 0)
        self.cmb_account.set_tooltip_text(_('Account'))
        self.cmb_account.get_children()[0].set_completion(completion)
        self.cmb_account.get_children()[0].connect('key-press-event',
            self._on_account_key_press)
        self.cmb_account.connect('changed',
            self._on_account_changed)
        self.acc_key_rel_handler = self.cmb_account.connect('key-release-event',
                                                   self._on_account_key_release)

        self.btn_status = StatusButton.StatusButton()
        self.btn_status.set_tooltip_text(_('Status'))
        self.btn_status.set_status(e3.status.ONLINE)
        self.btn_status.set_size_request(34, -1)

        self.txt_password = gtk.Entry()
        self.txt_password.set_tooltip_text(_('Password'))
        self.txt_password.set_visibility(False)
        self.txt_password.connect('key-press-event',
            self._on_password_key_press)
        self.txt_password.connect('changed', self._on_password_changed)
        self.txt_password.set_sensitive(False)

        pix_account = utils.safe_gtk_pixbuf_load(gui.theme.image_theme.user)
        pix_password = utils.safe_gtk_pixbuf_load(gui.theme.image_theme.password)

        self.avatar = Avatar()

        self.remember_account = gtk.CheckButton(_('Remember me'))
        self.remember_password = gtk.CheckButton(_('Remember password'))
        self.auto_login = gtk.CheckButton(_('Auto-login'))

        self.remember_account.connect('toggled',
            self._on_remember_account_toggled)
        self.remember_password.connect('toggled',
            self._on_remember_password_toggled)
        self.auto_login.connect('toggled',
            self._on_auto_login_toggled)

        self.remember_account.set_sensitive(False)
        self.remember_password.set_sensitive(False)
        self.auto_login.set_sensitive(False)

        self.forget_me = gtk.Button()
        self.forget_me.set_tooltip_text(_('Delete user'))
        forget_img = gtk.image_new_from_stock(gtk.STOCK_CANCEL,
                                              gtk.ICON_SIZE_MENU)
        self.forget_me.set_image(forget_img)
        self.forget_me.set_relief(gtk.RELIEF_NONE)
        self.forget_me.set_border_width(0)
        self.forget_me.set_size_request(34, -1)
        self.forget_me.connect('clicked', self._on_forget_me_clicked)
        self.forget_me.set_sensitive(False)

        hboxremember = gtk.HBox(spacing=2)
        hboxremember.pack_start(self.remember_account, False)

        vbox_remember = gtk.VBox(spacing=4)
        vbox_remember.set_border_width(8)
        vbox_remember.pack_start(hboxremember)
        vbox_remember.pack_start(self.remember_password)
        vbox_remember.pack_start(self.auto_login)
        vbox_remember.pack_start(gtk.Label())

        self.b_connect = gtk.Button(stock=gtk.STOCK_CONNECT)
        self.b_connect.set_sensitive(False)

        self.b_cancel = gtk.Button(stock=gtk.STOCK_CANCEL)
        self.b_cancel.connect('clicked', self._on_cancel_clicked)

        vbuttonbox = gtk.VButtonBox()
        vbuttonbox.set_spacing(8)
        vbuttonbox.pack_start(self.b_connect)
        vbuttonbox.pack_start(self.b_cancel)

        vbox_content = gtk.VBox()

        hbox_account = gtk.HBox(spacing=6)
        img_accountpix = gtk.Image()
        img_accountpix.set_from_pixbuf(utils.scale_nicely(pix_account))
        hbox_account.pack_start(img_accountpix, False)
        hbox_account.pack_start(self.cmb_account)
        hbox_account.pack_start(self.forget_me, False)

        hbox_password = gtk.HBox(spacing=6)
        img_password = gtk.Image()
        img_password.set_from_pixbuf(utils.scale_nicely(pix_password))
        hbox_password.pack_start(img_password, False)
        hbox_password.pack_start(self.txt_password)
        hbox_password.pack_start(self.btn_status, False)

        session_combo_store = gtk.ListStore(gtk.gdk.Pixbuf, str)
        crp = gtk.CellRendererPixbuf()
        crt = gtk.CellRendererText()
        crp.set_property("xalign", 0)
        crt.set_property("xalign", 0)

        self.session_combo = gtk.ComboBox()
        self.session_combo.set_tooltip_text(_('Choose your network'))
        self.session_combo.set_model(session_combo_store)
        self.session_combo.pack_start(crp)
        self.session_combo.pack_start(crt)
        self.session_combo.add_attribute(crp, "pixbuf", 0)
        self.session_combo.add_attribute(crt, "text", 1)

        self.b_preferences = gtk.Button()
        self.b_preferences.set_tooltip_text(_('Preferences'))
        self.img_preferences = gtk.image_new_from_stock(gtk.STOCK_PREFERENCES,
                                                        gtk.ICON_SIZE_MENU)
        self.img_preferences.set_sensitive(False)
        self.b_preferences.set_image(self.img_preferences)
        self.b_preferences.set_relief(gtk.RELIEF_NONE)
        self.b_preferences.connect('enter-notify-event',
            self._on_preferences_enter)
        self.b_preferences.connect('leave-notify-event',
            self._on_preferences_leave)
        self.b_preferences.connect('clicked',
            self._on_preferences_selected)
        self.b_preferences.set_size_request(34, -1)

        img_sessionpix = gtk.image_new_from_stock(gtk.STOCK_CONNECT,
                                                  gtk.ICON_SIZE_MENU)
        img_sessionpix.set_size_request(20, -1)
        img_sessionpix.set_sensitive(False)
        hbox_session = gtk.HBox(spacing=6)
        hbox_session.pack_start(img_sessionpix, False)
        hbox_session.pack_start(self.session_combo)
        hbox_session.pack_start(self.b_preferences, False)

        vbox_entries = gtk.VBox(spacing=12)
        vbox_entries.set_border_width(8)
        vbox_entries.pack_start(hbox_account)
        vbox_entries.pack_start(hbox_password)
        vbox_entries.pack_start(hbox_session)

        self.nicebar = NiceBar()

        th_pix = utils.safe_gtk_pixbuf_load(gui.theme.image_theme.throbber,
                                            None, animated=True)

        self.throbber = gtk.image_new_from_animation(th_pix)
        self.label_timer = gtk.Label()
        self.label_timer.set_markup(_('<b>Connection error!\n </b>'))

        al_label_timer = gtk.Alignment(xalign=0.5, yalign=0.5,
                                       xscale=0.0, yscale=0.0)

        al_throbber = gtk.Alignment(xalign=0.5, yalign=0.5,
                                    xscale=0.1, yscale=0.1)

        al_vbox_entries = gtk.Alignment(xalign=0.5, yalign=0.5,
                                        xscale=0.2, yscale=0.0)

        al_vbox_remember = gtk.Alignment(xalign=0.5, yalign=0.5,
                                         xscale=0.0, yscale=0.2)

        al_button = gtk.Alignment(xalign=0.5, yalign=0.5, xscale=0.2)

        al_account = gtk.Alignment(xalign=0.5, yalign=0.5,
                                   xscale=0.0, yscale=0.3)

        al_label_timer.add(self.label_timer)
        al_throbber.add(self.throbber)
        al_vbox_entries.add(vbox_entries)
        al_vbox_remember.add(vbox_remember)
        al_button.add(vbuttonbox)
        al_account.add(self.avatar)

        vbox = gtk.VBox()
        vbox_top = gtk.VBox()
        vbox_far_bottom = gtk.VBox()

        vbox_bottom = gtk.VBox(False)
        vbox_content.pack_start(gtk.Label(""), True, True)
        vbox_content.pack_start(al_account, True, False)
        vbox_content.pack_start(gtk.Label(""), True, True)
        vbox_content.pack_start(al_vbox_entries, False)
        vbox_content.pack_start(al_vbox_remember, True, False)
        vbox_bottom.set_size_request(-1, 100)
        vbox_bottom.pack_start(al_label_timer, True, False)
        vbox_bottom.pack_start(al_throbber, False)
        vbox_bottom.pack_start(gtk.Label(""), True, True)
        vbox_bottom.pack_start(al_button)
        vbox_content.pack_start(vbox_bottom)
        vbox_content.pack_start(gtk.Label(""), True, True)

        vbox.pack_start(self.nicebar, False)
        vbox.pack_start(vbox_top)
        vbox.pack_start(vbox_content)
        vbox.pack_start(vbox_far_bottom)

        self.add(vbox)
        vbox.show_all()

    def unsubscribe_signals(self):
        ''' overload this if needed '''
        pass

    def _on_cancel_clicked(self, button):
        '''
        overload this
        '''
        return

    def set_accels(self, parent, quit_cb):
        ''' set accels group to the given window '''
        accel_group = gtk.AccelGroup()
        parent.add_accel_group(accel_group)
        parent.accel_group = accel_group
        if sys.platform == 'darwin':
            accel_group.connect_group(gtk.keysyms.Q,
                                      gtk.gdk.META_MASK, gtk.ACCEL_LOCKED,
                                      quit_cb)
        else:
            accel_group.connect_group(gtk.keysyms.Q,
                                      gtk.gdk.CONTROL_MASK, gtk.ACCEL_LOCKED,
                                      quit_cb)
        accel_group.connect_group(gtk.keysyms.Escape,
                                  0, gtk.ACCEL_LOCKED,
                                  quit_cb)

class Login(LoginBaseUI, gui.LoginBase):
    '''
    widget that represents the login window
    '''
    def __init__(self, callback, on_preferences_changed,
                 config, config_dir, config_path, proxy=None,
                 use_http=None, use_ipv6=None, session_id=None, cancel_clicked=False,
                 no_autologin=False):

        LoginBaseUI.__init__(self, callback)
        gui.LoginBase.__init__(self, callback, on_preferences_changed,
                               config, config_dir, config_path,
                               proxy, use_http, use_ipv6, session_id, no_autologin)

        self.cancel_clicked = cancel_clicked

        account = self.config.get_or_set('last_logged_account', '')

        self.b_connect.connect('clicked', self._on_connect_clicked)

        self._combo_session_list = []
        self.new_combo_session()
        self._reload_account_list()

        avatar_path = self.current_avatar_path(account.rpartition('|')[0])
        self.avatar.set_from_file(avatar_path)

        self.nicebar.hide()
        self.throbber.hide()
        self.label_timer.hide()
        self.b_cancel.hide()

        if account != '':
            self.cmb_account.get_children()[0].set_text(
                account.rpartition('|')[0])

    def check_autologin(self):
        '''check if autologin is set and can be started'''
        if self.cancel_clicked:
            return

        account = self.config.get_or_set('last_logged_account', '')

        if account != '' and int(self.config.d_remembers.get(account, 0)) == 3 and \
           self.service_available(account.rpartition('|')[2]):
            password = self.decode_password(account)

            self.cmb_account.get_children()[0].set_text(account.rpartition('|')[0])
            self.txt_password.set_text(password)

            if not self.no_autologin:
                self.do_connect()

    def _get_active_service(self):
        '''fetch the active service from the session combo box'''
        active = self.session_combo.get_active()
        model = self.session_combo.get_model()
        service = model[active][1]
        return service

    def _on_session_changed(self, session_combo):
        service = self._get_active_service()
        ext = self.service2id[service][1]

        self._on_new_preferences(
            self.use_http, self.use_ipv6, self.proxy, service,
            ext.SERVICES[service]['host'], ext.SERVICES[service]['port'])

    def service_add_cb(self, s_name, service_name):
        '''Add a new service to the service combo'''
        if not s_name is None:
            image = utils.safe_gtk_pixbuf_load(s_name)
        else:
            image = None
        self.session_combo.get_model().append([image, service_name])

    def new_combo_session(self):
        '''populate service combo with avariable services'''
        index = gui.LoginBase.new_combo_session(self, self.service_add_cb)
        self.session_combo.set_active(index)
        self.session_combo.connect('changed', self._on_session_changed)
        self._combo_session_list.append(self.session_combo)

    def do_connect(self):
        '''
        do all the stuffs needed to connect
        '''
        self.nicebar.empty_queue()
        user = self.cmb_account.get_active_text().strip().lower()
        password = self.txt_password.get_text()
        account = e3.Account(user, password, self.btn_status.status,
                self.server_host)
        remember_password = self.remember_password.get_active()
        remember_account = self.remember_account.get_active()
        auto_login = self.auto_login.get_active()

        if user == '' or password == '':
            self.show_error(_('user or password fields are empty'))
            return

        self.config_account(account, self._get_active_service(),
                            remember_account, remember_password,
                            auto_login)

        account.uuid = self.account_uuid

        self.callback(account, self.session_id, self.proxy, self.use_http,
                      self.use_ipv6, self.server_host, self.server_port)

    def _on_account_changed(self, entry):
        '''
        called when the content of the account entry changes
        '''
        self._update_fields(self.cmb_account.get_active_text())

    def _on_account_key_release(self, entry, event):
        '''
        called when a key is released in the account field
        '''
        self._update_fields(self.cmb_account.get_active_text())
        if event.keyval == gtk.keysyms.Tab:
            self.txt_password.grab_focus()

    def _update_fields(self, account, from_preferences=False, from_dialog=False):
        '''
        update the different fields according to the account that is
        on the account entry
        '''
        if from_dialog:
            return

        self._clear_all()

        if self.txt_password.get_text() == '':
            self.remember_password.set_sensitive(False)
            self.auto_login.set_sensitive(False)

        if account == '':
            self.remember_account.set_sensitive(False)
            self.txt_password.set_text('')
            self.txt_password.set_sensitive(False)
            return

        self.remember_account.set_sensitive(True)

        service = self.config.d_user_service.get(account, 'msn')

        if not from_preferences:
            self.session_combo.set_active(
                self.session_name_to_index.get(service, 0))
        else:
            service = self._get_active_service()

        if not self.service_available(service):
            self.show_error(_("%s service is not supported on your system") %
                            service)
            return

        self.update_service(service)
        ext_id, ext = self.service2id[service]
        self.btn_status.set_sensitive(ext.SERVICE_STATUS in ext.CAPABILITIES)

        if account + '|' + service in self.accounts:
            account_and_service = account + '|' + service
            attr = int(self.remembers[account_and_service])
            self.remember_account.set_sensitive(False)
            self.forget_me.set_sensitive(True)
            self.btn_status.set_status(int(self.status[account_and_service]))

            passw = self.decode_password(account_and_service)
            avatar_path = self.current_avatar_path(account)
            self.avatar.set_from_file(avatar_path)

            if attr == 3:#autologin,password,account checked
                self.txt_password.set_text(passw)
                self.txt_password.set_sensitive(False)
                self.auto_login.set_active(True)
            elif attr == 2:#password,account checked
                self.txt_password.set_text(passw)
                self.txt_password.set_sensitive(False)
                self.remember_password.set_active(True)
            elif attr == 1:#only account checked
                self.remember_account.set_active(True)
                self.remember_account.set_sensitive(True)
                self.remember_password.set_sensitive(False)
                self.auto_login.set_sensitive(False)
            else:#if i'm here i have an error
                self.show_error(_(
                          'Error while reading user config'))
                self._clear_all()
        else:
            self.avatar.set_from_file(gui.theme.image_theme.logo)

    def _clear_all(self):
        '''
        clear all login fields and checkbox
        '''
        self.remember_account.set_active(False)
        self.remember_account.set_sensitive(True)
        self.remember_password.set_active(False)
        self.remember_password.set_sensitive(True)
        self.auto_login.set_active(False)
        self.forget_me.set_sensitive(False)
        self.btn_status.set_status(e3.status.ONLINE)
        self.txt_password.set_sensitive(True)

    def clear_all(self):
        '''
        call clear_all and clean also the account combobox
        '''
        self._clear_all()
        self.cmb_account.get_children()[0].set_text('')

    def show_error(self, reason, login_failed=False):
        '''
        show an error on the top of the window using nicebar
        '''
        if login_failed:
            self.auto_login.set_active(False)
        self.nicebar.new_message(reason, gtk.STOCK_DIALOG_ERROR)

    def _reload_account_list(self, *args):
        '''
        reload the account list in the combobox
        '''
        self.liststore.clear()
        mail_list = []
        for account in sorted(self.accounts):
            mail = account.rpartition('|')[0]
            if mail not in mail_list:
                mail_list.append(mail)
                self.liststore.append([mail, utils.scale_nicely(self.pixbuf)])

        #this resolves a small bug
        if not len(self.liststore):
            self.liststore = None

    def _on_password_key_press(self, widget, event):
        '''
        called when a key is pressed on the password field
        '''
        self.nicebar.empty_queue()
        if event.keyval == gtk.keysyms.Return or \
           event.keyval == gtk.keysyms.KP_Enter:
            self.do_connect()

    def _on_password_changed(self, widget):
        '''
        called when the password in the combobox changes
        '''
        state = (self.txt_password.get_text() != "")

        self.remember_password.set_sensitive(state)
        self.auto_login.set_sensitive(state)
        self.b_connect.set_sensitive(state)

    def _on_account_key_press(self, widget, event):
        '''
        called when a key is pressed on the password field
        '''
        self.nicebar.empty_queue()
        if event.keyval == gtk.keysyms.Return or \
           event.keyval == gtk.keysyms.KP_Enter:
            self.txt_password.grab_focus()
            if not self.txt_password.is_focus():
                self.do_connect()

    def _on_forget_me_clicked(self, *args):
        '''
        called when the forget me label is clicked
        '''
        def _yes_no_cb(response):
            '''callback from the confirmation dialog'''
            if response == stock.YES:
                account = self.cmb_account.get_active_text()
                service = self._get_active_service()
                self.forget_user(account, service)
                self._reload_account_list()
                self.cmb_account.get_children()[0].set_text('')

        self.dialog.yes_no(
               _('Are you sure you want to delete the account %s ?') % \
                      self.cmb_account.get_active_text(), _yes_no_cb)

    def _on_connect_clicked(self, button):
        '''
        called when connect button is clicked
        '''
        self.avatar.stop()
        self.do_connect()

    def _on_quit(self):
        '''
        close emesene
        '''
        while gtk.events_pending():
                gtk.main_iteration(False)

        sys.exit(0)

    def _on_remember_account_toggled(self, button):
        '''
        called when the remember account check button is toggled
        '''
        if not self.remember_account.get_active():
            self.remember_password.set_active(False)

    def _on_remember_password_toggled(self, button):
        '''
        called when the remember password check button is toggled
        '''
        if self.remember_password.get_active():
            self.remember_account.set_active(True)
            self.remember_account.set_sensitive(False)
            self.txt_password.set_sensitive(False)
        else:
            self.remember_account.set_sensitive(True)
            self.txt_password.set_sensitive(True)
            self.txt_password.set_text('')

    def _on_auto_login_toggled(self, button):
        '''
        called when the auto-login check button is toggled
        '''
        if self.auto_login.get_active():
            self.remember_password.set_active(True)
            self.remember_account.set_sensitive(False)
            self.remember_password.set_sensitive(False)
        else:
            self.remember_password.set_sensitive(True)

    def _on_preferences_enter(self, button, event):
        '''
        called when the mouse enters the preferences button
        '''
        self.img_preferences.set_sensitive(True)

    def _on_preferences_leave(self, button, event):
        '''
        called when the mouse leaves the preferences button
        '''
        self.img_preferences.set_sensitive(False)

    def _on_preferences_selected(self, button):
        '''
        called when the user clicks the preference button
        '''
        account = self.cmb_account.get_active_text()
        self._on_preferences_open(account, self._on_new_preferences)

    def _on_new_preferences(self, use_http, use_ipv6, proxy,
                            service, server_host, server_port, from_dialog=False):
        '''
        called when the user press accept on the preferences dialog
        '''
        self.session_id = self.service2id[service][0]
        self.use_http = use_http
        self.use_ipv6 = use_ipv6
        self.server_host = server_host
        self.server_port = server_port
        self.proxy = proxy

        self.on_preferences_changed(self.use_http, self.use_ipv6, self.proxy,
                                    self.session_id, service)

        self._update_fields(self.cmb_account.get_active_text(), True, from_dialog)

        def searchService(model, path, iter, user_data):
            if(model.get(iter,0)[0]==user_data[0]):
                user_data[2].set_active(user_data[1])
                return True
            user_data[1]+=1
            return False

        i = 0

        for combo in self._combo_session_list:
            combo.get_model().foreach(searchService, [service, i, combo])

class ConnectingWindow(Login):
    '''
    widget that represents the GUI interface showed when connecting
    '''
    def __init__(self, callback, avatar_path, config):
        LoginBaseUI.__init__(self, callback)

        self.callback = callback
        self.avatar.set_from_file(avatar_path)

        #for reconnecting
        self.reconnect_timer_id = None

        # Disconnect inherited and unneeded event
        self.cmb_account.disconnect(self.acc_key_rel_handler)

        account = config.get_or_set('last_logged_account', '')
        remembers = config.get_or_set('d_remembers', {})

        if not (account == ''):
            attr = int(remembers[account])
            if attr == 3:#autologin,password,account checked
                self.auto_login.set_active(True)
            elif attr == 2:#password,account checked
                self.remember_password.set_active(True)
            elif attr == 1:#only account checked
                self.remember_account.set_active(True)

            password = base64.b64decode(config.d_accounts.get(account, ""))
            self.cmb_account.get_children()[0].set_text(account.rpartition('|')[0])
            self.txt_password.set_text(password)

        #FIXME: If not account remembered, txt_password & cmb_account, left without text.
        self.cmb_account.set_sensitive(False)
        self.b_preferences.set_sensitive(False)
        self.btn_status.set_sensitive(False)
        self.txt_password.set_sensitive(False)
        self.nicebar.hide()
        self.throbber.show()
        self.label_timer.hide()

        self.b_connect.set_label(_("Connect now"))
        self.b_connect.set_sensitive(True)
        self.b_connect.hide()

    def _update_fields(self, *args):
        ''' override the login method with "do nothing" '''
        return

    def _on_password_changed(self, widget):
        ''' overload the login one '''
        state = 0

        self.remember_account.set_sensitive(state)
        self.remember_password.set_sensitive(state)
        self.auto_login.set_sensitive(state)

    def _on_cancel_clicked(self, button):
        '''
        cause the return to login window
        '''
        self.cancel_clicked=True
        self.avatar.stop()
        if self.reconnect_timer_id is not None:
            gobject.source_remove(self.reconnect_timer_id)
        self.reconnect_timer_id = None
        self.callback()

    def _on_connect_now_clicked(self, button, callback, account, session_id,
                                proxy, use_http, use_ipv6, service):
        '''
        don't wait for timout to reconnect
        '''
        button.hide()
        self.avatar.stop()
        gobject.source_remove(self.reconnect_timer_id)
        self.reconnect_timer_id = None
        callback(account, session_id, proxy, use_http, use_ipv6,\
                 service[0], service[1], on_reconnect=True)

    def clear_connect(self):
        '''
        clean the connect interface after the reconnect phase
        '''
        self.label_timer.hide()
        self.throbber.show()

    def on_reconnect(self, callback, account, session_id,
                     proxy, use_http, use_ipv6, service):
        '''
        show the reconnect countdown
        '''
        self.label_timer.show()
        self.b_connect.show()
        self.b_connect.connect('clicked', self._on_connect_now_clicked,
                               callback, account, session_id, proxy,
                               use_http, use_ipv6, service)

        self.throbber.hide()
        self.reconnect_after = 30
        if self.reconnect_timer_id is None:
            self.reconnect_timer_id = gobject.timeout_add_seconds(1, \
                                            self.update_reconnect_timer,
                                            callback, account, session_id,
                                            proxy, use_http, use_ipv6, service)

        self.update_reconnect_timer(callback, account, session_id,
                                    proxy, use_http, use_ipv6, service)

    def update_reconnect_timer(self, callback, account, session_id,
                               proxy, use_http, use_ipv6, service):
        '''
        updates reconnect label and launches login if counter is 0
        '''
        self.reconnect_after -= 1
        self.label_timer.set_text(_('Reconnecting in %d seconds')\
                                             % self.reconnect_after )
        if self.reconnect_after <= 0:
            gobject.source_remove(self.reconnect_timer_id)
            self.reconnect_timer_id = None
            self.b_connect.hide()
            #do login
            callback(account, session_id, proxy, use_http, use_ipv6,\
                     service[0], service[1], on_reconnect=True)
            return False
        else:
            return True
