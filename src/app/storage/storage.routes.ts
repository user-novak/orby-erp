import { Routes } from '@angular/router';
import { Storage } from './storage';
import { StorageIndex } from './storage-index/storage-index';

export const STORAGE_ROUTES: Routes = [
    {
        path: '',
        component: Storage,
        children: [
        {
            path: '',
            component: StorageIndex,
        }    
        ]
    }
]