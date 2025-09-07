"use server";

// The use server directive designates a function or file to be executed on the server side.
// server action can return jsx server component, you can rename this to action.tsx

const LIMIT = 12;

export async function getProducts({ skip }: { skip: number }) {
  const response = await fetch(
    `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`
  );

  const data = await response.json();

  return data;
}
