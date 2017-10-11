import {async, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {RecipeDetailComponent} from './recipe-detail.component';
import {RecipesModule} from '../recipes.module';
import {TestsModule} from '../../shared/modules/tests.module';
import {APP_CONFIG, AppConfig} from '../../config/app.config';
import {TranslateModule} from '@ngx-translate/core';
import {RecipeService} from '../shared/recipe.service';

describe('RecipeDetailComponent', () => {
  let fixture;
  let component;
  let recipeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot(),
        RecipesModule
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        RecipeService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeDetailComponent);
    component = fixture.debugElement.componentInstance;
    recipeService = TestBed.get(RecipeService);
  }));

  it('should create recipe detail component', (() => {
    expect(component).toBeTruthy();
  }));

  it('should like a recipe', async(() => {
    localStorage.setItem('votes', String(AppConfig.votesLimit - 1));
    component.like({id: 1}).then((result) => {
      expect(result).toBe(true);
    });
  }));
});
