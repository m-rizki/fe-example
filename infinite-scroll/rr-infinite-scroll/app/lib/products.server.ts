export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const PRODUCTS_LIMIT = 12;

export async function getProducts({
  skip,
}: {
  skip: number;
}): Promise<ProductsResponse> {
  const url = `https://dummyjson.com/products?limit=${PRODUCTS_LIMIT}&skip=${skip}&select=title,price,thumbnail`;
  const res = await fetch(url);
  if (!res.ok) throw new Response("Failed to fetch products", { status: 502 });
  return res.json();
}
