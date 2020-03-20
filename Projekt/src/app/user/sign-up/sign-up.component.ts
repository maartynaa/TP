import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService, ToastrModule } from 'ngx-toastr'
import { User } from '../../shared/user.model';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  user: User;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  isRegisterError : boolean = false;
  isRegisterSuccess: boolean = false;

  constructor(private userService: UserService, private toastr: ToastrService, private router : Router) { }

  ngOnInit() {
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.user = {
      UserName: '',
      Password: '',
      Email: '',
      FirstName: '',
      LastName: ''
    }
  }

  OnSubmit(form: NgForm) {
    this.userService.registerUser(form.value).subscribe((data: any) => {
        if (data.Succeeded == true) {
          this.resetForm(form);
          this.isRegisterSuccess = true;
        }
        else {
          this.isRegisterError = true;
        }
          
      });
  }

}