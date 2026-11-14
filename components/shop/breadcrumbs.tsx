import Link from "next/link";

export function Breadcrumbs({ current, className = "mb-8" }: { current: string; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`${className} text-base text-muted`}>
      <ol className="flex flex-wrap items-center gap-3">
        <li><Link href="/" className="rounded-sm hover:underline">Home</Link></li>
        <li aria-hidden="true">&gt;</li>
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}
