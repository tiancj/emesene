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

import gui
import e3
import extension

import sys
import logging
import SearchEntry

log = logging.getLogger('gtkui.MainWindow')


class MainWindow(gtk.VBox, gui.MainWindowBase):
    '''this class represents the widget that is shown when the user is logged
    in (menu, contact list etc)'''
    NAME = 'Main Window'
    DESCRIPTION = 'The window used when an account is logged in'
    AUTHOR = 'Mariano Guerra'
    WEBSITE = 'www.emesene.org'

    def __init__(self, session, on_new_conversation):
        '''class constructor'''
        gtk.VBox.__init__(self)
        gui.MainWindowBase.__init__(self, session, on_new_conversation)

        self.quit_cb = None
        UserPanel = extension.get_default('user panel')
        ContactList = extension.get_default('contact list')
        GroupContactList = extension.get_default('group contact list')
        RecentContactList = extension.get_default('recent contact list')

        self.notebook = gtk.Notebook()
        self.notebook.set_show_tabs(True)

        self.contact_list = ContactList(session)
        self.group_contact_list = GroupContactList(session)
        self.recent_contact_list = RecentContactList(session)

        scroll = gtk.ScrolledWindow()
        scroll.set_policy(gtk.POLICY_NEVER, gtk.POLICY_AUTOMATIC)
        scroll.set_shadow_type(gtk.SHADOW_IN)
        scroll.set_border_width(1)

        scroll1 = gtk.ScrolledWindow()
        scroll1.set_policy(gtk.POLICY_NEVER, gtk.POLICY_AUTOMATIC)
        scroll1.set_shadow_type(gtk.SHADOW_IN)
        scroll1.set_border_width(1)

        scroll2 = gtk.ScrolledWindow()
        scroll2.set_policy(gtk.POLICY_NEVER, gtk.POLICY_AUTOMATIC)
        scroll2.set_shadow_type(gtk.SHADOW_IN)
        scroll2.set_border_width(1)

        self.menu = None
        self.contact_menu = None
        self.group_menu = None

        self._build_menus()

        self.panel = UserPanel(session, self)
        self.panel.search.connect('toggled', self._on_search_toggled)
        self.panel.enabled = False

        self.entry = SearchEntry.SearchEntry()
        self.entry.connect('changed', self._on_entry_changed)
        self.entry.connect('key-press-event', self._on_entry_key_press)

        self.pack_start(self.menu, False)
        self.pack_start(self.below_menu, False)
        self.pack_start(self.panel, False)
        self.pack_start(self.below_panel, False)
        self.pack_start(self.entry, False)
        self.pack_start(self.notebook, True, True)
        self.pack_start(self.below_userlist, False)

        self.contact_list.contact_selected.subscribe(self._on_contact_selected)
        self.contact_list.group_selected.subscribe(self._on_group_selected)
        self.contact_list.contact_menu_selected.subscribe(
            self._on_contact_menu_selected)

        if self.session.session_has_service(e3.Session.SERVICE_GROUP_MANAGING):
            self.contact_list.group_menu_selected.subscribe(
                self._on_group_menu_selected)

        scroll.add(self.contact_list)
        scroll1.add(self.group_contact_list)
        scroll2.add(self.recent_contact_list)
        scroll.show_all()
        scroll1.show_all()
        scroll2.show_all()
        self.notebook.append_page(scroll, gtk.Label(_('Contacts')))
        self.notebook.append_page(scroll1, gtk.Label(_('Group/Session')))
        self.notebook.append_page(scroll2, gtk.Label(_('Recent')))
        self.notebook.show_all()

        self._on_show_userpanel_changed(self.session.config.b_show_userpanel)

    def _replace_widget(self, widget, new_extension, pos):
        if widget:
            self.remove(widget)
            widget = None
        if new_extension:
            widget = new_extension(self)
            self.pack_start(widget, False)
            self.reorder_child(widget, pos)
            widget.show()
        return widget

    def _on_mail_count_changed(self, count):
        self.panel.set_mail_count(count)

    def _on_social_request(self, conn_url):

        def get_token(token_url):
            '''strips the access token from an url'''
            if token_url is None:
                return token_url

            if token_url.find("#access_token=") == -1:
                return None

            pattern_start_token = "#access_token="
            pattern_end_token = "&expires_in"
            start_token = token_url.find(pattern_start_token) + len(pattern_start_token)
            end_token = token_url.find(pattern_end_token)
            return token_url[start_token:end_token]

        def set_token(token_url):
            '''callback used by webkit'''
            self.session.config.facebook_token = get_token(token_url)
            #only activate service if we have an access token
            activate = bool(self.session.config.facebook_token is not None)
            self.session.activate_social_services(activate)

        def set_token_fallback(response, data, token_url):
            '''callback used as fallback when webkit isn't avariable'''
            self.session.config.facebook_token = get_token(token_url)
            #only activate service if user press accept and we have an access token
            activate = bool(response == 1 and self.session.config.facebook_token is not None)
            self.session.activate_social_services(activate)

        dialog = extension.get_default('dialog')

        use_fallback = (gui.gtkui.WEBKITERROR or sys.platform == 'darwin' or
                        #FIXME: remove this check when webkit works on windows 7
                        (sys.platform == 'win32' and sys.getwindowsversion()[0] > 6))

        if not use_fallback:
            dialog.web_window(_("Connect Emesene and Facebook"),
                              conn_url, set_token)
        else:
            #Fallback method
            #Open a browser and ask user to copy the access token
            gui.base.Desktop.open(conn_url)
            w = dialog.entry_window("Url:", "", set_token_fallback, "Facebook Integration", None)
            lbl = dialog.window_add_label_vbox(w,
                  _("Please login into facebook and copy the url opened in your browser here"))
            lbl.set_selectable(False)
            w.vbox.reorder_child(lbl, 0)
            w.show()

    def _on_show_userpanel_changed(self, value):
        '''callback called when config.b_show_userpanel changes'''
        if value:
            self.panel.show()
        else:
            self.panel.hide()

    def _build_menus(self):
        '''buildall the menus used on the client'''

        handler = gui.base.MenuHandler(self.session, self.contact_list)

        contact_handler = gui.base.ContactHandler(self.session,
            self.contact_list)

        MainMenu = extension.get_default('main menu')
        ContactMenu = extension.get_default('menu contact')

        self.menu = MainMenu(handler, self.session)

        self.contact_menu = ContactMenu(contact_handler, self.session)
        self.contact_menu.show_all()
        if self.session.session_has_service(e3.Session.SERVICE_GROUP_MANAGING):
            group_handler = gui.base.GroupHandler(self.session,
                self.contact_list)
            GroupMenu = extension.get_default('menu group')
            self.group_menu = GroupMenu(group_handler)
            self.group_menu.show_all()

    def set_accels(self, parent, quit_cb):
        ''' set accels group to the given window '''
        self.quit_cb = quit_cb
        accel_group = gtk.AccelGroup()
        parent.add_accel_group(accel_group)
        parent.accel_group = accel_group
        self.menu.set_accels(accel_group)
        accel_group.connect_group(gtk.keysyms.F,
                                  gtk.gdk.CONTROL_MASK, gtk.ACCEL_LOCKED,
                                  self.on_key_search)
        accel_group.connect_group(gtk.keysyms.Escape,
                                  0, gtk.ACCEL_LOCKED,
                                  self.on_key_hide)

    def on_key_hide(self, accel_group, window, keyval, modifier):
        '''Catches Escape and closes the window'''
        if self.panel.nick.has_focus() or \
           self.panel.message.has_focus():
            # NOTE: need a better way to cancel focus
            self.contact_list.grab_focus()
            return True

        if self.panel.search.get_active():
            if self.entry.get_text_length() > 0:
                self.entry.set_text('')
                return True
            else:
                self.panel.search.set_active(False)
                return True
            return False

        if self.quit_cb:
            self.quit_cb()

    def on_key_search(self, accel_group, window, keyval, modifier):
        '''Catches Ctrl+F and opens or closes the search entry'''
        self.panel.search.set_active(not self.panel.search.get_active())
        if self.panel.search.get_active():
            self.entry.show()
            self.entry.grab_focus()
        else:
            self.entry.hide()

    def show(self):
        '''show the widget'''
        gtk.VBox.show(self)
        if not self.session.config.b_hide_menu:
            self.menu.show_all()
        self.contact_list.show()
        self.below_menu.show()
        self.below_panel.show()
        self.below_userlist.show()
        self.contact_list._set_accels(self.get_parent())

    def _on_entry_changed(self, entry, *args):
        '''called when the text on entry changes'''
        self.contact_list.filter_text = entry.get_text().lower()
        self.contact_list.expand_groups()
        self.contact_list.select_top_contact()

    def _on_entry_key_press(self, entry, event):
        '''called when a key is pressed on the search box'''
        if event.keyval == gtk.keysyms.Escape:
            self.panel.search.set_active(False)
            entry.hide()

    def _on_contact_selected(self, contact):
        '''callback for the contact-selected signal'''
        self.on_new_conversation_requested(contact.account)

    def _on_group_selected(self, group):
        '''callback for the group-selected signal'''
        pass

    def _on_contact_menu_selected(self, contact):
        '''callback for the contact-menu-selected signal'''
        if contact.blocked:
            self.contact_menu.set_blocked()
        else:
            self.contact_menu.set_unblocked()
        self.contact_menu.popup(None, None, None, 0, 0)

    def _on_group_menu_selected(self, group):
        '''callback for the group-menu-selected signal'''
        self.group_menu.update_items()
        self.group_menu.popup(None, None, None, 0, 0)

    def _on_key_press(self, widget, event):
        '''method called when a key is pressed on the input widget'''
        if not self.get_focus_child():
            return

        if (event.keyval == gtk.keysyms.Return or \
            event.keyval == gtk.keysyms.KP_Enter) and \
           self.panel.search.get_active():
            if not self.check_im_context_filter_keypress(self.entry, event):
                self.contact_list.open_conversation()
                self.panel.search.set_active(False)
                return True
            return False

        if event.state & gtk.gdk.CONTROL_MASK or \
           event.keyval == gtk.keysyms.Return or \
           event.keyval == gtk.keysyms.KP_Enter or \
           event.keyval == gtk.keysyms.Escape:
            return

        if not self.panel.nick.has_focus() and \
           not self.panel.message.has_focus():
            if event.string != "" and not self.panel.search.get_active():
                self.panel.search.set_active(True)

    def unsubscribe_signals(self, close=None):
        '''callback called when the disconnect option is selected'''
        gui.MainWindowBase.unsubscribe_signals(self)

        self.menu.remove_subscriptions()
        self.contact_list.contact_selected.unsubscribe(
            self._on_contact_selected)
        self.contact_list.group_selected.unsubscribe(self._on_group_selected)
        self.contact_list.contact_menu_selected.unsubscribe(
            self._on_contact_menu_selected)
        if self.session.session_has_service(e3.Session.SERVICE_GROUP_MANAGING):
            self.contact_list.group_menu_selected.unsubscribe(
                self._on_group_menu_selected)
        self.contact_list.remove_subscriptions()
        self.panel.remove_subscriptions()
        self.panel = None

    def _on_search_toggled(self, button):
        '''called when the search button is toggled'''
        if button.get_active():
            self.entry.show()
            self.entry.grab_focus()
            self.contact_list.is_searching = True
            # Using private member because i don't want to update config
            self.contact_list._show_empty_groups = True
            self.contact_list.refilter()
        else:
            self.entry.set_text('')
            self.entry.hide()
            self.contact_list.is_searching = False
            self.contact_list.show_empty_groups = self.session.config.b_show_empty_groups
            self.contact_list.un_expand_groups()

    def check_im_context_filter_keypress(self, target, event):
        ''' return True if the event is handled by Input Method '''
        if hasattr(target, 'im_context_filter_keypress') and \
           target.im_context_filter_keypress(event):
            return True
        return False
