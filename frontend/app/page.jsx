import Image from 'next/image'
import Header  from './components/Header'
import Scripts from './components/Scripts'

import Link from 'next/link'

async function getData() {
  const res = await fetch('http://localhost:9000/get_all_courses')
  return res.json()
}

export default async function Home() {
 const mockData = await getData()
 
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
                )) : <></>}
                </div>
            </section>
            <div className="b_btn_wrapper">
              <Link className="b_btn_main" href="/login/">Подавть заявку на курс</Link>
            </div>
        </div>
      </main>
     <Scripts />
    </>
  )
  
}
