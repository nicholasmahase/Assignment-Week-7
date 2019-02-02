
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAhj8guUn1KVtTLAV58NwwMWFTAsDxM52g",
    authDomain: "train-scheduler-4cfd8.firebaseapp.com",
    databaseURL: "https://train-scheduler-4cfd8.firebaseio.com",
    projectId: "train-scheduler-4cfd8",
    storageBucket: "",
    messagingSenderId: "1060463034021"
  };
  firebase.initializeApp(config);
  
  var trainData = firebase.database();
  
  $("#add-train-btn").on("click", function(event) {
    // Prevent the default form submit behavior
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainStop = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainStop,
      firstTrain: firstTrain,
      frequency: frequency
    };
  
    // Uploads train data to the database
    trainData.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
  
    // Alert
    alert("Your train has been added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  // 4. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
  trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var tName = childSnapshot.val().name;
    var tStop = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;
  
    var timeArray = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArray[0]).minutes(timeArray[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;
  
    // If the first train is later than the current time, sent arrival to the first train time
    if (maxMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {

      var differenceTimes = moment().diff(trainTime, "minutes");
      var tRemainder = differenceTimes % tFrequency;
      tMinutes = tFrequency - tRemainder;
      // To calculate the arrival time, add the tMinutes to the current time
      tArrival = moment()
        .add(tMinutes, "m")
        .format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);
  
    // Add each train's data into the table
    $("#train-table > tbody").append(
      $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tStop),
        $("<td>").text(tFrequency),
        $("<td>").text(tArrival),
        $("<td>").text(tMinutes)
      )
    );
  });
  

  