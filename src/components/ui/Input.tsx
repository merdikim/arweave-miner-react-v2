import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={`mb-4 mt-2 w-full rounded-md border border-gray-300 text-sm sm:text-base px-2 sm:px-4 py-2 text-gray-700 focus:border-green-300 invalid:border-red-500 focus:outline-none
            ${className}`}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
