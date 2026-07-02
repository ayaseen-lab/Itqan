"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

interface GoogleProfile {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
}

function decodeGoogleJwt(credential: string): GoogleProfile | null {
  try {
    const payload = credential.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as GoogleProfile;
  } catch {
    return null;
  }
}

export function GoogleSignInButton({
  onSuccess,
  onError,
}: {
  onSuccess: (profile: { name: string; email: string; picture?: string; googleId: string }) => void;
  onError?: () => void;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="muted rounded-xl border px-3 py-2 text-xs" style={{ borderColor: "rgb(var(--border))" }}>
        Google Sign-In is not configured yet. Add <code className="text-[11px]">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> to
        your environment.
      </p>
    );
  }

  function handleSuccess(res: CredentialResponse) {
    if (!res.credential) {
      onError?.();
      return;
    }
    const profile = decodeGoogleJwt(res.credential);
    if (!profile?.sub || !profile.email) {
      onError?.();
      return;
    }
    onSuccess({
      name: profile.name?.trim() || profile.email.split("@")[0],
      email: profile.email,
      picture: profile.picture,
      googleId: profile.sub,
    });
  }

  return (
    <div className="flex justify-center [&>div]:w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError?.()}
        theme="outline"
        size="large"
        shape="rectangular"
        text="signin_with"
        width={360}
      />
    </div>
  );
}
