# INSTALLATION [CentOS-7]

## Dependencies packages

```bash
$ su
$ yum install git gcc gcc-c++
```

## SSH

```bash
$ su
$ chkconfig sshd on
$ systemctl start sshd
```

## Install Phantomjs

Ref: http://sameerhalai.com/blog/how-to-install-phantomjs-on-a-centos-server/

```bash
$ su
$ wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2
$ tar xvf phantomjs-2.1.1-linux-x86_64.tar.bz2
$ cp phantomjs-2.1.1-linux-x86_64.tar.bz2/bin/phantomjs /usr/local/bin
$ rm phantomjs-2.1.1-linux-x86_64*
$ yum install fontconfig freetype
$ phantomjs --version
```

## Install Node

Ref: https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-a-centos-7-server

```bash
$ su
$ wget https://nodejs.org/dist/v4.4.4/node-v4.4.4.tar.gz
$ tar xzvf node-v* && cd node-v*
$ ./configure
$ make
$ make install
& cd .. && rm -fr node-v*
```

## Install Mongodb

Ref: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/

```bash
$ su
$ echo "
[mongodb]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
gpgcheck=0
enabled=1
" >> /etc/yum.repos.d/mongodb.repo
$ yum -y update
$ yum install -y mongodb-org
$ chkconfig mongod on
$ semanage port -a -t mongod_port_t -p tcp 27017
$ service mongod start
```

## Install Python3.5

Ref: http://ask.xmodulo.com/install-python3-centos.html

```bash
$ su
$ yum install yum-utils
$ yum-builddep python
$ curl -O https://www.python.org/ftp/python/3.5.0/Python-3.5.0.tgz
$ tar xf Python-3.5.0.tgz
$ cd Python-3.5.0
$ ./configure
$ make
$ make install
```

## Install virtualenvwrapper

Ref: http://virtualenvwrapper.readthedocs.io/en/latest/install.html

```bash
$ su
$ pip install virtualenvwrapper
$ cd
$ mkdir -p ~/PROG/PYTHON
```

vim .bashrc
```bash
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/PROG/PYTHON
export VIRTUALENVWRAPPER_PYTHON=/usr/local/bin/python3.5
source /usr/local/bin/virtualenvwrapper.sh
```

## Install node global package

```bash
$ npm install webpack webpack-dev-server -g
```

# CONFIGURATION

```bash
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
$ wget https://github.com/prometheus/prometheus/releases/download/0.18.0/prometheus-0.18.0.linux-amd64.tar.gz
$ tar xvf prometheus-0.18.0.linux-amd64.tar.gz
$ mv prometheus-0.18.0.linux-amd64 prometheus
$ mv prometheus /opt
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

Edit the prometheus config:
```bash
$ vim /opt/prometheus/prometheus.yml
```

/opt/prometheus/prometheus.yml
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
```

# USAGE

## LINT / FLAKE8

```bash
$ make lint
```

## TESTING

```bash
$ npm run test
$ npm run test:watch
```

## DEV

```bash
$ webpack-dev-server
```

## BUILD-PROD

```bash
$ npm run build
```
