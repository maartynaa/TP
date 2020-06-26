import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { RankingComponent } from './ranking/ranking.component';
import { HelpComponent } from './help/help.component';


export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'help', component: HelpComponent },
    { path: 'game', component: GameComponent },
    { path: 'ranking', component: RankingComponent},
    {
        path: 'signup', component: UserComponent,
        children: [{ path: '', component: SignUpComponent }]
    },
    {
        path: 'login', component: UserComponent,
        children: [{ path: '', component: SignInComponent }]
    },
    { path : '', redirectTo:'/login', pathMatch : 'full'}
    
];