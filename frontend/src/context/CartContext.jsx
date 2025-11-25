// import React, { createContext, useState, useEffect } from 'react';

// export const CartContext = createContext(null);

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [restaurant, setRestaurant] = useState(null); // To store which restaurant the cart is for

//   // Load cart from local storage when the component mounts
//   useEffect(() => {
//     const storedCartItems = localStorage.getItem('cartItems');
//     const storedRestaurant = localStorage.getItem('cartRestaurant');
//     if (storedCartItems) {
//       setCartItems(JSON.parse(storedCartItems));
//     }
//     if (storedRestaurant) {
//       setRestaurant(JSON.parse(storedRestaurant));
//     }
//   }, []);

//   // Save cart to local storage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('cartItems', JSON.stringify(cartItems));
//     localStorage.setItem('cartRestaurant', JSON.stringify(restaurant));
//   }, [cartItems, restaurant]);

//   const addToCart = (item, restaurantInfo) => {
//     // If cart is for a different restaurant, ask to clear it
//     if (restaurant && restaurant._id !== restaurantInfo._id) {
//       if (
//         window.confirm(
//           'You have items from another restaurant. Do you want to clear your cart and add this item?'
//         )
//       ) {
//         setCartItems([{ ...item, qty: 1 }]);
//         setRestaurant(restaurantInfo);
//       }
//       return;
//     }

//     // If no restaurant is set, set it now
//     if (!restaurant) {
//       setRestaurant(restaurantInfo);
//     }

//     const exist = cartItems.find((x) => x._id === item._id);

//     if (exist) {
//       setCartItems(
//         cartItems.map((x) =>
//           x._id === item._id ? { ...exist, qty: exist.qty + 1 } : x
//         )
//       );
//     } else {
//       setCartItems([...cartItems, { ...item, qty: 1 }]);
//     }
//   };

//   const removeFromCart = (item) => {
//     const exist = cartItems.find((x) => x._id === item._id);

//     if (exist.qty === 1) {
//       setCartItems(cartItems.filter((x) => x._id !== item._id));
//       if (cartItems.length === 1) {
//         // If it was the last item, clear restaurant as well
//         setRestaurant(null);
//       }
//     } else {
//       setCartItems(
//         cartItems.map((x) =>
//           x._id === item._id ? { ...exist, qty: exist.qty - 1 } : x
//         )
//       );
//     }
//   };

//   const clearCart = () => {
//     setCartItems([]);
//     setRestaurant(null);
//   };

//   const value = {
//     cartItems,
//     restaurant,
//     addToCart,
//     removeFromCart,
//     clearCart,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Helper to get initial state safely from localStorage
  const getInitialState = (key, defaultValue) => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return defaultValue;
    }
  };

  const [cartItems, setCartItems] = useState(getInitialState('cartItems', []));
  const [restaurant, setRestaurant] = useState(getInitialState('cartRestaurant', null));
  const [shippingAddress, setShippingAddress] = useState(getInitialState('shippingAddress', {}));

  // Save to local storage whenever cart state changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartRestaurant', JSON.stringify(restaurant));
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [cartItems, restaurant, shippingAddress]);

  const addToCart = (item, restaurantInfo) => {
    if (restaurant && restaurant._id !== restaurantInfo._id) {
      if (
        window.confirm(
          'You have items from another restaurant. Do you want to clear your cart and add this item?'
        )
      ) {
        setCartItems([{ ...item, qty: 1 }]);
        setRestaurant(restaurantInfo);
      }
      return;
    }

    if (!restaurant) {
      setRestaurant(restaurantInfo);
    }

    const existItem = cartItems.find((x) => x._id === item._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (item) => {
    const existItem = cartItems.find((x) => x._id === item._id);

    if (existItem.qty === 1) {
      const newCartItems = cartItems.filter((x) => x._id !== item._id);
      setCartItems(newCartItems);
      // If the cart is now empty, clear the restaurant as well
      if (newCartItems.length === 0) {
        setRestaurant(null);
      }
    } else {
      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty - 1 } : x
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
  };

  // --- THIS IS THE FIX ---
  // Always calculate prices before rendering.
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 0 && itemsPrice < 100 ? 10 : 0; // Only charge shipping if there are items
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const value = {
    cartItems,
    restaurant,
    shippingAddress,
    itemsPrice,      // These are now guaranteed to be numbers
    shippingPrice,   // These are now guaranteed to be numbers
    taxPrice,        // These are now guaranteed to be numbers
    totalPrice,      // These are now guaranteed to be numbers
    addToCart,
    removeFromCart,
    clearCart,
    saveShippingAddress,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

