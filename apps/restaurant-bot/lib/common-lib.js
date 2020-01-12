'use strict';

var commonLib = {};

/* -------------------------------------------------------------------------------- */

commonLib.isEmpty = function(value) {
  return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}


/* -------------------------------------------------------------------------------- */

module.exports = commonLib;