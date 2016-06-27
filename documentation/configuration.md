# CONFIGURATION

```bash
$ mkdir /var/log/webbase/
$ mkvirtualenv webbase
$ git clone https://github.com/jf-parent/webbase
$ cd webbase
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
$ ln -s -f $WEBBASE/configs/prometheus.yml /opt/prometheus/
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
$ vim $WEBBASE_PATH/configs/prometheus.yml
```

$WEBBASE_PATH/configs/prometheus.yml
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
$ mkdir /var/run/webbase
$ yum install epel-release
$ yum install monit
$ cp configs/monitrc.example monitrc
$ cp configs/monitrc configs/mymonitrc
$ vim configs/mymonicrc # username/password, port, slack_api_key
$ ln -sf $WEBBASE/configs/mymonitrc /etc/monitrc
$ chmod 700 config/monitrc
$ systemctl enable monit
$ systemctl start monit
$ git clone https://github.com/jf-parent/slack
$ #install it
```
