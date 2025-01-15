import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Header from "./components/header";
import Footer from "./components/footer";

// Pages
import Home from "./pages/home";
import Login from "./pages/login";
import SignUpParticular from "./pages/signup-particular";
import SignUpBusiness from "./pages/signup-business";
import SignupSelectionScreen from "./pages/signup-select";
import VehicleOverview from "./pages/vehicle-overview";
import RentScreen from "./pages/rent-screen";
import VehicleCRUD from "./pages/vehicle-crud";
import BusinessSettings from "./pages/business-settings";
import AccountSettings from "./pages/account-settings";
import SignUpCarsAndAll from "./pages/signup-carsandall";
import BusinessCRUD from "./pages/business-account-crud";

function AppRoutes() {
  return (
    <Router>
      <div className="app-layout">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup-particular" element={<SignUpParticular />} />
            <Route path="/signup-business" element={<SignUpBusiness />} />
            <Route path="/signup-select" element={<SignupSelectionScreen />} />
            <Route path="/signup-carsandall" element={<SignUpCarsAndAll />} />
            <Route path="/vehicle-overview" element={<VehicleOverview />} />
            <Route path="/vehicle-crud" element={<VehicleCRUD />} />
            <Route path="/rent/:id" element={<RentScreen />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/business-settings" element={<BusinessSettings />} />
            <Route path="/business-crud" element={<BusinessCRUD />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default AppRoutes;
