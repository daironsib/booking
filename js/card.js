// Файл card.js — модуль, который отвечает за создание карточки объявлений
'use strict'

window.card = (function () {

  var typesNames = {
    palace: `Дворец`,
    flat: `Квартира`,
    house: `Дом`,
    bungalo: `Бунгало`
  }

  // Находим шаблон для карточки
  var mapCardTemplate = document.querySelector(`template`).content.querySelector(`.map__card`)

  // Находим область фильтров
  var mapFilters = document.querySelector(`.map__filters-container`)

  // Функция генерации карточки
  function generateCard (item) {
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

  // Функция закрытия карточки
  function closeCardPopup () {
    document.querySelector(`.popup__close`).removeEventListener(`click`, function(){})
    document.querySelector(`.map__card`).remove()
  }

  return {
    // Функция удаления карточек
    removeAllCards: function () {
      var createdCard = document.querySelector(`.map__card`)
      if (createdCard) {
        createdCard.remove()
      }
    },

    // Функция назначения прослушки по меткам для рендера карточки
    setListenersForPins: function () {
      var mapPinsAll = document.querySelectorAll(`.map__pin`)

      mapPinsAll.forEach(function (el, i) {
        if (i > 0) {
          el.addEventListener(`click`, function(e) {
            if (e.target.classList.contains(`map__pin`)) {
              window.renderCard(e.target)
            } else {
              window.card.renderCard(e.target.parentNode)
            }
          })
        }
      })
    },

    // Функция отрисовки карточки для метки
    renderCard: function (node) {
      //var offersMap = new Map()
      //console.log(offersMap)
      // Если карточка уже есть в DOM удаляем ее
      window.card.removeAllCards()

      document.querySelector(`.map`).insertBefore(generateCard(window.offersMap.get(node)), mapFilters)

      // Вешаем обработчик на закрытие карточки
      document.querySelector(`.popup__close`).addEventListener(`click`, closeCardPopup)
    }
  }
})()