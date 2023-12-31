# Сайт для корпоративного университета ГК Совкомбанк

## Сборка проекта

### Настройка сервера

- Необходимо развернуть базу данных PostgreSQL на сервере
  (в полях POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB передайте необходимые значения): `docker run --name excel-changer -d -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=ex_CH0228_n0 -e POSTGRES_DB=postgres postgres:13.3`
- Необхордимо скачать репозиторий проекта на сервер из github или gitlab
  (пример: `git clone https://github.com/losiik/sovkom-university.git`)
- Необходимо от корня проекта в папке backend создать файл .env и прописать там параметры доступа к базе данных (необходимые ключи находятся в .env.tmplt)

### Развертывания проекта

- Чтобы запустить проект после настроек на сервере необходимо, находясь в корне проекта прописать команду `docker-compose build` (эта команда соберет проект)
- Вторым шагом необходимо прописать команду `docker-compose up -d` (запуск билда)

## Просмотр и взаимодействие с собранной версией на сайте

### Доступ к сайту

- Сайт доступен по ссылке: http://142.93.230.144/

### Регистрация

- По ссылке: http://142.93.230.144/login в полях для регистрации необхородимо указать персональные данные. После успешной регистрации вам будет доступен личный кабинет абитуриента

### Вход в личный кабинт студента

- Для входа в тестовый личный кабинет студента необходимо пройти по ссылке: http://142.93.230.144/login.
- В полях для авторизации в поле "email" указать 1308267@gmail.com, а в поле "пароль" admin123
- После успешной авторизации вам будет доступен личный кабинет студента

### Вход в личный кабинет преподавателя 

- Для входа в тестовый личный кабинет преподавателя необходимо пройти по ссылке: http://142.93.230.144/login.
- В полях для авторизации в поле "email" указать test@email.com, а в поле "пароль" admin123
- После успешной авторизации вам будет доступен личный кабинет преподавателя

## Описание архитектуры

- Хостинг: digitalOcean (лучше использовать timeweb)
- База данных: PostgreSQL
- Веб-сервер: nginx
- Языки программирования: python, javascript
- Фреймворки: Flask, Next.js
- SSL-сертификат (в планах улучшений)
- Система управления версиями: git

## Описание решения с точки зрения безопасности

- СУБД PostgreSQL отвечает современным требованиям безопасности и скорости передачи и обработки данных
- SSL-сертификат обеспечивает надежность в шифровании данных между сервером и клиентом
- фреймворк Next.js обеспечивает быструю и безопасную аутентификацию, рендер страниц и отправку данных на сервер
- фреймворк Flask обеспечивает безопасную обработку данных и запись в базу данных
- Технология Docker обеспечивает изолированность системы от внешних воздействий и/или внутренних воздействий на сервер/хостинг

## Ссылка на дизайн-макет

- [https://www.figma.com/file/VCS6rcoBRGIxRoZhfP39Sq/Untitled?type=design&node-id=0%3A1&mode=design&t=yLYnxL3VDsu0cuBU-1](https://www.figma.com/file/VCS6rcoBRGIxRoZhfP39Sq/Untitled?type=design&node-id=0%3A1&mode=design&t=yLYnxL3VDsu0cuBU-1)

## Ссылка на репозиторий

- [https://github.com/losiik/sovkom-university](https://github.com/losiik/sovkom-university)

