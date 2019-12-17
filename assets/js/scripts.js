// TODO: document ready
// TODO make sure to handle all time in seconds (integer) whenever possible

const clocks       = document.getElementsByClassName('countdown-clock');
let timeTracker    = [];
let clockIntervals = [];

// Setup each clock
for (let index = 0; index < clocks.length; index++) {
  // Get end-time data attribute value for this clock
  // TODO make sure the dataset exists before continuing...continue if not and console log error
  const currentTimeSeconds   = Math.floor(new Date().getTime() / 1000);
  const endTimeSeconds       = parseInt(clocks[index].dataset.endTime, 10);
  const remainingSeconds     = endTimeSeconds - currentTimeSeconds;
  const remainingTimeSeconds = new Date(remainingSeconds);

  // if (remainingSeconds < 0) {
  //     console.log('clock endtime older than present or error.');
  //     continue;
  // }

  // Setup clock data
  timeTracker[index]                  = {};
  timeTracker[index].endTimeSeconds   = endTimeSeconds;
  timeTracker[index].remainingSeconds = remainingSeconds;
  timeTracker[index].currentDays      = Math.floor(remainingSeconds / (86400 * 1000));
  timeTracker[index].currentHours     = remainingTimeSeconds.getHours();
  timeTracker[index].currentMinutes   = remainingTimeSeconds.getMinutes();
  timeTracker[index].currentSeconds   = remainingTimeSeconds.getSeconds();

  // console.log(timeTracker[index]);

  buildClockHTML(clocks[index]);

  clockIntervals[index] = setInterval(checkTime, 250, index);
}

/**
 * 
 * 
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
 * 
 * 
 * 
 */
function checkTime(clockIndex) {
  const currentTimeSeconds = Math.floor(new Date().getTime() / 1000);
  const endTimeSeconds     = parseInt(clocks[clockIndex].dataset.endTime, 10);
  const remainingSeconds   = endTimeSeconds - currentTimeSeconds;

  if (remainingSeconds < 0) {
    console.log('end the time for whatever reason');
    endClock(clockIndex);
  }

  updateClockTimes(clockIndex, remainingSeconds);
}

/**
 * 
 * 
 * 
 */
function updateClockTimes(clockIndex, remainingSeconds) {
  const remainingTimeSeconds = new Date(remainingSeconds * 1000);
  const remainingDays        = Math.floor(remainingTimeSeconds / (86400 * 1000));
  const remainingHours       = remainingTimeSeconds.getHours();
  const remainingMinutes     = remainingTimeSeconds.getMinutes();
  const reminaingSeconds     = remainingTimeSeconds.getSeconds();

  // TODO how to stop each section at 00?
  // TODO check the validity of these calculations - should they be / 1000?
  const hasDaysLeft    = remainingDays > 0 ? true : false;
  const hasHoursLeft   = remainingTimeSeconds / 360 > 0 ? true : false;
  const hasMinutesLeft = remainingTimeSeconds / 60 > 0 ? true : false;
  const hasSecondsLeft = remainingTimeSeconds > 0 ? true : false;

  console.log(clockIndex);
  console.log(hasDaysLeft);
  console.log(hasHoursLeft);
  console.log(hasMinutesLeft);
  console.log(hasSecondsLeft);

  const clockDays = clocks[clockIndex].getElementsByClassName('clock__days'); // 0-???
  const daysDigit = clockDays[0].getElementsByClassName('clock__digit-value');
  const clockHours = clocks[clockIndex].getElementsByClassName('clock__hours'); // 0-23
  const hoursDigit = clockHours[0].getElementsByClassName('clock__digit-value');
  const clockMinutes = clocks[clockIndex].getElementsByClassName('clock__minutes'); // 0-59
  const minutesDigit = clockMinutes[0].getElementsByClassName('clock__digit-value');
  const clockSeconds = clocks[clockIndex].getElementsByClassName('clock__seconds'); // 00-59
  const secondsDigit = clockSeconds[0].getElementsByClassName('clock__digit-value');

  if (hasDaysLeft && clocks[clockIndex].currentDays !== remainingDays) {
    daysDigit[0].innerHTML = formatDays(remainingTimeSeconds);
    clocks[clockIndex].currentDays = remainingDays;
  }

  if (hasHoursLeft && clocks[clockIndex].currentHours !== remainingHours) {
    hoursDigit[0].innerHTML = formatHours(remainingTimeSeconds);
    clocks[clockIndex].currentHours = remainingHours;
  }

  if (hasMinutesLeft && clocks[clockIndex].currentMinutes !== remainingMinutes) {
    minutesDigit[0].innerHTML = formatMinutes(remainingTimeSeconds);
    clocks[clockIndex].currentMinutes = remainingMinutes;
  }

  if (hasSecondsLeft && clocks[clockIndex].currentSeconds !== remainingSeconds) {
    secondsDigit[0].innerHTML = formatSeconds(remainingTimeSeconds);
    clocks[clockIndex].currentSeconds = remainingSeconds;
  }

  if (!hasDaysLeft) {
    daysDigit[0].innerHTML = '-_-';
  }

  if (!hasHoursLeft) {
    hoursDigit[0].innerHTML = '-_-';
  }

  if (!hasMinutesLeft) {
    minutesDigit[0].innerHTML = '-_-';
  }

  if (!hasSecondsLeft) {
    secondsDigit[0].innerHTML = '-_-';
  }
}

function formatDays(time) {
  return Math.floor(time / (86400 * 1000));
}

function formatHours(time) {
  const hours = time.getHours();
  return hours < 10 ? '0' + hours : hours;
}

function formatMinutes(time) {
  const minutes = time.getMinutes();
  return minutes < 10 ? '0' + minutes : minutes;
}

function formatSeconds(time) {
  const seconds = time.getSeconds();
  return seconds < 10 ? '0' + seconds : seconds;
}

function endClock(clockIndex) {
  clearInterval(clockIntervals[clockIndex]);
  console.log('end of time for this clock -> ');
  console.log(clockIndex);
}
