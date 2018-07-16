// Файл filter.js
'use strict';

window.filter = (function () {
  var mapFilters = document.querySelector(`.map__filters`)
  var housingType = document.querySelector(`#housing-type`)
  var housingPrice = document.querySelector(`#housing-price`)
  var housingRooms = document.querySelector(`#housing-rooms`)
  var housingQuests = document.querySelector(`#housing-guests`)
  var mapCheckbox = document.querySelectorAll(`.map__checkbox`)

  //var filters = {}
  //var features = []

  var filters = {
    selects: {},
    features: []
  }

  // Функция для обновления состояния фильтра
  function createFilterState() {
    filters.selects = {
      type: housingType.value,
      price: housingPrice.value,
      rooms: housingRooms.value,
      guests: housingQuests.value,
    }

    // Форумируем массив выбранных фич
    mapCheckbox.forEach(function(item) {
      if (item.checked) {
        filters.features.push(item.value)
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
    for (var key in filters.selects) {
      //if (filters[key] === `any`) return true
      // Конвертируем количество гостей в число
      if (filters.selects[`guests`] !== `any`) filters.selects[`guests`] = Number(filters.selects[`guests`])

      // Конвертируем количество комнат в число
      if (filters.selects[`rooms`] !== `any`) filters.selects[`rooms`] = Number(filters.selects[`rooms`])

      if (key === `price`) {
        if (filters.selects[key] !== `any` && filters.selects[key] !== priceConvert(offer[key])) return false
      } else {
        if (filters.selects[key] !== `any` && filters.selects[key] !== offer[key]) return false
      }
    }
    return true
  }

  // Функция фильтрации фич
  function featuresFilter(offer) {
    var filteredFeatures = filters.features.filter(function (feature) {
      return offer.features.indexOf(feature) !== -1
    })

    return filteredFeatures.length === filters.features.length
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