// Файл data.js — модуль, который генерирует фейковые данные
'use strict'

window.generateData = function () {
  var newOffers = []

  for (var i = 1; i < 9; i++) {
    var x = window.util.getRandomInt(300, 900)
    var y = window.util.getRandomInt(150, 500)

    newOffers.push(
      {
        author: {
          avatar: `img/avatars/user0` + i + `.png`
        },
        offer: {
          title: titles[i-1],
          address: x + ', ' + y,
          price: window.util.getRandomInt(1000, 1000000),
          type: types[window.util.getRandomInt(0, 3)],
          rooms: window.util.getRandomInt(1, 5),
          guests: window.util.getRandomInt(1, 10),
          checkin: times[window.util.getRandomInt(0, 2)],
          checkout: times[window.util.getRandomInt(0, 2)],
          features: window.getFeatures(features),
          description: '',
          photos: photos.sort(window.util.compareRandom)
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