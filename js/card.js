// Файл card.js — модуль, который отвечает за создание карточки объявлений
'use strict'

// Функция генерации карточки
window.generateCard = function (item) {
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

// Функция генерации фичь объекта недвижимости
window.getFeatures = function (array) {
  var limit = window.util.getRandomInt(1, array.length - 1)
  var newArray = []

  for (var i = 0; i < limit; i++) {
    newArray.push(array[i])
  }

  return newArray
}

// Функция отрисовки карточки для метки
window.renderCard = function (node) {
  // Если карточка уже есть в DOM удаляем ее
  var createdCard = document.querySelector(`.map__card`)
  if (createdCard) {
    createdCard.remove()
  }

  document.querySelector(`.map`).insertBefore(window.generateCard(offersMap.get(node)), mapFilters)

  // Вешаем обработчик на закрытие карточки
  document.querySelector(`.popup__close`).addEventListener(`click`, closeCardPopup)
}