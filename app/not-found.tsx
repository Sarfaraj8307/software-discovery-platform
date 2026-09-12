import Link from "next/link";
import { ArrowRight, Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTopCategories } from "@/lib/data/repository";
import { CategoryIcon } from "@/components/domain/icon";

/**
 * Global 404.
 *
 * A dead end is a bad outcome on a directory — the reader arrived with intent. So this
 * page does not just apologise: it offers the two routes back into the catalogue
 * (search and the top categories) rather than leaving them to the browser back button.
 */
export default function NotFound() {
  const categories = getTopCategories(8);

  return (
    <main id="main" className="mx-auto flex max-w-2xl flex-col px-4 py-16 sm:px-6">
      <p className="label-caps text-muted-foreground">Error 404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
        We could not find that page
      </h1>
      <p className="mt-3 text-body leading-relaxed text-muted-foreground">
        The link may be out of date, or the product may have been removed from the directory. The
        catalogue itself is unchanged — try searching for what you were looking for.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/search">
            <Search className="size-3.5" aria-hidden="true" />
            Search the directory
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/categories">
            <Compass className="size-3.5" aria-hidden="true" />
            Browse all categories
          </Link>
        </Button>
      </div>

      <section className="mt-12" aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="label-caps text-muted-foreground">
          Popular categories
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className="flex items-center gap-2.5 rounded-control border border-border bg-card px-3 py-2.5 text-13 font-medium transition-colors hover:border-border-strong hover:bg-muted"
              >
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[6px] border border-border bg-subtle text-muted-foreground">
                  <CategoryIcon name={category.icon} className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1 truncate">{category.name}</span>
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
