#!/bin/bash
cd fifa-champs
echo "--------------------------------------------------------------------------"
echo "Installing FrontEnd Dependencies"
echo "--------------------------------------------------------------------------"
pushd Frontend
npm install
echo "--------------------------------------------------------------------------"
echo ""
echo "--------------------------------------------------------------------------"
echo "Building FrontEnd Project"
echo "--------------------------------------------------------------------------"
npm run build
popd
echo "--------------------------------------------------------------------------"
echo ""
echo "--------------------------------------------------------------------------"
echo "Stashing current branch changes, and generating production branch"
echo "--------------------------------------------------------------------------"
current_branch=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)
git branch -D production
git push origin :production
git subtree split --branch production --prefix Backend/
git add .
git stash
echo "--------------------------------------------------------------------------"
echo ""
echo "--------------------------------------------------------------------------"
echo "Copying FrontEnd generated dist to BackEnd project"
echo "--------------------------------------------------------------------------"
git checkout production
rm -r dist
rm -r dist/
cd Frontend
cp -r ./dist ../dist/
cd ..
git add -f ./dist
git commit -m "Adding dist files"
echo "--------------------------------------------------------------------------"
echo ""
echo "--------------------------------------------------------------------------"
echo "Saving production changes to remote repo"
echo "--------------------------------------------------------------------------"
git push --set-upstream origin production
echo "--------------------------------------------------------------------------"
echo ""
echo "--------------------------------------------------------------------------"
echo "Deploying app into Heroku webserver"
echo "--------------------------------------------------------------------------"
git push heroku production:master --force
echo "--------------------------------------------------------------------------"
echo ""
echo "--------------------------------------------------------------------------"
echo "Checking out back previous branch, and popping stash saved"
echo "--------------------------------------------------------------------------"
git checkout "$current_branch"
git stash pop
echo "--------------------------------------------------------------------------"
$SHELL
