import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RecipeTopComponent} from './recipes/recipe-top/recipe-top.component';
import {AppConfig} from './config/app.config';

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '', component: RecipeTopComponent},
  {path: AppConfig.routes.recipes, loadChildren: './recipes/recipes.module#RecipesModule'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}
