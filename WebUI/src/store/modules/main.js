import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const mainStore = {
  state: {

    appConfig: {},

    legendShow: false,
    // 当前所显示的图例
    legendCurrent: {
      title: '',
      list: []
    },
    // 全部的图例数据
    legendCollection: [],

    // 时间轴的数据
    timeAxis: {
      show: false
    }

  },
  mutations: {
    setAppConfig(state, appConfig) {
      state.appConfig = appConfig;
    },
    setLegendCurrent(state, legend) {
      state.legendCurrent = legend;

      // state.legendCurrent = {
      //   title: '水资源评价',
      //   list: [
      //     { text: `超载`, color: 'rgba(251,0,10,0.7)' },
      //     { text: `临界超载`, color: 'rgba(251,201,0,0.7)' },
      //     { text: `不超载`, color: 'rgba(0,251,24,0.7)' }
      //   ]
      // };
    },

    setMainComAction(state, {name, on_off}) {
      switch (name) {
        // 图例
        case 'legend':
          state.legendShow = on_off === 1 ?
              true :
              (on_off === 2 ? false : !state.legendShow);
          break;
      }
    },

    AddLegend(state, legend) {
      state.legendCurrent = {
        title: '水资源评价',
        list: [
          {text: `超载`, color: 'rgba(251,0,10,0.7)'},
          {text: `临界超载`, color: 'rgba(251,201,0,0.7)'},
          {text: `不超载`, color: 'rgba(0,251,24,0.7)'}
        ]
      };
    },
    resetLegend(state) {
      state.legendCurrent = {
        title: '',
        list: []
      };
    },

    showTimeAxis(state) {
      state.timeAxis.show = true;
    },
    resetTimeAxis(state) {
      state.timeAxis.show = false;
    }
  }
};

export default mainStore;
