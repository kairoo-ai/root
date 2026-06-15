'use client';

/**
 * Table - thin wrapper around HeroUI v3's real Table.
 *
 * Source of truth: https://heroui.com/docs/react/components/table
 * Verified against installed @heroui/react v3.1.0
 *   (dist/components/table/{index,table}.d.ts and @heroui/styles tableVariants).
 *
 * HeroUI ships a COMPOUND `Table`: the export is callable (it is the styled
 * Root) AND carries attached sub-parts:
 *   Table.Root | Table.ScrollContainer | Table.Content | Table.Header |
 *   Table.Column | Table.Body | Table.Row | Table.Cell | Table.Footer |
 *   Table.ColumnResizer | Table.ResizableContainer |
 *   Table.LoadMore | Table.LoadMoreContent | Table.Collection
 *
 * It also exports each part as a flat named primitive. We re-export BOTH styles
 * so callers can pick whichever reads best.
 *
 * IMPORTANT v3 SHAPE - read this before using:
 *   In v3 the outer `Table` is only the visual shell. The actual React Aria
 *   collection table (the element that owns selection + sorting state) is
 *   `Table.Content`. So the canonical structure is:
 *
 *     <Table>                          // visual wrapper (variant lives here)
 *       <Table.Content                 // the real <table>; selection/sort host
 *         aria-label="Investors"
 *         selectionMode="multiple"     // optional
 *         selectedKeys={keys}
 *         onSelectionChange={setKeys}
 *         sortDescriptor={sort}
 *         onSortChange={setSort}
 *       >
 *         <Table.Header>
 *           <Table.Column id="name" isRowHeader allowsSorting>Name</Table.Column>
 *           <Table.Column id="round">Round</Table.Column>
 *         </Table.Header>
 *         <Table.Body items={rows}>
 *           {(row) => (
 *             <Table.Row id={row.id}>
 *               <Table.Cell>{row.name}</Table.Cell>
 *               <Table.Cell>{row.round}</Table.Cell>
 *             </Table.Row>
 *           )}
 *         </Table.Body>
 *       </Table.Content>
 *     </Table>
 *
 *   - Static content also works: pass children to Header/Body instead of `items`.
 *   - Wrap in <Table.ScrollContainer> for horizontal scroll, or
 *     <Table.ResizableContainer> + <Table.ColumnResizer> for resizable columns.
 *   - Built on react-aria-components (Table.Collection === RAC <Collection>).
 *
 * Compound part ↔ flat name map (same components):
 *   Table.Root               === TableRoot
 *   Table.ScrollContainer    === TableScrollContainer
 *   Table.Content            === TableContent           (the real RAC <Table>)
 *   Table.Header             === TableHeader
 *   Table.Column             === TableColumn
 *   Table.Body               === TableBody
 *   Table.Row                === TableRow
 *   Table.Cell               === TableCell
 *   Table.Footer             === TableFooter
 *   Table.ColumnResizer      === TableColumnResizer
 *   Table.ResizableContainer === TableResizableContainer
 *   Table.LoadMore           === TableLoadMoreItem
 *   Table.LoadMoreContent    === TableLoadMoreContent
 *   Table.Collection         === TableCollection        (RAC <Collection>)
 *
 * Key props (v3):
 *   - variant: "primary" | "secondary"   → on Table (default "primary")
 *   - aria-label / selectionMode / selectedKeys / onSelectionChange /
 *     sortDescriptor / onSortChange      → on Table.Content
 *   - id, isRowHeader, allowsSorting, defaultWidth, minWidth/maxWidth
 *                                        → on Table.Column
 *   - items (collection) + render-prop child, or static children
 *                                        → on Table.Header / Table.Body
 *   - id                                 → on Table.Row
 *
 * Token-only: colors come from HeroUI's themed CSS variables wired in
 * app/globals.css. No hardcoded colors here.
 */

export {
  // Compound default - `Table` is callable AND has .Content/.Header/.Body/etc.
  Table,

  // Flat named primitives (same components, attached on the compound above).
  TableRoot,
  TableScrollContainer,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableColumnResizer,
  TableResizableContainer,
  TableLoadMoreItem,
  TableLoadMoreContent,
  TableCollection,

  // Style recipe, in case a caller needs to compose tokens.
  tableVariants,
} from '@heroui/react';

export type {
  TableProps, // alias of TableRootProps
  TableRootProps,
  TableScrollContainerProps,
  TableContentProps,
  TableHeaderProps,
  TableColumnProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  TableFooterProps,
  TableColumnResizerProps,
  TableResizableContainerProps,
  TableLoadMoreItemProps,
  TableLoadMoreContentProps,
  TableVariants,
} from '@heroui/react';

// Default export mirrors the compound for `import Table from "@/components/ui/Table"`.
export { Table as default } from '@heroui/react';
