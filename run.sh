#!/bin/bash
pushd webapp
npm run build
popd
pushd api
ln -sf ../webapp/dist ./dist
nohup npm start &
popd
