/****************************************************************************
 名称：常用工具函数集合
 作者：冯功耀
 最后修改时间：2021 年 3 月 13 日
 ****************************************************************************/
import ArrTool from './Source/ArrTool.js';
import awaitWrap from './Source/AsyncTool.js';
import BOMTool from './Source/BOMTool.js';
import ColorTool from './Source/ColorTool.js';
import DateTool from './Source/DateTool.js';
import GISTool from './Source/GISTool.js';
import HTTPTool from './Source/HTTPTool.js';
import MathTool from './Source/MathTool.js';
import SafeTool from './Source/SafeTool.js';
import StringTool from './Source/StringTool.js';
import {array2Tree, treeGetByID} from './Source/TreeTool.js';
import Util from './Source/Utils.js';

let YaoDo = {
    ArrTool,
    awaitWrap,
    BOMTool,
    ColorTool,
    DateTool,
    GISTool,
    HTTPTool,
    MathTool,
    SafeTool,
    StringTool,
    Util
};


export = YaoDo;
