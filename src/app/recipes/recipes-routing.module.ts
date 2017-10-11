import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RecipeListComponent} from './recipe-list/recipe-list.component';
import {RecipeDetailComponent} from './recipe-detail/recipe-detail.component';
import {RecipesComponent} from './recipes.component';

const recipesRoutes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    children: [
      {path: '', component: RecipeListComponent},
      {path: ':id', component: RecipeDetailComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(recipesRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class RecipeRoutingModule {
}
