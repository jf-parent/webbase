# CONFIGURATION

```bash
$ mkdir /var/log/{{cookiecutter.project_name|lower}}/
$ mkvirtualenv {{cookiecutter.project_name|lower}}
$ git clone {{cookiecutter.repo_url}}
$ cd {{cookiecutter.project_name|lower}}
$ make deps
$ npm install
```

## PROMETHEUS

```bash
$ su
$ cd $PROG
$ git clone https://github.com/hynek/prometheus_async
$ python setup.py install
$ mkdir /var/log/prometheus
$ wget https://github.com/prometheus/prometheus/releases/download/0.18.0/prometheus-0.18.0.linux-amd64.tar.gz
$ tar xvf prometheus-0.18.0.linux-amd64.tar.gz
$ mv prometheus-0.18.0.linux-amd64 prometheus
$ mv prometheus /opt
$ ln -s -f ${{cookiecutter.project_name|upper}}/configs/prometheus.yml /opt/prometheus/
```

### GRAFANA

Ref: 

* http://docs.grafana.org/installation/rpm/
* http://vmkdaily.ghost.io/influxdb-and-grafana-on-centos/

```bash
$ wget https://grafanarel.s3.amazonaws.com/builds/grafana-3.0.4-1464167696.x86_64.rpm
$ sudo yum install https://grafanarel.s3.amazonaws.com/builds/grafana-3.0.4-1464167696.x86_64.rpm
$ firewall-cmd --permanent --zone=public --add-port=3000/tcp
$ firewall-cmd --reload
$ sudo systemctl enable grafana-server.service
```

Edit /etc/grafana/grafana.ini

```
allow_sign_up = false
allow_org_create = false
admin_password = yourpassword
```

```bash
$ systemctl start grafana-server
$ systemctl status grafana-server
```

* Setup Grafana to use Prometheus: https://prometheus.io/docs/visualization/grafana/

### NODE EXPORTER

Ref: https://www.digitalocean.com/community/tutorials/how-to-use-prometheus-to-monitor-your-centos-7-server

```bash
$ wget https://github.com/prometheus/node_exporter/releases/download/0.12.0/node_exporter-0.12.0.linux-arm64.tar.gz
$ tar xvf node_exporter-0.12.0.linux-arm64.tar.gz
$ mv node_exporter-0.12.0.linux-arm64 node_exporter
$ mv node_exporter /opt/prometheus/
```

Create the node_exporter.service:
```bash
$ sudo vim /etc/systemd/system/node_exporter.service
```

/etc/systemd/system/node_exporter.service
```
[Unit]
Description=Node Exporter

[Service]
User=centos
ExecStart=/opt/prometheus/node_exporter/node_exporter

[Install]
WantedBy=default.target
```

```bash
$ sudo systemctl daemon-reload
$ sudo systemctl enable node_exporter.service
$ sudo systemctl start node_exporter.service
```

### MONGODB EXPORTER

Ref: https://github.com/dcu/mongodb_exporter

```bash
$ mkdir mongodb_exporter
$ cd mongodb_exporter
$ go get -u github.com/dcu/mongodb_exporter
$ mkdir /opt/prometheus/mongodb_exporter
$ cp mongodb_exporter/bin/mongodb_exporter /opt/prometheus/mongodb_exporter
```

Create the mongodb_exporter.service:
```bash
$ sudo vim /etc/systemd/system/mongodb_exporter.service
```

/etc/systemd/system/mongodb_exporter.service
```
[Unit]
Description=Mongodb Exporter

[Service]
User=centos
ExecStart=/opt/prometheus/mongodb_exporter/mongodb_exporter -web.listen-address ":9002"

[Install]
WantedBy=default.target
```

```bash
$ sudo systemctl daemon-reload
$ sudo systemctl enable mongodb_exporter.service
$ sudo systemctl start mongodb_exporter.service
```

Edit the prometheus config:
```bash
$ vim ${{cookiecutter.project_name|upper}}_PATH/configs/prometheus.yml
```

${{cookiecutter.project_name|upper}}_PATH/configs/prometheus.yml
```
scrape_configs:
  - job_name: "node"
    scrape_interval: "15s"
    target_groups:
    - targets: ['localhost:9100']
  - job_name: "webserver"
    scrape_interval: "15s"
    target_groups:
    - targets: ['localhost:8001']
  - job_name: "mongodb"
    scrape_interval: "15s"
    target_groups:
    - targets: ['localhost:9002']
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
