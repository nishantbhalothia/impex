'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/reducers/userReducer';
import { useRouter } from 'next/navigation';

const DynamicTitle = () => {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [path, setPath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      setPath(currentPath);
      console.log('Path:@DynamicTitle', currentPath);
    }
  }, []);

  useEffect(() => {
    let pageTitle = 'Bhalothia.com';
    if (user && user.username) {
      const firstName = user.username.split(' ')[0]; // Extract the first name
      if (path.includes('cart')) {
        pageTitle = `${firstName}'s Cart`;
      } else if (path.includes('orders')) {
        pageTitle = `${firstName}'s Orders`;
      } else if (path.includes('addresses')) {
        pageTitle = `${firstName}'s Addresses`;
      } else if (path.includes('wishlist')) {
        pageTitle = `${firstName}'s Wishlist`;
      } else if (path.includes('account')) {
        pageTitle = `${firstName}'s Account`;
      }
      // Add more conditions for other paths as needed
    }

    document.title = pageTitle;
  }, [user, path]);

  return null;
};

export default DynamicTitle;
