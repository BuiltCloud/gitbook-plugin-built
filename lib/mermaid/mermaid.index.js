let path = null

setInterval(() => {
  if (path !== window.location.pathname) {
    path = window.location.pathname
    document.querySelectorAll('.lang-mermaid').forEach(node => {
      const newNode = node.cloneNode(true)
      newNode.removeAttribute('class')
      const hr = document.createElement('hr')
      node.parentNode.insertBefore(hr, node)
      node.parentNode.insertBefore(newNode, hr)
    })
    window.mermaid.initialize({
      theme: 'forest',
      // themeCSS: '.node rect { fill: red; }',
      logLevel: 3,
      flowchart: { curve: 'basis' },
      gantt: { axisFormat: '%m/%d/%Y' },
      sequence: { actorMargin: 50 },
      // sequenceDiagram: { actorMargin: 300 } // deprecated
    }); 
    window.mermaid.init(undefined, document.querySelectorAll('.lang-mermaid'))
  }
}, 1000)