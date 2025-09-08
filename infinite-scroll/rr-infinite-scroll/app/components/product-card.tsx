import type { Product } from "~/lib/products.server";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <figure>
        <img
          src={product.thumbnail}
          alt={product.title}
          width={200}
          height={200}
          loading="lazy"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.title}</h2>
        <p>$ {product.price}</p>
      </div>
    </div>
  );
}
