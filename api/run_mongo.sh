#!/bin/bash
if [ ! -d data/db ]; then
    mkdir -p data/db;
fi;
mongod --port 27017 --dbpath data/db &