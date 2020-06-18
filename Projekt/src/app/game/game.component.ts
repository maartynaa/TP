import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { summaryForJitFileName } from '@angular/compiler/src/aot/util';
import { range } from 'rxjs';
import {CardService} from "../shared/card.service";
import {GameServerService} from "../shared/game-server.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  url  = "../../assets/start.jpg";
  cardUrl = "../../assets/cards/"
  cardsArray = [];
  cardsOrientation = [];
  board = [];
  chosenCard = null;
  boardWidth = 20;
  numberOfMoves :number;
  hand = []
  leftCards :number;
  lastPlacedCard :string;
  lastPlaceDropCard :number;
  lastPlace2DropCard :number;
  dataLoaded :Boolean;
  opponentTurn :Boolean;
  moveDone :Boolean;
  dataToSend = [];
  gameMode :number;

  constructor(private router: Router, private userService: UserService, private cardService: CardService, private gameServerService: GameServerService) {
   }

  ngOnInit() {
    this.cardsArray = [];
    this.cardsOrientation = [];
    this.board = [];
    this.chosenCard = null;
    this.moveDone = false;
    this.opponentTurn = false;
    this.dataLoaded = false;
    this.dataToSend = [];
    this.numberOfMoves = 0;
    this.hand = []
    this.leftCards = 0;
    this.lastPlacedCard = "";
    this.lastPlaceDropCard = -1;
    this.lastPlace2DropCard = -1;
    this.cardService.onInit();
    this.gameServerService.startGame(this);
    for (let i=0; i<33; i++) {
      this.cardsOrientation.push(0);
    }

    //board is 20x15
    for(let i=0; i<300; i++) {
      this.board.push(i);
    }
  } 

  ngAfterViewInit( ){
    //place start element on the board
    let startElem = document.getElementById('149');
    startElem.style.backgroundImage = "url(../../assets/cards/0_1.png)";
    startElem.style.backgroundSize = "60px 60px";
    startElem = document.getElementById('150');
    startElem.style.backgroundImage = "url(../../assets/cards/0_2.png)";
    startElem.style.backgroundSize = "60px 60px";
  }

  /**
   * Set ArrayCard based on cards order returned by server
   * Set number of cards and first player
   * @param array cards order
   * @param cardsLeft number of cards on stack
   * @param first if player is first
   */
  setCardsArray(array, cardsLeft, first) {
    for (let i in array) {
      this.cardsArray.push(this.cardUrl + array[i] + ".PNG");
    }
    this.leftCards = cardsLeft;
    this.dataLoaded = true;
    this.opponentTurn = first;
    let elem = document.getElementById("waitOnPlayer");
    elem.style.display = "none";
    this.gameMode = this.gameServerService.getGameMode();
  }

  /**
   * Add card with returned by server index on hand 
   * @param cardIndex card index
   */
  addCardOnHand(cardIndex) {
    if (cardIndex < this.cardsArray.length) {
      this.hand.push(this.cardsArray[cardIndex]);
    }
  }

  /**
   * Logout and route to login page 
   */
  Logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  /**
   * Rotate element 90 degrees right. cardsOrientation keep orientations of all elements
   * @param cardId card Id, which is card url
   */
  Rotate(cardId:string){
    let cardElem = document.getElementById(cardId);
    let index = this.getIndex(cardId);
    this.cardsOrientation[index-1] += 90;
    if (this.cardsOrientation[index-1] == 360){
      this.cardsOrientation[index-1] = 0;
    }
    cardElem.style.transform = "rotate(" + this.cardsOrientation[index-1] + "deg)";
  }

  /**
   * Set Id of chosen card
   */
  onDragStart(event: any): void {
    event.dataTransfer.setData('data', event.target.id);
    this.chosenCard = event.target.id;  
  }
  
  /**
   * Actualize informations about game: cards on hand, open tunnels, number of moves etc.
   * Check if game is finished
   */
  onDrop(event: any): void {
    if (!this.opponentTurn && !this.moveDone) {
      let dest = event.target.id;
      let index = this.getIndex(this.chosenCard);
      dest = parseInt (dest, 10);
      this.dataToSend.push([dest, index, this.cardsOrientation[index-1], 1]);
      this.setCardOnBoard(dest, index, this.cardsOrientation[index-1], 1);
      this.lastPlaceDropCard = dest;

      if (this.cardsOrientation[index-1] == 0) { dest += 1; }
      else if (this.cardsOrientation[index-1] == 90) { dest += this.boardWidth; }
      else if (this.cardsOrientation[index-1] == 180) { dest -= 1; }
      else { dest -= this.boardWidth; }
      this.dataToSend.push([dest, index+1000, this.cardsOrientation[index-1], 2]);
      this.setCardOnBoard(dest, index+1000, this.cardsOrientation[index-1], 2);
      this.lastPlace2DropCard = dest;

      this.hand.splice(this.hand.indexOf(this.chosenCard), 1);
      this.gameServerService.getCardOnHand();

      this.lastPlacedCard = this.chosenCard;
      this.chosenCard = null;
      this.moveDone = true;
      this.leftCards--;

      if (this.cardService.getOpenTunnelsNumber() == 0) { 
        let div = document.getElementById("gameWin");
        div.style.display = "block";
        this.moveDone = true;
        this.opponentTurn = true;
        this.gameServerService.dropCard(this.dataToSend[0]);
        this.gameServerService.dropCard(this.dataToSend[1]);
        this.dataToSend = [];
        this.gameServerService.turnEnding();
        this.gameServerService.gameWin();
      }
      else if (this.gameMode == 1) {this.gameServerService.turnEnding();}
    }
  }

  /**
   * Set background of drop element on drag background element. Original card was divided in half and it takes 2 boards elements.
   */
  setCardOnBoard(destIndex, cardIndex, orientation, halfNo) {
    let destEl = document.getElementById(destIndex.toString());
    if (cardIndex < 1000) {
      destEl.style.backgroundImage = "url(" + this.cardUrl + cardIndex + "_" + halfNo.toString() + ".png)";
      destEl.id =  this.cardUrl + cardIndex + ".PNG";
      this.cardsOrientation[cardIndex-1] = orientation;
    }
    else {
      let index = cardIndex - 1000;
      destEl.style.backgroundImage = "url(" + this.cardUrl + index + "_" + halfNo.toString() + ".png)";
      destEl.id =  this.cardUrl + index + ".PNG1000";
      this.cardsOrientation[index-1] = orientation;
    }
    
    destEl.style.transform = "rotate(" + orientation + "deg)";
    destEl.style.backgroundSize = "60px 60px";

    this.cardService.setBoardDescription(destIndex, cardIndex);
    if (!this.cardService.setOpenTunnels(cardIndex, destIndex, orientation)) {
      let div = document.getElementById("gameOver");
      div.style.display = "block";
    }
  }

  /**
   * Allow drop element when chosen element and neighboring place are empty. Also default rules must be met.
   */
  allowDrop(event): void {
    if (this.cardService.checkCardCanBeDropped(this.cardsOrientation[this.getIndex(this.chosenCard)-1], event.target.id, this.getIndex(this.chosenCard))!=-1) {
      event.preventDefault();
      event.target.style.opacity = 1;
    }   
  }

  /**
   * Draw frame on potential drop target when the draggable element enters it
   */
  Dragenter(event): void {
    let targetId = this.cardService.checkCardCanBeDropped(this.cardsOrientation[this.getIndex(this.chosenCard)-1], event.target.id, this.getIndex(this.chosenCard));
    if (targetId != -1) {
      //event.target.style.border="2px solid red";
      //this.nextBlock = document.getElementById(targetId.toString());
      //this.nextBlock.style.border="2px solid red";
    }
  }

  /**
   * Reset frame of potential drop target when the draggable element leaves it
   */
  DragLeave(event): void {
    //this.nextBlock.style.border="";
    //event.target.style.border="";
  }

  /**
   * Get card index from card url
   * @param name card url
   * @returns index which is number of card
   */
  getIndex(name: string): number {
    let index;
    if (name[name.length-6] != '/'){
      index = parseInt(name.substring(name.length-6, name.length-4), 10);
    }
    else{
      index = parseInt(name[name.length-5], 10);
    }
    return index;
  }

  /**
   * Swap 3 cards from hand and cards stack
   */
  swapCardsOnHand() {
    this.gameServerService.swapCards(this.hand);
    this.hand=[];
    this.turnEnding();
  }

  /**
   * Skip turn
   */
  skipTurn() {
    this.turnEnding();
  }

  /**
   * Move cards from hand on the bottom of cards stack
   */
  cardsBackOnStack(cards) {
    let index: number;
    for (let i=0; i<3; i++){
      index = this.getIndex(cards[i]);
      this.cardsOrientation[index-1] = 0;
      this.cardsArray.splice(this.cardsArray.indexOf(cards[i]), 1)
      this.cardsArray.push(cards[i]);
    }
  }

  /**
   * Send to server informations about move done
   */
  turnEnding() {
    this.lastPlaceDropCard = -1;
    if (this.dataToSend.length > 0){
      this.gameServerService.dropCard(this.dataToSend[0]);
      this.gameServerService.dropCard(this.dataToSend[1]);
      this.dataToSend = [];
    }
    this.gameServerService.turnEnding();
  }

  /**
   * Actualize variables like number of moves, number of cards left after doing move 
   */
  endOfTurn(cards) {
    if (this.gameMode == 2){this.opponentTurn = !this.opponentTurn;}
    this.moveDone = false;
    this.numberOfMoves++;
    this.leftCards = cards;
    if (this.leftCards == 0) {
      let elem = document.getElementById("stack");
      elem.style.display = "none";
      elem = document.getElementById("swapCards");
      elem.style.display = "none";
      elem = document.getElementById("skipTurn");
      elem.style.display = "block";

    }
  }

  /**
   * End the game and show window Game over
   */
  gameOver() {
    this.numberOfMoves++;
    let div = document.getElementById("gameOver");
    div.style.display = "block";
    this.lastPlaceDropCard = -1;
    this.opponentTurn = true;
  }

  /**
   * End the game and show window Win
   */
  gameWinDisplayWindow() {
    let div = document.getElementById("gameWin");
    div.style.display = "block";
  }

  /**
   * Refresh page
   */
  startNewGame() {
    //window.location.reload();
    this.router.navigate(['/home']);
  }

  /**
   * Undo last move. Card from board is removed and it backs on the hand
   */
  undoMove() {
    if (this.lastPlaceDropCard != -1) {
      let boardElem = document.getElementById(this.lastPlacedCard);
      let boardNextElem = document.getElementById(this.lastPlacedCard+'1000');
      boardElem.style.backgroundImage = "";
      boardNextElem.style.backgroundImage = "";
      boardElem.id = this.lastPlaceDropCard.toString();
      boardNextElem.id = this.lastPlace2DropCard.toString();

      let index = this.getIndex(this.lastPlacedCard);
      this.cardsOrientation[index-1] = 0;
      if (this.leftCards >= 0) {
        index = this.getIndex(this.hand[this.hand.length-1]);
        this.cardsOrientation[index-1] = 0;
        this.hand.splice(this.hand.length-1, 1);
      }
      this.leftCards++;
      
      this.hand.push(this.lastPlacedCard);
      this.gameServerService.undoMove();

      this.cardService.setBoardDescription(this.lastPlaceDropCard, -1);
      this.cardService.setBoardDescription(this.lastPlace2DropCard, -1);
      this.cardService.undoMove();

      //this.numberOfMoves++;
      this.lastPlaceDropCard = -1;
      this.moveDone = false;
      this.dataToSend = [];
    }
  }

  /**
   * Close end game window
   */
  backToGame() {
    let div = document.getElementById("gameOver");
    div.style.display = "none";
    div = document.getElementById("gameWin");
    div.style.display = "none";
  }

  /**
   * Display ranking
   */
  ranking() {

  }

  /**
   * Display game help
   */
  help() {

  }


}
