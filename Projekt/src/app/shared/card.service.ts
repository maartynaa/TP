import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { strict } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  public static instance;
  cardDescription = [];
  boardDescription = [];
  cardsOrientation = [];
  boardWidth = 20;
  openTunnels = [];
  cardUrl = "../../assets/cards/"
  lastOpenedTunnels = 0;
  lastClosedTunnels = [];


  constructor(private http: HttpClient) {
    CardService.instance = this;

    for(let i=0; i<300; i++) {
      this.boardDescription.push(-1);
    }
    this.boardDescription[149] = 0;
    this.boardDescription[150] = 1000;
    this.openTunnels.push(149+this.boardWidth);
    this.openTunnels.push(150+this.boardWidth);
    this.openTunnels.push(149-this.boardWidth);
    this.openTunnels.push(150-this.boardWidth);
    this.openTunnels.push(148);
    this.openTunnels.push(151);

    this.loadCardDescriptions();
   }

  loadCardDescriptions() {
    for (let i=0; i<33; i++){
      this.http.get("assets/cards/" + i.toString() + ".txt", {responseType: "text"}).subscribe(data => {
        let dataSplit = data.split("\n");
        this.cardDescription.push([]);
        this.cardDescription[i].push(parseInt (dataSplit[0][1], 10));
        this.cardDescription[i].push(parseInt (dataSplit[0][3], 10));
        this.cardDescription[i].push(parseInt (dataSplit[1][0], 10));
        this.cardDescription[i].push(parseInt (dataSplit[1][4], 10));
        this.cardDescription[i].push(parseInt (dataSplit[2][1], 10));
        this.cardDescription[i].push(parseInt (dataSplit[2][3], 10));
      });
    }
  }

  getCardDescriptions() {
    return this.cardDescription;
  }

  /**
   * Check if selected element to drop and neighboring element are empty. Neighboring element depends on card orientation.
   * If elements are empty check if card fit to neighbouring cards.
   * @param cardsOrientationArray array with cards orientations
   * @param targetId board element Id
   * @param index card index
   * @returns Id of neighboring element if card can be dropped, -1 otherwise
   */
  checkCardCanBeDropped(cardsOrientationArray, targetId, index): number { 
    this.cardsOrientation = cardsOrientationArray;
    if (this.boardDescription[targetId] == -1) {
      targetId = parseInt (targetId, 10);
      if (this.cardsOrientation[index-1] == 0 && targetId % this.boardWidth != 19) { 
        if (this.boardDescription[targetId+1] == -1) {
          if (this.cardFitToNeighbour(index, targetId, targetId+1)) { 
            return targetId+1;
          }
        }
      }
      else if (this.cardsOrientation[index-1] == 90 && targetId < 280) {
        if (this.boardDescription[targetId+this.boardWidth] == -1) {
          if (this.cardFitToNeighbour(index, targetId, targetId+this.boardWidth)) { 
            return targetId+this.boardWidth;
          }
        }
      }
      else if (this.cardsOrientation[index-1] == 180 && targetId % this.boardWidth != 0) {
        if (this.boardDescription[targetId-1] == -1) {
          if (this.cardFitToNeighbour(index, targetId, targetId-1)) { 
            return targetId-1;
          }
        }
      }
      else if (this.cardsOrientation[index-1] == 270 && targetId >= 20) {
        if (this.boardDescription[targetId-this.boardWidth] == -1) {
          if (this.cardFitToNeighbour(index, targetId, targetId-this.boardWidth)) { 
            return targetId-this.boardWidth;
          }
        }
      }
    }
    return -1;
  }

  /**
   * Check if both halves fit to their neighbours and if they have at least one neighbour
   * @param cardIndex card index
   * @param targetId board element Id
   * @param nextTargetId board element Id of card's second half
   * @returns Yes if conditions are met, false otherwise
   */
  cardFitToNeighbour(cardIndex: number, targetId:number, nextTargetId:number): Boolean {
    let neighbours = this.checkCardFitToNeighbours(targetId, this.getHalfCardDescription(cardIndex));
    if (neighbours > -1) {
      let neighbours2 = this.checkCardFitToNeighbours(nextTargetId, this.getHalfCardDescription(cardIndex+1000));
      //console.log(this.getHalfCardDescription(cardIndex+1000));
      //console.log(neighbours);
      //console.log(neighbours2);
      if (neighbours2 > -1 && neighbours+neighbours2>0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if card fit to neighbours
   * @param targetId board element Id
   * @param halfCardDesc card's description
   * @returns Number of neighbours if card fit to neighbours, -1 otherwise
   */
  checkCardFitToNeighbours(targetId:number, halfCardDesc) :number{
    let neighboursChecked = 0;
    let neighbours = 0;

    //up neighbour
    if (targetId<this.boardWidth) {
      neighboursChecked += 1;
    }
    else if (this.boardDescription[targetId-this.boardWidth] != -1) {
      let neighbourDesc = this.getHalfCardDescription(this.boardDescription[targetId-this.boardWidth]);
      //console.log(halfCardDesc);
      //console.log(neighbourDesc);
      if ((halfCardDesc[0] + neighbourDesc[2]) % 2 == 0) {
        neighboursChecked += 1;
        if (halfCardDesc[0] == 1) {
          neighbours += 1;
        }
      }
    }
    else {
      neighboursChecked += 1;
    }

    //down neighbour
    if (targetId>=280) {
      neighboursChecked += 1;
    }
    else if (this.boardDescription[targetId+this.boardWidth] != -1) {
      let neighbourDesc = this.getHalfCardDescription(this.boardDescription[targetId+this.boardWidth]);
      //console.log(halfCardDesc);
      //console.log(neighbourDesc);
      if ((halfCardDesc[2] + neighbourDesc[0]) % 2 == 0) {
        neighboursChecked += 1;
        if (halfCardDesc[2] == 1) {
          neighbours += 1;
        }
      }
    }
    else {
      neighboursChecked += 1;
    }

    //left neighbour
    if (targetId % this.boardWidth == 0) {
      neighboursChecked += 1;
    }
    else if (this.boardDescription[targetId-1] != -1) {
      let neighbourDesc = this.getHalfCardDescription(this.boardDescription[targetId-1]);
      //console.log(halfCardDesc);
      //console.log(neighbourDesc);
      if ((halfCardDesc[3] + neighbourDesc[1]) % 2 == 0) {
        neighboursChecked += 1;
        if (halfCardDesc[3] == 1) {
          neighbours += 1;
        }
      }
    }
    else {
      neighboursChecked += 1;
    }

    //right neighbour
    if (targetId % this.boardWidth == 19) {
      neighboursChecked += 1;
    }
    else if (this.boardDescription[targetId+1] != -1) {
      let neighbourDesc = this.getHalfCardDescription(this.boardDescription[targetId+1]);
      //console.log(halfCardDesc);
      //console.log(neighbourDesc);
      if ((halfCardDesc[1] + neighbourDesc[3]) % 2 == 0) {
        neighboursChecked += 1;
        if (halfCardDesc[1] == 1) {
          neighbours += 1;
        }
      }
    }
    else {
      neighboursChecked += 1;
    }

    if (neighboursChecked == 4) {
      return neighbours;
    }
    return -1;
  }

  /**
   * Return card's description complies with card orientation
   * @param index card number
   */
  getHalfCardDescription(index: number) {
    if (index>=1000) {
      index-=1000;
      if (index==0 || this.cardsOrientation[index-1] == 0) {
        return [this.cardDescription[index][1], this.cardDescription[index][3], this.cardDescription[index][5], 0];
      }
      else if (this.cardsOrientation[index-1] == 90) {
        return [0, this.cardDescription[index][1], this.cardDescription[index][3], this.cardDescription[index][5]];
      }
      else if (this.cardsOrientation[index-1] == 180) {
        return [this.cardDescription[index][5], 0, this.cardDescription[index][1], this.cardDescription[index][3]];
      }
      else if (this.cardsOrientation[index-1] == 270) {
        return [this.cardDescription[index][3], this.cardDescription[index][5], 0, this.cardDescription[index][1]];
      }
    }
    else {
      if (index==0 || this.cardsOrientation[index-1] == 0) {
        return [this.cardDescription[index][0], 0, this.cardDescription[index][4], this.cardDescription[index][2]];
      }
      else if (this.cardsOrientation[index-1] == 90) {
        return [this.cardDescription[index][2], this.cardDescription[index][0], 0, this.cardDescription[index][4]];
      }
      else if (this.cardsOrientation[index-1] == 180) {
        return [ this.cardDescription[index][4], this.cardDescription[index][2], this.cardDescription[index][0], 0];
      }
      else if (this.cardsOrientation[index-1] == 270) {
        return [0, this.cardDescription[index][4], this.cardDescription[index][2], this.cardDescription[index][0]];
      }
    }
  }

  /**
   * Set board description on given value
   * @param index number of board element
   * @param value -1 if board element empty, card number otherwise
   */
  setBoardDescription(index: number, value: number) {
    this.boardDescription[index] = value;
  }

  /**
   * Actualize informations about opened and closed tunnels caused by dropping card
   * @param index number of card
   * @param targetId board element Id on which card is dropped
   */
  setOpenTunnels(index: number, targetId:number): Boolean {
    if (index < 1000) {this.lastOpenedTunnels=0;}
    this.lastClosedTunnels = [];
    if (this.openTunnels.indexOf(targetId)!=-1){
      this.lastClosedTunnels.push(targetId);
      this.openTunnels.splice(this.openTunnels.indexOf(targetId), 1);
    }

    let cardDesc = this.getHalfCardDescription(index);
    if (cardDesc[0] == 1) {
      if (targetId < this.boardWidth){return false;}
      else if (this.boardDescription[targetId - this.boardWidth] == -1) {
        this.openTunnels.push(targetId - this.boardWidth);
        this.lastOpenedTunnels++;
      }
    }
    if (cardDesc[1] == 1) {
      if (targetId % this.boardWidth == 19){return false;}
      else if (this.boardDescription[targetId + 1] == -1) {
        this.openTunnels.push(targetId + 1);
        this.lastOpenedTunnels++;
      }
    }
    if (cardDesc[2] == 1) {
      if (targetId >= 280){return false;}
      else if (this.boardDescription[targetId + this.boardWidth] == -1) {
        this.openTunnels.push(targetId + this.boardWidth);
        this.lastOpenedTunnels++;
      }
    }
    if (cardDesc[3] == 1) {
      if (targetId % this.boardWidth == 0){return false;}
      else if (this.boardDescription[targetId - 1] == -1) {
        this.openTunnels.push(targetId - 1);
        this.lastOpenedTunnels++;
      }
    }
    return true;
  }

  /**
   * Undo last informations about opening tunnels
   */
  undoMove () {
    this.openTunnels.splice(this.openTunnels.length - this.lastOpenedTunnels, this.lastOpenedTunnels);
    this.lastClosedTunnels.forEach(tunnel => {
      this.openTunnels.push(tunnel);
    });
  }
  
  /**
   * @returns Number of openned tunnels
   */
  getOpenTunnelsNumber(): number{
    return this.openTunnels.length;
  }

}
