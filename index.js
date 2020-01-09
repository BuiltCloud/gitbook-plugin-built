module.exports = {
    book: {
        assets: './lib',
        js: [
            'plugin.js'
        ],
        css: [
            'plugin.css'
        ]
    },
    // Hook process during build
    hooks: {
        // For all the hooks, this represent the current generator

        // This is called before the book is generated
        "init": function() {
            console.log("init!");
        },

        // This is called after the book generation
        "finish": function() {
            console.log("finish!");
        }
    }

};