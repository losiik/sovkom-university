$(document).ready(function () {  
    console.log(11111)
        function delete_cookie( name, path, domain ) {
        if( get_cookie( name ) ) {
          document.cookie = name + "=" +
            ((path) ? ";path="+path:"")+
            ((domain)?";domain="+domain:"") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
        }
      }
      
      function get_cookie(name){
          return document.cookie.split(';').some(c => {
              return c.trim().startsWith(name + '=');
          });
      }
    // const urls = {
    //     loginUrl: 'http://localhost:9000/login',
    //     signupUrl: 'http://localhost:9000/registration',
    // }
    // $.ajaxSetup({
    //     dataType: "json",
    //     contentType: "application/json",
    //     headers: {"Content-Type": "application/json"},
    //     beforeSend: function(xhr) {
    //         xhr.setRequestHeader("Content-Type", "application/json");
    //     }
    // });
    // $('form').on('submit', function(e){
    //     e.preventDefault();
       

    //     if (e.target.attributes.class.value.includes('login_form')) {
    //         const user_login = $('.login_form #user_login').val();
    //         const user_password= $('.login_form #user_password').val();
    //         let dataTosend = {};
    //         dataTosend = {
    //             "password": user_password,
    //             "email": user_login,            
    //         };
    //         console.log(dataTosend);
    //         $.ajax({
    //             method: 'post',
    //             type: 'post',
    //             url: urls.loginUrl,
    //             data: JSON.stringify(dataTosend),
    //             success: function(data){
    //                 console.log(2222);
    //                if(data.access_token !== (undefined && null && "")) {
    //                 document.cookie = `Token=${data.access_token}; max-age=2000000; path=/;`;
    //                 console.log('redirect  working');
    //                 location.replace('/lk/')
    //                } else if(data.access_token == (undefined || null || "")) {
    //                 alert('Неправильные логин и/или пароль!');
    //                 location.reload();
    //                }
    //             },
    //             error: function(){
    //                 console.log(23432);
    //                 alert('Неправильные логин и/или пароль! Проверьте правильность ввденных данных!');
    //                 location.reload();
                    
    //             },
    //             complete: function () {
    //                 console.log(1010101);
    //               }
    //         })
    //     }
    //     if (e.target.attributes.class.value.includes('signup_form')) {
    //         let dataTosend = {};
    //         const user_email = $('.signup_form #user_email').val();
    //         const user_password= $('.signup_form #user_password').val();
    //         const user_phone = $('.signup_form #user_phone').val();
    //         const user_name = $('.signup_form #user_name').val();
    //         const user_surname = $('.signup_form #user_surname').val();
    //         dataTosend = {
    //             "first_name": user_name,
    //             "last_name": user_surname,
    //             "password": user_password,
    //             "email": user_email,
    //             "phone_number": user_phone
    //         }
    //         $.ajax({
    //             type: 'post',
    //             method: 'post',
    //             url: urls.signupUrl,
    //             data: JSON.stringify(dataTosend),
    //             success: function(data){
    //                if(data.access_token !== (undefined && null && "" )) {
    //                 document.cookie = `Token=${data.access_token}; max-age=5000; path=/;`;
    //                 location.replace('/lk/')
    //                } else if(data.access_token == (undefined || null || "")) {
    //                 alert('Такой пользоватлеь уже существует! Войдите с помощью формы выше! www');
    //                 location.reload();
    //                }
    //             },
    //             error: function(){
    //                 alert('Такой пользоватлеь уже существует! Войдите с помощью формы выше!');
    //                 location.reload();
                   
    //             }
    //         })
    //     }
    // })
})