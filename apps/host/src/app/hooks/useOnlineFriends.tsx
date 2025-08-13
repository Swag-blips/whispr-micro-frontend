import { useEffect, useState } from "react";
import { getFriends } from "../services/user";
import { User } from "../types/types";
import { useSWRConfig } from "swr";
import { useSocket } from "../context/SocketContext";

export const useOnlineFriends = () => {
  const { cache, mutate } = useSWRConfig();
  const { onlineUsers } = useSocket();
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);

  const [friendsAvailable, setFriendsAvailable] = useState(false);

  let friends = cache.get("friends")?.data;

  const getFriendsFetcher = async () => {
    try {
      const friends = await getFriends();

      return friends.friends;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!friends) {
      const freshData = async () => {
        try {
          const data = await getFriendsFetcher();

          mutate("friends", data, false);
          friends = data;
          setFriendsAvailable(true);
          return data;
        } catch (error) {
          console.error(error);
        }
      };

      freshData();
    }
  }, []);

  useEffect(() => {
    console.log("friends when renddered or rerendered", friends);
    if (friendsAvailable) {
      console.log("friends gotten", friends);
      const onlineFriends = friends.friends
        ? friends.friends.filter((friend: User) =>
            onlineUsers.includes(friend._id)
          )
        : friends.filter((friend: User) => onlineUsers.includes(friend._id));

      setOnlineFriends(onlineFriends);
    }
  }, [onlineUsers, friendsAvailable]);

  return { onlineFriends };
};
