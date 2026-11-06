import { useContext } from "react";
import { WhatsAppSettingsContext } from "./WhatsAppSettingsContext";

export const useWhatsAppSettings = () => useContext(WhatsAppSettingsContext);
