import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import LaptopPage from "./LaptopPage";
import PCPage from "./PCPage";
import LinhKienPage from "./LinhKienPage";
import PhuKienPage from "./PhuKienPage";
import CartPage from "./CartPage";
import { CartProvider } from "./CartContext";
import LoginPage from "./LoginPage";
import LogoutPage from "./LogoutPage";
import RegisterPage from "./RegisterPage";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LaptopPage />} />
            <Route path="laptop" element={<LaptopPage />} />
            <Route path="pc" element={<PCPage />} />
            <Route path="linhkien" element={<LinhKienPage />} />
            <Route path="phukien" element={<PhuKienPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="logout" element={<LogoutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
