'use client';

import React, { useState, useEffect } from 'react';
import FriendsTable from '@/components/FriendsTable';
import { Friend } from '@/types/friends';
import { getFriends } from '@/services/friends';
import AddFriendModal from './AddFriendModal';
export default function Home() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null); // tbd: do something with this maybe
  // just going to refresh the router on create cus i dont feel like proper state management
  // i just tryna learn some c# dude

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await getFriends();
        setFriends(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-5xl p-6">Loading...</div>;
  } else if (!loading && friends.length === 0) {
    return <div className="mx-auto max-w-5xl p-6">No friends found - you are lonely.</div>;
  };

  return (
    <main className="mx-auto max-w-5xl p-6">
      <AddFriendModal
        open={modalOpen}
        setOpen={setModalOpen}
        onCreated={(friend: Friend) => setFriends([...friends, friend])}
      />
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-semibold mb-4">Friends</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200"
        >
          Add Friend
        </button>
      </div>
      <FriendsTable friends={friends} />
    </main>
  );
}
