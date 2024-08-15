"use client";

type IconProps = {
  tailwindCSS?: string;
  color?: string;
  size?: string;
  onClick?: () => void;
};

function IconPlay({ tailwindCSS, color, size, onClick }: IconProps) {
  return (
    <svg
      fill={color ? color : "#f1f609"}
      viewBox="0 0 16 16"
      height={size ? size : "5em"}
      width={size ? size : "5em"}
      className={tailwindCSS}
      onClick={onClick}
    >
      <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z" />
    </svg>
  );
}

export default IconPlay;
