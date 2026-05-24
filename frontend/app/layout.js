import "./globals.css";

export const metadata = {
  title: "Quantacus Product Intelligence",
  description: "Product intelligence dashboard for ecommerce sellers"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
