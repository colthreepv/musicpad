musicpad [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/mrgamer/musicpad/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
========

# What has been and what will be

In the months developing this modest webapp i run into different ideas and experiments.  
The project was born totally to be a showcase of modern javascript technologies and what could be possible to achieve starting with few knowledge.

### Former Idea

In my mind having a _shared & anonymous playlist_ was a very cool idea. The idea is rather cool, but not really useful _afaik_  
So what's has been developed until now is something able to create a minimalistic [piratepad][ppad] for music, in the end this idea didn't really come useful to me, so i can't understand how it can be useful to less _nerd_ people :smile:  

Used libraries and ideas:
  * [LearnBoost/socket.io][socketio] to realize the pad as a _'shared chalkboard'_
  * [btford/angular-socket-io][socket-btford] to keep my mental sanity trying to wrap socket.io methods to AngularJS
  * [monospaced/angular-qrcode][angular-qrcode] for a very simple way to generate qrcodes _on-fly_
  * [twbs/bootstrap][bootstrap3] you should already know this if you have a browser
  * [angular-ui/bootstrap][angular-bootstrap] a wrap of Bootstrap's js code to angular, **this is awesome now that is jQuery-free**
  * [joshdmiller/ng-boilerplate][ng-boilerplate] the best boilerplate i ever seen on the web.
  * [angular/angular.js][angularjs] i cannot forget to mention this :smile:
  * [fent/node-ytdl][ytdl] library to get info and download Youtube videos on-fly
  * [schaermu/node-fluent-ffmpeg][node-ffmpeg] node.js wrapper for ffmpeg

### Future Idea

I've thinked over and over what really was the purpose of this project, and i realized it now.  
Personally i needed a mobile app that played music, the same music i liked on soundcloud/youtube, in a comfortable way.

Comfortable in my idea means:
  * Clever preload of songs, with an indicator, to know when i can go airplane mode or go into subway without interrupting play.
  * Smallprint songs! Transport is mainly 3G network, so.. it's _SLOW_ **(done)**
  * Manage songs in realtime from a desktop/tablet, the mobile app priority is to _Play_, the desktop part is to _Manage_
  * Automatically add your Soundcloud/Youtube accounts, so the app startup with all your songs, not a _"blank list of doom"_.

So, this `master` branch will stay like it is now, until the new version works out decently.  


## Original readme.md starts now.

### mockup
![mockup first release](https://dl.dropboxusercontent.com/s/1ammo7mpqgd5g2g/get-music_get-music.png?token_hash=AAESBY0eWjZRJgXjbWvqVmBWmt3pKRGTG5BwAL9BbMSZOg&dl=1)
Updated [HTML version here](http://app.mockflow.com/view/a38da72f4b21a524a6ae658990409981)

### result (v0.2.0-rc3)

![v0.2.0-rc3 release](http://i.imgur.com/nzrbpqN.png)


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

# linux dependencies
 * PPA https://launchpad.net/~jon-severinsson/+archive/ffmpeg

Deploy
------
I'm using an NGINX script like:
```nginx
server {
  listen 80;
  server_name *.musicpad;
  root /PROJECTROOT/client/build;
  gzip on;
  gzip_types text/plain application/xml application/x-javascript text/css;
  gzip_disable "MSIE [1-6]\.(?!.*SV1)";

  location ~/socket.io/.* {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
  }
  location ~/api/.* {
    proxy_pass http://localhost:3000;
  }

  location ~* ^\/vendor\/.* {
    root /PROJECTROOT/client;
    expires 60d;
  }
  location ~* ^\/assets\/(yt|sc|debug)/ {
    root /PROJECTROOT;
    expires 60d;
  }
  location ~* ^\/download\/(yt|sc)/(.*) {
    alias /PROJECTROOT/assets/$1/$2;
    add_header Content-Disposition "attachment";
  }

  location ~* \.(js|css|html)$ {
    expires epoch;
  }

  access_log /var/log/nginx/musicpad_access.log combined;
  error_log  /var/log/nginx/musicpad_error.log error;
}
```

And his best friend ```/etc/hosts``` with the following line:
```bash
#Awesum musicpad project
127.0.0.1	localhost.musicpad
```
**DONE!**

At this point, start a nodejs instance using ```npm start``` inside the [@musicpad][this] folder

  [this]: https://github.com/mrgamer/musicpad
  [fontawesome]: http://fortawesome.github.io/Font-Awesome/
  [ngb]: https://github.com/joshdmiller/ng-boilerplate
  [socket-btford]: https://github.com/btford/angular-socket-io
  [ppad]: http://piratepad.net

  [socketio]: https://github.com/LearnBoost/socket.io
  [angular-qrcode]: https://github.com/monospaced/angular-qrcode
  [bootstrap3]: https://github.com/twbs/bootstrap
  [angular-bootstrap]: https://github.com/angular-ui/bootstrap
  [ng-boilerplate]: https://github.com/joshdmiller/ng-boilerplate
  [angularjs]: https://github.com/angular/angular.js
  [ytdl]: https://github.com/fent/node-ytdl
  [node-ffmpeg]: https://github.com/schaermu/node-fluent-ffmpeg
