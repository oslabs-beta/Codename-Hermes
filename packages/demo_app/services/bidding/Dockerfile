FROM node
WORKDIR /src
COPY ./* ./
RUN "yarn" "install"
ENTRYPOINT [ "yarn", "start:dev" ]
ENV KAFKA_HOST="localhost:9092"