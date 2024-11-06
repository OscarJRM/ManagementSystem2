"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

// Obtener los pedidos del servidor y guardarlos en localStorage
async function fetchOrders() {
  const response = await fetch("http://localhost:3002/orders");
  const data = await response.json();
  localStorage.setItem("orders", JSON.stringify(data));
  return data;
}

// Obtener los reportes del servidor y guardarlos en localStorage
async function fetchReports() {
  const response = await fetch("http://localhost:3002/reports");
  const data = await response.json();
  localStorage.setItem("reports", JSON.stringify(data));
  return data;
}

export default function OrdersPage() {
  const router = useRouter();
  const { toast } = useToast();

  interface Order {
    id: string;
    customerName: string;
    email: string;
    phoneNumber: string;
    status: string;
    createdAt: string;
    deliveredAt?: string | null;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderId, setOrderId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState(
    "El estado de su pedido {orderId} ha sido actualizado."
  );
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchOrders().then((data) => setOrders(data));
      fetchReports();
    }
  }, [router]);

  
  const handleAddOrder = async () => {
    if (orderId && customerName) {
      const newOrder = {
        id: orderId,
        customerName,
        email,
        phoneNumber: formatPhoneNumber(phoneNumber),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:3002/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });
      const createdOrder = await response.json();
      setOrders([...orders, createdOrder]);
      fetchReports(); // Actualiza los reportes en localStorage
      resetForm();
    } else {
      toast({
        title: "Error",
        content: "El ID del pedido y el nombre del cliente son obligatorios.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrder = async () => {
    const updatedOrder = {
      customerName,
      email,
      phoneNumber: formatPhoneNumber(phoneNumber),
      status: "pending",
    };

    const response = await fetch(`http://localhost:3002/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedOrder),
    });
    if (response.ok) {
      const updatedData = await response.json();
      setOrders(
        orders.map((order) => (order.id === orderId ? updatedData : order))
      );
      toast({
        title: "Pedido Actualizado",
        content: `El pedido ${orderId} ha sido actualizado con éxito.`,
      });
      resetForm();
    } else {
      toast({
        title: "Error",
        content: "No se pudo actualizar el pedido.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (id: string) => {
    const response = await fetch(`http://localhost:3002/orders/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setOrders(orders.filter((order) => order.id !== id));
      fetchReports();
      toast({
        title: "Pedido eliminado",
        content: `El pedido ${id} ha sido eliminado con éxito.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        content: "No se pudo eliminar el pedido.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const response = await fetch(`http://localhost:3002/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus, deliveredAt: newStatus === "delivered" ? new Date().toISOString() : null }),
    });
    if (response.ok) {
      const updatedOrder = await response.json();
      setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
      fetchReports();
      toast({
        title: "Estado Actualizado",
        content: `El estado del pedido ${id} ha sido cambiado a ${newStatus}.`,
      });
    } else {
      toast({
        title: "Error",
        content: "No se pudo cambiar el estado del pedido.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsApp = async (phoneNumber: string, orderId: string) => {
    if (phoneNumber) {
      const message = whatsappMessage.replace("{orderId}", orderId);
      try {
        await navigator.clipboard.writeText(message);
        toast({
          title: "Mensaje copiado al portapapeles",
          content: "El mensaje ha sido copiado al portapapeles.",
          variant: "default",
        });
        window.open(
          `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
          "_blank"
        );
      } catch (error) {
        toast({
          title: "Error",
          content: "No se pudo copiar el mensaje al portapapeles.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        content: "No hay número de teléfono disponible para este pedido.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setOrderId("");
    setCustomerName("");
    setPhoneNumber("");
    setEmail("");
    setIsEditing(false);
  };

  const handleEditOrder = (order: Order) => {
    setOrderId(order.id);
    setCustomerName(order.customerName);
    setEmail(order.email);
    setPhoneNumber(order.phoneNumber);
    setIsEditing(true);
  };

  const formatPhoneNumber = (number: string) => {
    const cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.startsWith("593")) {
      return "+" + cleanNumber;
    }
    if (cleanNumber.startsWith("0")) {
      return "+593" + cleanNumber.slice(1);
    }
    return "+593" + cleanNumber;
  };

  const newOrder = {
    id: orderId,
    customerName,
    email,
    phoneNumber: formatPhoneNumber(phoneNumber),
    status: "pending",
    createdAt: new Date().toISOString(),
    whatsappMessage, // Agregar el campo de mensaje personalizado
  };
  

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-4">Gestionar Pedidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          type="text"
          placeholder="Ingrese ID del Pedido o Escanee Código de Barras"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Nombre del Cliente"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-l-none"
        />
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            +593
          </span>
          <Input
            type="tel"
            placeholder="Número de Teléfono"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="rounded-l-none"
          />
        </div>
      </div>
      <Button onClick={isEditing ? handleUpdateOrder : handleAddOrder} className="mb-4">
        {isEditing ? "Editar Pedido" : "Añadir Pedido"}
      </Button>
      <div className="mb-4">
  <label
    htmlFor="whatsappMessage"
    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
  >
    Personalizar Mensaje de WhatsApp
  </label>
  <Textarea
    id="whatsappMessage"
    placeholder="Ingrese mensaje personalizado. Use {orderId} para el ID del pedido."
    value={whatsappMessage}
    onChange={(e) => setWhatsappMessage(e.target.value)}
    className="w-full"
  />
</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID del Pedido</TableHead>
            <TableHead>Nombre del Cliente</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Número de Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creado En</TableHead>
            <TableHead>Entregado En</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.email}</TableCell>
              <TableCell>{order.phoneNumber}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                {order.deliveredAt
                  ? new Date(order.deliveredAt).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() =>
                    handleStatusChange(
                      order.id,
                      order.status === "pending" ? "delivered" : "pending"
                    )
                  }
                >
                  {order.status === "pending"
                    ? "Marcar Entregado"
                    : "Marcar Pendiente"}
                </Button>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => handleEditOrder(order)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => handleWhatsApp(order.phoneNumber, order.id)}
                >
                  WhatsApp
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteOrder(order.id)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
}
