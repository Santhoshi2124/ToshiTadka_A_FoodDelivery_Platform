// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import AddRestaurantPage from './pages/AddRestaurant';
// import RestaurantDetailsPage from './pages/RestaurantDetails';
// import CartPage from './pages/CartPage';
// import CheckoutPage from './pages/CheckoutPage';
// import MyOrdersPage from './pages/MyOrders';
// import CravingsResultsPage from './pages/AiResults'; // Import the new AI results page
// import ProtectedRoute from './components/ProtectedRoute';
// import './App.css';

// function App() {
//   return (
//     <div>
//       <Navbar />
//       <main className="main-content">
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
//           {/* This is the new route for the AI search results */}
//           <Route path="/cravings-results" element={<CravingsResultsPage />} />

//           {/* Protected Routes */}
//           <Route
//             path="/add-restaurant"
//             element={
//               <ProtectedRoute>
//                 <AddRestaurantPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/cart"
//             element={
//               <ProtectedRoute>
//                 <CartPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/checkout"
//             element={
//               <ProtectedRoute>
//                 <CheckoutPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/my-orders"
//             element={
//               <ProtectedRoute>
//                 <MyOrdersPage />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddRestaurantPage from './pages/AddRestaurant';
import RestaurantDetailsPage from './pages/RestaurantDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrders';
import CravingsResultsPage from './pages/AiResults';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot'; // Import the chatbot
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
          <Route path="/cravings-results" element={<CravingsResultsPage />} />

          {/* Protected Routes */}
          <Route
            path="/add-restaurant"
            element={
              <ProtectedRoute>
                <AddRestaurantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {/* The Chatbot will appear on all pages */}
      <Chatbot />
    </div>
  );
}

export default App;

