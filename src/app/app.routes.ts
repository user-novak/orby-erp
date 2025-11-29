import { Routes } from '@angular/router';
import { Biller } from './biller/biller';
import { Home } from './home/home';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'biller',
        component: Biller
    }
];
