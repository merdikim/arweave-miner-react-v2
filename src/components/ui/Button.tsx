import { FC, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  //isLoading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className: string;
}

const Button: FC<ButtonProps> = ({
  children,
  className,
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border border-black flex items-center justify-center cursor-pointer disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
