import {Component} from '@angular/core';

import {Recipe} from '../shared/recipe.model';

import {RecipeService} from '../shared/recipe.service';
import {AppConfig} from '../../config/app.config';

@Component({
  selector: 'app-recipe-top',
  templateUrl: './recipe-top.component.html',
  styleUrls: ['./recipe-top.component.scss']
})
export class RecipeTopComponent {

  recipes: Recipe[] = null;
  canVote = false;

  constructor(private recipeService: RecipeService) {
    this.canVote = this.recipeService.checkIfUserCanVote();

    this.recipeService.getAllRecipes().subscribe((recipes) => {
      this.recipes = recipes.sort((a, b) => {
        return b.likes - a.likes;
      }).slice(0, AppConfig.topRecipesLimit);
    });
  }

  like(recipe: Recipe): Promise<any> {
    return new Promise((resolve, reject) => {
      this.recipeService.like(recipe).subscribe(() => {
        this.canVote = this.recipeService.checkIfUserCanVote();
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
  }
}
