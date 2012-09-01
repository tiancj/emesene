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
import gtk
import time
import pango
import datetime

import e3
import gui
import utils
import extension
import gobject
import gui.base.ConversationStatus as ConversationStatus

import logging
log = logging.getLogger('gtkui.ContactInformation')

from IconView import IconView
from SearchEntry import SearchEntry

class ContactInformation(gtk.Window, gui.base.ContactInformation):
    '''a window that displays information about a contact'''

    def __init__(self, session, account):
        '''constructor'''
        gui.base.ContactInformation.__init__(self, session, account)
        gtk.Window.__init__(self)
        self.session = session
        self.set_default_size(640, 350)
        self.set_title(_('Contact information (%s)') % (account,))
        self.set_position(gtk.WIN_POS_CENTER)

        self.tabs = gtk.Notebook()

        self._create_tabs()
        self.tabs.show_all()

        self.chats.nicebar.hide()

        self.add(self.tabs)

        self.fill_all()

    def _create_tabs(self):
        '''create all the tabs on the window'''
        self.info = InformationWidget(self.session, self.account)

        self.avatar_manager = gui.base.AvatarManager(self.session)

        account_path = self.avatar_manager.get_contact_avatars_dir(self.account)

        self.avatars = IconView(_('Avatar history'), [account_path],
                        None, None, IconView.TYPE_SELF_PICS, None)
        self.status = ListWidget(self.session, self.account)
        self.chats = ChatWidget(self.session, self.account)

        self.tabs.append_page(self.info, gtk.Label(_('Information')))
        if self.session.session_has_service(e3.Session.SERVICE_CONTACT_NICK):
            self.nicks = ListWidget(self.session, self.account)
            self.tabs.append_page(self.nicks, gtk.Label(_('Nick history')))
        self.tabs.append_page(self.avatars, gtk.Label(_('Avatar history')))
        if self.session.session_has_service(e3.Session.SERVICE_CONTACT_PM):
            self.messages = ListWidget(self.session, self.account)
            self.tabs.append_page(self.messages, gtk.Label(_('Message history')))
        self.tabs.append_page(self.status, gtk.Label(_('Status history')))
        self.tabs.append_page(self.chats, gtk.Label(_('Chat history')))

    def add_nick(self, stat, timestamp, nick):
        '''add a nick to the list of nicks'''
        self.nicks.add(stat, timestamp, nick)

    def add_message(self, stat, timestamp, message):
        '''add a message to the list of message'''
        self.messages.add(stat, timestamp, message)

    def add_status(self, stat, timestamp, status):
        '''add a status to the list of status'''
        self.status.add(stat, timestamp, status)


class InformationWidget(gtk.VBox):
    '''shows information about the contact'''

    def __init__(self, session, account):
        '''constructor'''
        gtk.VBox.__init__(self)
        self.set_border_width(2)

        self.session = session
        if self.session:
            self.contact = self.session.contacts.get(account)
        else:
            self.contact = None

        SmileyLabel = extension.get_default('smiley label')
        self.nick = SmileyLabel()
        self.nick.set_alignment(0.0, 0.5)
        self.nick.set_ellipsize(pango.ELLIPSIZE_END)
        self.mail = gtk.Label()
        self.mail.set_alignment(0.0, 0.5)
        self.mail.set_ellipsize(pango.ELLIPSIZE_END)
        self.mail.set_selectable(True)
        self.message = SmileyLabel()
        self.message.set_ellipsize(pango.ELLIPSIZE_END)
        self.message.set_alignment(0.0, 0.5)
        self.status = gtk.Image()
        self.status.set_alignment(0.0, 0.5)
        Avatar = extension.get_default('avatar')
        self.image = Avatar()
        image_align = gtk.Alignment(0.5, 0.5)
        image_align.add(self.image)
        self.blocked = gtk.Label()
        self.blocked.set_alignment(0.0, 0.5)
        self.blocked.set_ellipsize(pango.ELLIPSIZE_END)

        table = gtk.Table(4, 2, False)
        table.set_border_width(20)
        table.set_row_spacings(10)
        table.set_col_spacings(10)

        l_image = gtk.Label(_('Image'))
        l_image.set_alignment(0.0, 0.5)
        l_nick = gtk.Label(_('Nick'))
        l_nick.set_alignment(0.0, 0.5)
        l_mail = gtk.Label(_('E-Mail'))
        l_mail.set_alignment(0.0, 0.5)
        l_status = gtk.Label(_('Status'))
        l_status.set_alignment(0.0, 0.5)
        l_message = gtk.Label(_('Message'))
        l_message.set_alignment(0.0, 0.5)
        l_blocked = gtk.Label(_('Blocked'))
        l_blocked.set_alignment(0.0, 0.5)

        table.attach(l_nick, 0, 1, 0, 1, 0)
        table.attach(self.nick, 1, 2, 0, 1)
        table.attach(l_mail, 0, 1, 1, 2, 0)
        table.attach(self.mail, 1, 2, 1, 2)
        table.attach(l_status, 0, 1, 2, 3, 0)
        table.attach(self.status, 1, 2, 2, 3)
        table.attach(l_message, 0, 1, 3, 4, 0)
        table.attach(self.message, 1, 2, 3, 4)
        table.attach(l_blocked, 0, 1, 4, 5, 0)
        table.attach(self.blocked, 1, 2, 4, 5)

        hbox = gtk.HBox(False, 0)
        self.set_border_width(15)
        hbox.pack_start(image_align, False, False)
        hbox.pack_start(table, True, True)

        self.pack_start(hbox, False, False)

        self.update_information()

    def update_information(self):
        '''update the information of the contact'''
        if self.contact:
            if self.contact.display_name == self.contact.nick:
                self.nick.set_markup(
                        gobject.markup_escape_text(self.contact.display_name))
            else:
                self.nick.set_markup(
                        gobject.markup_escape_text(self.contact.nick
                            + ' (' + self.contact.display_name + ')'))

            self.mail.set_markup(self.contact.account)
            self.message.set_markup(
                gobject.markup_escape_text(self.contact.message))
            self.status.set_from_file(
            gui.theme.image_theme.status_icons[self.contact.status])

            self.image.set_from_file(self.contact.picture,
                                     self.contact.blocked)

            if self.contact.blocked:
                self.blocked.set_markup(_('Yes'))
            else:
                self.blocked.set_markup(_('No'))


class ListWidget(gtk.VBox):
    '''a widget that displays the history of some information with status,
    date and the information provided'''

    def __init__(self, session, account):
        '''constructor'''
        gtk.VBox.__init__(self)
        self.set_border_width(2)

        self.session = session
        if self.session:
            self.contact = self.session.contacts.get(account)

        scroll = gtk.ScrolledWindow()
        scroll.set_policy(gtk.POLICY_AUTOMATIC, gtk.POLICY_AUTOMATIC)
        scroll.set_shadow_type(gtk.SHADOW_IN)

        self.model = gtk.ListStore(gtk.gdk.Pixbuf, str, str)
        self.list = gtk.TreeView(self.model)
        column = gtk.TreeViewColumn()
        column.set_expand(False)
        column1 = gtk.TreeViewColumn()
        column1.set_expand(False)
        column2 = gtk.TreeViewColumn()
        column2.set_expand(True)

        NickRenderer = extension.get_default('nick renderer')
        crt = NickRenderer()
        crt_timestamp = gtk.CellRendererText()
        crt.set_property('ellipsize', pango.ELLIPSIZE_END)
        pbr = gtk.CellRendererPixbuf()

        self.list.append_column(column)
        self.list.append_column(column1)
        self.list.append_column(column2)
        self.list.set_headers_visible(False)

        column.pack_start(pbr, False)
        column1.pack_start(crt_timestamp, False)
        column2.pack_start(crt, True)

        column.add_attribute(pbr, 'pixbuf', 0)
        column1.add_attribute(crt_timestamp, 'text', 1)
        column2.add_attribute(crt, 'markup', 2)

        scroll.add(self.list)

        self.pack_start(scroll, True, True)

    def add(self, stat, timestamp, text):
        '''add a row to the widget'''
        pix = utils.safe_gtk_pixbuf_load(gui.theme.image_theme.status_icons[stat])
        date_text = time.strftime('%c', time.localtime(timestamp))
        self.model.append((pix, date_text, text))

class ChatWidget(gtk.VBox):
    '''a widget that displays the history of nicks'''

    def __init__(self, session, account):
        '''constructor'''
        gtk.VBox.__init__(self)
        self.set_border_width(2)
        all = gtk.HBox()
        all.set_border_width(2)
        self.conv_status = ConversationStatus.ConversationStatus(session.config)

        self.search_mode = False

        self.calendars = gtk.VBox()
        self.calendars.set_border_width(2)

        chat_box = gtk.VBox()
        chat_box.set_border_width(2)

        self.session = session
        self.account = account

        if self.session:
            self.contact = self.session.contacts.get(account)

        NiceBar = extension.get_default('nice bar')
        self.nicebar = NiceBar()

        OutputText = extension.get_default('conversation output')
        self.text = OutputText(session.config, None)
        self.text.connect("search_request", self._search_request_cb)

        buttons = gtk.HButtonBox()
        buttons.set_border_width(2)
        buttons.set_layout(gtk.BUTTONBOX_END)
        save = gtk.Button(stock=gtk.STOCK_SAVE)
        refresh = gtk.Button(stock=gtk.STOCK_REFRESH)

        toggle_calendars = gtk.Button(_("Hide calendars"))

        buttons.pack_start(toggle_calendars)
        buttons.pack_start(refresh)
        buttons.pack_start(save)

        self.from_calendar = gtk.Calendar()
        from_year, from_month, from_day = self.from_calendar.get_date()
        from_datetime = datetime.date(from_year, from_month + 1,
                from_day) - datetime.timedelta(30)

        self.from_calendar.select_month(from_datetime.month - 1,
                from_datetime.year)
        self.from_calendar.select_day(from_datetime.day)
        self.to_calendar = gtk.Calendar()

        save.connect('clicked', self._on_save_clicked)
        refresh.connect('clicked', self._on_refresh_clicked)
        toggle_calendars.connect('clicked', self._on_toggle_calendars)

        self.calendars.pack_start(gtk.Label(_('Chats from')), False)
        self.calendars.pack_start(self.from_calendar, True, True)
        self.calendars.pack_start(gtk.Label(_('Chats to')), False)
        self.calendars.pack_start(self.to_calendar, True, True)

        #Search Widgets
        searchbox = gtk.HBox()
        search_label = gtk.Label(_("Search:"))
        self.search_entry = SearchEntry()
        self.search_entry.connect('icon-press', self._on_search_button_press)
        self.search_entry.connect('key-press-event', self._on_search_key_press)


        searchbox.pack_end(self.search_entry, False)
        searchbox.pack_end(search_label, False)

        chat_box.pack_start(self.nicebar, False)
        chat_box.pack_start(searchbox, False)
        chat_box.pack_start(self.text, True, True)

        all.pack_start(self.calendars, False)
        all.pack_start(chat_box, True, True)

        self.pack_start(all, True, True)
        self.pack_start(buttons, False)
        self.refresh_history()

    def _on_search_button_press(self, entry, icon_pos, event):
        '''called when the search button is clicked
        '''
        self._search_history(entry.get_text())

    def _on_search_key_press(self, entry, event):
        '''activates search when enter is pressed
        '''
        if event.keyval == gtk.keysyms.Return:
            self._search_history(entry.get_text())

    def _search_history(self, keywords):
        '''search history for certain keywords
        '''
        from_t = self._get_from_timestamp()
        to_t = self._get_to_timestamp()

        self._prepare_history()
        self.search_mode = True
        self.session.logger.get_chats_by_keyword(self.account,
            self.session.account.account, from_t, to_t, keywords, 1000,
            self._on_chats_ready)

    def _search_request_cb(self, view, link):
        link = link[9:] #remove search://
        search_date = datetime.date.fromtimestamp(float(link))

        self.from_calendar.select_month(search_date.month-1, search_date.year)
        self.from_calendar.select_day(search_date.day)
        self.to_calendar.select_month(search_date.month-1, search_date.year)
        self.to_calendar.select_day(search_date.day)
        self.refresh_history()


    def _on_toggle_calendars(self, button):
        '''called when the toogle_calendars button is clicked
        '''
        if self.calendars.get_property('visible'):
            button.set_label(_('Show calendars'))
            self.calendars.hide()
        else:
            button.set_label(_('Hide calendars'))
            self.calendars.show()

    def _on_save_clicked(self, button):
        '''called when the save button is clicked'''
        def save_cb(response, filename=None):
            '''called when the closes the save dialog'''
            if filename is not None and response == gui.stock.SAVE:
                self.save_chats(filename)

        home = os.path.expanduser('~')
        dialog = extension.get_default('dialog')
        dialog.save_as(home, save_cb)

    def _on_refresh_clicked(self, button):
        '''called when the refresh button is clicked'''
        self.refresh_history()

    def _prepare_history(self):
        '''clean up ouput'''
        self.nicebar.empty_queue()
        if self.contact:
            his_picture = self.contact.picture or utils.path_to_url(os.path.abspath(gui.theme.image_theme.user))
            my_picture = self.session.contacts.me.picture or utils.path_to_url(os.path.abspath(gui.theme.image_theme.user))
            self.text.clear(self.account, self.contact.nick, self.contact.display_name, my_picture, his_picture)
        else:
            self.text.clear()

    def request_information(self, msg):
        '''display a message for user'''
        contact = self.session.contacts.me
        message = e3.Message(e3.Message.TYPE_MESSAGE, msg, None, None)
        msg = gui.Message.from_information(contact, message)

        self.text.information(msg)
        self.conv_status.post_process_message(msg)
        self.conv_status.update_status()

    def refresh_history(self):
        '''refresh the history according to the values on the calendars
        '''
        self._prepare_history()
        self.request_information(_('Loading chat history. Hang tight for a moment...'))
        self.request_chats_between(1000, self._on_chats_ready)

    def _get_from_timestamp(self):
        '''read from_calendar widget and return a timestamp
        '''
        from_year, from_month, from_day = self.from_calendar.get_date()
        return time.mktime(datetime.date(from_year, from_month + 1,
            from_day).timetuple())

    def _get_to_timestamp(self):
        '''read to_calendar widget and return a timestamp
        '''
        to_year, to_month, to_day = self.to_calendar.get_date()
        return time.mktime((datetime.date(to_year, to_month + 1,
            to_day) + datetime.timedelta(1)).timetuple())

    def request_chats_between(self, limit, callback):
        from_t = self._get_from_timestamp()
        to_t = self._get_to_timestamp()
        self.session.logger.get_chats_between(self.account,
            self.session.account.account, from_t, to_t, limit, callback)

    def save_chats(self, path, limit=1000):
        '''request amount of messages between our account and the current
        account, save it to path'''
        def _on_save_chats_ready(results):
            '''called when the chats requested are ready
            '''
            if not results:
                return

            exporter = extension.get_default('history exporter')

            exporter(results, open(path, "w"))

        self.request_chats_between(limit, _on_save_chats_ready)

    def _on_chats_ready(self, results):
        '''called when the chat history is ready'''

        account_colors = {}
        style = e3.Style()
        font_color_default = style.color.to_hex()
        possible_colors = ["#0000FF", "#00FFFF", "#FF0000",
                           "#FF00FF", font_color_default]

        if not results:
            self.search_mode = False
            self.request_information(_("No chat history found"))
            return

        self.conv_status.clear()

        for stat, timestamp, msg_text, nick, account in results:
            is_me = self.session.contacts.me.account == account
            if is_me:
                contact = self.session.contacts.me
            else:
                contact = self.session.contacts.get(account)

            if contact is None:
                contact = e3.Contact(account, nick=nick)

            if self.search_mode:
                uri = " search://%s" % timestamp
                msg_text = msg_text + uri

            datetimestamp = datetime.datetime.utcfromtimestamp(timestamp)
            message = e3.Message(e3.Message.TYPE_OLDMSG, msg_text,
                        account, timestamp=datetimestamp)

            if is_me:
                msg = self.conv_status.pre_process_message(contact, message,
                    False, None, None, message.timestamp, message.type, None,
                    self.session.get_conv_parser())
                self.text.send_message(msg)
            else:
                try:
                    account_colors[account]
                except KeyError:
                    if not len(possible_colors) == 0:
                        account_colors[account] = possible_colors.pop()
                    else:
                        account_colors[account] = font_color_default

                message.style = self._get_style(account_colors[account])
                msg = self.conv_status.pre_process_message(contact, message,
                    True, None, None, message.timestamp, message.type, message.style,
                    self.session.get_conv_parser())
                self.text.receive_message(msg)

            self.conv_status.post_process_message(msg)
            self.conv_status.update_status()

        if len(results) >= 1000:
            self.nicebar.new_message(_('Too many messages to display'),
                gtk.STOCK_DIALOG_WARNING)

        self.search_mode = False

    def _get_style(self, color):

        try:
            color = e3.Color.from_hex(color)
        except ValueError:
            color = self.session.config.font_color = '#000000'
            color = e3.Color.from_hex(color)

        cstyle = e3.Style(color = color)

        return cstyle
