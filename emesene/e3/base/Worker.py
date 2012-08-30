'''a thread that handles the connection with the main server'''
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

import Queue
import threading
import traceback

import Logger
import logging
log = logging.getLogger('e3.base.Worker')

from Event import Event
from Action import Action

EVENTS = (\
 'login started'         , 'login info'           ,
 'login succeed'         , 'login failed'         ,
 'login verify code',
 'disconnected'          , 'contact list ready'   ,
 'contact attr changed'  , 'contact added'        ,
 'contact add succeed'   , 'contact add failed'   ,
 'contact remove succeed', 'contact remove failed',
 'contact reject succeed', 'contact reject failed',
 'contact move succeed'  , 'contact move failed'  ,
 'contact copy succeed'  , 'contact copy failed'  ,
 'contact block succeed' , 'contact block failed' ,
 'contact unblock succeed' , 'contact unblock failed',
 'contact alias succeed' , 'contact alias failed' ,
 'group add succeed'     , 'group add failed'     ,
 'group remove succeed'  , 'group remove failed'  ,
 'group rename succeed'  , 'group rename failed'  ,
 'group add contact succeed'     , 'group add contact failed'   ,
 'group remove contact succeed'  , 'group remove contact failed',
 'status change succeed' , 'status change failed' ,
 'nick change succeed'   , 'nick change failed'   ,
 'message change succeed', 'message change failed',
 'media change succeed', 'media change failed',
 'picture change succeed', 'error'                ,
 'conv contact joined'   , 'conv contact left'  ,
 'conv started'          , 'conv ended'           ,
 'conv group started'    , 'conv group ended'     ,
 'conv message'          , 'conv first action'    ,
 'conv message send succeed'  , 'conv message send failed',
 'oim received',       'oims data received',
 'filetransfer invitation', 'filetransfer completed',
 'filetransfer rejected', 'filetransfer canceled',
 'filetransfer accepted', 'filetransfer progress',
 'call invitation', 'call completed',
 'call rejected', 'call canceled',
 'call accepted', 'call progress',
 'p2p invitation',      'p2p finished',
 'p2p error',           'p2p canceled',
 'p2p accepted',        'p2p progress',
 'profile get succeed'  , 'profile get failed',
 'profile set succeed'  , 'profile set failed',
 'media received' , 'message read',
 'contact added you', 'user typing',
 'mail received', 'mail count changed',
 'broken profile', 'close', 'social request',
 'gui message', 'endpoint added', 'endpoint removed',
 'endpoint updated')

ACTIONS = (\
 'login'            , 'logout'           ,
 'change status'    ,
 'block contact'    , 'unblock contact'  ,
 'add contact'      , 'remove contact'   , 'reject contact',
 'set contact alias', 'quit'             ,
 'add to group'     , 'remove from group',
 'move to group'    , 'rename group'     ,
 'add group'        , 'remove group'     ,
 'set nick'         , 'set message'      ,
 'set media' ,
 'set picture'      ,
 'new conversation' , 'close conversation',
 'send message'     , 'conv invite',
 'ft invite', 'ft accept',
 'ft cancel', 'ft reject',
 'send picture',
 'call invite', 'call accept',
 'call cancel', 'call reject',
 'p2p invite'       , 'p2p accept',
 'p2p cancel'       , 'media send', # media send if got Wink and audio clips
 'send oim',
 'disconnect other endpoints', 'disconnect endpoint',
 'set endpoint name')

Event.set_constants(EVENTS)
Action.set_constants(ACTIONS)

class Worker(threading.Thread):
    '''this class represent an object that waits for commands from the queue
    of a socket, process them and add it as events to its own queue'''

    def __init__(self, session):
        '''class constructor'''
        threading.Thread.__init__(self)
        self._continue = True
        self.setDaemon(True)

        self.in_login = False
        self.session = session

        self.action_handlers = {}
        Worker._set_handlers(self)

    def _set_handlers(self):
        '''set a dict with the action id as key and the handler as value'''
        dah = {}

        dah[Action.ACTION_ADD_CONTACT] = self._handle_action_add_contact
        dah[Action.ACTION_ADD_GROUP] = self._handle_action_add_group
        dah[Action.ACTION_ADD_TO_GROUP] = self._handle_action_add_to_group
        dah[Action.ACTION_BLOCK_CONTACT] = self._handle_action_block_contact
        dah[Action.ACTION_UNBLOCK_CONTACT] = self._handle_action_unblock_contact
        dah[Action.ACTION_CHANGE_STATUS] = self._handle_action_change_status
        dah[Action.ACTION_LOGIN] = self._handle_action_login
        dah[Action.ACTION_LOGOUT] = self._handle_action_logout
        dah[Action.ACTION_MOVE_TO_GROUP] = self._handle_action_move_to_group
        dah[Action.ACTION_REMOVE_CONTACT] = self._handle_action_remove_contact
        dah[Action.ACTION_REJECT_CONTACT] = self._handle_action_reject_contact
        dah[Action.ACTION_REMOVE_FROM_GROUP] = \
            self._handle_action_remove_from_group
        dah[Action.ACTION_REMOVE_GROUP] = self._handle_action_remove_group
        dah[Action.ACTION_RENAME_GROUP] = self._handle_action_rename_group
        dah[Action.ACTION_SET_CONTACT_ALIAS] = \
            self._handle_action_set_contact_alias
        dah[Action.ACTION_SET_MESSAGE] = self._handle_action_set_message
        dah[Action.ACTION_SET_NICK] = self._handle_action_set_nick
        dah[Action.ACTION_SET_PICTURE] = self._handle_action_set_picture
        dah[Action.ACTION_SET_MEDIA] = self._handle_action_set_media
        dah[Action.ACTION_NEW_CONVERSATION] = \
            self._handle_action_new_conversation
        dah[Action.ACTION_CLOSE_CONVERSATION] = \
            self._handle_action_close_conversation
        dah[Action.ACTION_CONV_INVITE] = \
            self._handle_action_conv_invite
        dah[Action.ACTION_SEND_MESSAGE] = self._handle_action_send_message
        dah[Action.ACTION_SEND_OIM] = self._handle_action_send_oim
        dah[Action.ACTION_SEND_PICTURE] = self._handle_action_send_picture
        dah[Action.ACTION_QUIT] = self._handle_action_quit

        # p2p actions (unused!)
        dah[Action.ACTION_P2P_INVITE] = self._handle_action_p2p_invite
        dah[Action.ACTION_P2P_ACCEPT] = self._handle_action_p2p_accept
        dah[Action.ACTION_P2P_CANCEL] = self._handle_action_p2p_cancel
        # ft actions
        dah[Action.ACTION_FT_INVITE] = self._handle_action_ft_invite
        dah[Action.ACTION_FT_ACCEPT] = self._handle_action_ft_accept
        dah[Action.ACTION_FT_REJECT] = self._handle_action_ft_reject
        dah[Action.ACTION_FT_CANCEL] = self._handle_action_ft_cancel
        # call actions
        dah[Action.ACTION_CALL_INVITE] = self._handle_action_call_invite
        dah[Action.ACTION_CALL_ACCEPT] = self._handle_action_call_accept
        dah[Action.ACTION_CALL_REJECT] = self._handle_action_call_reject
        dah[Action.ACTION_CALL_CANCEL] = self._handle_action_call_cancel
        # papylib specific
        dah[Action.ACTION_DISCONNECT_OTHER_ENDPOINTS] = self._handle_action_disconnect_other_endpoints
        dah[Action.ACTION_DISCONNECT_ENDPOINT] = self._handle_action_disconnect_endpoint
        dah[Action.ACTION_SET_ENDPOINT_NAME] = self._handle_action_set_endpoint_name

        self.action_handlers = dah

    def run(self):
        '''main method, block waiting for data, process it, and send data back
        '''
        while self._continue:
            try:
                action = self.session.actions.get(True, 0.1)
                self._process_action(action)
            except Queue.Empty:
                pass

    def _process_action(self, action):
        '''process an action'''
        if action.id_ in self.action_handlers:
            try:
                self.action_handlers[action.id_](*action.args)
            except TypeError:
                self.session.error('Error calling action handler', action.id_)
                traceback.print_exc()

    # common functions
    def _filedata_to_string(self, filename):
        '''read a filename and convert it's data to String'''
        try:
            f = open(filename, 'rb')
            avatar = f.read()
            f.close()
        except IOError:
            return None

        if not isinstance(avatar, str):
            avatar = "".join([chr(b) for b in avatar])

        return avatar

    # action handlers (the stubs, copy and complete them on your implementation)
    def _handle_action_add_contact(self, account):
        '''handle Action.ACTION_ADD_CONTACT
        '''
        pass

    def _handle_action_add_group(self, name):
        '''handle Action.ACTION_ADD_GROUP
        '''
        pass

    def _handle_action_add_to_group(self, account, gid):
        '''handle Action.ACTION_ADD_TO_GROUP
        '''
        pass

    def _handle_action_block_contact(self, account):
        '''handle Action.ACTION_BLOCK_CONTACT
        '''
        pass

    def _handle_action_unblock_contact(self, account):
        '''handle Action.ACTION_UNBLOCK_CONTACT
        '''
        pass

    def _handle_action_quit(self):
        '''handle Action.ACTION_QUIT
        '''
        log.debug('closing thread')
        self.session.logger.quit()
        self.session.signals.quit()
        self._continue = False

    def _handle_action_change_status(self, status_):
        '''handle Action.ACTION_CHANGE_STATUS
        '''
        self.session.account.status = status_
        self.session.contacts.me.status = status_
        self.session.status_change_succeed(status_)

        # log the status
        contact = self.session.contacts.me
        account = Logger.Account.from_contact(contact)
        account.status = status_

        self.session.log('status change', status_, str(status_), account)

    def _handle_action_login(self, account, password, status_):
        '''handle Action.ACTION_LOGIN
        '''
        pass

    def _handle_action_logout(self):
        '''handle Action.ACTION_LOGOUT
        '''
        self.session.close()

    def _handle_action_move_to_group(self, account, src_gid, dest_gid):
        '''handle Action.ACTION_MOVE_TO_GROUP
        '''
        pass

    def _handle_action_remove_contact(self, account):
        '''handle Action.ACTION_REMOVE_CONTACT
        '''
        pass

    def _handle_action_reject_contact(self, account):
        '''handle Action.ACTION_REJECT_CONTACT
        '''
        pass

    def _handle_action_remove_from_group(self, account, gid):
        '''handle Action.ACTION_REMOVE_FROM_GROUP
        '''
        pass

    def _handle_action_remove_group(self, gid):
        '''handle Action.ACTION_REMOVE_GROUP
        '''
        pass

    def _handle_action_rename_group(self, gid, name):
        '''handle Action.ACTION_RENAME_GROUP
        '''
        pass

    def _handle_action_set_contact_alias(self, account, alias):
        '''handle Action.ACTION_SET_CONTACT_ALIAS
        '''
        pass

    def _handle_action_set_message(self, message):
        '''handle Action.ACTION_SET_MESSAGE
        '''
        self.session.message_change_succeed(message)
        self.session.contacts.me.message = message

        # log the change
        contact = self.session.contacts.me
        account = Logger.Account.from_contact(contact)

        self.session.log('message change', contact.status, message,
            account)

    def _handle_action_set_nick(self, nick):
        '''handle Action.ACTION_SET_NICK
        '''
        pass

    def _handle_action_set_picture(self, picture_name):
        '''handle Action.ACTION_SET_PICTURE
        '''
        pass

    def _handle_action_set_media(self, message):
        '''handle Action.ACTION_SET_MEDIA
        '''
        contact = self.session.contacts.me
        if message is not None:
            self.session.media_change_succeed(message[0] + " - " + message[1])
            self.session.contacts.me.media = message[0] + " - " + message[1]
        else:
            self.session.contacts.me.media = None
            self.session.media_change_succeed(None)

        # log the change
        account = Logger.Account.from_contact(contact)

        self.session.log('media change', contact.status, message,
            account)

    def _handle_action_new_conversation(self, account, cid):
        '''handle Action.ACTION_NEW_CONVERSATION
        '''
        pass

    def _handle_action_close_conversation(self, cid):
        '''handle Action.ACTION_CLOSE_CONVERSATION
        '''
        pass

    def _handle_action_conv_invite(self, cid, account):
        '''handle Action.ACTION_CONV_INVITE
        '''
        pass

    def _handle_action_send_message(self, cid, message):
        '''handle Action.ACTION_SEND_MESSAGE
        cid is the conversation id, message is a MsnMessage object
        '''
        pass

    def _handle_action_send_oim(self, cid, dest, message):
        '''handle Action.ACTION_SEND_OIM
        cid is the conversation id, message is a string
        dest is the oim receiver account
        '''
        pass

    def _handle_action_send_picture(self, cid, account, filename, completepath, preview_data):
        '''handle Action.ACTION_SEND_P
        cid is the conversation id, message is a string
        dest is the oim receiver account
        '''
        pass


    # p2p handlers

    def _handle_action_p2p_invite(self, cid, pid, dest, type_, identifier):
        '''handle Action.ACTION_P2P_INVITE,
         cid is the conversation id
         pid is the p2p session id, both are numbers that identify the
            conversation and the session respectively, time.time() is
            recommended to be used.
         dest is the destination account
         type_ is one of the e3.Transfer.TYPE_* constants
         identifier is the data that is needed to be sent for the invitation
        '''
        pass

    def _handle_action_p2p_accept(self, pid):
        '''handle Action.ACTION_P2P_ACCEPT'''
        pass

    def _handle_action_p2p_cancel(self, pid):
        '''handle Action.ACTION_P2P_CANCEL'''
        pass

    # ft handlers
    def _handle_action_ft_invite(self, t):
        pass

    def _handle_action_ft_accept(self, t):
        pass

    def _handle_action_ft_reject(self, t):
        pass

    def _handle_action_ft_cancel(self, t):
        pass

    # call handlers
    def _handle_action_call_invite(self, cid, account, a_v_both, surface_other,
                                   surface_self):
        pass

    def _handle_action_call_accept(self, c):
        pass

    def _handle_action_call_reject(self, c):
        pass

    def _handle_action_call_cancel(self, c):
        pass

    def _handle_action_disconnect_other_endpoints(self):
        pass

    def _handle_action_disconnect_endpoint(self, ep_id):
        pass

    def _handle_action_set_endpoint_name(self, ep_name):
        pass
