# Terra Fert

Terra Fert is an Arabic-language agricultural supplies storefront with a React
client, an Express/TypeScript API, and MongoDB persistence. Customers can browse
products and field trials, keep a cart in their browser, and prepare an order
message for WhatsApp. Administrators manage the catalogue, field trials, admin
accounts, and public contact links.

## Project layout

```text
client/
  public/             Static client assets
  src/
    admin/             Admin pages, layout, and authentication guard
    components/        Shared storefront and admin UI
    data/              Demo/local data
    pages/             Storefront pages
    redux/             Cart and message state; cart is persisted in browser storage
    sections/          Homepage and catalogue sections
server/
  src/
    api/               API router and endpoint routers
    config/            Environment configuration
    controllers/       Request handlers
    middleware/        Admin authorization
    models/            Mongoose schemas
    uploads/           Uploaded product and field-trial images
    utils/             Database connection and upload helpers
Demo/                  Design/reference materials
```

## Requirements

- Node.js and npm
- MongoDB, either a local instance or a hosted deployment

Install dependencies separately in `client` and `server`:

```powershell
cd client
npm install

cd ..\server
npm install
```

## Configuration

Create `server/.env` with the following variables:

```dotenv
PORT=3000
MONGO_DB_URI=mongodb://127.0.0.1:27017/terra-fert
JWT_SECRET=replace-with-a-long-random-secret
```

`PORT` is optional (the server defaults to `3000`). `MONGO_DB_URI` and
`JWT_SECRET` must be set for database access and administrator authentication.
Use a unique, high-entropy secret in each deployed environment. Do not commit
environment files or put server secrets in the client configuration.

Create `client/.env.local` and set the API origin:

```dotenv
REACT_APP_SERVER_URL=http://localhost:3000
```

The client uses Vite but is configured to expose both `VITE_` and
`REACT_APP_`-prefixed variables. Only place values safe to expose in browser
code in client environment files.

## Run locally

Start MongoDB, then run the API in a terminal:

```powershell
cd server
npm run dev
```

Start the client in a second terminal:

```powershell
cd client
npm run dev
```

Open the local URL printed by Vite. The API listens on the configured `PORT`
(default `3000`) and exposes routes under `/api`.

## Administrator setup

1. Open `/admin/welcome` or `/admin/login`.
2. When no administrator exists, follow the initial setup flow to register the
   first super-admin.
3. Sign in at `/admin/login`. The client stores the returned token in
   `sessionStorage` or `localStorage`, depending on the remember-me selection.
4. Manage products at `/admin/products`, field trials at `/admin/tests`, admin
   accounts at `/admin/settings`, and public contact links at `/admin/social`.

Normal admin operations require a bearer token. Admin account management and
social-contact management require a super-admin token. The first super-admin
registration is allowed only while the admin collection has no accounts.

## Application features

- Product catalogue, category browsing, search, product detail, and
  availability display.
- Storefront cart saved in browser storage. The cart checks current product
  availability before allowing a WhatsApp order message.
- Product and field-trial image uploads stored by the API in `server/src/uploads`
  and served at `/api/uploads`.
- Public field-trial listings and detail pages.
- Configurable public contact channels (WhatsApp, phone, email, web links, and
  address); active social/contact links are exposed publicly.
- Admin sign-in, initial super-admin registration, product and trial CRUD,
  admin-account management, and social/contact management.

Checkout does not create an order record or process payment. It opens WhatsApp
with a pre-filled message; order confirmation and payment arrangements happen
outside the application.

## HTTP API

All API routes are prefixed with `/api`. Admin-protected routes expect
`Authorization: Bearer <token>`.

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/products` | Public | List products |
| `GET` | `/products/count` | Public | Count products |
| `GET` | `/products/:id` | Public | Get a product |
| `POST` | `/products` | Admin | Create a product |
| `PUT` | `/products/:id` | Admin | Update a product |
| `DELETE` | `/products/:id` | Admin | Delete a product |
| `GET` | `/tests` | Public | List field trials |
| `GET` | `/tests/:id` | Public | Get a field trial |
| `POST` | `/tests` | Admin | Create a field trial |
| `PUT` | `/tests/:id` | Admin | Update a field trial |
| `DELETE` | `/tests/:id` | Admin | Delete a field trial |
| `POST` | `/upload` | Admin | Upload one image as multipart field `image_input` |
| `GET` | `/uploads/:filename` | Public | Serve an uploaded image |
| `GET` | `/admins/setup-status` | Public | Check if initial setup is needed |
| `POST` | `/admins/register-super-admin` | Public, first setup only | Register the initial super-admin |
| `POST` | `/admins/login` | Public | Sign in and receive a bearer token |
| `GET` | `/admins/me` | Admin | Get the current admin identity |
| `GET`, `POST` | `/admins` | Super-admin | List or create admin accounts |
| `GET`, `PUT`, `DELETE` | `/admins/:id` | Super-admin | Read, update, or delete an admin account |
| `GET` | `/social` | Public | List active contact/social links |
| `GET` | `/social/manage` | Super-admin | List all contact/social entries |
| `POST` | `/social` | Super-admin | Create a contact/social entry |
| `PUT`, `DELETE` | `/social/:id` | Super-admin | Update or delete a contact/social entry |

Product availability is represented by `status` (`"متوفر"` or `"غير متوفر"`).
Product image paths are stored in the `images` array. Field trials contain
`title`, `text`, optional `productId`, and `images`.

## Build, lint, and tests

Client production build (includes TypeScript checking):

```powershell
cd client
npm run build
```

Client lint:

```powershell
cd client
npm run lint
```

Server TypeScript build:

```powershell
cd server
npm run build
```

The server package currently has no automated test suite configured; its
`npm test` command is a placeholder that exits with an error.

## Deployment notes

- Build the client with `npm run build` in `client` and serve the generated
  `client/dist` directory from a static host.
- Build and run the API from `server`; provide `PORT`, `MONGO_DB_URI`, and
  `JWT_SECRET` through the deployment platform's secret/configuration manager.
- Set `REACT_APP_SERVER_URL` to the deployed API origin at client build time.
- Persist `server/src/uploads` (or configure durable object storage) if uploaded
  images must survive application restarts or redeployments.
- Configure production CORS for the intended storefront/admin origins before
  exposing the API publicly.
