import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {RecipeRoutingModule} from './recipes-routing.module';
import {SharedModule} from '../shared/modules/shared.module';

import {RecipeListComponent, RemoveRecipeDialogComponent} from './recipe-list/recipe-list.component';
import {RecipeService} from './shared/recipe.service';
import {RecipeDetailComponent} from './recipe-detail/recipe-detail.component';
import {RecipesComponent} from './recipes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RecipeRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RemoveRecipeDialogComponent,
    RecipeDetailComponent
  ],
  entryComponents: [
    RemoveRecipeDialogComponent
  ],
  providers: [
    RecipeService
  ]
})

export class RecipesModule {
}
