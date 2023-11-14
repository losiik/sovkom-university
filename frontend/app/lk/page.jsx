'use client'

import LkForTeacher from '../components/LkforTeacher';
import LkForStudent from '../components/LkforStudent';
import LkForCurator from '../components/LkForCurator';
import LkForAbiturient from '../components/LkForAbiturient'
import { getCookie } from 'cookies-next';
import Header from '../components/Header';

const Lk = () => {  
  const role = getCookie('userRoleId')
  console.log(role)
  switch (role) {
    case "abfa64e6-78c7-40de-ab54-bb442554b117":
      return <LkForTeacher />;
    case "642b6836-51f6-4ace-8e1e-8ff7b47e5719":
      return <LkForAbiturient />;
    case "78c2d488-d982-4e5b-a4ef-d105f67e6935":
      return <LkForStudent />;
    case "2b618d72-cd4e-4f90-81d2-293599e50e5e":
        return <LkForCurator />;
    default:        
      return (<>
      <Header/>        
      <section >
        <div className="modals">
            <div style={{zIndex:"10000", textAlign: "center", paddingTop: "20%"}} className="modal b__modal" id="loader">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" id="loaderSVG">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#000000" strokeWidth="10">
                        <animate attributeName="stroke-dasharray" from="0 251.2" to="251.2 0" dur="1.5s" repeatCount="indefinite"></animate>
                        <animate attributeName="stroke-dashoffset" from="0" to="-251.2" dur="1.5s" repeatCount="indefinite"></animate>
                    </circle>
                </svg>
            </div>
        </div>
    </section>
    </>
    )
    }   
};

export default Lk;
