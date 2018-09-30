let score = 0;
let color = "blue";
let initialInput = document.querySelector('#initials');
let submitButton = document.querySelector('#submit');
let ScoreBoard = document.querySelector('#scoreBoard');
let database;

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function setBG() {
  if (Math.round(Math.random())) {
    return "./img/object.png";
  } else {
    return "./img/bomb.png";
  }
}

function dropBox() {
  var length = random(100, ($(".game").width() - 100));
  var velocity = random(850, 10000);
  var size = random(50, 150);
  var thisBox = $("<div/>", {
    class: "box",
    style: "width:" + size + "px; height:" + size + "px; left:" + length + "px; transition: transform " + velocity + "ms linear;"
  });

  //set data and bg based on data
  thisBox.data("test", Math.round(Math.random()));
  if (thisBox.data("test")) {
    thisBox.css({ "background": "url('./img/object.png')", "background-size": "contain" });
  } else {
    thisBox.css({ "background": "url('./img/bomb.png')", "background-size": "contain" });
  }

  //insert gift element
  $(".game").append(thisBox);

  //random start for animation
  setTimeout(function () {
    thisBox.addClass("move");
  }, random(0, 5000));

  //remove this object when animation is over
  thisBox.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
    function (event) {
      $(this).remove();
    });
}

for (i = 0; i < 10; i++) {
  dropBox();
}

database = firebase.database();

var ref = database.ref('scores');
ref.on('value', gotData, errData);


function gotData(data) {

  // let scoreLists = document.createElement('.scoreList');
  // for (let i =0; i< scoreLists.length; i++){
  //   scoreLists[i].remove();
  // }

  console.log(data.val());

  const scores = data.val();
  const keys = Object.keys(scores);
   console.log(keys);
   for (let i =0; i< keys.length; i++){
       let k = keys[i];
       let initials = scores[k].initials;
       let score = scores[k].score;
       console.log(initials, score);
      //  ScoreBoard.classList.add('scoreList');
       ScoreBoard.innerHTML += `
          <li>${initials + ': ' + score}</li>
        `
   }
}

function errData(err) {
  console.log('There is an error!!!');
  console.log(err);
}


function submitScore() {
  var data = {
    initials: initialInput.value,
    score: score
  }
  // console.log(data); 
  ref.push(data);
}

//Event listener for score
$(document).on('click', '.box', function () {

  if ($(this).data("test")) {
    score += 3;
  } else {
    score -= 1;
  }

  $(".score").html(score);
  $(this).remove();
});

//Event listener for submit
$(document).on('click', '#submit', function () {

  submitScore();
  // console.log(submitScore);
});

var runGame = setInterval(function () {
  for (i = 0; i < 10; i++) {
    dropBox();
  }
}, 5000);

function countdown() {
  var seconds = 20;
  function tick() {
    var counter = document.getElementById("counter");
    seconds--;
    counter.innerHTML = (seconds < 10 ? "0" : "") + String(seconds) + "S";
    if (seconds > 0) {
      setTimeout(tick, 1000);
    } else {
      alert("Game over");
      clearInterval(runGame);
    }
  }
  tick();
}
countdown();