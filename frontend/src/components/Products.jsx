import React, { useEffect, useState } from 'react'
import api from '../api/index';
import { useNavigate } from 'react-router-dom'

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/product');
        console.log(response.data)
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
    fetchProducts();
  }, [])

  //Buy button
  const handleBuyButton = (product) => {
    navigate('/order/new', { state : { product }})
  };

  if(loading) return <p className='text-center'>Loading products...</p>
  if(error) return <p className='text-center text-red-500'>Error: {error}</p>
  return (
    <>
    <div className="container mx-auto px-4 py-6">
      <h1 className='text-3xl font-bold text-center mt-12 mb-6'>Our Halwa Selection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {
          products.map((product) => (
            <div key={product._id} className='border rounded-lg shadow-md p-4'>
              <img 
              src={product.image}
              alt={product.name}
              className='w-full h-48 object-cover rounded-md mb-4' />
              <h2 className='text-xl font-semibold mb-2'>{product.name}</h2>
              <p className='text-gray-700 mb-2'>{product.description}</p>
              <p className='text-lg font-bold mb-4'>₹{product.price}</p>
              <button 
              className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
              onClick={() => handleBuyButton(product)}>
                Buy
              </button> 
              <button className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ml-2'>
                Add To Cart
              </button>
            </div>
          ))
        }
      </div>
    </div>
    </>
  )
}

export default Products