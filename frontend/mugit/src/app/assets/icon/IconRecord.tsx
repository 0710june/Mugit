"use client";

type IconProps = {
  tailwindCSS?: string;
  color?: string;
  size?: string;
  onClick?: () => void;
};

function IconRecord({ tailwindCSS, color, size, onClick }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill={color ? color : "#686868"}
      height={size ? size : "1.5em"}
      width={size ? size : "1.5em"}
      onClick={onClick}
      className={tailwindCSS}
    >
      <path d="M8 6a2 2 0 100 4 2 2 0 000-4zm0 3a1 1 0 110-2 1 1 0 010 2z" />
      <path d="M16 8A8 8 0 110 8a8 8 0 0116 0zM4 8a4 4 0 108 0 4 4 0 00-8 0z" />
    </svg>
  );
}

export default IconRecord;
