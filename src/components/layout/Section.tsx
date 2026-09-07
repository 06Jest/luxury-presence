import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";

export function Section({
  id,
  children,
  className = "",
  contained = true,
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  contained?: boolean;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`scroll-mt-24 py-20 sm:py-28 lg:py-36 ${className}`}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}
