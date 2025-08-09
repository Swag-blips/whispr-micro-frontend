"use client";

import { useEffect, useState } from "react";
import { Welcome } from "@/app/components/shared/Welcome";
import { authenticateWithGoogle } from "./services/service";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "./loading";
export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      if (!code) {
        router.push("/");
        return;
      }

      try {
        const response = await authenticateWithGoogle(code);

        if (response.success) {
          setUsername(response.data.username);
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Google auth failed:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, [code, router]);

  if (loading) {
    return <Loading />;
  }
  return (
    <main className="flex flex-col h-screen items-center justify-center bg-[#0A0E0F]">
      {username ? <Welcome username={username} /> : null}
    </main>
  );
}
