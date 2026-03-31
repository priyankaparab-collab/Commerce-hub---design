import { OrderDetailsPage } from "@/components/OrderDetailsPage";

export function generateStaticParams() {
  return [{ orderId: "VP_8WZ3DJ32" }];
}

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  return <OrderDetailsPage orderId={orderId} />;
}
