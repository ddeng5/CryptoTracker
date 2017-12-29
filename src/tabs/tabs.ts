import { Component } from '@angular/core';

/*
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
*/
import { ListPage } from '../pages/list/list';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ContactPage } from '../pages/contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ListPage;
  tab2Root = HelloIonicPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
