'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FriendsTable from '@/components/FriendsTable';
import { Friend } from '@/types/friends';
import { getFriends } from '@/services/friends';
import { handleLogout } from '@/services/auth'; 
import AddFriendModal from './AddFriendModal';
export default function Home() {
  const router = useRouter();

  const logout = async () => {
    await handleLogout();
    router.push('/');
  };
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState<boolean | Friend>(false);
  const [error, setError] = useState<string | null>(null); // tbd: do something with this maybe
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

  const handleOnComplete = (friend: Friend, isDelete: boolean) => {
    const existingFriendIndex = friends.findIndex(f => f.id === friend.id);
    if (existingFriendIndex !== -1) {
      if(isDelete) {
        const updatedFriends = friends.filter(f => f.id !== friend.id);
        setFriends(updatedFriends);
      } else {
        const updatedFriends = [...friends];
        updatedFriends[existingFriendIndex] = friend;
        setFriends(updatedFriends);
      }
    } else {
      setFriends([...friends, friend]);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-5xl p-6">Loading...</div>;
  } else if (!loading && friends.length === 0) {
    return <div className="mx-auto max-w-5xl p-6">No friends found - you are lonely.</div>;
  };

  return (
    <main className="mx-auto max-w-5xl p-6 relative">
      {/* Absolute Logout Button */}
      <button
        onClick={logout}
        className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium shadow-md hover:bg-red-600 active:scale-95 transition-all duration-200"
        style={{ position: 'absolute', top: 24, right: 24, zIndex: 50 }}
      >
        Logout
      </button>
      <AddFriendModal
        open={modalOpen}
        setOpen={setModalOpen}
        onComplete={handleOnComplete}
      />
      <div className="flex justify-between items-center w-full mt-12 mb-6">
        <h1 className="text-2xl font-semibold mb-4">Friends</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200"
        >
          Add Friend
        </button>
      </div>
      <FriendsTable friends={friends} setModalOpen={setModalOpen} />
    </main>
  );
}
