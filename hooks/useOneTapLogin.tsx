"use client";

import googleOneTap from "google-one-tap";
import { signIn } from "next-auth/react";
import { useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";

type UseOneTapLoginOptions = {
  enabled?: boolean;
};

export default function useOneTapLogin(options: UseOneTapLoginOptions = {}) {
  const { enabled = true } = options;
  const { status } = useSession();
  const clientId = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID;

  const handleLogin = useCallback(async (credentials: string) => {
    await signIn("google-one-tap", {
      credential: credentials,
      redirect: false,
    });
  }, []);

  const oneTapLogin = useCallback(() => {
    if (!clientId) {
      return;
    }

    const oneTapOptions = {
      client_id: clientId,
      auto_select: false,
      cancel_on_tap_outside: false,
      context: "signin",
    };

    googleOneTap(oneTapOptions, (response: any) => {
      void handleLogin(response.credential);
    });
  }, [clientId, handleLogin]);

  useEffect(() => {
    if (!enabled || !clientId) {
      return;
    }

    if (status !== "unauthenticated") {
      return;
    }

    oneTapLogin();

    const intervalId = setInterval(oneTapLogin, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, [clientId, enabled, oneTapLogin, status]);
}
