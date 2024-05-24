// import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
// import { InputNumber } from 'primereact/inputnumber';
import './shoppingCart.css';

// onAddToCart, onDecreaseFromCart,

const ShoppingCart = ({ cartItems, onRemoveFromCart,totalPrice, discountInfo, discountCampaigns, handleRemoveCampaign }) => {
  return (
    <div className='mainshopping'>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div className="all-card">
          <div className='dialog-product'>
            {cartItems.map((item, index) => (
              <div className='dialog-card' key={index} style={{ border: '1px solid #ccc', padding: '16px', margin: '16px' }}>
                <img src={item.img} alt={item.title} style={{ width: '50px' }} />
                <h3>{item.title}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                {item.discount && <p>Discount: ${item.discount.toFixed(2)}</p>}
                <p>Quantity: {item.quantity}</p>
                {/* <div className="quantity-controls">
                    <Button className="p-button-rounded p-button-text p-button-sm" label="-" onClick={() => onDecreaseFromCart(index)} />
                    <InputNumber className="p-inputnumber" value={item.quantity} readOnly />
                    <Button className="p-button-rounded p-button-text p-button-sm" label="+" onClick={() => onAddToCart(item)} />
                </div> */}

                <Button label="Remove" onClick={() => onRemoveFromCart(index)} />
              </div>
            ))}
          </div>
          <div className="total">
            <div className="price">
              <h1>Order Summary</h1>
              <h3>Original Price: ${discountInfo.originalPrice.toFixed(2)}</h3>
              <h3>Discount: ${discountInfo.discountAmount.toFixed(2)}</h3>
              <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
            </div>
            <div className='discount'>
              {discountCampaigns.map((campaign, index) => (
                <div key={index} style={{ marginTop: '10px' }}>
                  <p className='campaign-text'>{campaign.label}</p>
                  <Button label="Remove" onClick={() => handleRemoveCampaign(index)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ShoppingCart.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      img: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      discount: PropTypes.number,
    })
  ).isRequired,
  onRemoveFromCart: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onDecreaseFromCart: PropTypes.func.isRequired,
  totalPrice: PropTypes.number.isRequired,
  discountInfo: PropTypes.shape({
    originalPrice: PropTypes.number.isRequired,
    discountAmount: PropTypes.number.isRequired,
    finalPrice: PropTypes.number.isRequired,
  }).isRequired,
  discountCampaigns: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      amount: PropTypes.number,
      category: PropTypes.string,
      everyX: PropTypes.number,
      discountY: PropTypes.number,
    })
  ).isRequired,
  handleRemoveCampaign: PropTypes.func.isRequired,
};

export default ShoppingCart;
