import {async, TestBed} from '@angular/core/testing';
import {RecipeService} from './recipe.service';
import {APP_BASE_HREF} from '@angular/common';
import {APP_CONFIG, AppConfig} from '../../config/app.config';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import {TestsModule} from '../../shared/modules/tests.module';
import {TranslateModule} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

describe('RecipeService', () => {
  let recipeService;
  let newRecipeCreated;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        RecipeService
      ]
    });

    recipeService = TestBed.get(RecipeService);
  });

  it('should contains recipes', async(() => {
    recipeService.getAllRecipes().subscribe((data: any) => {
      expect(data.length).toBeGreaterThan(AppConfig.topRecipesLimit);
    });
  }));

  it('should get recipe by id 1', async(() => {
    recipeService.getRecipeById('1').subscribe((recipe) => {
      expect(recipe.id).toEqual(1);
    });
  }));

  it('should fail getting recipe by no id', async(() => {
    recipeService.getRecipeById('noId').subscribe(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

  it('should fail creating empty recipe', async(() => {
    recipeService.createRecipe({}).subscribe(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

  it('should fail deleting noId recipe', async(() => {
    recipeService.deleteRecipeById('noId').subscribe(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

  it('should fail like empty recipe', async(() => {
    localStorage.setItem('votes', String(0));
    recipeService.like('noId').subscribe(() => {
    }, (error) => {
      expect(error).toEqual(jasmine.any(HttpErrorResponse));
    });
  }));

  it('should return json response error', async(() => {
    expect(recipeService.handleError(new Response('noId'))).toEqual(jasmine.any(ErrorObservable));
  }));

  it('should create recipe', async(() => {
    recipeService.createRecipe({
      'name': 'test',
      'alterEgo': 'test'
    }).subscribe((recipe) => {
      newRecipeCreated = recipe;
      expect(recipe.id).not.toBeNull();
    });
  }));

  it('should not like a recipe because no votes', async(() => {
    localStorage.setItem('votes', String(AppConfig.votesLimit));
    expect(recipeService.checkIfUserCanVote()).toBe(false);
    recipeService.like(newRecipeCreated).subscribe(() => {
    }, (error) => {
      expect(error).toBe('maximum votes');
    });
  }));

  it('should like a recipe', async(() => {
    localStorage.setItem('votes', String(0));
    expect(recipeService.checkIfUserCanVote()).toBe(true);
    recipeService.like(newRecipeCreated).subscribe((response) => {
      expect(response).toEqual({});
    });
  }));

  it('should delete a recipe', async(() => {
    recipeService.deleteRecipeById(newHRecipeCreated.id).subscribe((response) => {
      expect(response).toEqual({});
    });
  }));
});
