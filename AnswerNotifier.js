//Sends messages to a given Discord channel when selected Quora users write new answers, using the Quora Notifier bot.

//Declare API references
const quora = require('quora-api'); //patched version of https://www.npmjs.com/package/quora-api (deprecated). Install instructions available in README.md (https://github.com/Pl4nty/Quora-Answer-Notifs/README.md)
const delay = require('delay'); //C++ sleep wrapper, available from https://www.npmjs.com/package/delay
const Discord = require('discord.js'); //Discord API JavaScript wrapper, available from https://www.npmjs.com/package/discord.js

const client = new Discord.Client(); //Declare Discord bot object
client.login("MzcyMjM0MjA4NzAzMTUyMTMw.DNBN3g.t82kPP9qYYCRYZhP3qBN6brnPGc"); //Authenticate to Discord API with bot token
//Bot's invite url is https://discordapp.com/oauth2/authorize?client_id=372234208703152130&scope=bot&permissions=0

//Declare global arrays
var usernames = ["Thomas Plant"]; //for usernames in output messages #remove this by adding string processing to users[]
var users = ["Thomas-Plant-1"]; //Quora username endpoints from each user's profile
var answerCounts = []; //caches answer counts to be compared against live answer count and determine if a change occurred
var i = 0; //couldn't think of a better name for it
var channel = "365402711547445248"; //ID of Discord channel to post in
//Bot must be added with the invite URL (see line 8), right-click on the channel and click "Copy ID"

//Populate answerCounts with 0s to detect 1st-time run
for (j=0; j<users.length; j++) {
    answerCounts[j] = 0;
}

//Iterates through users[] with i, sleeping for the delay before running checkCounts
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

//Takes a delay in ms (delay) and the index of a user from users[] (i) and calls quora-api for the user's answer count.
//Handles the better part of the program's logic, see line-by-line comments for details
function checkCounts(delay) {
	quora(users[i]).then(
		function(success) {
			var tempCount = parseInt(success.publicAnswers); //Set local variable for the answer count #not sure if parseInt is necessary, will confirm
			var dif = tempCount - answerCounts[i]; //Calculate the difference between new and old answer counts

			if (answerCounts[i] == 0) { //If 0, checkCounts hasn't been executed before - populate answerCounts with answer count and iterate
                answerCounts[i] = tempCount;
				loop(delay);
			}
		
			else if (dif < 1) { //If no answers have been added, update answerCounts[] (in case an answer has been removed) and loop.
                // #Efficiency - add a check for dif < 0, so program doesn't update answerCounts[] with existing values
                answerCounts[i] = tempCount;
                loop(delay);
			}

			else { //A new answer has been added!
				quora.activity.answered(users[i]).then( //Get the details of the answered questions (the last dif questions answered by the user)
					function(success2) {
						for (j=dif-1; j>-1; j--) { //Starting at the oldest new answer (question[dif-1]), iterates downward to the latest answer, posting a message to the given channel each time.
							var message = usernames[i] + " wrote an answer to " +  success2["question" + j.toString()] + "\n";
							client.channels.get(channel).send(message);
                            console.log(message); //Log message to console
						}
                        answerCounts[i] = tempCount; //Update answerCounts[] with new answer count
						loop(delay); //Loop
					},
					function(error) { //API request failed. Logs error and retries after 5 seconds
						console.log("API request failed. " + error + ". Retrying in 5 seconds...");
						delay(5000).then(() => {checkCounts(delay);}
						checkCounts(delay);
					}
				)
			}
		},
        	function(error) { //API request failed. Logs error and retries after 5 seconds
        		console.log("API request failed. " + error + ". Retrying in 5 seconds...");
			delay(5000).then(() => {checkCounts(delay);}
			checkCounts(delay);
        	}
	)
}

checkCounts(60000); //Call function with delay (ms) #maybe make a global variable? Would require a major refactor