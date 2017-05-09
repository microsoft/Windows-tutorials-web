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
'use strict';
var Mockgen = require('./mockgen.js');

// Knuth shuffle courtesy of https://www.kirupa.com/html5/shuffling_array_js.htm
Array.prototype.shuffle = function() {
  var input = this;
  for (var i=input.length-1; i >=0; i--){
    var randomIndex = Math.floor(Math.random()*(i+1));
    var itemAtIndex = input[randomIndex];
    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
};
/**
 * Operations on /new
 */
module.exports = {
    /**
     * summary: Sets up a new game board with specified # of matches
     * description: The game board is a global array of "card" objects, where
     *  their position in the array indicates their ID, and their "value" and
     *  "cleared" properties represent their value and game status. For example,
     * a new board of size=1 (1 matches) would be generated as:
     *  [ 
     *      { "cleared":"false", 
     *        "value":"0", 
     *      }, 
     *      { "cleared":"false", 
     *        "value":"0", 
     *      }
     *  ]
     * parameters: size
     * produces: application/json, text/json
     * responses: 200
     * operationId: game_new
     */
    post: {
        200: function (req, res, callback) {
             // Generate random [0...size] value pairs and shuffle them
             var values = Array.from(Array(req.query.size).keys());
             var deck = values.concat(values.slice());
             deck.shuffle();

             // Create corresponding card objects
             var board = []; 
             for (var i=0; i<deck.length; i++){
                 var card = {};
                 card.cleared = "false";
                 card.value =  deck[i];
                 board.push(card);
             }

             // For sample purposes only; use cloud storage
             global.board = board;
        }
    }
};
