import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'recipes',
    loadComponent: () => import('./pages/recipes/recipes.page').then((m) => m.RecipesPage),
  },
  {
    path: 'new-recipe',
    loadComponent: () => import('./pages/new-recipe/new-recipe.page').then((m) => m.NewRecipePage),
  },
  {
    path: 'edit-recipe',
    loadComponent: () => import('./pages/edit-recipe/edit-recipe.page').then((m) => m.EditRecipePage),
  },
  {
    path: 'styles',
    loadComponent: () => import('./pages/styles/styles.page').then((m) => m.StylesPage),
  },
  {
    path: 'style-details',
    loadComponent: () => import('./pages/styles/details/details.page').then((m) => m.StyleDetailsPage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  }
];
