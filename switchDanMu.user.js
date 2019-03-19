// ==UserScript==
// @name         快捷键开关弹幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不支持flash播放器。shift+D 打开或关闭弹幕
// @author       n3taway
// @match        http://www.acfun.cn/*
// @match        https://www.bilibili.com/*
// @match        https://live.bilibili.com/*
// @match        https://www.huya.com/*
// @match        https://www.douyu.com/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const toolTip = document.createElement('div');
    toolTip.setAttribute('style', `
        width: 100px;
        height: 40px;
        line-height: 40px;
        background: #fff;
        color: rgba(0, 0, 0, 0.65);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        position: absolute;
        left: calc(50% - 50px);
        top: 10%;
        border-radius: 5%;
        text-align: center;
        display: none;
        pointer-events: none;
        z-index: 998;
    `);

    const toolTipWrap = document.createElement('div');
    toolTipWrap.setAttribute('id', '_toolTipWrap_');
    toolTipWrap.setAttribute('style', `
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 999;
        display: block;
    `);
    toolTipWrap.appendChild(toolTip);

    const tvConfig = new Map()
        .set('A站', {
            doubleBtn: false,
            url: 'acfun.cn',
            btnNode: ['.danmu-enabled'],
            optionWrapNode: 'noDiv',
        })
        .set('B站', {
            doubleBtn: false,
            url: 'bilibili.com',
            btnNode: ['.bilibili-player-video-btn.bilibili-player-video-btn-danmaku', '.live-icon-danmaku-on'],
            optionWrapNode: '.bilibili-player-danmaku-setting-lite-panel',
        })
        .set('虎牙', {
            doubleBtn: false,
            url: 'huya.com',
            btnNode: ['#player-danmu-btn'], //开关按钮
            optionWrapNode: '.player-danmu-pane', //弹幕操作提示层
        })
        .set('斗鱼', {
            doubleBtn: true,
            url: 'douyu.com',
            btnNode: ['.showdanmu-42b0ac'], //开启按钮
            btnOffNode: '.hidedanmu-5d54e2', //关闭按钮
            optionWrapNode: 'noDiv',
        });

    const [tvInfo] = [...tvConfig.values()].filter(item => location.href.includes(item.url));
    const { doubleBtn, btnNode, btnOffNode, optionWrapNode } = tvInfo;

    const q = function (selector) {
        return document.querySelector(selector);
    };

    const switchDanMu = {
        btn: undefined,
        showDanMu: true,
        click: new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        }),

        getBtn() {
            const timer = setInterval(() => {
                const [node] = btnNode.filter(item => q(item));
                if (node) {
                    switchDanMu.btn = q(node);
                    switchDanMu.toggleDanMu();
                    q('video').parentNode.appendChild(toolTipWrap); //提示信息与video同层级
                    console.warn('弹幕开关running...');
                    clearInterval(timer)
                } else {
                    switchDanMu.btn = undefined;
                }
            }, 1000);
        },

        showToolTip() {
            toolTip.style.display = 'block';
            toolTip.innerText = `弹幕已${switchDanMu.showDanMu ? '开' : '关'}`;
            let top = 10;
            setTimeout(() => {
                const timer = setInterval(() => {
                    if (top <= -10) {
                        toolTipWrap.style.display = 'none';
                        toolTipWrap.style.top = '10%';
                        clearInterval(timer);
                    } else {
                        top -= 1;
                        toolTipWrap.style.top = `${top}%`;
                    }
                }, 15);
            }, 1 * 1000);
        },

        hideTvToolTip() {
            if (q(optionWrapNode)) {
                q(optionWrapNode).style.display = 'none';
            };
        },

        doubleSwitch() {
            if (switchDanMu.showDanMu) {
                switchDanMu.btn.dispatchEvent(switchDanMu.click);
                switchDanMu.showDanMu = !switchDanMu.showDanMu;
            } else {
                q(btnOffNode).dispatchEvent(switchDanMu.click);
                switchDanMu.showDanMu = !switchDanMu.showDanMu;
            };
            switchDanMu.showToolTip();
            switchDanMu.hideTvToolTip();
        },

        toggleDanMu() {
            document.addEventListener('keyup', e => {
                if (e.shiftKey && e.keyCode === 68) {
                    q('#_toolTipWrap_').style.display = 'block';
                    if (doubleBtn) {
                        switchDanMu.doubleSwitch();
                        return false;
                    };
                    switchDanMu.showDanMu = !switchDanMu.showDanMu;
                    switchDanMu.btn.dispatchEvent(switchDanMu.click);
                    switchDanMu.showToolTip();
                    switchDanMu.hideTvToolTip();
                }
            });
        },

        run() {
            switchDanMu.getBtn();
        },
    }

    switchDanMu.run();
})();
