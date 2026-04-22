import { notFound } from "next/navigation";
import { CreateOrderPage } from "@/components/create-order/CreateOrderPage";
import { getAllCustomerParams, findCustomer } from "@/lib/customerUtils";

interface PageProps {
  params: Promise<{ customerId: string }>;
}

export function generateStaticParams() {
  return getAllCustomerParams();
}

export default async function Page({ params }: PageProps) {
  const { customerId } = await params;
  const customer = findCustomer(customerId);

  if (!customer) {
    notFound();
  }

  return <CreateOrderPage customer={customer} />;
}
