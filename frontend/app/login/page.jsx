'use client'

import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';

import Header  from '../components/Header'

export default function Login() {
    const router = useRouter()
    const token = getCookie('XToken') !== undefined ? getCookie('XToken') : null;
    const tokenExists = token !== (null && undefined)? true : false;

    const [loginValue, setLoginValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const [surnameValue, setSurnameValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [passwordRegValue, setPasswordRegValue] = useState('');
    const [emailValue, setEmailVlaue] = useState('');
    const [phoneValue, setPhoneVlaue] = useState('');

    let dataToSend = {}
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const urls = {
            loginUrl: 'http://142.93.230.144/api/login',
            signupUrl: 'http://142.93.230.144/api/registration',
        }
        switch (e.target.attributes.class.value) {
            case 'login_form':
                dataToSend = {
                    "password": passwordValue,
                    "email": loginValue,            
                };
                try {
                    let res = await fetch(urls.loginUrl, {
                      method: "POST",
                      body: JSON.stringify(dataToSend),
                      headers: {
                        'Content-Type': 'application/json',
                      }
                    });
                    let data = await res.json();
                    if(data.access_token !== (undefined && null && "")) {
                       
                       setCookie('XToken', `${data.access_token}`, {'max-age': 2592000, 'path': '/'});
                       setCookie('userRoleId', `${data.role_id}`, {'max-age': 2592000, 'path': '/'});

                       const tokken = getCookie('XToken')
                       console.log(tokken)
                       router.push('/lk/')
                    } else if(!data) {
                        alert('Неправильные логин и/или пароль!');
                        setLoginValue('')
                        setPasswordValue('')
                    }
                  } catch (err) {
                    alert(err);
                  }
                break;
            case 'signup_form mt-5':
                dataToSend = {
                    "first_name": nameValue,
                    "last_name": surnameValue,
                    "password": passwordRegValue,
                    "email": emailValue,
                    "phone_number": phoneValue
                }
                console.log(dataToSend)
                try {
                    let res = await fetch(urls.signupUrl, {
                      method: "POST",
                      body: JSON.stringify(dataToSend),
                      headers: {
                        'Content-Type': 'application/json',
                      }
                    });
                    let data = await res.json();
                    if(data.access_token !== (undefined && null && "")) {
                        setCookie('XToken', `${data.access_token}`, {'max-age': 2592000, 'path': '/'});
                        setCookie('userRoleId', `${data.role_id}`, {'max-age': 2592000, 'path': '/'});                       
                        router.replace('/lk/')
                    } else if(data.access_token == (undefined || null || "")) {
                        alert('Неправильные логин и/или пароль!');
                        setLoginValue('')
                        setPasswordValue('')
                    }
                  } catch (err) {
                    console.log(err);
                  }
                break;
        }
    }

    switch (tokenExists) {
        case false:
            return (
                <>
                    <Header />
                        <section>
                            <div className="container-xl">
                                <div className="b_h1 text-center">
                                    Войдите
                                </div>
                              <div className="d-flex flex-column align-items-center ">
                                 <div className="w-100 w-lg-50 ">
                                    <form onSubmit={handleSubmit} className="login_form" >
                                        <input 
                                        key={1}
                                        className="b_input"
                                        placeholder="Логин"
                                        name="user_login"
                                        id="user_login"
                                        type="text"
                                        value={loginValue}
                                        onChange={(e) => setLoginValue(e.target.value)}
                                        ></input>
                                          <input 
                                          key={2}
                                        className="b_input"
                                        placeholder="Пароль"
                                        name="user_password"
                                        id="user_password"
                                        value={passwordValue}
                                        type="password"
                                        onChange={(e) => setPasswordValue(e.target.value)}
                                        ></input>
                                        <button className="b_btn_main w-100"
                                        type="submit"
                                        > Войти</button>
                                    </form>
                                    <form className="signup_form mt-5" onSubmit={handleSubmit} >
                                        <input 
                                        className="b_input"
                                        placeholder="Имя"
                                        name="user_name"
                                        id="user_name"
                                        value={nameValue}
                                        onChange={(e) => setNameValue(e.target.value)}
                                        required
                                        ></input>
                                         <input 
                                        className="b_input"
                                        placeholder="Фамилия"
                                        name="user_surname"
                                        id="user_surname"
                                        value={surnameValue}
                                        onChange={(e) => setSurnameValue(e.target.value)}
                                        required
                                        ></input>
                                          <input 
                                        className="b_input"
                                        placeholder="Адрес электронной почты"
                                        name="user_email"
                                        id="user_email"
                                        value={emailValue}
                                        onChange={(e) => setEmailVlaue(e.target.value)}
                                        required
                                        ></input>
                                          <input 
                                        className="b_input"
                                        placeholder="Телефон"
                                        name="user_phone"
                                        id="user_phone"
                                        value={phoneValue}
                                        onChange={(e) => setPhoneVlaue(e.target.value)}
                                        ></input>
                                          <input 
                                        className="b_input"
                                        placeholder="Пароль"
                                        name="user_regpassword"
                                        id="user_regpassword"
                                        value={passwordRegValue}
                                        onChange={(e) => setPasswordRegValue(e.target.value)}
                                        required
                                        ></input>
                                        <button className="b_btn_main w-100"
                                        type="submit"
                                        > Зарегистрироваться</button>
                                    </form>
                                </div>
                              </div>
                            </div>
                        </section>
      
                </>
                
            )
        case true:
            router.replace('/lk/')
            break;
    }

}