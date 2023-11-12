'use client'

import { useRouter } from 'next/navigation'
import { getCookie,deleteCookie } from 'cookies-next';
import { useEffect, useState } from 'react'

import Header  from '../components/Header'


export default function Page(){
    const router = useRouter();
    useEffect(() => {
        if(getCookie('XToken')) {
            deleteCookie('userRoleId')
            deleteCookie('XToken');
        }
        router.push('/')
    },[router])
    return (
        <>
            <Header/>
        </>
    )
}