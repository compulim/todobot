FROM node:12 AS builder

EXPOSE 80 2222
ADD . /var/build/

WORKDIR /var/build/
RUN npm ci
RUN npm run bootstrap
RUN npm run prepublishOnly

FROM node:12

# Setup OpenSSH for debugging thru Azure Web App
# https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-ssh-support#ssh-support-with-custom-docker-images
# https://docs.microsoft.com/en-us/azure/app-service/containers/tutorial-custom-docker-image
ENV SSH_PASSWD "root:Docker!"
ENV SSH_PORT 2222

COPY --from=builder /var/build/init.sh /usr/local/bin/
COPY --from=builder /var/build/packages/bot/ /var/bot/
COPY --from=builder /var/build/packages/app/build/ /var/bot/public/

RUN \
  apt-get update \
  && apt-get install -y --no-install-recommends dialog \
  && apt-get update \
  && apt-get install -y --no-install-recommends openssh-server \
  && echo "$SSH_PASSWD" | chpasswd \
  && chmod u+x /usr/local/bin/init.sh

COPY --from=builder /var/build/sshd_config /etc/ssh/

# Set up entrypoint
ENTRYPOINT /usr/local/bin/init.sh

RUN \
  apt-get install -y zip \
  && cd /var/bot/ \
  && zip -1rq /var/zipdeploy.zip .
