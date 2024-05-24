// import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import './productItems.css'

const products = [
  {
    id: 1,
    img: "https://cdn.easyfrontend.com/pictures/products/chair1.png",
    title: "Full Body Massage Chair weightless Bluetooth",
    price: 1725.00,
    category: 'Furniture',
  },
  {
    id: 2,
    img: "https://cdn.easyfrontend.com/pictures/products/perfume1.png",
    title: "Original Brand 212 Perfume Vip Men Long Lasting",
    price: 1725.00,
    category: 'Perfume',
  },
  {
    id: 3,
    img: "https://cdn.easyfrontend.com/pictures/ecommerce/headphone.png",
    title: "Wireless Headset Bluetooth Earphones and Headphone",
    price: 125.00,
    category: 'Electronics',
  },
  // {
  //   id: 4,
  //   img: "https://cdn.easyfrontend.com/pictures/products/chair1.png",
  //   title: "Full Body Massage Chair weightless Bluetooth",
  //   price: 1725.00,
  //   category: 'Furniture',
  // },
  // {
  //   id: 5,
  //   img: "https://cdn.easyfrontend.com/pictures/products/perfume1.png",
  //   title: "Original Brand 212 Perfume Vip Men Long Lasting",
  //   price: 1725.00,
  //   category: 'Perfume',
  // },
  // {
  //   id: 6,
  //   img: "https://cdn.easyfrontend.com/pictures/ecommerce/headphone.png",
  //   title: "Wireless Headset Bluetooth Earphones and Headphone",
  //   price: 125.00,
  //   category: 'Electronics',
  // },
];

const ProductItems = ({ onAddToCart }) => {
  return (
    <div>
      <h1>Products</h1>
      <div className="card">
        {products.map((product) => (
          <div key={product.id} className="incard">
            <img
              src={product.img}
              alt={product.title}
              style={{ width: "100px" }}
            />
            <h3>{product.title}</h3>
            <p>Price: ${product.price.toFixed(2)}</p>
            {product.discount && (
              <p>Discount: ${product.discount.toFixed(2)}</p>
            )}
            <Button label="Add to Cart" onClick={() => onAddToCart(product)} />
          </div>
        ))}
      </div>
    </div>
  );
};

ProductItems.propTypes = {
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductItems;
