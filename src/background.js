const { app, BrowserWindow, ipcMain } = require("electron");
import path from "path";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";

//Create Window and load index.html & preload.js
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const splash = new BrowserWindow({
    width: 400,
    height: 400,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });
  splash.setResizable(false)
  splash.loadURL(path.join(__static, "loading.html"));

  //const loadingScreen = createSplashWindow();
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in developments
    win.loadURL("app://./index.html");
  }
  win.once('ready-to-show', () => {
      splash.destroy();
      win.show();
  })
}

function createSplashWindow() {
  const splash = new BrowserWindow({
    width: 800,
    height: 600,
    //transparent: true,
    frame: false,
    alwaysOnTop: true,
  });
  splash.loadURL(path.join(__static, "loading.html"));
  return splash;
}

app.whenReady().then(async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }

  createWindow();
});

ipcMain.on("CREATE_OBJECT", (event, payload) => {
  console.log(payload);
  event.reply("object was sucessfully created");
});