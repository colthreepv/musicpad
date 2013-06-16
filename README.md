musicpad
===================

# Project aims
Create an useful youtube playlist parser and downloader, able to pack a playlist in a .zip file  
Should not destroy my little VPS while doing so.  

### mockup
![mockup first release](https://dl.dropboxusercontent.com/s/1ammo7mpqgd5g2g/get-music_get-music.png?token_hash=AAESBY0eWjZRJgXjbWvqVmBWmt3pKRGTG5BwAL9BbMSZOg&dl=1)
Updated [HTML version here](http://app.mockflow.com/view/a38da72f4b21a524a6ae658990409981)

# Get the project up and running:

```bash
$ sudo npm install -g bower
$ pwd
/somepath/musicpad
# Install server-side modules
$ npm install
# Install client-side modules
$ cd public
$ bower install
# Create .css from .less
$ cd css/less
$ node /usr/bin/less-monitor -f -o ../
^Ctrl-c
```


##Utilities

To keep an eye when writing .less files i'm using:  
[@gdupont](https://github.com/gdupont)/[less-monitor](https://github.com/gdupont/less-monitor)
```bash
$ sudo npm install -g less-monitor
$ pwd
/somepath/musicpad
$ cd public/css/less
$ node /usr/bin/less-monitor -f -o ../
```

- bower
- nodejs
- grunt?


Deploy
------
I'm using an NGINX script like:
```nginx
server {
    listen 80;
    server_name musicpad;
    root /PROJECTROOT/client/dist;
    gzip on;
    gzip_types text/plain application/xml application/x-javascript text/css;
    gzip_disable "MSIE [1-6]\.(?!.*SV1)";

    # Reverse Proxy to node instance
    location ~(/api/|/socket.io/).* {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    location ~ ^/(websock|testurl)\/?$ {
        rewrite .* /index.html last;
    }
    location ~* ^\/vendor\/.* {
        root /PROJECTROOT/client/vendor;
        expires 60d;
    }
    location ~* \.(js|css|html)$ {
        expires epoch;
    }

    access_log /var/log/nginx/musicpad_access.log combined;
    error_log  /var/log/nginx/musicpad_error.log error;
}
```

Remember to fix ```/etc/nginx/mime.types``` to correctly handle ```.woff``` ([FontAwesome][fontawesome]) files.
```
application/font-woff woff;
```

And his best friend ```/etc/hosts``` with the following line:
```bash
#Awesum musicpad project
127.0.0.1	musicpad.localhost
```
**DONE!**

At this point, start a nodejs instance using ```npm start``` inside the [@musicpad][this] folder

##Libraries Used & Credits:
[@ptnplanet](https://github.com/ptnplanet)/[Backbone.Marionette.Boilerplate](https://github.com/ptnplanet/Backbone.Marionette.Boilerplate)

  [this]: https://github.com/mrgamer/musicpad
  [fontawesome]: http://fortawesome.github.io/Font-Awesome/
