'use strict';
var db = require('./dbService.js');

var botLib = {};

botLib.makeReservation = function(reservationObj) {

   return new Promise(function(resolve, reject) {

      var insertDataObj = reservationObj;

      db.insertRecord("moe_dummy_restaurant", insertDataObj, function(errMsg, dbResponse){

         if(errMsg)
            reject('Error in insert of reservation details into database. Error message=' + errMsg);
         else{
            //console.log('dbResponse=' + dbResponse);
            var alexaResponseMsg = 'Successfully created the reservation with number ' + dbResponse.insertId;
            resolve(alexaResponseMsg);
         }
      });
   });
}

/* ----------------------------------------------------------------------------------------- */

botLib.cancelReservation = function(reservationNumber) {

   var tableNameArray = ["moe_dummy_restaurant mdr"];
   var selectColArray = ["*"];
   var orderByStr = 'ORDER BY mdr.order_number';

   var whereStr = ' WHERE 1=1 ';
   var whereBindArray = [];

   whereStr += ' AND mdr.order_number = ?';
   whereBindArray.push(reservationNumber);

   return new Promise(function(resolve, reject) {

      db.selectRecord(selectColArray, tableNameArray, whereStr, whereBindArray, orderByStr, null, null, function(err, dbResult){

         if(err)
            reject('Error in querying reservation data from database. Error message=' + err.message);
         else if(Array.isArray(dbResult) && dbResult.length > 0){
            
            var setStr = " res_status = 'CANCELLED'";
            whereStr = " WHERE order_number = " + reservationNumber;
            db.updateRecord("moe_dummy_restaurant", setStr, whereStr, function(err, updateResult){
               resolve("Reservation number " + reservationNumber + " is cancelled successfully");
            })
         }
         else
            reject('No such reservation number ' + reservationNumber + ' found.');
      });
   });
}

module.exports = botLib;