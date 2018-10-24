# Redis service

## Single-instance setup
- Run the following command:

        armada run redis -d armada -r myservice-redis-master -v /var/opt/myservice-redis-master:/var/redis --env dev


Keep in mind that single instance redis setup may cause loss of data in case of service failure.
Use it only in development environment or as a caching service.


## master-slave instance setup
With master-slave instance setup all data from master service is read and 
duplicated by slave instance. This configuration enables saved (dumped) data 
persistence in case of hard drive failure and in-memory data persistence 
in case of master service failure.

### Deployment

- To run master use the same command as in single-instance setup:

        armada run redis -d armada -r myservice-redis-master -v /var/opt/myservice-redis-master:/var/redis --env dev

- To run slave instance run the following command:

        armada run redis -d armada -r myservice-redis-slave -v /var/opt/myservice-redis-master:/var/redis --env dev

It is important that the master's and slave's service name differs only by the word master/slave, because the slave
uses the name to discover the master's address.

Keep in mind, that master instance should be located on different machine than
slave instance, but within same armada cluster.

### Fallback
In case your redis-master instance fails, your not-yet-dumped data will be perserved in slave's memory. 
To restore master instance from slave's data follow these steps:

- Connect to redis-slave instance and dump all memory data to file with "SAVE" command, e.g.:
    - `armada ssh myservice-redis-slave redis-cli -p 80 SAVE`
- Stop slave-instance with `armada stop myservice-redis-slave`
- Start master instance and mount it on the same machine where slave instance was running and on slave's volume 
    - `armada run redis -d armada -r myservice-redis-master -v /var/opt/myservice-redis-master:/var/redis --env dev`
- On a different machine, start slave instance 
    - `armada run redis -d armada -r myservice-redis-slave -v /var/opt/myservice-redis-master:/var/redis --env dev`

## Health-checks
default:
- if redis-server is running and responding to `PING`.
- if redis is running as slave, Armada checks if connection to master works.
- if redis eviction policy is `noeviction`, warn level is set by `used_memory_warn_level_proc` 
from config file `config/health-checks.json`


## Hints
- Remove all keys matching specified key prefix  
`EVAL "return redis.call('del', unpack(redis.call('keys', ARGV[1])))" 0 <prefix>:*"`
