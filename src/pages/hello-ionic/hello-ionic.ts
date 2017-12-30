import { Component, Output, EventEmitter } from '@angular/core';
import {BitfinexServiceProvider} from '../../providers/bitfinex-service/bitfinex-service';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { dataObject } from './dataObjectInterface';
import { LocalNotifications } from "@ionic-native/local-notifications";

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html',
  providers: [BitfinexServiceProvider]
})

export class HelloIonicPage {

  //global variable to store user selected trading pair
  public tPair: string;
  //global list of tPairs;
  public tPairs: Array<dataObject>;

  public limit: number;

  public tradingAbove: boolean;

  dataObject: dataObject = {};



  constructor(private BitfinexService: BitfinexServiceProvider, public storage: Storage, public events: Events, public localNotifications: LocalNotifications) {
    this.tradingAbove = false;
  }

  //should add code to check whether the added tPair already exists in our storage array
  changeTPair() {
    this.createObject(this.tPair, this.limit, this.tradingAbove);

    //this.BitfinexService.setTPair(this.tPair);

    //try to get trading pairs but will return an error if no previous pairing so catch error, set tPairs to empty array and add to that array
    this.storage.get('tPairs').then(val => {
      this.tPairs = val;
      this.tPairs.push(this.dataObject);
      this.storage.set('tPairs', this.tPairs).then(() => {
        console.log(this.storage.get('tPairs'));
      });
      this.notifyMainPage(this.tPairs);
    }).catch(error => {
      console.log("Error was thrown because theres no initialized tPairs array");
      this.storage.set('tPairs', []).then(() => {
        this.storage.get('tPairs').then((val) => {
          this.tPairs = val;
          this.tPairs.push(this.dataObject);
          this.storage.set('tPairs', this.tPairs).then(() => {
            console.log(this.storage.get('tPairs'));
          });
          this.notifyMainPage(this.tPairs);
        })
      });
    });
  }

  createObject(tPair, limit, tradingAbove) {
    this.dataObject.tPair = tPair;
    this.dataObject.limit = limit;
    this.dataObject.tradingAbove = tradingAbove;

    //add logic to assign crypto icons
    if (tPair == 'tBTCUSD') {
      this.dataObject.icon = '../../assets/icon/Coins/btc.png';
    }
    else if (tPair == 'tETHUSD') {
      this.dataObject.icon = '../../assets/icon/Coins/eth.png';
    }
    else if (tPair == 'tDATUSD') {
      this.dataObject.icon = '../../assets/icon/Coins/data.png';
    }
    else if (tPair == 'tEOSUSD') {
      this.dataObject.icon = '../../assets/icon/Coins/eos.png';
    }
    else if (tPair == 'tLTCUSD') {
      this.dataObject.icon = '../../assets/icon/Coins/ltc.png';
    }
    else if (tPair == 'tIOTUSD') {
      this.dataObject.icon = '../../assets/icon/Coins/miota.png';
    }
    else if (tPair == 'tXRPUSD') {
      this.dataObject.icon = '../../assets/icon/Coins/xrp.png';
    }
    else {
      this.dataObject.icon = '../../assets/icon/Coins/btc.png';
    }
    console.log(this.dataObject);

    return this.dataObject;
  }

  notifyMainPage(tPairs) {
    this.events.publish('updated-tPairs', tPairs);
  }


  reset() {
    this.storage.clear().then(() => {
      console.log("Reset storage successful");
    });
  }
}
