/*All these original declarations of the HTML are being done since it's being run
on a local machine. Ideally it would be done with a call on a server akin to:
function getText(file, variable)
{
    var txtDoc = new XMLHttpRequest();
    txtDoc.open("GET", 'html_snippets/'+file, false);
    variable = rawFile.responseText;
    txtDoc.send(null);
}
then just call it as:
getText('start.txt', $start);
getText('board.txt', $board);
getText('win.txt', $win);
but instead I'm doing it the lazier way below since I don't know if you'll be
testing this locally or in a server environment
I suppose you could also add each one as a .js file but I feel like that creates
too many files and defeats the purpose of a single modularized .js file
*/
!(function(){
var $start = '<div class="screen screen-start" id="start"> <header> <h1>Tic Tac Toe</h1>' /*<a href="#" class="button computer">Play Against Computer</a><br><br>*/+'<a href="#" class="button player">Play Against Player</a> </header> </div>';
var $win = '<div class="screen screen-win" id="finish"> <header> <h1>Tic Tac Toe</h1> <p class="message"></p> <a href="#" class="button">New game</a> </header></div>';
var $board = '<div class="board" id="board"> <header> <h1>Tic Tac Toe</h1> <ul>';
var againstPlayer; //whether or not it's agains player or AI
var activePlayer; //active player
var winner; //none for active game, one/two for player one/two, tie for a tie
var nameOne; //first players Name
var nameTwo; //second players Name
var moveCount;
var boardState = [[0,0,0],[0,0,0],[0,0,0]];
$board +='<li class="players player1"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-200.000000, -60.000000)" fill="#000000"><g transform="translate(200.000000, 60.000000)"><path d="M21 36.6L21 36.6C29.6 36.6 36.6 29.6 36.6 21 36.6 12.4 29.6 5.4 21 5.4 12.4 5.4 5.4 12.4 5.4 21 5.4 29.6 12.4 36.6 21 36.6L21 36.6ZM21 42L21 42C9.4 42 0 32.6 0 21 0 9.4 9.4 0 21 0 32.6 0 42 9.4 42 21 42 32.6 32.6 42 21 42L21 42Z"/></g></g></g></svg></li>'
$board +='<li class="players player2"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="43" viewBox="0 0 42 43" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-718.000000, -60.000000)" fill="#000000"><g transform="translate(739.500000, 81.500000) rotate(-45.000000) translate(-739.500000, -81.500000) translate(712.000000, 54.000000)"><path d="M30 30.1L30 52.5C30 53.6 29.1 54.5 28 54.5L25.5 54.5C24.4 54.5 23.5 53.6 23.5 52.5L23.5 30.1 2 30.1C0.9 30.1 0 29.2 0 28.1L0 25.6C0 24.5 0.9 23.6 2 23.6L23.5 23.6 23.5 2.1C23.5 1 24.4 0.1 25.5 0.1L28 0.1C29.1 0.1 30 1 30 2.1L30 23.6 52.4 23.6C53.5 23.6 54.4 24.5 54.4 25.6L54.4 28.1C54.4 29.2 53.5 30.1 52.4 30.1L30 30.1Z"/></g></g></g></svg></li>'
$board +='</ul> </header> <ul class="boxes"> <li class="box"></li> <li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li></ul></div>';

var toStart = function(){ //resets to the start page and adds event listeners
  $('document').ready(function(){ //ensures all portions reloaded
    $('body').html($start);
    $('.computer').on('click', function(){ //if computer clicked, will use AI for playing
      againstPlayer = false;
      initialize(); //starts board
      nameOne = prompt('Please enter Your Name:')
      nameTwo = 'SkyNet';
    });
    $('.player').on('click',function(){ //allows two human players
      initialize(); //starts board
      againstPlayer = true;
      nameOne = prompt('Please enter Player One\'s Name:')
      nameTwo = prompt('Please enter Player Two\'s Name:')
    });
    console.log('ready');
  });
};

function initialize(){
  $('document').ready(function(){
    $('body').html($board); //sets board up initially
    $('.box').on('click', placeMove); //addsEventlisteners to ensure click funcionality works
    $('.player1').addClass('active'); //in case of restart
    $('.player2').removeClass('active'); //in case of restart resets starting player
    activePlayer =1; //starts back with active player being 1
    boardState = [[0,0,0],[0,0,0],[0,0,0]]; //resets board
    winner = 0;
    moveCount = 0; //resets move count to 0 for checking for Tie
  });
}

  var placeMove = function(){ //allows placement of X or O
    //ensures you're not able to click an overwrite a play
    if (!$(this).hasClass('box-filled-1') && !$(this).hasClass('box-filled-2')){
      $('.players').toggleClass('active'); //switches active player
        $(this).addClass('box-filled-'+activePlayer);
        updateBoard($(this).index());//updates the board for both AI and win verification passes current index
        if(activePlayer === 1){activePlayer = 2;}
        else{activePlayer = 1;} //changes player
      }

      if(winner ===0){ //if no winner, change players and go again
        if(activePlayer ===2 && !againstPlayer){ //auto plays if against computer
          computerMove();
        }
      }
      else{ endGame();} // if a winner or tie, it ends the game
    };

  var computerMove = function(){
    console.log('this is the computer\'s move'); //still implementing
  };


  var updateBoard = function(item){ //updates a 2-D array version of the board
    console.log('The current index is'+item)
    index = Math.floor(item / 3); //gets first coordinate
    place = item - (index*3); //gets second coordinate
    boardState[index][place] = activePlayer //sets that point as a number equal to active player 1 or 2
    moveCount++; //adds another move for easy tie checking
    checkWinner();
  }


  var checkWinner = function() { //takes current board setup and checks for winner
    if(moveCount < 9){
      for(i=0; i<3; i++){ //checks for horizontal lines then vertical lines
          if(boardState[i][0] === boardState[i][1] && boardState[i][0] === boardState[i][2] && boardState[i][0] !== 0){
              winner = boardState[i][0];
          }
          if(boardState[0][i] === boardState[1][i] && boardState[0][i] === boardState[2][i] && boardState[0][i] !== 0){
              winner = boardState[0][i];
          }
      }
      if(boardState[0][0] === boardState[1][1] && boardState[0][0] === boardState[2][2] && boardState[0][i] !== 0){ //checks one diagonal
          winner = boardState[1][1];
      }
      if(boardState[0][2] === boardState[1][1] && boardState[2][0] === boardState[1][1] && boardState[0][i] !== 0){//checks one diagonal
          winner = boardState[1][1];
      }
    } else{ winner = 3;}

  };


  var endGame = function(){
    $('body').html($win); //loads win snippet
    $('document').ready(function(){
      //ensures loaded before adding event listeners and adjusting html
      //shoudln't be needed really but hey.
      var winningClass;
      if (winner ===1) {
        changeHTML($('.message'), nameOne); //verifies non-blank name and returns
        winningClass = 'screen-win-one';
      }
      else if(winner===2)
      {
        changeHTML($('.message'), nameTwo);
        winningClass = 'screen-win-two';
      }
      else {
        $('.message').html('It\'s a Tie!');
        winningClass ='screen-win-tie'
        }
      $('.button').on('click', toStart);
      $('.screen-win').addClass(winningClass);
    });
  };

  function changeHTML(toChange, toVerify){ //this ensures if they didn't input a name, it doesn't display blank
    if(toVerify){
      $(toChange).html(toVerify+' wins!');
    }
    else{$(toChange).html('Winner!');} //if blank name, just displays original Winner!


  };


toStart();
}())
