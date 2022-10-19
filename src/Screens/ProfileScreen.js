import axios from 'axios';
import React, { useReducer, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useStateContext } from '../Store';
import { getError } from '../ultis';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdating: true };
    case 'UPDATE_SUCCES':
      return { ...state, loadingUpdating: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdating: false };
    default:
      return state;
  }
};

const ProfileScreen = () => {
  const { state, dispatch: ctxDipatch } = useStateContext();
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');

  const [{ loading }, dispatch] = useReducer(reducer, {
    loadingUpdating: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== ConfirmPassword)
      return toast.error('password does not match');
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const { data } = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/users/profile`,
        {
          name,
          email,
          password,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDipatch({ type: 'USER_SIGNIN', payload: data });
      toast.success('User upadted successfully');
    } catch (error) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(error));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <h1 className="my-3">Your Profile</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mt-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3" controlId="password">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mt-3">
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfileScreen;
