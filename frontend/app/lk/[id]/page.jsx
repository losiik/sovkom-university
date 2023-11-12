'use client'

import Link from 'next/link'
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import Header from '../../components/Header'



export default function Page({ params }) {
    useEffect(() => {
        
    }, [])
    return (
        <>
            <Header />
        </>
    )
}