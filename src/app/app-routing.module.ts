import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { RegisterComponent } from './components/register/register.component';
import { TestComponent } from './components/test/test.component';
import { GameModeComponent } from './components/game-mode/game-mode.component';
import { PracticeModeComponent } from './components/practice-mode/practice-mode.component';
import { SinglePlayerComponent } from './components/single-player/single-player.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { QmasterComponent } from './components/qmaster/qmaster.component';

const routes: Routes = [{
  path:"",
  component:MainPageComponent
}, {
  path:"login",
  component:LoginComponent
}, {
  path:"register",
  component:RegisterComponent
}, {
  path:"main-game",
  component:TestComponent
}, {
  path:"game-mode",
  component:GameModeComponent
}, {
  path:"practice-mode",
  component:PracticeModeComponent
}, {
  path:"single-player", 
  component:SinglePlayerComponent
},{
  path:"update-user",
  component:UpdateUserComponent
},{
  path:"statistics",
  component:StatisticsComponent
}, {
  path:"qmaster",
  component:QmasterComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
