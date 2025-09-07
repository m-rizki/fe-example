import Image from "next/image";

export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <figure>
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={200}
          height={200}
          priority
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{product.title}</h2>
        <p>$ {product.price}</p>
      </div>
    </div>
  );
}
