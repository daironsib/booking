// Файл filter.js
'use strict';

window.filter = (function () {
  var mapFilters = document.querySelector(`.map__filters`)
  var housingType = document.querySelector(`#housing-type`)
  var housingPrice = document.querySelector(`#housing-price`)
  var housingRooms = document.querySelector(`#housing-rooms`)
  var housingQuests = document.querySelector(`#housing-guests`)
  var mapCheckbox = document.querySelectorAll(`.map__checkbox`)

  var filters = {}
  var features = []

  // Функция для обновления состояния фильтра
  function createFilterState() {
    filters = {
      type: housingType.value,
      price: housingPrice.value,
      rooms: housingRooms.value,
      guests: housingQuests.value,
    }

    // Форумируем массив выбранных фич
    features = []
    mapCheckbox.forEach(function(item) {
      if (item.checked) {
        features.push(item.value)
      }
    })
  }

  // Функция конвертирования цены
  function priceConvert(value) {
    var answer = `middle`
    if (value <= 10000) {
      answer = `low`
    }
    if (value >= 50000) {
      answer = `high`
    }
    return answer
  }

  // Функция housing фильтрации
  function housingFilter(offer) {
    for (var key in filters) {
      // Конвертируем количество гостей в число
      if (filters[`guests`] !== `any`) filters[`guests`] = Number(filters[`guests`])

      // Конвертируем количество комнат в число
      if (filters[`rooms`] !== `any`) filters[`rooms`] = Number(filters[`rooms`])

      if (key === `price`) {
        if (filters[key] !== `any` && filters[key] !== priceConvert(offer[key])) return false
      } else {
        if (filters[key] !== `any` && filters[key] !== offer[key]) return false
      }
    }
    return true
  }

  // Функция фильтрации фич
  function featuresFilter(offer) {
    var filteredFeatures = features.filter(function (feature) {
      return offer.features.indexOf(feature) !== -1
    })

    return filteredFeatures.length === features.length
  }

  // Функция фильтрации офферов
  function filterOffers(offers) {
    var newArray = offers.filter(function(el) {
      if (housingFilter(el.offer)) return featuresFilter(el.offer)
      else return false
    })
    return newArray
  }

  mapFilters.addEventListener(`change`, function() {
    // Обновляем состояние фильтра
    createFilterState()

    //Если есть открытые карточки, удаляем их
    window.card.removeAllCards()

    var filteredOffers = filterOffers(offers)

    // Перерендер офферов
    window.debounce(window.pin.renderAllPins(filteredOffers))

    // Вызываем прослушку события клик по метке
    window.card.setListenersForPins()
  })
})()