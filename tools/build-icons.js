#!/usr/bin/env node
/**
 * One-off: renders icons/icon.svg to icons/icon-192.png, icon-512.png, icon-maskable-512.png
 * with headless Edge/Chrome (zero install on Windows: Edge ships with it). PNGs are committed;
 * rerun only if icon.svg changes, then run tools/build-sw.js.
 * Usage: node tools/build-icons.js [path-to-browser]
 */
"use strict";
const fs = require("fs"), os = require("os"), path = require("path"), cp = require("child_process");
const root = path.resolve(__dirname, "..");
const browser = process.argv[2] || ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(fs.existsSync);
if (!browser) throw new Error("No Edge/Chrome found; pass its path as the first argument");
const svg = fs.readFileSync(path.join(root, "icons", "icon.svg"), "utf8");
const BG = "#121414"; // Kokuban dark --bg, same as manifest background_color
// maskable: full-bleed background, jelly inside the 80% safe zone
const jobs = [
  ["icon-192.png", 192, "transparent", 100],
  ["icon-512.png", 512, "transparent", 100],
  ["icon-maskable-512.png", 512, BG, 66]
];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "jelly-icons-"));
jobs.forEach(function (j) {
  const page = path.join(tmp, j[0] + ".html");
  fs.writeFileSync(page, '<!doctype html><style>html,body{margin:0;height:100%;background:' + j[2] + '}body{display:grid;place-items:center}svg{width:' + j[3] + '%;height:' + j[3] + '%}</style>' + svg);
  const args = ["--headless", "--disable-gpu", "--hide-scrollbars", "--default-background-color=00000000", "--force-device-scale-factor=" + j[1] / 512, "--window-size=512,512", "--screenshot=" + path.join(root, "icons", j[0]), "file:///" + page.replace(/\\/g, "/")];
  cp.execFileSync(browser, args, { stdio: "ignore" });
  console.log("icons/" + j[0]);
});
