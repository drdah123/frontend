import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './Screens/HomeScreen';
import ProductScreen from './Screens/ProductScreen';
import Logo from './amazon-music.svg';
import {
  Badge,
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Button,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useStateContext } from './Store';
import CartScreen from './Screens/CartScreen';
import SigninScreen from './Screens/SigninScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressScreen from './Screens/ShippingAddressScreen';
import SignupScreen from './Screens/SignupScreen';
import PaymentMethodScreen from './Screens/PaymentMethodScreen';
import PlaceorderScreen from './Screens/PlaceorderScreen';
import OrderScreen from './Screens/OrderScreen';
import OrderHistoryScreen from './Screens/OrderHistoryScreen';
import ProfileScreen from './Screens/ProfileScreen';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBox from './component/SearchBox';
import SearchScreen from './Screens/SearchScreen';
import ProtectedRoute from './component/ProtectedRoute';
import OrderLisrScreen from './Screens/AdminScreens/OrderLisrScreen';
import DashboardScreen from './Screens/AdminScreens/DashboardScreen';
import ProductListScreen from './Screens/AdminScreens/ProductListScreen';
import UsersListScreen from './Screens/AdminScreens/UsersListScreen';
import AdminRoute from './component/AdminRoute';
import ProductEditScreen from './Screens/AdminScreens/ProductEditScreen';
import ProductCreateScreen from './Screens/AdminScreens/ProductCreateScreen';

function App() {
  const { state, dispatch: ctxDipatch } = useStateContext();
  const { cart, userInfo } = state;
  const signoutHandler = () => {
    ctxDipatch({
      type: 'USER_SIGNOUT',
    });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/products/categories`
        );
        setCategories(data);
        console.log(categories);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex  flex-column site-container active-cont'
            : 'd-flex  flex-column site-container'
        }
      >
        {/* L */}
        <ToastContainer position="bottom-center" limit={1} />
        <header className="App-header">
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() =>
                  setSidebarIsOpen((prevsidebarIsOpen) => !prevsidebarIsOpen)
                }
              >
                <i className="fas fa-bars" />
              </Button>
              <LinkContainer className="logo" to="/">
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.CartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.CartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order history</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="/"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/productlist">
                        <NavDropdown.Item>Product List</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orderlist">
                        <NavDropdown.Item>Order list</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/userslist">
                        <NavDropdown.Item>Users list</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column w-100 p-2 text-white">
            <Nav.Item>
              <strong>Category</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/products/:slug" element={<ProductScreen />} />
              <Route path="/" element={<HomeScreen />} />
              {/* admin Screens */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orderlist"
                element={
                  <AdminRoute>
                    <OrderLisrScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/productlist"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/productcreate"
                element={
                  <AdminRoute>
                    <ProductCreateScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/userslist"
                element={
                  <AdminRoute>
                    <UsersListScreen />
                  </AdminRoute>
                }
              />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/Cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceorderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
