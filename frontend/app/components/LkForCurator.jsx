'use client'

import Header from './Header'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'

import Link from 'next/link'

export default  function LkForCurator(){
   
    const [mockData, setMockData] = useState({
        courses: [],
        groups: [],
        orders: []
      })
      console.log(mockData)
      const router = useRouter()
      useEffect(() => {
        fetch('http://142.93.230.144/api/whore_mentor_info', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${getCookie('XToken')}`
              }
        })
         .then(response => response.json())
         .then((data) => {
            data.msg !== undefined ? data.msg == 'Token has expired' ?  router.push('/signout') : setMockData(data) : setMockData(data);
            
        })            
      }, [router]);
    return (
        <>
            <Header />
            <div className="container-xl">
                <section className="l_section">
                    <div className="b_section_header">
                         Мои курсы
                    </div>
                    <div className="b_courses">
                    {mockData.courses !== undefined ? mockData.courses.map((item,index) => (
                        <div key={item.id} className="b_tutorCourse_item">
                            <div className="b_course_name"><Link href={`/lk/${item.id}`}>{item.name}</Link></div>
                            <div className="b_course_progress"></div>
                        </div>
                    )) :
                      <></>
                    }
                       
                    </div>
                    
                </section>
                <section className="l_section mb-5  ">
                    <div className="b_section_header">
                         Мои группы
                    </div>
                    <div className="b_courses">
                    {mockData.groups !== undefined ? mockData.groups.map((item,index) => (
                        <div key={item.id} className="b_tutorCourse_item">
                            <div className="b_course_name"><Link href={`/lk/${item.id}`}>{item.name}</Link></div>
                            <div className="b_course_progress"></div>
                        </div>
                    )) :
                      <></>
                    }
                       
                    </div>
                    
                </section>
                 <section className="l_section mb-5  ">
                    <div className="b_section_header">
                         Заявки
                    </div>
                    <div className="b_courses">
                    {mockData.orders !== undefined ? mockData.orders.map((item,index) => (
                        <div key={index} className="b_tutorCourse_item">
                            <div className="b_course_name"><Link href={`/lk/${item.id}`}>Заявка {index+1}. {item.full_name}</Link></div>
                            <div className="b_course_progress">{item.state}</div>
                        </div>
                    )) :
                      <></>
                    }
                       
                    </div>
                    
                </section>
            </div>
        </>
    )
}