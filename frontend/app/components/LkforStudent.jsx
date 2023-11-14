'use client'

import Link from 'next/link'
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import Header from './Header'

export default function LkForStudent(){
    const router = useRouter()
    const [courses, setCourse] = useState(false);
    useEffect(() => {
        fetch('http://142.93.230.144/api/student_courses', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${getCookie('XToken')}`
              }
        })
         .then(response => response.json())
         .then((data) => {
            data.msg !== undefined ? data.msg == 'Token has expired' ?  router.push('/signout') : setCourse(data) : setCourse(data);
        })            
    }, [router])
   
    return (
        <div>
            <Header />
          
            <div className="container-xl">
               <section className="l_section">
               <h1 className="b_section_header">
                    Мои курсы
                </h1>
                <div className="b_courses">
                {courses.student_courses !== undefined ? courses.student_courses.map((item) => (
                    
                    <div key={item.id} id={item.id} className="b_studCourse_item">
                        <div className="b_course_name"><Link href={`/lk/${item.id}`} >{item.name}</Link></div>
                        <div className="b_cousre_progress">55%</div>
                   </div>
                )): ''}
                  
                </div>
               </section>
            </div>
        </div>
    )
}