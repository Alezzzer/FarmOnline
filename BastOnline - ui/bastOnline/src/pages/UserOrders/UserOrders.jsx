import React, { useEffect, useState } from 'react';
import './UserOrders.css'; 
import { assets } from '../../assets/assets';
import axios from 'axios';

const UserOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/farm/myprofile/${userId}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Greška pri dohvatanju korisničkih porudžbina:', error);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [userId]);

  return (
    <div className="myorders">
      <h3>My Orders</h3>
      <div className="myorders-list">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="myorders-item">
              <img src={assets.parcel_icon} alt="parcel" />

              <div className="myorders-columns">
                <div className="myorders-col">
                  <h4>Products</h4>
                  <p className="myorders-item-product">
                    {order.items?.map((item, i) => (
                      <span key={i}>
                        {item.product.name} x {item.quantity} {item.product.category === 'Eggs' ? 'pcs' : 'kg'}
                        {i < order.items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="myorders-col">
                  <h4>Shipping Info</h4>
                  <p><strong>Name:</strong> {order.userName || 'N/A'}</p>
                  <p><strong>Address:</strong> {order.userAddress || 'N/A'}</p>
                  <p><strong>Phone:</strong> {order.userPhone || 'N/A'}</p>
                </div>

                <div className="myorders-col">
                  <h4>Details</h4>
                  <p><strong>Total:</strong> ${order.finalPrice}</p>
                  <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                </div>

                <div className="myorders-col">
                  <h4>Status</h4>
                  <strong>   <p>{order.approved ? 'Package has been sent' : 'Pending'}</p></strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserOrders;
