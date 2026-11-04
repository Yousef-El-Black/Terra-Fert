export const YellowBadge = ({ text }: { text: string }) => {
  return (
    <span className="block py-1 px-3 bg-wheat-tint text-soil rounded-full label-lg w-fit">
      {text}
    </span>
  );
};

export const AvailableBadge = ({ text }: { text: string }) => {
  return (
    <span className="block py-1 px-3 bg-leaf-tint text-leaf rounded-full label-lg w-fit">
      {text}
    </span>
  );
};

export const UnavailableBadge = ({ text }: { text: string }) => {
  return (
    <span className="block py-1 px-3 bg-danger-tint text-danger rounded-full label-lg w-fit">
      {text}
    </span>
  );
};
