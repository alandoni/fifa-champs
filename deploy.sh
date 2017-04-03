#!/bin/bash
echo "--------------------------------------------------------------------------"
echo "Initializing deploy script"
echo "--------------------------------------------------------------------------"
cp ./deployScript.sh ../
cd ..
chmod -R 777 ./deployScript.sh
./deployScript.sh &
