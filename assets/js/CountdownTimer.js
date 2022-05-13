// REFACTOR: https://github.com/ModernClimate/jcc-pantheon/blob/b75915488790ce19df2674e5f893aeb461ac4081/web/wp-content/themes/jcc/App/Shortcodes.php

class CountdownTimer {

  constructor() {
    // DOM clock elements
    this.clocks = document.getElementsByClassName('countdown-clock');

    if (this.clocks.length <= 0) {
      return;
    }

    // Array of clock data
    this.countdownClocks = [];

    // Sections of clock
    this.sections = [
      'Days',
      'Hours',
      'Minutes',
      'Seconds'
    ];

    // IE detection
    this.ieOld = window.navigator.userAgent.indexOf('MSIE ');
    this.ie11 = window.navigator.userAgent.indexOf('Trident/');
    this.isOldIE = this.ieOld > 0 || this.ie11 > 0;

    this.setupClocks();
  }

  /**
   * Setup each clock
   */
  setupClocks() {
    for (let index = 0; index < this.clocks.length; index++) {
      // Clock element must have end-time data attribute
      if (!!Object.getOwnPropertyDescriptor(this.clocks[index].dataset, 'endTime') === false || !this.clocks[index]) {
        console.log(`Clock element at index ${index} missing data-end-time attribute.`);
        continue;
      }

      const flipAttribute = !!Object.getOwnPropertyDescriptor(this.clocks[index].dataset, 'isFlipClock');
      const clockEndTime = parseInt(this.clocks[index].dataset.endTime, 10) * 1000;
      const remainingTime = this.getRemainingTime(clockEndTime);

      this.countdownClocks[index] = {
        endTimeSeconds: clockEndTime,
        isFlip: flipAttribute,
        currentDays: remainingTime.days,
        currentHours: remainingTime.hours,
        currentMinutes: remainingTime.minutes,
        currentSeconds: remainingTime.seconds
      };

      if (this.countdownClocks) {
        this.buildClockHTML(index);
        const parentThis = this
        this.countdownClocks[index].setInterval = setInterval(
          this.checkTime,
          100,
          index,
          parentThis
        );
      }
    }
  }

  /**
   * Builds a clock's HTML and sets initial values to markup
   *
   * @param {int} clockIndex (index of clock on page)
   */
  buildClockHTML(clockIndex) {
    const clockElement = this.clocks[clockIndex];
    const clockData = this.countdownClocks[clockIndex]

    for (let index = 0; index < this.sections.length; index++) {
      const sectionName = this.sections[index]

      const leadingZeros = sectionName !== 'Days' ? 1 : 0;
      const currentSectionTime = clockData[`current${sectionName}`];
      const timePropertyValue = this.formatTime(currentSectionTime, leadingZeros);

      // HTML strings
      const flipBottomElementHTML = `
        <div class="clock__digit-bottom">
          <div class="clock__digit-face">${timePropertyValue}</div>
        </div>
      `;

      const digitElementHTML = `
        <div class="clock__digit">
          <div class="clock__digit-value clock__digit-face">${timePropertyValue}</div>
          ${!this.isOldIE && clockData.isFlip ? flipBottomElementHTML : ''}
        </div>
        <div class="clock__digit-gap"></div>
        <div class="clock__label">${sectionName}</div>
      `;

      // Add digit element
      const digitElement = document.createElement('div');
      digitElement.classList.add('clock');
      digitElement.classList.add(`clock__${sectionName.toLowerCase()}`);
      digitElement.innerHTML = digitElementHTML;
      clockElement.appendChild(digitElement);

      // Add digit separator element
      if (index < this.sections.length - 1) {
        const digitSeparator = document.createElement('div');
        digitSeparator.classList.add('clock__digit-separator');
        digitSeparator.innerHTML = '<span></span><span></span>';
        clockElement.appendChild(digitSeparator);
      }
    }
  }

  /**
   * Formats a number with leading zeros
   *
   * @param {int} value (original value)
   * @param {int} zeros (zeroes to add to single digit numbers)
   * @returns {int} (possibly modified value)
   */
  formatTime(value, zeros) {
    if (value < 10) {
      for (var index = 0; index < zeros; index++) {
        value = `0${value}`;
      }
    }

    return value;
  }

  /**
   * Gets a clock's remaining time
   *
   * @param {int} clockEndTime (end time of clock)
   * @returns {Date} a date object
   */
  getRemainingTime(clockEndTime) {
    const now = Date.parse(new Date());
    const time = clockEndTime - now;
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    const data = {
      'now': now,
      'time': time > 0 ? time : 0,
      'seconds': seconds > 0 ? seconds : 0,
      'minutes': minutes > 0 ? minutes : 0,
      'hours': hours > 0 ? hours : 0,
      'days': days > 0 ? days : 0,
      'hasSeconds': time >= 0 ? true : false,
      'hasMinutes': time >= 60 ? true : false,
      'hasHours': time >= (60 * 60) ? true : false,
      'hasDays': time >= (60 * 60 * 24) ? true : false
    };

    return data;
  }

  /**
   * Computes a digit's next value, handles some dom behaviors
   *
   * @param {int} clockIndex (index of clock on page)
   * @param {string} sectionName (clock section name such as 'Minutes')
   * @param {int} newSectionTimeValue (section time value)
   */
  processTimeSection(clockIndex, sectionName, newSectionTimeValue) {
    const sectionNameLower = sectionName.toLowerCase();
    const countDownClock = this.countdownClocks[clockIndex];
    const domClockSection = this.clocks[clockIndex].getElementsByClassName(`clock__${sectionNameLower}`);
    const domClockSectionDigit = domClockSection[0].getElementsByClassName('clock__digit-value');
    const sectionIndex = this.sections.indexOf(sectionName);

    if (countDownClock[`current${sectionName}`] !== newSectionTimeValue) {
      const leadingZeros = sectionName !== 'Days' ? 1 : 0;
      const newValue = this.formatTime(newSectionTimeValue, leadingZeros);
      const oldValue = this.formatTime(countDownClock[`current${sectionName}`], leadingZeros);

      // Update DOM
      this.flipThisDigit(clockIndex, sectionIndex, oldValue, newValue);
      domClockSectionDigit[0].innerHTML = newValue;

      // Store new data
      countDownClock[`current${sectionName}`] = newSectionTimeValue;
    }
  }

  /**
   * Check remaining time and if any remains, run calculations on clock
   *
   * @param {int} clockIndex (index of clock on page)
   * @param {Object} parentThis (scope of parent class if needed)
   */
  checkTime(clockIndex, parentThis = this) {
    if (!parentThis.countdownClocks) {
      return
    }

    const clockEndTime = parentThis.countdownClocks[clockIndex].endTimeSeconds;
    const remainingTime = parentThis.getRemainingTime(clockEndTime);

    for (let index = 0; index < parentThis.sections.length; index++) {
      const sectionName = parentThis.sections[index]
      const newSectionTimeValue = remainingTime[sectionName.toLowerCase()];
      const hasSectionTimeLeft = remainingTime[`has${sectionName}`];

      if (hasSectionTimeLeft) {
        parentThis.processTimeSection(clockIndex, sectionName, newSectionTimeValue);
      } else {
        const className = `clock__${sectionName.toLowerCase()}`;
        const clockSection = parentThis.clocks[clockIndex].getElementsByClassName(className);
        clockSection[0].classList.add(`${className}--done}`);
      }
    }

    if (remainingTime.time <= 0) {
      parentThis.endClock(clockIndex);
    }
  }

  /**
   * Handles behaviors for when clock ends
   *
   * @param {int} clockIndex (index of clock on page)
   */
  endClock(clockIndex) {
    this.clocks[clockIndex].classList.add('countdown-clock--complete');
    clearInterval(this.countdownClocks[clockIndex].setInterval);
  }

  /**
   * Handles flip animation
   *
   * @param {int} clockIndex (index of clock on page)
   * @param {int} digitIndex (index of digit in clock among days/hours/minutes/seconds)
   * @param {int} oldValue (old time value)
   * @param {int} newValue (new time value)
   */
  flipThisDigit(clockIndex, digitIndex, oldValue, newValue) {
    // Do not perform flip animation/behavior if IE or is not a flip clock
    if (this.isOldIE || this.countdownClocks[clockIndex].isFlip !== true) {
      return;
    }

    const domClockDigit = this.clocks[clockIndex].getElementsByClassName('clock__digit');

    // Update bottom digit
    const bottomDigit = domClockDigit[digitIndex].getElementsByClassName('clock__digit-bottom');
    bottomDigit[0].innerHTML = `<div class="clock__digit-face">${oldValue}</div>`;

    // Remove the old flip element and values
    const oldFlipElement = domClockDigit[digitIndex].getElementsByClassName('clock__digit-flip');
    if (oldFlipElement[0]) {
      oldFlipElement[0].parentNode.removeChild(oldFlipElement[0]);
    }

    // Add the new flip element and values
    const flipHTML = `
      <div class="clock__digit-flip-back">
        <div class="clock__digit-face">
          ${newValue}
        </div>
      </div>
      <div class="clock__digit-flip-front">
        <div class="clock__digit-face">
          ${oldValue}
        </div>
      </div>
    `;
    const newFlipElement = document.createElement('div');
    newFlipElement.classList.add('clock__digit-flip');
    newFlipElement.innerHTML = flipHTML;
    domClockDigit[digitIndex].appendChild(newFlipElement);
  }
}

export default CountdownTimer
