import UserInfo from "@/app/container/profile/userinfo";
import Mugitory from "@/app/container/profile/mugitory";
import UserFlow from "@/app/container/profile/userflow";


export default async function Page() {
  return (
    <div>
      <UserInfo />
      <Mugitory />
      <UserFlow />
    </div>
  );
}
