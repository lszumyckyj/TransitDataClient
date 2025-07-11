import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./components/station-list-component/station-list-component').then(m => m.StationListComponent)
  },
  // Default Route
  {
    path: '**',
    redirectTo: ''
  }
];
