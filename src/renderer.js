import { newNotification, remind, getTimeUntilNextReminder } from "./API.js";
import { NOTIFICATION, SHIFT } from "./helpers.js";

import "./css/reset.css";
import "./css/index.css";

const startDayShiftReminder = document.getElementById("day-btn");
const startNightShiftReminder = document.getElementById("night-btn");
const stopAllReminders = document.getElementById("stop-btn");
let rIntervals = [];

window.onload = () => {
  newNotification(NOTIFICATION.DEFAULT_TITLE, NOTIFICATION.DEFAULT_BODY);

  const currentShift = JSON.parse(localStorage.getItem("shift"));

  if (currentShift) {
    console.log("Shift is present");
    switch (currentShift) {
      case SHIFT.DAY:
        startDayShiftReminder.disabled = true;
        break;
      case SHIFT.NIGHT:
        startNightShiftReminder.disabled = true;
        break;
    }
  } else console.log("No shift presented");
};

startDayShiftReminder.onclick = () => {
  newNotification(
    NOTIFICATION.DAY_SHIFT_START_REMINDER_TITLE,
    NOTIFICATION.DAY_SHIFT_START_REMINDER_BODY
  );

  startDayShiftReminder.disabled = true;

  localStorage.setItem("shift", JSON.stringify(SHIFT.DAY));

  setTimeout(() => {
    remind(NOTIFICATION, SHIFT.DAY);

    let nIntervId = setInterval(remind, 24 * 60 * 60 * 1000);
    rIntervals.push(nIntervId);
  }, getTimeUntilNextReminder(SHIFT.DAY));
};

startNightShiftReminder.onclick = () => {
  newNotification(
    NOTIFICATION.NIGHT_SHIFT_START_REMINDER_TITLE,
    NOTIFICATION.NIGHT_SHIFT_START_REMINDER_BODY
  );
  startNightShiftReminder.disabled = true;
};

stopAllReminders.onclick = () => {
  newNotification(
    NOTIFICATION.STOP_REMINDING_TITLE,
    NOTIFICATION.STOP_REMINDING_BODY
  );
  startDayShiftReminder.disabled = false;
  startNightShiftReminder.disabled = false;

  localStorage.clear();

  rIntervals.forEach((intervId) => {
    clearInterval(intervId);
  });
};
