import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/productype';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  products: IProduct[]
  brands: IBrand[]
  types: IProductType[]
  shopParams = new ShopParams()
  sortOptions =[
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Low', value: 'priceDesc'},
  ]
  totalCount: number

  //to access the input search text #search placeholder="Search"
  //V132 due to loading spinner
  @ViewChild('search', {static: false}) searchTerm: ElementRef

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
   this.getProducts()
   this.getBrands()
   this.getTypes()
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe(response =>{
      this.products = response.data
      this.shopParams.pageNumber = response.pageIndex
      this.shopParams.pageSize = response.pageSize
      this.totalCount = response.count
    }, error =>{
      console.log(error)
    })
  }

  getBrands(){
    this.shopService.getBrands().subscribe(response =>{
      //initial value set 0 and 'ALL' along with other Brands using ...response
      this.brands = [{id:0, name: 'All'}, ...response]
    }, error =>{
      console.log(error)
    })
  }

  getTypes(){
    this.shopService.getTypes().subscribe(response =>{
      this.types = [{id:0, name: 'All'}, ...response]
    }, error =>{
      console.log(error)
    })
  }

  onBrandSelected(brandId: number){
    this.shopParams.brandId = brandId
    //an error will occur moving from page 2 to 1 beacuse of filter applied. to tackle it. V105
    this.shopParams.pageNumber = 1
    this.getProducts()
  }

  onTypeSelected(typeId: number){
    this.shopParams.typeId = typeId
    //an error will occur moving from page 2 to 1 beacuse of filter applied. to tackle it.
    this.shopParams.pageNumber = 1
    this.getProducts()
  }

  onSortSelected(sort: string){
    this.shopParams.sort = sort;
    this.getProducts();
  }

  onPageChanged(event: any){
    // call the (pagechanged) property only if page number is changed from say 1 to 2   v105
    //page changed is received from child component (pager) V103
    // the "event" here is the pagenumber itself V103: 9:00
    if(this.shopParams.pageNumber !== event){
      this.shopParams.pageNumber = event
      this.getProducts()
    }
  }

  onSearch(){
    this.shopParams.search = this.searchTerm.nativeElement.value
    //an error will occur moving from page 2 to 1 beacuse of filter applied. to tackle it.
    this.shopParams.pageNumber = 1
    this.getProducts()
  }

  onReset(){
    this.searchTerm.nativeElement.value = ''
    // initialize all values to default values
    this.shopParams = new ShopParams()
    this.getProducts()
  }

}

