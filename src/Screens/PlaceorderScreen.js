import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutSteps from '../component/CheckoutSteps';
import LoadingBox from '../component/LoadingBox';
import { useStateContext } from '../Store';
import { getError } from '../ultis';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CRAETE_REQUEST':
      return { ...state, loading: false };
    case 'CREATE_SUCCESS':
      return { ...state, loading: true };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

const PlaceorderScreen = () => {
  const { state, dispatch: ctxDipatch } = useStateContext();
  const { shippingAddress, paymentMethod, CartItems } = state.cart;
  const { userInfo, cart } = state;
  const navigate = useNavigate();

  const [{ loading }, distpatch] = useReducer(reducer, {
    loading: false,
  });

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  state.cart.itemsPrice = round2(
    CartItems.reduce((a, b) => a + b.quantity * b.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
  const placeOrderHandler = async () => {
    try {
      distpatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        'https://meernn.herokuapp.com/api/orders',
        {
          orderItems: cart.CartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          taxPrice: cart.taxPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      distpatch({ type: 'CREATE_SUCCESS' });
      ctxDipatch({ type: 'CART_CLEAR' });
      localStorage.removeItem('CartItems');
      navigate(`/order/${data.order._id}`);
    } catch (error) {
      distpatch({ type: 'CREATE_FAIL' });
      toast.error(getError(error));
    }
  };
  useEffect(() => {
    if (!state.cart.paymentMethod) {
      navigate('/payment');
    }
  }, [state.cart, navigate]);
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {shippingAddress.fullName} <br />
                <strong>Address</strong> {shippingAddress.address},
                {shippingAddress.city}, {shippingAddress.postalCode},
                {shippingAddress.country}
              </Card.Text>
              <Link className="edit-btn" to="/shipping">
                Edit
              </Link>
            </Card.Body>
          </Card>
          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <storng>Method:</storng> {paymentMethod}
              </Card.Text>
              <Link className="edit-btn" to="/payment">
                Edit
              </Link>
            </Card.Body>
          </Card>
          <Card className="mt-3">
            <Card.Body>
              <Card.Title>Cart Items</Card.Title>
              <ListGroup variant="flush">
                {CartItems.map((item) => (
                  <ListGroup.Item key={item.id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <Link to={`/products/${item.slug}`}>
                          <img
                            className="img-fluid rounded img-thumbnail"
                            src={item.image}
                            alt={item.name}
                          />{' '}
                        </Link>
                        <Link
                          className="link-item"
                          to={`/products/${item.slug}`}
                        >
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link className="edit-btn" to="/cart">
                Edit
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Order summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${cart.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${cart.totalPrice}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.lenght === 0}
                      className="preview-btn"
                    >
                      Place Order
                    </Button>
                    {loading && <LoadingBox></LoadingBox>}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceorderScreen;
