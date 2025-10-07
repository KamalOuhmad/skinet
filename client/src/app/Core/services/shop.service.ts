import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject} from '@angular/core';
import { map } from 'rxjs/operators';
import { Pagination } from '../../Shared/models/pagination';
import { Product } from '../../Shared/models/product';
import { ShopParams } from '../../Shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
   baseUrl = 'https://localhost:5001/api/';
  private http = inject(HttpClient);
  types: string[] =[];
  brands: string[] =[];

getProducts(shopParams: ShopParams){
  let params = new HttpParams();

  if (shopParams.brands.length > 0){
    params = params.append('brands', shopParams.brands.join(','));
  }
  if (shopParams.types.length > 0){
    params = params.append('types', shopParams.types.join(','));
  }
  if (shopParams.sort){
    params = params.append('sort', shopParams.sort);
  }
  if (shopParams.search){
    params = params.append('search', shopParams.search);
  }

 params = params.append('pageSize', shopParams.pageSize);
  params = params.append('pageIndex', shopParams.pageNumber);

  return this.http.get<Pagination<Product>>(this.baseUrl + 'products', {params})
}

getProduct(id: number){
  return this.http.get<any>(this.baseUrl + 'products/' + id).pipe(
    map((item: any) => ({
      id: item.id ?? item.Id,
      name: item.name ?? item.Name,
      description: item.description ?? item.Description,
      price: item.price ?? item.Price,
      pictureUrl: item.pictureUrl ?? item.PictureUrl ?? item.PictureURL,
      type: item.type ?? item.Type,
      brand: item.brand ?? item.Brand,
      quantityInStock: item.quantityInStock ?? item.QuantityInStock
    } as Product))
  );
}
getBrands(){
  if (this.brands.length > 0) return; 
  return this.http.get<string[]>(this.baseUrl + 'products/brands').subscribe({
    next: response => this.brands = response
  })
}
getTypes(){
  if (this.types.length > 0) return; 
  return this.http.get<string[]>(this.baseUrl + 'products/types').subscribe({
    next: response => this.types = response
  })
}
}