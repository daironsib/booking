var titles = [
    `Большая уютная квартира`,
    `Маленькая неуютная квартира`,
    `Огромный прекрасный дворец`,
    `Маленький ужасный дворец`,
    `Красивый гостевой домик`,
    `Некрасивый негостеприимный домик`,
    `Уютное бунгало далеко от моря`,
    `Неуютное бунгало по колено в воде`
]

var types = [
    `palace`,
    `flat`,
    `house`,
    `bungalo`
]

var typesNames = {
    palace: `Дворец`,
    flat: `Квартира`,
    house: `Дом`,
    bungalo: `Бунгало`
}

var times = [
    `12:00`,
    `13:00`,
    `14:00`
]

var features = [
    `wifi`,
    `dishwasher`,
    `parking`,
    `washer`,
    `elevator`,
    `conditioner`
]

var photos = [
    `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
]

var offers = []

var offersMap = new Map()

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

var typesMap = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
}

// Находим шаблон для меток
var mapPinTemplate = document.querySelector(`template`).content.querySelector(`.map__pin`)

// Находим шаблон для карточки
var mapCardTemplate = document.querySelector(`template`).content.querySelector(`.map__card`)

// Находим область меток
var mapPins = document.querySelector(`.map__pins`)

// Находим область фильтров
var mapFilters = document.querySelector(`.map__filters-container`)

// Находим плавающую метку
var mapPinMain = document.querySelector(`.map__pin--main`)

// Находим input с адресом
var adrInput = document.querySelector('#address')

// Находим input с ценой объекта
var priceInput = document.querySelector('#price')

// Находим селекты чекина и чекаута
var timeinSelect = document.querySelector('#timein')
var timeoutSelect = document.querySelector('#timeout')

// Находим select количество гостей и его опции
var capacity = document.querySelector('#capacity')
var capacityOptions = capacity.querySelectorAll(`option`)

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
    var fragment = document.createDocumentFragment()

    for (var i = 0; i < offers.length; i++) {
        // Создаем новую метку
        var newPin = window.createPinNode(offers[i])

        // Вставляем метку в фрагмент
        fragment.appendChild(newPin)

        // Заполняем карту карточек для меток
        offersMap.set(newPin, offers[i])
    }

    // Вставляем фрагмент в реальный DOM
    mapPins.appendChild(fragment)

    // Вызываем прослушку события клик по метке
    var mapPinsAll = document.querySelectorAll(`.map__pin`)

    for (var i = 1; i < mapPinsAll.length; i++) {
        mapPinsAll[i].addEventListener(`click`, function(e) {
            if (e.target.classList.contains(`map__pin`)) {
                window.renderCard(e.target)
            } else {
              window.renderCard(e.target.parentNode)
            }
        })
    }

    // Вызываем прослушку изменения select тип жилья
    typeOfferObject.onchange = window.typeOfferFunc

    // Вызываем прослушку для чекина и чекаута
    timein.onchange = window.timeinFunc
    timeout.onchange = window.timeoutFunc

    // Вызываем прослушку количества комнат
    roomNumber.onchange = window.roomNumberFunc
}

// Функция координаты плавающей метки
function setCoords (el) {
    el = el.getBoundingClientRect()
    var left = el.left + window.scrollX + 20
    var top = el.top + window.scrollY + 22
    adrInput.value = left + ', ' + top
}

// Функция закрытия карточки
function closeCardPopup() {
    document.querySelector(`.popup__close`).removeEventListener(`click`, function(){})
    document.querySelector(`.map__card`).remove()
}

function getPosition (elem) {
  var item = elem.getBoundingClientRect()
  return {
    top: item.top + pageYOffset,
    left: item.left + pageXOffset
  }
}

// Генерируем данные
offers = window.generateData()

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