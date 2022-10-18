import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useStateContext } from '../Store';
import { getError } from '../ultis';

const SignupScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const { state, dispatch: ctxDipatch } = useStateContext();
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return toast.error('Passwords are not the same');
    try {
      const { data } = await axios.post('https://meernn.herokuapp.com/api/users/signup', {
        email,
        password,
        name,
      });
      ctxDipatch({
        type: 'USER_SIGNIN',
        payload: data,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (error) {
      toast.error(getError(error));
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mt-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            required
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            required
            value={confirmPassword}
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mt-3">
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mt-3">
          already have an account?{' '}
          <Link to={`/singin?redirect=${redirect}`}>Sign In</Link>
        </div>
      </Form>
    </Container>
  );
};

export default SignupScreen;
