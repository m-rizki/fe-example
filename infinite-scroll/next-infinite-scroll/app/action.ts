"use server";

const PRODUCTS_LIMIT = 12;

export async function getProducts({ skip }: { skip: number }) {
  // The use server directive designates a function or file to be executed on the server side.
  // server action can return jsx server component, you can rename this to action.tsx
  const response = await fetch(
    `https://dummyjson.com/products?skip=${skip}&limit=${PRODUCTS_LIMIT}&select=title,price,thumbnail`
  );

  const data = await response.json();

  return data;
}
