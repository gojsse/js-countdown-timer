// TODO: document ready
// TODO make sure to handle all time in seconds (integer) whenever possible



// DOM clock elements
const clocks = document.getElementsByClassName('countdown-clock');

// Array of clocks and their properties
const countDownClocks = [];

// Setup each clock
for (let index = 0; index < clocks.length; index++) {
  // Get end-time data attribute value for this clock
  // TODO make sure the endtime dataset exists before continuing...continue if not and console log error
  const currentTimeSeconds   = Math.floor(new Date().getTime() / 1000);
  const endTimeSeconds       = parseInt(clocks[index].dataset.endTime, 10);
  const remainingSeconds     = endTimeSeconds - currentTimeSeconds;
  const remainingTimeSeconds = new Date(remainingSeconds);
  const flipAttribute        = clocks[index].dataset.hasOwnProperty('isFlipClock') ? true : false;

  // if (remainingSeconds < 0) {
  //     console.log('clock endtime older than present or error.');
  //     continue;
  // }

  // Setup clock data
  countDownClocks[index] = {
    endTimeSeconds:          endTimeSeconds,
    remainingSeconds:        remainingSeconds,
    isFlip:                  flipAttribute,
    currentDays:             Math.floor(remainingSeconds / (86400 * 1000)),
    currentHours:            remainingTimeSeconds.getHours(),
    currentMinutes:          remainingTimeSeconds.getMinutes(),
    currentSeconds:          remainingTimeSeconds.getSeconds(),
    currentDaysFormatted:    this.currentDays,
    currentHoursFormatted:   '22',
    currentMinutesFormatted: '00',
    currentSecondsFormatted: '00',
    setInterval:             setInterval(checkTime, 100, index)
  };

  buildClockHTML(index);
}

/**
 * Check remaining time and if any remains, run calculations on clock
 *
 * @param {int} clockIndex (index of clock on page)
 */
function checkTime(clockIndex) {
  const currentTimeSeconds = Math.floor(new Date().getTime() / 1000);
  const endTimeSeconds     = parseInt(clocks[clockIndex].dataset.endTime, 10);
  const remainingSeconds   = endTimeSeconds - currentTimeSeconds;

  if (remainingSeconds < 0) {
    console.log('end the time for whatever reason');
    endClock(clockIndex);
    return;
  }

  const remainingTimeSeconds = new Date(remainingSeconds * 1000);

  formatDays(clockIndex, remainingTimeSeconds);
  formatHours(clockIndex, remainingTimeSeconds);
  formatMinutes(clockIndex, remainingTimeSeconds);
  formatSeconds(clockIndex, remainingTimeSeconds);
}

/**
 * Handles behaviors of the clock days
 *
 * @param {int} clockIndex (index of clock on page)
 * @param {int} remainingTimeSeconds (remaining seconds)
 */
function formatDays(clockIndex, remainingTimeSeconds) {
  const days        = Math.floor(remainingTimeSeconds / (86400 * 1000));
  const hasDaysLeft = days > 0 ? true : false;
  const clockDays   = clocks[clockIndex].getElementsByClassName('clock__days');
  const daysDigit   = clockDays[0].getElementsByClassName('clock__digit-value');

  if (hasDaysLeft && countDownClocks[clockIndex].currentDays !== days) {
    const newValue = days;
    const oldValue = countDownClocks[clockIndex].currentDaysFormatted;

    // Update DOM
    doFlipBehaviors(clockIndex, 2, oldValue, newValue);
    daysDigit[0].innerHTML = days;

    // Store new data
    countDownClocks[clockIndex].currentDays = days;
    countDownClocks[clockIndex].currentDaysFormatted = newValue;
  }

  if (!hasDaysLeft) {
    daysDigit[0].innerHTML = '0';
    clockDays[0].classList.add('clock__days--complete');
    countDownClocks[clockIndex].hoursComplete = true;
  }
}

/**
 * Handles behaviors of the clock hours
 *
 * @param {int} clockIndex (index of clock on page)
 * @param {int} remainingTimeSeconds (remaining seconds)
 */
function formatHours(clockIndex, remainingTimeSeconds) {
  const hours        = remainingTimeSeconds.getHours();
  const hasHoursLeft = Math.floor(remainingTimeSeconds / 360) > 0 ? true : false;
  const clockHours   = clocks[clockIndex].getElementsByClassName('clock__hours');
  const hoursDigit   = clockHours[0].getElementsByClassName('clock__digit-value');

  if (hasHoursLeft && countDownClocks[clockIndex].currentHours !== hours) {
    const newValue = hours < 10 ? '0' + hours : hours;
    const oldValue = countDownClocks[clockIndex].currentHoursFormatted;

    // Update DOM
    doFlipBehaviors(clockIndex, 2, oldValue, newValue);
    hoursDigit[0].innerHTML = newValue;

    // Store new data
    countDownClocks[clockIndex].currentHours = hours;
    countDownClocks[clockIndex].currentHoursFormatted = newValue;
  }

  if (!hasHoursLeft) {
    console.log('no hours left');
    hoursDigit[0].innerHTML = '00';
    clockHours[0].classList.add('clock__hours--complete');
  }
}

/**
 * Handles behaviors of the clock minutes
 *
 * @param {int} clockIndex (index of clock on page)
 * @param {int} remainingTimeSeconds (remaining seconds)
 */
function formatMinutes(clockIndex, remainingTimeSeconds) {
  const minutes        = remainingTimeSeconds.getMinutes();
  // TODO calculation is not true possibly due to fractions. add - Math.floor() ?
  const hasMinutesLeft = remainingTimeSeconds / 60 > 0 ? true : false;
  const clockMinutes   = clocks[clockIndex].getElementsByClassName('clock__minutes');
  const minutesDigit   = clockMinutes[0].getElementsByClassName('clock__digit-value');

  if (hasMinutesLeft && countDownClocks[clockIndex].currentMinutes !== minutes) {
    const newValue = minutes < 10 ? '0' + minutes : minutes;
    const oldValue = countDownClocks[clockIndex].currentMinutesFormatted;

    // Update DOM
    doFlipBehaviors(clockIndex, 2, oldValue, newValue);
    minutesDigit[0].innerHTML = newValue;

    // Store new data
    countDownClocks[clockIndex].currentMinutes = minutes;
    countDownClocks[clockIndex].currentMinutesFormatted = newValue;
  }

  if (!hasMinutesLeft) {
    minutesDigit[0].innerHTML = '00';
    clockMinutes[0].classList.add('clock__minutes--complete');
  }
}

/**
 * Handles behaviors of the clock seconds
 *
 * @param {int} clockIndex (index of clock on page)
 * @param {int} remainingTimeSeconds (remaining seconds)
 */
function formatSeconds(clockIndex, remainingTimeSeconds) {
  const clock          = countDownClocks[clockIndex];
  const clockSeconds   = clocks[clockIndex].getElementsByClassName('clock__seconds');
  const secondsDigit   = clockSeconds[0].getElementsByClassName('clock__digit-value');
  const seconds        = remainingTimeSeconds.getSeconds();
  const hasSecondsLeft = remainingTimeSeconds > 0 ? true : false;

  if (hasSecondsLeft && clock.currentSeconds !== seconds) {
    const oldValue = clock.currentSecondsFormatted;
    const newValue = seconds < 10 ? '0' + seconds : seconds;

    // Update DOM
    doFlipBehaviors(clockIndex, 3, oldValue, newValue);
    secondsDigit[0].innerHTML = newValue;

    // Store new data
    clock.currentSeconds = seconds;
    clock.currentSecondsFormatted = newValue;
  }

  if (!hasSecondsLeft) {
    secondsDigit[0].innerHTML = '00';
    clockSeconds[0].classList.add('clock__seconds--complete');
  }
}

/**
 * Handles flip animation
 *
 * @param {int} clockIndex (index of clock on page)
 * @param {int} digitIndex (index of digit in clock among days/hours/minutes/seconds)
 * @param {int} oldValue (old time value)
 * @param {int} newValue (new time value)
 */
function doFlipBehaviors(clockIndex, digitIndex, oldValue, newValue) {

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
 * Builds a clock's HTML
 *
 * @param {int} index (dom element index)
 */
function buildClockHTML(index) {
  const clockElement = clocks[index];
  const isFlipClock  = clockElement.dataset.hasOwnProperty('isFlipClock') ? true : false;

  const sections = [
    'Days',
    'Hours',
    'Minutes',
    'Seconds'
  ];

  sections.forEach(sectionName => {
    const timePropertyValue = countDownClocks[index]['current' + sectionName];
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
  clearInterval(countDownClocks[clockIndex].setInterval);
  console.log('end of time for this clock -> ');
  console.log(clockIndex);
}
