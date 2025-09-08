import { getProducts } from "~/lib/products.server";
import type { Route } from "./+types/_index";
import ProductCard from "~/components/product-card";
import MoreProducts from "~/components/more-products";
// import MoreProducts from "~/components/more-products";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router - Infinite Scroll" },
    { name: "description", content: "React router infinite scroll" },
  ];
}

export async function loader(_: Route.LoaderArgs) {
  const data = await getProducts({ skip: 0 });

  // Create "responses" that contain headers/status without forcing serialization into an actual Response
  // return data(products, {
  //   headers: { "X-Custom-Header": "value" },
  //   status: 201,
  // });
  return data;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const data = loaderData;

  return (
    <main className="max-w-7xl lg:max-w-5xl mx-auto px-4 py-4">
      <section className="space-y-4">
        <h1 className="text-2xl font-bold underline">Products</h1>

        <div className="grid grid-cols-3 gap-4">
          {data?.products?.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
        <MoreProducts />
      </section>
    </main>
  );
}
