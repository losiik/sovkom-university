'use client'

import Link from 'next/link'
import Image from 'next/image'
// import { getCookie } from 'cookies-next';
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react';
import Header from '../../../components/Header'



export default function Page({ params: {test: test} }) {

    return (
        <>
            <Header />
            <div className="container-lg">
              <h1>Страница в разработке:(</h1>
              {test}
            </div>
        </>
    )
}