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
  icons: string[];
  items: any;
  data: any;
  timer: number = 5000;
  mapOfUserData = new Map<string, Set<number>>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public events: Events, public bitfinexServiceProvider: BitfinexServiceProvider, public localNotifications: LocalNotifications) {

    storage.get('tPairs').then((val) => {
      this.items = val;
      this.organizeMap();
    });


    events.subscribe('updated-tPairs', (tPairs) => {
      console.log(tPairs[0].tPair);
      this.items = [];
      for (let i=0; i<tPairs.length; i++) {
        this.items.push({
          tPair: tPairs[i].tPair,
          limit: tPairs[i].limit,
          tradingAbove: tPairs[i].tradingAbove
        })
      }
      this.organizeMap();
      console.log(this.mapOfUserData);
    });





    /*
     this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

     this.items = [];

    for(let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
    */

    //this.load();


  }

  //map limit values to their respective trading pairs
  organizeMap(){
    for (let i = 0; i < this.items.length; i++) {
      if (this.mapOfUserData.has(this.items[i].tPair)) {
        this.mapOfUserData.get(this.items[i].tPair).add(this.items[i].limit);
      }
      else {
        let set = new Set()
        set.add(this.items[i].limit);
        this.mapOfUserData.set(this.items[i].tPair, set);
      }
    }
    this.storage.set('mapOfUserData', this.mapOfUserData);
  }


  //call the bitfinex service to request the API
  load(tPair) {
    try {
      setInterval(() => {
        this.bitfinexServiceProvider.load(tPair)
          .then(data => {
            this.data = data;
          });
      }, this.timer);
    }
    catch(e) {
      throw e;
    }
  }


  //compare the values requested from Bitfinex API with the user inputted values
  checkLimits() {

  }



  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
}
