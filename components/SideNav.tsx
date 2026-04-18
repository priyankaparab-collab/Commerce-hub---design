"use client";

import { usePathname } from "next/navigation";
import {
  UNSTABLE_SideNav,
  UNSTABLE_SideNavList,
  UNSTABLE_SideNavListItem,
} from "@cimpress-ui/react";
import {
  IconSearch,
  IconDeliveryBox,
  IconFileFinances,
  IconUser,
  IconCrown,
  IconCoinsBill,
} from "@cimpress-ui/react/icons";

export function SideNav() {
  const pathname = usePathname();

  return (
    <UNSTABLE_SideNav variant="fixed">
      <UNSTABLE_SideNavList>
        <UNSTABLE_SideNavListItem
          href="/"
          icon={<IconSearch />}
          isActive={pathname === "/" || pathname === ""}
        >
          Search
        </UNSTABLE_SideNavListItem>
        <UNSTABLE_SideNavListItem
          href="/orders/VP_8WZ3DJ32"
          icon={<IconDeliveryBox />}
          isActive={pathname.startsWith("/orders")}
        >
          Orders
        </UNSTABLE_SideNavListItem>
        <UNSTABLE_SideNavListItem href="#" icon={<IconFileFinances />}>
          Finances
        </UNSTABLE_SideNavListItem>
        <UNSTABLE_SideNavListItem
          href="/customers"
          icon={<IconUser />}
          isActive={pathname.startsWith("/customers")}
        >
          Customers
        </UNSTABLE_SideNavListItem>
        <UNSTABLE_SideNavListItem href="#" icon={<IconCrown />}>
          Loyalty
        </UNSTABLE_SideNavListItem>
        <UNSTABLE_SideNavListItem href="#" icon={<IconCoinsBill />}>
          Billing
        </UNSTABLE_SideNavListItem>
      </UNSTABLE_SideNavList>
    </UNSTABLE_SideNav>
  );
}
