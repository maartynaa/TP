import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from "@angular/http";
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable()
export class UserService {
  readonly rootUrl = 'http://localhost/TP';
  data : any
  constructor(private http: HttpClient) { }

  registerUser(user: User) {
    const body: User = {
      UserName: user.UserName,
      Password: user.Password,
      Email: user.Email,
      FirstName: user.FirstName,
      LastName: user.LastName
    }
    var reqHeader = new HttpHeaders({'No-Auth':'True'});
    return this.http.post(this.rootUrl + '/register.php', body);
  }

  login(data) {
    this.data = data
    return this.http.post(this.rootUrl + '/login.php', data);
  }

  saveScore(data){
    return this.http.post(this.rootUrl + '/addScore.php', data);
  }

  private _url: string = "/assets/data/get.json";

  getScore(){
    return this.http.get(this.rootUrl + '/getScore.php');
    // return this.http.get(this._url);
  }


  getUserClaims() {
    return this.data
  }

}

