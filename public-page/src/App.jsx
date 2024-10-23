import React from 'react';
import ItemCard from './Components/ItemCard.jsx'

export default function SCEatsAdmin() {
  return (
    <div className='m-10'>
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
        SCEats Admin Page
      </h1>
      <ItemCard />
    </div>
  )
}

