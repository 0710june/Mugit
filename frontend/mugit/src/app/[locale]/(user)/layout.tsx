import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // if (isLogined === "undefined") {
  //   redirect(`/note`);
  // }
  return <>{children}</>;
}
