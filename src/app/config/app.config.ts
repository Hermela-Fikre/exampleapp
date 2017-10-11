import {OpaqueToken} from '@angular/core';

import {IAppConfig} from './iapp.config';

export let APP_CONFIG = new OpaqueToken('app.config');

export const AppConfig: IAppConfig = {
  routes: {
    recipes: 'recipes'
  },
  endpoints: {
    recipes: 'https://nodejs-example-app.recipekuapp.com/recipes'
  },
  votesLimit: 3,
  topRecipesLimit: 4,
  snackBarDuration: 3000,
}
