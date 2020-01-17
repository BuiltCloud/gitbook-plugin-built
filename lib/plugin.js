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
    $.map(opts, function (ele) {
      $(ele).hide();
    });
  }

  const TERMINAL_HOOK = '**[terminal]'
  var timeouts = {};
  function addCopyButton(wrapper) {
    wrapper.append(
      $('<i class="fa fa-clone t-copy"></i>')
        .click(function () {
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
    timeouts[id] = window.setTimeout(function () {
      button.removeClass('fa-check').addClass('fa-clone');
    }, 1000);
  }

  // github button
  function addBeforeHeader(element) {
    jQuery('.book-header > h1').before(element)
  }

  function createButton({
    user,
    repo,
    type,
    size,
    width,
    height,
    count
  }) {
    var extraParam = type === "watch" ? "&v=2" : "";
    return `<a class="btn pull-right hidden-mobile" aria-label="github">
            <iframe
                style="display:inline-block;vertical-align:middle;"
                src="https://ghbtns.com/github-btn.html?user=${user}&repo=${repo}&type=${type}&count=${count}&size=${size}${extraParam}"
                frameborder="0"
                scrolling="0"
                width="${width}px"
                height="${height}px"
            ></iframe>
        </a>`;
  }

  function createUserButton({
    user,
    size,
    width,
    height,
    count
  }) {
    return `<a class="btn pull-right hidden-mobile" aria-label="github">
            <iframe
                style="display:inline-block;vertical-align:middle;"
                src="https://ghbtns.com/github-btn.html?user=${user}&type=follow&count=${count}&size=${size}"
                frameborder="0"
                scrolling="0"
                width="${width}px"
                height="${height}px"
            ></iframe>
        </a>`;
  }

  function insertGitHubLink(button) {
    var {
      user,
      repo,
      type,
      size,
      width,
      height,
      count
    } = button;

    var size = size || "large";
    var width = width || (size === "large" ? "150" : "100");
    var height = height || (size === "large" ? "30" : "20");
    var count = typeof count === "boolean" ? count : false;

    if (type === 'follow') {
      var elementString = createUserButton({
        user,
        size,
        width,
        height,
        count
      });
    } else {
      var elementString = createButton({
        user,
        repo,
        type,
        size,
        width,
        height,
        count
      });
    }
    addBeforeHeader(elementString);
  }

  function init_github_button() {
    config["github-buttons"].buttons.forEach(insertGitHubLink);
  }

  gitbook.events.bind('start', function (e, cfg) {
    config = cfg
    if (config.code && config.code.copyButton) {
      addCopyTextarea();
    }
  })

  gitbook.events.bind("page.change", function () {    
    insertLogo();
    hide_element();
    mermaid.initialize({
      theme: 'forest',
      // themeCSS: '.node rect { fill: red; }',
      logLevel: 3,
      flowchart: { curve: 'basis' },
      gantt: { axisFormat: '%m/%d/%Y' },
      sequence: { actorMargin: 50 },
      // sequenceDiagram: { actorMargin: 300 } // deprecated
    }); // mermaid.init();
    // github button;
    init_github_button();
    // code;
    if (config.code && (config.code.copyButton || config.code.line)) {
      $('pre').each(function () {
        format_code_block($(this));
      });
    }
  })

})
