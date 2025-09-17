import { Friend } from "@/types/friends";
import { apiRequest } from "./api"

export const getFriends = async () => {
  return apiRequest<Friend[]>(`/api/friends`, { cache: 'no-store' });
}

export async function createFriend(input: Friend): Promise<Friend> {
  return apiRequest<Friend>(`/api/friends`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function updateFriend(input: Friend): Promise<Friend> {
  return apiRequest<Friend>(`/api/friends/${input.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function createOrUpdateFriend(input: Friend, update: boolean): Promise<Friend> {
  return update ? updateFriend(input) : createFriend(input);
}

export async function deleteFriend(id: string): Promise<void> {
  return apiRequest<void>(`/api/friends/${id}`, {
    method: 'DELETE',
  });
};
