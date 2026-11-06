import { createContext } from "react";

export type WhatsAppSettingsValue = {
  whatsappLink: string | null;
  contactNumber: string | null;
};

export const WhatsAppSettingsContext = createContext<WhatsAppSettingsValue>({
  whatsappLink: null,
  contactNumber: null,
});
