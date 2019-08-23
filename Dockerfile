FROM node:12

EXPOSE 80 2222
ADD . /var/bot/

# Setup OpenSSH for debugging thru Azure Web App
# https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-ssh-support#ssh-support-with-custom-docker-images
# https://docs.microsoft.com/en-us/azure/app-service/containers/tutorial-custom-docker-image
ENV SSH_PASSWD "root:Docker!"
ENV SSH_PORT 2222
RUN \
  apt-get update \
  && apt-get install -y --no-install-recommends dialog \
  && apt-get update \
  && apt-get install -y --no-install-recommends openssh-server \
  && echo "$SSH_PASSWD" | chpasswd \
  && mv /var/bot/sshd_config /etc/ssh/ \
  && mv /var/bot/init.sh /usr/local/bin/ \
  && chmod u+x /usr/local/bin/init.sh

WORKDIR /var/bot/
RUN npm ci
RUN npm run bootstrap
RUN npm run prepublishOnly

# Set up entrypoint
ENTRYPOINT /usr/local/bin/init.sh
