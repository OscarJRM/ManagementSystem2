"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Package, BarChart2, Settings, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { href: "/orders", label: "Gestionar Pedidos", icon: Package },
  { href: "/reports", label: "Ver Informes", icon: BarChart2 },
  { href: "/settings", label: "Configuración", icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("isLoggedIn");
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`w-64 ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        } p-4`}
      >
        <h1
          className={`text-2xl font-bold mb-8 text-center ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Gestión de Pedidos
        </h1>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={`w-full justify-start ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-white"
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              theme === "dark"
                ? "text-gray-700 hover:text-black"
                : "text-gray-700 hover:text-black"
            }`}
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
