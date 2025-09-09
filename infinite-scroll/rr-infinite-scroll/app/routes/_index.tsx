import type { Route } from "./+types/_index";
import ProductCard from "~/components/product-card";
import { data } from "react-router";
import type { ProductsResponse } from "~/lib/types";
import { ENDPOINTS } from "~/lib/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";

const LIMIT = 12;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router - Infinite Scroll" },
    { name: "description", content: "React router infinite scroll" },
  ];
}

export async function loader(_: Route.LoaderArgs) {
  const res = await fetch(
    `${ENDPOINTS.PRODUCTS}?skip=${0}&limit=${LIMIT}&select=title,price,thumbnail`
  );

  if (!res.ok) {
    throw data(res.statusText, { status: res.status });
  }

  const resData: ProductsResponse = await res.json();
  return data({ firstPage: resData });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    isError,
  } = useInfiniteQuery<ProductsResponse>({
    queryKey: ["products"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `${ENDPOINTS.PRODUCTS}?skip=${pageParam}&limit=${LIMIT}&select=title,price,thumbnail`
      );

      if (!res.ok) {
        console.log(res);
        throw new Error(
          `Error ${res.status} ${res.statusText ? `: ${res.statusText}` : ""}`
        );
      }

      return res.json();
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    // seed data from SSR
    initialPageParam: 0,
    initialData: {
      pages: [loaderData.firstPage],
      pageParams: [0],
    },
    retry: 0,
  });

  // trigger element hook
  const { ref, inView } = useInView();

  // lock to prevent multiple fetchNextPage() calls
  // (caused by React Strict Mode double effects or re-renders)
  const loadLockRef = useRef(false);

  useEffect(() => {
    if (
      !isError &&
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      !loadLockRef.current
    ) {
      // lock as soon as we trigger the fetch
      loadLockRef.current = true;
      fetchNextPage();
    }

    // release the lock only when the trigger element leaves the viewport,
    // so the next scroll into view can trigger another fetch
    if (!inView) {
      loadLockRef.current = false;
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <main className="max-w-7xl lg:max-w-5xl mx-auto px-4 py-4">
      <section className="space-y-4">
        <h1 className="text-2xl font-bold underline">Products</h1>

        <div className="grid grid-cols-3 gap-4">
          {data?.pages.map((page) =>
            page.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        <div className="flex justify-center" ref={ref}>
          {isFetchingNextPage && (
            <div className="py-4">
              <span className="loading loading-spinner loading-lg "></span>
            </div>
          )}

          {/* inline error for pagination (only show when we already have some data) */}
          {!isFetchingNextPage && isError && data && (
            <div className="py-4 flex flex-col items-center text-center">
              <span className="text-sm text-error">{error.message}</span>
              <button onClick={() => fetchNextPage()} className="btn btn-error">
                Try again
              </button>
            </div>
          )}
        </div>

        {!hasNextPage && (
          <div className="flex justify-center py-4">
            <span className="text-sm text-gray-500">
              No more products to load
            </span>
          </div>
        )}
      </section>
    </main>
  );
}
