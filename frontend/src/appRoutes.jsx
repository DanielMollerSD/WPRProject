import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/header';
import Footer from './components/footer';

// Pages
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register'
import SignUpParticular from './pages/signup-particular';
import SignUpBusiness from './pages/signup-business';
import SignupSelectionScreen from './pages/signup-select';
import RentSelect from './pages/rent-screen';

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
            <Route path="/register" element={<Register />} />
            <Route path="/signup-particular" element={<SignUpParticular />} />
            <Route path="/signup-business" element={<SignUpBusiness />} />
            <Route path="/signup-select" element={<SignupSelectionScreen />} />
            <Route path="/rent-screen" element={ <RentSelect/>}/>
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );

}
export default AppRoutes
