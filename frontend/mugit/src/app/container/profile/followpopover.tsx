import { Popover, Transition } from "@headlessui/react";
import { apiUrl } from "@/app/store/atoms";
import { useState } from "react";

const fetchFollowers = async (type: string) => {
  const response = await fetch(apiUrl + `/users/${type}`, {
    credentials: "include",
  });
  return response.json();
};

export default function FollowPopover({
  number,
  type,
}: {
  number: string;
  type: string;
}) {
  const [users, setUsers] = useState([
    {
      followerId: 0,
      followerNickName: "",
      followerProfileText: "",
      followerProfileImagePath: "",
    },
  ]);
  const getUsers = () => {
    fetch(apiUrl + `/users/${type}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setUsers(data.list));
  };
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className="text-2xl focus:outline-none"
            onClick={open ? () => "" : getUsers}
          >
            {number}
          </Popover.Button>
          <Popover.Panel className="absolute z-10">
            <div className="h-60 w-40 border border-solid border-black bg-white">
              {users.map((user) => (
                <div key={user.followerId}>
                  <p>{user.followerNickName}</p>
                </div>
              ))}
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}
