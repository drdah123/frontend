import axios from 'axios';
import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useStateContext } from '../Store';
import Rating from './Rating';

const Product = (props) => {
  const { state, dispatch: ctxDispatch } = useStateContext();
  const {
    cart: { CartItems },
  } = state;
  const { product } = props;
  const addToCartHandler = async (item) => {
    const existedItem = CartItems.find((element) => element._id === item._id);
    const quantity = existedItem ? existedItem.quantity + 1 : 1;
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
  return (
    <Card className="product">
      <Link to={`/products/${product.slug}`}>
        <img src={product.image} alt={product.name} className="card-img-top" />
      </Link>
      <Card.Body>
        <Link to={`/products/${product.slug}`}>
          <Card.Title>
            <p>{product.name}</p>
          </Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to Cart</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
