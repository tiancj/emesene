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

'''a module to define a cache class for cookies
'''
from __future__ import with_statement
import os
import time
import shutil
import tempfile

import logging
log = logging.getLogger('e3.cache.Cache.py')


import Cache

class CookieCache(Cache.Cache):
    '''a class to maintain a cache of an user avatars
    '''

    def __init__(self, config_path, user):
        '''constructor
        config_path -- the path where the base configuration is located
        user -- the user account or identifier
        '''
        Cache.Cache.__init__(self, os.path.join(config_path,
            user.strip()), 'cookie', True)


