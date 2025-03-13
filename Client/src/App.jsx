import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/ui/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import Dashboard from "./pages/admin-view/Dashboard";
import Products from "./pages/admin-view/Products";
import Features from "./pages/admin-view/Features";
import Order from "./pages/admin-view/Order";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import Home from "./pages/shopping-view/Home";
import Listing from "./pages/shopping-view/Listing";
import Checkout from "./pages/shopping-view/Checkout";
import Account from "./pages/shopping-view/Account";
import CheckAuth from "./components/common/CheckAuth";
import UnAuthPage from "./pages/unauth-page";
import OTPverify from "./pages/auth/verify";


function App() {
  const isAuthenticated = true;
  const user = {
    name : "Hajith",
    role : "user"
  };

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <h1>Header Component</h1>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="verify" element={<OTPverify/>} />
        </Route>
        <Route path="/admin" element={
          <CheckAuth user={user} isAuthenticated={isAuthenticated}>
            <AdminLayout />
          </CheckAuth>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="features" element={<Features />} />
          <Route path="order" element={<Order />} />
        </Route>

        <Route path="/shop" element={
          <CheckAuth user={user} isAuthenticated={isAuthenticated}>
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path="home" element={<Home />} />
          <Route path="list" element={<Listing />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
          <Route path="unauth-page" element={<UnAuthPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
