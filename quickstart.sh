#!/bin/bash

source ./bash_resources/healthcheck.sh

INSTALL=false
MONGOPATH="data/db"
FIFACHAMPS="$(echo $PWD)"
STOP=false

for i in "$@"
do
  case ${i} in
    -i|--install) # installation flag - used if the users wants to install dependencies
      INSTALL=true ;;
    -s|--stop) # script stop flag - used to kill all fifa-champs processes
      STOP=true ;;
    -m=*|--mongo=*) # mongopath flag - used to set an alternative MONGOPATH
      MONGOPATH="${i#*=}" ;;
    *)
      throw_arg "'${i}' is not a valid argument." ;;
  esac
done

# kill webapp, api, and mongo processes
if [[ ${STOP} == "true" ]]; then
  stop_fifachamps
  exit 0
fi

# creates logs directory if dont exist
if ! [[ -d $FIFACHAMPS/logs ]]; then
  echo '[creating LOGS folder]'
  mkdir $FIFACHAMPS/logs
fi

# starts mongod using the MONGOPATH
echo '[starting mongo]'
mongod --dbpath $MONGOPATH >> $FIFACHAMPS/logs/mongo.log &
mongo_healthcheck

# goes to fifa-champs API
cd $FIFACHAMPS/api

# installs API dependencies
if [[ ${INSTALL} == "true" ]]; then
  echo '[installing API dependencies]'
  npm install > /dev/null 2>&1
fi

echo '[starting API]'
npm start >> $FIFACHAMPS/logs/api.log 2>&1 &
api_healthcheck

# goes to fifa-champs WEBAPP
cd $FIFACHAMPS/webapp

# installs WEBAPP dependencies
if [[ ${INSTALL} == "true" ]]; then
  echo '[installing WEBAPPS dependencies]'
  npm install > /dev/null 2>&1
fi

echo '[starting WEBAPP]'
npm start >> $FIFACHAMPS/logs/webapp.log 2>&1 &
webapp_healthcheck

exit 0
