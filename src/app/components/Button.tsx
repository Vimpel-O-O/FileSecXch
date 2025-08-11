interface Props {
  color: string;
  onClick: () => void;
  children: string;
  disabled?: boolean;
}

const Button = ({ color, disabled, onClick, children }: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`bg-${color}-500 hover:bg-${color}-600 text-white font-bold py-2 px-4 rounded`}
    >
      {children}
    </button>
  );
};

export default Button;
