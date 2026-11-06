import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export const PrimaryBtn = ({
  text,
  icon,
  link,
}: {
  text: string;
  icon?: ReactNode;
  link: string;
}) => {
  return (
    <Link
      to={link}
      className="bg-soil text-paper flex justify-center items-center gap-2 px-4 py-3 w-fit rounded-md label-lg hover:bg-soil-deep"
    >
      {icon && icon} {text}
    </Link>
  );
};

export const WhatsappBtn = ({
  text,
  icon,
  link,
}: {
  text: string;
  icon: ReactNode;
  link: string | null;
}) => {
  if (!link) return null;

  return (
    <a
      className="bg-whatsapp text-paper flex justify-center items-center gap-2 px-4 py-3 w-fit rounded-md label-lg hover:bg-whatsapp-hover"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon} {text}
    </a>
  );
};

export const WhatsappOrderBtn = ({
  text,
  icon,
  link,
  message,
}: {
  text: string;
  icon: ReactNode;
  link: string | null;
  message: string;
}) => {
  if (!link) return null;

  return (
    <a
      className="bg-whatsapp text-paper flex justify-center items-center gap-2 px-4 py-3 w-full rounded-md label-lg hover:bg-whatsapp-hover"
      href={`${link}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon} {text}
    </a>
  );
};

export const AddToCartBtn = ({
  text,
  icon,
  onClick,
}: {
  text: string;
  icon?: ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className="bg-soil text-paper cursor-pointer flex justify-center items-center gap-2 px-4 py-3 w-full rounded-md label-lg hover:bg-soil-deep"
      onClick={onClick}
    >
      {icon && icon} {text}
    </button>
  );
};
