#!/usr/bin/env bash

# Start sshd for debugging thru Azure Web App
sed -i "s/SSH_PORT/$SSH_PORT/g" /etc/ssh/sshd_config
service ssh start
# /usr/sbin/sshd

# Start both bot server and web server
cd /var/bot/
node .
