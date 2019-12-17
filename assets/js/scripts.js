// TODO: document ready
// TODO make sure to handle all time in seconds (integer) whenever possible



// DOM clock elements
const clocks = document.getElementsByClassName('countdown-clock');

// Array of clocks and their properties
const countDownClocks = [];

// Setup each clock
for (let index = 0; index < clocks.length; index++) {
  // Get end-time data attribute value for this clock
  // TODO make sure the dataset exists before continuing...continue if not and console log error
  const currentTimeSeconds   = Math.floor(new Date().getTime() / 1000);
  const endTimeSeconds       = parseInt(clocks[index].dataset.endTime, 10);
  const remainingSeconds     = endTimeSeconds - currentTimeSeconds;
  const remainingTimeSeconds = new Date(remainingSeconds);
  const flipAttribute        = clocks[index].dataset.hasOwnProperty('isFlipClock') ? true : false;


  buildClockHTML(clocks[index]);

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
    currentDaysFormatted:    '0',
    currentHoursFormatted:   '00',
    currentMinutesFormatted: '00',
    currentSecondsFormatted: '00',
    setInterval:             setInterval(checkTime, 250, index)
  };
}

console.log(countDownClocks);

/**
 * TODO
 *
 * @param {Object} element (dom element)
 */
function buildClockHTML(element) {
  const sections = [
    'Days',
    'Hours',
    'Minutes',
    'Seconds'
  ];

  sections.forEach(sectionName => {
    const className         = sectionName.toLowerCase();
    const newElement        = document.createElement('div');
    const newElementContent = `
        <div class="clock__digit">
            <span class="clock__digit-value">00</span>
        </div>
        <div class="clock__label">${sectionName}</div>
    `;

    newElement.classList.add('clock', 'clock__' + className);
    newElement.innerHTML = newElementContent;
    element.appendChild(newElement);
  });
}

/**
 * TODO
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



function formatDays(clockIndex, remainingTimeSeconds) {
  const days        = Math.floor(remainingTimeSeconds / (86400 * 1000));
  const hasDaysLeft = days > 0 ? true : false;
  const clockDays   = clocks[clockIndex].getElementsByClassName('clock__days');
  const daysDigit   = clockDays[0].getElementsByClassName('clock__digit-value');

  if (hasDaysLeft && countDownClocks[clockIndex].currentDays !== days) {
    const newValue = days;

    // Update DOM
    doFlipBehaviors(clockIndex, 0, newValue);
    daysDigit[0].innerHTML = days;

    // Store new data
    countDownClocks[clockIndex].currentDays = days;
    countDownClocks[clockIndex].currentDaysFormatted = newValue;
  }

  if (!hasDaysLeft) {
    daysDigit[0].innerHTML = '0';
  }
}

function formatHours(clockIndex, remainingTimeSeconds) {
  const hours        = remainingTimeSeconds.getHours();
  const hasHoursLeft = remainingTimeSeconds / 360 > 0 ? true : false;
  const clockHours   = clocks[clockIndex].getElementsByClassName('clock__hours');
  const hoursDigit   = clockHours[0].getElementsByClassName('clock__digit-value');

  if (hasHoursLeft && countDownClocks[clockIndex].currentHours !== hours) {
    const newValue = hours < 10 ? '0' + hours : hours;

    // Update DOM
    doFlipBehaviors(clockIndex, 1, newValue);
    hoursDigit[0].innerHTML = newValue;

    // Store new data
    countDownClocks[clockIndex].currentHours = hours;
    countDownClocks[clockIndex].currentHoursFormatted = newValue;
  }

  if (!hasHoursLeft) {
    hoursDigit[0].innerHTML = '00';
  }
}

function formatMinutes(clockIndex, remainingTimeSeconds) {
  const minutes        = remainingTimeSeconds.getMinutes();
  const hasMinutesLeft = remainingTimeSeconds / 60 > 0 ? true : false;
  const clockMinutes   = clocks[clockIndex].getElementsByClassName('clock__minutes');
  const minutesDigit   = clockMinutes[0].getElementsByClassName('clock__digit-value');

  if (hasMinutesLeft && countDownClocks[clockIndex].currentMinutes !== minutes) {
    const newValue = minutes < 10 ? '0' + minutes : minutes;

    // Update DOM
    doFlipBehaviors(clockIndex, 2, newValue);
    minutesDigit[0].innerHTML = newValue

    // Store new data
    countDownClocks[clockIndex].currentMinutes = minutes;
    countDownClocks[clockIndex].currentMinutesFormatted = newValue;
  }

  if (!hasMinutesLeft) {
    minutesDigit[0].innerHTML = '00';
  }
}

function formatSeconds(clockIndex, remainingTimeSeconds) {
  const seconds        = remainingTimeSeconds.getSeconds();
  const hasSecondsLeft = remainingTimeSeconds > 0 ? true : false;
  const clockSeconds   = clocks[clockIndex].getElementsByClassName('clock__seconds');
  const secondsDigit   = clockSeconds[0].getElementsByClassName('clock__digit-value');

  if (hasSecondsLeft && countDownClocks[clockIndex].currentSeconds !== seconds) {
    const newValue = seconds < 10 ? '0' + seconds : seconds;

    // Update DOM
    doFlipBehaviors(clockIndex, 3, newValue);
    secondsDigit[0].innerHTML = newValue;

    // Store new data
    countDownClocks[clockIndex].currentSeconds = seconds;
    countDownClocks[clockIndex].currentSecondsFormatted = newValue;
  }

  if (!hasSecondsLeft) {
    secondsDigit[0].innerHTML = '00';
  }
}

function endClock(clockIndex) {
  clearInterval(countDownClocks[clockIndex].setInterval);
  console.log('end of time for this clock -> ');
  console.log(clockIndex);
}

function doFlipBehaviors(clockIndex, digitIndex, newValue) {

  if (countDownClocks[clockIndex].isFlip !== true) {
    return;
  }

  const domClockDigit = clocks[clockIndex].getElementsByClassName('clock__digit');

  // Remove the old flip element and values
  const oldFlipElement = domClockDigit[digitIndex].getElementsByClassName('clock__digit-flip');

  if (oldFlipElement[0]) {
    oldFlipElement[0].parentNode.removeChild(oldFlipElement[0]);
  }

  // Add the new flip element and values
  const newFlipElement = document.createElement('span');
  newFlipElement.classList.add('clock__digit-flip');
  newFlipElement.innerHTML = `
    <span class="clock__digit-flip-front">${newValue}</span>
    <span class="clock__digit-flip-back">${newValue}</span>
  `;
  domClockDigit[digitIndex].appendChild(newFlipElement);
}
