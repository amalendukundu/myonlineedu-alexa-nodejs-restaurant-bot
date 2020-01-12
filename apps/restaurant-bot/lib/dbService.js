'use strict';
var mysql = require('mysql');
var commonLib = require('./common-lib.js');

var dbService = {};

/* ---------------------------------------------------------------------------------- */

function getDBConnectionConfig(){
   var mysqlHost = process.env.MYSQL_HOST || 'localhost';
   var mysqlPort = process.env.MYSQL_PORT || '3306';
   var mysqlUser = process.env.MYSQL_USER || 'root';
   var mysqlPass = process.env.MYSQL_PASS || 'root';
   var mysqlDB   = process.env.MYSQL_DB   || 'alexa_db';
   
   var connectionOptions = {
     host: mysqlHost,
     port: mysqlPort,
     user: mysqlUser,
     password: mysqlPass,
     database: mysqlDB,
     dateStrings: true
   };

   return connectionOptions;
}

/* ---------------------------------------------------------------------------------- */

dbService.insertRecord = function(tableName, insertDataObj, callback){
   var conOptions = getDBConnectionConfig();
   var dbCon = mysql.createConnection(conOptions);

   var insertStmt = 'INSERT INTO ' + tableName + ' SET ?';

   dbCon.query(insertStmt, insertDataObj, function (err, result) {
     if(err)
        callback(err, null);
     else
        callback(null,result);
   });
    
   dbCon.end();
}

/* ---------------------------------------------------------------------------------- */

dbService.updateRecord = function(tableName, setStr, whereStr, callback){
   var conOptions = getDBConnectionConfig();
   var dbCon = mysql.createConnection(conOptions);

   var updateStmt = "UPDATE " + tableName + " SET " + setStr + " " + whereStr;

   //console.log('UPDATE Statement:');
   //console.log(updateStmt);

   dbCon.query(updateStmt, function (err, result) {
     if(err)
        callback(err, null);
     else
        callback(null,result);
   });
    
   dbCon.end();
}

/* ---------------------------------------------------------------------------------- */

dbService.selectRecord = function(colNameArray, tableNameArray, whereStr, whereBindArray, orderByStr, limit, offset, callback){
   var conOptions = getDBConnectionConfig();
   var dbCon = mysql.createConnection(conOptions);

   var selectStr = "SELECT " + colNameArray.join(',') + " FROM " + tableNameArray.join(',');

   if(!commonLib.isEmpty(whereStr))
      selectStr += whereStr;

   if(!commonLib.isEmpty(orderByStr))
      selectStr += ' ' + orderByStr;

   if(!commonLib.isEmpty(limit))
      selectStr += ' LIMIT ' + limit;
   else
      selectStr += ' LIMIT ' + 50;

   if(!commonLib.isEmpty(offset))
      selectStr += ' OFFSET ' + offset;

   //console.log('DB SELECT query:');
   //console.log(selectStr);
   
   dbCon.query(selectStr, whereBindArray, function (err, result) {
     if(err)
        callback(err, null);
     else
        callback(null,result);
   });
    
   dbCon.end();  
}

module.exports = dbService;