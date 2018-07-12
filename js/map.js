// Файл map.js

'use strict';

window.map = (function () {
  // Находим область меток
  var mapPins = document.querySelector(`.map__pins`)

  // Находим плавающую метку
  var mapPinMain = document.querySelector(`.map__pin--main`)

  // Находим input с адресом
  var adrInput = document.querySelector('#address')

  // Находим select тип жилья
  var typeOfferObject = document.querySelector('#type')

  // Находим select для чекина и чекаута
  var timein = document.querySelector('#timein')
  var timeout = document.querySelector('#timeout')

  // Находим select количества комнат
  var roomNumber = document.querySelector('#room_number')

  // Функция включения активного состояния карты
  function onActiveState() {
      // Включаем карту
      document.querySelector(`.map`).classList.remove(`map--faded`)
      var adForm = document.querySelector(`.ad-form`)
      adForm.classList.remove(`ad-form--disabled`)
      var allFieldsets = adForm.querySelectorAll(`fieldset`)

      for(var i = 0; i < allFieldsets.length; i++) {
          allFieldsets[i].disabled = false
      }

      // Удаляем прослушку события
      mapPinMain.removeEventListener(`mouseup`, function() {})

      // Отрисовываем метки похожих объектов
      window.pin.renderAllPins(offers)

      // Вызываем прослушку события клик по метке
      window.card.setListenersForPins()

      // Вызываем прослушку изменения select тип жилья
      typeOfferObject.onchange = window.form.typeOfferFunc

      // Вызываем прослушку для чекина и чекаута
      timein.onchange = window.form.timeinFunc
      timeout.onchange = window.form.timeoutFunc

      // Вызываем прослушку количества комнат
      roomNumber.onchange = window.form.roomNumberFunc
  }

  window.offActiveState = function () {
    document.querySelector(`.map`).classList.add(`map--faded`)
    document.querySelector(`.ad-form`).classList.add(`ad-form--disabled`)
    document.querySelector(`.map`).classList.add(`map--faded`)

    var allFieldsets = document.querySelectorAll(`fieldset`)

    for(var i = 0; i < allFieldsets.length; i++) {
      allFieldsets[i].disabled = true
    }

    mapPinMain.style = `left: 570px; top: 375px;`

    var mapPinsAll = document.querySelectorAll(`.map__pin`)

    for (var i = 1; i < mapPinsAll.length; i++) {
      mapPinsAll[i].classList.add('hidden')
    }

    if (document.querySelector('.map__card')) {
      document.querySelector('.map__card').remove()
    }

    // Прокручиваем страницу наверх
    document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  // Функция координаты плавающей метки
  function setCoords (el) {
      el = el.getBoundingClientRect()
      var left = el.left + window.scrollX + 20
      var top = el.top + window.scrollY + 22
      adrInput.value = left + ', ' + top
  }

  function getPosition (elem) {
    var item = elem.getBoundingClientRect()
    return {
      top: item.top + pageYOffset,
      left: item.left + pageXOffset
    }
  }

  // Передаем координаты адреса основной метки в инпут формы
  setCoords(mapPinMain)

  // После перетаскивания основной метки переводим приложение в активный режим
  mapPinMain.addEventListener ('mousedown', function(downEvt) {
    onActiveState()

    var pinCoords = getPosition(mapPinMain)

    var shift = {
      x: downEvt.pageX - pinCoords.left,
      y: downEvt.pageY - pinCoords.top
    }

    var mapBoxCoords = getPosition(mapPins)

    function onMouseMove(moveEvt) {
      var newLeft = moveEvt.pageX - shift.x - mapBoxCoords.left
      var newTop = moveEvt.pageY - shift.y - mapBoxCoords.top

      if (newLeft < 0) {
        newLeft = 0
      }

      var rightEdge = mapPins.offsetWidth - mapPinMain.offsetWidth

      if (newLeft > rightEdge) {
        newLeft = rightEdge
      }

      if (newTop < 0) {
        newTop = 0
      }

      var bottomEdge = mapPins.offsetHeight - mapPinMain.offsetHeight

      if (newTop > bottomEdge) {
        newTop = bottomEdge
      }

      mapPinMain.style.top = newTop + `px`
      mapPinMain.style.left = newLeft + `px`


      var newTopCoords = newTop + 22
      var newLeftCoords = newTop + 20
      adrInput.value = newLeftCoords + ', ' + newTopCoords

    }

    function onMouseUp() {

      document.removeEventListener(`mousemove`, onMouseMove)
      document.removeEventListener(`mouseup`, onMouseUp)
    }

    document.addEventListener(`mousemove`, onMouseMove)
    document.addEventListener(`mouseup`, onMouseUp)
  })
})()