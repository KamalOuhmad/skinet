import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { Product } from '../../Shared/models/product';
import { ShopService } from '../../Core/services/shop.service';
import { MatCard} from '@angular/material/card';
import { ProductItemComponent } from "./product-item/product-item.component";
import{ MatDialog} from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon} from '@angular/material/icon';
import { MatMenu, MatMenuTrigger} from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ShopParams } from '../../Shared/models/shopParams';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Pagination } from '../../Shared/models/pagination';
import { FormsModule } from '@angular/forms';


@Component({
  selector:'app-shop',
  standalone: true,
  imports: [
    MatCard,
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule
    
],
  
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
 constructor(private shopService: ShopService ,private dialogService: MatDialog ) {}
  products?: Pagination<Product>;
  sortOptions= [
    {name: 'Alphabetical', value: 'Name'},
     {name: 'Price: Low to High', value: 'priceasc'},
      {name : 'Price: High to Low', value: 'pricedesc'},
  ]
 
shopParams = new ShopParams();
pageSizeOptions = [5, 10, 15, 20];
  
  ngOnInit() {
    this.initializeShop();   
    };
  
  initializeShop(){
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
 
    
  }
  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => this.products = response,
      error: error => console.log(error)
    })
  }
  onSearchChange() {
    
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(event: MatSelectionListChange){ 
    const selectedOption = event.options[0];
if (selectedOption) {
  this.shopParams.sort = selectedOption.value;
  this.shopParams.pageNumber = 1;
  this.getProducts();
}
}

  openFiltersDialog(){
    const dialogRef = this.dialogService.open(FiltersDialogComponent,{
      minWidth:'500px',
      data:{
        selectedBrands: this.shopParams.brands, 
        selectedTypes : this.shopParams.types

      }
    });
    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          this.getProducts();
        }
      }
    })
  }

}
