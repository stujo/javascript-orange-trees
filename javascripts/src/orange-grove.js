"use strict";

// Write your Orange Tree code here - you may use constructor functions 


window.oranges = window.oranges || {};

window.oranges.FRUIT_BEARING_AGE = 3;
window.oranges.MAX_AGE = 10;
window.oranges.YEAR_GROWTH = 10;

(function() {
  var Tree = function() {
    this.age = 0;
    this.height = 0;
    this.orangeCount = 0;
    this.isAlive = true;
  }

  Tree.prototype = {

    randomNumber: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    isAliveImpl: function() {
      return this.age <= window.oranges.MAX_AGE;
    },
    percentGrown: function() {
      var maxHeight = window.oranges.MAX_AGE * window.oranges.YEAR_GROWTH;
      var percent =  Math.floor((this.height / maxHeight) * 100);
      return percent;
    },
    grow: function() {
      this.age++;
      this.orangeCount = 0;
      this.isAlive = this.isAliveImpl();
      if (this.isAlive) {
        this.height += window.oranges.YEAR_GROWTH;
        if (this.age > window.oranges.FRUIT_BEARING_AGE) {
          this.orangeCount += this.randomNumber(5, 10);
        }
      }
    },
    pickOrange: function() {
      if (this.orangeCount > 0) {
        this.orangeCount--;
        return new Orange();
      }
      return null;
    },
    dropOrange: function() {
      this.orangeCount--;
      return new Orange();
    }
  };

  var Orange = function() {
    this.diameter = 15;
  };

  window.oranges.Grove = function() {
    this.trees = [];
  };

  window.oranges.Grove.prototype.addTree = function() {
    this.trees.push(new Tree());
  };

  window.oranges.Grove.prototype.grow = function() {
    this.trees.forEach(function(tree) {
      tree.grow();
    });
  };
  window.oranges.Grove.prototype.collectFirewood = function() {
    var aliveTrees = []
    this.trees.forEach(function(tree) {
      if (tree.isAlive) {
        aliveTrees.push(tree);
      }
    });
    this.trees = aliveTrees;
  };


  var App = function(groveSelector, templateSelector, controlsSelector) {
    this._groveSelector = groveSelector;
    this._templateSelector = templateSelector;
    this._controlsSelector = controlsSelector;
  };

  App.prototype.updateView = function() {
    this.view.update(this.grove);

  };

  App.prototype.treeAction = function(tree, action) {
    if (typeof tree[action] == 'function') {
      tree[action]();
      this.updateView();
    }
  };

  App.prototype.groveAction = function(action) {
    if (typeof this.grove[action] == 'function') {
      this.grove[action]();
      this.updateView();
    }
  };

  App.prototype.bindHandlers = function() {

    // Set up delegated Event Handler (bound to this)
    document.querySelector(this._groveSelector).addEventListener("click", function(e) {
      if (e.target && e.target.nodeName == "BUTTON") {
        var treeIndex = parseInt(e.target.parentNode.dataset.tree_index, 10);
        var action = e.target.dataset.action;
        var tree = this.grove.trees[treeIndex];
        if (tree && action) {
          this.treeAction(tree, action);
        }
      }
    }.bind(this));


    // Set up delegated Event Handler (bound to this)
    document.querySelector(this._controlsSelector).addEventListener("click", function(e) {
      if (e.target && e.target.nodeName == "BUTTON") {
        var action = e.target.dataset.action;
        this.groveAction(action);
      }
    }.bind(this));

  };

  App.prototype.run = function() {
    this.bindHandlers();
    this.view = new window.oranges.View(this._groveSelector, this._templateSelector);
    this.grove = new window.oranges.Grove();
    this.updateView();
  };

  window.oranges.App = App;
})();
