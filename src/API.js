const { ipcRenderer } = require("electron");
import { SHIFT, NOTIFICATION } from "./helpers";

let rIntervals = [];
let rTimeouts = [];

/**
 *
 * @param {String} title - message title to display in a system message
 * @param {String} body - message body to display in a system message
 */
export const newNotification = (title, body) => {
  new Notification(title, {
    body: body,
    requireInteraction: true,
  });
};

/**
 * Function purpose is to define which kind of notification text will be displayed according to time and shift
 *
 * @param {String} shift - day or night shift pointer
 * @returns object - contains notification title and body
 */
const setNotificationText = (shift) => {
  const now = new Date();
  let notificationObj;

  if (shift === SHIFT.DAY) {
    if (now.getHours() === 8) {
      notificationObj = {
        title: NOTIFICATION.CHECK_IN_REMINDER_TITLE,
        body: NOTIFICATION.CHECK_IN_REMINDER_BODY,
      };
    } else if (now.getHours() === 17) {
      notificationObj = {
        title: NOTIFICATION.CHECK_OUT_REMINDER_TITLE,
        body: NOTIFICATION.CHECK_OUT_REMINDER_BODY,
      };
    }
  } else if (shift === SHIFT.NIGHT) {
    if (now.getHours() === 17) {
      notificationObj = {
        title: NOTIFICATION.CHECK_IN_REMINDER_TITLE,
        body: NOTIFICATION.CHECK_IN_REMINDER_BODY,
      };
    } else if (now.getHours() === 0) {
      notificationObj = {
        title: NOTIFICATION.CHECK_OUT_REMINDER_TITLE,
        body: NOTIFICATION.CHECK_OUT_REMINDER_BODY,
      };
    }
  }

  return notificationObj;
};

/**
 * Function purpose is to check if it's 08:00 or 17:00 || 17:00 or 00:00 and fires the respective reminder
 *
 * @param {String} notification - object with all notifications text
 * @param {String} shift - day or night shift
 */
const remind = (shift) => {
  const reminder = setNotificationText(shift);

  newNotification(reminder.title, reminder.body);
};

/**
 * Function purpose is to figure out a time till reminder should be fired for setTimeout function according to shift.
 *
 * @returns time till next reminder in milliseconds
 */
const getTimeUntilNextReminder = (shift) => {
  const now = new Date();
  const nextReminderTime = new Date(now);

  if (shift === SHIFT.DAY) {
    if (now.getHours() >= 17) {
      nextReminderTime.setDate(now.getDate() + 1);
      nextReminderTime.setHours(8, 0, 0, 0);
      console.log("Reminder will be fired next day at 08:00");
    } else if (now.getHours() >= 8 && now.getHours() < 17) {
      nextReminderTime.setHours(17, 0, 0, 0);
      console.log("Reminder will be fired at 17:00 tonight");
    } else {
      nextReminderTime.setHours(8, 0, 0, 0);
      console.log("Reminder will be fired at 08:00 by default");
    }
  }

  if (shift === SHIFT.NIGHT) {
    if (now.getHours() >= 0 && now.getHours() < 17) {
      nextReminderTime.setDate(now.getDate());
      nextReminderTime.setHours(17, 0, 0, 0);
      console.log("Reminder will be fired at 17:00. Date already changed");
    } else if (now.getHours() >= 17) {
      nextReminderTime.setDate(now.getDate() + 1);
      nextReminderTime.setHours(0, 0, 0, 0);
      console.log("Reminder will be fired at 00:00 tonight");
    } else {
      nextReminderTime.setHours(17, 0, 0, 0);
      console.log("Reminder will be fired at 17:00 by default");
    }
  }

  return nextReminderTime - now;
};

/**
 * Function purpose is to set timeout before next reminder should be fired and at the moment of notification to set interval on 24H
 *
 * @param {String} shift - day or night shift pointer
 */
export const setReminderInterval = (shift) => {
  let fTimeoutId = setTimeout(() => {
    remind(shift);

    let nIntervId = setInterval(remind, 24 * 60 * 60 * 1000);
    rIntervals.push(nIntervId);

    let sTimeoutId = setTimeout(() => {
      remind(shift);

      let nIntervId = setInterval(remind, 24 * 60 * 60 * 1000);
      rIntervals.push(nIntervId);
    }, getTimeUntilNextReminder(shift));
    rTimeouts.push(sTimeoutId);
    console.log("Current timeouts: " + rTimeouts);
  }, getTimeUntilNextReminder(shift));
  rTimeouts.push(fTimeoutId);
  console.log("Current timeouts: " + rTimeouts);
};

/**
 * Simply clears all presetn intervals to stop reminding
 */
export const removeIntervals = () => {
  rIntervals.forEach((intervId) => {
    clearInterval(intervId);
  });
  console.log("All intervals are cleared");

  console.log(rTimeouts);
};

export const removeTimeouts = () => {
  rTimeouts.forEach((timeoutId) => {
    clearTimeout(timeoutId);
  });
  console.log("All timeouts are cleared");
};

/**
 * Funcrion purpose is to handle on app load actioncs according to shift type chosen by user (saved in the local storage)
 *
 * @param {HTMLButtonElement} startDayReminderBtn - start day shift reminder button
 * @param {HTMLButtonElement} startNightReminderBtn - start night shift reminder button
 * @param {HTMLButtonElement} stopRemindingBtn - srop all reminders button
 */
export const shiftOnAppLoadActions = (
  startDayReminderBtn,
  startNightReminderBtn,
  stopRemindingBtn
) => {
  const currentShift = JSON.parse(localStorage.getItem("shift"));

  if (currentShift) {
    console.log(`${currentShift} shift is present`);

    switch (currentShift) {
      case SHIFT.DAY:
        startDayReminderBtn.disabled = true;
        setReminderInterval(SHIFT.DAY);
        break;
      case SHIFT.NIGHT:
        setReminderInterval(SHIFT.NIGHT);
        startNightReminderBtn.disabled = true;
        break;
    }
    console.log("Current timeouts: " + rTimeouts);
  } else {
    stopRemindingBtn.disabled = true;
    console.log("No shift presented");
  }

  newNotification(NOTIFICATION.DEFAULT_TITLE, NOTIFICATION.DEFAULT_BODY);
};
