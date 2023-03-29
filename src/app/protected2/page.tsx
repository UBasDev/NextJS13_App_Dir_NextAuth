"use client";

import { getProviders, getSession } from "next-auth/react";
import Link from "next/link";

export default function Protected2() {
  const session = getSession(); //React contextinin dışarısında[Providerın dışarısında] session bilgilerine erişmemizi sağlar
  const providers = getProviders(); //SignIn için configure edilmiş olan providerların listesini döndürür.
  
  return (
    <>
      <p>Protected2 works!</p>
      <button onClick={() => session.then((response) => console.log(response))}>
        SessionInfo
      </button>
      <button
        onClick={() => providers.then((response) => console.log(response))}
      >
        Providers List
      </button>
      <Link href={"/"}>Go to Homepage</Link>
    </>
  );
}
