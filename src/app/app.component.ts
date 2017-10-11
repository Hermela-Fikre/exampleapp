import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Meta, Title} from '@angular/platform-browser';

import {NavigationEnd, Router} from '@angular/router';
import {AppConfig} from './config/app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {

  constructor(private translateService: TranslateService,
              private title: Title,
              private meta: Meta,
              private router: Router) {

    this.translateService = translateService;
    this.translateService.setDefaultLang('en');                 
    this.translateService.use('en');

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        switch (event.urlAfterRedirects) {
          case '/':
            this.title.setTitle('Angular  App');
            this.meta.updateTag({
              name: 'description',
              content: 'Angular 4'
            });
            break;
          case '/' + AppConfig.routes.recipes:
            this.title.setTitle('Recipes list');
            this.meta.updateTag({
              name: 'description',
              content: 'List of Recipes'
            });
            break;
        }
      }
    });
  }
}
