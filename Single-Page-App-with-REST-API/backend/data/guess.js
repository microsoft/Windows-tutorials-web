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
var card1 = null;
/**
 * Operations on /guess
 */
module.exports = {
    /**
     * summary: Reveals the specified card and checks for match to the previous.
     * description: Each guess consists of 2 specified cards.
     * parameters: card
     * produces: application/json, text/json
     * responses: 200
     * operationId: game_guess
     */
    put: {
        200: function (req, res, callback) {
             // Obtain the card values
             var response = {};
             var card = req.query.card;

             response.id = card;
             response.value = global.board[card].value;

             // If 1st card has been specified, check if this 2nd card matches
             if (card1 !== null){
                if (global.board[card1].value === global.board[card].value){
                    global.board[card1].cleared =
                    global.board[card].cleared = "true";
                }
                card1 = null;
             } else { // This is the 1st card of the guess
                 card1 = card;
             }

             return Array(response);
        }
    }
};
