# Verification report

Verified during development on 2026-10-30.

## Completed

- TypeScript and Next.js production build.
- Atomic stock transactions, fractional quantities and rollback of invalid multi-line documents.
- Rejection of insufficient stock, duplicate items, invalid quantities and dates.
- Retry idempotency, repeated cancellation and purchase-order receipt dependencies.
- Historical product/recipient snapshots and department filtering.
- SQLite backup integrity and stock consistency.
- Production HTTP tests for document creation, origin checks and CSV output.
- Headless Chromium checks on Linux for navigation, product creation, Persian calendar, document/report PDF and responsive layout.
- Developer profile contact links and absence of developer-name credits outside that page.
- Standalone launcher startup and reuse of the same server on a second launch.
- Browser-command unit tests: PowerShell success, cmd fallback and failure handling.
- Windows Node executable checksum was checked against the distributor's checksum file for the separately prepared executable distribution.

## Not verified

- Actual default-browser opening on a Windows desktop. Windows-specific launch commands were tested with a simulated command runner.
- Physical office printers.
- Multi-day soak testing or guaranteed crash-free operation.

Run the included automated tests with `npm test`. The historical UI checks do not constitute a full regression suite. The public-source variant uses system fallback fonts instead of the supplied IRANSansX binaries.
