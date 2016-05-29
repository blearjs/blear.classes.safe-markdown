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


describe('测试文件', function () {
    // it('heading base', function () {
    //     var sm = new SafeMarkdown();
    //     var filename = 'heading1';
    //     var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
    //     var style = '<style>.heading-index{background: #000;color:#fff;margin-right:20px;}</style>';
    //
    //     fs.writeFileSync(path.join(__dirname, filename + '.html'), style + rd.content, 'utf8');
    // });


    // it('heading fixed', function () {
    //     var sm = new SafeMarkdown({
    //         headingFixed: true
    //     });
    //     var filename = 'heading2';
    //     var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
    //     var style = '<style>.heading-index{background: #000;color:#fff;margin-right:20px;}</style>';
    //
    //     fs.writeFileSync(path.join(__dirname, filename + '.html'), style + rd.content, 'utf8');
    // });


    // it('heading nofixed', function () {
    //     var sm = new SafeMarkdown({
    //         headingFixed: false
    //     });
    //     var filename = 'heading3';
    //     var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
    //     var style = '<style>.heading-index{background: #000;color:#fff;margin-right:20px;}</style>';
    //
    //     fs.writeFileSync(path.join(__dirname, filename + '.html'), style + rd.content, 'utf8');
    // });


    // it('heading hadingMinLevel', function () {
    //     var sm = new SafeMarkdown({
    //         hadingMinLevel: 5
    //     });
    //     var filename = 'heading3';
    //     var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
    //     var style = '<style>.heading-index{background: #000;color:#fff;margin-right:20px;}</style>';
    //
    //     fs.writeFileSync(path.join(__dirname, filename + '.html'), style + rd.content, 'utf8');
    // });


    it('heading toc', function () {
        var sm = new SafeMarkdown({
            hadingMinLevel: 2
        });
        var filename = 'heading4';
        var rd = sm.render(fs.readFileSync(path.join(__dirname, filename + '.md'), 'utf8'));
        var style = '<style>.heading-index{background: #000;color:#fff;margin-right:20px;}</style>';

        fs.writeFileSync(path.join(__dirname, filename + '.html'), style + rd.toc + rd.content, 'utf8');
    });
});

