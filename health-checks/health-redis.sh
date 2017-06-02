#!/usr/bin/env bash

if [[ $(redis-cli -p 80 ping) != 'PONG' ]]; then
    echo "Didn't receive PONG."
    exit 1
fi

redis-cli -p 80 info | grep master_link_status:down
if [[ $? -eq 0 ]]; then
    exit 1
fi
