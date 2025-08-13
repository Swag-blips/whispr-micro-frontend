import { useEffect, useRef, useState } from "react";
import { getFriends } from "../services/user";
import { User } from "../types/types";
import { useSWRConfig } from "swr";
import { useSocket } from "../context/SocketContext";
import gsap from "gsap";

export const useOnlineFriends = () => {
  const { cache, mutate } = useSWRConfig();
  const { onlineUsers } = useSocket();

  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);

  const [friendsAvailable, setFriendsAvailable] = useState(false);

  const friendRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
    } else {
      setFriendsAvailable(true);
    }
  }, []);

  useEffect(() => {
    if (friendsAvailable) {
      // Filter friends who are online
      const updatedOnlineFriends = friends.friends
        ? friends.friends.filter((friend: User) =>
            onlineUsers.includes(friend._id)
          )
        : friends.filter((friend: User) => onlineUsers.includes(friend._id));

      const removedFriends = onlineFriends.filter(
        (f) => !updatedOnlineFriends.some((nf: User) => nf._id === f._id)
      );

      removedFriends.forEach((friend) => {
        const node = friendRefs.current[friend._id];
        if (node) {
          gsap.to(node, {
            opacity: 0,
            y: -10,
            duration: 0.4,
            onComplete: () => {
              setOnlineFriends((prev) =>
                prev.filter((f) => f._id !== friend._id)
              );
            },
          });
        }
      });

      const newFriends = updatedOnlineFriends.filter(
        (f: User) => !onlineFriends.some((of) => of._id === f._id)
      );

      if (newFriends.length > 0) {
        setOnlineFriends((prev) => [...prev, ...newFriends]);
        setTimeout(() => {
          newFriends.forEach((friend: User) => {
            const node = friendRefs.current[friend._id];
            if (node) {
              gsap.fromTo(
                node,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4 }
              );
            }
          });
        }, 0);
      }
    }
  }, [onlineUsers, friendsAvailable]);

  const registerFriendRef = (id: string, el: HTMLDivElement | null) => {
    friendRefs.current[id] = el;
  };

  return { onlineFriends, registerFriendRef };
};
