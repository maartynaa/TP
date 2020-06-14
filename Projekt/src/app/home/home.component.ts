import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { summaryForJitFileName } from '@angular/compiler/src/aot/util';
import { range } from 'rxjs';
import {CardService} from "../shared/card.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  url  = "../../assets/start.jpg";
  cardUrl = "../../assets/cards/"
  array = [1,2,3,4,5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  //array = [1,2];
  cardsArray = [];
  cardsOrientation = [];
  board = [];
  chosenCard = null;
  boardWidth = 20;
  nextCardOnStack = 3;
  numberOfMoves = 0;
  hand = []
  leftCards = 0;
  lastPlacedCard = "";
  lastPlaceDropCard = -1;
  lastPlace2DropCard = -1;

  constructor(private router: Router, private userService: UserService, private cardService: CardService) {
   }

  ngOnInit() {
    for (let i in this.array) {
      this.cardsArray.push(this.cardUrl + this.array[i] + ".PNG");
      this.cardsOrientation.push(0);
    }
    this.leftCards = this.cardsArray.length-3;

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

    for (let i=0; i<3; i++) {
      let elem = document.getElementById("div"+this.cardsArray[i]);
      elem.style.display = "inline-block";
      this.hand.push(this.cardsArray[i]);
    }
  }

  onClickMe() {
    
  }

  shuffle(array) {
    var i = array.length,
        j = 0,
        temp;

    while (i--) {

        j = Math.floor(Math.random() * (i+1));

        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

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
   * Set background of drop element on drag background element. Original card was divided in half and it takes 2 boards elements.
   * Actuaile informations about game: cards on hand, open tunnels, number of moves etc.
   */
  onDrop(event: any): void {
    let dest = event.target.id;
    let originEl = document.getElementById(this.chosenCard);
    let destEl = document.getElementById(dest);

    let index = this.getIndex(this.chosenCard);
    destEl.style.backgroundImage = "url(" + this.cardUrl + index + "_1.png"+")";
    destEl.style.backgroundSize = "60px 60px";

    dest = parseInt (dest, 10);
    this.cardService.setBoardDescription(dest, index);
    if (!this.cardService.setOpenTunnels(index, dest)) {
      let div = document.getElementById("gameOver");
      div.style.display = "block";
    }
    this.lastPlaceDropCard = dest;

    if (this.cardsOrientation[index-1] == 0) { dest += 1; }
    else if (this.cardsOrientation[index-1] == 90) { dest += this.boardWidth; }
    else if (this.cardsOrientation[index-1] == 180) { dest -= 1; }
    else { dest -= this.boardWidth; }
    this.cardService.setBoardDescription(dest, index+1000);
    if (!this.cardService.setOpenTunnels(index+1000, dest)) {
      let div = document.getElementById("gameOver");
      div.style.display = "block";
    }

    this.lastPlace2DropCard = dest;
    let nextBlock = document.getElementById(dest);
    nextBlock.style.backgroundImage = "url(" + this.cardUrl + index + "_2.png" + ")";
    nextBlock.style.backgroundSize = "60px 60px";
    
    destEl.style.transform = "rotate(" + this.cardsOrientation[index-1] + "deg)";
    nextBlock.style.transform = "rotate(" + this.cardsOrientation[index-1] + "deg)";
    nextBlock.id = this.chosenCard+'1000';

    event.target.style.border = "";

    this.hand.splice(this.hand.indexOf(this.chosenCard), 1);
    let originDivEl = document.getElementById("div"+this.chosenCard);
    originDivEl.style.display = "none";
    if (this.nextCardOnStack < this.cardsArray.length) {
      let newCard = document.getElementById("div"+this.cardsArray[this.nextCardOnStack]);
      newCard.style.display = "inline-block";
      this.hand.push(this.cardsArray[this.nextCardOnStack]);
      this.nextCardOnStack += 1;
    }
    if (this.nextCardOnStack == this.cardsArray.length){
      let stack = document.getElementById("stack");
      stack.style.display = "none";
    }

    this.lastPlacedCard = this.chosenCard;
    destEl.id = this.chosenCard;
    originEl.id = this.chosenCard+'dropped';
    this.chosenCard = null;

    this.numberOfMoves++;
    this.leftCards--;

    if (this.cardService.getOpenTunnelsNumber() == 0) {
      let div = document.getElementById("gameWin");
      div.style.display = "block";
    }
    else if (this.leftCards == -3) {
      let div = document.getElementById("gameOver");
      div.style.display = "block";
    }
    
  }

  /**
   * Allow drop element when chosen element and neighboring place are empty. Also default rules must be met.
   */
  allowDrop(event): void {
    if (this.cardService.checkCardCanBeDropped(this.cardsOrientation, event.target.id, this.getIndex(this.chosenCard))!=-1) {
      event.preventDefault();
      event.target.style.opacity = 1;
    }   
  }

  /**
   * Draw frame on potential drop target when the draggable element enters it
   */
  Dragenter(event): void {
    let targetId = this.cardService.checkCardCanBeDropped(this.cardsOrientation, event.target.id, this.getIndex(this.chosenCard));
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
    for (let i=0; i<3; i++){
      this.cardsArray.push(this.hand[i]);
      let card = document.getElementById("div"+this.hand[i]);
      card.style.display = "none";
    }
    this.hand=[];
    for (let i=0; i<3; i++){
      this.hand.push(this.cardsArray[this.nextCardOnStack+i]);
      let card = document.getElementById("div"+this.cardsArray[this.nextCardOnStack+i]);
      card.style.display = "inline-block";
    }
    this.nextCardOnStack+=3;
    this.numberOfMoves++;
  }

  /**
   * Refresh page
   */
  startNewGame() {
    window.location.reload();
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
      let card = document.getElementById(this.lastPlacedCard+'dropped');
      card.id = this.lastPlacedCard;
      let cardBlock = document.getElementById('div'+this.lastPlacedCard);
      cardBlock.style.display = "inline-block";

      this.nextCardOnStack -= 1;
      let newCard = document.getElementById("div"+this.cardsArray[this.nextCardOnStack]);
      newCard.style.display = "none";
      this.hand.splice(this.hand.indexOf(this.cardsArray[this.nextCardOnStack]), 1);
      this.hand.push(this.lastPlacedCard);

      this.cardService.setBoardDescription(this.lastPlaceDropCard, -1);
      this.cardService.setBoardDescription(this.lastPlace2DropCard, -1);
      this.cardService.undoMove();

      this.numberOfMoves++;
      this.lastPlaceDropCard = -1;
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
