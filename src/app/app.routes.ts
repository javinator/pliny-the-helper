import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/recipes/recipes.page').then((m) => m.RecipesPage)
  },
  {
    path: 'recipes',
    redirectTo: ''
  },
  {
    path: 'new-recipe',
    loadComponent: () => import('./pages/new-recipe/new-recipe.page').then((m) => m.NewRecipePage)
  },
  {
    path: 'edit-recipe',
    loadComponent: () => import('./pages/edit-recipe/edit-recipe.page').then((m) => m.EditRecipePage)
  },
  {
    path: 'styles',
    loadComponent: () => import('./pages/styles/styles.page').then((m) => m.StylesPage)
  },
  {
    path: 'style-details',
    loadComponent: () => import('./pages/styles/details/details.page').then((m) => m.StyleDetailsPage)
  },
  {
    path: 'ingredients',
    loadComponent: () => import('./pages/ingredients/ingredients.page').then((m) => m.IngredientsPage)
  },
  {
    path: 'calculators',
    loadComponent: () => import('./pages/calculators/calculators.page').then((m) => m.CalculatorsPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then((m) => m.SettingsPage)
  },
  {
    path: 'waters',
    loadComponent: () => import('./pages/waters/waters.page').then((m) => m.WatersPage)
  }
];
