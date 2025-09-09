import { ENPOINTS } from "~/lib/constants";
import type { Route } from "./+types/api.products";
import { data } from "react-router";
import type { ProductsResponse } from "~/lib/types";

const PRODUCTS_LIMIT = 12;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const skip = Number(url.searchParams.get("skip") ?? 0);

  try {
    const res = await fetch(
      `${ENPOINTS.PRODUCTS}?limit=${PRODUCTS_LIMIT}&skip=${skip}&select=title,price,thumbnail`
    );

    if (!res.ok) {
      const msg = (await res.text()) || res.statusText || "Request failed";
      return data({ ok: false as const, products: [], message: msg });
    }

    const resData: ProductsResponse = await res.json();
    return data({ ok: true as const, products: resData.products, message: "" });
  } catch (e: any) {
    return data({
      ok: false as const,
      products: [],
      message: e?.message ?? "Network error",
    });
  }
}
