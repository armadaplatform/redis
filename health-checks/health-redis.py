#!/usr/bin/env python3

import os

import redis
from armada import hermes


def is_slave(microservice_name):
    return 'slave' in microservice_name


r = redis.StrictRedis(port=80)

if not r.ping():
    print("Didn't receive PONG.")
    exit(1)

microservice_name = os.environ.get('MICROSERVICE_NAME')
redis_info = r.info()
if is_slave(microservice_name) and redis_info['master_link_status'] == 'down':
    print("Can't connect to master.")
    exit(1)

# enable memory_usage healthcheck when redis don't evict keys
if redis_info['maxmemory_policy'] == 'noeviction':
    config = hermes.get_config('health-check.json')
    current_memory_usage = redis_info['used_memory'] / redis_info['maxmemory'] * 100
    used_memory_warn_level_proc = config.get('used_memory_warn_level_proc')
    if current_memory_usage >= config.get('used_memory_warn_level_proc'):
        print(f"Current memory usage {current_memory_usage}% is above {used_memory_warn_level_proc}%.")
        exit(2)
