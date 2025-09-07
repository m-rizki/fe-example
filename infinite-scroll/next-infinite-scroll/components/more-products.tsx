"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import ProductCard, { Product } from "./product-card";
import { getProducts } from "@/app/action";

const PRODUCTS_LIMIT = 12;

export default function MoreProducts() {
  const skipRef = useRef(PRODUCTS_LIMIT);
  const loadingRef = useRef(false); // prevent double fetching
  const hasMoreRef = useRef(true); // has more data or not, stop API call if data is empty

  const { ref, inView } = useInView();

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false); // UI feedback

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return;
    if (!hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await getProducts({ skip: skipRef.current });
      const productsRes = (await res?.products) || [];
      setData((prev) => [...prev, ...productsRes]);
      skipRef.current += PRODUCTS_LIMIT;

      if (!productsRes.length || productsRes.length < PRODUCTS_LIMIT) {
        hasMoreRef.current = false; // no more data, stop api call
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {data?.map((item: Product) => (
          <ProductCard product={item} key={item.id} />
        ))}
      </div>

      <div className="flex justify-center" ref={ref}>
        {inView && loading && (
          <span className="loading loading-spinner loading-xl"></span>
        )}

        {!loading && !hasMoreRef.current && data.length > 0 && (
          <span className="text-sm text-gray-500">End of the list</span>
        )}
      </div>
    </>
  );
}
