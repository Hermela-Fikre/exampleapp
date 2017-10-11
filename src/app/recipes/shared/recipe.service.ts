import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {AppConfig} from '../../config/app.config';

import {Recipe} from './recipe.model';
import {Observable} from 'rxjs/Observable';
import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {LoggerService} from '../../core/logger.service';

@Injectable()
export class RecipeService {
  request$: EventEmitter<any>;

  private headers: HttpHeaders;
  private recipesUrl: string;
  private translations: any;

  private handleError(error: any) {
    this.request$.emit('finished');
    if (error instanceof Response) {
      return Observable.throw(error.json()['error'] || 'backend server error');
    }
    return Observable.throw(error || 'backend server error');
  }

  constructor(private http: HttpClient,
              private translateService: TranslateService,
              private snackBar: MdSnackBar) {
    this.request$ = new EventEmitter();

    this.recipesUrl = AppConfig.endpoints.recipes;
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.translateService.get(['recipeCreated', 'saved', 'recipeLikeMaximum', 'recipeRemoved'], {
      'value': AppConfig.votesLimit
    }).subscribe((texts) => {
      this.translations = texts;
    });
  }

  getAllRecipes(): Observable<Recipe[]> {
    this.request$.emit('starting');
    return this.http.get(this.recipesUrl)
      .map(response => {
        this.request$.emit('finished');
        return response;
      })
      .catch(error => this.handleError(error));
  }

  getRecipeById(recipeId: string): Observable<Recipe> {
    this.request$.emit('starting');
    return this.http.get(this.recipesUrl + '/' + recipeId)
      .map(response => {
        this.request$.emit('finished');
        return response;
      })
      .catch(error => this.handleError(error));
  }

  createRecipe(recipe: any): Observable<Recipe> {
    this.request$.emit('starting');
    return this.http
      .post(this.recipesUrl, JSON.stringify({
        name: recipe.name,
        alterEgo: recipe.alterEgo
      }), {headers: this.headers})
      .map(response => {
        this.request$.emit('finished');
        this.showSnackBar('recipeCreated');
        return response;
      })
      .catch(error => this.handleError(error));
  }

  like(recipe: Recipe) {
    if (this.checkIfUserCanVote()) {
      this.request$.emit('starting');
      const url = `${this.recipesUrl}/${recipe.id}/like`;
      return this.http
        .post(url, {}, {headers: this.headers})
        .map((response) => {
          this.request$.emit('finished');
          localStorage.setItem('votes', '' + (Number(localStorage.getItem('votes')) + 1));
          recipe.likes += 1;
          this.showSnackBar('saved');
          return response;
        })
        .catch(error => this.handleError(error));
    } else {
      this.showSnackBar('recipeLikeMaximum');
      return Observable.throw('maximum votes');
    }
  }

  checkIfUserCanVote(): boolean {
    return Number(localStorage.getItem('votes')) < AppConfig.votesLimit;
  }

  deleteRecipeById(id: any): Observable<Array<Recipe>> {
    this.request$.emit('starting');
    const url = `${this.recipesUrl}/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .map((response) => {
        this.request$.emit('finished');
        this.showSnackBar('recipeRemoved');
        return response;
      })
      .catch(error => this.handleError(error));
  }

  showSnackBar(name): void {
    const config: any = new MdSnackBarConfig();
    config.duration = AppConfig.snackBarDuration;
    this.snackBar.open(this.translations[name], 'OK', config);
  }
}
