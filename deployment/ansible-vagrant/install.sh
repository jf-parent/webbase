#!/bin/bash

sudo pip install ansible
ansible-galaxy install -r requirements.txt
vagrant init centos/7; vagrant up --provider virtualbox
vagrant plugin install vagrant-hostsupdater
vagrant up
