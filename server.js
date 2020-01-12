var AlexaAppServer = require("alexa-app-server");

AlexaAppServer.start({
  server_root: __dirname,
  port: 8080,
  public_html: "public_html",   // Static content
  app_dir: "apps",              // Location of alexa-app modules
  app_root: "/alexa/",          // Service root
  checkCert: true,
  debug : false,
  //httpsPort: 443,
  //httpsEnabled: true,
  //privateKey: 'private-key.pem',
  //certificate: 'cert.cer',
  
  // Use preRequest to load user data on each request and add it to the request json.
  // In reality, this data would come from a db or files, etc.
  preRequest: function(json, req, res) {
    //console.log("preRequest fired");
    json.userDetails = { "name": "MyOnlineEdu" };
  },
  
  // Add a dummy attribute to the response
  postRequest: function(json, req, res) {
    //console.log("postRequest fired");
    json.dummy = "text";
  }
});
