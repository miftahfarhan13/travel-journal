#!/bin/bash

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
echo ${SCRIPTPATH}

echo "### build images"
docker build -t food-journal-backend:latest .
echo "### remove container"
docker stop food_journal
docker rm food_journal
echo "### start container"
docker container create --name food_journal --restart==on-failure:10 -p 4000:4000 -v ${SCRIPTPATH}/public/images:/app/public/images food-journal-backend:latest
docker cp .env food_journal:/app/.env
docker start food_journal
echo "### remove cache"
docker image prune -f