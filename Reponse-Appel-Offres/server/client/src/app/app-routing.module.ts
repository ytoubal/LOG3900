import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessageListComponent } from './components/chatbox/message-list/message-list.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "chat", component: MessageListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
