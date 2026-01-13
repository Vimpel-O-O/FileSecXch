interface Props {
  color: string;
  onClick: () => void;
  children: string;
  disabled?: boolean;
}

const Button = ({ color, disabled, onClick, children }: Props) => {
  // Define color variants that Tailwind can detect during build
  const colorVariants = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    gray: "bg-gray-500 hover:bg-gray-600",
  };

  const colorClass =
    colorVariants[color as keyof typeof colorVariants] || colorVariants.blue;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${colorClass} text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
    >
      {children}
    </button>
  );
};

export default Button;
