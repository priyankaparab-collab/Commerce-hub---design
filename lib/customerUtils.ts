import type { Customer } from "./createOrderMockData";
import { CUSTOMER_DATABASE } from "./createOrderMockData";

const NAME_VARIANT_SEEDS: Array<{
  emailSuffix: string;
  type: "org" | "child";
  addressOrderCounts: number[];
}> = [
  { emailSuffix: "@vista.com",      type: "org",   addressOrderCounts: [12, 0] },
  { emailSuffix: "@vistaprint.com", type: "child", addressOrderCounts: [2, 0]  },
  { emailSuffix: "@example.com",    type: "child", addressOrderCounts: [45, 0] },
  { emailSuffix: "@gmail.com",      type: "child", addressOrderCounts: [3, 1]  },
];

export function generateNameVariants(base: Customer): Customer[] {
  // Strip company suffixes to get the personal name used for both child names and email slugs
  const personalName = base.name.replace(/\s+(Ltd\.?|Pvt\.?\s*Ltd\.?|Inc\.?|Corp\.?|LLC\.?)$/i, "").trim();
  const slug = personalName.toLowerCase().replace(/\s+/g, ".");

  // Generate short sequential variant IDs (e.g. base "123456" → "123456-2", "123456-3", …)
  return NAME_VARIANT_SEEDS.map((seed, i) => ({
    ...base,
    id: `${base.id}-${i + 2}`,
    name: seed.type === "org" ? base.name : personalName,
    email: `${slug.replace(/\./g, i === 0 ? "" : String(i))}${seed.emailSuffix}`,
    type: seed.type,
    addresses: base.addresses.map((addr, j) => ({
      ...addr,
      orderCount: seed.addressOrderCounts[j] ?? 0,
    })),
  }));
}

/** Resolve a customer by ID, including name-search variants. */
export function findCustomer(customerId: string): Customer | undefined {
  // Direct match in database
  const direct = CUSTOMER_DATABASE.find((c) => c.id === customerId);
  if (direct) return direct;

  // Variant match: strip the -N suffix and regenerate
  const variantMatch = customerId.match(/^(.+)-(\d+)$/);
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
