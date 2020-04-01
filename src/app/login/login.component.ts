import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../service/login.service';
import {Router} from '@angular/router';
import {OverlayService } from '../service/overlay.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email:string;
  password:string;
  submitted = false;
  loginForm: FormGroup;
  ErrorMessage: string;
  showerror: boolean;
  FPErrorMessage: string;
  constructor(private api: AuthenticationService, private router: Router,private _overlay: OverlayService,private formBuilder: FormBuilder) { }

  AuthenticateLogin() {   
    this._overlay.activateOverlay(true,'sk-circle');
    this.api.login(
      this.email,
      this.password
    )
      .subscribe(
        r => {          
          if (r.Token) {
            this.ErrorMessage = "";
            this.showerror = false;
            this.router.navigateByUrl('/Dashboard');
            if(r){   
              setTimeout(() => {
                this._overlay.activateOverlay(false,'');
                },500);
            }
          }
        },
        error => { 
          if(error.status == 401){
            this.ErrorMessage = "Invalid Username or Password";
            this.showerror = true;
            setTimeout(() => {
              this._overlay.activateOverlay(false,'');
              },500);
          }
        });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
  });
  }
  
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
    }
    ForgotPassword(email:string){
    
      
      //this.delCloseBtn.nativeElement.click();
    }
}