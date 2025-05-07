import Link from "next/link";
import "./globals.css";
import "../styles/styles.css";

export default function Home() {
  return (
    <main>
      <Link href="/crimes">crimes link</Link>
    </main>
  );
}
