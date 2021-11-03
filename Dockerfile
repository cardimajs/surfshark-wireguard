FROM alpine:3.14

# install dependencies
RUN apk add --update --no-cache wireguard-tools wireguard-tools-wg nodejs npm yarn

# https://github.com/bobbypage/docker-wireguard/commit/5e16644902040ba2fc81c32f8a085c1678876130
RUN sed -i "s:sysctl -q net.ipv4.conf.all.src_valid_mark=1:echo skipping setting net.ipv4.conf.all.src_valid_mark:" /usr/bin/wg-quick

ENV SURFSHARK_USER=
ENV SURFSHARK_PASSWORD=
ENV SURFSHARK_COUNTRY=
ENV SURFSHARK_CITY=
ENV LAN_NETWORK=
ENV KILL_SWITCH=true

WORKDIR /usr/src/app

COPY . .

RUN yarn install

RUN yarn run build

CMD ["yarn", "start"]