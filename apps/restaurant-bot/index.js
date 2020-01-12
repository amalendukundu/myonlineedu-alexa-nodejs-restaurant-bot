var alexa = require('alexa-app');
var botLib = require('./lib/botLib.js');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
var app = new alexa.app('restaurant-bot');
app.id = require('./package.json').alexa.applicationId;

/* ----------------------------------------------------------------------------------------- */

app.launch(function(req, res) {
  
  console.log('Inside MOE Restaurant Bot launch...');

  var outputSpeech = "Hi! Welcome to Dummy Restaurant for MyOnlinEdu dot com. How can I help you today?";
  var outputText = "Hi! Welcome to Dummy Restaurant for MyOnlinEdu.com. How can I help you today?";
  var promptText = "Hi! Welcome to Dummy Restaurant for MyOnlinEdu.com. How can I help you today?";

  //Send response
  res.card({
    type: "Standard",
    title: "MOE Dummy Restaurant",
    text: outputText
  });

  res.say(outputSpeech).reprompt(promptText).shouldEndSession(false);
});

/* ----------------------------------------------------------------------------------------- */

app.intent('MakeReservation', function(req, res) {
  
  console.log('Inside intent = MakeReservation');
  //console.log(req);
  console.log('-----------------------------------MakeReservation----------------------------------------------');

  var outputSpeech = "";
  var outputText = "";
  var promptText = "";

  var reservationObj = {
     "res_num_of_people"  : req.slot('NumberOfPeople')
    ,"res_date" : req.slot('ReservationDate')
    ,"res_time" : req.slot('ReservationTime')
    ,"res_person_name" : req.slot('PersonName')
    ,"res_location" : req.slot('RestaurantLocation')
    ,"res_status" : "SUCCESS"
  };

  console.log('----Slot Values----');
  console.log(reservationObj);

  return botLib.makeReservation(reservationObj)
         .then(function(alexaResponseMsg){
            console.log('Inside Promise THEN SUCCESS ...');

            outputSpeech = alexaResponseMsg;
            outputText = outputSpeech;
            promptText = 'You may want to continue the conversation. I am still listening. How can I help you?';

            res.card({
              type: "Standard",
              title: "Reservation Status",
              text: outputText
            });

            res.say(outputSpeech).reprompt(promptText).shouldEndSession(false);
            return res.send();
         },
         function(err){
            console.log('Inside Promise THEN ERROR=' + err);

            outputSpeech = 'Sorry, encountered an issue with database. Please contact support team.';
            outputText = outputSpeech;
            
            res.card({
              type: "Standard",
              title: "Reservation Status - Error",
              text: outputText
            });

            res.say(outputSpeech).shouldEndSession(false);
            return res.send();
         });

});

/* ----------------------------------------------------------------------------------------- */

app.intent('CancelReservation', function(req, res) {
  
  console.log('Inside intent = CancelReservation');
  //console.log(req);
  console.log('-----------------------------------CancelReservation----------------------------------------------');

  var outputSpeech = "";
  var outputText = "";
  var promptText = "";

  var reservationNumber = req.slot('ReservationNumber');

  console.log('----Reservation Number Slot----');
  console.log(reservationNumber);

  return botLib.cancelReservation(reservationNumber)
         .then(function(alexaResponseMsg){
            console.log('Inside Promise THEN SUCCESS ...');

            outputSpeech = alexaResponseMsg;
            outputText = outputSpeech;
            promptText = 'You may want to continue the conversation. I am still listening. How can I help you?';

            res.card({
              type: "Standard",
              title: "Cancel Reservation Request",
              text: outputText
            });

            res.say(outputSpeech).reprompt(promptText).shouldEndSession(false);
            return res.send();
         },
         function(err){
            console.log('Inside Promise THEN ERROR=' + err);

            outputSpeech = 'Sorry, encountered an issue with database. Please contact support team.';
            outputText = outputSpeech;
            
            res.card({
              type: "Standard",
              title: "Reservation Cancel Status - Error",
              text: outputText
            });

            res.say(outputSpeech).shouldEndSession(false);
            return res.send();
         });

});

/* ----------------------------------------------------------------------------------------- */

app.intent('AMAZON.HelpIntent', function(req, res) {
  var helpOutput = "You can reserve table or can an reservation.";
  var reprompt = "What would you like to do?";
  
  res.card({
    type: "Standard",
    title: "Help Information", // this is not required for type Simple or Standard
    text: helpOutput
    //image: { // image is optional
      //smallImageUrl: "https://carfu.com/resources/card-images/race-car-small.png", // required
      //largeImageUrl: "https://carfu.com/resources/card-images/race-car-large.png"
    //}
  });

  // AMAZON.HelpIntent must leave session open -> .shouldEndSession(false)
  res.say(helpOutput).reprompt(reprompt).shouldEndSession(false);
});

module.exports = app;
