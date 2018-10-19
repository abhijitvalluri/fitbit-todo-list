/*
   Copyright 2018 Abhijit Kiran Valluri
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import document from "document";
import * as fs from "fs";
import { me as device } from "device";
import { battery } from "power";
import { inbox } from "file-transfer";
import * as cbor from "cbor";

let VTList = document.getElementById('my-tile-list');
let emptyListHelp = document.getElementById('emptyListHelp');
let timeOfDay = document.getElementById("timeOfDay");
let appTitle = document.getElementById("appTitle");
let batteryIcon = document.getElementById("batteryIcon");
let batteryPercent = document.getElementById("battery");
let batteryOverlay = document.getElementById("batteryIconOverlay");
let batteryRedLine = document.getElementById("batteryRedLine");

const IONIC = "IONIC";

if (device.modelName.toUpperCase() === IONIC) {
    timeOfDay.y = 20;
    appTitle.y = 20;
    batteryPercent.y = 20;
    batteryIcon.y = 3;
    batteryIcon.height = 22;
    batteryOverlay.height = 12;
    batteryRedLine.y = 8;
    batteryRedLine.height = 12;
}

function updateHeader() {
    let batteryLevel = battery.chargeLevel;
    batteryPercent.text = batteryLevel + "%";
    let batteryWidth = Math.round((100 - batteryLevel) * 0.24);
    batteryOverlay.width = batteryWidth;
    batteryOverlay.x = 31 - batteryWidth;

    if (batteryLevel > 10) {
        batteryRedLine.style.display = "none";
    } else {
        batteryRedLine.style.display = "inline";
    }

    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    minutes = minutes > 9 ? minutes : (minutes > 0 ? "0" + minutes : "00");
    let suffix = hours >= 12 ? " PM" : " AM";
    hours = ((hours + 11) % 12 + 1);
    let time = hours + ":" + minutes + suffix;
    timeOfDay.text = time;
    setTimeout(updateHeader, (60 - seconds) * 1000);
}

updateHeader();

// Colors
let extraDarkGrey = "#303030";
let white = "white";
let black = "black";
let grey = "grey";
let lightgreen = "lightgreen";
let green = "green";

let colorSchemes = {
    "sandybrown": {
        "checked": extraDarkGrey,
        "unchecked": white,
    },
    "tomato": {
        "checked": black,
        "unchecked": white,
    },
    "orangered": {
        "checked": black,
        "unchecked": white,
    },
    "gold": {
        "checked": green,
        "unchecked": black,
    },
    "white": {
        "checked": grey,
        "unchecked": black,
    },
    "black": {
        "checked": lightgreen,
        "unchecked": white,
    },
    "plum": {
        "checked": black,
        "unchecked": white,
    },
    "mediumvioletred": {
        "checked": black,
        "unchecked": white,
    },
    "purple": {
        "checked": black,
        "unchecked": white,
    },
    "deepskyblue": {
        "checked": black,
        "unchecked": white,
    },
    "dodgerblue": {
        "checked": black,
        "unchecked": white,
    },
    "midnightblue": {
        "checked": lightgreen,
        "unchecked": white,
    },
};

// Settings
let colorSchemeName = "dodgerblue";

let checkedState = [];
let checkedStateMap = {};


/**************************************************
                  LIST RENDERING
 *************************************************/
let populateList = function (listData) {
    if (listData.length === 0) {
        emptyListHelp.style.display = "inline";
    } else {
        emptyListHelp.style.display = "none";
    }

    let NUM_ELEMS = listData.length;
    mergeNewLoadedListWithStoredList(listData);

    let jsonListState = {
        "listData": listData,
        "checkedState": checkedState,
        "colorSchemeName": colorSchemeName
    };

    fs.writeFileSync("listState.txt", jsonListState, "json");
    try {
        let stats = fs.statSync("listState.txt");
        let storedListState = fs.readFileSync("listState.txt", "json");
    } catch (err) { }

    VTList.delegate = {
        getTileInfo: function (index) {
            return {
                type: "colour-pool",
                color: colorSchemeName,
                index: index,
            };
        },
        configureTile: function (tile, info) {
            if (info.type == 'colour-pool') {
                tile.getElementById('bg').style.fill = info.color;
                tile.getElementById('title-text').text = listData[info.index]["name"];
                tile.index = info.index;

                let checkbox_1 = tile.getElementById('checkbox');
                let titletext_1 = tile.getElementById('title-text');
                let listNumber = tile.getElementById('listNumber');

                listNumber.text = tile.index + 1;
                listNumber.style.fill = colorSchemes[colorSchemeName].unchecked;
                checkbox_1.value = checkedState[info.index];
                titletext_1.style.fill = checkedState[info.index] === 0 ? colorSchemes[colorSchemeName].unchecked : colorSchemes[colorSchemeName].checked;

                let dividerBlack = tile.getElementById('tile-divider-bottom-black');
                dividerBlack.style.opacity = colorSchemeName === black ? 0.0 : 1.0;

                tile.getElementById('checkbox').onclick = function (event) {
                    if (checkbox_1.value === 0) {
                        checkedState[tile.index] = 1;
                        checkedStateMap[listData[tile.index]["name"]] = 1;
                        titletext_1.style.fill = colorSchemes[colorSchemeName].checked;
                    } else {
                        checkedState[tile.index] = 0;
                        checkedStateMap[listData[tile.index]["name"]] = 0;
                        titletext_1.style.fill = colorSchemes[colorSchemeName].unchecked;
                    }
                    jsonListState.checkedState = checkedState;
                    fs.writeFileSync("listState.txt", jsonListState, "json");
                };

                tile.onclick = function (event) {
                    if (checkbox_1.value === 0) {
                        checkbox_1.value = 1;
                        checkedState[tile.index] = 1;
                        checkedStateMap[listData[tile.index]["name"]] = 1;
                        titletext_1.style.fill = colorSchemes[colorSchemeName].checked;
                    } else {
                        checkbox_1.value = 0;
                        checkedState[tile.index] = 0;
                        checkedStateMap[listData[tile.index]["name"]] = 0;
                        titletext_1.style.fill = colorSchemes[colorSchemeName].unchecked;
                    }
                    jsonListState.checkedState = checkedState;
                    fs.writeFileSync("listState.txt", jsonListState, "json");
                };
            }
        },
    };
    VTList.length = NUM_ELEMS;
};

function createCheckedStateHashMap(listData) {
    for (let i = 0; i !== listData.length; i++) {
        checkedStateMap[listData[i]["name"]] = checkedState[i];
    }
}

function mergeNewLoadedListWithStoredList(listData) {
    let newCheckedState = [];
    let newCheckedStateMap = {};
    for (let i = 0; i !== listData.length; i++) {
        let key = listData[i]["name"];
        if (key in checkedStateMap) {
            newCheckedState.push(checkedStateMap[key]);
            newCheckedStateMap[key] = checkedStateMap[key];
        } else {
            newCheckedState.push(0);
            newCheckedStateMap[key] = 0;
        }
    }
    checkedState = newCheckedState;
    checkedStateMap = newCheckedStateMap;
}

try {
    let stats = fs.statSync("listState.txt");
    let storedListState = fs.readFileSync("listState.txt", "json");
    colorSchemeName = storedListState.colorSchemeName || colorSchemeName;
    if (storedListState.listData !== undefined && storedListState.listData.length !== 0) {
        checkedState = storedListState.checkedState;
        createCheckedStateHashMap(storedListState.listData);
        populateList(storedListState.listData);
    }
} catch (err) {
    let jsonListState = {
        "listData": [],
        "checkedState": [],
        "colorSchemeName": colorSchemeName
    };
    fs.writeFileSync("listState.txt", jsonListState, "json");
    let storedListData = fs.readFileSync("listState.txt", "json");
}

let lastProcessedSettingTime = 0;

function loadSettings() {
    try {
        let settings = fs.readFileSync("todoItems.cbor", "cbor");
        if (lastProcessedSettingTime < settings.timestamp) {
            lastProcessedSettingTime = settings.timestamp;

            colorSchemeName = settings.colorSchemeName;
            if (settings.todo !== undefined && settings.todo.length !== undefined) {
                populateList(settings.todo);
            }
        }
    } catch (err) {
        //console.log("Err " + err);
    }
}

function processInbox() {
    let fileName;
    while (fileName = inbox.nextFile()) {
        if (fileName === 'todoItems.cbor') {
            loadSettings();
        }
    }
}

inbox.onnewfile = processInbox;
processInbox();