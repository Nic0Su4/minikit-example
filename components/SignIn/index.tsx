"use client";
import { IDKitWidget } from "@worldcoin/idkit";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignIn = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session?.user?.name?.slice(0, 10)} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  } else {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
        <div className="my-4">
          <IDKitWidget
            app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`}
            action="verify-test"
            signal={"user_value"}
            onSuccess={(response) => {
              console.log(response);
            }}
          >
            {({ open }) => <button onClick={open}>Verify with WorldID</button>}
          </IDKitWidget>
        </div>
      </>
    );
  }
};
