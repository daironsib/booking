// Файл util.js, вспомогательные функции для расчетов координат и работы с массивами
'use strict'

window.util = (function () {

  return {
    // Генерация случайных чисел в диапазоне
    getRandomInt: function (min, max) {
      var rand = min - 0.5 + Math.random() * (max - min + 1)
      return Math.round(rand)
    },
    // Функция для случайной сортировки массива
    compareRandom: function () {
      return Math.random() - 0.5
    },
  }

})()