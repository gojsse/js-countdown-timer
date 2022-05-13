# js-countdown-timer
A demo of a js-based countdown timer that runs in the browser.

### Installing
- `yarn install`
- `yarn run build`
- Open index.html file in a browser manually

### Usage
```<div class="style--1 countdown-clock countdown-clock--label-bottom" data-end-time="1904837702"></div>```
Where `data-end-time` value should be a unix timestamp in the future. If value is in the past then clock will show all zeros.

### Useful time-related things
- https://www.epochconverter.com/
- https://www.tools4noobs.com/online_tools/seconds_to_hh_mm_ss/
- https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript

### Improvements to be made
- Convert to TypeScript
- Change clock class to work with single timer rather than a page of timers
- Fix flip animation bottom panel (is upside down version of last value)
- Various styling changes, examples to be made

![Screen Shot 2022-05-13 at 3 50 14 PM](https://user-images.githubusercontent.com/550747/168387976-98cf8286-70d0-4a59-8f46-48a6f96a3465.png)
