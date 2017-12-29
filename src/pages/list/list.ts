import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ItemDetailsPage } from '../item-details/item-details';
import { BitfinexServiceProvider } from "../../providers/bitfinex-service/bitfinex-service";
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  items: any;
  data: any;
  timer: number = 10000;
  mapOfUserData = new Map<string, Array<number>>();


  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public events: Events, public bitfinexServiceProvider: BitfinexServiceProvider, public localNotifications: LocalNotifications) {

    storage.get('tPairs').then((val) => {
      //dont not organize data if data does not exist
      if (val != null) {
        this.items = val;
        console.log(this.items);
        this.organizeMap();

        //this.load();
        console.log(this.mapOfUserData);
        this.requestData(this.mapOfUserData);
      }
    });


    events.subscribe('updated-tPairs', (tPairs) => {
      console.log(tPairs[0].tPair);
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
      this.requestData(this.mapOfUserData);
      console.log(this.mapOfUserData);
      console.log(storage.get('tPairs'));
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
  checkLimits() {

  }


  //obtain unique trading pairs to send to Bitfinex Service to request for data
  requestData(map) {
    console.log(map.keys());
    for(let key of Array.from(map.keys()) ) {
      this.load(key).then(data => {
        console.log(data);
        map.set(key + 'TradingPrice', data);
        console.log(map);
      })
    }
  }



  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
}
