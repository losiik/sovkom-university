"use client"

import Image from "next/image"
import Link  from "next/link"
import { getCookie } from 'cookies-next'
import { useEffect, useState } from 'react'



export default function Header() {
const [userName, setName] = useState(null);

    useEffect(() => {
           fetch('http://142.93.230.144/api/header', {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${getCookie('XToken')}`
                  }
            })
            .then(response => response.json())
            .then(data => setName(data.user_name))      

    }, [])
  return (
        <header>
            <div className="container-lg">
                <div className="b_headerInner ">
                    <div className="b_logo_wrapper">
                        <Image src="/img/logo.svg" 
                        alt="logo"
                        width="200"
                        height="100"
                        />
                    </div>
                    <div className="b_text_wrapper d-none d-md-block">Корпоративный университет группы компаний Совкомбанк
                    </div>
                     <div className="b_rigthSide_wrapper">
                     <div className="b_right_name">
                     {userName !==undefined ? userName : <Link href="/login/">Вход </Link>}
                    </div>
                    <div className="b_right_surname">
                        {userName !==undefined ? <Link href="/signout/">Выйти</Link> : <Link href="/login/">Регистрация </Link>}
                    </div>
                       
                    </div>
                </div>
               
            </div>
        </header>
    )
}