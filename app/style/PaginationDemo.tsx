"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";

export function PaginationDemo() {
  const [page, setPage] = useState(2);
  return <Pagination page={page} pageCount={5} onPageChange={setPage} />;
}
