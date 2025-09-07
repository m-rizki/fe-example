"use client";

// server action can return jsx server component -> ex: <ProductCard/>
// But you can add some client interaction if you wrap the server component with client component
// for example in <ProductCard/> -> <ClientProducts>{children}</ClientProducts>

import { ReactNode, useState } from "react";

export default function ClientProducts({ children }: { children: ReactNode }) {
  const [a] = useState("red");
  return <div className={`text-${a}-400`}>{children}</div>;
}
