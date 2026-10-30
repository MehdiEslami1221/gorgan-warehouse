# Gorgan Warehouse

A Persian, right-to-left inventory management application for a single storekeeper working on one computer. Designed around the warehouse workflow of Gorgan Municipality, District 2.

**Developer: Mehdi Eslami** · [Website](https://ejrasys.ir) · [Instagram](https://www.instagram.com/mage.code/)

This is a portfolio project. It does not imply official municipal endorsement or a verified production deployment.

## Features

- Dashboard with Tehran time, Persian calendar dates, stock alerts and recent documents.
- Product catalog with selectable measurement units, storage location, category and minimum-stock threshold.
- Automatically generated record and document identifiers.
- Opening balances and incoming stock receipts.
- Departments and employees, with multi-item delivery documents and signature-ready receipts.
- Supplier purchase orders and complete-order receiving.
- A4 document printing with repeating table headers.
- Filtered movement reports and Excel-compatible CSV exports.
- Daily backups, manual backup downloads, offline restore and an audit history.
- Responsive RTL navigation, local assets and a developer profile page.

## Technology

| Layer | Technology |
| --- | --- |
| Application | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 and named CSS classes |
| Storage | SQLite through Node.js `node:sqlite` |
| Calendar | jalaali-js and Intl date formatting |
| Icons | Lucide React |
| Distribution | Next.js standalone server and Windows launcher |

## Quick start

Requirements: Node.js **24.16 or later in the 24.x series**, and npm.

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:3000`. Installing dependencies requires internet access. The prepared production distribution runs locally without internet access.

The database is created in `data/` on first use. Never commit this directory, backup files or real warehouse records.

## Test and build

```bash
npm test
npm run build
```

The build generates a standalone server. See [Development](docs/DEVELOPMENT.md) for production startup and Windows packaging.

## Inventory integrity

Document headers, lines and stock changes are written in a single transaction. An invalid line rolls back the whole operation. Quantities are stored as scaled integers with three decimal places. Outgoing documents cannot exceed current stock, and duplicate request tokens do not create duplicate documents.

Orders do not change inventory until a receipt is posted. Posted documents cannot be edited or deleted; cancellation reverses their effect while preserving the audit trail. Product and recipient names are captured when the document is posted, so later changes to master records do not rewrite historical documents.

## Project structure

```text
app/                 Application entry points, API and global styles
components/          Dashboard, catalogs, documents, reports and print views
lib/                 SQLite schema, transactions, validation and shared types
scripts/             Launch, stop, restore and distribution packaging
public/              Local static assets
tests/              Inventory and browser-launcher tests
docs/               User, development and testing documentation
```

## Documentation

- [User guide](docs/USER-GUIDE.md)
- [Development and packaging](docs/DEVELOPMENT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Testing and limitations](TEST-REPORT.md)
- [Persian user guide](docs/USER-GUIDE.fa.md)
- [Optional fonts](public/fonts/README.md)

## Scope and limitations

This version supports one warehouse and one local operator. It does not include authentication, financial accounting, cost valuation or multi-user access. Partial purchase-order deliveries require independent receipts; automatic remaining-order tracking is not implemented.

Stock validation uses current balances. Backdated documents do not revalidate historical running balances. CSV is supported; native XLSX export is not. Reports show paginated detail and a maximum of 500 item/name groups in their summary.

The production build, inventory tests and browser UI were checked on Linux. Windows browser-launch commands were tested with a simulated runner. Actual Windows desktop launch, physical printers and multi-day soak tests have not been verified.

## Fonts and licensing

The public source package does not redistribute the supplied IRANSansX font files. It uses the system fallback font. Add a licensed copy locally if needed; instructions are in the font directory.

No open-source license has been selected for this project's own code. Public visibility alone does not grant a redistribution license. Third-party dependencies remain subject to their respective licenses.

## Contact

**Mehdi Eslami**  
Website: https://ejrasys.ir  
Instagram: https://www.instagram.com/mage.code/  
