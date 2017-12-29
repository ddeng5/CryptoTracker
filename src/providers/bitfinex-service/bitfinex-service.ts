import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Response } from '@angular/http';

@Injectable()
export class BitfinexServiceProvider {

  public data: any;
  url = "https://api.bitfinex.com/v2/ticker/";
  //public tPair: string = 'tBTCUSD';

  constructor(public http: Http) {
    console.log('Hello BitfinexServiceProvider Provider');
    console.log(this.load('tBTCUSD').then(data =>{
      console.log(data);
    }));
  }

  // setTPair(tPair) {
  //   this.tPair = tPair;
  // }

  load(tPair) {
    // if (this.data) {
    //   // already loaded data
    //   return Promise.resolve(this.data);
    // }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get(this.url + tPair)
        .map((res: Response) => res.json())
        .subscribe(data => {
          //data[6] gets the last traded price
          this.data = data[6];
          resolve(this.data);
        });
    }).catch(function(e) {
      console.log("Here is an error");
      throw e;
    });
  }

}
