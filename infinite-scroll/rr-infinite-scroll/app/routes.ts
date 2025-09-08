import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // page
  index("./routes/_index.tsx"),

  // api
  route("api/products", "./routes/api.products.tsx"),
] satisfies RouteConfig;
