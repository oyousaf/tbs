import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap-page py-24 text-center">
      <span aria-hidden className="mx-auto block size-16 rounded-full bg-accent" />
      <h1 className="mt-8 font-display text-5xl text-accent sm:text-7xl">We&rsquo;ve missed a spot.</h1>
      <p className="mt-4 text-lg text-muted">That page isn&rsquo;t here. The treatments definitely are.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-plum">Back to home</Link>
        <Link href="/treatments" className="btn btn-line">See treatments</Link>
      </div>
    </div>
  );
}
