import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../../component/LoadingBox';
import MessageBox from '../../component/MessageBox';
import { useStateContext } from '../../Store';
import { getError } from '../../ultis';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    default:
      return state;
  }
};

const ProductCreateScreen = () => {
  const [{ loading, error, loadingCreate }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  });
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const { state } = useStateContext();
  const { userInfo } = state;

  const sumbitHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: 'CREATE_REQUEST' });
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/products`,
        {
          name,
          slug,
          category,
          price,
          image,
          countInStock,
          brand,
          description,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Created successfully');
      navigate(`/admin/productlist`);
    } catch (e) {
      toast.error(getError(e));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Product Create </title>
      </Helmet>
      <h1>Create Product</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={sumbitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              required
              onChange={(e) => setSlug(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              required
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              value={image}
              required
              onChange={(e) => setImage(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              required
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              required
              onChange={(e) => setBrand(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>CountInStock</Form.Label>
            <Form.Control
              value={countInStock}
              required
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" disabled={loadingCreate}>
            Create
          </Button>

          <Link to={'/admin/productlist'} className="cancel-btn">
            Cancel
          </Link>
          {loadingCreate && <LoadingBox />}
        </Form>
      )}
    </Container>
  );
};

export default ProductCreateScreen;
