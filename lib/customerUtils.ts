import type { Customer } from "./createOrderMockData";
import { CUSTOMER_DATABASE } from "./createOrderMockData";

const NAME_VARIANT_SEEDS = [
  { emailSuffix: "@vista.com",       orderCount: 12 },
  { emailSuffix: "@vistaprint.com",  orderCount: 2  },
  { emailSuffix: "@example.com",     orderCount: 45 },
  { emailSuffix: "@gmail.com",       orderCount: 3  },
];

export function generateNameVariants(base: Customer): Customer[] {
  const slug = base.name.toLowerCase().replace(/\s+/g, ".");
  return NAME_VARIANT_SEEDS.map((seed, i) => ({
    ...base,
    id: `${base.id}-v${i + 1}`,
    email: `${slug.replace(/\./g, i === 0 ? "" : String(i))}${seed.emailSuffix}`,
    orderCount: seed.orderCount,
  }));
}

/** Resolve a customer by ID, including name-search variants. */
export function findCustomer(customerId: string): Customer | undefined {
  // Direct match in database
  const direct = CUSTOMER_DATABASE.find((c) => c.id === customerId);
  if (direct) return direct;

  // Variant match: strip the -vN suffix and regenerate
  const variantMatch = customerId.match(/^(.+)-v(\d+)$/);
  if (variantMatch) {
    const baseId = variantMatch[1];
    const base = CUSTOMER_DATABASE.find((c) => c.id === baseId);
    if (base) {
      const variants = generateNameVariants(base);
      return variants.find((v) => v.id === customerId);
    }
  }

  return undefined;
}

/** All static params: real customers + all their name variants. */
export function getAllCustomerParams() {
  const params: { customerId: string }[] = [];
  for (const customer of CUSTOMER_DATABASE) {
    params.push({ customerId: customer.id });
    generateNameVariants(customer).forEach((v) => params.push({ customerId: v.id }));
  }
  return params;
}
