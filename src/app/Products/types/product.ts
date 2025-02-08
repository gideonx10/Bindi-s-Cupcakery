export interface Product {
  id: string;
  name: string;
  type: ProductType;
  price: number;
  image: string;
  isBestseller?: boolean;
  isSugarFree?: boolean;
  description: string;
}

export type ProductType =
  | "All Products"
  | "Cake"
  | "Ice Cream"
  | "Brownies"
  | "Donuts"
  | "Fudge"
  | "Jar Dessert"
  | "Cheese Cake"
  | "Cookies"
  | "Modak"
  | "Muffins"
  | "Truffle Chocolate"
  | "Swiss Roll";
