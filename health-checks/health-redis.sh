#!/bin/bash
[[ $(redis-cli -p 80 ping) == 'PONG' ]]