import Image from "next/image";
import { flocalUrl, mugitUrl } from "@/app/store/atoms";
import { useLocale } from "next-intl";
import { prevpathAtom } from "@/app/store/atoms/user";
import { useSetAtom } from "jotai";
import { usePathname } from "next/navigation";

export default function GoogleButton() {
  const locale = useLocale();
  const pathname = usePathname();
  const setPrevpath = useSetAtom(prevpathAtom);

  const onClick = () => {
    setPrevpath(pathname);
  };
  return (
    <a
      className="pr-4 lg:mt-0"
      // 로컬에서 로그인
      // href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${flocalUrl}/${locale}/sns-login&response_type=token&scope=email profile`}
      // 서버에서 로그인
      href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=1030973932319-sloqb8tnddt8e4p0gjk3vs585dlc9cgd.apps.googleusercontent.com&redirect_uri=${mugitUrl}/${locale}/sns-login&response_type=token&scope=email profile`}
      onClick={onClick}
    >
      <Image
        src="/google/web_dark_sq_ctn@2x.png"
        alt=""
        width={150}
        height={32}
        style={{ width: 150, height: 32 }}
        priority
      />
    </a>
  );
}
