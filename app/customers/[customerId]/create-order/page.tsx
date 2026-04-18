import { notFound } from "next/navigation";
import { CUSTOMER_DATABASE } from "@/lib/createOrderMockData";
import { CreateOrderPage } from "@/components/create-order/CreateOrderPage";

interface PageProps {
  params: Promise<{ customerId: string }>;
}

export function generateStaticParams() {
  return CUSTOMER_DATABASE.map((customer) => ({
    customerId: customer.id,
  }));
}

export default async function Page({ params }: PageProps) {
  const { customerId } = await params;
  const customer = CUSTOMER_DATABASE.find((c) => c.id === customerId);

  if (!customer) {
    notFound();
  }

  return <CreateOrderPage customer={customer} />;
}
