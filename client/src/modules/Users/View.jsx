import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../hooks/AuthContext';
import axiosInstance from '../../api/axiosInstance';

function View() {
  const { user } = useContext(AuthContext);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const loadPrfileImage = async () => {
    await axiosInstance.get(`/users/profile-image/${user.emailId}`, { responseType: 'blob' })
      .then(response => {
        const imageUrl = URL.createObjectURL(response.data);
        setProfileImageUrl(imageUrl);
      })
      .catch(() => setProfileImageUrl(null));
  }

  useEffect(() => {
    if (user) {
      loadPrfileImage();
    }
  }, [user]);

  if (!user) {
    return <div className="flex justify-center items-center h-full">No user data found.</div>;
  }

  return (
    <div className='my-1.5 md:w-1/3 w-screen md:h-[calc(100vh-8rem)] h-[calc(100vh-15rem)] rounded-lg flex flex-col gap-2 justify-center items-center mx-auto md:bg-yellow-50/50 md:dark:bg-cyan-900/50 md:shadow-sm md:border-2 md:border-yellow-300 md:dark:border-cyan-500'>
      <div className="md:w-40 md:h-40 w-64 h-64 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-2 flex items-center justify-center">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-6xl text-gray-400 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="md:size-36 size-56 stroke-gray-800 dark:stroke-gray-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </span>
        )}
      </div>
      <div className="md:text-2xl text-5xl font-bold text-gray-800 dark:text-gray-200">
        {user.firstName} {user.lastName}
      </div>
      <div className="md:text-lg text-3xl text-gray-600 font-semibold dark:text-gray-400">{user.emailId}</div>
      <div className='px-6 py-4 md:text-md text-xl flex flex-col gap-3'>
        <div className="flex flex-row gap-4">
          <div className="font-semibold text-gray-700 dark:text-gray-300 w-32">Phone:</div>
          <div className="text-gray-800 dark:text-gray-200">{user.phone || '-'}</div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </div>
        <div className="flex flex-row gap-4">
          <div className="font-semibold text-gray-700 dark:text-gray-300 w-32">Date of Birth:</div>
          <div className="text-gray-800 dark:text-gray-200">{user.dob ? new Date(user.dob).toLocaleDateString() : '-'}</div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="font-semibold text-gray-700 dark:text-gray-300 w-32">Anniversary:</div>
          <div className="text-gray-800 dark:text-gray-200">{user.anniversary ? new Date(user.anniversary).toLocaleDateString() : '-'}</div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default View;
