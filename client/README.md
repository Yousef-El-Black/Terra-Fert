# Terra Fert client

The client is the React, TypeScript, and Vite storefront and admin interface.
For full project setup, environment configuration, API reference, and deployment
instructions, see the [project documentation](../README.md).

## Client commands

Run these commands from `client/`:

```powershell
npm install
npm run dev
npm run lint
npm run build
```

Set `REACT_APP_SERVER_URL` in `client/.env.local` to the API origin before
running or building the client. Client environment values are bundled into
browser code and must not contain secrets.
