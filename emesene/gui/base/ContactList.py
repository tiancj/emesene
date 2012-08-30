'''a abstract object that define the API of a contact list and some behavior'''
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

import e3
import extension

class ContactList(object):
    '''an abstract class that defines the api that the contact list should
    have'''
    NICK_TPL = '[$DISPLAY_NAME][$NL][$small][C=c10ud][$MESSAGE][/C][$/small]'

    GROUP_TPL = '[$b][$NAME] ([$ONLINE_COUNT]/[$TOTAL_COUNT])[$/b]'

    def __init__(self, session):
        '''class constructor'''

        self.is_searching = False
        # define the class signals
        # the param is the contact object
        self.contact_selected = e3.common.Signal()
        self.group_selected = e3.common.Signal()
        self.contact_menu_selected = e3.common.Signal()
        self.group_menu_selected = e3.common.Signal()

        self.contacts = session.contacts
        self.groups = session.groups
        self.session = session

        self.online_group = None
        self.no_group = None
        self.offline_group = None

        self.session.config.get_or_set('b_order_by_name', True)
        self.session.config.get_or_set('b_order_by_group', True)
        self.session.config.get_or_set('b_show_nick', True)
        self.session.config.get_or_set('b_show_empty_groups', False)
        self.session.config.get_or_set('b_show_offline', False)
        self.session.config.get_or_set('b_show_blocked', False)
        self.session.config.get_or_set('b_group_offline', False)
        group_state = self.session.config.get_or_set('d_group_state', {})

        self.group_state = {}
        for (group, state) in group_state.iteritems():
            group = group.encode("utf_8")
            try:
                self.group_state[group] = bool(int(state))
            except ValueError:
                self.group_state[group] = False

        self.session.config.subscribe(self._on_avatarssize_changed,
            'i_avatar_size')
        self.session.config.subscribe(self._on_nick_template_changed,
            'nick_template_clist')
        self.session.config.subscribe(self._on_group_template_changed,
            'group_template')

        self.avatar_size = self.session.config.get_or_set('i_avatar_size', 32)
        self.set_avatar_size(self.avatar_size)

        # self.order_by_status is a property that returns the inverse
        # value as the one of self.ordgroup add succeeder_by_group, the setter, set the inverse
        # value to this attribute
        self.order_by_group = self.session.config.b_order_by_group
        self.show_nick = self.session.config.b_show_nick
        self._order_by_name = self.session.config.b_order_by_name
        self._show_empty_groups = self.session.config.b_show_empty_groups
        self._show_offline = self.session.config.b_show_offline
        self._show_blocked = self.session.config.b_show_blocked
        self._group_offline = self.session.config.b_group_offline

        self._filter_text = ''

        # valid values:
        # + NICK
        # + ACCOUNT
        # + DISPLAY_NAME (alias if available, or nick if available or mail)
        # + STATUS
        # + MESSAGE
        # + BLOCKED (show the text "(blocked)" if the account is blocked)
        # + NL (new line)

        # valid formating are
        # [$s] [$/s] -> small
        # [$b] [$/b]
        # [$i] [$/i]
        self.nick_template = self.session.config.get_or_set('nick_template_clist',
            ContactList.NICK_TPL)

        # valid values:
        # + NAME
        # + ONLINE_COUNT
        # + TOTAL_COUNT
        self.group_template = self.session.config.get_or_set('group_template',
            ContactList.GROUP_TPL)

        self.session.signals.contact_list_ready.subscribe(
            self.on_contact_list_ready)
        self.session.signals.contact_added_you.subscribe(
            self.on_pending_contacts)
        #contact signals
        self.session.signals.contact_attr_changed.subscribe(
            self._on_contact_attr_changed)
        self.session.signals.picture_change_succeed.subscribe(
            self._on_contact_attr_changed)
        self.session.signals.contact_add_succeed.subscribe(
            self._on_add_contact)
        self.session.signals.contact_remove_succeed.subscribe(
            self._on_remove_contact)
        self.session.signals.group_add_contact_succeed.subscribe(
            self._on_add_contact_group)
        self.session.signals.group_remove_contact_succeed.subscribe(
            self._on_remove_contact_group)
        self.session.signals.contact_block_succeed.subscribe(
            self._on_contact_attr_changed)
        self.session.signals.contact_unblock_succeed.subscribe(
            self._on_contact_attr_changed)
        #group signals
        self.session.signals.group_add_succeed.subscribe(
            self._on_add_group)
        self.session.signals.group_remove_succeed.subscribe(
            self._on_remove_group)
        self.session.signals.group_rename_succeed.subscribe(
            self._on_update_group)
        #TODO fix offline group on connection e add fail signals

    def remove_subscriptions(self):
        '''disconnect signals subscriptions'''
        self.session.config.unsubscribe(self._on_avatarssize_changed,
            'i_avatar_size')
        self.session.config.unsubscribe(self._on_nick_template_changed,
            'nick_template_clist')
        self.session.config.unsubscribe(self._on_group_template_changed,
            'group_template')

        self.session.signals.contact_list_ready.unsubscribe(
            self.on_contact_list_ready)
        self.session.signals.contact_added_you.unsubscribe(
            self.on_pending_contacts)
        self.session.signals.contact_attr_changed.unsubscribe(
            self._on_contact_attr_changed)
        self.session.signals.picture_change_succeed.unsubscribe(
            self._on_contact_attr_changed)
        self.session.signals.contact_add_succeed.unsubscribe(
            self._on_add_contact)
        self.session.signals.contact_remove_succeed.unsubscribe(
            self._on_remove_contact)
        self.session.signals.group_add_contact_succeed.unsubscribe(
            self._on_add_contact_group)
        self.session.signals.group_remove_contact_succeed.unsubscribe(
            self._on_remove_contact_group)
        self.session.signals.contact_block_succeed.unsubscribe(
            self._on_contact_attr_changed)
        self.session.signals.contact_unblock_succeed.unsubscribe(
            self._on_contact_attr_changed)
        #group signals
        self.session.signals.group_add_succeed.unsubscribe(
            self._on_add_group)
        self.session.signals.group_remove_succeed.unsubscribe(
            self._on_remove_group)
        self.session.signals.group_rename_succeed.unsubscribe(
            self._on_update_group)

    def on_contact_list_ready(self):
        '''callback called when the contact list is ready to be used'''
        self.fill()
        self.on_pending_contacts()

    def on_pending_contacts(self):
        '''callback called when some contact is pending'''
        def on_contact_added_you(responses):
            '''
            callback called when the dialog is closed
            '''
            for account in responses['accepted']:
                self.session.add_contact(account)

            for account in responses['rejected']:
                self.session.reject_contact(account)

        if self.session.contacts.pending:
            accounts = []
            for contact in self.session.contacts.pending.values():
                accounts.append((contact.account, contact.display_name))

            dialog = extension.get_default('dialog')
            dialog.contact_added_you(accounts, on_contact_added_you)

    def _on_avatarssize_changed(self, value):
        '''callback called when config.i_avatar_size changes'''
        self.set_avatar_size(value)
        self.fill()

    def _on_nick_template_changed(self, value):
        '''callback called when config.nick_template_clist changes'''
        if self.nick_template != value:
            self.nick_template = value
            self.update_format_nick()

    def _on_group_template_changed(self, value):
        '''callback called when config.group_template changes'''
        if self.group_template != value:
            self.group_template = value
            self.update_format_group()

    def _on_contact_attr_changed(self, account, *args):
        '''called when an attribute of the contact changes
        '''
        contact = self.session.contacts.get(account)
        if not contact:
            return

        self.update_contact(contact)

    def _on_add_contact(self, account, *args):
        '''called when we add a contact
        '''
        contact = self.session.contacts.get(account)
        if not contact:
            return

        self.add_contact(contact)

    def _on_remove_contact(self, account, *args):
        '''called when we remove a contact
        '''
        contact = self.session.contacts.get(account)
        if not contact:
            return

        self.remove_contact(contact)

    def _on_add_contact_group(self, group, account, *args):
        '''called when we add a contact in a group
        '''
        contact = self.session.contacts.get(account)
        group = self.session.groups[group]

        if not contact:
            return
        elif not group:
            self.add_contact(contact)

        self.add_contact(contact, group)

    def _on_remove_contact_group(self, group, account, *args):
        '''called when we remove a contact from a group
        '''
        contact = self.session.contacts.get(account)
        group = self.session.groups[group]
        if not contact:
            return
        elif not group:
            self.remove_contact(contact)

        self.remove_contact(contact, group)

    def _on_add_group(self, group, *args):
        '''called when we add a group
        '''
        group = self.session.groups[group]

        if not group:
            return

        self.add_group(group)

    def _on_remove_group(self, group, *args):
        '''called when we remove a group
        '''
        c_group = self.session.groups[group]

        if not c_group:
            return

        self.remove_group(c_group)
        del self.session.groups[group]

    def _on_update_group(self, group, *args):
        '''called when we remove a group
        '''
        group = self.session.groups[group]

        if not group:
            return

        self.update_group(group)

    def _get_order_by_status(self):
        '''return the value of order by status'''
        return not self.order_by_group

    def _set_order_by_status(self, value):
        '''set the value of order by status'''
        self.order_by_group = not value

    order_by_status = property(fget=_get_order_by_status,
        fset=_set_order_by_status)

    def _get_order_by_group(self):
        '''return the value of order by group'''
        return self._order_by_group

    def _set_order_by_group(self, value):
        '''set the value of order by group'''
        self._order_by_group = value
        self.session.config.b_order_by_group = value
        self.fill()

    order_by_group = property(fget=_get_order_by_group,
        fset=_set_order_by_group)

    def _get_show_offline(self):
        '''return the value of self._show_offline'''
        return self._show_offline

    def _set_show_offline(self, value):
        '''set the value of self._show_offline to value and call to
        self.refilter()'''
        self._show_offline = value
        self.session.config.b_show_offline = self._show_offline
        self.refilter()

    show_offline = property(fget=_get_show_offline, fset=_set_show_offline)

    def _get_group_offline(self):
        '''return the value of self._group_offline'''
        return self._group_offline

    def _set_group_offline(self, value):
        '''set the value of self._group_offline to value and call to
        self.refilter()'''
        self._group_offline = value
        self.session.config.b_group_offline = self._group_offline
        self.fill()

    group_offline = property(fget=_get_group_offline, fset=_set_group_offline)

    def _get_show_blocked(self):
        '''return the value of self._show_blocked'''
        return self._show_blocked

    def _set_show_blocked(self, value):
        '''set the value of self._show_blocked to value and call to
        self.refilter()'''
        self._show_blocked = value
        self.session.config.b_show_blocked = self._show_blocked
        self.refilter()

    show_blocked = property(fget=_get_show_blocked, fset=_set_show_blocked)

    def _get_order_by_name(self):
        '''return the value of self._order_by_name'''
        return self._order_by_name

    def _set_order_by_name(self, value):
        '''set the value of self._order_by_name to value and call to
        self.refilter()'''
        self._order_by_name = value
        self.session.config.b_order_by_name = self._order_by_name
        self.fill() # TODO: FIXME: Why refilter() ain't working here?

    order_by_name = property(fget=_get_order_by_name, fset=_set_order_by_name)

    def _get_show_empty_groups(self):
        '''return the value of show_emptry_groups'''
        return self._show_empty_groups

    def _set_show_empty_groups(self, value):
        '''set the value of self._show_empty_groups to value and call to
        self.refilter()'''
        self._show_empty_groups = value
        self.session.config.b_show_empty_groups = value
        self.refilter()

    show_empty_groups = property(fget=_get_show_empty_groups,
        fset=_set_show_empty_groups)

    def _get_filter_text(self):
        '''return the filter_text value'''
        return self._filter_text

    def _set_filter_text(self, value):
        '''set the filter_text value'''
        self._filter_text = value
        self.refilter()

    filter_text = property(fget=_get_filter_text, fset=_set_filter_text)

    def escape_tags(self, value):
        '''break text that starts with [$ so a nick containing a format
        won't be replaced
        '''
        return value.replace("[$", "[ $")

    def escaper(self, text):
        ''' escape the text, this is a toolkit dependant method '''
        raise NotImplementedError

    def format_nick(self, contact):
        '''replace the appearance of the template vars using the values of
        the contact
        # valid values:
        # + NICK
        # + ACCOUNT
        # + DISPLAY_NAME (alias if available, or nick if available or mail)
        # + STATUS
        # + MESSAGE
        # + BLOCKED
        # + NL
        '''

        template = self.nick_template
        template = template.replace('[$NICK]', self.escaper(contact.nick))
        template = template.replace('[$ACCOUNT]',
                self.escape_tags(contact.account))
        template = template.replace('[$MESSAGE]',
                self.escaper(contact.message) if contact.media == '' else self.escaper(contact.media))
        template = template.replace('[$STATUS]',
                self.escape_tags(e3.status.STATUS[contact.status]))
        template = template.replace('[$DISPLAY_NAME]', self.escaper(contact.display_name))
        #people shouldn't be allowed to have \n in their name/pm
        template = template.replace('\n', ' ')
        template = template.replace('[$NL]', '\n')

        blocked_text = ''

        if contact.blocked:
            blocked_text = _('Blocked')

        template = template.replace('[$BLOCKED]', blocked_text)

        return template

    def format_group(self, group):
        '''replace the appearance of the template vars using the values of
        the group
        # valid values:
        # + NAME
        # + ONLINE_COUNT
        # + TOTAL_COUNT
        '''
        contacts = self.contacts.get_contacts(group.contacts)
        (online, total) = self.contacts.get_online_total_count(contacts)
        template = self.group_template
        maxtotal = len(self.contacts.contacts)

        if group == self.offline_group:
            template = template.replace('[$ONLINE_COUNT]', str(total))
            template = template.replace('[$TOTAL_COUNT]', str(maxtotal))
        else:
            if self.order_by_status:
                template = template.replace('[$ONLINE_COUNT]', str(online))
                template = template.replace('[$TOTAL_COUNT]', str(maxtotal))
            else:
                template = template.replace('[$ONLINE_COUNT]', str(online))
                template = template.replace('[$TOTAL_COUNT]', str(total))

        template = template.replace('[$NAME]', self.escape_tags(self.escaper(group.name)))

        return template

    def refilter(self):
        '''refilter the values according to the value of self.filter_text'''
        raise NotImplementedError()

    def is_group_selected(self):
        '''return True if a group is selected'''
        raise NotImplementedError()

    def is_contact_selected(self):
        '''return True if a contact is selected'''
        raise NotImplementedError()

    def get_group_selected(self):
        '''return a group object if there is a group selected, None otherwise
        '''
        raise NotImplementedError()

    def get_contact_selected(self):
        '''return a contact object if there is a group selected, None otherwise
        '''
        raise NotImplementedError()

    def get_contact_selected_group(self):
        '''return a group object for the selected contact, None otherwise
        '''
        raise NotImplementedError()

    def add_group(self, group):
        '''add a group to the contact list'''
        raise NotImplementedError()

    def remove_group(self, group):
        '''remove a group from the contact list'''
        raise NotImplementedError()

    def add_contact(self, contact, group=None):
        '''add a contact to the contact list, add it to the group if
        group is not None'''
        raise NotImplementedError()

    def remove_contact(self, contact, group=None):
        '''remove a contact from the specified group, if group is None
        then remove him from all groups'''
        raise NotImplementedError()

    def set_avatar_size(self, size):
        """set the size of the avatars on the contact list
        """
        self.avatar_size = size

    def fill(self, clear=True):
        '''fill the contact list with the contacts and groups from
        self.contacts and self.groups'''
        if clear:
            if not self.clear():
                return

        for group in self.groups.values():
            # get a list of contact objects from a list of accounts
            contacts = self.contacts.get_contacts(group.contacts)
            if not self.order_by_status:
                self.add_group(group)
            for contact in contacts:
                self.add_contact(contact, group)

        for contact in self.contacts.get_no_group():
            self.add_contact(contact)

    def clear(self):
        '''clear the contact list, return True if the list was cleared
        False otherwise (normally returns false when clear is called before
        the contact list is in a coherent state)'''
        raise NotImplementedError()

    def update_contact(self, contact):
        '''update the data of contact'''
        raise NotImplementedError()

    def update_group(self, group):
        '''update the data of group'''
        raise NotImplementedError()

    def update_format_nick(self):
        '''update the format of contact nick name'''
        raise NotImplementedError()

    def update_format_group(self):
        '''update the format of group name'''
        raise NotImplementedError()

    def set_group_state(self, group, state):
        '''expand group id state is True, collapse it if False'''
        raise NotImplementedError()

    def on_group_collapsed(self, group):
        '''called when a group is collapsed, update the status of the
        groups'''
        if self.is_searching or len(group.contacts) == 0:
            return

        self.group_state[group.name] = False
        self.session.config.d_group_state[group.name.decode("utf_8")] = "0"

    def on_group_expanded(self, group):
        '''called when a group is expanded, update the status of the
        groups'''
        if self.is_searching:
            return

        self.group_state[group.name] = True
        self.session.config.d_group_state[group.name.decode("utf_8")] = "1"

    def compare_groups(self, group1, group2, order1=0, order2=0):
        '''compare two groups and return 1 if group1 should go first, 0
        if equal, -1 if group2 should go first, use order1 and order2 to
        override the group sorting (the user can set the values on these to
        have custom ordering)'''

        override = cmp(order2, order1)

        if override != 0:
            return override

        return cmp(group1.name, group2.name)

    def compare_contacts(self, contact1, contact2, order1=0, order2=0):
        '''compare two contacts and return 1 if contact1 should go first, 0
        if equal and -1 if contact2 should go first, use order1 and order2 to
        override the group sorting (the user can set the values on these to
        have custom ordering)'''

        override = cmp(order2, order1)

        if override != 0:
            return override

        result = cmp(e3.status.ORDERED.index(contact1.status),
            e3.status.ORDERED.index(contact2.status))

        if result != 0:
            return result

        if self.order_by_status:
            return cmp(contact1.display_name, contact2.display_name)

        if len(contact1.groups) == 0:
            if len(contact2.groups) == 0:
                return cmp(contact1.display_name, contact2.display_name)
            else:
                return -1
        elif len(contact2.groups) == 0:
            return 1
        else:
            return cmp(contact1.display_name, contact2.display_name)

    def is_favorite_group_selected(self):
        group = self.get_group_selected()
        if group is not None and \
            group.identifier == self.session.config.favorite_group_id:
            return True

        return False
