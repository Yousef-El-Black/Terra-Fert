export const CategoryTag = ({
  text,
  value,
  isActive,
  setActiveTag,
}: {
  text: string;
  value: string;
  isActive: boolean;
  setActiveTag: (value: string) => void;
}) => {
  return (
    <span
      className={`cursor-pointer px-3 py-1 rounded-full text-center flex justify-center items-center text-sm ${
        isActive
          ? "bg-soil text-white  border border-soil"
          : "bg-field text-muted border border-border-strong"
      }`}
      onClick={() => setActiveTag(value)}
    >
      {text}
    </span>
  );
};
