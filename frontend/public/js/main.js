$(document).ready(function () {  
    console.log(11111)
    const urls = {
        loginUrl: 'http://localhost:9000/login',
        signupUrl: 'http://localhost:9000/registration',
    }
    $.ajaxSetup({
        dataType: "json",
        contentType: "application/json",
        headers: {"Content-Type": "application/json"},
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
    });
    $('form').on('submit', function(e){
        e.preventDefault();
       

        if (e.target.attributes.class.value.includes('login_form')) {
            const user_login = $('.login_form #user_login').val();
            const user_password= $('.login_form #user_password').val();
            let dataTosend = {};
            dataTosend = {
                "password": user_password,
                "email": user_login,            
            };
      
            $.ajax({
                method: 'post',
                url: urls.loginUrl,
                data: JSON.stringify(dataTosend),
                success: function(data){
                   if(data.success ==  true) {
                    document.cookie = `token=${data.access_token}; max-age=5000; path=/;`;
                    location.replace('/lk/')
                   } else if(data.success ==  false) {
                    alert('Неправильные логин и/или пароль!');
                    location.reload();
                   }
                },
                error: function(){
                    alert('Неправильные логин и/или пароль! Проверьте правильность ввденных данных!');
                    location.reload();
                    
                }
            })
        }
        if (e.target.attributes.class.value.includes('signup_form')) {
            let dataTosend = {};
            const user_email = $('.signup_form #user_email').val();
            const user_password= $('.signup_form #user_password').val();
            const user_phone = $('.signup_form #user_phone').val();
            const user_name = $('.signup_form #user_name').val();
            const user_surname = $('.signup_form #user_surname').val();
            dataTosend = {
                "first_name": user_name,
                "last_name": user_surname,
                "password": user_password,
                "email": user_email,
                "phone_number": user_phone
            }
            $.ajax({
                type: 'post',
                method: 'post',
                url: urls.signupUrl,
                data: JSON.stringify(dataTosend),
                success: function(data){
                   if(data.success ==  true) {
                    document.cookie = `Token=${data.access_token}; max-age=5000; path=/;`;
                    location.replace('/lk/')
                   } else if(data.success ==  false) {
                    alert('Такой пользоватлеь уже существует! Войдите с помощью формы выше! www');
                    location.reload();
                   }
                },
                error: function(){
                    alert('Такой пользоватлеь уже существует! Войдите с помощью формы выше!');
                    location.reload();
                   
                }
            })
        }
    })
})