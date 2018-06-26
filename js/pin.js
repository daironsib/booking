// Файл pin.js — модуль, который отвечает за создание пина — метки на карте
'use strict'

// Функция генерации метки
window.createPinNode = function (item) {
  var pinNode = mapPinTemplate.cloneNode(true)
  pinNode.style = `left: ` + item.location.x + `px; top: ` + item.location.y + `px;`
  pinNode.querySelector(`img`).src = item.author.avatar
  pinNode.querySelector(`img`).alt = item.offer.title

  return pinNode
}