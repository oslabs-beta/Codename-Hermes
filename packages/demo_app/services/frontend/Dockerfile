# This means we are using the "node" docker image as a base for ours.
FROM node

# This will change the working directory to /src (this happens inside the container)
WORKDIR /src

# This will copy all the files from the current directory (/codename_hermes/packages/demo_app/services/frontend/*) and paste them into the working directory (/src) in the docker image
COPY ./* ./

# This installs all packages needed for our service
RUN "yarn" "install"

# This command is run when the image is started as a container
ENTRYPOINT [ "yarn", "start:dev" ]

# This is setting default environment variables. In this case it is setting "TARGET" to be "production"
ENV TARGET="production"

# This just says "hey, we have this port available" 
# You will have to tell docker to allow traffic to this port
EXPOSE 8080