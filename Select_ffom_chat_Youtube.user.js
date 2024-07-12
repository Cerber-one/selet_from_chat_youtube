// ==UserScript==
// @name         Выборка из чата Youtube
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  try to take over the world!
// @author       Cerber
// @match            *://*.youtube.com/live_chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
var lastMessageID = 0;
var flag = false;
var MessageID;
var n=0;
// Создание элемента кнопки
var startButton = document.createElement("a");
//startButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24"><g fill="#FFF" stroke="#000"><path d="M22.54 7.6s-.2-1.5-.86-2.17c-.83-.87-1.75-.88-2.18-.93-3.04-.22-7.6-.2-7.6-.2s-4.56-.02-7.6.2c-.43.05-1.35.06-2.18.93-.65.67-.86 2.18-.86 2.18S1.04 9.4 1 11.18v1.66c.04 1.78.26 3.55.26 3.55s.2 1.5.86 2.18c.83.87 1.9.84 2.4.94 1.7.15 7.2.2 7.38.2 0 0 4.57 0 7.6-.22.43-.05 1.35-.06 2.18-.93.65-.67.86-2.18.86-2.18s.22-1.77.24-3.55v-1.66c-.02-1.78-.24-3.55-.24-3.55z"/>    <path fill="#FF0000" d="M9.68 8.9v6.18l5.84-3.1z" stroke="none"/>  </g></svg>';

    // Создаем и добавляем иконку YouTube
var youtubeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
youtubeIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
youtubeIcon.setAttribute("viewBox", "0 0 24 24");
youtubeIcon.setAttribute("width", "30");
youtubeIcon.innerHTML = `
  <g fill="#FFF" stroke="#000">
    <path d="M22.54 7.6s-.2-1.5-.86-2.17c-.83-.87-1.75-.88-2.18-.93-3.04-.22-7.6-.2-7.6-.2s-4.56-.02-7.6.2c-.43.05-1.35.06-2.18.93-.65.67-.86 2.18-.86 2.18S1.04 9.4 1 11.18v1.66c.04 1.78.26 3.55.26 3.55s.2 1.5.86 2.18c.83.87 1.9.84 2.4.94 1.7.15 7.2.2 7.38.2 0 0 4.57 0 7.6-.22.43-.05 1.35-.06 2.18-.93.65-.67.86-2.18.86-2.18s.22-1.77.24-3.55v-1.66c-.02-1.78-.24-3.55-.24-3.55z"/>
    <path fill="#FF0000" d="M9.68 8.9v6.18l5.84-3.1z" stroke="none"/>
  </g>
`;

// Добавляем иконку в кнопку
startButton.appendChild(youtubeIcon);

// Стилизация кнопки
startButton.style.position = "fixed";
startButton.style.top = "15px";
startButton.style.right = "90px";
startButton.style.zIndex = "9999";
startButton.style.cursor = "pointer";

// Добавление кнопки на страницу
document.body.appendChild(startButton);

    // Добавление обработчика события клика на кнопку
 // Обработчик события клика на кнопку
startButton.addEventListener('click', () => {
  // Создание нового окна
  const newWindow = window.open('', '', 'width=800,height=500');

  // Добавление контента в новое окно
  newWindow.document.write(`
  <!DOCTYPE html>
    <html>
      <head>
        <title>Сообщения отобранные по ключевому слову</title>
        <style>
   .input-field-div {
    position: fixed; /* Фиксированное положение */
    left: 10px; /* Расстояние от правого края окна браузера */
    top: 10px; /* Расстояние сверху */
    }
    p {
    padding: 1px 1px 1px 1px;
    margin: 1px 1px 1px 1px;
    font-family: Courier New;
    }
    img {
    width: 18px;
    }
  </style>
      </head>
      <body>
        <div id="chat-window" style="height: 460px; overflow-y: scroll;font-family:verdana; font-size: 11pt"></div>
        <div id="input-field-div" style="font-family:courier new; font-size: 9pt">
			Ключевые слова через запятую: <input type="text" id="input-field" onchange="savekeywords()">
            Автопрокрутка: <input type="checkbox" id="auto-check">
        </div>
      </body>
      <script>
      function getkeywords(){
		document.getElementById("input-field").value = localStorage.getItem("keywords");
      }
      function savekeywords(){
		localStorage["keywords"] = document.getElementById("input-field").value;
      }
      getkeywords();
      </script>
    </html>
  `);

  // Получение ссылок на элементы в новом окне
  const chatWindow = newWindow.document.getElementById('chat-window');
  const inputField = newWindow.document.getElementById('input-field');
  const AutoField = newWindow.document.getElementById('auto-check');

  // Функция для добавления сообщений в чат-окно
  const handleMessage = (author, message, id, autoscroll) => {
    const p = newWindow.document.createElement('div');
    p.id = id;
    p.innerHTML = '<input type="checkbox"><b>'+author+'</b>: '+message;
    chatWindow.appendChild(p);
    if (autoscroll.checked){
        p.scrollIntoView({block: "center", behavior: "smooth"});
    }
  };

  // Функция для отслеживания новых сообщений в чате трансляции
  const observeChat = () => {
    //const chat = document.querySelector('ytd-live-chat-frame iframe').contentWindow.document.querySelector('yt-live-chat-frame').shadowRoot.querySelector('#chatframe').contentWindow.document.body;
    const messages = document.querySelectorAll('yt-live-chat-text-message-renderer');

    flag=false;
    messages.forEach((message) => {
		if (lastMessageID == 0){
          flag = true;
        }
		if (flag){
          const messageText = message.querySelector('#message').innerHTML.trim();
          const messageTextCheck = message.querySelector('#message').innerHTML.toLowerCase().trim();
          const author = message.querySelector('#author-name').innerText.trim();
          const SplitInput = inputField.value.toLowerCase().split(',');
          SplitInput.forEach((vallue) =>{
              if (messageTextCheck.startsWith(vallue)) {
                  handleMessage(author, messageText, message.id, AutoField);
              }
          });
      }
      MessageID = message.id;
      if (lastMessageID == MessageID){
          flag = true;
      }
    });
    lastMessageID = MessageID;
  };
  // Запуск отслеживания новых сообщений в чате
  const intervall = setInterval(observeChat, 1000);
    newWindow.addEventListener("beforeunload", function(event) {
        clearInterval(intervall);
        
        const data = chatWindow.innerText; // Данные для сохранения в файл
        
        // Создание объекта Blob
        const blob = new Blob([data], { type: "text/plain" });
        
        // Создание объекта URL для скачивания файла
        const url = URL.createObjectURL(blob);
        
        // Создание ссылки для скачивания файла
        const link = document.createElement("a");
        link.download = "questionFromChat.txt";
        link.href = url;
        
        // Нажатие на ссылку для скачивания файла
        document.body.appendChild(link);
        link.click();
        
        // Удаление объекта URL
        URL.revokeObjectURL(url);
        
    });
});
  })();
