'''a module to handle contacts'''
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

import status

from Contact import Contact

from xml.dom import minidom
import os
import sys
import xml.etree.ElementTree as ET
import hashlib
import e3

class ContactManager(object):
    def __init__(self, account):
        self.contacts = {}
        self.reverse = {}
        self.pending = {}

        self.me = Contact(account)

        self.contact_file = os.path.join(e3.common.ConfigDir().default_base_dir, 'blist.xml')

    def exists(self, account):
        '''check if the account is on self.contacts, return True if exists'''
        return account in self.contacts

    def get(self, account):
        '''return a contact from an account'''
        return self.contacts.get(account, None)

    def safe_get(self, account):
        '''return a contact from an account if present, otherwise create one'''
        contact = self.contacts.get(account)
        if contact is None:
            contact = Contact(account)
        return contact

    # actions on our contact
    def get_no_group(self):
        '''return a list of contacts that dont belong to any group'''
        return [contact for contact in self.contacts.values() \
            if not contact.groups]

    def get_contacts(self, accounts):
        '''return a list of contact objects from a list of accounts
        if in_reverse is True, check that the account is also on the reverse
        list'''
        return [self.contacts[account] for account in accounts if account \
            in self.contacts]

    def get_sorted_list_by_status(self, contacts=None):
        '''return a dict with status.* (OFFLINE, ONLINE etc) as key and
        a list of contact objects as value, you can use then
        status.ORDERED to cycle over the keys.
        The contacts are sorted inside the status by display_name.
        if contacts is None, then use the internal list of contacts
        contacts should be a list of contact objects'''
        sorted_dict = {}
        contacts = contacts or self.contacts.values()

        for stat in status.ORDERED:
            sorted_dict[stat] = [contact for contact in contacts \
                if contact.status == stat]

            sorted_dict[stat].sort(cmp=lambda x, y: cmp(x.display_name,
                y.display_name))

        return sorted_dict

    def get_sorted_list_by_group(self, groups, sort_by_status=False):
        '''return a dict with group names as keys and a list of sorted
        contacts as value, sort them according to display_name if
        sort_by_status is False, and by status and display_name if
        it's True'''
        groups.sort()
        sorted_dict = {}

        for group in groups:
            contacts = [contact for contact in self.contacts.values() \
                if group in contact.groups]

            if sort_by_status:
                sorted_dict[group] = self.get_sorted_list_by_status(contacts)
            else:
                contacts.sort(cmp=lambda x, y: cmp(x.display_name,
                    y.display_name))
                sorted_dict[group] = contacts

        return sorted_dict

    def get_by_domain(self):
        '''return a dict with list of accounts as values and domain
        as key'''
        domains = {}

        for contact in self.contacts:
            (user, domain) = contact.split('@')
            if domain in domains:
                domains[domain].append(user)
            else:
                domains[domain] = [user]

        return domains

    def get_online_list(self, contacts=None):
        '''return a list of non offline contacts'''
        contacts = contacts or self.contacts.values()

        return [contact for contact in contacts \
                if contact.status != status.OFFLINE]

    def get_online_total_count(self, contacts):
        '''return a tuple with two values, the first is the number of
        non offline contacts on the list, the secont is the total number
        of contacts'''
        total = len(contacts)
        online = len([contact for contact in contacts \
            if contact.status != status.OFFLINE])

        return (online, total)

    def _prettify(self, elem):
        '''Return a pretty-printed XML string for the Element.
        '''
        rough_string = ET.tostring(elem, 'utf-8')
        reparsed = minidom.parseString(rough_string)
        return reparsed.toprettyxml(indent='\t')

    def _get_groups(self):
        groups = set()
        for key in self.contacts:
            g = self.contacts[key].groups
            groups.update(g)
        return groups

    def store(self):
        ''' store the contact list to disk, for speed up
        the contact fetching progress, which is very useful
        for some protocols such as Tencent qq.
        The format of the contact list is borrowed from pidgin,
        you can see its doc.
        '''
        root = ET.Element('emesene', {'version': '1.0'})
        blist = ET.SubElement(root, 'blist')

        # create groups
        groups = self._get_groups()
        for group in groups:
            ET.SubElement(blist, 'group', {'name': group})

        for account in self.contacts:
            contact = self.contacts[account]
            filter_ = './/*[@name="%s"]' % contact.groups[0]
            group = root.find(filter_)
            element = ET.SubElement(group,'contact')
            buddy = ET.SubElement(element, 'buddy', {'account': account, 'proto': 'webqq'})
            ET.SubElement(buddy, 'name').text = account
            ET.SubElement(buddy, 'alias').text = contact.nick
            if contact.picture != '':
                ET.SubElement(buddy, 'setting', {'name': 'buddy_icon', 'type':'string'}).text = \
                        contact.picture
                ET.SubElement(buddy, 'setting', {'name': 'icon_checksum', 'type':'string'}).text = \
                        contact.picture_checksum
            if contact.message != '':
                ET.SubElement(buddy, 'setting', {'name': 'message', 'type':'string'}).text = \
                        contact.message

        tree = ET.ElementTree(root)

        f = file(self.contact_file, 'w')
        f.write(self._prettify(root))
        f.close()

    def load(self, session):
        if not os.path.isfile(self.contact_file):
            return

        with open(self.contact_file, 'rt') as f:
            tree = ET.parse(f)
        root = tree.getroot()
        for root_child in root:
            if root_child.tag == 'blist':
                for group in root_child:
                    # Add group
                    group_name = group.get('name')
                    session.groups[group_name] = e3.Group(group_name, group_name, type_=e3.Group.ONLINE)
                    for group_child in group:
                        if group_child.tag == 'setting':
                            pass
                        elif group_child.tag == 'contact':
                            buddy = group_child[0][0]
                            account = buddy.get('account') # my account, such as 'tiancj1985@hotmail.com'
                            proto = buddy.get('proto')
                            contact_name = alias = None
                            msg = ''
                            buddy_icon = ''
                            for elem in buddy:
                                if elem.tag == 'name':
                                    contact_name = elem.text
                                elif elem.tag == 'alias':
                                    alias = elem.text
                                elif elem.tag == 'setting':
                                    buddy_setting_name = elem.get('name')
                                    buddy_setting_type = elem.get('type')
                                    if buddy_setting_name == 'buddy_icon':
                                        buddy_icon = elem.text
                                    elif buddy_setting_name == 'icon_checksum':
                                        icon_checksum = elem.text
                            session.contacts.contacts[contact_name] = e3.Contact(contact_name, contact_name,
                                alias, msg, e3.status.OFFLINE, alias, blocked=False, picture=buddy_icon)
                            
            elif root_child.tag == 'privacy':
                pass

