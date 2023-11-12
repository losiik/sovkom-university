'use client'

import { useRouter } from 'next/navigation'
import { getCookie,deleteCookie } from 'cookies-next';

export default function SingOUt(){
    const router = useRouter();
    if(getCookie('XToken') !== (undefined && null && "")) {
        deleteCookie('userRoleId')
        deleteCookie('XToken');
        router.push('/')
    } else {
        router.push('/')
    }

}