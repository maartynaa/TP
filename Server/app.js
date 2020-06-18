const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

Http.listen(3000, () => {
    console.log("Listening at :3000...");
});

var players = [];
var newPlayers = 0;
var array = [1,2,3,4,5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
//var array = [24, 25, 26, 27, 28, 29, 30, 31, 32];
var waitSecondPlayer = 0;
var hands = [];
var leftCards = [];

Socketio.on("connection", socket => {
    socket.on("startGameMultiplayer", data => {
        if (newPlayers == 1) {
            let index = waitSecondPlayer;
            players[index].push(socket);
            var i = array.length, j = 0, temp;
            while (i--) {
                j = Math.floor(Math.random() * (i+1));
                temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }

            socket.emit("player", [index, 1]);
            socket.emit("cardsArray", [array, leftCards[index]]);
            socket.emit("cardOnHand", 0);
            socket.emit("cardOnHand", 1);
            socket.emit("cardOnHand", 2);
            players[index][0].emit("cardsArray", [array, leftCards[index]]);
            players[index][0].emit("cardOnHand", 3);
            players[index][0].emit("cardOnHand", 4);
            players[index][0].emit("cardOnHand", 5);
            newPlayers = 0;
        }
        else {
            newPlayers++;
            waitSecondPlayer = players.length;
            players.push([socket]);
            leftCards.push(array.length - 6);
            hands.push([6]);
            socket.emit("player", [waitSecondPlayer, 0]);
        }
    });
    socket.on("startGame", data => {
        let index = players.length;
        players.push([socket]);
        leftCards.push(array.length - 3);
        hands.push([3]);
        socket.emit("player", [index, 0]);
        var i = array.length, j = 0, temp;
        while (i--) {
            j = Math.floor(Math.random() * (i+1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        socket.emit("cardsArray", [array, leftCards[index]]);
        socket.emit("cardOnHand", 0);
        socket.emit("cardOnHand", 1);
        socket.emit("cardOnHand", 2);
    });

    socket.on("getCard", index => {
        socket.emit("cardOnHand", hands[index]);
        hands[index]++;
        leftCards[index]--;
    });

    socket.on("swapCards", data => {
        for (let i=0; i<players[data[1]].length; i++){
            players[data[1]][i].emit("cardsBackOnStack", data[0]);
        }
        for(let i=3; i>0; i--) {
            socket.emit("cardOnHand", hands[data[1]]-i);
        }
    });

    socket.on("undoMove", index => {
        hands[index]--;
        leftCards[index]++;
    });

    socket.on("drop", data => {
        for (let i=0; i<players[data[5]].length; i++){
            if (i != data[4]) {
                players[data[5]][i].emit("setCardOnBoard", data);
            }
        }
    });

    socket.on("turnEnding", index => {
        if (leftCards[index] == players[index].length * -3) {
            for (let i=0; i<players[index].length; i++){
                players[index][i].emit("gameOver", 1);
                players[index][i].disconnect();
            }
            players.splice(index);
            hands.splice(index);
            leftCards.splice(index);
        }
        else {
            for (let i=0; i<players[index].length; i++){
                players[index][i].emit("endOfTurn", leftCards[index]);
            } 
        }
        
    });

    socket.on("gameWin", index => {
        for (let i=0; i<players[index].length; i++){
            players[index][i].emit("gameWinDisplayWindow", index);
        }
        players.splice(index);
        hands.splice(index);
        leftCards.splice(index);
    });

});