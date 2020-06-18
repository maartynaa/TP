import { Component, ViewChild, ElementRef,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {GameServerService} from "../shared/game-server.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(private router: Router, private gameServer: GameServerService) {
   }

  ngOnInit() {
    
  } 

  Logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  singlePlayer() {
    this.gameServer.setGameMode(1);
    this.router.navigate(['/game']);
  } 

  multiplayer() {
    this.gameServer.setGameMode(2);
    this.router.navigate(['/game']);
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
