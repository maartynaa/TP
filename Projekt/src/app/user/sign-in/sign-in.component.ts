import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isLoginError : boolean = false;
  userName : string;
  constructor(private formBuilder : FormBuilder, private userService : UserService,private router : Router) { 
    this.userName
  }

  ngOnInit() {
  }


  OnSubmit(userName,password){
    const loginData = {
      username : userName,
      password: password

    }

    this.userService.login(loginData).subscribe((data : any)=>{
     if(data.token){
        this.userName = userName
        localStorage.setItem('token', data.token);
        this.router.navigate(['/home']);
        
      }
      else {
        this.isLoginError = true;
      }
    },
    (err : HttpErrorResponse)=>{
      this.isLoginError = true;
    });
 }

}