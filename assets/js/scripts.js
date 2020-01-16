// DOM clock elements
const clocks = document.getElementsByClassName('countdown-clock');

// Array of clocks and their properties
const countDownClocks = [];

// Sections of clock
const sections = [
  'Days',
  'Hours',
  'Minutes',
  'Seconds'
];

/**
 * Formats a number
 *
 * @param {int} value (original value)
 * @param {int} zeros (zeroes to add to single digit numbers)
 * @returns {int} (possibly modified value)
 */
function formatTime(value, zeros) {
  if (value < 10) {
    for (let index = 0; index < zeros; index++) {
      value = '0' + value;
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
function getRemainingTime(clockEndTime) {
  const now     = Date.parse(new Date());
  const time    = clockEndTime - now;
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / 1000 / 60) % 60);
  const hours   = Math.floor((time / (1000 * 60 * 60)) % 24);
  const days    = Math.floor(time / (1000 * 60 * 60 * 24));

  return {
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
}

/**
 * Handles flip animation
 *
 * @param {int} clockIndex (index of clock on page)
 * @param {int} digitIndex (index of digit in clock among days/hours/minutes/seconds)
 * @param {int} oldValue (old time value)
 * @param {int} newValue (new time value)
 */
function flipThisDigit(clockIndex, digitIndex, oldValue, newValue) {

  if (countDownClocks[clockIndex].isFlip !== true) {
    return;
  }

  const domClockDigit = clocks[clockIndex].getElementsByClassName('clock__digit');

  // Update bottom digit
  const bottomDigit = domClockDigit[digitIndex].getElementsByClassName('clock__digit-bottom');
  bottomDigit[0].innerHTML = `<div>${oldValue}</div>`;

  // Remove the old flip element and values
  const oldFlipElement = domClockDigit[digitIndex].getElementsByClassName('clock__digit-flip');
  if (oldFlipElement[0]) {
    oldFlipElement[0].parentNode.removeChild(oldFlipElement[0]);
  }

  // Add the new flip element and values
  const newFlipElement = document.createElement('div');
  newFlipElement.classList.add('clock__digit-flip');
  newFlipElement.innerHTML = `
    <div class="clock__digit-flip-back"><div>${newValue}</div></div>
    <div class="clock__digit-flip-front"><div>${oldValue}</div></div>
  `;
  domClockDigit[digitIndex].appendChild(newFlipElement);
}

/**
 * Computes a digit's next value, handles some dom behaviors
 *
 * @param {int} clockIndex (index of clock on page)
 * @param {string} sectionName (clock section name such as 'Minutes')
 * @param {int} newSectionTimeValue (section time value)
 */
function processTimeSection(clockIndex, sectionName, newSectionTimeValue) {
  const sectionNameLower     = sectionName.toLowerCase();
  const countDownClock       = countDownClocks[clockIndex];
  const domClockSection      = clocks[clockIndex].getElementsByClassName('clock__' + sectionNameLower);
  const domClockSectionDigit = domClockSection[0].getElementsByClassName('clock__digit-value');
  const sectionIndex         = sections.indexOf(sectionName);

  if (countDownClock['current' + sectionName] !== newSectionTimeValue) {
    const leadingZeros = sectionName !== 'Days' ? 1 : 0;
    const newValue     = formatTime(newSectionTimeValue, leadingZeros);
    const oldValue     = formatTime(countDownClock['current' + sectionName], leadingZeros);

    // Update DOM
    flipThisDigit(clockIndex, sectionIndex, oldValue, newValue);
    domClockSectionDigit[0].innerHTML = newValue;

    // Store new data
    countDownClock['current' + sectionName] = newSectionTimeValue;
  }
}

/**
 * Handles behaviors for when clock ends
 *
 * @param {int} clockIndex (index of clock on page)
 */
function endClock(clockIndex) {
  clocks[clockIndex].classList.add('countdown-clock--complete');
  clearInterval(countDownClocks[clockIndex].setInterval);
}

/**
 * Check remaining time and if any remains, run calculations on clock
 *
 * @param {int} clockIndex (index of clock on page)
 */
function checkTime(clockIndex) {
  const clockEndTime  = countDownClocks[clockIndex].endTimeSeconds;
  const remainingTime = getRemainingTime(clockEndTime);

  sections.forEach(sectionName => {
    const newSectionTimeValue = remainingTime[sectionName.toLowerCase()];
    const hasSectionTimeLeft  = remainingTime['has' + sectionName];

    if (hasSectionTimeLeft) {
      processTimeSection(clockIndex, sectionName, newSectionTimeValue);
    } else {
      const className    = 'clock__' + sectionName.toLowerCase();
      const clockSection = clocks[clockIndex].getElementsByClassName(className);
      clockSection[0].classList.add(className + '--done');
    }
  });

  if (remainingTime.time <= 0) {
    endClock(clockIndex);
  }
}

/**
 * Builds a clock's HTML and sets initial values to markup
 *
 * @param {int} clockIndex (index of clock on page)
 */
function buildClockHTML(clockIndex) {
  const clockElement = clocks[clockIndex];
  const isFlipClock  = clockElement.dataset.hasOwnProperty('isFlipClock') ? true : false;

  sections.forEach((sectionName, index) => {
    const leadingZeros        = sectionName !== 'Days' ? 1 : 0;
    const timePropertyValue   = formatTime(countDownClocks[clockIndex]['current' + sectionName], leadingZeros);

    // Add digit element
    const flipBottomElement   = isFlipClock ? '<div class="clock__digit-bottom"><div>${timePropertyValue}</div></div>' : '';
    const digitElement        = document.createElement('div');
    const digitElementContent = `
        <div class="clock__digit">
            <div class="clock__digit-value">${timePropertyValue}</div>
            ${flipBottomElement}
        </div>
        <div class="clock__digit-gap"></div>
        <div class="clock__label">${sectionName}</div>
    `;
    digitElement.classList.add('clock', 'clock__' + sectionName.toLowerCase());
    digitElement.innerHTML = digitElementContent;
    clockElement.appendChild(digitElement);

    // Add digit separator element
    if (index < sections.length - 1) {
      const digitSeparator = document.createElement('div');
      digitSeparator.classList.add('clock__digit-separator');
      digitSeparator.innerHTML = '<span></span><span></span>';
      clockElement.appendChild(digitSeparator);
    }
  });
}

/**
 * Setup each clock
 */
function setupClocks() {

  for (let index = 0; index < clocks.length; index++) {

    // Clock element must have end-time data attribute
    if (!clocks[index].dataset.hasOwnProperty('endTime') || !clocks[index]) {
      console.log('Clock at index ' + index + ' HTML element missing data-end-time attribute or value.');
      continue;
    }

    const flipAttribute = clocks[index].dataset.hasOwnProperty('isFlipClock') ? true : false;
    const clockEndTime  = parseInt(clocks[index].dataset.endTime, 10) * 1000;
    const remainingTime = getRemainingTime(clockEndTime);

    countDownClocks[index] = {
      endTimeSeconds: clockEndTime,
      isFlip:         flipAttribute,
      currentDays:    remainingTime.days,
      currentHours:   remainingTime.hours,
      currentMinutes: remainingTime.minutes,
      currentSeconds: remainingTime.seconds
    };

    buildClockHTML(index);

    countDownClocks[index].setInterval = setInterval(checkTime, 100, index);
  }
}

setupClocks();
