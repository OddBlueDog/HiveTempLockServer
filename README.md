# HiveTempLockServer

Setup:
```
npm install
npm install pm2 -g
pm2 app.js
```
```
You will also need to make a .env file and put the following in:
DB_HOST={{database host e.g. localhost}}
DB_USER={{database user}}
DB_PASS={{database password}}
DB_DATABASE={{database}}
```
For database and table structure see: hive.sql
