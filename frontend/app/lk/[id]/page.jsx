'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import Header from '../../components/Header'

export default function Page({ params: {id: id} }) {
    const [mockData, setMockData] = useState({
        educational_materials:[],
        home_works: [],
        tests:[]
    })
    const page_id = id
    const router = useRouter()
   
    useEffect(() => {
        const dataToSend = {
            course_id: id
        }
        fetch('http://142.93.230.144/api/course_info', {
        method: "POST",
        body:  JSON.stringify(dataToSend),
        headers: {
            'Authorization': `Bearer ${getCookie('XToken')}`,
            'Content-Type': 'application/json'
          }
    })
     .then(response => response.json())
     .then((data) => {
        data.msg !== undefined ? data.msg == 'Token has expired' ?  router.push('/signout') :  setMockData(data) : setMockData(data);
       
    })            
  }, [id, router])

    return (
        <>
            <Header />
            <div className="container-lg">
               
                    {mockData.educational_materials.length !== 0 ? 
                    <>
                        <div className="b_courseInfo_section">
                    <div className="b_courseInfo_title">Тесты</div>
                        <div className="b_course_wrapper">
                        {mockData.tests !== 0 ? mockData.tests.map((item, index) => (
                            <div key={item.id} className="b_course_item">
                                <div className="b_course_item_img">
                                    <Image src="/img/quiz.svg"
                                    alt=""
                                        width={50}
                                        height={50}
                                    ></Image>
                                </div>
                                <div className="b_course_item_text">
                                <Link href={`/lk/${page_id}/${item.slug}`}>{item.test_name}</Link>
                                
                                </div>
                        
                            </div>
                        )) : <></>}
                        </div>
                    </div>
                    <div className="b_courseInfo_section">
                    <div className="b_courseInfo_title">Учебные материалы</div>
                        <div className="b_course_wrapper">
                        {mockData.educational_materials ? mockData.educational_materials.map((item, index) => (
                            <div key={item.id} className="b_course_item">
                                <div className="b_course_item_img">
                                    <Image src="/img/collections_bookmark.svg"
                                         alt=""
                                        width={50}
                                        height={50}
                                    ></Image>
                                </div>
                                <div className="b_course_item_text">
                                <Link href={`/lk/${page_id}/${item.slug}`}>{item.educational_materials_name}</Link>
                                
                                </div>
                        
                            </div>
                        )) : <></>}
                        </div>
                    </div>
                    <div className="b_courseInfo_section">
                    <div className="b_courseInfo_title">Домашнее задание</div>
                        <div className="b_course_wrapper">
                        {mockData.home_works !== 0 ? mockData.home_works.map((item, index) => (
                            <div key={item.id} className="b_course_item">
                                <div className="b_course_item_img">
                                    <Image src="/img/menu_book.svg"
                                         alt=""
                                        width={50}
                                        height={50}
                                    ></Image>
                                </div>
                                <div className="b_course_item_text">
                                <Link href={`/lk/${page_id}/${item.slug}`}>{item.home_works_name}</Link>
                                
                                </div>
                        
                            </div>
                        )) : <></>}
                        </div>
                    </div>
                   </>
                     : <></>}
                   
            </div>
        </>
    )
}