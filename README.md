# fifa-champs
An Angular 2 Application with a NodeJS backend to control EA Sports Fifa matches between a set of players.

# Dependencies: 
Install node

On OSX:
```
Install brew
brew install node
```
On Windows:
* Download and install: https://nodejs.org/en/
* put [\path\to\node] in PATH (system variable)

# Run Backend
Install mongo 
```
brew install mongodb
```
On windows:
* Download and install: https://www.mongodb.com/download-center#community
* put [\path\to\mongo]\bin in PATH (system variable)

install dependencies
```
cd fifa-champs
cd api
npm install
```
Run mongo 
On OSX:
```
mkdir -p /data/db 
./run_mongo.sh
```
On Windows:
```
mongod --port 27017 --dbpath data/db
```

Run server
```
npm start
```
To run backend tests:
```
npm test
```

# Run Frontend
```
cd ../webapp
npm install
sudo npm install -g @angular/cli
ng serve
```
