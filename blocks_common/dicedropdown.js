/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2020 Massachusetts Institute of Technology
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Dropdown menu for dice
 * @author Bhuvan Singla (bhuvansingla2000@gmail.com)
 */
'use strict';

goog.provide('Blockly.Blocks.dicedropdown');

goog.require('Blockly.Blocks');

goog.require('Blockly.Colours');

goog.require('Blockly.constants');
Blockly.Blocks['dicedropdown'] = {
  /**
   * Block for slider value.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_dicedropdown",
          "name": "DICEDROPDOWN"
        }
      ],
      "outputShape": Blockly.OUTPUT_SHAPE_SQUARE,
      "output": "Number",
      "extensions": ["colours_pen"]
    });
  }
};