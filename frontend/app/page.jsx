import Image from 'next/image'
import styles from './page.module.css'
import Header  from './components/Header'
import GetDataFromApi from './src/getDataApi'

export default function Home() {
  // const data = GetDataFromApi('http://localhost:8000/api/main_page/');
  // console.log(data)
  return (
    <>
    <Header/>
      <main className="page">
        <div className="container-xl">
            <section className="l_section">
                <div className="">

                </div>
            </section>
        </div>
      </main>
    
    </>
  )
  
}
