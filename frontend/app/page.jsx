import Image from 'next/image'
import Header  from './components/Header'
import Scripts from './components/Scripts'

import Link from 'next/link'

async function getData() {
  const res = await fetch('http://localhost:9000/get_all_courses')
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

export default async function Home() {
 const mockData = await getData()
 console.log(mockData)
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
                {mockData.courses.map(() => {
                  
                })}
                  <div className="b_publicSection_item">
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
                          Курс “\u043d\u0438\u043a\u0430\u043a”
                        </div>
                        <div className="b_publicItem_description">
                        Описание: описание описание описание описание описание описание описание описание описание описание описание описание
                        </div>
                      </div>
                  </div>
                  <div className="b_publicSection_item">
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
                          Курс “название”
                        </div>
                        <div className="b_publicItem_description">
                        Описание: описание описание описание описание описание описание описание описание описание описание описание описание
                        </div>
                      </div>
                  </div>
                  <div className="b_publicSection_item">
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
                          Курс “название”
                        </div>
                        <div className="b_publicItem_description">
                        Описание: описание описание описание описание описание описание описание описание описание описание описание описание
                        </div>
                      </div>
                  </div>
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
