# Redis service

## Single instance setup
- Simply checkout code and run the following commands in project's root directory.


        armada build myservice-redis-master
        armada run myservice-redis-master -v /var/opt/myservice-redis-master:/var/redis --env dev -d local
        

Keep in mind that single instance redis setup may cause loss of data in case of service failure.
Use it only in developement environment or as a caching service.


## master-slave instance setup
With master-slave instance setup all data from master service is read and 
duplicated by slave instance. This configuration enables saved (dumped) data 
persistence in case of hard drive failure and in-memory data persistence 
in case of master service failure.

### Deployment
- create separate project with simple Dockerfile. Use 'redis' as a service base 
in and add supervisor config file.

```
    FROM redis
    MAINTAINER you <you@yourdomain.com>
    ADD ./supervisor/require-master.conf /etc/supervisor/conf.d/require-master.conf
```

- ./supervisor/require-master.conf is used by redis slave instance to connect to 
redis master instance, it should look like this:

```
    [program:require_myservice-redis-master]
    directory=/opt/microservice/src/local_magellan
    command=python require_service.py 10003 myservice-redis-master
```
    
- Build this service, and run master and slave intances using docker tag. 
Keep in mind, that master instance should be located on different machine than 
slave instance, but within same armada cluster.
This example script builds service on one machine, then sends it over to 
another one through local dockyard.

On **ship1**

    armada build myservice-redis-master
    armada run myservice-redis-master -v /var/opt/myservice-redis-master:/var/redis --env dev -d local
    docker tag -f myservice-redis-master myservice-redis-slave
    armada push myservice-redis-slave -d mydockyard
    

On **ship2**

    armada run myservice-redis-slave -v /var/opt/myservice-redis-master:/var/redis --env dev -d mydockyard
    
### Fallback
In case your redis-master instance fails, your not-yet-dumped data will be perserved in slave's memory. 
To restore master instance from slave's data follow these steps:

- Connect to redis-slave instance and dump all memory data to file with "SAVE" command, e.g.:
    - `armada ssh myservice-redis-master redis-cli -p 80 SAVE`
- Stop slave-instance with `armada stop`
- Start master instance and mount it on the same machine where slave instance was running and on slave's volume 
    - `armada run myservice-redis-master -v /var/opt/myservice-redis-master:/var/redis --env dev -d mydockyard`
- On a different machine, start slave instance 
    - `armada run myservice-redis-slave -v /var/opt/myservice-redis-master:/var/redis --env dev -d mydockyard`
