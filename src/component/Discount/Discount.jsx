import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Accordion, AccordionTab } from 'primereact/accordion';

const DiscountManager = ({ cartItems, setTotalPrice, onAddCampaign, activeCampaigns, availablePoints }) => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [points, setPoints] = useState(0);
  const [activeTab, setActiveTab] = useState(null);

  const couponOptions = [
    { label: 'Fixed Amount Coupon - 50 THB', value: { type: 'Coupon', value: 'FixedAmount', amount: 50, label: 'Fixed Amount Coupon - 50 THB' } },
    { label: 'Percentage Discount - 10%', value: { type: 'Coupon', value: 'Percentage', amount: 10, label: 'Percentage Discount - 10%' } },
  ];

  const onTopOptions = [
    { label: 'Percentage Discount by Category - 15% on Electronics', value: { type: 'On Top', value: 'PercentageByCategory', amount: 15, category: 'Electronics', label: 'Percentage Discount by Category - 15% on Electronics' } },
    { label: `Discount by Points - Max ${availablePoints} Points`, value: { type: 'On Top', value: 'Points', label: 'Discount by Points' } },
  ];

  const seasonalOptions = [
    { label: 'Special Campaigns - 40 THB at every 300 THB', value: { type: 'Seasonal', value: 'Seasonal', everyX: 300, discountY: 40, label: 'Special Campaigns - 40 THB at every 300 THB' } },
  ];

  const handleAddCampaign = () => {
    if (selectedCampaign) {
      const isDuplicate = activeCampaigns.some(c => c.label === selectedCampaign.label);
      if (!isDuplicate) {
        if (selectedCampaign.value === 'Points') {
          const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const maxPoints = Math.min(points, availablePoints, Math.floor(total * 0.2)); // Max points limited to 20% of total price
          if (points > 0 && points <= maxPoints) {
            onAddCampaign({ ...selectedCampaign, amount: points });
            setSelectedCampaign(null);
            setPoints(0);
          }
        } else {
          onAddCampaign(selectedCampaign);
          setSelectedCampaign(null);
        }
      }
    }
  };
  
  const isAddButtonDisabled = selectedCampaign && activeCampaigns.length > 0 && selectedCampaign.type !== activeCampaigns[0].type;
  

  return (
    <div>
      <h2>Add Discount Campaign</h2>
      <Accordion activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
        <AccordionTab header="Coupons">
          <Dropdown
            value={selectedCampaign}
            options={couponOptions}
            onChange={(e) => setSelectedCampaign(e.value)}
            placeholder="Select a coupon"
          />
        </AccordionTab>
        <AccordionTab header="On Top">
          <Dropdown
            value={selectedCampaign}
            options={onTopOptions}
            onChange={(e) => setSelectedCampaign(e.value)}
            placeholder="Select an on top discount"
          />
          {selectedCampaign?.value === 'Points' && (
            <InputNumber
              value={points}
              onValueChange={(e) => setPoints(e.value)}
              min={0}
              max={availablePoints}
              placeholder={`Enter points (max ${availablePoints})`}
            />
          )}
        </AccordionTab>
        <AccordionTab header="Seasonal">
          <Dropdown
            value={selectedCampaign}
            options={seasonalOptions}
            onChange={(e) => setSelectedCampaign(e.value)}
            placeholder="Select a seasonal discount"
          />
        </AccordionTab>
      </Accordion>
      <Button label="Add Campaign" onClick={handleAddCampaign} disabled={isAddButtonDisabled} />
    </div>
  );
};

DiscountManager.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      img: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  setTotalPrice: PropTypes.func.isRequired,
  onAddCampaign: PropTypes.func.isRequired,
  activeCampaigns: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  availablePoints: PropTypes.number.isRequired,
};

export default DiscountManager;
