"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

export default function OrdersPage() {
  const router = useRouter();
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
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('Your order {orderId} status has been updated.');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  const handleAddOrder = () => {
    if (orderId && customerName) {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      setOrders([...orders, { 
        id: orderId, 
        customerName, 
        email,
        phoneNumber: formattedPhoneNumber,
        status: 'pending', 
        createdAt: new Date().toISOString() 
      }]);
      setOrderId('');
      setEmail('');
      setCustomerName('');
      setPhoneNumber('');
      toast({
        title: "Pedido Añadido",
        content: `El pedido ${orderId} para ${customerName} ha sido añadido con éxito.`,
      });
    } else {
      toast({
        title: "Error",
        content: "El ID del pedido y el nombre del cliente son obligatorios.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus, deliveredAt: newStatus === 'delivered' ? new Date().toISOString() : null } : order
    ));
  };

  const handleWhatsApp = (phoneNumber: string, orderId: string) => {
    if (phoneNumber) {
      const message = whatsappMessage.replace('{orderId}', orderId);
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      toast({
        title: "Error",
        content: "No hay número de teléfono disponible para este pedido.",
        variant: "destructive",
      });
    }
  };

  const formatPhoneNumber = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.startsWith('593')) {
      return '+' + cleanNumber;
    }
    if (cleanNumber.startsWith('0')) {
      return '+593' + cleanNumber.slice(1);
    }
    return '+593' + cleanNumber;
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
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='rounded-l-none'
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
      <Button onClick={handleAddOrder} className="mb-4">Añadir Pedido</Button>
      <div className="mb-4">
        <label htmlFor="whatsappMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <TableCell>{order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : '-'}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => handleStatusChange(order.id, order.status === 'pending' ? 'delivered' : 'pending')}
                >
                  {order.status === 'pending' ? 'Marcar Entregado' : 'Marcar Pendiente'}
                </Button>
                <Button variant="outline" onClick={() => handleWhatsApp(order.phoneNumber, order.id)}>
                  WhatsApp
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
}