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
      <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-2 flex items-center justify-center">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="object-cover w-full h-full"
          />
          ) : ( 
          <span className="text-6xl text-gray-400 dark:text-gray-500">👤</span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        {user.firstName} {user.lastName}
      </div>
      <div className="text-lg text-gray-500 font-semibold dark:text-gray-400">{user.emailId}</div>
      <div className='px-6 py-4 w-full flex flex-col gap-3'>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="font-semibold text-gray-700 dark:text-gray-300 w-32">Phone:</div>
          <div className="text-gray-800 dark:text-gray-200">{user.phone || '-'}</div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="font-semibold text-gray-700 dark:text-gray-300 w-32">Date of Birth:</div>
          <div className="text-gray-800 dark:text-gray-200">{user.dob ? new Date(user.dob).toLocaleDateString() : '-'}</div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="font-semibold text-gray-700 dark:text-gray-300 w-32">Anniversary:</div>
          <div className="text-gray-800 dark:text-gray-200">{user.anniversary ? new Date(user.anniversary).toLocaleDateString() : '-'}</div>
        </div>
      </div>
    </div>
  );
}

export default View;
