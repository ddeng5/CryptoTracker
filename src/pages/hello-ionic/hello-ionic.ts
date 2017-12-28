import { Component, Output, EventEmitter } from '@angular/core';
import {BitfinexServiceProvider} from '../../providers/bitfinex-service/bitfinex-service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html',
  providers: [BitfinexServiceProvider]
})
export class HelloIonicPage {
  constructor(private BitfinexService: BitfinexServiceProvider, public storage: Storage) {
  }

  public data: any;

  //timer for refreshing requests on bitfinex API
  public timer = 5000;

  //global variable to store user selected trading pair
  public tPair: string;

  //global list of tPairs;
  public tPairs: any;

  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  load() {
    try {
      setInterval(() => {
        this.BitfinexService.load()
          .then(data => {
            this.data = data;
          });
      }, this.timer);
    }
    catch(e) {
      throw e;
    }
  }


  changeTPair() {
    this.BitfinexService.setTPair(this.tPair);

    try {
      this.storage.get('tPairs').then(val => {
        this.tPairs = val;
        this.tPairs.push(this.tPair);
        this.storage.set('tPairs', this.tPairs).then(() => {
          console.log(this.storage.get('tPairs'));
        });
        this.notifyMainPage();
      })
    }
    catch(e) {
      this.storage.set('tPairs', []);
      this.storage.get('tPairs').then(val => {
        this.tPairs = val;
        this.tPairs.push(this.tPair);
        this.storage.set('tPairs', this.tPairs).then(() => {
          console.log(this.storage.get('tPairs'));
        });
        this.notifyMainPage();
      })
    }

  }

  notifyMainPage() {
    this.notifyParent.emit(true);
    console.log("wow");
    console.log(this.storage.get('tPairs'));
  }
}
