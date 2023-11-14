'use client'

import Image from 'next/image'
import Header  from './components/Header'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Link from 'next/link'

export default function Home() {

  const [mockData, setMockData] = useState({
    courses: []
  })

  const router = useRouter()
  useEffect(() => {
    fetch('http://142.93.230.144/api/get_all_courses', {
        method: "GET",
        
    })
     .then(response => response.json())
     .then((data) => {
        data.msg === undefined ? setMockData(data) : false;
        
    })            
  }, [router])
  return (
    <>
    <Header/>
      <main className="page">
        <div className="container-lg">
            <section className="l_section">
                <h1 className="b_section_header">
                    Наши курсы
                </h1>
                <div className="b_publicSection_wrapper">
                {mockData.courses.length !== 0 ? mockData.courses.map((item, index) => (
                  <div key={item.id} className="b_publicSection_item">
                      <div className="b_publicItem_img">
                          <Image 
                            alt=""
                            width={50}
                            height={50}
                            src="/img/collections_bookmark.svg"
                          />
                      </div>
                      <div className="b_publicItem_text">
                        <div className="b_publicItem_title">
                          {item.name}
                        </div>
                        <div className="b_publicItem_description">
                        {item.description}
                        </div>
                      </div>
                  </div>
                )) : ''}
                </div>
            </section>
            <div className="b_btn_wrapper">
              <Link className="b_btn_main" href="/login/">Подавть заявку на курс</Link>
            </div>
        </div>
      </main>
    </>
  )
  
}
