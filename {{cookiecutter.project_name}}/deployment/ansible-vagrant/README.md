# Vagrant

## Installation

```bash
sudo pip install ansible
ansible-galaxy install -r requirements.txt
vagrant init centos/7; vagrant up --provider virtualbox
vagrant plugin install vagrant-hostsupdater
vagrant up
```

or 

```bash
./install.sh
```

## Usage

### HOST
```bash
vagrant ssh
```

### GUEST
```bash
cd {{cookiecutter.project_name}}
npm install
make deps-dev
make start-prod-server
npm run start-wd
```

### HOST
* Visit http://{{cookiecutter.project_name}}.com
