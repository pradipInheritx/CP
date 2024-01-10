import * as functions from "firebase-functions";

exports.testingSchedule = functions.pubsub.schedule("*/5 * * * *").onRun(()=>{
    console.log("testing....")
});