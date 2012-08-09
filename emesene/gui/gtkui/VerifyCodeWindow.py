# -*- coding: utf-8 -*-
import pygtk
pygtk.require('2.0')
import gtk
import urllib2

class VerifyCodeWindow(object):
    '''显示验证码窗口'''
    def destroy(self, widget, data=None):
        print "destroy signal occurred"
        gtk.main_quit()

    def __init__(self, callback, on_preferences_changed,
                 config=None, config_dir=None, config_path=None,
                 proxy=None, use_http=None, use_ipv6=None, session_id=None,
                 cancel_clicked=False, no_autologin=False):
        self.window = gtk.Window(gtk.WINDOW_TOPLEVEL)
        self.window.connect("destroy", self.destroy)
        self.window.set_border_width(10)
        self.image=gtk.Image()
        response=urllib2.urlopen(
            'http://www.dailygalaxy.com/photos/uncategorized/2007/05/05/planet_x.jpg')
        loader=gtk.gdk.PixbufLoader()
        loader.write(response.read())
        loader.close()        
        self.image.set_from_pixbuf(loader.get_pixbuf())
        # This does the same thing, but by saving to a file
        # fname='/tmp/planet_x.jpg'
        # with open(fname,'w') as f:
        #     f.write(response.read())
        # self.image.set_from_file(fname)
        self.window.add(self.image)
        
        """增加一个按钮"""
        self.verify_code = gtk.Entry()
        self.button_ok = gtk.Button(_('Connect'))
        self.button_ok.connect('clicked', _on_button_clicked)
        self.image.show()
        self.window.show()

    def main(self):
        gtk.main()
    
    def _on_button_clicked(self, button):
        print self.verify_code.get_text()
        

if __name__ == "__main__":
    MainWin().main()
