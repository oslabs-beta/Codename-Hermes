FROM node

WORKDIR /src
COPY ./* ./

# RUN "touch yarn.lock"
# RUN "yarn" "set version stable"
# RUN "yarn" "config set nodeLinker node-modules"
RUN "yarn" "install"

ENTRYPOINT [ "yarn", "start:dev" ]
ENV TARGET="production"
EXPOSE 8080