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

## Install Redis

```bash
$ yum install redis
$ systemctl enable redis
$ mkdir /var/log/rqueue
```

## Install Go

Ref: http://www.starkandwayne.com/blog/how-to-install-go-on-digital-ocean/

```bash
$ yum install golang
$ cd /usr/local/bin
$ ln -s /usr/bin/go
$ cd ~
$ #add the $GOPATH to your .bashrc
$ # export GOPATH=$HOME/$PROG/go
$ # export PATH=$PATH":/home/$USER/bin/:/home/$USER/.local/bin:$GOPATH/bin"
$ go version
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


### Backup

```bash
$ mkdir -p /root/mongo-backups/daily
```

```crontab
0 0 * * * mongodump /root/mongo-backups/daily
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
$ npm install webpack webpack-dev-server cloc parker -g
```


