#!/bin/bash

INSTALL=false
MONGOPATH="data/db"
FIFACHAMPS="$(echo $PWD)"
STOP=false

for i in "$@"
do
  case ${i} in
    -i|--install)
      INSTALL=true
      shift ;;
    -s|--stop)
      STOP=true
      shift ;;
    --mongo=*)
      MONGOPATH=`echo $i | sed -e 's/--mongo=//g'`
      shift ;;
    *)
      throw_arg "'${i}' is not a valid argument."
      shift ;;
  esac
done

if [[ ${STOP} == "true" ]]; then
  kill $(lsof -t -i:4200) > /dev/null 2>&1
  kill $(lsof -t -i:5001) > /dev/null 2>&1
  kill $(pidof mongod) > /dev/null 2>&1
  exit 0
fi

if ! [[ -d $FIFACHAMPS/logs ]]; then
  echo '[creating LOGS folder]'
  mkdir $FIFACHAMPS/logs
fi

echo '[deploying mongo]'
mongod --dbpath $MONGOPATH >> $FIFACHAMPS/logs/mongo.log &
sleep 10

cd $FIFACHAMPS/api
if [[ ${INSTALL} == "true" ]]; then
  echo '[installing API dependencies]'
  npm install > /dev/null 2>&1
fi
echo '[deploying API]'
npm start >> $FIFACHAMPS/logs/api.log &
sleep 5

cd $FIFACHAMPS/webapp
if [[ ${INSTALL} == "true" ]]; then
  echo '[installing WEBAPPS dependencies]'
  npm install > /dev/null 2>&1
fi
echo '[deploying WEBAPP]'
npm start >> $FIFACHAMPS/logs/webapp.log &
sleep 10

exit 0
