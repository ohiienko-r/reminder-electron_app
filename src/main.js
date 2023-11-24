const {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  Tray,
  nativeImage,
} = require("electron");
const path = require("path");
import TrayIconURL from "../assets/Logo.png?url";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
  app.exit();
}

let win;
let tray;

const createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    icon: nativeImage.createFromPath("assets/Logo.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const menu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(menu);

  win.webContents.on("did-finish-load", () => {
    win.show();
    win.focus();
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  const icon = nativeImage.createFromDataURL(TrayIconURL);
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    new MenuItem({
      label: "Закрити додаток",
      click: () => {
        app.quit();
        app.exit();
      },
    }),
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("Bunny reminder");

  tray.on("click", () => {
    if (win.isVisible()) {
      win.minimize();
    } else {
      win.restore();
    }
  });

  const loginItemSettings = app.getLoginItemSettings();

  if (!loginItemSettings.openAtLogin) {
    app.setLoginItemSettings({
      openAtLogin: true,
      enabled: true,
    });
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    app.exit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
