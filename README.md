get-music
===================

# Project aims
Create an useful youtube playlist parser and downloader, able to pack a playlist in a .zip file  
Should not destroy my little VPS while doing so.  

### Planned && **DONE**
Support for soundcloud aswell!
Update: found algorithm for SoundCloud ^_^

##Libraries Used & Credits:

[@ptnplanet](https://github.com/ptnplanet)/[Backbone.Marionette.Boilerplate](https://github.com/ptnplanet/Backbone.Marionette.Boilerplate)

##Utilities

To keep an eye when writing .less files i'm using:  
[@gdupont](https://github.com/gdupont)/[less-monitor](https://github.com/gdupont/less-monitor)
```bash
$ sudo npm install -g less-monitor
$ pwd
/somepath/get-music
$ cd public/assets/css/less
$ node /usr/local/bin/less-monitor -f -o ../
```

Deploy
------
I'm using an NGINX script like:
```nginx
server {
  listen 80;
	server_name get-music.localhost;
	root /your/folder/project/get-music/public/;
	index index.html index.htm;

	location ~/api/.* {
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_set_header Host $http_host;
		proxy_set_header X-NginX-Proxy true;

		# http://nginx.org/en/docs/http/ngx_http_upstream_module.html
                proxy_set_header        Connection              "";

                proxy_connect_timeout   90;
                proxy_send_timeout      90;
                proxy_read_timeout      90;
                proxy_buffers           32 8k;
                proxy_http_version      1.1;
                #proxy_cache             one;
                proxy_cache_key         sfs$request_uri$scheme;

		# http://wiki.nginx.org/HttpProxyModule#proxy_next_upstream
		proxy_next_upstream error timeout http_502;

		proxy_pass http://127.0.0.1:3000;
		# proxy_redirect off; ???
	}
	location ~ ^/(login|about)$ {
		rewrite .* /index.html last;
	}
	location ~* ^\/vendor\/.* {
		expires 60d;
	}
	location ~* \.(js|css|html)$ {
		expires epoch;
	}
	
	access_log      /var/log/nginx/get-music_access.log combined;
	error_log       /var/log/nginx/get-music_error.log error;

	## no error pages, for now.
	# error_page 404          /404.html;
	# error_page 502          /502.html;
}
```
And his best friend ```/etc/hosts``` with the following line:
```bash
#Awesum get-magic project
127.0.0.1	get-music.localhost
```
At this point, start a nodejs instance using ```npm start``` inside the [@get-music][this] folder

[this]: https://github.com/mrgamer/get-music
