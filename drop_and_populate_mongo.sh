mongo test --eval "db.dropDatabase();"

mongorestore -d test -c admins ./data_dump/admins.bson
mongorestore -d test -c championships ./data_dump/championships.bson
mongorestore -d test -c players ./data_dump/players.bson
mongorestore -d test -c matches ./data_dump/matches.bson
