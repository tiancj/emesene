# -*- coding: utf-8 -*-
import pygtk
pygtk.require('2.0')
import gtk
import urllib2

class VerifyCodeWindow(gtk.Alignment):
    '''显示验证码窗口'''
    def __init__(self, callback):
        gtk.Alignment.__init__(self, xalign=0.5, xscale=0.0, yscale = 1.0)
        self.callback = callback

        VBox = gtk.VBox()


        #self.image=gtk.Image()
        #response=urllib2.urlopen(
        #    'http://www.dailygalaxy.com/photos/uncategorized/2007/05/05/planet_x.jpg')
        #loader=gtk.gdk.PixbufLoader()
        #loader.write(response.read())
        #loader.close()        
        #self.image.set_from_pixbuf(loader.get_pixbuf())
        # This does the same thing, but by saving to a file
        # fname='/tmp/planet_x.jpg'
        # with open(fname,'w') as f:
        #     f.write(response.read())
        # self.image.set_from_file(fname)
        #self.window.add(self.image)
        
        """增加一个按钮"""
        self.verify_code = gtk.Entry()
        self.button_ok = gtk.Button(_('Connect'))
        self.button_ok.connect('clicked', _on_button_clicked)
        VBox.pack_start(self.verify_code)
        VBox.pack_start(self.button_ok)
        #self.image.show()
        VBox.show_all()

    def _on_button_clicked(self, button):
        print self.verify_code.get_text()
        self.callback(self.verify_code.gettext())
        
