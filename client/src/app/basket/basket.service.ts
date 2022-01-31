import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl
  //null is initial value
  private basketSource = new BehaviorSubject<IBasket>(null)
  //basket$ Observable
  basket$ = this.basketSource.asObservable()
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null)
  basketTotal$ = this.basketTotalSource.asObservable()

  constructor(private http: HttpClient) { }

  //return as observable not subscribing yet, subscribed at app comp ts
  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          // as the next value of BehaviorSubject we use next()
          this.basketSource.next(basket);
          //console.log(this.getCurrentBasketValue())
          this.calculateTotals()
        })
      )
  }

  //we are subscribing
  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe((response: IBasket) => {
      //this.basketSource.next(response); is the basket that will update the BehaviorSubject new value
      this.basketSource.next(response);
      //console.log(response)
      this.calculateTotals()
    }, error => {
      console.log(error);
    })
  }

  getCurrentBasketValue() {
    //returns the actual value
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    //mapping IProduct to IBasketItem
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    //make use of local storage of browser that is browser specific --> data persists only on same browser
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    // for the first time it is empty array
    const index = items.findIndex(i => i.id === itemToAdd.id);
    // -1 means item not found in items, so we add
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    // we are using function reduce (out a, in b), a= number.. the result we are returning from this reduce func
    //,b is the item b= item.price and item.quantity
    // and a initial value is 0..
    //for each item in list of items
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.basketTotalSource.next({shipping, total, subtotal});
  }

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    //returns boolean if it matches
    if (basket.items.some(x => x.id === item.id)) {
      //returns other items except the one that matches id
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
    })
  }

}
