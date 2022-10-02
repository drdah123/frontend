import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../component/CheckoutSteps';
import { useStateContext } from '../Store';

const PaymentMethodScreen = () => {
  const navigate = useNavigate();

  const { state, dispatch: ctxDipatch } = useStateContext();
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || 'Paypal'
  );
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDipatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="container small-container">
        <Helmet>
          <title>Payment</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>

        <Form onSubmit={submitHandler}>
          <div className="mt-3">
            <Form.Check
              type="radio"
              id="Paypal"
              label="Paypal"
              value="Paypal"
              checked={paymentMethodName === 'Paypal'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethodName(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
        <div className="mt-2">
          <Link className="back-btn" to="/shipping">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodScreen;
