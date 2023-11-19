import { newNotification } from "./API.js";
import { NOTIFICATION } from "./helpers.js";

import "./css/reset.css";
import "./css/index.css";

const startDayShiftReminder = document.getElementById("day-btn");
const startNightShiftReminder = document.getElementById("night-btn");
const stopAllReminders = document.getElementById("stop-btn");

window.onload = () => {
  newNotification(NOTIFICATION.DEFAULT_TITLE, NOTIFICATION.DEFAULT_BODY);
};

startDayShiftReminder.onclick = () => {
  newNotification(
    NOTIFICATION.DAY_SHIFT_START_REMINDER_TITLE,
    NOTIFICATION.DAY_SHIFT_START_REMINDER_BODY
  );
  startDayShiftReminder.disabled = true;
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
};
