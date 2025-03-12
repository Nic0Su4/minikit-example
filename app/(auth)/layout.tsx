"use client";

import type React from "react";

import { useUser } from "@/app/user-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Loader2 } from "lucide-react";
import { TopBar } from "../../components/TopBar/index";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col max-h-[85vh] bg-background">
        <TopBar />
        <main className="pb-16">{children}</main>
      </div>
      <BottomNav />
    </>
  );
}
