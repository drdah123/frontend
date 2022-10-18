import { createContext, useContext, useReducer } from 'react';

const Store = createContext();

const user = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const inintialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    CartItems:
      localStorage.getItem('CartItems') && user
        ? JSON.parse(localStorage.getItem('CartItems'))
        : [],
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      const newItem = action.payload;
      const existedItem = state.cart.CartItems.find(
        (x) => x._id === newItem._id
      );
      const CartItems = existedItem
        ? state.cart.CartItems.map((item) =>
            item._id === existedItem._id ? newItem : item
          )
        : [...state.cart.CartItems, newItem];
      localStorage.setItem('CartItems', JSON.stringify(CartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          CartItems,
        },
      };
    case 'CART_DELETE_ITEM': {
      const CartItems = state.cart.CartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('CartItems', JSON.stringify(CartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          CartItems,
        },
      };
    }
    case 'CART_CLEAR':
      return {
        ...state,
        cart: { ...state.cart, CartItems: [] },
      };
    case 'USER_SIGNIN':
      return {
        ...state,
        userInfo: action.payload,
        cart: {
          ...state.cart,
          CartItems: JSON.parse(localStorage.getItem('CartItems')),
        },
      };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          CartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, inintialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

export const useStateContext = () => useContext(Store);
