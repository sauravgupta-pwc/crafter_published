 var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
const fs = require('fs');

app.post('/csWebhook', function(req, res, next) {
  console.log("Inside file webwhook log");
	let filePath = "./files/counsellingDescription.txt";

  var file_content = fs.readFileSync(filePath);
  var content = JSON.parse(file_content);

	if(req.body.result.action === 'counselling'){
		var minLifespan = Number.MAX_SAFE_INTEGER;
		var contexts;
		for(i=0; i < req.body.result.contexts.length; i++){
			if(minLifespan > req.body.result.contexts[i].lifespan){
				minLifespan = req.body.result.contexts[i].lifespan;
				contexts = req.body.result.contexts[i];
			}
		}
		if(contexts != 'undefined'){
			console.log("inside csWebhook ::: ",contexts);

			var contactNumber = contexts.parameters.Contactnumber;
			var courseName = contexts.parameters.CourseName;
			var email = contexts.parameters.email;

			console.log('CAPTURED DETAILS:::',contactNumber,email,courseName);

			try{
        content.push({"course": courseName, "email": email, "contactNo": contactNumber});
        fs.appendFileSync(filePath, JSON.stringify(content));
        console.log("File write complete");
			} catch(err){
				console.log(err);
			}
		}

		res.json({
				"speech" : "Thanks, the details are captured. Our Education Expert will contact you soon.",
				"displayText" : "Thanks, the details are captured. Our Education Expert will contact you soon.",
				"source" : "dialogflow-webhook-demo"
		});
	}
});


module.exports = router;
