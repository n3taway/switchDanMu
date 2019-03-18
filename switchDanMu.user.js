// ==UserScript==
// @name         快捷键开关弹幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不支持flash播放器。shift+D 打开或关闭弹幕
// @author       n3taway
// @match        http://www.acfun.cn/*
// @match        https://www.bilibili.com//*
// @match        https://www.huya.com/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var _switchDanMuMsg = document.createElement('div');
    _switchDanMuMsg.style.height = '40px';
    _switchDanMuMsg.style.lineHeight = '40px';
    _switchDanMuMsg.style.width = '100px';
    _switchDanMuMsg.style.background = '#fff';
    _switchDanMuMsg.style.color = 'rgba(0, 0, 0, 0.65)';
    _switchDanMuMsg.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    _switchDanMuMsg.style.position = 'absolute';
    _switchDanMuMsg.style.left = 'calc(50% - 50px)';
    _switchDanMuMsg.style.top = '10%';
    _switchDanMuMsg.style.borderRadius = '5% ';
    _switchDanMuMsg.style.textAlign = 'center';
    _switchDanMuMsg.style.display = 'none';
    _switchDanMuMsg.style.zIndex = '999999';

    var tvConfig = new Map()
        .set('虎牙', {
            url: 'huya.com',
            btnNode: '#player-danmu-btn', //开关按钮
            danmuwrapNode: '#danmuwrap', //弹幕包裹层
            optionwrapNode: '.player-danmu-pane', //弹幕操作提示层
        })
        .set('B站', {
            url: 'bilibili.com',
            btnNode: '.bilibili-player-video-btn.bilibili-player-video-btn-danmaku',
            danmuwrapNode: '.bilibili-player-video-danmaku',
            optionwrapNode: '.bilibili-player-danmaku-setting-lite-panel',
        })
        .set('A站', {
            url: 'acfun.cn',
            btnNode: '.danmu-enabled',
            danmuwrapNode: '.danmu-container',
            optionwrapNode: 'noDiv',
        });
    var [tvInfo] = [...tvConfig.values()].filter(item => location.href.includes(item.url));
    var { btnNode, danmuwrapNode, optionwrapNode } = tvInfo;

    var switchDanMu = {
        btn: undefined,
        showDanMu: true,
        eventClick: new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        }),
        getBtn: () => {
            var timer = setInterval(() => {
                var btn = document.querySelector(btnNode); //按钮
                if (btn) {
                    switchDanMu.btn = btn;
                    switchDanMu.toggleDanMu();
                    // document.querySelector(danmuwrapNode).appendChild(_switchDanMuMsg); //弹幕包裹层添加提示框
                    document.querySelector(danmuwrapNode).insertBefore(_switchDanMuMsg,document.querySelector(danmuwrapNode).children[0])
                    console.warn('弹幕开关running...');
                    clearInterval(timer)
                } else {
                    switchDanMu.btn = undefined;
                }
            }, 1000);
        },
        toggleDanMu: () => {
            document.addEventListener('keyup', e => {
                if (e.shiftKey && e.keyCode === 68) {
                    switchDanMu.btn.dispatchEvent(switchDanMu.eventClick);
                    switchDanMu.showDanMu = !switchDanMu.showDanMu;
                    if (document.querySelector(optionwrapNode)) {
                        document.querySelector(optionwrapNode).style.display = 'none'
                    };
                    _switchDanMuMsg.style.display = 'block';
                    _switchDanMuMsg.innerText = `弹幕已${switchDanMu.showDanMu ? '开' : '关'}`;
                    var top = 10;
                    setTimeout(() => {
                        var timer = setInterval(() => {
                            if (top <= -10) {
                                _switchDanMuMsg.style.display = 'none';
                                _switchDanMuMsg.style.top = '10%';
                                clearInterval(timer);
                            } else {
                                top -= 1;
                                _switchDanMuMsg.style.top = `${top}%`;
                            }
                        }, 15);
                    }, 1 * 1000);
                }
            });
        },
        run: () => {
            switchDanMu.getBtn();
        },
    }
    switchDanMu.run();;
})();
