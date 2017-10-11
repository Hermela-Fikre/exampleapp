import {Component} from '@angular/core';
import {Recipe} from '../shared/recipe.model';
import {RecipeService} from '../shared/recipe.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})

export class RecipeDetailComponent {
  recipe: Recipe;
  canVote: boolean;

  constructor(private recipeService: RecipeService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params: any) => {
      if (params['id']) {
        this.recipeService.getRecipeById(params['id']).subscribe((recipe: Recipe) => {
          this.recipe = recipe;
        });
      }
    });
  }

  like(recipe: Recipe) {
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
