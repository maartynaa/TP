import { Component, ViewChild, ElementRef,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameServerService } from "../shared/game-server.service";
import { UserService } from "../shared/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  userClaims : any
  username : string

  constructor(private router: Router, private gameServer: GameServerService, private userService : UserService) {
    this.userClaims = this.userService.getUserClaims()
  }
   

  ngOnInit() { } 

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
    this.router.navigate(['/ranking']);
  }

  /**
   * Display game help
   */
  help() {

  }


}
