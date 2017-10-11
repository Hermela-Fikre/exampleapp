import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
import {RecipeTopComponent} from './recipe-top.component';
import {RecipeService} from '../shared/recipe.service';
import {TestsModule} from '../../shared/modules/tests.module';
import {TranslateModule} from '@ngx-translate/core';
import {APP_CONFIG, AppConfig} from '../../config/app.config';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('RecipeTopComponent', () => {
  let fixture;
  let component;
  let recipeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        RecipeTopComponent
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        RecipeService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeTopComponent);
    component = fixture.debugElement.componentInstance;
    recipeService = TestBed.get(RecipeService);
  }));

  it('should create recipe top component', (() => {
    expect(component).toBeTruthy();
  }));

  it('should initialice component', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(recipeService, 'getAllRecipes').and.returnValue(Promise.resolve(true));
    tick();
    fixture.detectChanges();
    expect(component.recipes.length).toBe(AppConfig.topRecipesLimit);
  }));

  it('should like a recipe', async(() => {
    localStorage.setItem('votes', String(AppConfig.votesLimit - 1));
    component.like({id: 1}).then((result) => {
      expect(result).toBe(true);
    });
  }));

  it('should not like a recipe', async(() => {
    localStorage.setItem('votes', String(AppConfig.votesLimit));
    component.like({id: 1}).then(() => {
    }, (error) => {
      expect(error).toBe('maximum votes');
    });
    expect(recipeService.checkIfUserCanVote()).toBe(false);
  }));
});
