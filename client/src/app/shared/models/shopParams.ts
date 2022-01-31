export class ShopParams{
  //assigned value 0 to make sure the selectlist item ALL is selected at starting of page load V96, 5:00
  brandId = 0
  typeId = 0
  //for sorting
  sort = 'name'
  pageNumber = 1
  pageSize = 6
  search: string
}
