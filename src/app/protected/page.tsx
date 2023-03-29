"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Protected() {
  return (
    <>
      <div>Protected works!</div>
      <Link href={"/"}>Go to Homepage</Link>
    </>
  );
}
