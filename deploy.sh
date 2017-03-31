#!/bin/bash
pushd Frontend
npm install
npm run build
popd
pushd Backend
ln -sf ../Frontend/dist ./dist
popd
git push heroku `git subtree split --prefix Backend production`:master --force
