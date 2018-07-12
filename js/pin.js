// Файл pin.js — модуль, который отвечает за создание пина — метки на карте
'use strict'

window.pin = (function () {
  window.offersMap = new Map()

  // Находим шаблон для меток
  var mapPinTemplate = document.querySelector(`template`).content.querySelector(`.map__pin`)

  // Находим область меток
  var mapPins = document.querySelector(`.map__pins`)

  // Функция генерации метки
  function createPinNode (item) {
    var pinNode = mapPinTemplate.cloneNode(true)
    pinNode.style = `left: ` + item.location.x + `px; top: ` + item.location.y + `px;`
    pinNode.querySelector(`img`).src = item.author.avatar
    pinNode.querySelector(`img`).alt = item.offer.title

    return pinNode
  }

  return {
    // Функция отрисовки меток
    renderAllPins: function (offers) {
      // Удаляем все нарисованные метки
      var mapPinsAll = document.querySelectorAll(`.map__pin`)
      mapPinsAll.forEach(function (el, i) {
        if (i > 0) {
          el.remove()
        }
      })

      var fragment = document.createDocumentFragment()

      for (var i = 0; i < offers.length; i++) {
        // Создаем новую метку
        var newPin = createPinNode(offers[i])

        // Вставляем метку в фрагмент
        fragment.appendChild(newPin)

        // Заполняем карту карточек для меток
        offersMap.set(newPin, offers[i])
      }

      // Вставляем фрагмент в реальный DOM
      mapPins.appendChild(fragment)
    }
  }
})()