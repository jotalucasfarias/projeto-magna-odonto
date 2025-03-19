import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

export function Button({ text, onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`items-center font-bold bg-primary-dark-blue text-white px-6 py-3 rounded-full 
      hover:bg-hover-blue transition-colors cursor-pointer ${className}`}
    >
      {text}
    </button>
  );
}
