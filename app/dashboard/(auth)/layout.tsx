import { BottomNav } from "@/components/Gerente/GerenteBottomNav";

export const metadata = {
  title: "Dashboard Tienda",
  description: "Compra productos de calidad en Kipi Cash",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="min-h-screen">{children}</div>
      <BottomNav />
    </>
  );
}
