import Vue from 'vue';
import Vuex from 'vuex';

import mainStore from './modules/main.js';
import superMap from "./modules/superMap.js";

Vue.use(Vuex);

let store = new Vuex.Store({
  state: {
    token: null,

    // 窗体对象数组格式：[ { windowName, visible: true, windowProp } ]

    customWindows: [],  // 自定义弹窗
    floatWindows: [], // 可拖动悬浮框，可以存在多个（允许隐藏）
    popWindows: [], // 不可移动的大弹窗，可以存在多个，但每次只能显示一个（其他的隐藏）
    rightWindows: [], // 右侧窗口，Tab 标签页，可以存在多个（禁止隐藏，关闭即销毁）
    bottomWindows: [] // 底部窗口，Tab 标签页，可以存在多个（禁止隐藏，关闭即销毁）
  },
  mutations: {
    // 打开自定义弹窗
    openCustomWindow(state, {windowName, windowProp}) {
      addWindow(state.customWindows, {windowName, visible: true, windowProp});
    },
    // 暂时隐藏自定义弹窗
    hideCustomWindow(state, windowName) {
      hideWindow(state.customWindows, windowName);
    },
    // 移除自定义弹窗
    removeCustomWindow(state, windowName) {
      state.customWindows = removeWidow(state.popWindows, windowName);
    },

    // 打开大弹窗
    openPopWindow(state, {windowName, windowProp}) {
      addWindow(state.popWindows, {windowName, visible: true, windowProp});
    },
    // 暂时隐藏大弹窗
    hidePopWindow(state, windowName) {
      hideWindow(state.popWindows, windowName);
    },
    // 移除大弹窗
    removePopWindow(state, windowName) {
      state.popWindows = removeWidow(state.popWindows, windowName);
    },

    // 打开悬浮框
    openFloatWindow(state, {windowName, windowProp}) {
      addWindow(state.floatWindows, {windowName, visible: true, windowProp});
    },
    // 暂时隐藏悬浮框
    hideFloatWindow(state, windowName) {
      hideWindow(state.popWindows, windowName);
    },
    // 移除悬浮框
    removeFloatWindow(state, windowName) {
      state.floatWindows = removeWidow(state.floatWindows, windowName);
    },
    // 移除全部悬浮框
    removeAllFloatWindow(state) {
      state.floatWindows = [];
    },

    // 打开右边栏标签页
    openRightWindow(state, {windowName, windowProp}) {
      addWindow(state.rightWindows, {windowName, visible: true, windowProp});
    },
    // 移除右边栏标签页
    removeRightWindow(state, windowName) {
      state.rightWindows = removeWidow(state.rightWindows, windowName);
    },
    // 移除右边栏标签页 ，关闭其他
    closeOtherRightWindow(state, windowName) {
      while (state.rightWindows.length > 1) {
        if (state.rightWindows[0].windowName !== windowName) {
          state.rightWindows.shift();
        } else {
          break;
        }
      }

      while (state.rightWindows.length > 1) {
        if (state.rightWindows[1].windowName !== windowName) {
          state.rightWindows.pop();
        }
      }
    },
    // 移除全部的右边栏标签页
    removeAllRightWindow(state) {
      state.rightWindows = [];
    },

    // 打开底部栏标签页
    openBottomWindow(state, {windowName, windowProp}) {
      window.$('#toolBarLeft').css('display', 'horizontal');
      window.$('#viewer-div').css('height', `calc(100vh - 260px)`);
      window.$('#viewerCon').css('height', `calc(100vh - 260px)`);
      window.$('#doubleViewerCon').css('height', `calc(100vh - 260px)`);
      window.$('#footerCon').css('height', `200px`);
      addWindow(state.bottomWindows, {windowName, visible: true, windowProp});
    },
    // 移除底部栏标签页
    removeBottomWindow(state, windowName) {
      // viewerCon自适应,先缩小viewerCon的高，然后打开底部模块
      window.$('#viewerCon').css('height', 'calc(100vh - 60px)');
      window.$('#viewerLine').css('height', 'calc(100vh - 60px)');
      window.$('#doubleViewerCon').css('height', 'calc(100vh - 60px)');
      window.$('#footerCon').css('height', `0px`);
      state.bottomWindows = removeWidow(state.bottomWindows, windowName);
    },
    // 移除底部栏标签页 ，关闭其他
    closeOtherBottomWindow(state, windowName) {
      while (state.bottomWindows.length > 1) {
        if (state.bottomWindows[0].windowName !== windowName) {
          state.bottomWindows.shift();
        } else {
          break;
        }
      }

      while (state.bottomWindows.length > 1) {
        if (state.bottomWindows[1].windowName !== windowName) {
          state.bottomWindows.pop();
        }
      }
    },
    // 移除全部的底部栏标签页
    removeAllBottomWindow(state) {
      state.bottomWindows = [];
    },

    // 重置全部的窗体
    reSetWindows(state) {
      state.customWindows = [];
      state.popWindows = [];
      state.floatWindows = [];
      state.rightWindows = [];
      state.bottomWindows = [];
    }
  },
  modules: {
    mainStore,
    superMap,
  }
});

function addWindow(windows, window) {
  let currentWd = getWindow(windows, window.windowName);
  if (!currentWd) {
    windows.push(window);
  }
}

function hideWindow(windows, windowName) {
  for (let i = 0; i < windows.length; i++) {
    if (windows[i].windowName === windowName) {
      windows[i].visible = false;
    }
  }
}

function removeWidow(windows, windowName) {
  let ws = [];
  for (let i = 0; i < windows.length; i++) {
    if (windows[i].windowName !== windowName) {
      ws.push(windows[i]);
    }
  }

  return ws;
}

function getWindow(windows, windowName) {
  for (let i = 0; i < windows.length; i++) {
    if (windows[i].windowName === windowName) {
      return windows[i];
    }
  }
}

export default store;
