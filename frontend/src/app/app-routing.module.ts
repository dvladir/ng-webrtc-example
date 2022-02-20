import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/pages/login/login.component';
import {UserListComponent} from './components/pages/user-list/user-list.component';
import {NameEmptyGuard} from './services/name-empty.guard';
import {HasNameGuard} from './services/has-name.guard';
import {ChatPageComponent} from './components/pages/chat-page/chat-page.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [
      NameEmptyGuard
    ],
    component: LoginComponent
  },
  {
    path: 'users',
    canActivate: [
      HasNameGuard
    ],
    component: UserListComponent,
  },
  {
    path: 'chat',
    component: ChatPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
