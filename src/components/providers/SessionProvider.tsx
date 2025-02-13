"use client";

import { LoadScript } from "@react-google-maps/api";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}
      >
        {children}
      </LoadScript>
    </SessionProvider>
  );
}
