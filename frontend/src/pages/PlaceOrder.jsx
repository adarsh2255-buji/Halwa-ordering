import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

const PlaceOrder = () => {
  const location = useLocation();
  const selectedProduct = location.state?.product || null;

  const [orderItems, setOrderItems] = useState(
    selectedProduct
      ? [{ product: selectedProduct._id, name: selectedProduct.name, price: selectedProduct.price, quantity: 1 }]
      : []
  );
  const [shippingAddressId, setShippingAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [addresses, setAddresses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/auth/address', { withCredentials: true });
        const fetchedAddress = response.data?.address; // Handle single address object
  
        if (fetchedAddress) {
          setAddresses([fetchedAddress]); // Wrap single address in an array for consistency
          setShippingAddressId(fetchedAddress._id); // Default to the fetched address
        } else {
          setAddresses([]); // No addresses found
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        setMessage('Failed to load addresses');
      }
    };
  
    fetchAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        '/auth/order',
        {
          orderItems,
          shippingAddressId,
          paymentMethod,
        },
        { withCredentials: true }
      );
      setMessage('Order placed successfully!');
      setOrderItems([]);
    } catch (error) {
      console.error('Error placing order:', error);
      setMessage('Failed to place order');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Place Order</h2>
      <form onSubmit={handleSubmit}>
        {/* Shipping Address */}
        <div className="mb-4">
          <label className="block mb-2">Select Shipping Address:</label>
          {addresses.length > 0 ? (
            <select
              value={shippingAddressId}
              onChange={(e) => setShippingAddressId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              {addresses.map((address) => (
                <option key={address._id} value={address._id}>
                  {address.houseName}, {address.locality}, {address.state}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-red-500">No addresses found. Please add an address.</p>
          )}
        </div>

        {/* Order Items */}
        <div className="mb-4">
          <h4 className="font-bold mb-2">Order Items:</h4>
          {orderItems.map((item, index) => (
            <div key={index} className="mb-2">
              <span>{item.name}</span> - <span>₹{item.price}</span> -{' '}
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => {
                  const updatedItems = [...orderItems];
                  updatedItems[index].quantity = parseInt(e.target.value, 10);
                  setOrderItems(updatedItems);
                }}
                className="w-12 border rounded p-1"
              />
            </div>
          ))}
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block mb-2">Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={addresses.length === 0}
        >
          Place Order
        </button>
      </form>

      {/* Message */}
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default PlaceOrder;
