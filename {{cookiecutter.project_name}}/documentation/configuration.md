# CONFIGURATION

```bash
$ mkdir /var/log/{{cookiecutter.project_name|lower}}/
$ mkvirtualenv {{cookiecutter.project_name|lower}}
$ git clone {{cookiecutter.repo_url}}
$ cd {{cookiecutter.project_name|lower}}
$ make deps
$ npm install
```

## MONIT

```bash
$ mkdir /var/run/{{cookiecutter.project_name|lower}}
$ yum install epel-release
$ yum install monit
$ cp configs/monitrc.example monitrc
$ cp configs/monitrc configs/mymonitrc
$ vim configs/mymonicrc # username/password, port, slack_api_key
$ ln -sf ${{cookiecutter.project_name|upper}}/configs/mymonitrc /etc/monitrc
$ chmod 700 config/monitrc
$ systemctl enable monit
$ systemctl start monit
$ git clone https://github.com/jf-parent/slack
$ #install it
```

## NGINX

```
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80 default_server;
        listen       [::]:80 default_server;

        # Load configuration files for the default server block.
        # include /etc/nginx/default.d/*.conf;

        location /path/to/static/ {
            root /usr/share/nginx/html;
            autoindex on;
        }

        location / {
            proxy_pass http://127.0.0.1:8080;
        }

        #error_page 404 /404.html;
        #    location = /40x.html {
        #}

        #error_page 500 502 503 504 /50x.html;
        #    location = /50x.html {
        #}
    }
}
```
