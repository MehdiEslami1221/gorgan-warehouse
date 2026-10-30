# User guide

## First-time setup

1. Create organizational departments and their employees.
2. Register suppliers and measurement units.
3. Register products, storage locations and warning thresholds.
4. Enter opening balances before the first posted movement for each product.
5. Use incoming receipts for subsequent deliveries.

All internal IDs are generated automatically. An optional personnel code is an organizational reference, not the application's employee ID.

## Documents

- **Opening balance:** initial quantity before a product has posted stock history.
- **Incoming receipt:** increases inventory; a supplier can be recorded.
- **Delivery:** decreases inventory and records the employee and department receiving the items.
- **Purchase order:** requests items from a supplier without affecting stock.

Each document supports up to 100 distinct items and quantities with up to three decimal places. The maximum individual quantity and product stock is one billion units. Duplicate product lines, future dates, invalid quantities and insufficient current stock are rejected.

Use **Receive complete order** from an order preview to create a linked receipt. Partial deliveries require independent receipts with the order number in the notes.

## Corrections

Posted documents are immutable. Cancel the incorrect document with a reason and create its replacement. Cancellation is rejected if it would make current stock negative. Cancel an active linked receipt before cancelling its purchase order.

Base records can be deactivated to preserve history. A product's measurement unit cannot change after it appears in a document.

## Reports and printing

Filter movements by date range, movement type, product, employee, department or supplier. Cancelled documents and purchase orders are excluded from stock movements. Totals are grouped by item and unit; the net movement over a period is not a closing balance.

Detail reports show 50 rows per page. The printable report includes the current page plus the period summary. CSV includes all matching detail rows and uses ISO Gregorian dates for sorting. The UI presents dates in the Persian calendar.

Use A4 portrait, 100% scale and disable the browser's own headers and footers. Printing can also save a PDF. Signatures may move to a separate final page for long documents. Printer-driver behavior still needs local verification.

## Windows distribution

Extract the entire prepared distribution, then double-click `START.bat` or `START.cmd`. Both use the bundled Node executable. After server readiness, the launcher requests the default browser at `http://127.0.0.1:3322`.

Keep the launch window open. Stop with `STOP.cmd` or Ctrl+C. Closing the browser alone does not stop the server. A subsequent launch reuses an already running server.

This Git repository contains source, not the prebuilt runtime or node.exe. See the development guide to create a distribution.

## Backups and restore

The database lives in `data/warehouse.sqlite` beside the launch scripts in the prepared distribution. A daily backup is taken before the day's first mutation; 14 daily backups are retained. It is a start-of-day snapshot, not an end-of-day snapshot.

Download a manual backup at the end of work and keep a separate copy on another device. Manual and pre-restore backups are not automatically deleted.

To restore, stop the application and run `RESTORE.cmd`. Supply a compatible backup and type `RESTORE` to confirm. The restore utility checks database integrity, foreign keys and stock/ledger consistency, and backs up the current database before replacement.

Do not copy only the main database file while the application is running: SQLite may also have WAL and SHM files. Do not manually delete those files. When upgrading, stop the application, take a backup and preserve the complete `data` folder.

## Operational boundaries

The app binds to the local loopback interface and does not include its own login screen or database encryption. Access is governed by the Windows account and filesystem permissions. Correct system time is required. Power loss, a full disk or hardware failure cannot be eliminated by application code; maintain separate backups.
