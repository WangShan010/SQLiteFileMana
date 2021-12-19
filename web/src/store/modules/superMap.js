const superMap = {
  debug: true,
  state: {
    isInitViewer: false,
    // 控制界面显隐，0默认隐藏，1显示
    ToolBarShow: true,
    toolBar: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    addLayer: [1, 0, 0],
    sceneAtttribute: [1, 0, 0, 0, 0],
    terrain: [1, 0, 0, 0],
    clip: [1, 0, 0, 0],
    analysis: [1, 0, 0, 0, 0],
    cityPlan: [1, 0, 0, 0, 0],
    onlineEdit: [1, 0, 0, 0],
    specialEffects: [0, 0, 0, 0], //特效
    hotSpots: [0, 0], //热点
    compass: true,
    infoManage: true,
    // 图层管理
    S3MLayerManage: null,
    imgLayerManage: null,
    terrainLayerManage: null,
    LayerAttributeToolbar: false, //图层属性显隐
    LayerAttribute: [1, 0, 0, 0],
    selectedLayerName: null, //当前选中编辑图层name
    // 编辑
    isEdit: false,
    isEditZ: false,
    zindex: 99,  //动态改变z-index
    toolBaseColor: [true, true, true, true, true, true, true, true, true],
    isInitEcharts: false,

    menuToolShow: true,
    layerSetting: false,
    measureToolShow: false,  // 量测工具
    specialEffects_scan: false,  // 特效-扫描
    specialEffects_wind: false,  // 特效-风场模型
    specialEffects_rain: false,  // 特效-雨雪
    treeToolShow: false,
    extendDataShow: false,
    pathPlanningShow: false
  },
  mutations: {

    setZindex(state, newValue) {
      state.zindex = newValue;
    },
    setisInitViewer(state, newValue) {
      state.isInitViewer = newValue;
    },
    setToolBarShow(state, newValue) {
      state.ToolBarShow = newValue;
    },
    setSpecialEffects(state, {id, val}) {
      state.specialEffects[id] = val;
      state.specialEffects = [...state.specialEffects];
    },
    setHotSpots(state, id, val) {
      state.hotSpots[id] = val;
      state.hotSpots = [...state.hotSpots];
    },
    setCompass(state, newValue) {
      state.compass = newValue;
    },
    setInfoManage(state, newValue) {
      state.infoManage = newValue;
    },
    // 设置导航工具显隐
    setToolBarAction(state, newValue) {
      switch (newValue) {
        case 0:
          state.toolBar[0] = !state.toolBar[0];
          break;
        case 1:
          state.toolBar[1] = !state.toolBar[1];
          state.toolBaseColor[1] = !state.toolBaseColor[1];
          break;
        case 2:
          state.toolBar[2] = !state.toolBar[2];
          state.toolBaseColor[2] = !state.toolBaseColor[2];
          break;
        case 3:
          state.toolBar[3] = !state.toolBar[3];
          state.toolBaseColor[3] = !state.toolBaseColor[3];
          break;
        case 4:
          state.toolBar[4] = !state.toolBar[4];
          state.toolBaseColor[4] = !state.toolBaseColor[4];
          break;
        case 5:
          state.toolBar[5] = !state.toolBar[5];
          state.toolBaseColor[5] = !state.toolBaseColor[5];
          break;
        case 6:
          state.toolBar[6] = !state.toolBar[6];
          state.toolBaseColor[6] = !state.toolBaseColor[6];
          break;
        case 7:
          state.toolBar[7] = !state.toolBar[7];
          state.toolBaseColor[7] = !state.toolBaseColor[7];
          break;
        case 8:
          state.toolBar[8] = !state.toolBar[8];
          state.toolBaseColor[8] = !state.toolBaseColor[8];
          break;
        case 9:
          state.toolBar[9] = !state.toolBar[9];
          break;
        case 10:
          state.toolBar[10] = !state.toolBar[10];
          break;
        case 11:
          state.toolBar[11] = !state.toolBar[11];
          break;
        default:
          state.toolBar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      state.toolBar = [...state.toolBar];
    },
    // 设置各功能组件子组件显隐
    setAddLayerAction(state, newValue) {
      state.addLayer = newValue;
    },
    setTerrainAction(state, newValue) {
      state.terrain = newValue;
    },
    setSceneAtttribute(state, newValue) {
      state.sceneAtttribute = newValue;
    },
    setClipAction(state, newValue) {
      state.clip = newValue;
    },
    setAnalysisAction(state, newValue) {
      state.analysis = newValue;
    },
    setCityPlanAction(state, newValue) {
      state.cityPlan = newValue;
    },
    setOnlineEditrAction(state, newValue) {
      state.onlineEdit = newValue;
    },
    // 设置图层管理
    setS3MLayerManage(state, newValue) {
      state.S3MLayerManage = newValue;
    },
    setImgLayerManage(state, newValue) {
      state.imgLayerManage = newValue;
    },
    setTerrainLayerManage(state, newValue) {
      state.terrainLayerManage = newValue;
    },
    setLayerAttributeToolbal(state, newValue) {
      state.LayerAttributeToolbar = newValue;
    },
    setLayerAttribute(state, newValue) {
      state.LayerAttribute = newValue;
    },
    setSelectedLayerName(state, newValue) {
      state.selectedLayerName = newValue;
    },
    setIsEdit(state, newValue) {
      state.isEdit = newValue;
    },
    setIsEditZ(state, newValue) {
      state.isEditZ = newValue;
    },

    // 设置菜单组件的显隐，1：显示，2：隐藏，3：切换
    setMenuToolAction(state, t = 1) {
      state.menuToolShow = t === 1 ? true : (t === 2 ? false : !state.menuToolShow);
    },

    /**
     * 设置弹窗模块组件的显隐
     * @param state   状态
     * @param name    组件名称
     * @param on_off  1：显示，2：隐藏，3：切换
     */
    setVGEEarthComAction(state, {name, on_off}) {
      switch (name) {
        // 资源树状图
        case 'treeTool':
          state.treeToolShow = on_off === 1 ? true : (on_off === 2 ? false : !state.treeToolShow);
          break;
        // 路径规划
        case 'pathPlanning':
          state.pathPlanningShow = on_off === 1 ? true : (on_off === 2 ? false : !state.pathPlanningShow);
          break;
        // 量测工具
        case 'measureTool':
          state.measureToolShow = on_off === 1 ? true : (on_off === 2 ? false : !state.measureToolShow);
          break;
        // 拓展数据
        case 'extendData':
          state.extendDataShow = on_off === 1 ? true : (on_off === 2 ? false : !state.extendDataShow);
          break;
      }
    }
  },
}

export default superMap
