#!/bin/bash
echo "--------------------------------------------------------------------------"
echo "Initializing deploy script"
echo "--------------------------------------------------------------------------"
cp ./deployScript.sh ../
cd ..
./deployScript.sh &
