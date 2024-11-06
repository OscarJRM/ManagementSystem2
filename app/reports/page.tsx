"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Report {
  date: string;
  orders: number;
  revenue: number;
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState("deliveries");
  const [reports, setReports] = useState<Report[]>([]);
  const router = useRouter();

  // Cargar datos de reports desde el backend Express
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchReports();
    }
  }, [router]);

  // Función para obtener reportes del backend
  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:3002/reports");
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        console.error("Error al obtener los reportes del servidor.");
      }
    } catch (error) {
      console.error("Error en la solicitud de reportes:", error);
    }
  };

  const totalValue =
    reportType === "deliveries"
      ? reports.reduce((sum, report) => sum + report.orders, 0)
      : reports.reduce((sum, report) => sum + report.revenue, 0);

  const averageValue = (totalValue / reports.length).toFixed(2);

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-4">Informes</h2>
      <div className="mb-4">
        <Select onValueChange={setReportType} defaultValue={reportType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar tipo de informe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deliveries">Entregas</SelectItem>
            <SelectItem value="revenue">Ingresos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>{reportType === "deliveries" ? "Total de Entregas" : "Ingresos Totales"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {reportType === "deliveries" ? totalValue : `$${totalValue}`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Promedio por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {reportType === "deliveries" ? averageValue : `$${averageValue}`}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{reportType === "deliveries" ? "Entregas por Fecha" : "Ingresos por Fecha"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={reportType === "deliveries" ? "orders" : "revenue"} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Layout>
  );
}
