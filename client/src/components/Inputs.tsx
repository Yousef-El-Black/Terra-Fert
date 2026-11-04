import SearchIcon from "@mui/icons-material/Search";

export const SearchInput = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (e: string) => void;
}) => {
  return (
    <div className="search-input text-soil relative">
      <SearchIcon className="absolute right-2 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        className="indent-8 bg-field border border-border-strong p-3 w-75 rounded-lg"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
