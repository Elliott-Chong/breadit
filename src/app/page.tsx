import { buttonVariants } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 py-6 md:grid-cols-3 gaps-y-4 md:gap-x-4">
        {/* feed */}

        {/* subreddit info */}
        <div className="order-first overflow-hidden border border-gray-200 h-fit rouned-lg">
          <div className="px-6 py-4 bg-emerald-100">
            <p className="font-semibold flex items-center gap-1.5">
              <HomeIcon className="w-4 h-4" />
              Home
            </p>
          </div>

          <div className="px-6 py-4 -my-3 text-sm leading-6 divide-y divide-gray-100">
            <div className="flex justify-center py-3 gap-x-4">
              <div className="text-zinc-500">
                Your personal Breddit homepage. Come here to check in with your
                favourite communities.
              </div>
            </div>

            <Link
              href="/r/create"
              className={buttonVariants({
                className: "w-full mt-2 mb-6",
              })}
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
