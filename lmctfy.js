
"use strict";

var ajax = (function(){

  function send(method, url, data, options) {

    var xhr = new XMLHttpRequest();
    xhr.open(method, url, options.sync);

    xhr.onreadystatechange = function() {

      if (xhr.readyState == XMLHttpRequest.DONE) {

        var response = xhr.responseText;

        if (xhr.getResponseHeader('Content-Type').indexOf('application/json') === 0) {
          response = JSON.parse(xhr.responseText);
        }

        if (xhr.status == 200 && options.success) {
          options.success(response, xhr.status, xhr);
        } else if (options.error) {
          options.error(response, xhr.status, xhr);
        }
      }
    };

    if (method == 'POST') {
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    xhr.send(data)
  };

  function get(url, data, options) {

    if (data) {
      url += '?' + build_query(data);
    }

    send('GET', url, null, options)
  }

  function post(url, data, options) {

    if (data) {
      data = build_query(data);
    }

    send('POST', url, data, options)
  };

  function build_query(data) {

    var query = [];

    for (var key in data) {
      query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }

    return query.join('&');
  };

  return {
    get: get,
    post: post
  };

}());


var typo = (function() {

  var element, text, index, options, timeout;

  function typo() {

    var keyboard = 'qwertyuiopasdfghjkl;zxcvbnm,./',
        key_index = keyboard.indexOf(text[index]),
        offsets = [-10, -9, -1, 1, 9, 10],
        typo_char = keyboard[key_index + offsets[rand(0, 5)]] || text[index];

    // semi-colons can be party of an html entity leave them alone
    if (text[index] != ';' && key_index > -1) {
      element.innerHTML += typo_char;
      timeout = setTimeout(backspace, options.speed + rand(0, 100));
    } else {
      timeout = setTimeout(keypress, options.speed + rand(0, 100));
    }
  }

  function backspace() {

    element.innerHTML = element.innerHTML.replace(/.$/g, '');

    timeout = setTimeout(keypress, options.speed + rand(0, 100));
  }

  function keypress() {

    element.innerHTML += text[index++];

    if (index < text.length) {
      if ((index % rand(5, 20)) === 0) {
        timeout = setTimeout(typo, options.speed + rand(0, 100));
      } else {
        timeout = setTimeout(keypress, options.speed + rand(0, 100));
      }
    } else {
      document.querySelector('.typo-cursor').className += ' typo-blink';
    }
  }

  function type(selector, txt, opts) {

    html_css(selector);

    text = txt;
    options = opts;
    index = 0;

    start();
  }

  function start() {
    timeout = setTimeout(keypress, options.speed);
  }

  function stop() {
    clearTimeout(timeout);
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function html_css(selector) {

    var css = '.typo-cursor { opacity: 1; font-weight: 100; } .typo-blink { ',
        style = style = document.createElement('style'),
        vendors = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

    for (var v in vendors)
      css += vendors[v] + 'animation: blink 1s infinite; '

    css += 'margin-left: -5px; } ';

    vendors.pop()
    vendors.unshift('-');

    for (v in vendors)
      css += '@' + vendors[v] + 'keyframes blink { 0% { opacity:1; } 50% { opacity:0; } 100% { opacity:1; } } '

    css += '}';

    style.innerHTML = css;

    document.body.appendChild(style);

    document.querySelector(selector).innerHTML = '<span class="typo-text"></span><span class="typo-cursor">|</span>';
    element = document.querySelector('.typo-text');
  }

  return {
    type: type,
    start: start,
    stop: stop
  };

}());
