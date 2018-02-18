function stop_fifachamps () {
  kill $(lsof -c ng -t) > /dev/null 2>&1
  kill $(lsof -c node -t) > /dev/null 2>&1 
  kill $(pidof mongod) > /dev/null 2>&1 
}

function mongo_healthcheck() {
  sleep 2
  for i in `seq 1 5`; do
    echo 'performing mongo healthcheck '${i}'/5'
    if [ `ps -aux | grep mongod | wc -l` -ge '2' ]; then
      echo 'mongo healthcheck passed'
      return 0
    fi
    sleep 5
  done

  echo 'mongo healthcheck failed'
  stop_fifachamps
  exit 1
}

function api_healthcheck() {
  for i in `seq 1 5`; do
    echo 'performing api healthcheck '${i}'/5'
    curl -sL -X GET localhost:5001/api/healthcheck > /dev/null
    if [ "$?" -eq '0' ]; then
      echo 'api healthcheck passed'
      return 0
    fi
    sleep 5
  done

  echo 'api healthcheck failed'
  stop_fifachamps
  exit 1
}

function webapp_healthcheck() {
  for i in `seq 1 5`; do
    echo 'performing webapp healthcheck '${i}'/5'
    curl -sL -X GET localhost:4200 > /dev/null
    if [ "$?" -eq '0' ]; then
      echo 'webapp healthcheck passed'
      return 0
    fi
    sleep 5
  done

  echo 'webapp healthcheck failed'
  stop_fifachamps
  exit 1
}