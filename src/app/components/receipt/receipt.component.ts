import { NgFor, NgIf } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';

export type ReceiptType = {
  name: string,
  price: number,
  quantity: number,
  details: {
    name: string,
    price: number | undefined,
    quantity: number,
    subDetails: {
      name: string,
      price: number | undefined,
      quantity: number
    }[]
  }[]
};

@Component({
  selector: 'app-receipt',
  imports: [ NgIf, NgFor ],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css'
})
export class ReceiptComponent {
  // Have the input be the order details
  @Input() orderDetails: {
    receipt: ReceiptType,
    final: boolean
  } | undefined;
  
  items: {
    name: string,
    price: number,
    quantity: number,
    details: {
      title: string,
      quantity: number,
      price: number | null,
      items: {
        name: string,
        price: number | null
      }[] | null
    }[]
  }[] = [];
  preTaxTotal: number = 0.00;
  taxes: number = 0.00;
  totalPrice: number = 0.00;

  final: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    // Check if the orderDetails were updated
    if (changes["orderDetails"]) {
      // Get the receipt
      let receipt = changes["orderDetails"].currentValue.receipt;

      // Get the final value
      this.final = changes["orderDetails"].currentValue.final;

      // Check if the orderDetails are not empty
      if (receipt.length > 0) {
        for (const item of receipt) {
          // Setup the order object
          let order = {
            name: item.name,
            price: item.price,
            quantity: item.quantity ? 1 : item.quantity,
            details: [] as {
              title: string,
              quantity: number,
              price: number | null,
              items: {
                name: string,
                price: number | null
              }[] | null
            }[]
          };

          // Check if there are details to the order
          if (item.details.length > 0) {
            // Loop through the details and add them to the order
            for (const detail of item.details) {
              // The details of the details
              let detailItem = {
                title: detail.name,
                price: detail.price ? detail.price : null,
                quantity: detail.quantity ? 1 : detail.quantity,
                items: null as {
                  name: string,
                  price: number | null
                }[] | null
              };

              // Check if there are any sub items
              if (detail.subDetails && detail.subDetails.length > 0) {
                // Go through each sub details
                for (const subDetail of detail.subDetails) {
                  let subDetailItem = {
                    name: subDetail.name,
                    price: subDetail.price ? subDetail.price : null
                  };

                  // Add the sub detail to the items
                  detailItem.items = detailItem.items || [];
                  detailItem.items.push(subDetailItem);

                  // Add the price to the pre tax total
                  this.preTaxTotal += subDetail.price ? subDetail.price : 0;
                }
              }

              // Add the detail to the order
              order.details.push(detailItem);

              // Add the price to the pre tax total
              this.preTaxTotal += detail.price ? detail.price : 0;
            }
          }

          // Add the order to the items
          this.items.push(order);

          // Add the price to the pre tax total
          this.preTaxTotal += item.price ? item.price : 0;
        }

        // Check if the order is final or not
        if (this.final) {
          this.totalPrice = this.preTaxTotal;
        } else {
          this.totalPrice = this.preTaxTotal + this.taxes;
        }
      }
    }
  }
}
