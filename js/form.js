// Файл form.js — модуль, который работает с формой объявления
'use strict'

// Функция изменения select тип жилья
window.typeOfferFunc = function () {
  priceInput.placeholder = typesMap[typeOfferObject.value]
  priceInput.min = typesMap[typeOfferObject.value]
}

// Функции для чекина и чекаута
window.timeinFunc = function () {
  timeoutSelect.value = timein.value
}

window.timeoutFunc = function () {
  timeinSelect.value = timeout.value
}

// Функция для связки комнат и количества гостей
window.roomNumberFunc = function () {
  roomMap[roomNumber.value].optionStates.forEach(function(item, i) {
    capacityOptions[i].disabled = item
  })

  capacityOptions[roomMap[roomNumber.value].selectItem].selected = true
}