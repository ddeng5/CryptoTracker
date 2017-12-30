import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details';
import { BitfinexServiceProvider } from "../../providers/bitfinex-service/bitfinex-service";
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Observable } from "rxjs";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  items: any;
  data: any;
  timer = 20000;
  mapOfUserData = new Map<string, Array<number>>();


  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public events: Events, public bitfinexServiceProvider: BitfinexServiceProvider, public localNotifications: LocalNotifications, private ngZone: NgZone, private ref: ChangeDetectorRef) {

    storage.get('tPairs').then((val) => {
      //do not organize data if data does not exist
      if (val != null) {
        console.log(val);
        this.items = val;
        this.organizeMap();

        this.ngZone.run(() => {
          let tempTimer = Observable.interval(this.timer).subscribe((val) => {
            this.requestData(this.mapOfUserData).then((map) => {
              console.log(map);
              this.checkLimits(map, this.items);
              console.log(this.items);
            })
          })
        });
      }
    });


    events.subscribe('updated-tPairs', (tPairs) => {
      this.items = [];
      for (let i=0; i<tPairs.length; i++) {
        this.items.push({
          tPair: tPairs[i].tPair,
          limit: tPairs[i].limit,
          tradingAbove: tPairs[i].tradingAbove,
          icon: tPairs[i].icon
        })
      }
      this.organizeMap();
    });

  }


  //map limit values to their respective trading pairs
  organizeMap() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.mapOfUserData.has(this.items[i].tPair)) {
        this.mapOfUserData.get(this.items[i].tPair).push(this.items[i].limit);
      }
      else {
        let array = new Array();
        array.push(this.items[i].limit);
        this.mapOfUserData.set(this.items[i].tPair, array);
      }

      this.storage.set('mapOfUserData', this.mapOfUserData);
    }
  }


  //call the bitfinex service to request the API
  load(tPair): Promise<any> {
        return new Promise(resolve => {
          this.bitfinexServiceProvider.load(tPair)
          .then(data => {
            resolve(data);
          });
      });
  }



  //compare the values requested from Bitfinex API with the user inputted values
  checkLimits(mapOfUserData, items) {
    let i = items.length;
      while(i--) {
        console.log(items);
        let rtVal = mapOfUserData.get(items[i].tPair + 'TradingPrice');
        if (rtVal > items[i].limit && items[i].tradingAbove == true) {
          console.log("alert, " + items[i].limit + "surpassed limit upwards");
          items.splice(i, 1);
          this.storage.set('tPairs', this.items)
        }
        else if (rtVal < items[i].limit && items[i].tradingAbove == false) {
          console.log("alert, " + items[i].limit + "dropped below limit price");
          items.splice(i, 1);
          this.storage.set('tPairs', this.items);
        }
      }
      console.log(this.items);
  }


  //obtain unique trading pairs to send to Bitfinex Service to request for data
  requestData(map): Promise<any>{
    return new Promise((resolve) => {
      for(let key of Array.from(map.keys()) ) {
        this.load(key).then(data => {
          console.log(data);
          let array = new Array();
          array.push(data);
          map.set(key + 'TradingPrice', array);
          resolve(map);
        })
      }
    })
  }



  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
}
