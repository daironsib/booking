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

// Генерация случайных чисел в диапазоне
function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand)
}

// Функция для случайной сортировки массива
function compareRandom(a, b) {
    return Math.random() - 0.5
}

// Функция генерации фичь объекта недвижимости
function getFeatures(array) {
    var limit = randomInteger(1, array.length - 1)
    var newArray = []

    for (var i = 0; i < limit; i++) {
        newArray.push(array[i])
    }

    return newArray
}

// Функция генерации данных
function generateData() {
    var newOffers = []

    for (var i = 1; i < 9; i++) {
        var x = randomInteger(300, 900)
        var y = randomInteger(150, 500)

        newOffers.push(
            {
                author: {
                    avatar: `img/avatars/user0` + i + `.png`
                },
                offer: {
                    title: titles[i-1],
                    address: x + ', ' + y,
                    price: randomInteger(1000, 1000000),
                    type: types[randomInteger(0, 3)],
                    rooms: randomInteger(1, 5),
                    guests: randomInteger(1, 10),
                    checkin: times[randomInteger(0, 2)],
                    checkout: times[randomInteger(0, 2)],
                    features: getFeatures(features),
                    description: '',
                    photos: photos.sort(compareRandom)
                },

                location: {
                    x: x,
                    y: y
                }
            }
        )
    }

    return newOffers
}

// Функция генерации метки
function createPinNode(item) {
    var pinNode = mapPinTemplate.cloneNode(true)
    pinNode.style = `left: ` + item.location.x + `px; top: ` + item.location.y + `px;`
    pinNode.querySelector(`img`).src = item.author.avatar
    pinNode.querySelector(`img`).alt = item.offer.title

    return pinNode
}

// Функция генерации карточки
function generateCard(item) {
    var mapCard = mapCardTemplate.cloneNode(true)

    mapCard.querySelector(`.popup__title`).textContent = item.offer.title
    mapCard.querySelector(`.popup__text--address`).textContent = item.offer.address
    mapCard.querySelector(`.popup__text--price`).textContent = item.offer.price + `₽/ночь`
    mapCard.querySelector(`.popup__type`).textContent = typesNames[item.offer.type]
    mapCard.querySelector(`.popup__text--capacity`).textContent = item.offer.rooms + ` комнаты для ` + item.offer.guests + ` гостей`
    mapCard.querySelector(`.popup__text--time`).textContent = `Заезд после ` + item.offer.checkin + `, выезд до ` + item.offer.checkout

   var featuresBlock = mapCard.querySelector(`.popup__features`)
    featuresBlock.innerHTML = ''

    for (var i = 0; i < item.offer.features.length; i++) {
        var feature = document.createElement(`li`)
        feature.className = `popup__feature popup__feature--` + item.offer.features[i]
        featuresBlock.appendChild(feature)
    }

    mapCard.querySelector(`.popup__description`).textContent = item.offer.description

    var photoBlock = mapCard.querySelector(`.popup__photos`)
    var photoItem = photoBlock.querySelector(`img`)
    photoBlock.removeChild(photoItem)

    for (i = 0; i < item.offer.photos.length; i++) {
        var photo = photoItem.cloneNode(true)
        photo.src = item.offer.photos[i]
        photoBlock.appendChild(photo)
    }

    mapCard.querySelector(`.popup__avatar`).src = item.author.avatar

    return mapCard
}

// Функция отрисовки карточки для метки
function renderCard(node) {
    // Если карточка уже есть в DOM удаляем ее
    var createdCard = document.querySelector(`.map__card`)
    if (createdCard) {
        createdCard.remove()
    }

    document.querySelector(`.map`).insertBefore(generateCard(offersMap.get(node)), mapFilters)

    // Вешаем обработчик на закрытие карточки
    document.querySelector(`.popup__close`).addEventListener(`click`, closeCardPopup)
}

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
        var newPin = createPinNode(offers[i])

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
                renderCard(e.target)
            } else {
                renderCard(e.target.parentNode)
            }
        })
    }
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

// Функция изменения select тип жилья
function typeOfferFunc(select) {
  if (select.value === `bungalo`) {
    priceInput.placeholder = 0
    priceInput.min = 0
  } else if (select.value === `house`) {
    priceInput.placeholder = 5000
    priceInput.min = 5000
  } else if (select.value === `palace`) {
    priceInput.placeholder = 10000
    priceInput.min = 10000
  } else {
    priceInput.placeholder = 1000
    priceInput.min = 1000
  }
}

// Функции для чекина и чекаута
function timeinFunc(select) {
  timeoutSelect.value = select.value
}

function timeoutFunc(select) {
  timeinSelect.value = select.value
}

function roomNumberFunc(select) {
  // Ставим всем options disabled
  for (var i = 0; i < capacityOptions.length; i++) {
    capacityOptions[i].disabled = true
  }

  if (select.value === `1`) {
    capacityOptions[2].disabled = false
    capacityOptions[2].selected = true
  } else if (select.value === `2`) {
    capacityOptions[1].disabled = false
    capacityOptions[2].disabled = false
    capacityOptions[1].selected = true
  } else if (select.value === `3`) {
    capacityOptions[0].disabled = false
    capacityOptions[1].disabled = false
    capacityOptions[2].disabled = false
    capacityOptions[0].selected = true
  } else {
    capacityOptions[3].disabled = false
    capacityOptions[3].selected = true
  }
}

// Генерируем данные
offers = generateData()

// Передаем координаты адреса основной метки в инпут формы
setCoords(mapPinMain)

// После перетаскивания основной метки переводим приложение в активный режим
mapPinMain.addEventListener(`mouseup`, onActiveState)