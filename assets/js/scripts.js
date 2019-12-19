// TODO: document ready
// TODO make sure to handle all time in seconds (integer) whenever possible



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

// Setup each clock
for (let index = 0; index < clocks.length; index++) {

  // Clock element must have end-time data attribute
  if (!clocks[index].dataset.hasOwnProperty('endTime')) {
    console.log('clock element is missing data-end-time attribute or value');
    continue;
  }

  const clockEndTime       = parseInt(clocks[index].dataset.endTime, 10);
  const currentTimeSeconds = Math.floor(new Date().getTime() / 1000);
  const remainingSeconds   = clockEndTime - currentTimeSeconds;

  console.log(remainingSeconds); //2 days 23:39:33.

  const remainingTime      = new Date(remainingSeconds * 1000);
  const flipAttribute      = clocks[index].dataset.hasOwnProperty('isFlipClock') ? true : false;

  // TODO do clock complete check here...
  if (remainingSeconds < 0) {
    endClock(index);
    continue;
  }

  // Setup clock data
  countDownClocks[index] = {
    endTimeSeconds:          clockEndTime,
    remainingSeconds:        remainingSeconds,
    isFlip:                  flipAttribute,
    currentDays:             Math.floor(remainingSeconds / (24 * 60 *  60)),
    currentHours:            remainingTime.getHours(),
    currentMinutes:          remainingTime.getMinutes(),
    currentSeconds:          remainingTime.getSeconds(),
    currentDaysFormatted:    this.currentDays,
    currentHoursFormatted:   formatTime(this.currentHours),
    currentMinutesFormatted: formatTime(this.currentMinutes),
    currentSecondsFormatted: formatTime(this.currentSeconds),
    setInterval:             setInterval(checkTime, 100, index)
  };

  buildClockHTML(index);
}

console.log(countDownClocks);

/**
 * Check remaining time and if any remains, run calculations on clock
 *
 * @param {int} clockIndex (index of clock on page)
 */
function checkTime(clockIndex) {
  const remainingTime = getRemainingTime(clockIndex);

  // if (remainingTime < new Date()) {
  //   console.log('end the time for whatever reason');
  //   endClock(clockIndex);
  //   return;
  // }

  sections.forEach(sectionName => {
    let sectionTimeValue;
    // const hasSectionTimeLeft;

    switch (sectionName) {
      case 'Days':
        const currentTimeSeconds = Math.floor(new Date().getTime() / 1000);
        const remainingSeconds   = countDownClocks[clockIndex].endTimeSeconds - currentTimeSeconds;
        sectionTimeValue = Math.floor(remainingSeconds / (24 * 60 * 60));
        // hasSectionTimeLeft   = remainingSectionTime > 0 ? true : false;
        break;
      case 'Hours':
        sectionTimeValue = remainingTime.getHours();
        // hasSectionTimeLeft   = Math.floor(remainingTime / 360) > 0 ? true : false;
        break;
      case 'Minutes':
        sectionTimeValue = remainingTime.getMinutes();
        // hasSectionTimeLeft   = Math.floor(remainingSectionTime / 60) > 0 ? true : false;
        break;
      case 'Seconds':
        sectionTimeValue = remainingTime.getSeconds();
        // hasSectionTimeLeft   = remainingTime > 0 ? true : false;
        break;
      default:
        break;
    }

    processTimeSection(clockIndex, sectionName, sectionTimeValue);
  });
}

/**
 * Computes a digits next value, handles some dom behaviors
 *
 * @param {int} clockIndex (index of clock on page)
 * @param {string} sectionName (clock section name such as 'Minutes')
 * @param {int} sectionTimeValue (section time value)
 */
function processTimeSection(clockIndex, sectionName, sectionTimeValue) {
  const sectionNameLower     = sectionName.toLowerCase();
  const countDownClock       = countDownClocks[clockIndex];
  const domClock             = clocks[clockIndex];
  const domClockSection      = domClock.getElementsByClassName('clock__' + sectionNameLower);
  const domClockSectionDigit = domClockSection[0].getElementsByClassName('clock__digit-value');
  const sectionIndex         = sections.indexOf(sectionName);

  if (countDownClock['current' + sectionName] !== sectionTimeValue) {
    const newValue = formatTime(sectionTimeValue);
    const oldValue = countDownClock['current' + sectionName + 'Formatted'];

    // Update DOM
    flipThisDigit(clockIndex, sectionIndex, oldValue, newValue);
    domClockSectionDigit[0].innerHTML = sectionTimeValue;

    // Store new data
    countDownClock['current' + sectionName] = sectionTimeValue;
    countDownClock['current' + sectionName + 'Formatted'] = newValue;
  }

  // if (!hasDaysLeft) {
  //   daysDigit[0].innerHTML = '0';
  //   clockDays[0].classList.add('clock__days--complete');
  //   countDownClocks[clockIndex].hoursComplete = true;
  // }
}

/**
 * Gets a clock's remaining time
 *
 * @param {int} clockIndex (index of clock on page)
 */
function getRemainingTime(clockIndex) {
  const currentTimeSeconds = Math.floor(new Date().getTime() / 1000);
  const remainingSeconds   = countDownClocks[clockIndex].endTimeSeconds - currentTimeSeconds;

  return new Date(remainingSeconds * 1000);
}

/**
 * Formats single digit values to double
 *
 * @param {int} value (original value)
 * @return {int|string} (modified value)
 */
function formatTime(value) {
  return value < 10 ? '0' + value : value;
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
 * Builds a clock's HTML and sets initial values to markup
 *
 * @param {int} clockIndex (index of clock on page)
 */
function buildClockHTML(clockIndex) {
  const clockElement = clocks[clockIndex];
  const isFlipClock  = clockElement.dataset.hasOwnProperty('isFlipClock') ? true : false;

  sections.forEach(sectionName => {
    const timePropertyValue = countDownClocks[clockIndex]['current' + sectionName];
    const flipBottomElement = isFlipClock ? `<div class="clock__digit-bottom"><div>${timePropertyValue}</div></div>` : '';
    const className         = sectionName.toLowerCase();
    const newElement        = document.createElement('div');
    const newElementContent = `
        <div class="clock__digit">
            <div class="clock__digit-value">${timePropertyValue}</div>
            ${flipBottomElement}
        </div>
        <div class="clock__digit-gap"></div>
        <div class="clock__label">${sectionName}</div>
    `;

    newElement.classList.add('clock', 'clock__' + className);
    newElement.innerHTML = newElementContent;
    clockElement.appendChild(newElement);
  });
}

/**
 * Handles behaviors for when clock ends
 *
 * @param {int} clockIndex (index of clock on page)
 */
function endClock(clockIndex) {
  // clearInterval(countDownClocks[clockIndex].setInterval);
  console.log('end of time for this clock -> ');
  console.log(clockIndex);
  clocks[clockIndex].innerHTML = "completed";
}
