import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useFetcher } from "react-router";
import type { loader } from "~/routes/api.products";
import ProductCard from "./product-card";
import type { Product } from "~/lib/types";

const PAGE_SIZE = 12;

export default function MoreProducts() {
  const fetcher = useFetcher<typeof loader>();
  const { ref, inView } = useInView();

  const skipRef = useRef(PAGE_SIZE);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const [products, setProducts] = useState<Product[]>([]);

  // Load more when the trigger element comes into view
  useEffect(() => {
    if (
      inView &&
      fetcher.state === "idle" &&
      !loadingRef.current &&
      hasMoreRef.current
    ) {
      loadingRef.current = true;
      fetcher.load(`/api/products?skip=${skipRef.current}`);
    }
  }, [inView, fetcher.state, fetcher.load]);

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle" && loadingRef.current) {
      // Check if the API call was successful
      if (fetcher.data.ok) {
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
      } else {
        hasMoreRef.current = false;
        console.error("Failed to load more products:", fetcher.data.message);
      }

      // Reset loading flag after processing
      loadingRef.current = false;
    }
  }, [fetcher.data, fetcher.state]);

  // Handle error state
  const showError = fetcher.data && !fetcher.data.ok && products.length === 0;

  if (showError) {
    return (
      <div className="flex justify-center py-8">
        <span className="text-sm text-error">
          Failed to load products: {fetcher.data?.message}
        </span>
      </div>
    );
  }

  return (
    <>
      {products.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {hasMoreRef.current && (
        <div className="flex justify-center py-8" ref={ref}>
          {fetcher.state === "loading" && (
            <span className="loading loading-spinner loading-lg"></span>
          )}
        </div>
      )}

      {/* End of list message */}
      {!hasMoreRef.current && products.length > 0 && (
        <div className="flex justify-center py-4">
          <span className="text-sm text-gray-500">
            You've reached the end of the list
          </span>
        </div>
      )}

      {/* No products loaded yet */}
      {products.length === 0 && fetcher.state === "idle" && !fetcher.data && (
        <div className="flex justify-center py-8">
          <span className="text-sm text-gray-500">
            No additional products to show
          </span>
        </div>
      )}
    </>
  );
}
