'use client'

import LkForTeacher from '../components/LkForTeacher';
import LkForStudent from '../components/LkForStudent';
import LkForCurator from '../components/LkForCurator';
import { getCookie,deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

const Lk = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:9000/lk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('Token')}`
          },
        });
        if (!response.ok) {
          
             throw new Error('Network response was not ok');
          
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        deleteCookie('Token');
        console.error('There has been a problem with your fetch operation:', error);
      }
    };

    fetchData();
  }, []);

  const role = data?.role_id;

  switch (role) {
    case "642b6836-51f6-4ace-8e1e-8ff7b47e5719":
      return <LkForTeacher />;
    case 2:
      return <LkForStudent />;
    case 3:
      return <LkForCurator />;
    case 4:
        return <LkForCurator />;
    default:
      return <>Ваша роль не определена</>;
    }   
};

export default Lk;
