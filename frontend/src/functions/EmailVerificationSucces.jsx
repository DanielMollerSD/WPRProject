import {useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';

const EmailVerificationSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    

useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');

    const verifyEmail = async () => {
      try {
        const response = await axios.get('/api/verify-email', {
          params: { token },
        });

        console.log('Email verified successfully!', response.data);

        // Success
        navigate.push('/verification-success');
      } catch (error) {
        console.error('Failed to verify email:', error);

        // Error message
        navigate.push('/verification-error');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      console.error('Email verification token not found!');
      navigate.push('/verification-error');
    }
  }, [navigate, location.search]);

  return null; 
};

export default EmailVerificationSuccess;