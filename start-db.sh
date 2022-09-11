# check if docker is running
if [ ! "$(docker ps -q -f name=learn-gql)" ]; then
    # run container if it's off
    docker-compose up -d
fi
