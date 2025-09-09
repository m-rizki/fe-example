import type { Route } from "./+types/_index";
import ProductCard from "~/components/product-card";
import MoreProducts from "~/components/more-products";
import { ENPOINTS } from "~/lib/constants";
import { data } from "react-router";
import type { ProductsResponse } from "~/lib/types";
// import MoreProducts from "~/components/more-products";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router - Infinite Scroll" },
    { name: "description", content: "React router infinite scroll" },
  ];
}

export async function loader(_: Route.LoaderArgs) {
  const PRODUCTS_LIMIT = 12;

  const res = await fetch(
    `${ENPOINTS.PRODUCTS}?limit=${PRODUCTS_LIMIT}&skip=${0}&select=title,price,thumbnail`
  );

  if (!res.ok) {
    throw data(res.statusText, { status: res.status });
  }

  const resData: ProductsResponse = await res.json();

  return data({ products: resData.products });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;

  return (
    <main className="max-w-7xl lg:max-w-5xl mx-auto px-4 py-4">
      <section className="space-y-4">
        <h1 className="text-2xl font-bold underline">Products</h1>

        <div className="grid grid-cols-3 gap-4">
          {products?.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
        <MoreProducts />
      </section>
    </main>
  );
}
