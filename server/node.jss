let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let count = 0;
let currentRound = 2;
let firstWins = 0;
let secondWins = 0;
let player1Id = -1;
let last = 1;
let wasStarted = false;
let currScore1 = 0;
let currScore2 = 0;
io.on('connection', (socket) => {
    count++;
    // Log whenever a user connects
    console.log('user connected');
    if (player1Id === -1) {
        player1Id = socket.id;
        socket.join('room1');
    } else {
        player2Id = socket.id;
        socket.join('room2');
    }
    
    if (count === 2) {
        io.emit('message', {type:'start'});
    }
    // Log whenever a client disconnects from our websocket server
    socket.on('disconnect', function(){
        count--;
        console.log('user disconnected');
    });

    // When we receive a 'message' event from our client, print out
    // the contents of that message and then echo it back to our client
    // using `io.emit()`
    socket.on('message', (message) => {
        console.log("Message Received: " + message);
        processMessage(JSON.parse(message), socket.id);    
    });
});

// Initialize our websocket server on port 5000
http.listen(15920, () => {
    console.log('started on port 15920');
});

function displayWinner() {
    if (firstWins > secondWins) {
        io.to('room1').emit('message', {type:'gameOver', win: true });
        io.to('room2').emit('message', {type:'gameOver', win: false });
    } else {
        if (firstWins < secondWins) {
            io.to('room1').emit('message', {type:'gameOver', win: false });
            io.to('room2').emit('message', {type:'gameOver', win: true });
        } else {
            const winner = Math.floor(Math.random() * Math.floor(2));
            if (winner === 0) {
                io.to('room1').emit('message', {type:'gameOver', win: true });
                io.to('room2').emit('message', {type:'gameOver', win: false });
            } else {
                io.to('room1').emit('message', {type:'gameOver', win: false });
                io.to('room2').emit('message', {type:'gameOver', win: true });
            }
        }
    }
}

function processMessage(msg, id) {
    if (msg.type === "choseCards") {
        if (player1Id === id) {
            if (!wasStarted) {
                io.to('room1').emit('message', {type:'startTurn'});
                last = 2;
                wasStarted = true;
            }
            io.to('room2').emit('message', {type:'manager', manager: msg.manager });
        } else {
            if (!wasStarted) {
                io.to('room2').emit('message', {type:'startTurn'}); 
                last = 1
                wasStarted = true;
            }
            io.to('room1').emit('message', {type:'manager', manager: msg.manager });
        }      
    }

    if (msg.type === "endTurn") {
        if (player1Id === id) {
            io.to('room2').emit('message', {type:'startTurn'});
            currScore1 = msg.score;
            if (last === 1) {
                if (currentRound === 0)
                    displayWinner();

                if (currScore1 > currScore2) {
                    firstWins++;
                } else {
                    if (currScore1 < currScore2)
                        secondWins++;
                    else {
                        firstWins++;
                        secondWins++;
                    }
                }
                currentRound--;
                io.to('room1').emit('message', {type:'roundEnded'});
                io.to('room2').emit('message', {type:'roundEnded'});
            }
            console.log('1st' + currScore1);
        } else {
            io.to('room1').emit('message', {type:'startTurn'});
            currScore2 = msg.score;
            if (last === 2) {
                if (currentRound === 0)
                    displayWinner();

                if (currScore1 > currScore2) {
                    firstWins++;
                } else {
                    if (currScore1 > currScore2)
                        secondWins++;
                    else {
                        firstWins++;
                        secondWins++;
                    }
                }
                currentRound--;
                io.to('room1').emit('message', {type:'roundEnded'});
                io.to('room2').emit('message', {type:'roundEnded'});
            }
            console.log('2st' + currScore2);
        }   
    }

    if (msg.type === "addedCard") {
        if (player1Id === id) {
            io.to('room2').emit('message', {type:'addOpponentCard', src: msg.src });
        } else {
            io.to('room1').emit('message', {type:'addOpponentCard', src: msg.src });
        }   
    }
}