// Файл form.js — модуль, который работает с формой объявления
'use strict'

var typesMap = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
}

var roomMap = {
  1: {
    optionStates: [true, true, false, true],
    selectItem: 2
  },
  2: {
    optionStates: [true, false, false, true],
    selectItem: 1
  },
  3: {
    optionStates: [false, false, false, true],
    selectItem: 0
  },
  100: {
    optionStates: [true, true, true, false],
    selectItem: 3
  }
}

//Плавающий маркер
var mainPin = document.querySelector('.map__pin--main')

// Находим форму
var form = document.querySelector('.ad-form')

// Находим окно о успешной отправке
var successMessage = document.querySelector('.success')

// Находим поля формы объявления
var yourHomeTitle = document.getElementById('title')
var yourHomeType = document.getElementById('type')
var yourHomeTypeOptions = yourHomeType.querySelectorAll('option')
var yourHomePrice = document.getElementById('price')
var yourRoomNumber = document.getElementById('room_number')
var yourRoomNumberOptions = yourRoomNumber.querySelectorAll('option')
var yourCapacity = document.getElementById('capacity')
var capacityOptions = yourCapacity.querySelectorAll('option')
var yourDescription = document.getElementById('description')
var adrInput = document.querySelector('#address')


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

// Функция очистки значений форм объявления
function clearValues() {
  yourHomeTitle.value = ``
  yourHomePrice.value = ``
  yourRoomNumberOptions[0].selected = true
  yourHomeTypeOptions[0].selected = true
  capacityOptions[2].selected = true
  window.adrInput.value = `668, 397`
  yourDescription.value = ``
}

// Функция для успешной отправки
function successHandler() {
  successMessage.classList.remove('hidden')
  clearValues()
  window.offActiveState()
  setTimeout(function () {
    successMessage.classList.add('hidden')
  }, 3000)
}

form.addEventListener('submit', function (e) {
  e.preventDefault()
  window.backend.save(new FormData(form), successHandler, window.errorHandler)
})

