import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreatePairComponent } from "./components/create-pair/create-pair.component";
import { WorkplacePageComponent } from "./components/drawing/workplace-page/workplace-page.component";
import { LeaderboardComponent } from "./components/leaderboard/leaderboard.component";
import { LoginComponent } from "./components/login/login.component";
import { MenuComponent } from "./components/menu/menu.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { SignupComponent } from "./components/signup/signup.component";
import { TutorialComponent } from "./components/tutorial/tutorial.component";
import { WaitingRoomComponent } from "./components/waiting-room/waiting-room.component";

const routes: Routes = [
  { path: "", component: LoginComponent },   
  { path: "signup", component: SignupComponent },
  { path: "menu", component: MenuComponent },
  { path: "profile", component: ProfileComponent },
  { path: "waiting", component: WaitingRoomComponent },
  { path: "workspace", component: WorkplacePageComponent },
  { path: "leaderboard", component: LeaderboardComponent },
  { path: "createpair", component: CreatePairComponent },
  { path: "settings", component: SettingsComponent },
  { path: "tutorial", component: TutorialComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const routingComponents = [
  // TODO ?
  LeaderboardComponent,
  SettingsComponent,
  WorkplacePageComponent,
  WaitingRoomComponent,
  TutorialComponent
];
