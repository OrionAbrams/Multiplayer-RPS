var config = {
  apiKey: "AIzaSyCopZeusrsHfzQhZjErD6grLwhPrlAvc54",
  authDomain: "multiplayer-rps-fe0b9.firebaseapp.com",
  databaseURL: "https://multiplayer-rps-fe0b9.firebaseio.com",
  projectId: "multiplayer-rps-fe0b9",
  storageBucket: "",
  messagingSenderId: "352874551588"
};
firebase.initializeApp(config);
$("#reset").on("click", function () {
  setStart();
  scoreSet();
})
var player1 = false
var player2 = false
var playerOneTurnText = $("#player-1-turn");
var playerTwoTurnText = $("#player-2-turn");
var roundWinner = $("#results");
var p1Score
var p2Score
var turn2
var gameReady
var p1Text = $(".p1-score")
var p2Text = $(".p2-score")
p1Text.text(p1Score)
p2Text.text(p2Score)
var database = firebase.database();
var playerRef = database.ref("players")
var choicesRef = database.ref("choices")
var scoreRef = database.ref("score")
function scoreSet() {
  scoreRef.set({
    pOneScore: p1Score,
    pTwoScore: p2Score
  });
}
scoreRef.on('value', function (snapshot) {
  p1Text.text(snapshot.val().pOneScore)
  p2Text.text(snapshot.val().pTwoScore)
});
function restart() {
  p1Score = 0
  p2Score = 0
  gameReady = false
  turn2 = false
}
function setStart() {
  restart();
  playerRef.set({
    playerOne: null,
    playerOneId: null,
    playerTwo: null,
    playerTwoId: null,
    turnOne: true,
  });
}
function resetChoices() {
  choicesRef.set({
    playerOneChoice: null,
    playerTwoChoice: null
  })
}
var isPlayerOne
var isPlayerTwo
//connections stuff
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
connectedRef.on("value", function (snap) {
  if (snap.val()) {
    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
});
connectionsRef.on("value", function (snap) {
  $("#connected-viewers").text(snap.numChildren());
  if (snap.numChildren() < 2) {
    setStart()
  }
});

playerRef.on("value", function (snap) {
  // if player one not there
  if (!snap.val()) {
    isPlayerOne = false
    isPlayerTwo = false
  }
  if (snap.child("playerOne").exists()) {
    isPlayerOne = true
    if (isPlayerOne === true && isPlayerTwo === true) {
      gameReady = true
    }
  }
  if (snap.child("playerTwo").exists()) {
    isPlayerTwo = true
    if (isPlayerOne === true && isPlayerTwo === true) {
      gameReady = true
    }
  }
});

$("#add-user-btn").on("click", function (event) {
  event.preventDefault();

  if ($("#name-input").val().trim() === "") {
    return
  }

  var name = $("#name-input").val().trim();
  playerRef.once('value').then(function (snapshot) {

    if (!snapshot.child("playerOne").exists() && !snapshot.child("playerTwo").exists()) {
      player1 = true
      restart();
      playerRef.update({
        playerOne: name,
        playerOneId: true
      });
      // console.log(Object.keys(snapshot.child("/connections").val())[0])
      // console.log(snapshot.val())
    }
   
    else if (!snapshot.child("playerOne").exists() && snapshot.child("playerTwo").exists()) {
      player1 = true
      restart();
      playerRef.update({
        playerOne: name,
        playerOneId: true
      });
    }
    // if player one but no player two, set entered name as player two
    else if (snapshot.child("playerOne").exists() && !snapshot.child("playerTwo").exists()) {
      player2 = true
      restart();
      playerRef.update({
        playerTwo: name,
        playerTwoId: true
      });
    }
    // if player one and player two occupied and another user tries to join, alert game is full
    else {
      alert("game full!")
    }
  })
  $("#name-input").val("")
});
//get snapshot on any value change to check if player 1 or 2 exist to put them on screen as text
playerRef.on("value", function (childSnapshot) {
  // console.log(childSnapshot.val().playerOne);
  if (childSnapshot.child("playerOne").exists()) {
    var playerOneName = childSnapshot.val().playerOne;
    $("#player-1-name").text(playerOneName)
  }
  if (childSnapshot.child("playerTwo").exists()) {
    var playerTwoName = childSnapshot.val().playerTwo;
    $("#player-2-name").text(playerTwoName)
  }
  //changing turn variables
  if (childSnapshot.val().turnOne === true) {
    turn2 = false
    playerTwoTurnText.text("");
    playerOneTurnText.text("Your Turn");
  }
  if (childSnapshot.val().turnOne === false) {
    turn2 = true
    playerOneTurnText.text("");
    playerTwoTurnText.text("Your Turn");
  }
});
// and other changes to player choices
choicesRef.on("value", function (childSnapshot) {

  if (childSnapshot.child("playerOneChoice").exists() && childSnapshot.child("playerTwoChoice").exists()) {
    var p1choseRock = childSnapshot.child("playerOneChoice").val() === "rock"
    var p1choseScissors = childSnapshot.child("playerOneChoice").val() === "scissors"
    var p1chosePaper = childSnapshot.child("playerOneChoice").val() === "paper"
    var p2choseRock = childSnapshot.child("playerTwoChoice").val() === "rock"
    var p2choseScissors = childSnapshot.child("playerTwoChoice").val() === "scissors"
    var p2chosePaper = childSnapshot.child("playerTwoChoice").val() === "paper"
    if (p1choseRock && p2chosePaper) {
      p2Score++
      roundWinner.text("Player 2 wins!")
      scoreSet()
      resetChoices()
    }
    if (p1choseRock && p2choseScissors) {
      p1Score++
      roundWinner.text("Player 1 wins!")
      scoreSet()
      resetChoices()
    }
    if (p1choseRock && p2choseRock) {
      roundWinner.text("Tie!")
      resetChoices()
    }
    if (p1chosePaper && p2choseRock) {
      p1Score++
      roundWinner.text("Player 1 wins")
      scoreSet()
      resetChoices()
    }
    if (p1chosePaper && p2chosePaper) {
      roundWinner.text("Tie!")
      resetChoices()
    }
    if (p1chosePaper && p2choseScissors) {
      p2Score++
      roundWinner.text("Player 2 wins!")
      scoreSet()
      resetChoices()
    }
    if (p1choseScissors && p2choseScissors) {
      roundWinner.text("Tie!")
      resetChoices()
    }
    if (p1choseScissors && p2chosePaper) {
      p1Score++
      roundWinner.text("Player 1 Wins!")
      scoreSet()
      resetChoices()
    }
    if (p1choseScissors && p2choseRock) {
      p2Score++
      roundWinner.text("Player 2 wins!")
      scoreSet()
      resetChoices()
    }
  }
  else {
    return
  }
});
$(".image1").on("click", function () {

  if (!gameReady) {
    return
  }
  if (turn2) {
    return
  }
    // if not player 1
    // return
  else {

    if (this.id === "player-1-rock") {
      choicesRef.update({
        playerOneChoice: "rock"
      })
    }
    if (this.id === "player-1-paper") {
      choicesRef.update({
        playerOneChoice: "paper"
      })
    }
    if (this.id === "player-1-scissors") {
      choicesRef.update({
        playerOneChoice: "scissors"
      })
    }
    playerRef.update({
      turnOne: false
    })
  }
  $(".image2").hide()
})
$(".image2").on("click", function () {

  if (!gameReady) {
    return
  }
  if (!turn2) {
    return
  }
  // if not player 2
  // return

  else {
    playerRef.update({
      turnOne: true
    })

    if (this.id === "player-2-rock") {
      choicesRef.update({
        playerTwoChoice: "rock"
      })
    }
    if (this.id === "player-2-paper") {
      choicesRef.update({
        playerTwoChoice: "paper"
      })
    }
    if (this.id === "player-2-scissors") {
      choicesRef.update({
        playerTwoChoice: "scissors"
      })
    }
    playerRef.update({
      turnOne: true
    })
  }
  $(".image1").hide()
})
 // didn't use below error console:
 //show any errors in console
 // }, function(errorObject) {
 //  console.log("Errors handled: " + errorObject.code);
 // });