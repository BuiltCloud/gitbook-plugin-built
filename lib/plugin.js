require(['gitbook', 'jQuery'], function (gitbook, $) {
  var url = ''
  var style = ''
  var href = './'
  var insertLogo = function (url, style, href) {
    $('.book-summary').children().eq(0).before('<div class="book-logo"><a href="' + href + '"><img src="' + url + '" style="' + style + '"></div>')
  }
  gitbook.events.bind('start', function (e, config) {
    url = config['logo']['url']
    style = config['logo']['style']
    href = config['logo']['href']
  })

  gitbook.events.bind("page.change", function() {
    insertLogo(url, style, href)
  })
})
