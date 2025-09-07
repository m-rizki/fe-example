import ProductCard, { Product } from "@/components/product-card";
import MoreProducts from "@/components/more-products";
import { getProducts } from "./action";

export default async function Home() {
  const data = await getProducts({ skip: 0 });

  return (
    <main className="max-w-7xl lg:max-w-5xl mx-auto px-4 py-4">
      <section className="space-y-4">
        <h1 className="text-2xl font-bold underline">Products</h1>

        <div className="grid grid-cols-3 gap-4">
          {data?.products?.map((item: Product) => (
            <ProductCard product={item} key={item.id} />
          ))}
        </div>
        <MoreProducts />
      </section>
    </main>
  );
}
