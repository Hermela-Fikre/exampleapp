import {EventEmitter, Injectable} from '@angular/core';
import {RecipeService} from '../../recipes/shared/recipe.service';

@Injectable()
export class ProgressBarService {
  public updateProgressBar$: EventEmitter<any>;

  private requestsRunning = 0;

  constructor(private recipeService: RecipeService) {
    this.updateProgressBar$ = new EventEmitter();

    this.recipeService.request$.subscribe((type: string) => {
      if (type === 'starting') {
        this.requestsRunning++;
        if (this.requestsRunning === 1) {
          this.updateProgressBar$.emit('query');
        }
      } else if (this.requestsRunning > 0) {
        this.requestsRunning--;
        if (this.requestsRunning === 0) {
          this.updateProgressBar$.emit('none');
        }
      }
    });
  }
}
