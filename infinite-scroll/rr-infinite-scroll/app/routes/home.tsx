import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router - Infinite Scroll" },
    { name: "description", content: "React router infinite scroll" },
  ];
}

export default function Home() {
  return <Welcome />;
}
