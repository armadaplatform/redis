import os
import shutil

from armada import hermes

REDIS_CONFIG_PATH = '/etc/redis/redis.conf'

DEFAULT_CONFIG = {
    'bind': '0.0.0.0',
    'port': 80,
    'pidfile': '/var/run/redis.pid',
    'dir': '/var/redis',
}


def create_redis_conf_section_from_dict(config):
    lines = ['# Config values added by redis armada service:']
    for k, v in config.items():
        if isinstance(v, list):
            v = ' '.join(map(str, v))
        line = f'{k} {v}'
        lines.append(line + '\n')
    return ''.join(lines)


def main():
    os.environ['CONFIG_PATH'] += ':/opt/redis/'
    microservice_name = os.environ.get('MICROSERVICE_NAME')
    if 'slave' in microservice_name:
        mode = 'slave'
        DEFAULT_CONFIG['slaveof'] = ['127.0.0.1', '10003']
    else:
        mode = 'master'
    config = DEFAULT_CONFIG
    config.update(hermes.get_config(f'redis.{mode}.conf.json'))
    shutil.copyfile('/tmp/redis-stable/redis.conf', REDIS_CONFIG_PATH)
    with open(REDIS_CONFIG_PATH, 'a') as f:
        new_config_section = create_redis_conf_section_from_dict(config)
        f.write(new_config_section)
    os.execl('/usr/local/bin/redis-server', 'redis-server', REDIS_CONFIG_PATH)


if __name__ == '__main__':
    main()
