до диалогов первая
скоро, стоп слова
2-3 недели
массовые рассылки,
списки пользователей, перевод
2-3 недели
статистика
подписчики, финансы и ссылки
https://www.onlinepalette.com/onlyfans/

https://onlyfans.com/api2/v2/chats?limit=10&offset=0&skip_users=all&order=recent
unreadMessageCount






дай детальное решение по архетиктурному проектированию системы веб приложения ниже

Необходимо разработать расширение для браузера с серверным приложением и веб-админкой, в которой выводится агригированная статистика, собранная предварительно через веб расширение. В веб админ панели можно экспортитровать таблицы.
//
Бизнес задача ставиться следующим образом.  Существует два типа аккаунтов, в одном время разделено на части с 0 до 6, с 6 до 12, с 12 до 18, с 18 до 24 часов, в другом с 2 до 10, с 10 до 18, с 18 до 2 часов.

Необходимо через расширение отслеживать все запросы к чату и отправлять запрос на бэк о текущих не прочитанных чатах и времени запроса.
POST /api/v1/chat/status { ids: [], timestamp: Date }
Либо сам бэк должен отправлять каждые 3-5 мин запрос, в к api для отслеживания текущих непрочитанных чатов. Необходимо хранить все не прочитанные сообщения в reddis.
В случае если id чата живет дольше 15 мин отправить уведомление. Данное сообщение c cопутствующей информацией сохраняется в postgres в таблице chats.

Запрос возвращает все отфильтрованные данные из таблицы chats. Response отдает x, вместе с рассчетом о задержках.
GET /api/v1/chat/report?startDate=x&endDate
p.s. нужно разделять запросы по таблицам к chats, dialog, e.t.c.

Запрос
GET /api/v1/chat/stopwords
возвращает массив запрещенных слов. Этот запрос используется расширением и делается не реже 5 минут. Либо возвращать эти данные при авторизации. Эти слова учитываются при наборе текста в инпуте сообщения и блокируют кнопку отправки, в случае наличия. Когда данное слово находится в инпуте, то дебаунсом секунд в 30 должен отправляться запрос с текущим текстом.
POST /api/v1/chat/report { text: '' }
p.s.
Было бы здорово отправлять запросы к chatGpt, с проверкой на наличие различных настраиваемых нюансов, типо негатива, расизма, негатива.

Запрос
Post /api/v1/chat/stopwords { stopWords: [] } Из админки меняет этот набор слов. Эти слова возможно сохаряются в 1ой таблице либо в каждом пользователе, если у каждого аккаунта разные стоп слова.

Необходимо уточнить нюансы учета диалогов по сеансовым ограничениям.
Браузерное расширение берет данные предположительно из запроса авторизации данные о текущей смене. Отсюда можно проверить условие начать активный диалог. Запрос
Post /api/v1/dialog/

Планировщик (sceduller) должен под кредами всех существующих пользователей собирать статистику по соотвествующим таблицам.
mailings (массовые рассылки).
p.s.
сюда же collections, subscribers (online), finance

Веб расширение создает веб-сокет подключение, которое отображается в админке c каждого пользователя.

1.6 необходимо конкретизировать. Но в сухом остатке это все туда же в sceduller в таблицу collections.

Интеграцию с переводами оставить на конец как самую менее важную, с точки зрения технической.

Подписчики в sceduller

Финансы в sceduller

Ссылки в sceduller. Нужно будет разобраться в том, что необходимо.


Summary:

Для данного программного решения необходимо реализовать авторизацию.
Предполагаются модели:
- пользователей, чатов, диалогов, а также все спаршенные под статистику таблицы collections, subscribers, finance, x.

Бэкенд на nest,js, sceduller. Базы данных postgres, reddis (для кол-ва непрочитанных соощений). Фронт часть react, админ панель . Расширение держит вебсокет, который будет остслеживать подключение к аккаунту для вывода текущего состояния в панель клиента.

время настраиваемое






## extension

https://github.com/ElishaKay/udemy-fullstack-chrome-extension
https://stackoverflow.com/questions/63308160/how-to-migrate-manifest-version-2-to-v3-for-chrome-extension

background
launched when browser started or extension loaded
terminated when browser closed extension removed

popup
launched when extension button pressed

options
launched when user open option page

content script
launched when specified URL opened in tab


## accounts

и история нарушений в виде таблицы
дата сообщения которое пришло, дата когда ответила/либо нул, имя пользователя


## todo

https://fansmetric.com/
onlyfans ui
/api/...
errors, by notifications
so many notifications services
проверить разрешения настройек по отправке уведомлений
добавить метод для публикации инфо уведомлений.
smtp gmail to sendgrid
apiKEY,
accept cookie UI banner
//
kliment.barkalov1@gmail.com
samaca-ludu-rajewa
//
user 1 chipxvxcbohn@outlook.com
user 2 a.grininathai@gmail.com
user 3 hello.kakdela@outlook.com
//
chipxvxcbohn@outlook.com
a.grininathai@gmail.com
hello.kakdela@outlook.com

Пароль:
Pirsing0
// -----
учесть то что с каждого таба может идти запрос лишний на сбор статистики
logout?
activate
запросы идут через cookie
закладка как fansmetrick справа


EXTENSION
Добавлены иконки для расширения с со статусами error, success, warning. Добавлены экшены, которые меняют иконку в extension bar.
issue: Возможна проблема с дублированием вкладки, так как у таба одинаковый id создается

305308498
305308472
без setTimeout, как дождаться загрузки
сделать reload расширения когда теряется коннект с странице скреппинга. Reload должен открывать страницу скреппинга
попробовать сделать запрос сохранить его, отложить на 5 сек, самому походить на другой и повторить предыдущий.

sign 12973:a5d6010dde3e70742d241d111d55e610781069a0:504:652d3184
user2 = 279424382


app-token 33d57ade8c02dbc5a333db99ff9ae26a
sess ikrdif8e06kufa8h4sdmp1kls2
auth_id 276910264
user-agent Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36
x-bc e869127d6a4d4e3035fb9e1ad6d12555ab6c59f0


?
redisClient

npm run start -- --entryFile repl

await getCustomRepository(UserRepository).clear();
await get("UserRepository").findOne({ where: { id: 90 }})
await get("UserRepository").findOne({ where: { id: 173 }})
await get("UserRepository").update({ id:  91 }, { role: 'superuser' })
await get("UserRepository").update({ id:  173 }, { role: 'regular' })

await get("ScrapperRepository").find()
await get("ScrapperRepository").update({ id: 5 }, { status: 'offline' })
await get("UnreadMessagesRepository").find()
await get("UnreadMessagesRepository").delete({ id: 2 })

await get("MessageRepository").find()
await get("MessageRepository").find({ id: 40  })
await get("MessageRepository").delete({ id: 3 })

await get("AgencyRepository").delete({ id: 17 })
await get("AgencyRepository").clear();
await get("AgencyRepository").find()

await get("NotificationRepository").find()
await get("NotificationRepository").clear();

зашифровать пароли для кредов
user/me - это в хедере User-Id:
112299545


changedAt:"2023-10-27T02:04:46+00:00"
createdAt: "2023-10-27T02:04:46+00:00"
fromUser.id = 112299545


// id чата 122754683
https://onlyfans.com/api2/v2/chats/122754683/messages?limit=10&order=desc&skip_users=all&id=2119526509867
https://onlyfans.com/api2/v2/chats/122754683/messages?limit=10&order=desc&skip_users=all&id=2111525050392

по чатам такое апи
https://onlyfans.com/api2/v2/chats?limit=10&offset=0&skip_users=all&order=recent
list.lastMessage
list.lastReadMessageId
list.unreadMessagesCount