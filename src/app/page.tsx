import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/loans");
  return null; // redirect will ensure this is not rendered
}
