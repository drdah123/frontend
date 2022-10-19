import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoadingBox from '../../component/LoadingBox';
import MessageBox from '../../component/MessageBox';
import { useStateContext } from '../../Store';
import { getError } from '../../ultis';
import { Button, Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const UsersListScreen = () => {
  const [{ loading, products, pages, error, loadingCreate }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useStateContext();
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/products/admin?page=${page}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data,
        });
        console.log(data);
      } catch (error) {
        dispatch({
          typea: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [page, userInfo]);

  const createHandler = async () => {
    if (window.confirm('Are you sure to Create')) {
      navigate('/admin/productcreate');
    }
  };

  return (
    <div>
      <Helmet>
        <title>Product List</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Create Product
            </Button>
          </div>
        </Col>
      </Row>
      {loadingCreate && <LoadingBox />}
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>Category</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/productlist?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UsersListScreen;
