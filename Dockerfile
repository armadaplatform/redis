FROM microservice_node
MAINTAINER Cerebro <cerebro@ganymede.eu>

RUN apt-get install -y git make g++

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

RUN mkdir -p /var/redis /var/log/redis

ADD ./supervisor/* /etc/supervisor/conf.d/
ADD ./ /opt/redis

RUN cd /opt/redis && npm install
# Define mountable directories.
VOLUME ["/var/redis"]

EXPOSE 80
