'''a module that defines a contact object'''
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
import hashlib

class Contact(object):
    '''a class that represent a contact'''

    def __init__(self, account, identifier=None, nick='', message=None,
        _status=status.OFFLINE, alias='', blocked=False, cid=None, picture=''):
        '''class contructor'''
        self.account = account #just a string, such as "245155408"
        self.identifier = identifier or '0'
        self.nick = nick or self.account
        # message is the personal message or status message, as you may
        # call it
        self.message = message or ''
        self.media = ''
        self.status = _status
        self.alias = alias
        self.blocked = blocked
        self._picture = picture
        self.picture_checksum = self._compute_picture_csum()
        self.groups = []
        self.cid = cid # XXX: unused?

        # extra atributes (use contact.attrs.get("attr", "default"))
        self.attrs = {}

    def _compute_picture_csum(self):
        if self.picture != '':
            return self._md5Checksum(self.picture)
        return ''

    def _md5Checksum(self, filePath):
        try:
            fh = open(filePath, 'rb')
            m = hashlib.md5()
            while True:
                data = fh.read(8192)
                if not data:
                    break
                m.update(data)
            return m.hexdigest()
        except Exception as e:
            print e
            return ''

    def set_picture(self, picture):
        self._picture = picture
        self.picture_checksum = self._compute_picture_csum()

    def get_picture(self):
        return self._picture

    picture = property(get_picture, set_picture)

    def dict(self):
        '''return a dict representing the object'''
        return dict(account = self.account,
          identifier = self.identifier,
          nick = self.nick,
          message = self.message,
          media = self.media,
          status = self.status,
          alias = self.alias,
          blocked = self.blocked,
          groups = self.groups)

    def _get_display_name(self):
        '''return the alias if exist, if not the nick if not empty, if not
        the mail'''

        return self.alias or self.nick or self.account

    display_name = property(fget=_get_display_name)

    def _get_status_string(self):
        '''return a string representation of the status'''
        return status.STATUS.get(self.status, '?')

    status_string = property(fget=_get_status_string)

    def __repr__(self):
        '''return a string representation of the object'''
        return "<contact account='%s' nick='%s' message='%s' status='%s'>" \
            % (self.account, self.nick, self.message, self.status)
