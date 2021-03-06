GitBook plugin: built
===========================

npm i sync-request
npm i node-cache
npm i qrcode-generator
npm i mermaid.cli

```json
{
    "plugins": ["built"],
    "pluginsConfig": {
        "logo": {
            "url": "http://www.example.com/my-logo.png",
            "style": "background: none;",
            "href": "http://www.example.com",
        },
        "favicon": "./img/logo/favicon.ico",
        "hide-element": {
            "elements": [".gitbook-link"]
        },
        "img-popup": true,
        "code": {
            "line": true,
            "copyButton": true
        },
        "github-buttons": {
            "buttons": [{
                "user": "openjw",
                "repo": "open",
                "type": "star",
                "size": "large"
            }, {
                "user": "openjw",
                "type": "follow",
                "width": "230",
                "count": false
            }]
        }
    }
}
```
#### github-buttons
The default size of `large` is `150 x 30`, and `small` is `100 x 20`, however, you can specify the size you want by using `width` and `height`. Such as:

- "size": "small" || "large"
- "width": `number`
- "height": `number`

//https://github.com/liushilive/gitbook-plugin-books
// https://github.com/rapidfixer/gitbook-plugin-mermaid-v8
// https://github.com/vowstar/gitbook-plugin-flow

https://unpkg.com/browse/mermaid@8.4.5/dist/mermaid.min.js