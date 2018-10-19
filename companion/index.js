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

import { settingsStorage } from "settings";
import { outbox } from "file-transfer";
import * as cbor from 'cbor';

settingsStorage.onchange = function (evt) {
    //console.log("onchange: " + JSON.stringify(evt));
    sendTodoItems();
}

function sendTodoItems() {
    var todoItems = settingsStorage.getItem("todo_items");
    let colorSchemeName = settingsStorage.getItem("color_scheme_name");
    colorSchemeName = colorSchemeName ? JSON.parse(colorSchemeName) : "dodgerblue";

    if (todoItems) {
        try {
            var date = new Date();
            var time = date.getTime();
            todoItems = {
                "timestamp": time,
                "todo": JSON.parse(todoItems),
                "colorSchemeName": colorSchemeName
            };
            outbox.enqueue('todoItems.cbor', cbor.encode(todoItems))
                .then(ft => { /* console.log('todos sent'); */ })
                .catch(error => { /* console.log("Error sending todos: " + error); */ });
        } catch (e) {
            // console.log("error parsing setting value: " + e);
        }
    }
}
sendTodoItems();