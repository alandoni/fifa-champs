pushd webapp
npm run lint
npm run lint-css
npm run lint-html
popd
pushd api
npm run lint
popd
