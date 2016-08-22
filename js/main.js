/*All these original declarations of the HTML are being done since it's being run
on a local machine. Ideally it would be done with a call on a server akin to:
function getText(file, variable)
{
    var txtDoc = new XMLHttpRequest();
    txtDoc.open("GET", 'html_snippets/'+file, false);
    variable = rawFile.responseText;
    txtDoc.send();
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
  var $start = '<div class="screen screen-start" id="start"><header><h1>Tic Tac Toe</h1><div class="againstWhom"><a href="#" class="button computer">Play Against Computer</a><br><br><a href="#" class="button player">Play Against Player</a></div>';
  $start +=  '<div id="nameOne"><label for="playOne" class="play1 playInput">Player One\'s Name:</label><input type="text" name="playOne" id="playOne" class="playInput"></div>';
  $start +=  '<div id="nameTwo"><label for="playTwo" class="play2  playInput">Player Two\'s Name:</label><input type="text" name="playTwo" id="playTwo" class="playInput"></div><div class="startName"><a href="#" class="button startName">Start</a></div></header></div>';
var $win = '<div class="screen screen-win" id="finish"> <header> <h1>Tic Tac Toe</h1> <p class="message"></p> <a href="#" class="button">New game</a> </header></div>';
var $board = '<div class="board" id="board"> <header> <h1>Tic Tac Toe</h1> <ul>';
$board +='<li class="players player1"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-200.000000, -60.000000)" fill="#000000"><g transform="translate(200.000000, 60.000000)"><path d="M21 36.6L21 36.6C29.6 36.6 36.6 29.6 36.6 21 36.6 12.4 29.6 5.4 21 5.4 12.4 5.4 5.4 12.4 5.4 21 5.4 29.6 12.4 36.6 21 36.6L21 36.6ZM21 42L21 42C9.4 42 0 32.6 0 21 0 9.4 9.4 0 21 0 32.6 0 42 9.4 42 21 42 32.6 32.6 42 21 42L21 42Z"/></g></g></g></svg><span id="O"></span></li>';
$board +='<li class="players player2"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="43" viewBox="0 0 42 43" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-718.000000, -60.000000)" fill="#000000"><g transform="translate(739.500000, 81.500000) rotate(-45.000000) translate(-739.500000, -81.500000) translate(712.000000, 54.000000)"><path d="M30 30.1L30 52.5C30 53.6 29.1 54.5 28 54.5L25.5 54.5C24.4 54.5 23.5 53.6 23.5 52.5L23.5 30.1 2 30.1C0.9 30.1 0 29.2 0 28.1L0 25.6C0 24.5 0.9 23.6 2 23.6L23.5 23.6 23.5 2.1C23.5 1 24.4 0.1 25.5 0.1L28 0.1C29.1 0.1 30 1 30 2.1L30 23.6 52.4 23.6C53.5 23.6 54.4 24.5 54.4 25.6L54.4 28.1C54.4 29.2 53.5 30.1 52.4 30.1L30 30.1Z"/></g></g></g></svg><span id="X"></span></li>';
$board +='</ul> </header> <ul class="boxes"> <li class="box"></li> <li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li></ul></div>';
var againstPlayer; //whether or not it's against player or AI
var activePlayer; //active player
var nameOne; //first players Name
var nameTwo; //second players Name
var currentBoard;
var availMoves;

var toStart = function(){ //resets to the start page and adds event listeners
  $('document').ready(function(){ //ensures all portions reloaded
    $('body').html($start);

    $('.computer').on('click', function(){ //if computer clicked, will use AI for playing
      againstPlayer = false;
      $('.againstWhom').slideToggle('slow', function(){ //slides out buttons for selecting whom to play against
        $('#nameOne').show('slow'); //slides in just field for name 1
        $('.startName').show('slow'); //slides it start button
        $('#playTwo').val('SkyNet'); //sets hidden text box to be name SkyNet... always watching....
      });
    });
    $('.player').on('click', function(){ //if computer clicked, will use AI for playing
      againstPlayer = true; //against player not AI
      $('.againstWhom').slideToggle('slow', function(){
        $('#nameOne').show('slow'); //slides in both player one and player two names
        $('#nameTwo').show('slow');
        $('.startName').show('slow'); //slides in start button
        });
    });

    $('.startName').on('click',function(){ //allows two human players
      initialize(); //starts board
    });
  });
};

var initialize = function(){
  nameOne = $('#playOne').val(); //saves player 1 and 2s names
  nameTwo = $('#playTwo').val();
  $('body').html($board); //sets board up initially
  $('document').ready(function(){
  $('#O').html(nameOne); //shows players names 1 and two
  $('#X').html(nameTwo);
    $('.box').on('click', placeMove); //addsEventlisteners to ensure click funcionality works
    $('.player1').addClass('active'); //in case of restart
    $('.player2').removeClass('active'); //in case of restart resets starting player
    activePlayer = 1; //starts back with active player being 1
    currentBoard = [0,0,0,0,0,0,0,0,0]; //resets board
    availMoves = [0,1,2,3,4,5,6,7,8]; //resets to blank board state
    $('.box').on('mouseenter', highlightXO);
    $('.box').on('mouseleave', removeXO);
  });
}
  var highlightXO = function(){ // highlights X or O depending on active player
    if(!$(this).hasClass('box-filled-1') && !$(this).hasClass('box-filled-2')){
        activePlayer ==1 ? $(this).css("background-image", 'url(img/o.svg)'): $(this).css("background-image", 'url(img/x.svg)');
    }
  };
  var removeXO = function(){ //removes background image after mouse leave
    if(!$(this).hasClass('box-filled-1') && !$(this).hasClass('box-filled-2')){
        $(this).css("background", '');
    }
  };

  var placeMove = function(){ //allows placement of X or O
    //ensures you're not able to click an overwrite a play
    if (!$(this).hasClass('box-filled-1') && !$(this).hasClass('box-filled-2')){
      $('.players').toggleClass('active'); //switches active player
        $(this).addClass('box-filled-'+activePlayer);
        updateBoard($(this).index());//updates the board for both AI and win verification passes current index
        activePlayer === 1 ? activePlayer = 2 : activePlayer = 1;
        //I was told the ternary operator could sometimes cause issues and to just be careful with them
        // it causes an error message (incorrectly) in JSHint so I have left them in, but could you expand
        //upon what issues they might cause as I find the syntax to be visually appealing and so I prefer them
        // also it cuts down lines of code but less code doesn't always mean better coding so I was curious if I
        //should stop using them or just not use them in specific cases.

      }
      if(activePlayer ===2 && !againstPlayer && checkWinner()===0){ //auto plays if against computer
          computerMove();
        }
      if (checkWinner() !== 0){ //if winner is 1 (player 1), 2(player 2), or 3(tie) ends game
        endGame(checkWinner()); //ends game with winner value
      }

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
    var checkLine = function(a, b, c) {
      var lineScore = 0;

     if (currentBoard[a] == 2) { //starting with first in line
        lineScore = 1; //if it contains an X, plus a point
     } else if (currentBoard[a] == 1) {
        lineScore = -1; //if it contains an O, minus one point
     }


     if (currentBoard[b] == 2) { //assuming second was X
        if (lineScore == 1) { //if both points a and b were X, this is a good line, goto 10
           lineScore = 10;
        } else if (lineScore == -1) { // if first in line was X and second O, cancel each other out
           return 0; //line will be a wash as there can be no win for either on this line
        } else {
           lineScore = 1; // if first was empty and this was X score to 1 as a win is possible
        }
     } else if (currentBoard[b] == 1) { //if b was O
       //if a and b were O, this is a bad line, set score to -15 this gives a block more weight
       //and allows for only a single passthrough as opposed to going down multiple branches
        if (lineScore == -1) {
           lineScore = -15;
        } else if (lineScore == 1) { //if a was X and b was 0 return zero, no win possible on this line
           return 0;
        } else { //if a empty and b O, set to -1 starting off bad for this line
           lineScore = -1;
        }
     }

     if (currentBoard[c] == 2) { //assuming c is X
       //if there's one X it goes to 10 (better play) or if 2X's already it goes to 100 with the 3rd X here
        if (lineScore > 0) {
           lineScore *= 10;
        } else if (lineScore < 0) { //if -10 for 2 O's or -1 for 1 O with this X the line is dead, return 0
           return 0;
        } else { //if no points so far, it means blank, blank, X so return 1. This might be a good line
           lineScore = 1;
        }
     } else if (currentBoard[c] == 1) { //assuming x is 0
       //if it's a bad line already, it moves from -1 -> -10 or -10 -> -100 (although not possible techincally as the game would have ended)
        if (lineScore < 0) {
           lineScore *= 10;
        } else if (lineScore > 1) { //if it's a positive line (1 for 1 X or 10 for 2 X's)
           return 0; //return zero as this is a dead line. No points for either side.
        } else {
           lineScore = -1; //if others were blank, this becomes a line with only 1 O
        }
     }
     return lineScore; //if it wasn't already, return the score for this line
  };
    var evaluateTotalScore = function(){ //goes through line by line to get sum of score
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

  var computerMove = function(){
    var highestScore = -10000; //used to compare potential best moves
    var index; //to save index for later use

    for(var i=0; i<availMoves.length; i++){
      currentBoard[availMoves[i]] = 2; //makes a move for outcome testing
      var score = evaluateTotalScore();
      //compares potential play to base score of -10000 this is on the offchance all
      //moves are bad. It will then pick the least bad of the bunch
      if(score > highestScore){
        highestScore = score; //if higher, this becomes the best play
        index = i; //saves index to click box after all passes
      }
      currentBoard[availMoves[i]] = 0; //resets the move to test a different one
    }
     $('.boxes').children()[availMoves[index]].click(); //clicks the box that resulted in highest line scores


};



  var updateBoard = function(item){ //updates the board
    currentBoard[item] = activePlayer; // sets played spot to 1 or 2 based off player
    var index = availMoves.indexOf(item); // finds the play just made
    // unneeded really but still good practice as it's usually needed for an index splice
    if(index>-1){
      availMoves.splice(index, 1); //removes the one just played form possible moves
    }
  };


  var checkWinner = function() { //takes current board setup and checks for winner
      for(var i=0; i<9; i+=3){ //checks for horizontal lines
          if(currentBoard[i] === currentBoard[i+1] && currentBoard[i] === currentBoard[i+2] && currentBoard[i] !== 0){
              return(currentBoard[i]);
          }
        }
        for(var j=0; j<3; j++){ //checks for horizontal lines
            if(currentBoard[i] === currentBoard[i+3] && currentBoard[i] === currentBoard[i+6] && currentBoard[i] !== 0){
                return(currentBoard[i]); //return either 1 or 2 (for player that matched)
            }
          }
      if(currentBoard[0] === currentBoard[4] && currentBoard[0] === currentBoard[8] && currentBoard[4] !== 0){ //checks one diagonal
          return(currentBoard[4]); //return either 1 or 2 (for player that matched)
      }
      if(currentBoard[2] === currentBoard[4] && currentBoard[2] === currentBoard[6] && currentBoard[4] !== 0){//checks one diagonal
          return(currentBoard[4]); //return either 1 or 2 (for player that matched)
      }
      if (!availMoves.length){ return 3;} //if no moves left and there's no winner,  it's a tie
    return 0;
  };


  var endGame = function(winner){
    $('body').html($win); //loads win snippet
    $('document').ready(function(){
      //ensures loaded before adding event listeners and adjusting html
      //shoudln't be needed really but hey.
      if (winner ===1) { //assuming first player won
        // if a valid name was entered, display name with wins! otherwise display Winner!
        nameOne ? $('.message').html(nameOne+' wins!'): $('.message').html('Winner!');
        $('.screen-win').addClass('screen-win-one'); //change to display winning page
      }
      else if(winner===2) //same as above for winner ===1
      {
        nameTwo ? $('.message').html(nameTwo+' wins!'): $('.message').html('Winner!');
        $('.screen-win').addClass('screen-win-two');
      }
      else if(winner===3) { // in case of a tie, display such and tie screen
        $('.message').html('It\'s a Tie!');
        $('.screen-win').addClass('screen-win-tie');
        }
      $('.button').on('click', toStart); // new start button!
    });
  };

toStart(); //start it up!
}());
