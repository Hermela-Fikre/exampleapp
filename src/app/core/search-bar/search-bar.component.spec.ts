import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {recipeService} from '../../recipes/shared/recipe.service';
import {SearchBarComponent} from './search-bar.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {APP_CONFIG, AppConfig} from '../../config/app.config';
import {AppRoutingModule} from '../../app-routing.module';
import {RecipeTopComponent} from '../../recipes/recipe-top/recipe-top.component';
import {APP_BASE_HREF} from '@angular/common';
import {TestsModule} from '../../shared/modules/tests.module';

describe('SearchBarComponent', () => {
  let fixture;
  let component;
  let recipeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot(),
        AppRoutingModule
      ],
      declarations: [
        SearchBarComponent,
        RecipeTopComponent
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        {provide: APP_BASE_HREF, useValue: '/'},
        recipeService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.debugElement.componentInstance;
    recipeService = TestBed.get(recipeService);
  }));

  it('should create recipe search component', (() => {
    expect(component).toBeTruthy();
  }));

  it('should get all recipes', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(recipeService, 'getAllRecipes').and.returnValue(Promise.resolve(true));
    tick();
    fixture.detectChanges();
    expect(component.defaultRecipes.length).toBeGreaterThan(0);
    for (let recipe of component.defaultRecipes) {
      expect(recipe.default).toBe(true);
    }
  }));

  it('should filter recipes array', (() => {
    component.defaultRecipes = [
      {
        'id': 1,
        'name': 'batman',
        'default': true
      },
      {
        'id': 2,
        'name': 'spiderman',
        'default': false
      }
    ];
    expect(component.filterRecipes('batman').length).toBe(1);
    expect(component.filterRecipes('spiderman').length).toBe(0);
    expect(component.filterRecipes().length).toBe(2);
  }));

  it('should search for a recipe', async(() => {
    component.searchRecipe({id: 1}).then((redirection) => {
      expect(redirection).toBe(true);
    });
  }));
});
