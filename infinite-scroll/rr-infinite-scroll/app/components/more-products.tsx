import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useFetcher } from "react-router";
import type { Product } from "~/lib/products.server";
import type { loader } from "~/routes/api.products";
import ProductCard from "./product-card";

const PAGE_SIZE = 12;

export default function MoreProducts() {
  const fetcher = useFetcher<typeof loader>();
  const { ref, inView } = useInView();

  const skipRef = useRef(PAGE_SIZE);
  const loadingRef = useRef(false); // prevent double fetching
  const hasMoreRef = useRef(true); // has more data or not, stop API call if data is

  const [products, setProducts] = useState<Product[]>([]);

  // Load more when the trigger element comes into view
  useEffect(() => {
    if (
      inView &&
      fetcher.state === "idle" &&
      !loadingRef.current &&
      hasMoreRef
    ) {
      loadingRef.current = true;
      fetcher.load(`/api/products?skip=${skipRef.current}&take=${PAGE_SIZE}`);
    }
  }, [inView, fetcher.state]);

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle" && loadingRef.current) {
      const newProducts = fetcher.data.products;

      if (newProducts && newProducts.length > 0) {
        setProducts((prev) => [...prev, ...newProducts]);
        skipRef.current += PAGE_SIZE;

        // Check if we've reached the end
        if (newProducts.length < PAGE_SIZE) {
          hasMoreRef.current = false;
        }
      } else {
        hasMoreRef.current = false;
      }

      // Reset loading flag after processing
      loadingRef.current = false;
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMoreRef.current && (
        <div className="flex justify-center" ref={ref}>
          {fetcher.state === "loading" && (
            <span className="loading loading-spinner loading-xl"></span>
          )}
        </div>
      )}

      {!hasMoreRef.current && products.length > 0 && (
        <div className="flex justify-center">
          <span className="text-sm text-gray-500">End of the list</span>
        </div>
      )}
    </>
  );
}
