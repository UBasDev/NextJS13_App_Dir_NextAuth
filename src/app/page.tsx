"use client";

import axiosInstances from "@/lib/axios/axios";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const axiosAuth = useAxiosAuth();
  const session: any = useSession();

  const getNotes = async () => {
    await axiosAuth.get("/note/test1").then((response) => {
      console.log("NOTES RESPONSE", response.data);
    });
  };

  return (
    <main>
      {session.status == "authenticated" ? (
        <button onClick={() => signOut()}>SignOut</button>
      ) : session.status == "loading" ? (
        <p>Loading...</p>
      ) : (
        <button onClick={() => signIn()}>Go to signIn</button>
      )}

      <Link href={"/protected"}>Go to protected</Link>
      <Link href={"/protected2"}>Go to Unprotected2</Link>
      <button onClick={getNotes}>Get Notes</button>
      <button onClick={() => console.log(session.data)}>Session Info</button>
    </main>
  );
}
