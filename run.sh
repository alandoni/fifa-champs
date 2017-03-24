#!/bin/bash
pushd Frontend
npm run build
popd
pushd Backend
ln -sf ../Frontend/dist ./dist
nohup npm start &
popd