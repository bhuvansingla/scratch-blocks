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
 * @fileoverview Classes for all types of variable events.
 * @author bhuvansingla2000@gmail.com (Bhuvan Singla)
 */
'use strict';

goog.provide('Blockly.Events.DiceDelete')
goog.provide('Blockly.Events.DiceChange')
goog.provide('Blockly.Events.DiceCreate')


goog.require('Blockly.Events');
goog.require('Blockly.Events.Abstract');

goog.require('goog.array');
goog.require('goog.math.Coordinate');


/**
 * Class for the event to delete a dice
 * @param {String} dicename name of the dice
 * @extends {Blockly.Events.Abstract}
 * @constructor
 */
Blockly.Events.DiceDelete = function (dicename, workspace) {
  Blockly.Events.DiceDelete.superClass_.constructor.call(this);
  this.dicename = dicename;
  this.workspaceId = workspace.id
};

goog.inherits(Blockly.Events.DiceDelete, Blockly.Events.Abstract);

Blockly.Events.DiceDelete.prototype.type = Blockly.Events.DICE_DELETE;

/**
* Encode the event as JSON.
* @return {!Object} JSON representation.
*/
Blockly.Events.DiceDelete.prototype.toJson = function () {
  var json = Blockly.Events.DiceDelete.superClass_.toJson.call(this);
  json['dicename'] = this.dicename;
  return json;
};

/**
* Decode the JSON event.
* @param {!Object} json JSON representation.
*/
Blockly.Events.DiceDelete.prototype.fromJson = function (json) {
  Blockly.Events.DiceDelete.superClass_.toJson.call(this);
  this.dicename = json['dicename'];
};

// Blockly.Events.DiceDelete.prototype.run = function (forward) {
//   var workspace = this.getEventWorkspace_();
// };


/**
 * Class for the event to change a dice
 * @param {String} dicename name of the dice
 * @extends {Blockly.Events.Abstract}
 * @constructor
 */
Blockly.Events.DiceChange = function (dicename, workspace) {
  Blockly.Events.DiceChange.superClass_.constructor.call(this);
  this.dicename = dicename;
  this.workspaceId = workspace.id
};

goog.inherits(Blockly.Events.DiceChange, Blockly.Events.Abstract);

Blockly.Events.DiceChange.prototype.type = Blockly.Events.DICE_CHANGE;

/**
* Encode the event as JSON.
* @return {!Object} JSON representation.
*/
Blockly.Events.DiceChange.prototype.toJson = function () {
  var json = Blockly.Events.DiceChange.superClass_.toJson.call(this);
  json['dicename'] = this.dicename;
  return json;
};

/**
* Decode the JSON event.
* @param {!Object} json JSON representation.
*/
Blockly.Events.DiceChange.prototype.fromJson = function (json) {
  Blockly.Events.DiceChange.superClass_.toJson.call(this);
  this.dicename = json['dicename'];
};

// Blockly.Events.DiceChange.prototype.run = function (forward) {
//   var workspace = this.getEventWorkspace_();
// };


/**
 * Class for the event to delete a dice
 * @param {String} dicename name of the dice
 * @param {String} dicetype type of dice
 * @extends {Blockly.Events.Abstract}
 * @constructor
 */
Blockly.Events.DiceCreate = function (dicename, dicetype, workspace) {
  Blockly.Events.DiceCreate.superClass_.constructor.call(this);
  this.dicename = dicename;
  this.dicetype = dicetype;
  this.workspaceId = workspace.id
};

goog.inherits(Blockly.Events.DiceCreate, Blockly.Events.Abstract);

Blockly.Events.DiceCreate.prototype.type = Blockly.Events.DICE_CREATE;

/**
* Encode the event as JSON.
* @return {!Object} JSON representation.
*/
Blockly.Events.DiceCreate.prototype.toJson = function () {
  var json = Blockly.Events.DiceCreate.superClass_.toJson.call(this);
  json['dicename'] = this.dicename;
  json['dicetype'] = this.dicetype;
  return json;
};

/**
* Decode the JSON event.
* @param {!Object} json JSON representation.
*/
Blockly.Events.DiceCreate.prototype.fromJson = function (json) {
  Blockly.Events.DiceCreate.superClass_.toJson.call(this);
  this.dicename = json['dicename'];
  this.dicetype = json['dicetype']
};

// Blockly.Events.DiceCreate.prototype.run = function (forward) {
//   var workspace = this.getEventWorkspace_();
// };
