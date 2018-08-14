

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var username = prompt("Enter your username")
var usersOnline = 0;
var player = "";
var option = "";
var config = {
    apiKey: "AIzaSyB1HbHspvpdxMu-jvff11IvOFwvo1pCAqI",
    authDomain: "rps-multiplayer-2fd14.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-2fd14.firebaseio.com",
    projectId: "rps-multiplayer-2fd14",
    storageBucket: "rps-multiplayer-2fd14.appspot.com",
    messagingSenderId: "1028415750332"
};

firebase.initializeApp(config);

var database = firebase.database();




//   var theArray = [];

//       var name = "John";
//       var role = "role";
//       var mRate = "3";
//       var sDate = "4";
var varPush = {
    name: username,
    choice: "nothing",
    message: "",
};
//       database.ref().push(
//           varPush
//       );

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");
var userRef1 = database.ref("/user1");
var userRef2 = database.ref("/user2");
var doubleRun = 0
// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function (snap) {

    // If they are connected..
    if (snap.val()) {
        // Add user to the connections list.
        var con = connectionsRef.push(true);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
        userRef2.onDisconnect().remove()
    }
});


connectionsRef.on("child_added", function (snap) {
    usersOnline++
})

connectionsRef.on("child_removed", function (snap) {
    usersOnline--
    database.ref("user1").update({
        "name": username,
        "winCount": 0,
        "lossCount": 0,
        "message": "",
        "choice": "",
    })
    if (userCount === 1) {
        userRef2.onDisconnect().remove()
    }
    if (userCount === 0) {
        userRef1.onDisconnect().remove()
    }

})



database.ref().on("value", function (snapshot) {
    if (usersOnline === 1) {
        player = "user1"
        database.ref("user1").update({
            "name": username,
            "winCount": 0,
            "lossCount": 0,
            "message": "",
            "choice": "",
        })
    }
    else if (usersOnline === 2 && !snapshot.child("user2").exists()) {
        player = "user2"
        database.ref("user2").update({
            "name": username,
            "winCount": 0,
            "lossCount": 0,
            "message": "",
            "choice": "",
        })
    }
    if (usersOnline === 2 && user1Choice!=="" && user2Choice!=="") {
        user1Loss = snapshot.val()["user1"].lossCount;
        user2Loss = snapshot.val()["user2"].lossCount;
        user1Win = snapshot.val()["user1"].winCount;
        user2Win = snapshot.val()["user2"].winCount;
        user1Choice = snapshot.val()["user1"].choice;
        user2Choice = snapshot.val()["user2"].choice;
        if (user1Choice !== user2Choice) {
            if (user1Choice === "scissors") {
                if (user2Choice === "paper") {
                    user1Win++ , user2Loss++
                    player1Win(user1Win, user2Loss);
                }
                else if (user2Choice === "rock") {
                    user2Win++ , user1Loss++
                    player2Win(user2Win, user1Loss);
                }
            }
            else if (user1Choice === "rock") {

                if (user2Choice === "paper") {
                    user2Win++ , user1Loss++
                    player2Win(user2Win, user1Loss);
                }
                else if (user2Choice === "scissors") {
                    user1Win++ , user2Loss++
                    player1Win(user1Win, user2Loss);
                }
            }
            else if (user1Choice === "paper") {
                if (user2Choice === "scissors") {
                    user1Loss++ , user2Win++
                    player2Win(user2Win, user1Loss);
                }
                else if (user2Choice === "rock") {
                    user1Win++ , user2Loss++
                    player2Win(user1Win, user2Loss);
                }
            }
        }
        else {alert("tiedusers")
        database.ref("user1").update({"choice": ""});
        database.ref("user2").update({"choice": ""});
    }
    };
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


// upon click sends message
$('#sendmessage').on('click', function () {
    var message = $('#messagetext').val();
    database.ref(player).update({
        message: message,
    });
    $('#messenger').append(message)


}),
    // upon click of rock paper or scissors button it will send choice
    $(".choice").on("click", function () {
        option = this.id;
        database.ref(player).update({"choice": option});
        // database.ref("/choice").update(option);
    });

function player1Win(user1Win, user2Loss) {
    database.ref("user1").update({
        winCount: user1Win,
        choice: "",
    })
    database.ref("user2").update({
        lossCount: user2Loss,
        choice: "",
    })
}

function player2Win(user2Win, user1Loss) {
    database.ref("user2").update({
        winCount: use2Win,
        choice: "",
    })
    database.ref("user1").update({
        lossCount: user1Loss,
        choice: "",
    })
}