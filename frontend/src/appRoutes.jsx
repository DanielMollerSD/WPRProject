import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// components imports
import Header from './components/header';
import Footer from './components/footer';

// pages imports
import Home from './pages/home';

function AppRoutes() {
  return (
    <Router>
      <div className="app-layout">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default AppRoutes;
