"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const [defaultProfit, setDefaultProfit] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchDefaultProfit();
    }
  }, [router]);

  // Función para obtener el beneficio predeterminado del servidor
  const fetchDefaultProfit = async () => {
    try {
      const response = await fetch("http://localhost:3002/settings/profit");
      if (response.ok) {
        const data = await response.json();
        setDefaultProfit(data.defaultProfit.toString());
      } else {
        console.error("Error al obtener el beneficio predeterminado.");
      }
    } catch (error) {
      console.error("Error en la solicitud de beneficio predeterminado:", error);
    }
  };

  // Función para guardar el beneficio predeterminado en el servidor
  const handleSave = async () => {
    const profitValue = parseFloat(defaultProfit);
    if (isNaN(profitValue) || profitValue < 0) {
      toast({
        title: "Error",
        content: "Ingrese un monto válido para el beneficio.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/settings/profit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profit: profitValue }),
      });

      if (response.ok) {
        const data = await response.json();
        setDefaultProfit(data.defaultProfit.toString());
        toast({
          title: "Configuración Guardada",
          content: `Beneficio predeterminado por pedido establecido en $${data.defaultProfit}`,
        });
      } else {
        toast({
          title: "Error",
          content: "No se pudo guardar la configuración.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error en la solicitud de guardar configuración:", error);
      toast({
        title: "Error",
        content: "No se pudo guardar la configuración.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-4">Configuración</h2>
      <div className="max-w-md">
        <div className="mb-4">
          <Label htmlFor="defaultProfit">Beneficio Predeterminado por Pedido</Label>
          <Input
            id="defaultProfit"
            type="number"
            value={defaultProfit}
            onChange={(e) => setDefaultProfit(e.target.value)}
            placeholder="Ingrese el monto de beneficio predeterminado"
          />
        </div>
        <Button onClick={handleSave}>Guardar Configuración</Button>
      </div>
    </Layout>
  );
}
