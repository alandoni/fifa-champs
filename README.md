# fifa-champs

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
cd Backend
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
cd ../Frontend
npm install
sudo npm install -g @angular/cli
ng serve
```
