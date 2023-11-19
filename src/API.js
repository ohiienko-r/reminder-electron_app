const { ipcRenderer } = require("electron");
import { SHIFT } from "./helpers";

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

//TODO: write a function which will define which notification title and body should be displayed according to time

/**
 * Function purpose is to check if it's 08:00 or 17:00 || 17:00 or 00:00 and firese the respective reminder
 *
 * @param {String} notification - object with all notifications text
 * @param {String} shift - day or night shift
 */
export const remind = (notification, shift) => {
  const now = new Date();
  let isReminderTime;
  let reminderTitle;
  let reminderBody;

  if (shift === SHIFT.DAY) {
    isReminderTime = now.getHours() === 8 || now.getHours() === 17; //true of false

    if (now.getHours() === 8) {
      reminderTitle = notification.CHECK_IN_REMINDER_TITLE;
      reminderBody = notification.CHECK_IN_REMINDER_BODY;
    } else if (now.getHours() === 17) {
      reminderTitle = notification.CHECK_OUT_REMINDER_TITLE;
      reminderBody = notification.CHECK_OUT_REMINDER_BODY;
    }
  } else {
    isReminderTime = now.getHours() === 17 || now.getHours() === 0; //true or false

    if (now.getHours() === 17) {
      reminderTitle = notification.CHECK_IN_REMINDER_TITLE;
      reminderBody = notification.CHECK_IN_REMINDER_BODY;
    } else if (now.getHours() === 0) {
      reminderTitle = notification.CHECK_OUT_REMINDER_TITLE;
      reminderBody = notification.CHECK_OUT_REMINDER_BODY;
    }
  }

  if (isReminderTime) {
    newNotification(reminderTitle, reminderBody);
  }
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
    switch (now.getHours()) {
      case now.getHours() >= 17:
        nextReminderTime.setDate(now.getDate() + 1);
        nextReminderTime.setHours(8, 0, 0, 0);
        console.log("Reminder will be fired next day at 08:00");
        break;
      case now.getHours() >= 8:
        nextReminderTime.setHours(17, 0, 0, 0);
        console.log("Reminder will be fired at 17:00 tonight");
        break;
      default:
        nextReminderTime.setHours(8, 0, 0, 0);
        console.log("Reminder will be fired ar 08:00 by default");
        break;
    }
  } else {
    switch (now.getHours()) {
      case now.getHours() >= 0:
        nextReminderTime.setDate(now.getDate());
        nextReminderTime.setHours(17, 0, 0, 0);
        console.log("Reminder will be fired at 17:00. Date already changed");
        break;
      case now.getHours() >= 17:
        nextReminderTime.setHours(0, 0, 0, 0);
        console.log("Reminder will be fired at 00:00 tonight");
        break;
      default:
        nextReminderTime.setHours(17, 0, 0, 0);
        console.log("Reminder will be fired at 17:00 by default");
        break;
    }
  }

  return nextReminderTime - now;
};
