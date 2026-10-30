# Architecture

The application is a local Next.js server and a React single-page workspace. Navigation changes client-side panels without a full page refresh. SQLite stores all business data on the same computer.

## Data model

- `units`: measurement units.
- `departments`: organizational units.
- `employees`: staff and department references.
- `suppliers`: vendor contact information.
- `products`: catalog, warning threshold and cached current stock.
- `documents`: immutable posted document headers, status, request token and optional order reference.
- `lines`: item snapshots and scaled-integer quantities.
- `audit`: base-record changes, document creation and cancellation history.

The document captures its recipient's department ID and display names at posting time. Historical reports use the captured department reference, rather than the employee's current department.

## Consistency

Writes use BEGIN IMMEDIATE transactions. Product stock updates and document records commit together. Foreign keys, uniqueness constraints and server-side validation supplement application checks. SQLite WAL, FULL synchronous mode and a busy timeout are configured.

Quantities are stored as integer thousandths. A unique request token provides retry idempotency. Cancellation writes audit history and applies the inverse stock effect; it does not delete the document.

## Resource management

The server reuses a SQLite connection. Master lists and document lists are paginated in SQL. Search selectors fetch bounded pages; superseded UI requests are aborted. The clock timer is cleaned up on unmount. The launcher's Node heap limit is 512 MB; this is not a limit on total process RAM. Server logs rotate at approximately 2 MB with one retained previous log.

CSV export uses a stream over matching records instead of assembling the entire export as one array. Daily backups use SQLite's backup API.

## Local access

The launcher binds to 127.0.0.1. API host checks restrict accepted local hostnames, and mutation requests require the same HTTP origin. These controls do not replace user authentication or file encryption. The program is intended for a trusted, single-user workstation.
