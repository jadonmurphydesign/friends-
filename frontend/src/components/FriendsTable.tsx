'use client';

import { Friend } from '@/types/friends';

interface FriendsTableProps {
  friends: Friend[];
  setModalOpen: (friend: Friend) => void;
}

export default function FriendsTable({ friends, setModalOpen }: FriendsTableProps) {

  const handleEdit = (friend: Friend) => {
    setModalOpen(friend);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <p className="mt-2 text-sm text-gray-700">
            A list of all your friends including their name, age, city, favorite color, and bio.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="relative min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Age</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">City</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Favorite Color</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Bio</th>
                  <th className="py-3.5 pr-4 pl-3 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {friends.map((f: Friend) => (
                  <tr key={f.id}>
                    <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">{f.fullName}</td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{f.age}</td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{f.city}</td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{f.favoriteColor}</td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{f.bio}</td>
                    <td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                      <button
                        type="button"
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => handleEdit(f)}
                      >
                        Edit<span className="sr-only">, {f.fullName}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
 