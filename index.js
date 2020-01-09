var fs = require('fs');
var path = require('path');

const syncReq = require('sync-request');
const nodeCache = require('node-cache');
const localCache = new nodeCache({});
const QRCode = require('qrcode');

Date.prototype.format = function(format) {
	var date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
};

module.exports = {
    book: {
        assets: './lib',
        js: [
            'plugin.js'
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
        },

        'page:before': function (page) {
			if (this.output.name != 'website') {
				return page;
			}
			const defaultOption = {
				'description': 'modified at',
				'signature': 'Enter',
				'wisdom': 'More than a coder, more than a designer',
				'format': 'yyyy-MM-dd hh:mm:ss',
				'copyright': 'Copyright &#169; BuiltCloud all right reserved, powered by <a href="https://github.com/BuiltCloud" target="_blank">kingreatwill</a>',
				'timeColor': '#666',
				'copyrightColor': '#666',
				'utcOffset': '8',
				'isShowQRCode': true,
				'baseUri': '',
				'isShowIssues': true,
				'repo': 'BuiltCloud/Ocelot.GrpcHttpGateway',
				'issueNum': '8',
				'token': '',
				'style': 'normal',
				'super': '&#174;'
			};

			const configOption = this.config.get('pluginsConfig')['page-footer'];
			
			if (configOption) {
				for (var item in defaultOption) {					
					if (item in configOption) {
						defaultOption[item] = configOption[item];
					}
				}
			}
			
			const qrImg = defaultOption.isShowQRCode === true ? '\n{{ file.path | currentUri("' + defaultOption.baseUri + '") }}\n' : '';
			const uri = defaultOption.isShowQRCode === true ? '\n{{ file.path | convertUri("' + defaultOption.baseUri + '") }}\n' : '';
			const issues = defaultOption.isShowIssues === true ? '\n{{ "' + defaultOption.repo + '" | listRepo("' + (process.env['GITHUB_TOKEN'] || defaultOption.token) + '", "' + defaultOption.format + '", ' + defaultOption.utcOffset + ', ' + defaultOption.issueNum + ') }}\n' : '';

			defaultOption.style = (defaultOption.style == 'normal' || defaultOption.style == 'symmetrical') ? defaultOption.style : 'normal';

			const htmlContents = ' \n\n<div class="footer">' +
				'<div class="footer__container--' + defaultOption.style + '" alt="' + uri + '">' +
					qrImg +
					'<div class="footer__description--' + defaultOption.style + '">' +
						'<p class="paragraph footer__author--' + defaultOption.style + '">' + defaultOption.signature + '<sup class="super">' + defaultOption.super + '</sup></p>' +
						'<p class="paragraph footer__quote--' + defaultOption.style + '">' + defaultOption.wisdom + '</p>' +
						'<div class="footer__main--' + defaultOption.style + '">' +
							'<p class="paragraph footer__main__paragraph--' + defaultOption.style + ' copyright" style="color: ' + defaultOption.copyrightColor + ' !important;">' + defaultOption.copyright +  '</span>' +
							'<p class="paragraph footer__main__paragraph--' + defaultOption.style + ' footer__modifyTime--' + defaultOption.style + '" style="color: ' + defaultOption.timeColor + ' !important;">' +
								'<span style="color: #666 !important;">' + defaultOption.description + '</span>' +
								'\n{{ file.mtime | dateFormat("' + defaultOption.format + '", ' + defaultOption.utcOffset + ') }}\n' +
							'</p>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div class="box__issues">' +
					issues +
				'</div>' +
			'</div>';

			/** add contents to the original content */
			page.content = page.content + htmlContents;

			return page;
		}
    },
    blocks: {},
    /** Map of new filters */
	filters: {
		dateFormat: function(d, format, utc) {
			var reservedDate = new Date(d);
			reservedDate = new Date(
				reservedDate.getUTCFullYear(),
				reservedDate.getUTCMonth(),
				reservedDate.getUTCDate(),
				reservedDate.getUTCHours(),
				reservedDate.getUTCMinutes(),
				reservedDate.getUTCSeconds()
			);
			reservedDate.setTime(reservedDate.getTime() + (!utc ? 8 : parseInt(utc)) * 60 * 60 * 1000);
			return reservedDate.format(format);
		},

		convertUri: function (d, baseUri) {
			return baseUri + this.output.toURL(d);
		},

		currentUri: function (d, baseUri) {
			if (this.output.name == 'website') {
                var qr_img_url = ''
                QRCode.toDataURL(baseUri + this.output.toURL(d), function (err, url) {
                    console.log(url)
                    console.log(err)
                    qr_img_url = url
                })
                console.log(qr_img_url)
                console.log("qr_img_urlxxxx")
                console.log(baseUri + this.output.toURL(d))
				return qr_img_url;//pageFooter.createQRcode(baseUri + this.output.toURL(d), 15, 'Q');
			} else {
                console.log("qr_img_url")
				return '';
			}
		},

		listRepo: function (d, token, format, utc, issueNum) {
			var content = '';
			if (localCache.get('cleared') != 'true') {
				localCache.del('issues');
				localCache.set('cleared', 'true');
				console.log('clear successfully');
			}

			var value = localCache.get('issues');

			if (typeof(value) == 'undefined') {
				var url = (token == '') ? 'https://api.github.com/repos/' + d + '/issues?per_page=' + issueNum : 'https://api.github.com/repos/' + d + '/issues?per_page=' + issueNum + '&access_token=' + token;

				var res = syncReq('GET', url, {
					'headers': {
						'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36'
					}
				});

				if (res.statusCode != '200') {
					console.log('failed to get issues with token: ' + token);
				} else {
					localCache.set('issues', res.getBody().toString());
				}

				value = localCache.get('issues');
			}

			/** parse json */
			value = JSON.parse(value);

			content += '<span class="issue-line"><p class="issue-header"><strong>' + value.length + '</strong> issues reported</p></span>';

			for (var i = 0; i < value.length; i++) {
				var labels = '';

				for (var j = 0; j < value[i].labels.length; j++) {
					var bgColor = value[i].labels[j].color;
					var r = parseInt(bgColor.slice(0, 2), 16);
					var g = parseInt(bgColor.slice(2, 4), 16);
					var b = parseInt(bgColor.slice(4, 6), 16);

					var fontColor = r < 80 || g < 80 || b < 80 ? 'ffffff' : '000000';

					labels += '<span class="issue-label" style="background-color: #' + bgColor + '; color: #' + fontColor + ';">' + value[i].labels[j].name + '</span>';
				}

				var reservedDate = new Date(value[i].updated_at);
				reservedDate.setTime(reservedDate.getTime() + (parseInt(utc) === NaN ? 20 : parseInt(utc)) * 60 * 60 * 1000);

				content += '<p class="issues">#' + value[i].number + ' <a href="' + value[i].html_url + '" target="_blank">' + value[i].title + '</a><span style="margin-left: 10px; color: #ddd;">' + reservedDate.format(format) + '</span>' + labels + '</p>\n';

				if (i != value.length - 1) {
					content += '<p class="issue-edge"></p>'
				}
			}

			return content;
		}
	}
};