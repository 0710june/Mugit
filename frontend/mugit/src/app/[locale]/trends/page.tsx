import Searchbar from "@/app/container/trends/searchbar";
import Trendslist from "@/app/container/trends/trendslist";
import { unstable_setRequestLocale } from "next-intl/server";

async function getFlow() {
  const response = await fetch("https://mugit.site/api" + "/flows?page=0", {
    method: "GET",
    credentials: "include",
  });
  return response.json();
}

export default async function TrendsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  const flows = await getFlow();

  return (
    <>
      {flows && (
        <main
          //   className="py-10s flex min-h-[90%] w-full flex-auto flex-col content-center items-center
          // justify-center bg-pointyellow"
          className="flex min-h-[90%] w-full flex-auto flex-col items-center bg-pointyellow py-10"
        >
          <div className="flex h-full w-7/12 flex-col ">
            <Searchbar />
            <Trendslist flows={flows.content} />
          </div>
        </main>
      )}
    </>
  );
}
