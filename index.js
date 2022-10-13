const http = require('http');
const url = require('url');
const { v4: uuid } = require('uuid');

const { getAllOperationsComponent } = require("./templates/all-operations");
const { getFormCreateComponent } = require("./templates/form-create");
const { getFormUpdateComponent } = require("./templates/form-update");
const { layoutStart, layoutEnd } = require("./templates/layout");

// Фэйковая база данных. В учебных целях, чтобы не усложнять. По взрослому - Монга и т.д.
const database = {
  operations: [
    { id: uuid(), amount: 50 },
    { id: uuid(), amount: 150 },
  ],
};

// req - request - запрос, то, что приходит серверу от клиента (браузера)
// res - response - ответ, то, что сервер отправляет клиенту (браузеру)
const serverSetup = (req, res) => {

  const urlParsed = url.parse(req.url, true); // Превращает строку ссылки в объект
  // pathname - то, что между хостнэймом + портом (localhost:3001, в данном случае) и ? (начало квери-параметров)
  // query - собственно квери-параметры (объект, разбитый на отдельные параметры)
  const { pathname, query } = urlParsed;
  const { method } = req;

  // Если не передать этот заголовок ответа - как минимум будет белеберда с кодировкой (но что нужно преобразовать разметку - поймет автоматически). Если поиграться с контент-тайпом, подозреваю, можно добиться и не-преобразования разметки... Ага... с типом "plain/text" отдал мне текст в чистом виде и предложил его сохранить в ОС.
  res.setHeader('Content-Type', 'text/html; charset=utf-8;');

  // Если бы база данных не была фэйковой, роуты тоже следовало бы вынести отдельно. Но вообще, как я на данном этапе понимаю, чистая нода плохо подходит для маршрутизации и во фреймворках (Express, Nest) этот момент будет решаться изящнее

  // Обработчик пути "/" или "/index"
  const routeMainPageHandler = () => {
    res.write(`
      ${layoutStart}
      <h2>Операции</h2>
      ${getAllOperationsComponent(database.operations)}
      ${layoutEnd}
    `)
  }

  // Обработчик пути "/create" 
  const routeCreateHandler = () => {
    if (method === 'GET') {
      res.write(`
        ${layoutStart}
        <h2>Новая запись</h2>
        ${getFormCreateComponent()}
        ${layoutEnd}
      `);

    } else if (method === 'POST') {
      let body = [];
      req
        .on('data', (chunk) => {
          body.push(chunk)
        })
        .on('end', () => {
          body = Buffer.concat(body).toString().split('=')[1];
          database.operations.push({ id: uuid(), amount: body })
        });

      res.statusCode = 302;
      res.setHeader('Location', '/');
    }
  }

  // Обработчик пути "/update" 
  const routeUpdateHandler = () => {
    if (method === 'GET') {
      let idx = database.operations.findIndex(el => el.id === query.id);
      const operation = database.operations[idx];

      res.write(`
        ${layoutStart}
        <h2>Редактировать запись</h2>
        ${getFormUpdateComponent(operation)}
        ${layoutEnd}
      `)

    } else if (method === 'POST') {
      if (query.id) {
        let body = [];
        req
          .on('data', (chunk) => {
            body.push(chunk);
          })
          .on('end', () => {
            body = Buffer.concat(body).toString().split('=')[1];
            let idx = database.operations.findIndex(el => el.id === query.id);
            if (idx !== -1) {
              database.operations[idx].amount = body;
            }
          });

        res.statusCode = 302;
        res.setHeader('Location', '/');
      }
    }
  }

  // Обработчик пути "/delete" 
  const routeDeleteHandler = () => {
    database.operations = database.operations.filter(el => el.id !== query.id);
    res.statusCode = 302;
    res.setHeader('Location', '/');
  }

  // Обработчик пути любого другого роута, кроме существующих
  const route404Handler = () => {
    res.statusCode = 404;
    res.write(`
        ${layoutStart}
        <h2>404 | Страница не найдена</h2>
        ${layoutEnd}
      `);
  }

  // Маршрутизация/роутинг - реагируем на смену патхнэйма (роута), ищем целевой и отдаем его разметку. Если не находим - отдаем разметку страницы 404.
  switch (pathname) {
    case '/':
    case '/index':
      routeMainPageHandler();
      break;
    case '/create':
      routeCreateHandler();
      break;
    case '/update':
      routeUpdateHandler();
      break;
    case '/delete':
      routeDeleteHandler();
      break;
    default:
      route404Handler();
  }

  res.end()
}

const server = http.createServer(serverSetup);
const PORT = process.env.PORT || 3001;
server.listen(PORT);

/*
Общая суть происходящего тут:
На 3001 порту развернут http-сервер. К нему можно обращаться как через браузер, так и через curl. И баловаться мы будем именно через "курл", как настоящие бекендоры, без открывания браузера. 
Например:
curl localhost:3001/create или curl -I localhost:3001/create
(Кстати, курлы можно получать и через браузер. В Хромиуме - network -> name -> RMC -> Copy as cURL)

А если через браузер, то обязательно с открытым нетворком, включенными нужными полями таблицы запросов и с внимательным изумением каждого запроса - его реквеста, респонса, превью...
И не забывай, что после каждого изменения в коде сервер нужно перезапускать! Неудобно. Нодемон, видимо, как раз за тем, чтобы этого не делать. Узнаем в дальнейшем.

Не забудь только в отдельном терминале запустить сервер, прежде чем курлить туда!
А сервер, в ответ, будет отдавать разметку в соответствии с настройками маршрутизации. Ну, а что делать с разметкой, браузер уже понимает (интересно, если заголовок ответа поменять - тоже поймет?)
*/
