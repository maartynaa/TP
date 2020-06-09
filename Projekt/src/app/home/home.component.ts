import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { summaryForJitFileName } from '@angular/compiler/src/aot/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  url  = "../../assets/start.jpg";
  cardUrl = "../../assets/cards/"
  array = [1,2,3,4,5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  cardsArray = []
  idx = 0
  card = null

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.array = this.shuffle(this.array) 

    for (let i in this.array) {
      this.cardsArray.push(this.cardUrl + this.array[i] + ".PNG");
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


}
