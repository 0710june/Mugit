import { Suspense } from "react";

export default function TrendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
