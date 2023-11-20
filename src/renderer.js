import {
  newNotification,
  shiftOnAppLoadActions,
  setReminderInterval,
} from "./API.js";
import { NOTIFICATION, SHIFT } from "./helpers.js";

import "./css/reset.css";
import "./css/index.css";

const startDayShiftReminder = document.getElementById("day-btn");
const startNightShiftReminder = document.getElementById("night-btn");
const stopAllReminders = document.getElementById("stop-btn");

window.onload = () => {
  shiftOnAppLoadActions(
    startDayShiftReminder,
    startNightShiftReminder,
    stopAllReminders
  );
};

startDayShiftReminder.onclick = () => {
  newNotification(
    NOTIFICATION.DAY_SHIFT_START_REMINDER_TITLE,
    NOTIFICATION.DAY_SHIFT_START_REMINDER_BODY
  );

  startDayShiftReminder.disabled = true;

  localStorage.setItem("shift", JSON.stringify(SHIFT.DAY));

  setReminderInterval(SHIFT.DAY);

  stopAllReminders.disabled = false;
};

startNightShiftReminder.onclick = () => {
  newNotification(
    NOTIFICATION.NIGHT_SHIFT_START_REMINDER_TITLE,
    NOTIFICATION.NIGHT_SHIFT_START_REMINDER_BODY
  );
  startNightShiftReminder.disabled = true;

  localStorage.setItem("shift", JSON.stringify(SHIFT.NIGHT));

  setReminderInterval(SHIFT.NIGHT);

  stopAllReminders.disabled = false;
};

stopAllReminders.onclick = () => {
  newNotification(
    NOTIFICATION.STOP_REMINDING_TITLE,
    NOTIFICATION.STOP_REMINDING_BODY
  );

  startDayShiftReminder.disabled = false;
  startNightShiftReminder.disabled = false;
  stopAllReminders.disabled = true;

  localStorage.clear();
};
