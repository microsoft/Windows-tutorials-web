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
var dataProvider = require('../data/game.js');
/**
 * Operations on /game
 */
module.exports = {
    /**
     * summary: Retrieves the current state of the memory game board.
     * parameters: (none)
     * produces: application/json, text/json
     * responses: 200, 400
     */
    get: function game_get(req, res, next) {
        var status;
        var message;
        
        // If there's a game in progress, retrieve its current state
        if (global.board){
            status = 200;
            var provider = dataProvider['get']['200'];
            var board = provider(req, res, function (err, data) {
                if (err) {
                    next(err);
                    return;
                }
            });
            res.json(board);
        }
        else { // No game in progress: set bad request error
            status = 400;
            message = "Please start a new game (POST '/new?size={# of matches}')."
        }
        res.status(status).send(message);
    }
};
