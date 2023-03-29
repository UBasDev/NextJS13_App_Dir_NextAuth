"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";

export default function SignInComponent() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ email: ``, password: `` });
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const res = await signIn(`credentials`, {
      //Böylece `CredentialsProvider` providerını kullanacağını belirttik
      email: userInfo.email,
      password: userInfo.password,
      redirect: false, // Eğer `true` ise user, `authenticated` olsa dahi bu sayfada kalır, redirect etmez
    });
    if (res?.ok) router.replace(window.location.origin);
    //Kullanıcı, `auth` olduktan sonra ana origin sayfaya yönlendirir
    else alert(res?.error);
  };
  return (
    <>
      <p>Signin works!</p>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
        />
        <input
          name="password"
          onChange={(e) =>
            setUserInfo({ ...userInfo, password: e.target.value })
          }
        />
        <button type="submit">SUBMIT</button>
      </form>
    </>
  );
}
