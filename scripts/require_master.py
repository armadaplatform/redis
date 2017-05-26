import os


def main():
    microservice_name = os.environ.get('MICROSERVICE_NAME')
    if 'slave' not in microservice_name:
        return
    master_microservice_name = microservice_name.replace('slave', 'master')
    os.chdir('/opt/microservice/src/local_magellan')
    os.execl('/usr/bin/python', 'python', 'require_service.py', '10003', master_microservice_name)


if __name__ == '__main__':
    main()
