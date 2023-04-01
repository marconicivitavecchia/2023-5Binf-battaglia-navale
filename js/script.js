let ships = [];
let shipMaxHP = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
let isShipDestroyed = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let isMenuOpened = 1;
let userNickname = "";
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

function getRandom(max) {
  min = 0;
  // max = max;
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

function isTooClose(a, b) {
  return (Math.abs(a.row - b.row) <= 1) && (Math.abs(a.col - b.col) <= 1);
};

let createCellInDirection = function (prevCell, direction) {
  let newcell = {};
  switch (direction) {
    case 0:
      // move top
      newCell = { row: prevCell.row, col: prevCell.col - 1, hitted: false};
      break;
    case 1:
      // move right
      newCell = { row: prevCell.row + 1, col: prevCell.col, hitted: false};
      break;
    case 2:
      // move down
      newCell = { row: prevCell.row, col: prevCell.col + 1, hitted: false};
      break;
    case 3:
      // move left
      newCell = { row: prevCell.row - 1, col: prevCell.col, hitted: false};
      break;
  }

  return newCell;
};

let isShipInBoard = function (ship) {
  if (ship.length == 0) {
    return false;
  }
  for (x of ship) {
    if ((x.row < 0) || (x.row > 9) || (x.col < 0) || (x.col > 9)) {
      console.log("isShipInBoard: false");
      return false;
    }
  }

  return true;
};

let isShipPositionValid = function (ship) {
  for (let x of ship) {
    for (let s of ships) {
      for (let y of s) {
        if (isTooClose(x, y)) {
          return false;
        }
      }
    }
  }
  return true;
};
let generateTentativeShip = function(n, shipNumber) {
  let ship = [];
  // genero casualmente la prima cella, ha un attributo hitted riconoscerà se la cella è stata colpita e porta con sé il numero identificatore
  ship[0] = { row: getRandom(9), col: getRandom(9), hitted: false, shipNumber: shipNumber};
  // scelgo una direzione a caso
  let direction = getRandom(4);
  // avanzo in quella direzione
  for (let i = 1; i < n; i++) {
    ship[i] = createCellInDirection(ship[i - 1], direction);
  }
  return ship;
};

let generateShip = function (n, shipNumber) {
  // genero le coordinate di una nave di lunghezza n e le ritorno
  console.log(`generateShip: ${n}`);
  let ship = [];
  const max_iterations = 2000;
  let watchdog = max_iterations; // avoid infinite loops

  // genero navi casualmente finché non è valida
  while ((!isShipInBoard(ship) || !isShipPositionValid(ship)) && watchdog > 0) {
    console.log(`generate... ${watchdog}`);
    ship = generateTentativeShip(n, shipNumber);
    watchdog -= 1;
  }

  if (watchdog == 0) {
    alert(`DEV: something went wrong, too many iterations! More than ${max_iterations}`)
  }

  return ship;
};

let generateShips = function () {

  console.log("generateShips");
  
  // ships[0] = generateShip(4, 0);

  // ships[1] = generateShip(3, 1);
  // ships[2] = generateShip(3, 2);
 
  // ships[3] = generateShip(2, 3);
  // ships[4] = generateShip(2, 4);
  // ships[5] = generateShip(2, 5);

  // ships[6] = generateShip(1, 6);
  // ships[7] = generateShip(1, 7);
  // ships[8] = generateShip(1, 8);
  // ships[9] = generateShip(1, 9);
  
  for (let ship of ships) {
    for (let x of ship) {
      x.hitted = false;
      x.shipNumber = ship[0].shipNumber; //se non lo faccio calcolerà solo la prima casella come nave
    }
  }

};

let log = function (row, col) {
  $( "#history" ).append("["+letters[col]+"] - ["+(row+1)+"]<br>");
};

let reset = function () {
  $(".grid-item").removeClass("missed");
  $(".grid-item").removeClass("hit");
  $(".grid-item").removeClass("my-ship");
  $(".grid-item").removeClass("destroy");
  for (let ship of ships) {
    for (let x of ship) {
      isShipDestroyed[x.shipNumber] = 0;
    }
  }

  $( "#history" ).html("");

  init();
};

let playMyBoard = function () {
  
};

let destroyShip = function (shipNumber) {
  for (let ship of ships) {
    for (let x of ship) {
      if (x.shipNumber == shipNumber) {
        $(`#opponent-board>.grid-item[data-row=${x.row}][data-col=${x.col}]`).removeClass("hit").addClass("destroy");
      }
    }
  }
};

let playOpponentBoard = function () {
  $(this).addClass("missed");
  let row = $(this).data("row");
  let col = $(this).data("col");
  
  for (let ship of ships) {
    for (let x of ship) {
      if (x.row == row && x.col == col) {
        $(`#opponent-board>.grid-item[data-row=${x.row}][data-col=${x.col}]`).removeClass("missed").addClass("hit");
        x.hitted = true;
      }
    }
  }
  
  for (let ship of ships) {
    for (let x of ship) {
      if (x.hitted == true) {
        isShipDestroyed[x.shipNumber] += 1;
        if(isShipDestroyed[x.shipNumber] > shipMaxHP[x.shipNumber]){
          isShipDestroyed[x.shipNumber] --;
        }
        if(isShipDestroyed[x.shipNumber] == shipMaxHP[x.shipNumber]){
          destroyShip(x.shipNumber);
        }
        // console.log("la nave:"+x.shipNumber+" è stata colpita, ottieni "+isShipDestroyed[x.shipNumber]);
      } else {
        isShipDestroyed[x.shipNumber] = 0;
      }
    }
  }
};

//Funzione che apre il menu
let openMenu = function(){
  isMenuOpened ++;
  if(isMenuOpened == 1){
    $(`.bar1`).addClass("changeBar1");
    $(`.bar2`).addClass("changeBar2");
    $(`.bar3`).addClass("changeBar3");

    $(`.lateralNavs`).removeClass("changeLateralNavs");
    $(`.lateralNavs`).addClass("changeLateralNavsReverse");

    $(`.lateralNavSX`).removeClass("changeLateralNavSX");
    $(`.lateralNavSX`).addClass("changeLateralNavSXReverse");

    $(`.lateralNavDX`).removeClass("changeLateralNavDX");
    $(`.lateralNavDX`).addClass("changeLateralNavDXReverse");

    $(`#allyPlane`).removeClass("bluePlane");
    $(`#opponentPlane`).removeClass("redPlane");

    $(`.grid-container`).css("z-index", "-3");
    $(`.grid-container`).css("-webkit-animation-name", "grid-containerDown");
    $(`.grid-container`).css("-webkit-animation-iteration-count", "1");
    $(`.grid-container`).css("-webkit-animation-duration", "0.4s");
    $(`.grid-container`).css("-webkit-animation-fill-mode:", "forwards");

    $(`#reset`).css("z-index", "-3");

    console.log("Aperto");
  }else{
    $(`.bar1`).removeClass("changeBar1");
    $(`.bar2`).removeClass("changeBar2");
    $(`.bar3`).removeClass("changeBar3");

    $(`.lateralNavs`).addClass("changeLateralNavs");
    $(`.lateralNavs`).removeClass("changeLateralNavsReverse");

    $(`.lateralNavSX`).addClass("changeLateralNavSX");
    $(`.lateralNavSX`).removeClass("changeLateralNavSXReverse");

    $(`.lateralNavDX`).addClass("changeLateralNavDX");
    $(`.lateralNavDX`).removeClass("changeLateralNavDXReverse");

    $(`.lateralNavDX`).addClass("changeLateralNavDX");
    $(`.lateralNavDX`).removeClass("changeLateralNavDXReverse");

    $(`#allyPlane`).addClass("bluePlane");
    $(`#opponentPlane`).addClass("redPlane");

    $(`.grid-container`).css("z-index", "3");
    $(`.grid-container`).css("-webkit-animation-name", "grid-containerUp");
    $(`.grid-container`).css("-webkit-animation-iteration-count", "1");
    $(`.grid-container`).css("-webkit-animation-duration", "2s");
    $(`.grid-container`).css("-webkit-animation-fill-mode:", "forwards");

    $(`#reset`).css("z-index", "0");

    console.log("Chiuso");

    isMenuOpened = 0;
  };
  console.log(isMenuOpened);
};


//Timer
function startTimer(duration, display) {
  var timer = duration, minutes, seconds;
  setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes; //se i minuti sono minori di 10 allora fai 09
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (minutes == 0 && seconds < 10){
        $(`.timer-container`).css("-webkit-animation-name", "expiring-timer");
        $(`#time`).css("-webkit-animation-name", "expiring-time-text");
      }

      if (--timer < 0) {
          timer = 0;
          $(`.timer-container`).css("-webkit-animation-name", "expired-timer");
          $(`#time`).css("-webkit-animation-name", "expired-time-text");
      }
  }, 1000);
}

let play = function(){
  $(`#firstMenuTextSX`).css("opacity", "0.4");
  $(`#friend-list`).css("opacity", "1");
  $(`#shop`).css("opacity", "1");
  $(`#scoreboard`).css("opacity", "1");
  $(`#options`).css("opacity", "1");

  $(`.playOption`).css("-webkit-animation-name", "playOptionIN");
}

let confirmName = function(){
  var fiveMinutes = 60 * 1,
  display = document.querySelector('#time');
  startTimer(fiveMinutes, display);

  openMenu();
  $(`.playOption`).css("-webkit-animation-name", "playOptionOUT");

  checkBox = document.getElementById("rememberCheck");
  if(checkBox.checked){
    userNickname = $('input:text'). val();
    console.log("nickname saved");
  }

  if($('input:text'). val()!=""){
    $(`.my-nickname`).html($('input:text'). val());
  }else{
    $(`.my-nickname`).html("Ospite");
    console.log($('input:text'). val());
  }
  
}

let loadShips = function(dataJson) {
  ships = dataJson;
  console.log("ships loaded");

  for (let ship of ships) {
    for (let x of ship) {
      // add class my-ship to my ships in my board
      $(`#my-board > .grid-item[data-row=${x.row}][data-col=${x.col}]`).addClass("my-ship");
    }
  }

  console.log(JSON.stringify(ships));
}

let onError = function(e) {
  console.error(e);
}

let init = function () {

  $.get("data.json").done(loadShips).fail(onError);
  
  $("#my-board>.grid-item").on("click", playMyBoard);
  $("#opponent-board>.grid-item").on("click", playOpponentBoard);

  
};
//
$(document).ready(init);
