"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const [defaultProfit, setDefaultProfit] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  const handleSave = () => {
    toast({
      title: "Configuración Guardada",
      description: `Beneficio predeterminado por pedido establecido en $${defaultProfit}`,
    });
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