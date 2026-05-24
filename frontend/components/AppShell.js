import Link from "next/link";
import { Boxes } from "lucide-react";

export function AppShell({ children }) {
  return (
    <div className="shell">
      <header className="topbar">
        <Link href="/dashboard" className="brand">
          <span className="brand-mark">
            <Boxes size={19} />
          </span>
          Quantacus
        </Link>
        <nav className="nav">
          <Link href="/upload">Upload</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/products">Products</Link>
          <Link href="/alerts">Alerts</Link>
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
