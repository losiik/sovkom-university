'use client'

import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import Header  from '../components/Header'
import Scripts from '../components/Scripts'

export default function Login() {
    const router = useRouter()
    const token = getCookie('Token') !== undefined ? getCookie('Token') : null;
    const tokenExists = token !== (null && undefined)? true : false;
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
                                    <form className="login_form" action="../src/submitFormHandler" method="post">
                                        <input 
                                        className="b_input"
                                        placeholder="Логин"
                                        name="user_login"
                                        id="user_login"
                                        ></input>
                                          <input 
                                        className="b_input"
                                        placeholder="Пароль"
                                        name="user_password"
                                        id="user_password"
                                        ></input>
                                        <button className="b_btn_main w-100"
                                        type="submit"
                                        > Войти</button>
                                    </form>
                                    <form className="signup_form mt-5" >
                                        <input 
                                        className="b_input"
                                        placeholder="Имя"
                                        name="user_name"
                                        id="user_name"
                                        required
                                        ></input>
                                         <input 
                                        className="b_input"
                                        placeholder="Фамилия"
                                        name="user_surname"
                                        id="user_surname"
                                        required
                                        ></input>
                                          <input 
                                        className="b_input"
                                        placeholder="Адрес электронной почты"
                                        name="user_email"
                                        id="user_email"
                                        required
                                        ></input>
                                          <input 
                                        className="b_input"
                                        placeholder="Телефон"
                                        name="user_phone"
                                        id="user_phone"
                                        ></input>
                                          <input 
                                        className="b_input"
                                        placeholder="Пароль"
                                        name="user_password"
                                        id="user_password"
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
                    <Scripts />
                </>
                
            )
        case true:
            router.replace('/lk/')
            break;
    }

}