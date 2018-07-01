// Файл data.js — модуль, который генерирует фейковые данные
'use strict'

var offers = []

// Функция успешного получения предложений с сервера
function recievedHandler(data) {
  offers = data
}

// Функция вывода ошибки получения данных о предложениях
window.errorHandler = function (errorMessage) {
  var node = document.createElement('div')
  node.style = 'z-index: 100; width: 100%; text-align: center; background-color: red; padding: 15px 0;'
  node.style.position = 'absolute'
  node.style.top = 0
  node.style.left = 0
  node.style.right = 0
  node.style.fontSize = '25px'

  node.textContent = errorMessage
  document.body.insertAdjacentElement('afterbegin', node)
}

// Подгружаем данные о предложениях с сервера
window.backend.load(recievedHandler, window.errorHandler)