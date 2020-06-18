import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import io from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class GameServerService {

  socket: any;
  gameComponent: any;
  playerIndex: number;
  playerNo: number;
  gameMode: number; //1-single, 2-multiplayer
  constructor(private http: HttpClient) { 
  }

  setGameMode(mode) {
    this.gameMode = mode;
  }

  getGameMode():number {
    return this.gameMode;
  }

  startGame(homeComponent) {
    this.gameComponent = homeComponent;
    this.socket = io("http://localhost:3000");
    if (this.gameMode == 1) {this.socket.emit("startGame", 0);}
    else {this.socket.emit("startGameMultiplayer", 0);}
    
    this.socket.on("player", data => {
      this.playerIndex = data[0];
      this.playerNo = data[1];
    });
    this.socket.on("cardsArray", data => {
      this.gameComponent.setCardsArray(data[0], data[1], this.playerNo);
      this.socket.on("cardOnHand", card => {
        this.gameComponent.addCardOnHand(card);
      });
    });
    this.socket.on("setCardOnBoard", data => {
      this.gameComponent.setCardOnBoard(data[0], data[1], data[2], data[3]);
    });
    this.socket.on("endOfTurn", cards => {
      this.gameComponent.endOfTurn(cards);
    });
    this.socket.on("cardsBackOnStack", cards => {
      this.gameComponent.cardsBackOnStack(cards);
    });
    this.socket.on("gameOver", data => {
      this.gameComponent.gameOver();
    });
    this.socket.on("gameWinDisplayWindow", data => {
      this.gameComponent.gameWinDisplayWindow();
    });
  }

  getCardOnHand() {
    this.socket.emit("getCard", this.playerIndex);
  }

  swapCards(hand) {
    this.socket.emit("swapCards", [hand, this.playerIndex]);
  }

  undoMove() {
    this.socket.emit("undoMove", this.playerIndex);
  }

  dropCard(data) {
    data.push(this.playerNo);
    data.push(this.playerIndex);
    this.socket.emit("drop", data);
  }

  turnEnding() {
    this.socket.emit("turnEnding", this.playerIndex);
  }

  gameWin() {
    this.socket.emit("gameWin", this.playerIndex);
  }


}
