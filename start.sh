#!/bin/bash

echo "### build images"
docker build -t food-journal-backend:latest .
echo "### remove container"
docker stop food_journal
docker rm food_journal
echo "### start container"
docker container create --name food_journal --restart=always -p 4000:4000 food-journal-backend:latest
docker cp .env food_journal:/app/.env
docker start food_journal