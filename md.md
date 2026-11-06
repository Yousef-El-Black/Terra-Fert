1. **checkout doesn’t create or send an order.** The cart collects customer details, but the WhatsApp button only opens a chat; it doesn’t include the cart items or form details. There’s also no order API. See `Cart.tsx` and `Btns.tsx`.
2. **High — Admin writes aren’t protected server-sidepm run dev** See `product.routes.ts`, `test.routes.ts`, and `upload.routes.ts`.
3. **Medium — Test deletion can’t work.** The client sends `DELETE /api/tests/:id`, but no matching server route is defined. See `Cards.tsx` and `test.routes.ts`.
4. **Medium — Unavailable products can still be purchased.** Product views don’t use the availability status to prevent adding unavailable items to the cart. See `Cards.tsx` and `Product.tsx`.
5. **Medium — Client lint fails.** `npm run lint` reports an error in `WhatsAppSettings.tsx` because the file exports both a component and a hook. It also reports 10 missing-effect-dependency warnings across client pages and components.
6. **Important repo hygiene — `.env` is tracked and modified.** Keep it out of commits; remove it from version control and rotate any credentials that have been pushed.
