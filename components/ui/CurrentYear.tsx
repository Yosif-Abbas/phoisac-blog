"use client";

import { useEffect, useState } from "react";

export default function CurrentYear() {
  // 1. Start with null so the server renders absolutely nothing dynamic
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    // 2. This runs ONLY in the user's browser, safely away from Next.js build checks
    setYear(new Date().getFullYear());
  }, []);

  // 3. Render an invisible placeholder during SSR to prevent the layout from "jumping"
  // when the text finally appears a split second later.
  if (!year) {
    return null;
  }

  // 4. Render the actual year once the client has loaded
  return <span>{year}</span>;
}
