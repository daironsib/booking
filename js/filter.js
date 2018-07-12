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
  var featuresArr = []

  // Функция для обновления состояния фильтра
  function createFilterState() {
    filters = {
      type: housingType.value,
      price: housingPrice.value,
      rooms: housingRooms.value,
      guests: housingQuests.value,
      features: {
        wifi: mapCheckbox[0].checked,
        dishwasher: mapCheckbox[1].checked,
        parking: mapCheckbox[2].checked,
        washer: mapCheckbox[3].checked,
        elevator: mapCheckbox[4].checked,
        conditioner: mapCheckbox[5].checked
      }
    }

    // Форумируем массив выбранных фич
    featuresArr = []
    for (var key in filters.features) {
      if (filters.features[key] === true) {
        featuresArr.push(key)
      }
    }
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

  // Функция фильтрации офферов
  function filterOffers(offers) {
    var newArray = offers.filter(function(el) {
      if (el.offer.type === filters.type || filters.type === `any`) {
        // Переходим к фильтру по цене
        if (priceConvert(el.offer.price) === filters.price || filters.price === `any`) {
          // Переходим к фильтру по кол комнат
          if (Number(el.offer.rooms) === Number(filters.rooms) || filters.rooms === `any`) {
            // Переходим к фильтру по кол гостей
            if (Number(el.offer.guests) === Number(filters.guests) || filters.guests === `any`) {
              // Проверяем чекнуты ли фича фильтры
              var offerFeatures = el.offer.features
              if (featuresArr.length === 0) return true
              else {
                // Проверяем есть ли у оффера фичи
                if (offerFeatures.length > 0) {
                  var featuresFlag = 0
                  // Ищем совпадения фич
                  featuresArr.forEach(function(el) {
                    offerFeatures.forEach(function(offerEl) {
                      if (el === offerEl) {
                        featuresFlag++
                      }
                    })
                  })
                  // Если количество выбранных и счетчика совпадает возвращаем true
                  if (featuresArr.length === featuresFlag) return true; else false
                } else return false
              }
            } else return false
          } else return false
        } else return false
      } else return false
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