FROM microservice_node
MAINTAINER Cerebro <cerebro@ganymede.eu>

RUN apt-get install -y git make

# Install Redis.
RUN \
	cd /tmp && \
	mkdir redis-stable && \
	curl http://download.redis.io/releases/redis-2.8.17.tar.gz | \
	tar xvz -C 'redis-stable' --strip-components=1 && \
	cd redis-stable && \
	make && \
	make install && \
	cp -f src/redis-sentinel /usr/local/bin && \
	mkdir -p /etc/redis

RUN mkdir /var/redis
RUN mkdir /var/log/redis

ADD ./ /opt/redis
ADD ./supervisor/run-redis.conf /etc/supervisor/conf.d/run-redis.conf

ADD ./health-checks/health-redis.sh /opt/microservice/health-checks/
RUN rm -f /opt/microservice/health-checks/http-ok
RUN rm -f /opt/microservice/health-checks/main-port-open

RUN cd /opt/redis ; npm install
# Define mountable directories.
VOLUME ["/var/redis"]

# Expose ports.
EXPOSE 80
