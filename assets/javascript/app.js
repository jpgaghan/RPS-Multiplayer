// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var username = "Player"
var usersOnline = 0;
var playerchoose = "";
var playerchosen = "";
var player = "";
var option = "";
var user = 0;
var choiceCount = 0;


// Initialize Firebase
var config = {
    apiKey: "AIzaSyBE9TawlTWYb8sNpbc6KfH7aPDVQMM5-Kk",
    authDomain: "rpsproj-ef229.firebaseapp.com",
    databaseURL: "https://rpsproj-ef229.firebaseio.com",
    projectId: "rpsproj-ef229",
    storageBucket: "rpsproj-ef229.appspot.com",
    messagingSenderId: "465370515105"
};


firebase.initializeApp(config);

var database = firebase.database();

// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");
// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");
var userRef2 = database.ref("/user2");
// When the client's connection state changes...
connectedRef.on("value", function (snap) {

    // If they are connected..
    if (snap.val()) {
        // Add user to the connections list.
        database.ref("choicecount").set(0)
        var con = connectionsRef.push(true);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
        userRef2.onDisconnect().remove();
    }
});


connectionsRef.on("child_added", function (snap) {
    usersOnline++

})
database.ref().on("value", function (snap) {
    if (snap.child("user1").exists() && user === 0) {
        user = 2
    } else if (user === 0) { user = 1 }
})
connectionsRef.on("child_removed", function (snap) {
    usersOnline--
    database.ref("user1").update({
        "name": username,
        "winCount": 0,
        "lossCount": 0,
        "message": "",
        "choice": "nothing"
    })
    user=1
})

database.ref("user1/choice").on("value", function (snapshot) {
    if ((choiceCount !== 0 || choiceCount !== 2) && snapshot.val() !== "nothing"&&snapshot.val() !== null) {
        $("#choose1").hide();
        $("#chosen1").show();
    }
});

database.ref("user1/name").on("value", function (snapshot) {    
    $(".user1").text(snapshot.val())
});

database.ref("user2/name").on("value", function (snapshot) {
        $(".user2").text(snapshot.val())
});

database.ref("user2/choice").on("value", function (snapshot) {
    if ((choiceCount !== 0 || choiceCount !== 2) && snapshot.val() !== "nothing" && snapshot.val() !== null) {
        $("#choose2").hide();
        $("#chosen2").show();
    }
});

database.ref().on("value", function (snapshot) {
    if (usersOnline === 2 && snapshot.val()["user1"].choice !== "nothing" && snapshot.val()["user2"].choice !== "nothing") {
        choiceCount = 2
    }

    if (usersOnline === 1 && (!snapshot.child("user1").exists() || snapshot.numChildren() === 3)) {
        player = "user1"
        database.ref("user1").update({
            "name": "Player 1",
            "winCount": 0,
            "lossCount": 0,
            "message": "",
            "choice": "nothing"
        })
        user = 1
    }
    else if (usersOnline === 2 && !snapshot.child("user2").exists()) {
        player = "user2"
        database.ref("user2").set({
            "name": "Player 2",
            "winCount": 0,
            "lossCount": 0,
            "message": "",
            "choice": "nothing"
        });
        $(".username").show();
        $("#connect2").hide();
        $("#connect1").hide();
        $("#choose2").show();
        $("#choose1").show();
        $("#chosen1").hide();
        database.ref("/user1").update({
            "choice": "nothing"
        });
    }
    if (choiceCount === 2 && snapshot.child("user2").exists()) {
        choiceCount = 2
        $("#chosen2").hide();
        $("#chosen1").hide();
        $("#choose1").show();
        $("#choose2").show();
        choiceCount = 0;
        user1Choice = snapshot.val()["user1"].choice;
        user2Choice = snapshot.val()["user2"].choice;
        user1Loss = snapshot.val()["user1"].lossCount;
        user2Loss = snapshot.val()["user2"].lossCount;
        user1Win = snapshot.val()["user1"].winCount;
        user2Win = snapshot.val()["user2"].winCount;
        database.ref('user2').update({ "choice": "nothing" });
        database.ref('user1').update({ "choice": "nothing" });
        if (user1Choice !== user2Choice) {
            if (user1Choice === "scissors") {
                if (user2Choice === "paper") {
                    user1Win++ , user2Loss++
                    $(".result").text("Player 1 Wins!");
                    database.ref("user1").update({
                        winCount: user1Win,
                    })
                    database.ref("user2").update({
                        lossCount: user2Loss,
                    })
                    $(".wincount").text(`${user1Win}-${user2Win}`)
                }
                else if (user2Choice === "rock") {
                    user2Win++ , user1Loss++
                    $(".result").text("Player 2 Wins!");
                    database.ref("user2").update({
                        winCount: user2Win,
                    })
                    database.ref("user1").update({
                        lossCount: user1Loss,
                    })
                    $(".wincount").text(`${user1Win}-${user2Win}`)
                }
            }
            else if (user1Choice === "rock") {

                if (user2Choice === "paper") {
                    user2Win++ , user1Loss++
                    $(".result").text("Player 2 Wins!");
                    database.ref("user2").update({
                        winCount: user2Win,
                    })
                    database.ref("user1").update({
                        lossCount: user1Loss,
                    })
                    $(".wincount").text(`${user1Win}-${user2Win}`)
                }
                else if (user2Choice === "scissors") {
                    user1Win++ , user2Loss++
                    $(".result").text("Player 1 Wins!");
                    database.ref("user1").update({
                        winCount: user1Win,
                    })
                    database.ref("user2").update({
                        lossCount: user2Loss,
                    })
                    $(".wincount").text(`${user1Win}-${user2Win}`)
                }
            }
            else if (user1Choice === "paper") {
                if (user2Choice === "scissors") {
                    user1Loss++ , user2Win++
                    $(".result").text("Player 2 Wins!");
                    database.ref("user2").update({
                        winCount: user2Win,
                    })
                    database.ref("user1").update({
                        lossCount: user1Loss,
                    })
                    $(".wincount").text(`${user1Win}-${user2Win}`)
                }
                else if (user2Choice === "rock") {
                    user1Win++ , user2Loss++
                    $(".result").text("Player 1 Wins!");
                    database.ref("user1").update({
                        winCount: user1Win,
                    })
                    database.ref("user2").update({
                        lossCount: user2Loss,
                    })
                    $(".wincount").text(`${user1Win}-${user2Win}`)
                }

            }
        }
        else {
            $(".result").text("You Tied!");
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
$(".choice1").on("click", function () {
    if (user === 1) {
        choiceCount++
        option = this.id;
        database.ref('user1').update({ "choice": option });
    }
});

$(".choice2").on("click", function () {
    if (user === 2) {
        choiceCount++
        option = this.id;
        database.ref('user2').update({ "choice": option });
    }
});

$("#username").on("click", function () {
    if (user===1) {
        username = $("#usertext").val()
        database.ref("user1").update({"name": username})
        $(".username").hide();
    }
    if (user===2) {
        username = $("#usertext").val()
        database.ref("user2").update({"name": username})
        $(".username").hide();
    }
});