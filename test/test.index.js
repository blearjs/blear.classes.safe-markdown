/**
 * mocha 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var SafeMarkdown = require('../src/index.js');
var style = '<style>' +
    '.mention{background: #f6d734;margin:0 10px;}' +
    '.toc-index{background: #000;color:#fff;margin-right:20px;}' +
    '.heading-index{background: #000;color:#fff;margin-right:20px;}' +
    '</style>\n\n';


describe('测试文件', function () {
    // it('heading base', function () {
    //     var sm = new SafeMarkdown();
    //     var filename = 'heading1';
    //     var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
    //
    //     fs.writeFileSync(path.join(__dirname, filename + '.html'), style +rd.toc + rd.content, 'utf8');
    // });
    //
    //
    // it('headingIndentable: true', function () {
    //     var sm = new SafeMarkdown({
    //         headingIndentable: true
    //     });
    //     var filename = 'heading2';
    //     var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
    //     var rd2 = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
    //
    //     fs.writeFileSync(path.join(__dirname, filename + '.html'), style + rd.toc + '\n' + rd.content + '\n' + rd2.content, 'utf8');
    //     expect(rd.content).to.equal(rd2.content);
    // });
    //
    //
    // it('headingIndentable: false', function () {
    //     var sm = new SafeMarkdown({
    //         headingIndentable: false
    //     });
    //     var filename = 'heading3';
    //     var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
    //
    //     fs.writeFileSync(path.join(__dirname, filename + '.html'), style + rd.toc +rd.content, 'utf8');
    // });
    //
    //
    // it('heading hadingMinLevel', function () {
    //     var sm = new SafeMarkdown({
    //         hadingMinLevel: 5
    //     });
    //     var filename = 'heading3';
    //     var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
    //
    //     fs.writeFileSync(path.join(__dirname, filename + '.html'), style + rd.toc + rd.content, 'utf8');
    // });
    //
    //
    // it('heading toc', function () {
    //     var sm = new SafeMarkdown({
    //         hadingMinLevel: 2
    //     });
    //     var filename = 'heading4';
    //     var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
    //
    //     fs.writeFileSync(path.join(__dirname, filename + '.html'), style + rd.toc + rd.content, 'utf8');
    // });


    it('mentionable', function () {
        var sm = new SafeMarkdown({
            mentionable: true
        });
        var filename = 'mention1';
        var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
        var rd2 = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));

        fs.writeFileSync(path.join(__dirname, filename + '.html'), style + rd.toc + rd.content + rd.mentionList, 'utf8');
        expect(rd.mentionList.length).to.equal(3);
        expect(rd2.mentionList.length).to.equal(3);
    });


    // it('linkTrustedDomains', function () {
    //     var sm = new SafeMarkdown({
    //         linkTrustedDomains: [
    //             'a.com',
    //             'b.com'
    //         ]
    //     });
    //     var filename = 'link1';
    //     var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
    //
    //     fs.writeFileSync(path.join(__dirname, filename + '.html'), style + rd.toc + rd.content, 'utf8');
    // });
    //
    //
    // it('xssable', function () {
    //     var sm = new SafeMarkdown({
    //         xssable: true
    //     });
    //     var filename = 'xss1';
    //     var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
    //
    //     fs.writeFileSync(path.join(__dirname, filename + '.html'), style + rd.toc + rd.content, 'utf8');
    // });
});

