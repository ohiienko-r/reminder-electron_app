const { ipcRenderer } = require("electron");
import { SHIFT, NOTIFICATION } from "./helpers";

/**
 *
 * @param {String} title - message title to display in a system message
 * @param {String} body - message body to display in a system message
 */
export const newNotification = (title, body) => {
  new Notification(title, { body: body }).onclick = () => {
    const urlToOpen = "https://time-flu.com/";
    ipcRenderer.send("open-external-url", urlToOpen);
  };
};

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
 * Function purpose is to check if it's 08:00 or 17:00 || 17:00 or 00:00 and firese the respective reminder
 *
 * @param {String} notification - object with all notifications text
 * @param {String} shift - day or night shift
 */
export const remind = (shift) => {
  const reminder = setNotificationText(shift);

  newNotification(reminder.title, reminder.body);
  localStorage.setItem(remindAt, "");
};

/**
 * Function purpose is to figure out a time till reminder should be fired.
 *
 * @returns time till next reminder in milliseconds
 */
export const getTimeUntilNextReminder = (shift) => {
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
  } else if (shift === SHIFT.NIGHT) {
    if (now.getHours() >= 0 && now.getHours() < 17) {
      nextReminderTime.setDate(now.getDate());
      nextReminderTime.setHours(17, 0, 0, 0);
      console.log("Reminder will be fired at 17:00. Date already changed");
    } else if (now.getHours() >= 17 && now.getHours() < 0) {
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
 * Funcrion purpose is to handle on app load actioncs according to shift type chosen by user (saved in the local storage)
 *
 * @param {HTMLButtonElement} startMorningReminderBtn - start day shift reminder button
 * @param {HTMLButtonElement} startNightReminderBtn - start night shift reminder button
 * @param {HTMLButtonElement} stopRemindingBtn - srop all reminders button
 */
export const shiftOnAppLoadActions = (
  startMorningReminderBtn,
  startNightReminderBtn,
  stopRemindingBtn
) => {
  const currentShift = JSON.parse(localStorage.getItem("shift"));

  if (currentShift) {
    console.log(`${currentShift} shift is present`);
    switch (currentShift) {
      case SHIFT.DAY:
        startMorningReminderBtn.disabled = true;
        break;
      case SHIFT.NIGHT:
        startNightReminderBtn.disabled = true;
        break;
    }
  } else {
    newNotification(NOTIFICATION.DEFAULT_TITLE, NOTIFICATION.DEFAULT_BODY);
    stopRemindingBtn.disabled = true;
    console.log("No shift presented");
  }
};
