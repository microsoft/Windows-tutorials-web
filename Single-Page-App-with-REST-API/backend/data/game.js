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
/**
 * Operations on /game
 */
module.exports = {
    /**
     * summary: Retrieves the current state of the game
     * description: Returns an array of card objects, where position in
     *  the array indicates card ID and the "cleared" property indicates
     *  if its match has already been found. The value of cleared cards is also
     *  reported.
     * 
     * parameters: (none)
     * produces: application/json, text/json
     * responses: 200
     * operationId: game_get
     */
    get: {
        200: function (req, res, callback) {
            // Only reveal cleared card values
            var currentBoardState = [];
            var board = global.board;

            for (var i=0; i < board.length; i++){
                var card = {};
                card.cleared = board[i].cleared;
                if ("true" == card.cleared) {  // To debug the board, comment this line
                    card.value = board[i].value;
                }                              // And this line
                currentBoardState.push(card);
            }
            return currentBoardState;
        }
    }
};
