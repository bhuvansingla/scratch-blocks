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
 * @author bhuvansingla2000@gmail.com (Bhuvan Singla)
 */
'use strict';

goog.provide('Blockly.FieldDiceDropdown');

goog.require('Blockly.Events.DiceDelete')
goog.require('Blockly.Events.DiceChange')
goog.require('Blockly.Field');
goog.require('Blockly.DropDownDiv');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.style');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');
goog.require('goog.userAgent');


/**
 * Class for an dice dropdown field.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldDiceDropdown = function() {
  Blockly.FieldDiceDropdown.superClass_.constructor.call(this);
  this.addArgType('dicedropdown');
  this.options_ = [];
};
goog.inherits(Blockly.FieldDiceDropdown, Blockly.Field);

/**
 * Construct a FieldDiceDropdown from a JSON arg object.
 * @param {!Object} element A JSON object with options.
 * @returns {!Blockly.FieldDiceDropdown} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldDiceDropdown.fromJson = function(element) {
  return new Blockly.FieldDiceDropdown(element['options']);
};

/**
 * Horizontal distance that a checkmark overhangs the dropdown.
 */
Blockly.FieldDiceDropdown.CHECKMARK_OVERHANG = 25;

/**
 * Mouse cursor style when over the hotspot that initiates the editor.
 */
Blockly.FieldDiceDropdown.prototype.CURSOR = 'default';

/**
 * Closure menu item currently selected.
 * @type {?goog.ui.MenuItem}
 */
Blockly.FieldDiceDropdown.prototype.selectedItem = null;

/**
 * Language-neutral currently selected string or image object.
 * @type {string|!Object}
 * @private
 */
Blockly.FieldDiceDropdown.prototype.value_ = '';

/**
 * Install this dropdown on a block.
 */
Blockly.FieldDiceDropdown.prototype.init = function() {
  if (this.fieldGroup_) {
    // Dropdown has already been initialized once.
    return;
  }
  // Add dropdown arrow: "option ▾" (LTR) or "▾ אופציה" (RTL)
  // Positioned on render, after text size is calculated.
  /** @type {Number} */
  this.arrowSize_ = 12;
  /** @type {Number} */
  this.arrowX_ = 0;
  /** @type {Number} */
  this.arrowY_ = 11;
  this.arrow_ = Blockly.utils.createSvgElement('image', {
    'height': this.arrowSize_ + 'px',
    'width': this.arrowSize_ + 'px'
  });
  this.arrow_.setAttributeNS('http://www.w3.org/1999/xlink',
      'xlink:href', Blockly.mainWorkspace.options.pathToMedia + 'dropdown-arrow.svg');
  this.className_ += ' blocklyDropdownText';

  Blockly.FieldDiceDropdown.superClass_.init.call(this);
  // If not in a shadow block, draw a box.
  if (!this.sourceBlock_.isShadow()) {
    this.box_ = Blockly.utils.createSvgElement('rect', {
      'rx': Blockly.BlockSvg.CORNER_RADIUS,
      'ry': Blockly.BlockSvg.CORNER_RADIUS,
      'x': 0,
      'y': 0,
      'width': this.size_.width,
      'height': this.size_.height,
      'stroke': this.sourceBlock_.getColourTertiary(),
      'fill': this.sourceBlock_.getColour(),
      'class': 'blocklyBlockBackground',
      'fill-opacity': 1
    }, null);
    this.fieldGroup_.insertBefore(this.box_, this.textElement_);
  }
  // Force a reset of the text to add the arrow.
  var text = this.text_;
  this.text_ = null;
  console.log('hi;', this.text_)
  this.setText(text);
};

/**
 * Create a dropdown menu under the text.
 * @private
 */
Blockly.FieldDiceDropdown.prototype.showEditor_ = function() {
  var options = this.getOptions();
  if (options.length == 0) return;

  this.dropDownOpen_ = true;
  // If there is an existing drop-down someone else owns, hide it immediately and clear it.
  Blockly.DropDownDiv.hideWithoutAnimation();
  Blockly.DropDownDiv.clearContent();

  var contentDiv = Blockly.DropDownDiv.getContentDiv();

  var thisField = this;     
  function callback(e) {
    var menuItem = e.target;
    if (menuItem) {
      thisField.onItemSelected(menuItem);
    }
    Blockly.DropDownDiv.hide();
    Blockly.Events.setGroup(false);
  }

  var menu = new goog.ui.Menu();
  menu.setRightToLeft(this.sourceBlock_.RTL);
  for (var i = 0; i < options.length; i++) {
    var content = options[i][0]; 
    var value = options[i][1];
  
    var menuItem = new goog.ui.MenuItem(content);
    menuItem.setRightToLeft(this.sourceBlock_.RTL);
    menuItem.setValue(value);
    menuItem.setCheckable(true);
    menu.addChild(menuItem, true);
    var checked = (value == this.value_);
    menuItem.setChecked(checked);
    if (checked) {
      this.selectedItem = menuItem;
    }
  }
  // Listen for mouse/keyboard events.
  goog.events.listen(menu, goog.ui.Component.EventType.ACTION, callback);

  // Record windowSize and scrollOffset before adding menu.
  menu.render(contentDiv);
  var menuDom = menu.getElement();
  Blockly.utils.addClass(menuDom, 'blocklyDropdownMenu');
  // Record menuSize after adding menu.
  var menuSize = goog.style.getSize(menuDom);
  // Recalculate height for the total content, not only box height.
  menuSize.height = menuDom.scrollHeight;

  var primaryColour = (this.sourceBlock_.isShadow()) ?
    this.sourceBlock_.parentBlock_.getColour() : this.sourceBlock_.getColour();

  Blockly.DropDownDiv.setColour(primaryColour, this.sourceBlock_.getColourTertiary());

  var category = (this.sourceBlock_.isShadow()) ?
    this.sourceBlock_.parentBlock_.getCategory() : this.sourceBlock_.getCategory();
  Blockly.DropDownDiv.setCategory(category);

  // Calculate positioning based on the field position.
  var scale = this.sourceBlock_.workspace.scale;
  var bBox = {width: this.size_.width, height: this.size_.height};
  bBox.width *= scale;
  bBox.height *= scale;
  var position = this.fieldGroup_.getBoundingClientRect();
  var primaryX = position.left + bBox.width / 2;
  var primaryY = position.top + bBox.height;
  var secondaryX = primaryX;
  var secondaryY = position.top;
  // Set bounds to workspace; show the drop-down.
  Blockly.DropDownDiv.setBoundsElement(this.sourceBlock_.workspace.getParentSvg().parentNode);
  Blockly.DropDownDiv.show(
      this, primaryX, primaryY, secondaryX, secondaryY, this.onHide.bind(this));

  menu.setAllowAutoFocus(true);
  menuDom.focus();

  // Update colour to look selected.
  if (!this.disableColourChange_) {
    if (this.sourceBlock_.isShadow()) {
      this.sourceBlock_.setShadowColour(this.sourceBlock_.getColourTertiary());
    } else if (this.box_) {
      this.box_.setAttribute('fill', this.sourceBlock_.getColourTertiary());
    }
  }
};

/**
 * Callback for when the drop-down is hidden.
 */
Blockly.FieldDiceDropdown.prototype.onHide = function() {
  this.dropDownOpen_ = false;
  // Update colour to look selected.
  if (!this.disableColourChange_ && this.sourceBlock_) {
    if (this.sourceBlock_.isShadow()) {
      this.sourceBlock_.clearShadowColour();
    } else if (this.box_) {
      this.box_.setAttribute('fill', this.sourceBlock_.getColour());
    }
  }
};

/**
 * Handle the selection of an item in the dropdown menu.
 * @param {!goog.ui.Menu} menu The Menu component clicked.
 * @param {!goog.ui.MenuItem} menuItem The MenuItem selected within menu.
 */
Blockly.FieldDiceDropdown.prototype.onItemSelected = function(menuItem) {
  var value = menuItem.getValue();
  if (this.sourceBlock_) {
    // Call any validation function, and allow it to override.
    value = this.callValidator(value);
  }
  if (value == 'DELETE' && this.sourceBlock_) {
    var workspace = this.sourceBlock_.workspace.targetWorkspace || this.sourceBlock_.workspace.getFlyout().getWorkspace().targetWorkspace
    if(workspace){

    }
    var blocks = Object.values(workspace.blockDB_);
    for(let i = 0; i < blocks.length; i++){
      if(blocks[i].getCategory() === 'Let\'s Chance'){
        var childBlocks = blocks[i].getChildren();
        for(let j = 0; j < childBlocks.length; j++){
          var field = childBlocks[j].getField('diceMenu') || childBlocks[j].getField('DICEDROPDOWN');
            if(field && (field.getValue() == this.getValue() || field.getValue() == this.value_)){
              blocks[i].dispose();
            }
        }
      }
    }
    Blockly.DropDownDiv.hide();
    Blockly.Events.fire(new Blockly.Events.DiceDelete(this.value_, workspace))
    
    var dices = workspace.getVariableMap().getVariablesOfType('dice');
    for(let i = 0; i < dices.length; i++){
      if(dices[i].name === this.value_){
        var variable = dices[i]
      }
    }
    workspace.getVariableMap().deleteVariable(variable);
    if(workspace.getVariableMap().getVariablesOfType('dice')[0]){
      var a = workspace.getVariableMap().getVariablesOfType('dice')[0].name;
      Blockly.Events.fire(new Blockly.Events.DiceChange(a, this.sourceBlock_.workspace));
      this.setValue(a);
    }
    return;
  }
  if (value !== null) {
    Blockly.Events.fire(new Blockly.Events.DiceChange(value, this.sourceBlock_.workspace));
    this.setValue(value);
  }
};

/**
 * Return a list of the options for this dropdown.
 * @return {!Array.<!Array>} Array of option tuples:
 *     (human-readable text, language-neutral name).
 */
Blockly.FieldDiceDropdown.prototype.getOptions = function() {
    var workspace = this.sourceBlock_.workspace.targetWorkspace || this.sourceBlock_.workspace.getFlyout().getWorkspace().targetWorkspace
    var variableMap = workspace.getVariableMap();
    var diceList = variableMap.getVariablesOfType('dice');

    var options = [];
    for(let i = 0; i < diceList.length; i++){
      options.push([diceList[i].name, diceList[i].name]);
    }
    options.push(['Delete ' + this.value_, 'DELETE'])
    this.options_ = options;
    return options;
};

/**
 * Get the language-neutral value from this dropdown menu.
 * @return {string} Current text.
 */
Blockly.FieldDiceDropdown.prototype.getValue = function() {
  return this.stringValue;
};

/**
 * Set the language-neutral value for this dropdown menu.
 * @param {string} newValue New value to set.
 */
Blockly.FieldDiceDropdown.prototype.setValue = function(newValue) {
  if (newValue === null || newValue === this.valueString) {
    return;  // No change if null.
  }
  if (this.sourceBlock_ && Blockly.Events.isEnabled()) {
    Blockly.Events.fire(new Blockly.Events.BlockChange(
        this.sourceBlock_, 'field', this.name, this.stringValue, newValue));
  }
  // Clear menu item for old value.
  if (this.selectedItem) {
    this.selectedItem.setChecked(false);
    this.selectedItem = null;
  }
  this.stringValue = newValue;
  this.value_ = newValue.split('||')[0];
  // Look up and display the human-readable text.
  var options = this.getOptions();
  for (var i = 0; i < options.length; i++) {
    // Options are tuples of human-readable text and language-neutral values.
    if (options[i][1] == this.value_) {
      var content = options[i][0];
      this.text_ = content;
      // Always rerender if either the value or the text has changed.
      this.forceRerender();
      return;
    }
  }
  // Value not found.  Add it, maybe it will become valid once set
  // (like variable names).
  this.text_ = this.value_;
  this.forceRerender();
};

/**
 * Sets the text in this field.  Trigger a rerender of the source block.
 * @param {?string} text New text.
 */
Blockly.FieldDiceDropdown.prototype.setText = function(text) {
  if (text === null || text === this.text_) {
    // No change if null.
    return;
  }
  this.text_ = text;
  this.updateTextNode_();

  if (this.textElement_) {
    this.textElement_.parentNode.appendChild(this.arrow_);
  }
  if (this.sourceBlock_ && this.sourceBlock_.rendered) {
    this.sourceBlock_.render();
    this.sourceBlock_.bumpNeighbours_();
  }
};

/**
 * Position a drop-down arrow at the appropriate location at render-time.
 * @param {number} x X position the arrow is being rendered at, in px.
 * @return {number} Amount of space the arrow is taking up, in px.
 */
Blockly.FieldDiceDropdown.prototype.positionArrow = function(x) {
  if (!this.arrow_) {
    return 0;
  }

  var addedWidth = 0;
  if (this.sourceBlock_.RTL) {
    this.arrowX_ = this.arrowSize_ - Blockly.BlockSvg.DROPDOWN_ARROW_PADDING;
    addedWidth = this.arrowSize_ + Blockly.BlockSvg.DROPDOWN_ARROW_PADDING;
  } else {
    this.arrowX_ = x + Blockly.BlockSvg.DROPDOWN_ARROW_PADDING / 2;
    addedWidth = this.arrowSize_ + Blockly.BlockSvg.DROPDOWN_ARROW_PADDING;
  }
  if (this.box_) {
    // Bump positioning to the right for a box-type drop-down.
    this.arrowX_ += Blockly.BlockSvg.BOX_FIELD_PADDING;
  }
  this.arrow_.setAttribute('transform',
      'translate(' + this.arrowX_ + ',' + this.arrowY_ + ')');
  return addedWidth;
};

/**
 * Close the dropdown menu if this input is being deleted.
 */
Blockly.FieldDiceDropdown.prototype.dispose = function() {
  this.selectedItem = null;
  Blockly.WidgetDiv.hideIfOwner(this);
  Blockly.FieldDiceDropdown.superClass_.dispose.call(this);
};

Blockly.Field.register('field_dicedropdown', Blockly.FieldDiceDropdown);
