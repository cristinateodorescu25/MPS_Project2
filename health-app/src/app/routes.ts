import { Routes } from '@angular/router';
import { LobbyComponent, GameComponent } from './components';

export const appRoutes: Routes = [
    { path: '', component: LobbyComponent },
    { path: 'game', component: GameComponent },
];