import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/header';
import Footer from './components/footer';

// Pages
import Home from './pages/home';
import Login from './pages/login';
import SignUpParticular from './pages/signup-particular';
import SignUpBusiness from './pages/signup-business';
import SignupSelectionScreen from './pages/signup-select';

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
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );

}
export default AppRoutes
