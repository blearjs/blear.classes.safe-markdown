/**
 * Markdown 渲染与安全解析
 * @author ydr.me
 * @create 2016年05月29日11:05:44
 */


var Markdown = require('blear.classes.markdown');
var object = require('blear.utils.object');
var array = require('blear.utils.array');
var string = require('blear.utils.string');
var url = require('blear.utils.url');
var xss = require('xss');


var defaults = object.assign({}, Markdown.defaults, {
    /**
     * 是否显示 heading 链接
     * @type Boolean
     */
    headingLinkable: true,

    /**
     * heading className
     * @type String
     */
    headingClass: 'heading',

    /**
     * 是否显示 heading 索引值
     * @type Boolean
     */
    headingIndexable: true,

    /**
     * 是否显示 heading 索引值分隔符
     * @type String
     */
    headingIndexSplit: '.',

    /**
     * 是否进行缩进修正，如将最高 h2 的修正为 h1
     * @type Boolean
     */
    headingIndentable: true,

    /**
     * 最小 heading level 值，默认为 h1
     * @type Number
     */
    hadingMinLevel: 1,

    /**
     * toc className
     * @type String
     */
    tocClass: 'toc',

    /**
     * 是否解析提及信息
     * @type Boolean
     */
    mentionable: true,

    /**
     * 提及的名称正则
     * @type RegExp
     */
    mentionNameRegExp: /[^\s@]+/,

    /**
     * 提及 class
     * @type String
     */
    mentionClass: 'mention',

    /**
     * 提及的链接模板
     * @type String
     */
    mentionLink: '/user/${name}/',

    /**
     * 提及链接打开方式
     * @type String
     */
    mentionLinkTarget: '_blank',

    /**
     * 提及的属性名称
     * @type String
     */
    mentionDataAttr: 'mention',

    /**
     * link 信赖的域名列表
     * @type Array
     */
    linkTrustedDomains: [],

    /**
     * 是否输出 link 的 favicon
     * @type Boolean
     */
    linkFaviconable: true,

    /**
     * link favicon 的图标 class
     * @type String
     */
    linkFaviconClass: 'favicon',

    /**
     * 是否进行 xss 防御
     * @type Boolean
     */
    xssable: true,

    /**
     * 白名单
     * @type Object
     */
    whiteList: object.assign(true, {}, xss.whiteList)
});


var SafeMarkdown = Markdown.extend({
    constructor: function (options) {
        var the = this;

        SafeMarkdown.parent(the);
        options = the[_options] = object.assign({}, defaults, options);
        // [{
        //   level: 1,
        //   id: 1,
        //   text: "text",
        //   children: [...]
        // }]
        the[_tocList] = [];
        the[_mentionList] = [];
        the[_heading]();
        the[_paragraph]();
        the[_link]();
        the[_xss] = options.xssable ? new xss.FilterXSS({
            whiteList: options.whiteList,
            stripIgnoreTagBody: ['script'],
            onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
                if (name.slice(0, 5) === 'data-' || name === 'id' || name === 'class') {
                    // 通过内置的escapeAttrValue函数来对属性值进行转义
                    return name + '="' + xss.escapeAttrValue(value) + '"';
                }
            }
        }) : {
            process: function (html) {
                return html;
            }
        };
    },


    /**
     * 渲染
     * @param markdown {String} markdown 字符串
     * @returns {{toc: *, mentionList: *, content: *}}
     */
    render: function (markdown) {
        var the = this;
        var content = SafeMarkdown.parent.render(the, markdown);

        return {
            toc: the[_renderToc](the[_tocList]),
            mentionList: the[_mentionList],
            content: the[_xss].process(content)
        };
    }
});
var _options = SafeMarkdown.sole();
var _heading = SafeMarkdown.sole();
var _tocList = SafeMarkdown.sole();
var _renderToc = SafeMarkdown.sole();
var _mentionList = SafeMarkdown.sole();
var _paragraph = SafeMarkdown.sole();
var _link = SafeMarkdown.sole();
var _xss = SafeMarkdown.sole();


SafeMarkdown.method(_renderToc, function (tocList) {
    var the = this;
    var options = the[_options];
    var tocClass = options.tocClass;
    var tocIndexesClass = tocClass + '-index';
    var tocTextClass = tocClass + '-text';
    var before = '<div class="' + tocClass + '">';
    var after = '</div>';
    var eachChildren = function (list) {
        var before = '';
        var main = '';
        var after = '</ul>';

        array.each(list, function (index, item) {
            var flag = tocClass + '-' + item.id;
            before = before || '<ul class="' + tocClass + '-' + item.level + '">';
            main += '<li id="' + flag + '">';
            main += '<span class="' + tocIndexesClass + '">' + item.indexesText + '</span>';
            main += '<span class="' + tocTextClass + '">' + item.headingText + '</span>';

            if (item.children.length) {
                main += eachChildren(item.children);
            }

            main += '</li>';
        });

        if (!before) {
            return before;
        }

        return before + main + after;
    };

    var main = eachChildren(tocList);

    if (!main) {
        return main;
    }

    return before + main + after;
});


SafeMarkdown.method(_heading, function () {
    var the = this;
    var options = the[_options];
    var headingClass = options.headingClass;
    var headingIndentable = options.headingIndentable;
    var headingLinkable = options.headingLinkable;
    var headingLinkClass = headingClass + '-link';
    var headingIndexClass = headingClass + '-index';
    var headingTextClass = headingClass + '-text';
    var index = 0;
    var treeIndex = [0, 0, 0, 0, 0, 0];
    var lastLevel = 0;
    var lastLevelIndex = -1;
    // 每一级向前缩进值
    var levelIndentList = [0, 0, 0, 0, 0, 0];
    var tocParentList = [{
        children: the[_tocList]
    }];
    var startIndent = -1;

    // 1 ======> 1
    // 1 ======> 2
    //   2 ====> 2.1
    //   2 ====> 2.2

    the.renderer('heading', function (headingText, level) {
        var levelIndex = level - 1;
        var fixedLevel = level;
        var fixedLevelIndex = levelIndex;
        var indent = 0;
        var tocItem = {};

        if (startIndent === -1) {
            startIndent = level - 1;
        }

        // 同级 h1 => h1
        if (lastLevel === level) {
            if (headingIndentable) {
                fixedLevel = lastLevelIndex + 1;
            }
        }
        // 返回 h2 => h1
        else if (lastLevel > level) {
            treeIndex[lastLevelIndex] = 0;
            array.each(levelIndentList.slice(0, level), function (index, value) {
                indent += value;
            });

            if (headingIndentable) {
                fixedLevel = level - indent;
            }
        }
        // 进入 h1 => h2
        else {
            levelIndentList[fixedLevelIndex] = level - lastLevel - 1;
            array.each(levelIndentList.slice(0, level), function (index, value) {
                indent += value;
            });

            if (headingIndentable) {
                fixedLevel = level - indent;
            }
        }

        fixedLevelIndex = fixedLevel - 1;
        treeIndex[fixedLevelIndex]++;

        var indexes = treeIndex.slice(headingIndentable ? 0 : startIndent, fixedLevel);
        var indexesText = indexes.join(options.headingIndexSplit);
        var id = indexes.join('-');
        var html = '';
        var delta = options.hadingMinLevel - 1;
        var displayLevel = fixedLevel + delta;

        displayLevel = Math.min(displayLevel, 6);

        html += '<h' + displayLevel + ' id="' + headingClass + '-' + id + '" class="' + headingClass + ' ' + headingClass + '-h' + fixedLevel + '">';
        html += headingLinkable ? '<a href="#' + id + '" class="' + headingLinkClass + '">' : '';
        html += options.headingIndexable ? '<span class="' + headingIndexClass + '">' + indexesText + '</span>' : '';
        html += '<span class="' + headingTextClass + '">' + headingText + "</span>";
        html += headingLinkable ? '</a>' : '';
        html += '</h' + displayLevel + '>';

        tocItem.indexesText = indexesText;
        tocItem.headingText = headingText;
        tocItem.level = fixedLevel;
        tocItem.id = id;
        tocItem.children = [];
        index++;
        lastLevel = level;
        lastLevelIndex = fixedLevelIndex;
        tocParentList[levelIndex - indent].children.push(tocItem);
        tocParentList[levelIndex - indent + 1] = tocItem;

        return html;
    });
});


SafeMarkdown.method(_paragraph, function () {
    var the = this;
    var options = the[_options];
    var nameRegExpString = options.mentionNameRegExp.toString().slice(1, -1);

    nameRegExpString = nameRegExpString
        .replace(/^\^/, '')
        .replace(/\$$/, '');

    nameRegExpString = '[@|＠](' + nameRegExpString + ')(?=\\s|$|@|＠)';
    var reMention = new RegExp(nameRegExpString, 'img');

    the.renderer('paragraph', function (text) {
        var before = '<p>';
        var after = '</p>';

        if (options.mentionable) {
            text = text.replace(reMention, function (source, name) {
                var href = string.assign(options.mentionLink, {
                    name: name
                });

                the[_mentionList].push(name);
                return '<a ' +
                    'href="' + href + '" ' +
                    'target="' + options.mentionLinkTarget + '" ' +
                    'data-' + options.mentionDataAttr + '="' + name + '" ' +
                    'class="' + options.mentionClass +
                    '">@' + name + '</a>';
            });
        }

        return before + text + after;
    });
});


SafeMarkdown.method(_link, function () {
    var the = this;
    var options = the[_options];
    var reHash = /^#/;
    var reJavascript = /^javascript:/i;
    var linkTrustedDomains = options.linkTrustedDomains;
    var regExpList = [];

    array.each(linkTrustedDomains, function (index, domain) {
        regExpList.push('([^.]*\\.)*' + domain);
    });

    var reExcludeDomain = new RegExp('(^' + regExpList.join('|') + '$)');

    the.renderer('link', function (href, title, text) {
        var blank = false;
        var nofollow = false;
        var hostname;

        if (!reHash.test(href) && !reJavascript.test(href)) {
            var ret = url.parse(href);
            hostname = ret.hostname;

            if (hostname && !reExcludeDomain.test(hostname)) {
                nofollow = true;
                blank = true;
            }
        }

        return ''.concat(
            '<a',
            ' href="' + href + '"',
            title ? ' title="' + title + '"' : '',
            nofollow ? ' rel="nofollow"' : '',
            blank ? ' target="blank"' : '',
            '>',
            options.linkFaviconable && hostname ? '<img class="' + options.linkFaviconClass + '" width="16" height="16" src="https://f.ydr.me/' + href + '">' : '',
            text || href,
            '</a>'
        );
    });
});

SafeMarkdown.defaults = defaults;
module.exports = SafeMarkdown;
