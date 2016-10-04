/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function () {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  let open = false;

  var SwipeQuestionManager = (function () {
    function Main(question, handler) {
      var self = this;
      this.container = question;
      this.anim = null;
      this.isSwiping = false;
      this.handler = handler;
      this.defaultPosition = 0;
      this.toggleDelta = -60;
      this.previousPosition = 0;

      this.mc = Hammer(question);
      this.mc.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL })
      this.mc.on('panstart panleft panend', function (ev) {
        self.handlePan(ev)
      })

    }


    Main.prototype.handlePan = function (ev) {
      var self = this;
      switch (ev.type) {
        case "panstart":
          self.handlePanStart(ev);
          break;
        case "panend":
          self.handlePanEnd(ev);
          break;
        case "panleft":
          self.handlePanLeft(ev);
          break;
        case "panright":
          self.handlePanRight(ev);
          break;
      }
    }

    Main.prototype.handlePanStart = function (ev) {

    }
    Main.prototype.handlePanEnd = function (ev) {
      var self = this;
      if (!this.isSwiping) {
        return;
      }
      if (ev.deltaX < 0) {
        this.previousPosition = this.previousPosition - ev.distance;
      } else {
        this.previousPosition = this.previousPosition + ev.distance;
      }

      if (ev.deltaX <= this.toggleDelta) {
        console.log('toggled')
        this.handler.call(this, this);

      }

      cancelAnimationFrame(this._anim);
      this.resetPositionToDefault();

    }
    Main.prototype.handlePanLeft = function (ev) {
      var self = this;
      this.isSwiping = true;
      if (!this._anim) {
        this.updatePosition();
      }
      this.defaultPosition = this.previousPosition + ev.deltaX * 1;
      ev.preventDefault();
    }
    Main.prototype.handlePanRight = function (ev) {
      var self = this;
      this.isSwiping = true;
      if (!this._anim) {
        this.updatePosition();
      }
      ev.preventDefault();
      this.defaultPosition = this.previousPosition + ev.deltaX * 1;
    }

    Main.prototype.resetPosition = function () {
      var self = this;
      cancelAnimationFrame(this._anim);
      this._anim = null;
      this.isSwiping = false;
    }

    Main.prototype.setPosition = function (position) {
      var self = this;
      this.container.style.transform = `translate3d(${position}px,0px,0)`;
    }

    Main.prototype.resetPositionToDefault = function () {
      var self = this;
      if (this.previousPosition <= 10) {
        this.previousPosition = this.previousPosition + 10;
        this.setPosition(this.previousPosition);
        this.anim = requestAnimationFrame(() => {
          this.resetPositionToDefault();
        })
      } else {
        this.setPosition(0);
        this.resetPosition();
      }
    }
    Main.prototype.updatePosition = function (position) {
      var self = this;
      this.setPosition(self.defaultPosition);
      this._anim = requestAnimationFrame(() => {
        self.updatePosition();
      });
    }

    return Main;
  } ());


  let question = document.getElementsByClassName('form-group');
  for (var i = 0; i <= question.length - 1; i++){
    let swipe = new SwipeQuestionManager(question[i]);
    swipe.handler = function (ev) {
    if (!ev.container.open) {
      window.animation = anime({
        targets: ev.container.getElementsByClassName('help-text'),
        marginTop: {
          value: [0, 10],
          duration: 300,
          delay: 500,
          easing: 'easeInOutExpo'
        },
        marginBottom: {
          value: [0, 5],
          delay: 500,
          duration: 300,
          easing: 'easeInOutExpo'
        },
        maxHeight: {
          value: ['0%', '100%'],
          duration: 300,
          delay: 500,
        },
        opacity: {
          value: [0, 1],
          delay: 500,
          duration: 350,
          easing: 'easeInOutExpo'
        },
      })
      ev.container.open = true;
    } else {
      let elements = ev.container.getElementsByClassName('help-text');
      for (var i = 0; i < elements.length; i++){
        elements[i].removeAttribute('style');
      }
      ev.container.open = false;
    }
  }
  }
  

  







  // Your custom JavaScript goes here
})();
