"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Protected(props: any) {
  const router = useRouter();
  const session = useSession({
    required: true, //Bu routea erişmek için sessionın zorunlu olduğunu belirttik
    onUnauthenticated() {
      //Bu route erişildiğinde eğer userın sessionı yoksa, ne yapılacağını belirttik
      router.replace("/");
    },
  });
  if (session.status == "loading") return <p>Now page is loading</p>;
  return props.children;
}
