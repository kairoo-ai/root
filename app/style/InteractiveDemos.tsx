"use client";

/**
 * InteractiveDemos - live, working examples of the HeroUI v3 wrapper primitives
 * for the /style reference gallery.
 *
 * Token-only: every component renders on HeroUI's themed defaults (our CSS
 * variables wired in app/globals.css). No colors are set here.
 *
 * Overlay triggers (Dialog/Popover/Tooltip) use HeroUI's own RAC-aware `Button`
 * so press/focus/ARIA wiring works; the local "@/components/ui/Button" is a plain
 * <button> and is intentionally not used as a trigger child. Form `Label`s come
 * from "@/components/ui/Label".
 *
 * Where possible the examples are uncontrolled (defaultSelected / defaultValue /
 * defaultSelectedKey / defaultExpandedKeys) so they are self-contained; the few
 * that show client state read/write it with useState.
 */

import { useState } from "react";
import { Button as HeroButton } from "@heroui/react";

import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Select, ListBox } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import { Tooltip } from "@/components/ui/Tooltip";
import { Popover } from "@/components/ui/Popover";
import { Accordion } from "@/components/ui/Accordion";
import { Switch } from "@/components/ui/Switch";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, Radio } from "@/components/ui/RadioGroup";
import { Table } from "@/components/ui/Table";
import { Label } from "@/components/ui/Label";

/* ---------------------------------------------------------------- demo shell */

function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-h6 text-foreground">{title}</h3>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------- Dialog */

function DialogDemo() {
  return (
    <Dialog>
      <HeroButton>Open dialog</HeroButton>
      <Dialog.Backdrop>
        <Dialog.Container>
          <DialogContent>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Heading>Confirm action</Dialog.Heading>
            </Dialog.Header>
            <Dialog.Body>
              This is a HeroUI v3 modal. Focus is trapped while it is open and it
              dismisses on Escape or backdrop click.
            </Dialog.Body>
            <Dialog.Footer>
              <HeroButton slot="close" variant="tertiary">
                Cancel
              </HeroButton>
              <HeroButton slot="close">Confirm</HeroButton>
            </Dialog.Footer>
          </DialogContent>
        </Dialog.Container>
      </Dialog.Backdrop>
    </Dialog>
  );
}

/* -------------------------------------------------------------------- Select */

function SelectDemo() {
  const [selected, setSelected] = useState<string>("balanced");
  return (
    <div className="space-y-1.5">
      <Select
        className="w-64"
        placeholder="Choose a strategy"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(String(key))}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="conservative" textValue="Conservative">
              Conservative
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="balanced" textValue="Balanced">
              Balanced
              <ListBox.ItemIndicator />
            </ListBox.Item>
            <ListBox.Item id="aggressive" textValue="Aggressive">
              Aggressive
              <ListBox.ItemIndicator />
            </ListBox.Item>
          </ListBox>
        </Select.Popover>
      </Select>
      <p className="text-caption text-muted-foreground">Selected: {selected}</p>
    </div>
  );
}

/* ---------------------------------------------------------------------- Tabs */

function TabsDemo() {
  return (
    <Tabs defaultSelectedKey="overview" className="w-full max-w-md">
      <Tabs.List aria-label="Sections">
        <Tabs.Tab id="overview">Overview</Tabs.Tab>
        <Tabs.Tab id="metrics">Metrics</Tabs.Tab>
        <Tabs.Tab id="team">Team</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="overview" className="pt-3 text-body text-foreground">
        A concise summary of the opportunity and current traction.
      </Tabs.Panel>
      <Tabs.Panel id="metrics" className="pt-3 text-body text-foreground">
        Revenue, retention, and growth charts live here.
      </Tabs.Panel>
      <Tabs.Panel id="team" className="pt-3 text-body text-foreground">
        Founders, advisors, and key hires.
      </Tabs.Panel>
    </Tabs>
  );
}

/* ------------------------------------------------------------------- Tooltip */

function TooltipDemo() {
  return (
    <Tooltip delay={0}>
      <HeroButton variant="secondary">Hover or focus me</HeroButton>
      <Tooltip.Content showArrow placement="top">
        <Tooltip.Arrow />
        Helpful context appears here
      </Tooltip.Content>
    </Tooltip>
  );
}

/* ------------------------------------------------------------------- Popover */

function PopoverDemo() {
  return (
    <Popover>
      <Popover.Trigger>
        <HeroButton variant="secondary">Open popover</HeroButton>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Dialog className="max-w-xs p-4">
          <Popover.Heading className="text-h6 text-foreground">
            Quick note
          </Popover.Heading>
          <p className="mt-1 text-body text-muted-foreground">
            Popovers are non-modal and dismiss when you click outside or press
            Escape.
          </p>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

/* ----------------------------------------------------------------- Accordion */

function AccordionDemo() {
  return (
    <Accordion defaultExpandedKeys={["what"]} className="w-full max-w-md">
      <Accordion.Item id="what">
        <Accordion.Heading>
          <Accordion.Trigger>
            What is AstraPath?
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            A platform that maps the right moment to grow.
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item id="how">
        <Accordion.Heading>
          <Accordion.Trigger>
            How does it work?
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            It combines signals into a single, actionable readiness score.
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

/* -------------------------------------------------------------------- Switch */

function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <div className="space-y-2">
      <Switch isSelected={on} onChange={setOn}>
        Email notifications
      </Switch>
      <p className="text-caption text-muted-foreground">
        State: {on ? "on" : "off"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ Checkbox */

function CheckboxDemo() {
  return (
    <div className="space-y-2">
      <Checkbox defaultSelected>
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Content>
          <Label>I agree to the terms</Label>
        </Checkbox.Content>
      </Checkbox>
      <Checkbox>
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Content>
          <Label>Subscribe to the newsletter</Label>
        </Checkbox.Content>
      </Checkbox>
    </div>
  );
}

/* ---------------------------------------------------------------- RadioGroup */

function RadioGroupDemo() {
  const [value, setValue] = useState("monthly");
  return (
    <div className="space-y-2">
      <RadioGroup value={value} onChange={setValue} aria-label="Billing period">
        <Radio value="monthly">Monthly</Radio>
        <Radio value="annual">Annual</Radio>
        <Radio value="lifetime">Lifetime</Radio>
      </RadioGroup>
      <p className="text-caption text-muted-foreground">Plan: {value}</p>
    </div>
  );
}

/* --------------------------------------------------------------------- Table */

const ROWS = [
  { id: "1", name: "Aurora Capital", round: "Seed", check: "$500k" },
  { id: "2", name: "Northwind Ventures", round: "Series A", check: "$3M" },
  { id: "3", name: "Beacon Partners", round: "Series A", check: "$2M" },
] as const;

function TableDemo() {
  return (
    <Table className="w-full max-w-md">
      <Table.Content aria-label="Investors">
        <Table.Header>
          <Table.Column id="name" isRowHeader>
            Investor
          </Table.Column>
          <Table.Column id="round">Round</Table.Column>
          <Table.Column id="check">Check</Table.Column>
        </Table.Header>
        <Table.Body>
          {ROWS.map((row) => (
            <Table.Row key={row.id} id={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.round}</Table.Cell>
              <Table.Cell>{row.check}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table>
  );
}

/* --------------------------------------------------------------------- index */

export function InteractiveDemos() {
  return (
    <div className="space-y-8">
      <Demo title="Dialog">
        <DialogDemo />
      </Demo>
      <Demo title="Select">
        <SelectDemo />
      </Demo>
      <Demo title="Tabs">
        <TabsDemo />
      </Demo>
      <Demo title="Tooltip">
        <TooltipDemo />
      </Demo>
      <Demo title="Popover">
        <PopoverDemo />
      </Demo>
      <Demo title="Accordion">
        <AccordionDemo />
      </Demo>
      <Demo title="Switch">
        <SwitchDemo />
      </Demo>
      <Demo title="Checkbox">
        <CheckboxDemo />
      </Demo>
      <Demo title="RadioGroup">
        <RadioGroupDemo />
      </Demo>
      <Demo title="Table">
        <TableDemo />
      </Demo>
    </div>
  );
}

export default InteractiveDemos;
