//Declare API reference
const quora = require('quora-api');
const delay = require('delay');

//bot stuff
const Discord = require('discord.js');
const client = new Discord.Client();
client.login("MzcyMjM0MjA4NzAzMTUyMTMw.DNBN3g.t82kPP9qYYCRYZhP3qBN6brnPGc");
//invite url is https://discordapp.com/oauth2/authorize?client_id=372234208703152130&scope=bot&permissions=0

//Declare global arrays
var usernames = ["Thomas Plant"]; //for output messages
var users = ["Thomas-Plant-1"]; //for api parameter
var answerCounts = []; //caches answer counts to be compared against live answer count to determine if a change occured
var outputString = "";
var i = 0;

function loop(delay) {
	if (i<users.length-1) {
        	i++;
		child_process.execSync("sleep " + delay.toString());
		delay(delay).then(() => {checkCounts(delay);}
	}
	else {
		i=0;
		outputString = "";
		delay(delay).then(() => {checkCounts(delay);}
		checkCounts(delay);
	}
}

//Populate answerCounts with dummy values
for (j=0; j<users.length; j++) {
	answerCounts[j] = 0;
}

//Takes the index of a user from users[] (i) and calls quora-api for the user's answercount. Stores the answercount in answerCounts[] if successful, outputs error and retrys if the API returns an error
function checkCounts(delay) {
	quora(users[i]).then(
		function(success) {
			var tempCount = parseInt(success.publicAnswers);
			var dif = tempCount - answerCounts[i];

			if (answerCounts[i] == 0) {
                		answerCounts[i] = parseInt(success.publicAnswers);
				loop(delay);
			}
		
			else if (dif < 1) {
				console.log("No new answers by " + usernames[i] + ".");
				loop(delay);
			}

			else {
				quora.activity.answered(users[i]).then(
					function(success2) {
						console.log(success2);
						var output = [];
						for (j=dif-1; j>-1; j--) {
							var message = usernames[i] + " wrote an answer to " +  success2["question" + j.toString()] + "\n";
							client.channels.get("365402711547445248").send(message);
						}
						console.log(message);
                        			answerCounts[i] = tempCount;
						loop(delay);
					},
					function(error) {
						console.log("API request failed. " + error + ". Retrying in 5 seconds...");
						delay(delay).then(() => {checkCounts(delay);}
						checkCounts(delay);
					}
				)
			}
		},
        	function(error) {
        		console.log("API request failed. " + error + ". Retrying in 5 seconds...");
			delay(delay).then(() => {checkCounts(delay);}
			checkCounts(delay);
        	}
	)
}

checkCounts(60000);