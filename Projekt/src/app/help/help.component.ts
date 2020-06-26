import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  userClaims : any;

  constructor(private router: Router, private userService: UserService) {
    this.userClaims = this.userService.getUserClaims()
   }

  ngOnInit(): void {
  }

  Logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  startNewGame() {
    //window.location.reload();
    this.router.navigate(['/home']);
  }



}