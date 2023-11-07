import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/chapters/1">Chapter 1</Link><br />
      <Link href="/chapters/2">Chapter 2</Link><br />
      <Link href="/chapters/3">Chapter 3</Link><br />
    </main>
  )
}
