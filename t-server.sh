#!/bin/bash
host="182.92.235.86"
port="22"
user="root"
password="5rdx^TFC7ygv"

# auto_login_ssh () {
#     expect -c "set timeout -1;
#                 spawn -noecho ssh -o StrictHostKeyChecking=no $2 ${@:3};
#                 expect *assword:*;
#                 send -- $1r;
#                 interact;";
# }
 
# auto_login_ssh $password $user@$host
# StrictHostKeyChecking=no
# ssh $user@$host 'bash -s' < /mnt/web/mshare/htm/test/test_service.sh
ssh $user@$host 'bash -s' < server.sh
