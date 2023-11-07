import Image from "next/image"
import Link  from "next/link"
import GetDataFromApi from '../src/getDataApi'

//const data = GetDataFromApi('http://localhost:8000/api/about/');
//   console.log(data)

export default function Header({text, name, surname}) {

  return (
        <header>
            <div className="container-xl">
                <div className="b_headerInner ">
                    <div className="b_logo_wrapper">
                        <Image src="/img/logo.svg" 
                        alt="logo"
                        width="200"
                        height="100"
                        />
                    </div>
                    <div className="b_text_wrapper d-none d-md-block">
                    {text !==undefined ? text : 'Корпоративный университет группы компаний Совкомбанк'}
                    </div>
                     <div className="b_rigthSide_wrapper">
                     <div className="b_right_name">
                        {name !==undefined ? name : <Link href="/login/">Вход </Link>}
                    </div>
                    <div className="b_right_surname">
                        {surname !==undefined ? surname : <Link href="/login/">Регистрация </Link>}
                    </div>
                       
                    </div>
                </div>
               
            </div>
        </header>
    )
}