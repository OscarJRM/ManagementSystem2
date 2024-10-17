"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Bienvenido al Sistema de Gestión de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-center">
              Seleccione una opción del menú a la izquierda para comenzar.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}