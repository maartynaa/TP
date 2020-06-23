import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  userClaims : any;
  data : any;

  constructor(private router: Router, private userService : UserService) { 
    this.userClaims = this.userService.getUserClaims()
  
  }

  ngOnInit(): void {
    console.log("ranking")
    this.userService.getScore().subscribe((data: any) => {
      this.data = data      
    });
  }

  Logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  startNewGame() {
    //window.location.reload();
    this.router.navigate(['/home']);
  }

  help() {

  }

}
