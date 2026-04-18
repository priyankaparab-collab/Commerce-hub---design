"use client";

import { useState } from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@cimpress-ui/react";
import { EventsPanel } from "./EventsPanel";
import { LineItemsPanel } from "./LineItemsPanel";

interface OrderDetailsTabsProps {
  defaultTab?: string;
  cancelledItemIds?: Set<string>;
  onItemsCancelled?: (ids: string[]) => void;
}

export function OrderDetailsTabs({
  defaultTab = "events",
  cancelledItemIds,
  onItemsCancelled,
}: OrderDetailsTabsProps) {
  const [selectedTab, setSelectedTab] = useState(defaultTab);

  return (
    <Tabs selectedKey={selectedTab} onSelectionChange={(k) => setSelectedTab(k as string)} aria-label="Order details">
      <TabList>
        <Tab id="line-items">Line Items</Tab>
        <Tab id="shipment-info">Shipment info</Tab>
        <Tab id="events">Events</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="line-items">
          <LineItemsPanel
            cancelledItemIds={cancelledItemIds}
            onItemsCancelled={onItemsCancelled}
          />
        </TabPanel>
        <TabPanel id="shipment-info">
          <div className="py-6 text-[color:var(--cim-fg-subtle)]">
            Shipment info content
          </div>
        </TabPanel>
        <TabPanel id="events">
          <div className="pt-4">
            <EventsPanel cancelledItemIds={cancelledItemIds} />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
