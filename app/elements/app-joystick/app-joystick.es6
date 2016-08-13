/* app-joystick.es6 */

import { debug } from 'app-core';
const log = debug('rsvp-client:app-joystick');

Polymer({
  is: 'app-joystick',
  properties: {
    /**
     * X Position of the joystick, relative to the joystick container
     */
    xPos: {
      type: Number,
      value: 0,
      observer: '_onXPosChanged',
    },

    /**
     * Y Position of the joystick, relative to the joystick container
     */
    yPos: {
      type: Number,
      value: 0,
      observer: '_onYPosChanged',
    },

    /**
     * Title of the joystick (ie. what is it controlling?)
     */
    title: {
      type: String,
      value: 'Joystick',
    },

    /**
     * Whether or not the transitions are disabled for the joystick
     */
    transitionDisabled: {
      type: Boolean,
      value: true,
      reflectToAttribute: true,
    },

    // === Private ===
    _joystickWidth: {
      type: Number,
    },

    _joystickHeight: {
      type: Number,
    },

    _padWidth: {
      type: Number,
    },

    _padHeight: {
      type: Number,
    },

    _padX: {
      type: Number,
    },

    _padY: {
      type: Number,
    },

    _trackStartLeft: {
      type: Number,
    },

    _trackStartTop: {
      type: Number,
    },
  },

  listeners: {
    'joystickContainer.down': '_onJoystickContainerDown',
    'joystickContainer.up': '_onJoystickContainerUp',
    'joystickContainer.track': '_onJoystickContainerTrackReceive',
  },

  attached() {
    this._getJoystickDimensions();
    this._updatePadDimensions();
    this._returnToCenter();
  },

  // === Private ===
  /**
   * Update the "usable space" dimensions
   */
  _updatePadDimensions() {
    const dims = this.$.joystickContainer.getBoundingClientRect();
    this._padWidth = dims.width;
    this._padHeight = dims.height;
    this._padX = dims.left;
    this._padY = dims.top;
  },

  /**
   * Get the dimensions of the "joystick" el
   */
  _getJoystickDimensions() {
    const dims = this.$.joystick.getBoundingClientRect();
    this._joystickWidth = dims.width;
    this._joystickHeight = dims.height;
  },

  /**
   * When the joystick receives the 'track' event
   */
  _onJoystickContainerTrackReceive(event) {
    switch (event.detail.state) {
      case 'start':
        this._onJoystickContainerDown(event);
        this.transitionDisabled = true;
        break;
      case 'track':
        this._onJoystickContainerTrack(event);
        break;
      case 'end':
        this.transitionDisabled = false;
        this._onJoystickContainerUp(event);
        break;
      default:
        log(`Track event '${event.detail.state}' not handled`);
        break;
    }
  },

  /**
  * When the joystick is pressed
  */
  _onJoystickContainerDown(event) {
    this._updatePadDimensions();
    this._trackStartLeft = event.detail.x - this._padX;
    this._trackStartTop = event.detail.y - this._padY;
    this.xPos = this._trackStartLeft;
    this.yPos = this._trackStartTop;
  },

  /**
   * When the joystick is to track the pointer
   */
  _onJoystickContainerTrack(event) {
    this.xPos = this._trackStartLeft + event.detail.dx;
    this.yPos = this._trackStartTop + event.detail.dy;
  },

  /**
   * When the joystick is unpressed
   */
  _onJoystickContainerUp() {
    this._returnToCenter();
  },

  /**
   * Return the joystick to the center of the pad
   */
  _returnToCenter() {
    this.xPos = this._padWidth / 2;
    this.yPos = this._padHeight / 2;
  },

  /**
   * On change of X position (left)
   */
  _onXPosChanged(value) {
    const actualValue = (value > this._padWidth) ? this._padWidth : ((value < 0) ? 0 : value);
    this.$.joystick.style.left = `${actualValue - (this._joystickWidth / 2)}px`;
  },

  /**
   * On change of Y position (top)
   */
  _onYPosChanged(value) {
    const actualValue = (value > this._padHeight) ? this._padHeight : ((value < 0) ? 0 : value);
    this.$.joystick.style.top = `${actualValue - (this._joystickHeight / 2)}px`;
  },
});
