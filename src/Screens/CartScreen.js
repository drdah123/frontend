import axios from 'axios';
import React from 'react';
import { Row, Col, ListGroup, Button, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import MessageBox from '../component/MessageBox';
import { useStateContext } from '../Store';

const CartScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useStateContext();
  const {
    cart: { CartItems },
  } = state;
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}}/api/products/${item._id}`
    );
    if (data.countInStock < quantity) {
      window.alert(`Sorry, there is ${data.countInStock} `);
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const deleteItemHandler = async (item) => {
    ctxDispatch({ type: 'CART_DELETE_ITEM', payload: item });
  };
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {CartItems.length <= 0 ? (
            <MessageBox>
              Your Cart is empty. <Link to="/">Go to Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {CartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      />{' '}
                      <Link to={`/products/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col>
                      <Button
                        variant="light"
                        disabled={item.quantity === 1}
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                      >
                        <i className="fas fa-minus-circle" />
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        disabled={item.quantity === item.countInStock}
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                      >
                        <i className="fas fa-plus-circle" />
                      </Button>
                    </Col>
                    <Col md={3}>{item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => deleteItemHandler(item)}
                      >
                        <i className="fas fa-trash" />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({CartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : ${' '}
                    {CartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={CartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
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

export default CartScreen;
