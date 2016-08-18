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
var $start = '<div class="screen screen-start" id="start"> <header> <h1>Tic Tac Toe</h1><a href="#" class="button computer">Play Against Computer</a><br><br><a href="#" class="button player">Play Against Player</a> </header> </div>';
var $win = '<div class="screen screen-win" id="finish"> <header> <h1>Tic Tac Toe</h1> <p class="message"></p> <a href="#" class="button">New game</a> </header></div>';
var $board = '<div class="board" id="board"> <header> <h1>Tic Tac Toe</h1> <ul>';
$board +='<li class="players player1"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-200.000000, -60.000000)" fill="#000000"><g transform="translate(200.000000, 60.000000)"><path d="M21 36.6L21 36.6C29.6 36.6 36.6 29.6 36.6 21 36.6 12.4 29.6 5.4 21 5.4 12.4 5.4 5.4 12.4 5.4 21 5.4 29.6 12.4 36.6 21 36.6L21 36.6ZM21 42L21 42C9.4 42 0 32.6 0 21 0 9.4 9.4 0 21 0 32.6 0 42 9.4 42 21 42 32.6 32.6 42 21 42L21 42Z"/></g></g></g></svg></li>';
$board +='<li class="players player2"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="43" viewBox="0 0 42 43" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-718.000000, -60.000000)" fill="#000000"><g transform="translate(739.500000, 81.500000) rotate(-45.000000) translate(-739.500000, -81.500000) translate(712.000000, 54.000000)"><path d="M30 30.1L30 52.5C30 53.6 29.1 54.5 28 54.5L25.5 54.5C24.4 54.5 23.5 53.6 23.5 52.5L23.5 30.1 2 30.1C0.9 30.1 0 29.2 0 28.1L0 25.6C0 24.5 0.9 23.6 2 23.6L23.5 23.6 23.5 2.1C23.5 1 24.4 0.1 25.5 0.1L28 0.1C29.1 0.1 30 1 30 2.1L30 23.6 52.4 23.6C53.5 23.6 54.4 24.5 54.4 25.6L54.4 28.1C54.4 29.2 53.5 30.1 52.4 30.1L30 30.1Z"/></g></g></g></svg></li>';
$board +='</ul> </header> <ul class="boxes"> <li class="box"></li> <li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li></ul></div>';
var againstPlayer; //whether or not it's against player or AI
var activePlayer; //active player
var nameOne; //first players Name
var nameTwo; //second players Name
var moveCount;
var boardState;
var availMoves;

var toStart = function(){ //resets to the start page and adds event listeners
  $('document').ready(function(){ //ensures all portions reloaded
    $('body').html($start);

    $('.computer').on('click', function(){ //if computer clicked, will use AI for playing
      againstPlayer = false;
      initialize(); //starts board
      nameOne = prompt('Please enter Your Name:');
      nameTwo = 'SkyNet';
    });

    $('.player').on('click',function(){ //allows two human players
      initialize(); //starts board
      againstPlayer = true;
      nameOne = prompt('Please enter Player One\'s Name:');
      nameTwo = prompt('Please enter Player Two\'s Name:');
    });
  });
};

function initialize(){
  $('document').ready(function(){
    $('body').html($board); //sets board up initially
    $('.box').on('click', placeMove); //addsEventlisteners to ensure click funcionality works
    $('.player1').addClass('active'); //in case of restart
    $('.player2').removeClass('active'); //in case of restart resets starting player
    activePlayer = 1; //starts back with active player being 1
    boardState = [0,0,0,0,0,0,0,0,0]; //resets board
    availMoves = [0,1,2,3,4,5,6,7,8];
    moveCount = 0; //resets move count to 0 for checking for Tie
  });
}

  var placeMove = function(){ //allows placement of X or O
    //ensures you're not able to click an overwrite a play
    if (!$(this).hasClass('box-filled-1') && !$(this).hasClass('box-filled-2')){
      $('.players').toggleClass('active'); //switches active player
        $(this).addClass('box-filled-'+activePlayer);
        updateBoard($(this).index());//updates the board for both AI and win verification passes current index
        activePlayer === 1 ? activePlayer = 2 : activePlayer = 1;

      }
      if(activePlayer ===2 && !againstPlayer && checkWinner()===0){ //auto plays if against computer
          minMax = [];
          computerMove();

        }
      if (checkWinner() !== 0){
        endGame(checkWinner());
      }

    };

  var computerMove = function(){
    var highestScore = -10000; //used to compare potential best moves
    var index; //to save index for later use

    for(var i=0; i<availMoves.length; i++){
      boardState[availMoves[i]] = 2; //makes a move for outcome testing
      var score = evaluateTotalScore();
      //compares potential play to base score of -10000 this is on the offchance all
      //moves are bad. It will then pick the least bad of the bunch
      if(score > highestScore){
        highestScore = score; //if higher, this becomes the best play
        index = i; //saves index to click box after all passes
      }
      boardState[availMoves[i]] = 0; //resets the move to test a different one
    }
     $('.boxes').children()[availMoves[index]].click(); //clicks the box that resulted in highest line scores

    function evaluateTotalScore(){ //goes through line by line to get sum of score
      var score = 0;
      score += checkLine(0,1,2); //checks horizontal line
      score += checkLine(3,4,5); //checks horizontal line
      score += checkLine(6,7,8); //checks horizontal line
      score += checkLine(0,3,6); //checks vertical line
      score += checkLine(1,4,7); //checks vertical line
      score += checkLine(2,5,8); //checks vertical line
      score += checkLine(0,4,8); //checks diagonal line
      score += checkLine(2,4,6); //checks diagonal line
      return score; //returns score for comparison
    };

    /*This function goes through the three cells input from above
    and uses min max to see if one line is better than another to
    play on. Basically points for a line will scale up the more
    2's you have (X's for computer) and scale down for more 1s (O's for player)
    the whole line is then returned and added to the score above. The concept
    is that if an opponent has a line with two and you don't block, the score
    will be very negative and thus a bad move. If you have two in a row and don't
    finish it with the third, it will be positive but not as much as if you finished
    the line. I have yet to be able to beat it so that's a plus for the minMax
    and a huge minus for fun....
    */
    function checkLine(a, b, c) {
      var lineScore = 0;

     if (boardState[a] == 2) {
        lineScore = 1;
     } else if (boardState[a] == 1) {
        lineScore = -1;
     }


     if (boardState[b] == 2) {
        if (lineScore == 1) {
           lineScore = 10;
        } else if (lineScore == -1) {
           return 0;
        } else {
           lineScore = 1;
        }
     } else if (boardState[b] == 1) {
        if (lineScore == -1) {
           lineScore = -10;
        } else if (lineScore == 1) {
           return 0;
        } else {
           lineScore = -1;
        }
     }

     if (boardState[c] == 2) {
        if (lineScore > 0) {
           lineScore *= 10;
        } else if (lineScore < 0) {
           return 0;
        } else {
           lineScore = 1;
        }
     } else if (boardState[c] == 1) {
        if (lineScore < 0) {
           lineScore *= 10;
        } else if (lineScore > 1) {
           return 0;
        } else {
           lineScore = -1;
        }
     }
     return lineScore;
  }

  };
  var updateBoard = function(item){ //updates the board
    boardState[item] = activePlayer;
    index = availMoves.indexOf(item);
    if(index>-1){
      availMoves.splice(index, 1);
    }
    moveCount++;
  };


  var checkWinner = function() { //takes current board setup and checks for winner
      for(i=0; i<9; i+=3){ //checks for horizontal lines
          if(boardState[i] === boardState[i+1] && boardState[i] === boardState[i+2] && boardState[i] !== 0){
              return(boardState[i]);
          }
        }
        for(i=0; i<3; i++){ //checks for horizontal lines
            if(boardState[i] === boardState[i+3] && boardState[i] === boardState[i+6] && boardState[i] !== 0){
                return(boardState[i]);
            }
          }
      if(boardState[0] === boardState[4] && boardState[0] === boardState[8] && boardState[4] !== 0){ //checks one diagonal
          return(boardState[4]);
      }
      if(boardState[2] === boardState[4] && boardState[2] === boardState[6] && boardState[4] !== 0){//checks one diagonal
          return(boardState[4]);
      }
      if (moveCount === 9){ return 3;}
    return 0;
  };


  var endGame = function(winner){
    $('body').html($win); //loads win snippet
    $('document').ready(function(){
      //ensures loaded before adding event listeners and adjusting html
      //shoudln't be needed really but hey.
      if (winner ===1) {
        nameOne ? $('.message').html(nameOne+' wins!'): $('.message').html('Winner!');
        $('.screen-win').addClass('screen-win-one');
      }
      else if(winner===2)
      {
        nameTwo ? $('.message').html(nameTwo+' wins!'): $('.message').html('Winner!');
        $('.screen-win').addClass('screen-win-two');
      }
      else if(winner===3) {
        $('.message').html('It\'s a Tie!');
        $('.screen-win').addClass('screen-win-tie');
        }
      $('.button').on('click', toStart);
    });
  };

toStart();
}());
