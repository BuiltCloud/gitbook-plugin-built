require(['gitbook', 'jQuery'], function (gitbook, $) {  

  var config

  var insertLogo = function () {
    var url = config['logo']['url']
    var style = config['logo']['style']
    var href = config['logo']['href']
    $('.book-summary').children().eq(0).before('<div class="book-logo"><a href="' + href + '"><img src="' + url + '" style="' + style + '" id="book-logo"></div>')
  }

  var hide_element = function () {
    var opts = config['hide-element'].elements;
    $.map(opts, function(ele) {
      $(ele).hide();
    });
  }

  const TERMINAL_HOOK = '**[terminal]'
  var timeouts = {};
  function addCopyButton(wrapper) {
    wrapper.append(
        $('<i class="fa fa-clone t-copy"></i>')
            .click(function() {
              copyCommand($(this));
            })
    );
  }

  function addCopyTextarea() {
    /* Add also the text area that will allow to copy */
    $('body').append('<textarea id="code-textarea" />');
  }

  function copyCommand(button) {
    pre = button.parent();
    textarea = $('#code-textarea');
    textarea.val(pre.text());
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    pre.focus();
    updateCopyButton(button);
  }

  function format_code_block(block) {
    /*
     * Add line numbers for multiline blocks.
     */
    code = block.children('code');
    lines = code.html().split('\n');

    if (lines[lines.length - 1] == '') {
      lines.splice(-1, 1);
    }

    if (lines.length > 1 && config.code && config.code.line) {
      lines = lines.map(line => '<span class="code-line">' + line + '</span>');
      code.html(lines.join('\n'));
    }

    // Add wrapper to pre element
    wrapper = block.wrap('<div class="code-wrapper"></div>');

    if (config.code && config.code.copyButton) {
      addCopyButton(wrapper);
    }
  }

  function updateCopyButton(button) {
    id = button.attr('data-command');
    button.removeClass('fa-clone').addClass('fa-check');

    // Clear timeout
    if (id in timeouts) {
      clearTimeout(timeouts[id]);
    }
    timeouts[id] = window.setTimeout(function() {
      button.removeClass('fa-check').addClass('fa-clone');
    }, 1000);
  }

  gitbook.events.bind('start', function (e, cfg) {
    config = cfg
    if (config.code && config.code.copyButton) {
      addCopyTextarea();
    }
  })

  gitbook.events.bind("page.change", function() {
    insertLogo();
    hide_element();
    // code;
    $('pre').each(function() {
      format_code_block($(this));
    });

  })

})
