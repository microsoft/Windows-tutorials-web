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
var dataProvider = require('../data/new.js');
var MAX_MATCHES = 20;
/**
 * Operations on /new
 */
module.exports = {
    /**
     * summary: Initializes a new game board of the specified size (# of matches)
     * parameters: size
     * produces: application/json, text/json
     * responses: 200, 400
     */
    post: function game_new(req, res, next) {
        var status;
        var message;
        global.board = null;  // Null out the current game

        // This is a valid game size: initialize new game board
        if ((req.query.size > 0)&&(req.query.size <= MAX_MATCHES)){
            status = 200;
            var provider = dataProvider['post']['200'];

            // Call the data layer to shuffle up a new game
            var board = provider(req, res, function (err, data) {
                if (err) {
                    next(err);
                    return;
                }
            });
            message = "Ready to play! Matches to find = " +
                     req.query.size; 
        } else {  // Invalid # of matches specified: set bad request error
            status = 400;
            message = "Size of game (# of matches) must be between 1 and " +
                      MAX_MATCHES + ". Specified size = " + req.query.size; 
        }
        res.status(status).send(message);
    }
};
