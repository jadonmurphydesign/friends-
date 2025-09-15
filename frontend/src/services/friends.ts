import { urlBase } from "./urlBase";
import { Friend } from "@/types/friends";

export const getFriends = async () => {
  const res = await fetch(`${urlBase}/api/friends`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch friends');
  }
  return res.json();
};

export async function createFriend(input: Friend): Promise<Friend> {
  const res = await fetch(`${urlBase}/api/friends`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create failed: ${res.status} ${text}`);
  }

  return res.json();
}