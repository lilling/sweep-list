FROM alpine:latest
MAINTAINER Dovi

# update alpine linux
RUN apk update && apk upgrade && \
    apk add nodejs && \
    # may comment this line in my computer.
    apk add nodejs-npm && \
    npm install -g @angular/cli@1.6.8

# add source code to images
ADD . /sweep-list

# switch working directory
WORKDIR /sweep-list

# install dependencies
RUN npm install
RUN npm run build-once

# switch working directory to server
WORKDIR /sweep-list/sserver

# install dependencies
RUN npm install

# expose port 4200
#EXPOSE 4200
#EXPOSE 8080
EXPOSE 443

# run ng serve on localhost
#CMD ["ng","serve", "--host", "0.0.0.0", "--disable-host-check"]
CMD ["node","index.js"]
