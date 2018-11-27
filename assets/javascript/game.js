var config = {
  apiKey: "AIzaSyCopZeusrsHfzQhZjErD6grLwhPrlAvc54",
  authDomain: "multiplayer-rps-fe0b9.firebaseapp.com",
  databaseURL: "https://multiplayer-rps-fe0b9.firebaseio.com",
  projectId: "multiplayer-rps-fe0b9",
  storageBucket: "",
  messagingSenderId: "352874551588"
};
firebase.initializeApp(config);

var database = firebase.database();

var playerOneLink = document.getElementById("player-1-name")

$("#add-user-btn").on("click", function (event) {
  event.preventDefault();

  name = $("#name-input").val().trim();
  database.ref().set({
    playerOne: name
  });

  database.ref().on("child_added", function (childSnapshot) {
    
    console.log(childSnapshot.val());
  
    var playerOneName = childSnapshot.val();
    $("#player-1-name").text(playerOneName)
  });

  if (playerOneLink.textContent.includes("a")){
    database.ref().set({
      playerTwo: name
    });
    database.ref().on("child_added", function (childSnapshot) {
    
      console.log(childSnapshot.val());
    
      var playerTwoName = childSnapshot.val();
      $("#player-2-name").text(playerTwoName)
    });
  }
});

var playerOneTurnText = $("#player-1-turn");
var playerTwoTurnText = $("#player-2-turn");
var roundWinner = $("results");

function restart() {
  playerOneTurnText.text("Your Turn")
}

restart()

$(document).on("click", ".image", function () {
  console.log(this)
  if (this.id === "player-1-rock") {
    console.log("player 1 chose rock")
    playerOneTurnText.text("");
    playerTwoTurnText.text("Your Turn");
  }
  if (this.id === "player-1-paper") {
    console.log("player 1 chose paper")
  }
  if (this.id === "player-1-scissors") {
    console.log("player 1 chose scissors")
  }
  if (this.id === "player-2-rock") {
    console.log("player 2 chose rock")
  }
  if (this.id === "player-2-paper") {
    console.log("player 2 chose paper")
  }
  if (this.id === "player-2-scissors") {
    console.log("player 2 chose scissors")
  }
})

//show any errors in console
// }, function(errorObject) {
//   console.log("Errors handled: " + errorObject.code);
// });

