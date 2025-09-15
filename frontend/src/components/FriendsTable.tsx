'use client';

import { Friend } from '@/types/friends';

interface FriendsTableProps {
  friends: Friend[];
};

export default function FriendsTable({ friends }: FriendsTableProps) {
  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Age</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Favorite Color</th>
            <th className="px-4 py-3">Bio</th>
          </tr>
        </thead>
        <tbody>
          {friends.map((f) => (
            <tr key={f.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{f.fullName}</td>
              <td className="px-4 py-3">{f.age}</td>
              <td className="px-4 py-3">{f.city}</td>
              <td className="px-4 py-3">{f.favoriteColor}</td>
              <td className="px-4 py-3">{f.bio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
