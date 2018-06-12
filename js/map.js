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

var ads = []

//Находим шаблон для меток
var mapPinTemplate = document.querySelector(`template`).content.querySelector(`.map__pin`)

//Находим шаблон для карточки
var mapCardTemplate = document.querySelector(`template`).content.querySelector(`.map__card`)

//Находим область меток
var mapPins = document.querySelector(`.map__pins`)

//Находим область фильтров
var mapFilters = document.querySelector(`.map__filters-container`)

//Находим плавающую метку
var mapPinMain = document.querySelector(`.map__pin--main`)

//Находим инпут с адресом
var adrInput = document.querySelector('#address');


//Генерация случайных чисел в диапазоне
function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

//Функция для случайной сортировки массива
function compareRandom(a, b) {
    return Math.random() - 0.5;
}

//Функция генерации фичь объекта недвижимости
function getFeatures(array) {
    var limit = randomInteger(1, array.length - 1)
    var newArray = []

    for (var i = 0; i < limit; i++) {
        newArray.push(array[i])
    }

    return newArray
}

//Функция генерации данных
function generateData() {
    var newAds = []

    for (var i = 1; i < 9; i++) {
        var x = randomInteger(300, 900);
        var y = randomInteger(150, 500);

        newAds.push(
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

    return newAds
}

//Функция генерации метки
function generatePin(item) {
    var mapPin = mapPinTemplate.cloneNode(true)
    mapPin.style = `left: ` + item.location.x + `px; top: ` + item.location.y + `px;`
    mapPin.querySelector(`img`).src = item.author.avatar
    mapPin.querySelector(`img`).alt = item.offer.title

    return mapPin
}

//Функция генерации карточки
function generateCard(item) {
    var mapCard = mapCardTemplate.cloneNode(true)

    //Выведите заголовок объявления offer.title в заголовок .popup__title.
    mapCard.querySelector(`.popup__title`).textContent = item.offer.title

    //Выведите адрес offer.address в блок .popup__text--address.
    mapCard.querySelector(`.popup__text--address`).textContent = item.offer.address

    //Выведите цену offer.price в блок .popup__text--price строкой вида {{offer.price}}₽/ночь. Например, 5200₽/ночь.
    mapCard.querySelector(`.popup__text--price`).textContent = item.offer.price + `₽/ночь`

    //В блок .popup__type выведите тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace.
    mapCard.querySelector(`.popup__type`).textContent = typesNames[item.offer.type]

    //Выведите количество гостей и комнат offer.rooms и offer.guests в блок .popup__text--capacity строкой вида {{offer.rooms}} комнаты для {{offer.guests}} гостей. Например, 2 комнаты для 3 гостей.
    mapCard.querySelector(`.popup__text--capacity`).textContent = item.offer.rooms + ` комнаты для ` + item.offer.guests + ` гостей`

    //Время заезда и выезда offer.checkin и offer.checkout в блок .popup__text--time строкой вида Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}. Например, заезд после 14:00, выезд до 12:00.
    mapCard.querySelector(`.popup__text--time`).textContent = `Заезд после ` + item.offer.checkin + `, выезд до ` + item.offer.checkout

    //В список .popup__features выведите все доступные удобства в объявлении.
    var featuresBlock = mapCard.querySelector(`.popup__features`)
    featuresBlock.innerHTML = ''

    for (var i = 0; i < item.offer.features.length; i++) {
        var feature = document.createElement(`li`)
        feature.className = `popup__feature popup__feature--` + item.offer.features[i]
        featuresBlock.appendChild(feature)
    }

    //В блок popup__description выведите описание объекта недвижимости offer.description.
    mapCard.querySelector(`.popup__description`).textContent = item.offer.description

    //В блок .popup__photos выведите все фотографии из списка offer.photos. Каждая из строк массива photos должна записываться как src соответствующего изображения.
    var photoBlock = mapCard.querySelector(`.popup__photos`)
    var photoItem = photoBlock.querySelector(`img`)
    photoBlock.removeChild(photoItem)

    for (i = 0; i < item.offer.photos.length; i++) {
        var photo = photoItem.cloneNode(true)
        photo.src = item.offer.photos[i]
        photoBlock.appendChild(photo)
    }

    //Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.
    mapCard.querySelector(`.popup__avatar`).src = item.author.avatar

    return mapCard
}

//Функция генерации меток
function generatePins(data) {
    for (var i = 0; i < data.length; i++) {
        var fragment = document.createDocumentFragment()
        fragment.appendChild(generatePin(data[i]))
        mapPins.appendChild(fragment)
    }
}

//Функция включения активного состояния карты
function onActiveState() {
    //Включаем карту
    document.querySelector(`.map`).classList.remove(`map--faded`)
    var adForm = document.querySelector(`.ad-form`)
    adForm.classList.remove(`ad-form--disabled`)
    var allFieldsets = adForm.querySelectorAll(`fieldset`)

    for(var i = 0; i < allFieldsets.length; i++) {
        allFieldsets[i].disabled = false
    }

    //Удаляем прослушку события
    mapPinMain.removeEventListener('mouseup', function() {})

    //Создаем метки похожих объектов
    generatePins(ads)

    //Добавляем карточки для меток на страницу
    for (var i = 0; i < ads.length; i++) {
        document.querySelector(`.map`).insertBefore(generateCard(ads[i]), mapFilters)
    }

    //Скрываем карточки
    var mapCardsAll = document.querySelectorAll(`.map__card`)

    for(var i = 0; i < mapCardsAll.length; i++) {
        mapCardsAll[i].classList.add(`hidden`)
    }

    //Вызываем прослушку события клик по метке
    var mapPinsAll = document.querySelectorAll(`.map__pin`)

    for (var i = 1; i < mapPinsAll.length; i++) {
        mapPinsAll[i].addEventListener('click', function(e) {
            console.log(e)
        })
    }
}

// Функция координаты плавающей метки
function getAdress (el) {
    el = el.getBoundingClientRect()
    var left = el.left + window.scrollX + 20
    var top = el.top + window.scrollY + 22
    adrInput.value = left + ', ' + top
}

//Генерируем данные
ads = generateData()

//Получаем адрес метки
getAdress(mapPinMain)

//После перетаскивания основной метки переводим приложение в активный режим
mapPinMain.addEventListener(`mouseup`, onActiveState)