import {TestBed} from '@angular/core/testing';
import {ProgressBarService} from './progress-bar.service';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import {RecipeService} from '../../recipes/shared/recipe.service';
import {TestsModule} from '../modules/tests.module';
import {TranslateModule} from '@ngx-translate/core';
import {APP_CONFIG, AppConfig} from '../../config/app.config';

describe('ProgressBarService', () => {
  let progressBarService;
  let recipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {provide: APP_CONFIG, useValue: AppConfig},
        ProgressBarService,
        RecipeService
      ]
    });

    progressBarService = TestBed.get(ProgressBarService);
    recipeService = TestBed.get(RecipeService);
  });

  it('should not be requestsRunning', (() => {
    const instance = new ProgressBarService(recipeService);
    expect(instance).toBeTruthy();
  }));

  it('should not be requestsRunning', (() => {
    expect(progressBarService.requestsRunning).toBe(0);
  }));

  it('should increase and decrease the counter of requests running', (() => {
    recipeService.request$.emit('starting');
    recipeService.request$.emit('starting');
    expect(progressBarService.requestsRunning).toBe(2);
    recipeService.request$.emit('finished');
    expect(progressBarService.requestsRunning).toBe(1);
    recipeService.request$.emit('finished');
    expect(progressBarService.requestsRunning).toBe(0);
    recipeService.request$.emit('finished');
    expect(progressBarService.requestsRunning).toBe(0);
  }));
});
