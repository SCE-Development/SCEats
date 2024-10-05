import React from 'react';

export default function NavBar() {
  return (
    <div className="w-full rounded-lg px-3 pt-3 h-full max-h-[8vh] flex flex-col">
      <div className="navbar bg-base-200 rounded-lg h-full">
        <div className="navbar-start">
        </div>

        <div className="navbar-center">
          <h2 className="text-2xl font-bold">SCEats</h2>
        </div>

        <div className='navbar-end' />

      </div>
    </div>
  );
}
