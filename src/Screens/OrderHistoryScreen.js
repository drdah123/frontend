import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { useStateContext } from '../Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../ultis';
import { Button } from 'react-bootstrap';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderHistoryScreen = () => {
  const { state } = useStateContext();
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/orders/mine`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div>
      <Helmet>
        <title>Orders History</title>
      </Helmet>
      <h1 className="my-3">Orders History</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox varinat="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.createdAt.substring(0, 10)}</td>
                <td>{item.totalPrice.toFixed(2)}</td>
                <td>{item.isPaid ? item.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {item.isDelivered ? item.deliveredAt.substring(0, 10) : 'No'}
                </td>
                <td>
                  <Button
                    variant="light"
                    type="button"
                    onClick={() => {
                      navigate(`/order/${item._id}`);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistoryScreen;
