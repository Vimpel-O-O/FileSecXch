interface Props {
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ value, onChange, placeholder }: Props) => {
  return (
    <div className=" flex items-center justify-center">
      <input
        value={value}
        onChange={onChange}
        type="text"
        placeholder={placeholder}
        className="w-1/2 px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Input;
