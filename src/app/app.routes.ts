import {Routes} from '@angular/router';
import {RecipesPage} from "./pages/recipes/recipes.page";
import {SettingsPage} from "./pages/settings/settings.page";
import {CalculatorsPage} from "./pages/calculators/calculators.page";
import {IngredientsPage} from "./pages/ingredients/ingredients.page";
import {StylesPage} from "./pages/styles/styles.page";

export const routes: Routes = [
  {
    path: '',
    component: RecipesPage
  },
  {
    path: 'recipes',
    redirectTo: ''
  },
  {
    path: 'new-recipe',
    loadComponent: () => import('./pages/recipes/new-recipe.page').then((m) => m.NewRecipePage)
  },
  {
    path: 'edit-recipe/:uid',
    loadComponent: () => import('./pages/edit-recipe/edit-recipe.page').then((m) => m.EditRecipePage)
  },
  {
    path: 'styles',
    component: StylesPage
  },
  {
    path: 'styles/details',
    loadComponent: () => import('./pages/styles/style-details.page').then((m) => m.StyleDetailsPage)
  },
  {
    path: 'ingredients',
    component: IngredientsPage
  },
  {
    path: 'calculators',
    component: CalculatorsPage
  },
  {
    path: 'settings',
    component: SettingsPage
  },
  {
    path: 'waters',
    loadComponent: () => import('./pages/waters/waters.page').then((m) => m.WatersPage)
  }
];
