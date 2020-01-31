/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
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
 * @fileoverview Slider blocks for Blockly.
 * @author Bhuvan Singla (bhuvansingla2000@gmail.com)
 */
'use strict';

goog.provide('Blockly.Blocks.markov');

goog.require('Blockly.Blocks');

goog.require('Blockly.Colours');

goog.require('Blockly.constants');
Blockly.Blocks['markov'] = {
  /**
   * Block for slider value.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1",
      "args0": [
        {
          "type": "field_markov",
          "name": "MARKOV"
        }
      ],
      "outputShape": Blockly.OUTPUT_SHAPE_SQUARE,
      "output": "Number",
      "extensions": ["colours_pen"]
    });
  }
};

//Blockly.Field.register('field_slider', Blockly.FieldSlider);
