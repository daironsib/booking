// Файл form.js — модуль, который работает с формой объявления
'use strict'

window.form = (function () {
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

  // Находим input с ценой объекта
  var priceInput = document.querySelector('#price')

  // Находим форму
  var form = document.querySelector('.ad-form')

  // Находим окно о успешной отправке
  var successMessage = document.querySelector('.success')

  // Находим селекты чекина и чекаута
  var timeinSelect = document.querySelector('#timein')
  var timeoutSelect = document.querySelector('#timeout')

  // Находим select тип жилья
  var typeOfferObject = document.querySelector('#type')

  // Находим select количества комнат
  var roomNumber = document.querySelector('#room_number')

  // Находим input с адресом
  var adrInput = document.querySelector('#address')

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

  var inputAvaMap = document.querySelector(`.ad-form-header__input`)
  var adAvaPreview = document.querySelector(`.ad-form-header__preview img`)

  var adFormInput = document.querySelector(`.ad-form__input`)
  var adFormPhotoCont = document.querySelector(`.ad-form__photo`)
  var adFormAllPhotoCont = document.querySelector(`.ad-form__photo-container`)

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png']

  // Обработчики загрузки фоток для оффера
  inputAvaMap.addEventListener('change', function () {
    var file = inputAvaMap.files[0]
    var fileName = file.name.toLowerCase()

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it)
    })

    if (matches) {
      var reader = new FileReader()

      reader.addEventListener('load', function () {
        adAvaPreview.src = reader.result
      })

      reader.readAsDataURL(file)
    }
  })

  adFormInput.addEventListener('change', function () {
    var file = adFormInput.files[0]
    var fileName = file.name.toLowerCase()

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it)
    })

    if (matches) {
      var reader = new FileReader()

      reader.addEventListener('load', function () {
        var img = document.createElement('img')
        img.src = reader.result

        // Проверяем нет ли добавленной фотографии
        if (adFormPhotoCont.childNodes.length === 0) {
          adFormPhotoCont.appendChild(img)
        } else {
          var photoCont = document.createElement(`div`)
          photoCont.classList.add(`ad-form__photo`)
          photoCont.appendChild(img)
          adFormAllPhotoCont.appendChild(photoCont)
        }
      })

      reader.readAsDataURL(file)
    }
  })

  // Функция очистки значений форм объявления
  function clearValues() {
    yourHomeTitle.value = ``
    yourHomePrice.value = ``
    yourRoomNumberOptions[0].selected = true
    yourHomeTypeOptions[0].selected = true
    capacityOptions[2].selected = true
    adrInput.value = `668, 397`
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
    window.backend.save(new FormData(form), successHandler, window.data.errorHandler)
  })

  return {
    // Функция изменения select тип жилья
    typeOfferFunc: function () {
      priceInput.placeholder = typesMap[typeOfferObject.value]
      priceInput.min = typesMap[typeOfferObject.value]
    },

    // Функции для чекина и чекаута
    timeinFunc: function () {
      timeoutSelect.value = timein.value
    },
    timeoutFunc: function () {
      timeinSelect.value = timeout.value
    },

    // Функция для связки комнат и количества гостей
    roomNumberFunc: function () {
      roomMap[roomNumber.value].optionStates.forEach(function(item, i) {
        capacityOptions[i].disabled = item
      })

      capacityOptions[roomMap[roomNumber.value].selectItem].selected = true
    },
  }
})()