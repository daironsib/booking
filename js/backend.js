//Файл backend.js - функции для работы с бэкэндом

'use strict'

window.backend = (function () {
  function request(url, options) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest()
      xhr.responseType = 'json'
      xhr.timeout = options.timeout
      xhr.open(options.method, url)

      xhr.onload = function() {
        if (this.status == 200) {
          resolve(this.response)
        } else {
          var error = new Error(this.statusText)
          error.code = this.status
          reject(error)
        }
      }

      xhr.onerror = function() {
        reject(new Error(`Произошла ошибка соединения`))
      }

      xhr.timeout = function() {
        reject(new Error(`Запрос не успел выполниться за ${xhr.timeout} мс`))
      }

      xhr.send(options.data)
    })
  }

  return {
    load: function (onLoad, onError) {
      var URL = `https://js.dump.academy/keksobooking/data`
      var params = {
        method: `GET`,
        timeout: 10000
      }
      request(URL, params, onLoad, onError)
        .then(
          response => onLoad(response),
          error => onError(error)
        )
    },
    save: function (data, onLoad, onError) {
      var URL = `https://js.dump.academy/keksobooking`

      var params = {
        method: `POST`,
        data: data,
        timeout: 10000
      }
      request(URL, params, onLoad, onError)
        .then(
          response => onLoad(response),
          error => onError(error)
        )
    }
  }
})()