const { ipcRenderer } = require("electron");

export const newNotification = (title, body) => {
  new Notification(title, { body: body }).onclick = () => {
    const urlToOpen = "https://time-flu.com/";
    ipcRenderer.send("open-external-url", urlToOpen);
  };
};

/**
 * Function purpose is to check if it's 08:00 or 17:00 and firese the respective reminder
 *
 * @param {String} reminderTitle - title of system message
 * @param {String} reminderBody - body of system message
 */
export const remind = (reminderTitle, reminderBody) => {
  const now = new Date();

  const isReminderTime = now.getHours() === 8 || now.getHours() === 17;

  if (isReminderTime) {
    //TODO: add separation on checkin/checkout depending on current time
    newNotification(reminderTitle, reminderBody);
  }
};

/**
 * Function purpose is to figure out a time till 08:00 or 17:00 reminder
 *
 * @returns time till next reminder in milliseconds
 */
export const getTimeUntilNextReminder = () => {
  const now = new Date();
  const nextReminderTime = new Date(now);

  // If it's later than 17:00, then next reminder will be fired at 08:00 next day
  if (now.getHours() >= 17) {
    nextReminderTime.setDate(now.getDate() + 1);
    nextReminderTime.setHours(8, 0, 0, 0);
  } else if (now.getHours() >= 8) {
    // If it's later than 08:00, then next reminder will be fired today at 17:00
    nextReminderTime.setHours(17, 0, 0, 0);
  } else {
    // else next reminder will be fired today at 08:00
    nextReminderTime.setHours(8, 0, 0, 0);
  }

  return nextReminderTime - now;
};

// setTimeout(() => {
//   remind();
//   setInterval(remind, 24 * 60 * 60 * 1000);
// }, getTimeUntilNextReminder());
