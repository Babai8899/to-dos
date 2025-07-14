import React, { useContext } from 'react'
import AuthContext from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/user/view');
  };
  return (
    <div className="flex justify-center w-1/2 mx-auto my-10">
      <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300" onClick={handleGetStarted}>view</a>
      <div className="divider divider-horizontal"></div>
      <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300">Watch Demo</a>
    </div>
  )
}

export default Home
