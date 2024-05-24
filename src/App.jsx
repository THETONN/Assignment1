import { useState } from 'react';
import ProductItems from './component/productItem/productItems';
import ShoppingCart from './component/shoppingCart/shoppingCart';
import DiscountManager from './component/Discount/Discount';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './App.css';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountInfo, setDiscountInfo] = useState({ originalPrice: 0, discountAmount: 0, finalPrice: 0 });
  const [discountCampaigns, setDiscountCampaigns] = useState([]);
  const [availablePoints, setAvailablePoints] = useState(100);
  const [visible, setVisible] = useState(false);

  const handleAddToCart = (product) => {
    const itemIndex = cartItems.findIndex((item) => item.id === product.id);
    if (itemIndex >= 0) {
      const newCartItems = [...cartItems];
      newCartItems[itemIndex].quantity += 1;
      setCartItems(newCartItems);
      calculateTotalPrice(newCartItems, discountCampaigns);
    } else {
      const newCartItems = [...cartItems, { ...product, quantity: 1 }];
      setCartItems(newCartItems);
      calculateTotalPrice(newCartItems, discountCampaigns);
    }
  };

  const handleRemoveFromCart = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
    calculateTotalPrice(newCartItems, discountCampaigns);
  };

  const calculateTotalPrice = (items, campaigns) => {
    let total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discountAmount = items.reduce((sum, item) => sum + (item.discount || 0) * item.quantity, 0);

    const coupons = campaigns.filter(c => c.type === 'Coupon');
    const onTops = campaigns.filter(c => c.type === 'On Top');
    const seasonals = campaigns.filter(c => c.type === 'Seasonal');

    if (coupons.length > 0) {
      for (const coupon of coupons) {
        if (coupon.value === 'FixedAmount') {
          discountAmount += coupon.amount; // Fixed discount amount
        } else if (coupon.value === 'Percentage') {
          discountAmount += (total * coupon.amount) / 100; // Percentage discount
        }
      }
    }

    total -= discountAmount;
    let campaignDiscountAmount = discountAmount;
    discountAmount = 0;

    if (onTops.length > 0) {
      for (const onTop of onTops) {
        if (onTop.value === 'PercentageByCategory') {
          for (const item of items) {
            if (item.category === onTop.category) {
              discountAmount += (item.price * onTop.amount) / 100; // Percentage discount for each item in the category
            }
          }
        } else if (onTop.value === 'Points') {
          const pointsDiscount = onTop.amount; // Fixed points discount
          const maxDiscount = total * 0.2;
          discountAmount += Math.min(pointsDiscount, maxDiscount);
        }
      }
    }

    total -= discountAmount;
    campaignDiscountAmount += discountAmount;
    discountAmount = 0;

    if (seasonals.length > 0) {
      for (const seasonal of seasonals) {
        const discountTimes = Math.floor(total / seasonal.everyX);
        discountAmount += discountTimes * seasonal.discountY;
      }
    }

    total -= discountAmount;
    campaignDiscountAmount += discountAmount;

    setTotalPrice(total);
    setDiscountInfo({
      originalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      discountAmount: campaignDiscountAmount,
      finalPrice: total
    });
  };

  const handleAddCampaign = (campaign) => {
    const existingCampaignType = discountCampaigns.find(c => c.type === campaign.type);
    if (!existingCampaignType || campaign.type === 'Coupon' && existingCampaignType.value === campaign.value) {
      const newCampaigns = [...discountCampaigns, campaign];
      setDiscountCampaigns(newCampaigns);
      if (campaign.type === 'On Top' && campaign.value === 'Points') {
        setAvailablePoints(availablePoints - campaign.amount);
      }
      calculateTotalPrice(cartItems, newCampaigns);
    }
  };

  const handleRemoveCampaign = (index) => {
    const campaign = discountCampaigns[index];
    const newCampaigns = [...discountCampaigns];
    newCampaigns.splice(index, 1);
    setDiscountCampaigns(newCampaigns);
    if (campaign.type === 'On Top' && campaign.value === 'Points') {
      setAvailablePoints(availablePoints + campaign.amount);
    }
    calculateTotalPrice(cartItems, newCampaigns);
  };
  const handleDecreaseFromCart = (index) => {
    const newCartItems = [...cartItems];
    if (newCartItems[index].quantity > 1) {
      newCartItems[index].quantity -= 1;
    } else {
      newCartItems.splice(index, 1);
    }
    setCartItems(newCartItems);
    calculateTotalPrice(newCartItems, discountCampaigns);
  };
  

  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className='all'>
      <div className="store">
      <Button label={`Show Cart (${cartItemCount})`} icon="pi pi-shopping-cart" onClick={() => setVisible(true)} />
      </div>
      <div className="main">
      <div className="product">
      <ProductItems onAddToCart={handleAddToCart} />
      </div>
      </div>
      <Dialog header="Shopping Cart" visible={visible} onHide={() => setVisible(false)} style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <ShoppingCart
          cartItems={cartItems}
          onRemoveFromCart={handleRemoveFromCart}
          onAddToCart={handleAddToCart}  
          onDecreaseFromCart={handleDecreaseFromCart}
          totalPrice={totalPrice}
          discountInfo={discountInfo}
          discountCampaigns={discountCampaigns}
          handleRemoveCampaign={handleRemoveCampaign}
        />
        <DiscountManager
          cartItems={cartItems}
          setTotalPrice={setTotalPrice}
          onAddCampaign={handleAddCampaign}
          activeCampaigns={discountCampaigns}
          availablePoints={availablePoints}
        />
      </Dialog>
    </div>
  );
};

export default App;
