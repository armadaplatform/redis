FROM microservice_python3
MAINTAINER Cerebro <cerebro@ganymede.eu>

ENV CONFIG_DIR /opt/redis/confs

RUN apt-get install -y make

# Install Redis.
RUN \
	cd /tmp && \
	mkdir redis-stable && \
	curl -s http://download.redis.io/releases/redis-3.2.9.tar.gz | \
	tar xz -C 'redis-stable' --strip-components=1 && \
	cd redis-stable && \
	make && \
	make install && \
	cp -f src/redis-sentinel /usr/local/bin && \
	mkdir -p /etc/redis

RUN mkdir -p /var/redis /var/log/redis

ADD ./supervisor/* /etc/supervisor/conf.d/
ADD ./ /opt/redis

# Define mountable directories.
VOLUME ["/var/redis"]

EXPOSE 80
