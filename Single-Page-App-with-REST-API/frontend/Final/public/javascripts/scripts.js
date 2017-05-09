//  ---------------------------------------------------------------------------------
//  Copyright (c) Microsoft Corporation.  All rights reserved.
// 
//  The MIT License (MIT)
// 
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
// 
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
// 
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//  ---------------------------------------------------------------------------------
var gameBoardSize = 0;
var cardsFlipped = 0;

var selectedCards = [];
var selectedCardsValues = [];

function newGame() {
    // reset the game
    gameBoardSize = 0;
    cardsFlipped = 0;

    // extract game size selection from user
    var size = $("#selectGameSize").val();

    // parse game size value
    size = parseInt(size, 10);


    // check if this is a valid selection
    if (size === 0) {
        // show an error message
        alert("Please choose a size!");
    } else {
        // fetch the game board array from the server
        $.post("http://localhost:8000/new?size=" + size, function (response) {
            // store game data * 2 for card number
            gameBoardSize = size * 2;

            // create an empty game board
            var board = [];
            for (var i = 0; i < gameBoardSize; i++) {
                board.push({
                    "cleared": "false",
                    "value": null
                });
            }

            // draw the game board
            drawGameBoard(board);
        });
    }
}

function restoreGame() {
    // reset the game
    gameBoardSize = 0;
    cardsFlipped = 0;

    // fetch the game state from the server 
    $.get("http://localhost:8000/game", function (response) {
        // store game board size
        gameBoardSize = response.length;

        // draw the game board
        drawGameBoard(response);
    });
}

function drawGameBoard(board) {
    // create output
    var output = "";
    // detect board size CSS class
    var css = "";
    switch (board.length / 4) {
        case 1:
            css = "rows1";
            break;
        case 2:
            css = "rows2";
            break;
        case 3:
            css = "rows3";
            break;
        case 4:
            css = "rows4";
            break;
    }
    // generate HTML for each card and append to the output
    for (var i = 0; i < board.length; i++) {
        if (board[i].cleared == "true") {
            // if the card has been cleared apply the .flip class
            output += "<div class=\"flipContainer col-xs-3 " + css + "\"><div class=\"cards flip matched\" id=\"" + i + "\" onClick=\"flipCard(this)\">\
				<div class=\"front\"><span class=\"glyphicon glyphicon-question-sign\"></span></div>\
				<div class=\"back\">" + lookUpGlyphicon(board[i].value) + "</div>\
				</div></div>";
        } else {
            output += "<div class=\"flipContainer col-xs-3 " + css + "\"><div class=\"cards\" id=\"" + i + "\" onClick=\"flipCard(this)\">\
				<div class=\"front\"><span class=\"glyphicon glyphicon-question-sign\"></span></div>\
				<div class=\"back\"></div>\
				</div></div>";
        }
    }
    // place the output on the page
    $("#game-board").html(output);
}

function flipCard(card) {
    // prevent the user from selecting a flipped card
    if ($(card).hasClass("flip")) {
        return;
    }

    // only allow the user to select two cards at a time
    if (selectedCards.length < 2) {

        $(card).toggleClass("flip");

        // check if this is the first card selection or the second
        if (selectedCards.length == 0) {
            // store the first card selection
            selectedCards.push(card.id);

            // post this guess to the server and get this card's value
            $.ajax({
                url: "http://localhost:8000/guess?card=" + selectedCards[0],
                type: 'PUT',
                success: function (response) {
                    // display first card value
                    $("#" + selectedCards[0] + " .back").html(lookUpGlyphicon(response[0].value));

                    // store the first card value
                    selectedCardsValues.push(response[0].value);
                }
            });
        }
        else if (selectedCards.length == 1) {
            // store the second card selection
            selectedCards.push(card.id);

            // post this guess to the server and get this card's value
            $.ajax({
                url: "http://localhost:8000/guess?card=" + selectedCards[1],
                type: 'PUT',
                success: function (response) {
                    // display first card value
                    $("#" + selectedCards[1] + " .back").html(lookUpGlyphicon(response[0].value));

                    // store the first card value
                    selectedCardsValues.push(response[0].value);

                    // check if this was a match
                    if (selectedCardsValues[0] == selectedCardsValues[1]) {
                        // increment our flipped cards counter
                        cardsFlipped += 2;

                        // assign the matched class
                        $("#" + selectedCards[0]).addClass("matched");
                        $("#" + selectedCards[1]).addClass("matched");

                        // reset our selection arrays
                        selectedCards = [];
                        selectedCardsValues = [];

                        // check if the user won the game

                        if (cardsFlipped == gameBoardSize) {
                            setTimeout(function () {
                                output = "<div id=\"playAgain\"><p>You Win!</p><input type=\"button\" onClick=\"location.reload()\" value=\"Play Again\" class=\"btn\" /></div>";
                                $("#game-board").html(output);
                            }, 1000);
                        }

                    }
                    else {
                        // wait three seconds, then flip the cards back
                        setTimeout(function () {
                            // reset the background color
                            $("#" + selectedCards[0]).toggleClass("flip");
                            $("#" + selectedCards[1]).toggleClass("flip");

                            // reset our selection arrays
                            selectedCards = [];
                            selectedCardsValues = [];
                        }, 1000);
                    }
                }
            });
        }
    }
}

// glyphicon value map
var valuesMap = [
    {
        "value": "0",
        "glyphicon": "glyphicon glyphicon-cloud"
    },
    {
        "value": "1",
        "glyphicon": "glyphicon glyphicon-heart"
    },
    {
        "value": "2",
        "glyphicon": "glyphicon glyphicon-star"
    },
    {
        "value": "3",
        "glyphicon": "glyphicon glyphicon-home"
    },
    {
        "value": "4",
        "glyphicon": "glyphicon glyphicon-glass"
    },
    {
        "value": "5",
        "glyphicon": "glyphicon glyphicon-music"
    },
    {
        "value": "6",
        "glyphicon": "glyphicon glyphicon-fire"
    },
    {
        "value": "7",
        "glyphicon": "glyphicon glyphicon-globe"
    },
    {
        "value": "8",
        "glyphicon": "glyphicon glyphicon-tree-conifer"
    }
];

// get gylphicon for value
function lookUpGlyphicon(value) {
    for (var i = 0; i < valuesMap.length; i++) {
        if (valuesMap[i].value == value) {
            return "<span class=\"" + valuesMap[i].glyphicon + "\"></span>";
        }
    }

    return value;
}
