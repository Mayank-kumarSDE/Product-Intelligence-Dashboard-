"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("quantacus_token");
    document.cookie = "quantacus_token=; path=/; max-age=0; SameSite=Lax";
    router.push("/login");
    router.refresh();
  }

  return (
    <button className="button secondary" onClick={logout}>
      Logout
    </button>
  );
}
