import Image from 'next/image'
import Header  from './components/Header'
import Scripts from './components/Scripts'
import GetDataFromApi from './src/getDataApi'
import Link from 'next/link'

export default function Home() {
  // const data = GetDataFromApi('http://localhost:8000/api/main_page/');
  // console.log(data)
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
