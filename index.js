var fs = require('fs');
var path = require('path');

module.exports = {
    book: {
        assets: './lib',
        js: [
            'plugin.js',
            'footer.js'
        ],
        css: [
            'plugin.css',
            'footer.css'
        ]
    },
    // Hook process during build
    hooks: {
        // For all the hooks, this represent the current generator
        "page": function(page) {
            // img-popup;
            if(this.options.pluginsConfig && this.options.pluginsConfig["img-popup"]){
                page.content = page.content + '\n<script>document.onclick = function(e){ e.target.tagName === "IMG" && e.target.id != "book-logo" && window.open(e.target.src,e.target.src)}</script><style>img{cursor:pointer}</style>';
            }
            return page;
        },
        // This is called before the book is generated
        "init": function() {
            console.log("init!");
        },

        // This is called after the book generation
        "finish": function() {
            // favicon.ico;
            var pathFile = this.options.pluginsConfig && this.options.pluginsConfig.favicon;
			var favicon = path.join(process.cwd(), pathFile);
			var gitbookFaviconPath = path.join(process.cwd(), '_book', 'gitbook', 'images', 'favicon.ico');
			if (pathFile && fs.existsSync(pathFile) && fs.existsSync(gitbookFaviconPath)){
				fs.unlinkSync(gitbookFaviconPath);
				fs.createReadStream(favicon).pipe(fs.createWriteStream(gitbookFaviconPath));
			}
        }
    }

};