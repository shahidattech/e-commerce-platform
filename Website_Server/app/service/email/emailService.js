const fs = require('fs');
var path = require('path');
var check = require(path.join(__dirname, '..','..', 'service', 'util', 'checkValidObject'));
const SparkPost = require('sparkpost');



exports.sendEmail = function(data, callback){
    let sendEmail_resp = {};
    try {
        console.log('data 11', data);
        if(!check.isUndefinedOrNullOrEmptyOrNoLen(data)){
          let from = 'support@myglobalbazar.com';
          let to =data['to'];
          let subject = data['subject'];
          let message = "marketingEmail";
          let orderTemplate = data["orderTemplate"];
          // console.log('marketingEmail', orderTemplate);
          var emailTemplate = fs.readFileSync(path.join(__dirname, 'templates', orderTemplate),{encoding:'utf-8'});
          const mailclient = new SparkPost('a3dc3c67ab7fb476957a24d78e1fc96f8705afab');
          let content ={};
          if(!check.isUndefinedOrNullOrEmptyOrNoLen(emailTemplate)){
            content.from = from,
            content.subject = subject,
            content.html = emailTemplate
          }
          else{
            content.from = from,
            content.subject = subject,
            content.message = "New Order Received"
            // content.html =  emailTemplate
          }
          mailclient.transmissions.send({
              options: {
                sandbox: false,
                // endpoint: 'https://api.sparkpost.com:443',
                "click_tracking": false,
                "transactional": true,
                "inline_css": true
              },
              content: content,
              recipients: data['recipients']
            }, function (error, resultset) {
              if (error) {
                console.log("error = " + error);
                callback(false);
              }
              else {
                console.log('Email Sent', resultset);
                callback(true);
              }
            });
        }
        else{
          callback(false);
        }
        
    } catch (error) {
        console.log('Error', error);
        callback(false);
    }
}


exports.sendMailviaSparkpost = function(req, res) {
    

    var bodyData = req.body;   
    console.log('Sending email from server...');
    let from = 'admin@bhbazar.com';
    // let to = 'saiswarupsahu@gmail.com';
    let to ='name.kalyan@gmail.com';
    let subject = "Theme test...";
    let resultSet = {};
    let message = "marketingEmail";

   
      if (from === undefined || from === null || to === undefined || to === null || message === undefined || message === null || subject === undefined) {
        res.send('error_code:invalid data');
      }
    
      mailclient.transmissions.send({
        options: {
          sandbox: false,
          // endpoint: 'https://api.sparkpost.com:443',
          "click_tracking": false,
          // "transactional": true,
          "inline_css": true
        },
        content: {
          from: from,
          subject: subject,
          //html: marketingEmail,
          html:marketingEmail
          // message:'marketingEmail'
          // template_id: "my-first-email"
        },
        recipients: [
          { address: to },
          {address: 'kalyanmondal.com@gmail.com'}
        ]
      }, function (error, resultset) {
        if (error) {
          console.log("error = " + error);
          res.send(error);
        }
        else {
          console.log('Email Sent', resultset);
          res.send(resultset);
        }
      })
    }