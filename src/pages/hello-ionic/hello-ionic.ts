import { Component, Output, EventEmitter } from '@angular/core';
import {BitfinexServiceProvider} from '../../providers/bitfinex-service/bitfinex-service';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html',
  providers: [BitfinexServiceProvider]
})
export class HelloIonicPage {
  constructor(private BitfinexService: BitfinexServiceProvider, public storage: Storage, public events: Events) {
  }

  public data: any;

  //timer for refreshing requests on bitfinex API
  public timer = 5000;
  //global variable to store user selected trading pair
  public tPair: string;
  //global list of tPairs;
  public tPairs: any;

  public limit: number;


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


  //should add code to check whether the added tPair already exists in our storage array
  changeTPair() {
    console.log(this.tPair);
    console.log(this.limit);
    /*
    this.BitfinexService.setTPair(this.tPair);

    //try to get trading pairs but will return an error if no previous pairing so catch error, set tPairs to empty array and add to that array
    this.storage.get('tPairs').then(val => {
      console.log("first");
      this.tPairs = val;
      this.tPairs.push(this.tPair);
      this.storage.set('tPairs', this.tPairs).then(() => {
        console.log(this.storage.get('tPairs'));
      });
      this.notifyMainPage(this.tPairs);
    }).catch(error => {
      console.log("Error was thrown because theres no initialized tPairs array");
      this.storage.set('tPairs', []).then(() => {
        this.storage.get('tPairs').then((val) => {
          this.tPairs = val;
          this.tPairs.push(this.tPair);
          this.storage.set('tPairs', this.tPairs).then(() => {
            console.log(this.storage.get('tPairs'));
          });
          this.notifyMainPage(this.tPairs);
        })
      });
    });
*/
  }

  notifyMainPage(tPairs) {
    this.events.publish('updated-tPairs', tPairs);
    console.log("wow");
    console.log(this.storage.get('tPairs'));
  }


  reset() {
    this.storage.clear().then(() => {
      console.log("Reset storage successful");
    });
  }
}
