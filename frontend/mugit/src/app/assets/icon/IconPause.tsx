"use client";

type IconProps = {
  tailwindCSS: string;
  color?: string;
  size?: string;
  onClick?: () => void;
};

function IconPause({ tailwindCSS, color, size, onClick }: IconProps) {
  return (
    <svg
      viewBox="0 0 530 1000"
      fill={color ? color : "#f1f609"}
      height={size ? size : "5em"}
      width={size ? size : "5em"}
      className={tailwindCSS}
      onClick={onClick}
    >
      <path d="M440 150c60 0 90 21.333 90 64v570c0 44-30 66-90 66s-90-22-90-66V214c0-42.667 30-64 90-64m-350 0c60 0 90 21.333 90 64v570c0 44-30 66-90 66S0 828 0 784V214c0-42.667 30-64 90-64" />
    </svg>
  );
}

export default IconPause;
