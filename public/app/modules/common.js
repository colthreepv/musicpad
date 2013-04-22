define([],
function () {
  var Common = {}
    , InputEvents = null;

  // afterRender version.. it is useful? *deprecated*
  InputForms = function() {
    $('input').each(function (index, item) {
      $(item)
        .focusin(function() { var self = $(this); self.attr('holder', self.attr('placeholder')).removeAttr('placeholder'); })
        .focusout(function() { var self = $(this); self.attr('placeholder', self.attr('holder')).removeAttr('holder'); });
    });
  };

  InputEvents = {
      'focusin input': function (event) { var self = $(event.target); self.attr('holder', self.attr('placeholder')).removeAttr('placeholder'); }
    , 'focusout input': function (event) { var self = $(event.target); self.attr('placeholder', self.attr('holder')).removeAttr('holder'); }
  };

  // Binds to export internal functions.
  Common.InputEvents = InputEvents;
  return Common;
});