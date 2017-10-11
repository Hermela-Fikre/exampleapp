import {Component} from '@angular/core';
import {LoggerService} from '../logger.service';
import {Recipe} from '../../recipes/shared/recipe.model';
import {FormControl} from '@angular/forms';
import {RecipeService} from '../../recipes/shared/recipe.service';
import {Router} from '@angular/router';
import {AppConfig} from '../../config/app.config';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: [
    LoggerService
  ]
})

export class SearchBarComponent {
  defaultRecipes: Array<Recipe> = [];
  recipeFormControl: FormControl;
  filteredRecipes: any;
  recipesAutocomplete: any;

  constructor(private recipeService: RecipeService,
              private router: Router) {
    this.recipeFormControl = new FormControl();

    this.recipeService.getAllRecipes().subscribe((recipes: Array<Recipe>) => {
      this.defaultRecipes = recipes.filter(recipe => recipe['default']);

      this.recipeFormControl.valueChanges
        .startWith(null)
        .map(value => this.filterRecipes(value))
        .subscribe(recipesFiltered => {
          this.filteredRecipes = recipesFiltered;
        });
    });
  }

  filterRecipes(val: string): Recipe[] {
    return val ? this.defaultRecipes.filter(recipe => recipe.name.toLowerCase().indexOf(val.toLowerCase()) === 0 && recipe['default'])
      : this.defaultRecipes;
  }

  searchRecipe(recipe: Recipe): Promise<boolean> {
    LoggerService.log('Moved to recipe with id: ' + recipe.id);
    return this.router.navigate([AppConfig.routes.recipes + '/' + recipe.id])
  }
}
