import React from 'react';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function SCEatsAdmin() {
  const [foods] = useState([]);
  const [name, setName] = useState();
  const [photo, setPhoto] = useState();
  const [price, setPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [expiration, setExpiration] = useState();

  const INPUT_CLASS = 'indent-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-white';

  return (
    <div className='m-10'>
      <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        SCEats Admin Page
      </h1>

      {/* Field Inputs for Food name, photo URL, quantity, price, expiration */}
      <div className="mt-10 flex flex-col md:grid md:grid-cols-1 md:gap-x-6 md:gap-y-8 lg:flex lg:flex-row md:flex-wrap lg:gap-x-6 lg:gap-y-8">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="name" className='block text-sm font-medium leading-6 text-gray-300'>
            Food Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="For example, Cheetos"
              value={name}
              onChange={e => setName(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="photo" className='block text-sm font-medium leading-6 text-gray-300'>
            Photo
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="photo"
              id="photo"
              value={photo}
              onChange={e => setPhoto(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="price" className='block text-sm font-medium leading-6 text-gray-300'>
            Price
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="price"
              id="price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="quantity" className='block text-sm font-medium leading-6 text-gray-300'>
            Quantity
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="quantity"
              id="quantity"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="expiration" className='block text-sm font-medium leading-6 text-gray-300'>
            Expiration Date
          </label>
          <div className="mt-2">
            <DatePicker
              name="expiration"
              id="expiration"
              selected={expiration}
              onChange={(date) => setExpiration(date)}
              dateFormat="MM-dd-y"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>

      {/* Grid of Food */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {foods.map(food => (
          <div key={food._id} className="border p-4 rounded-lg shadow-md">
            <img
              src={food.photo}
              alt={food.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-xl font-bold">{food.name}</h2>
            <p className="text-white-700 mt-1">Price: ${food.price.toFixed(2)}</p>
            <p className="text-white-700 mt-1">Quantity: {food.quantity}</p>
            <p className="text-white-700">Expiration: {food.expiration ? new Date(food.expiration).toLocaleDateString() : 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
