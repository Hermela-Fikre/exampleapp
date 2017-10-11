import {Component, ViewChild} from '@angular/core';
import {Recipe} from '../shared/recipe.model';
import {RecipeService} from '../shared/recipe.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdDialog} from '@angular/material';
import {AppConfig} from '../../config/app.config';
import {Router} from '@angular/router';
import {LoggerService} from '../../core/logger.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})

export class RecipeListComponent {
  recipes: Recipe[];
  newRecipeForm: FormGroup;
  canVote = false;
  error: string;
  @ViewChild('form') myNgForm; // just to call resetForm method

  constructor(private recipeService: RecipeService,
              private dialog: MdDialog,
              private router: Router,
              private formBuilder: FormBuilder) {
    this.canVote = this.recipeService.checkIfUserCanVote();

    this.newRecipeForm = this.formBuilder.group({
      'name': ['', [Validators.required]],
      'alterEgo': ['', [Validators.required]]
    });

    this.recipeService.getAllRecipes().subscribe((recipes: Array<Recipe>) => {
      this.recipes = recipes.sort((a, b) => {
        return b.likes - a.likes;
      });
    });
  }

  like(recipe: Recipe) {
    this.recipeService.like(recipe).subscribe(() => {
      this.canVote = this.recipeService.checkIfUserCanVote();
    }, (error: Response) => {
      LoggerService.error('maximum votes limit reached', error);
    });
  }

  createNewRecipe(newRecipe: Recipe) {
    this.recipeService.createRecipe(newRecipe).subscribe((newRecipeWithId) => {
      this.recipes.push(newRecipeWithId);
      this.myNgForm.resetForm();
    }, (response: Response) => {
      if (response.status === 500) {
        this.error = 'errorHasOcurred';
      }
    });
  }

  seeRecipeDetails(recipe): void {
    if (recipe.default) {
      this.router.navigate([AppConfig.routes.recipes + '/' + recipe.id]);
    }
  }

  remove(recipeToRemove: Recipe): void {
    let dialogRef = this.dialog.open(RemoveRecipeDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recipeService.deleteRecipeById(recipeToRemove.id).subscribe(() => {
          this.recipeService.showSnackBar('recipeRemoved');
          this.recipes = this.recipes.filter(recipe => recipe.id !== recipeToRemove.id);
        }, (response: Response) => {
          if (response.status === 500) {
            this.error = 'recipeDefault';
          }
        });
      }
    });
  }
}

@Component({
  selector: 'app-remove-recipe-dialog',
  templateUrl: './remove-recipe.dialog.html',
})

export class RemoveRecipeDialogComponent {
  constructor() {
  }
}
