"use strict";
/* Write your JS to modify the view here */

window.oranges = window.oranges || {};

;
(function() {
  var View = function(targetDiv, treeTemplateSelector) {
    this.targetDivSelector = targetDiv;
    this.templateSelector = treeTemplateSelector;
  }

  View.prototype = {
    canvas: function() {
      return document.querySelector(this.targetDivSelector);
    },

    emptyTemplateHTML: function() {
      return document.querySelector(this.templateSelector).innerHTML;
    },

    processTemplate: function(template, data) {
      var output = template;
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          var tag = "{{" + property + "}}";
          var value = data[property];
          if (typeof value == 'string' || typeof value == 'number') {
            output = output.replace(tag, value);
          }
        }
      }

      return output;
    },

    update: function(grove) {
      var text = "";
      var template = this.emptyTemplateHTML();
      for (var i = 0; i < grove.trees.length; i++) {
        var tree = grove.trees[i];
        var data = {
          age: tree.age,
          treeIndex: i,
          height: tree.height,
          aliveOrDead: (tree.isAlive ? 'alive' : 'dead'),
          percentGrown: tree.percentGrown(),
          fruitCount: tree.orangeCount
        };
        text += this.processTemplate(template, data);
      }
      this.canvas().innerHTML = text;
    },
  };


  window.oranges.View = View;
})();
