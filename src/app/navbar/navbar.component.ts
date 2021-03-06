import { LoginComponent } from '../components/login/login.component';
import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { CurrentUserService } from '../services/current-user.service';
import { LoginAttempt } from '../models/login-attempt';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent{

  //currentUser!: CurrentUserService;
  currentUser!: User;

  constructor(private user: CurrentUserService, private router:Router) { }

  submitInfo(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.updateNavbarUser();
  }

  updateNavbarUser(): void {
    this.currentUser = this.user.giveCurrentUser();
    console.log("updated current user info");
  }

  revealCurrentUser():void {
    console.log(this.currentUser);
  }

  userLoggedIn():boolean {
    if (this.user.currentUser.userId == 0) return false;
    return true;
  }

  logOut():void {
    this.user.logoutUser().subscribe(
      (response:number) => {
        if (response == 0) alert("successfully logged out.")

        //redirect to the main page if not there already
        this.router.navigateByUrl("");
      }
    )
  }

}
