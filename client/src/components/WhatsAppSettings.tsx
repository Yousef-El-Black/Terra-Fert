import axios from "axios";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  WhatsAppSettingsContext,
  type WhatsAppSettingsValue,
} from "./WhatsAppSettingsContext";

type SocialContact = {
  name: string;
  link: string;
  value?: string;
  platform?: string;
};

export const WhatsAppSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadWhatsAppNumber = async () => {
      try {
        const { data } = await axios.get<SocialContact[]>(
          `${serverUrl}/api/social/`,
        );
        const whatsapp = data.find((item) => {
          const name = item.name.toLocaleLowerCase();
          return (
            item.platform === "whatsapp" ||
            name.includes("whatsapp") ||
            name.includes("واتساب")
          );
        });
        const phone = data.find((item) => {
          const name = item.name.toLocaleLowerCase();
          return (
            item.platform === "phone" ||
            name.includes("phone") ||
            name.includes("هاتف")
          );
        });
        if (active) {
          setWhatsappNumber(whatsapp?.value ?? null);
          setPhoneNumber(phone?.value ?? whatsapp?.value ?? null);
        }
      } catch (error) {
        console.error("Failed to load WhatsApp contact:", error);
      }
    };

    void loadWhatsAppNumber();
    return () => {
      active = false;
    };
  }, [serverUrl]);

  const value = useMemo<WhatsAppSettingsValue>(() => {
    const digits = whatsappNumber?.replace(/\D/g, "") ?? "";
    return {
      whatsappLink:
        digits.length >= 7 && digits.length <= 15
          ? `https://wa.me/${digits}`
          : null,
      contactNumber: phoneNumber,
    };
  }, [phoneNumber, whatsappNumber]);

  return (
    <WhatsAppSettingsContext.Provider value={value}>
      {children}
    </WhatsAppSettingsContext.Provider>
  );
};
