// ==UserScript==
// @name         Выборка из чата Youtube
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  try to take over the world!
// @author       Crber
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
var startButton = document.createElement("button");
startButton.innerHTML = "&nbsp;&nbsp;&nbsp;▶&nbsp;&nbsp;&nbsp;";

// Стилизация кнопки
startButton.style.position = "fixed";
startButton.style.top = "15px";
startButton.style.right = "50px";
startButton.style.zIndex = "9999";
startButton.style.padding = "4px";
startButton.style.fontSize = "10px";
startButton.style.backgroundColor = "#FFFFFF";
startButton.style.color = "red";
startButton.style.border = "#000000 1px solid";
startButton.style.borderRadius = "4px";
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
