/**
 * Markdown 渲染与安全解析
 * @author ydr.me
 * @create 2016年05月29日11:05:44
 */


var Markdown = require('blear.classes.markdown');
var object = require('blear.utils.object');
var array = require('blear.utils.array');


var defaults = object.assign({}, Markdown.defaults, {
    /**
     * 是否显示 heading 链接
     * @type Boolean
     */
    headingLink: true,

    /**
     * heading className
     * @type String
     */
    headingClass: 'heading',

    /**
     * 是否显示 heading 索引值
     * @type Boolean
     */
    headingIndex: true,

    /**
     * 是否显示 heading 索引值分隔符
     * @type String
     */
    headingIndexSplit: '.',

    /**
     * 是否修正 heading，如将最高 h2 的修正为 h1
     * @type Boolean
     */
    headingFixed: true,

    /**
     * 最小 heading level 值，默认为 h1
     * @type Number
     */
    hadingMinLevel: 1,

    /**
     * toc className
     * @type String
     */
    tocClass: 'toc'
});


var SafeMarkdown = Markdown.extend({
    constructor: function (options) {
        var the = this;

        SafeMarkdown.parent(the);
        the[_options] = object.assign({}, defaults, options);
        // [{
        //   level: 1,
        //   id: 1,
        //   text: "text",
        //   children: [...]
        // }]
        the[_tocList] = [];
        the[_atList] = [];
        the[_heading]();
    },


    render: function (markdown) {
        var the = this;
        var content = SafeMarkdown.parent.render(the, markdown);

        return {
            toc: the[_renderToc](the[_tocList]),
            atList: the[_atList],
            content: content
        };
    }
});
var _options = SafeMarkdown.sole();
var _heading = SafeMarkdown.sole();
var _tocList = SafeMarkdown.sole();
var _renderToc = SafeMarkdown.sole();
var _atList = SafeMarkdown.sole();


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

        return before + main + after;
    };

    return before + eachChildren(tocList) + after;
});


SafeMarkdown.method(_heading, function () {
    var the = this;
    var options = the[_options];
    var headingClass = options.headingClass;
    var headingFixed = options.headingFixed;
    var headingLink = options.headingLink;
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

    // 1 ======> 1
    // 1 ======> 2
    //   2 ====> 2.1
    //   2 ====> 2.2

    the.renderer('heading', function (headingText, level) {
        var levelIndex = level - 1;
        var fixedLevel = level;
        var indent = 0;
        var tocItem = {};

        // 同级 h1 => h1
        if (lastLevel === level) {
            levelIndex = lastLevelIndex;

            if (headingFixed) {
                fixedLevel = lastLevelIndex + 1;
            }
        }
        // 返回 h2 => h1
        else if (lastLevel > level) {
            treeIndex[lastLevelIndex] = 0;

            if (headingFixed) {
                array.each(levelIndentList.slice(0, level), function (index, value) {
                    indent += value;
                });

                fixedLevel = level - indent;
                levelIndex = fixedLevel - 1;
            }
        }
        // 进入 h1 => h2
        else {
            if (headingFixed) {
                levelIndentList[levelIndex] = level - lastLevel - 1;
                array.each(levelIndentList.slice(0, level), function (index, value) {
                    indent += value;
                });

                fixedLevel = level - indent;
                levelIndex = fixedLevel - 1;
            }
        }

        treeIndex[levelIndex]++;

        var indexes = treeIndex.slice(0, fixedLevel);
        var indexesText = indexes.join(options.headingIndexSplit);
        var id = indexes.join('-');
        var html = '';
        var delta = options.hadingMinLevel - 1;
        var displayLevel = fixedLevel + delta;

        displayLevel = Math.min(displayLevel, 6);

        html += '<h' + displayLevel + ' id="' + headingClass + '-' + id + '" class="' + headingClass + ' ' + headingClass + '-h' + fixedLevel + '">';
        html += headingLink ? '<a href="#' + id + '" class="' + headingLinkClass + '">' : '';
        html += options.headingIndex ? '<span class="' + headingIndexClass + '">' + indexesText + '</span>' : '';
        html += '<span class="' + headingTextClass + '">' + headingText + "</span>";
        html += headingLink ? '</a>' : '';
        html += '</h' + displayLevel + '>';

        tocItem.indexesText = indexesText;
        tocItem.headingText = headingText;
        tocItem.level = fixedLevel;
        tocItem.id = id;
        tocItem.children = [];
        index++;
        lastLevel = level;
        lastLevelIndex = levelIndex;
        tocParentList[levelIndex].children.push(tocItem);
        tocParentList[levelIndex + 1] = tocItem;

        return html;
    });
});


SafeMarkdown.defaults = defaults;
module.exports = SafeMarkdown;
