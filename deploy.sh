#!/bin/bash
pushd Frontend
npm install
npm run build
popd
pushd Backend
rm -r dist
cp -r ../Frontend/dist dist/
popd
git subtree split --branch production --prefix Backend/
git checkout production
git push -f
git push heroku production:master --force
$SHELL
