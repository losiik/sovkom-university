
'use client'

import Header from "../../components/Header";

import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';

export default function OrderCourse() {
    const router = useRouter()
    const token = getCookie('XToken') ? getCookie('XToken') : null;
    useEffect(() => {   
         token == null? router.push('/signout') : null;
    },[router, token]);

    const [fioValue, setFioValue] = useState('');
    const [LeaderFioValue, setLeaderdValue] = useState('');
    const [SBValue, setSBValue] = useState('');
    const [positionValue, setPositionValue] = useState('');
    const [expirienceValue, setExpirienceValue] = useState('');
    const [courseValue, setCourseValue] = useState('');
    const [achivValue, setachivValue] = useState('');
    const [motivationValue, setMotivationValue] = useState('');
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            "name": fioValue,
            "director": LeaderFioValue,
            "name_of_the_division": SBValue,
            "position": positionValue,
            "work_experience": expirienceValue,
            "personal_achievements": achivValue,
            "motivation_letter": motivationValue,
            "course_name": courseValue,
            "state": "На рассмотрении"
        };
        console.log(dataToSend)
        try {
            let res = await fetch("http://142.93.230.144/api/order_course", {
              method: "POST",
              body: JSON.stringify(dataToSend),
              headers: {
                'Authorization': `Bearer ${getCookie('XToken')}`,
                'Content-Type': 'application/json',
              }
            });
            let data = await res.json();
            if(data.success) {
               alert('Заявка подана')
                router.push('/lk/')
            } else if(!data) {
                alert('Неправильные логин и/или пароль!');
               
            }
          } catch (err) {
            alert(err);
          }

        }

    return (
        <>
            <Header />
            <div className="container-lg">
                <form action="" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Ваше ФИО" value={fioValue}
                    onChange={(e) => {setFioValue(e.target.value)}} />
                        <input type="text" placeholder="ФИО Руководителя" value={LeaderFioValue}
                    onChange={(e) => {setLeaderdValue(e.target.value)}} />
                     <input type="text" placeholder="Поздразделение" value={SBValue}
                    onChange={(e) => {setSBValue(e.target.value)}} />
                        <input type="text" placeholder="Текущая должность" value={positionValue}
                    onChange={(e) => {setPositionValue(e.target.value)}} />
                      <input type="text" placeholder="Стаж работы (с учетом предыдущих организаций)" value={expirienceValue}
                    onChange={(e) => {setExpirienceValue(e.target.value)}} />
                        <input type="text" placeholder="Желаемый курс" value={courseValue}
                    onChange={(e) => {setCourseValue(e.target.value)}} />
                     <input type="text" placeholder="Личные достижения в компании за последние 12 месяцев" value={achivValue}
                    onChange={(e) => {setachivValue(e.target.value)}} />
                        <input type="text" placeholder="Мотивационное пиьсмо" value={motivationValue}
                    onChange={(e) => {setMotivationValue(e.target.value)}} />
                       <button className="b_btn_main w-100"
                                        type="submit"
                                        > Подать заявку</button>
                </form>
            </div>
        </>
    )

}