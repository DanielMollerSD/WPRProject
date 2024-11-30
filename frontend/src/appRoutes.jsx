import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// components imports
import Header from './components/header';
import Footer from './components/footer';

// pages imports
import Home from './pages/home';
import Login from './pages/login';
import SignUp from './pages/signup';

function AppRoutes() {
  return (
    <Router>
      <div className="app-layout">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element= {<Login />} />
            <Route path="/signup" element = {<SignUp/>}/>
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default AppRoutes;
