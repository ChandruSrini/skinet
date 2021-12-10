import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/Pagination';
import { IProductType } from '../shared/models/productype';
import { map } from "rxjs/operators";
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = "https://localhost:5001/api/"

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams){
    let params = new HttpParams()

    if(shopParams.brandId !== 0){
      params = params.append('brandId', shopParams.brandId.toString())
    }

    if(shopParams.typeId !== 0){
      params = params.append('typeId', shopParams.typeId.toString())
    }

    if(shopParams.search){
      params = params.append('search', shopParams.search)
    }

    // initially we are sorting by name
    params = params.append('sort', shopParams.sort)
    params = params.append('pageIndex', shopParams.pageNumber.toString())
    params = params.append('pageSize', shopParams.pageSize.toString())

    // to pass params to url {}
    return this.http.get<IPagination>(this.baseUrl + 'products?', {observe: 'response', params})
    .pipe(
      map(response => {
        return response.body
      })
    )
  }

  getBrands(){
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands')
  }

  getTypes(){
    return this.http.get<IProductType[]>(this.baseUrl + 'products/types')
  }

  // after section 9

  getProduct(id: number){
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id)
  }



}
