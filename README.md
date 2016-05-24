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
$ npm install webpack -g
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
su
cd $PROG
git clone https://github.com/hynek/prometheus_async
python setup.py install
wget https://github.com/prometheus/prometheus/releases/download/0.18.0/prometheus-0.18.0.linux-amd64.tar.gz
tar xvf prometheus-0.18.0.linux-amd64.tar.gz
cd prometheus-0.18.0.linux-amd64
./prometheus --version
```
