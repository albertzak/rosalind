#!/bin/bash

set -e

cd "$(dirname "$0")"

if [ ! -e ../build/bundle/package.json ]; then
  echo "** Skipping image"
  echo "     Please make sure you run ./build.sh"
  echo "     and build/bundle/package.json exists."
  exit 1
else

  if [ ! -z $CI ]; then
    echo "** Logging in to $DOCKER_SERVER"
    docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD -e $DOCKER_EMAIL $DOCKER_SERVER
  fi

  echo "** Building docker image"

  source prepare.sh

  cp Dockerfile ../build/bundle/Dockerfile

  cd ../build/bundle/

  if [ ! -z $TRAVIS_COMMIT ]; then
    echo "ENV COMMIT_HASH $TRAVIS_COMMIT" >> Dockerfile
    echo "ENV BUILD_NUMBER $TRAVIS_BUILD_NUMBER" >> Dockerfile
  fi

  echo "** Building image with tag: $DOCKER_IMAGE_WITH_TAG"
  docker build -t $DOCKER_IMAGE_WITH_TAG .

  echo "** Tagging image $DOCKER_IMAGE_WITH_TAG with $DOCKER_IMAGE:latest"
  docker tag $DOCKER_IMAGE_WITH_TAG $DOCKER_IMAGE:latest

  rm Dockerfile
  cd -

fi
