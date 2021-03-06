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

import functools
import logging
log = logging.getLogger('e3.common.Signal')

from WeakMethod import WeakMethod, WeakMethodBound

class Signal(object):
    '''an object that represents a signal a callback can subscribe
    to the signal, when emited all the callbacks are called until the end or
    until one callback returns False'''

    def __init__(self):
        '''constructor'''
        self._subscribers = {}

    def subscribe(self, callback, *args, **kwargs):
        '''subscribe to the signal, when the signal is emited, callback will be
        called
        '''
        self._subscribers[WeakMethod(callback)] = (args, kwargs)

    def unsubscribe(self, callback):
        '''remove the callback from the subscribers dict, raise KeyError if
        the callback is not registered (made this way to avoid abuse of the api)
        '''
        for key, item in enumerate(self._subscribers):
            if WeakMethod(callback).f == item.f:
                del(self._subscribers[item])
                return

    def emit(self, *args, **kwargs):
        '''emit the signal with args and kwargs, if a callback returns False
        then the remaining callbacks are not called
        '''
        to_remove = []

        for callback, cargs in self._subscribers.items():
            cargs, ckwargs = cargs
            args += cargs
            kwargs.update(ckwargs)

            if callback is None:
                print "callback is None in emit"
                continue

            try:
                if callback(*args, **kwargs) == False:
                    break
            except TypeError:
                to_remove.append(callback)
                log.exception('Method called on dead object: %s' %
                        str(callback))
            except Exception, error:
                log.exception('Signal handler (%s) error: %s' %
                        (str(callback), str(error)))

        for item in to_remove:
            del self._subscribers[item]

def extend(func):
    '''allow the extention of a method'''

    func.on_entry = Signal()
    func.on_exit = Signal()

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
       func.on_entry.emit(args, kwargs)
       result = func(*args, **kwargs)
       func.on_exit.emit(result, args, kwargs)
       return result

    return wrapper
