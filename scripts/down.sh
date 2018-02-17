#!/usr/bin/env bash

docker stop $(docker ps -a -f name=qix-engine -q) -t=0 2> /dev/null || true
docker rm $(docker ps -a -f name=qix-engine -q) 2> /dev/null || true

docker stop $(docker ps -a -f name=sense-client -q) -t=0 2> /dev/null || true
docker rm $(docker ps -a -f name=sense-client -q) 2> /dev/null || true
