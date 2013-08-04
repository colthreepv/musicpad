musicpad
===================

* [Credits](#credits-and-thanks)

# Project aims
Create an useful youtube playlist parser and downloader, able to pack a playlist in a .zip file
Should not destroy my little VPS while doing so.

### mockup
![mockup first release](https://dl.dropboxusercontent.com/s/1ammo7mpqgd5g2g/get-music_get-music.png?token_hash=AAESBY0eWjZRJgXjbWvqVmBWmt3pKRGTG5BwAL9BbMSZOg&dl=1)
Updated [HTML version here](http://app.mockflow.com/view/a38da72f4b21a524a6ae658990409981)

# Get the project up and running:

```bash
$ sudo npm install -g bower grunt-cli karma
$ pwd
/somepath/musicpad
# Install server-side modules
$ npm install
# Install client-side modules
$ bower install
# Build client app
$ cd client/
$ grunt build
```


##Utilities

**OUTDATED**

Deploy
------
I'm using an NGINX script like:
```nginx
server {
    listen 80;
    server_name musicpad;
    root /PROJECTROOT/client/build;
    gzip on;
    gzip_types text/plain application/xml application/x-javascript text/css;
    gzip_disable "MSIE [1-6]\.(?!.*SV1)";

    location ~/api/.* {
        proxy_pass http://localhost:3000;
    }

    location ~* ^\/vendor\/.* {
        root /PROJECTROOT/client;
        expires 60d;
    }
    location ~* ^\/assets\/(yt|sc)/.* {
        root /PROJECTROOT;
        expires 60d;
    }
    location ~* \.(js|css|html)$ {
        expires epoch;
    }

    access_log /var/log/nginx/musicpad_access.log combined;
    error_log  /var/log/nginx/musicpad_error.log error;
}

server {
    listen 443;
    server_name musicpad;
    location ~/socket.io/.* {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
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

##Credits and Thanks:
[ng-boilerplate][ngb], best-ever AngularJS startup project!  
[angular-socket-io][socket-btford], Briand Ford saved my life with this little project :)

  [this]: https://github.com/mrgamer/musicpad
  [fontawesome]: http://fortawesome.github.io/Font-Awesome/
  [ngb]: https://github.com/joshdmiller/ng-boilerplate
  [socket-btford]: https://github.com/btford/angular-socket-io
