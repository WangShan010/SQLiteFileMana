/****************************************************************************
 名称：常用工具函数集合 - GIS常用算法类
 作者：冯功耀
 ****************************************************************************/
let GISTool = {
    // 海伦公式，输入三条边，求算面积
    calcTriangleArea(s1: number, s2: number, s3: number) {
        //边长必须大于0
        if (s1 < 0 || s2 < 0 || s3 < 0) {
            return 0;
        }
        //任意两边之和必须大于第三边
        if (!((s1 + s2 > s3) && (s1 + s3 > s2) && (s2 + s3 > s1))) {
            return 0;
        }
        //任意两边之差必须小于第三边
        if (!((s1 - s2 < s3) && (s2 - s1 < s3) && (s1 - s3 < s2) && (s3 - s1 < s2) && (s2 - s3 < s1) && (s3 - s2 < s1))) {
            return 0;
        }
        let s = (s1 + s2 + s3) / 2;
        return Math.sqrt(s * (s - s1) * (s - s2) * (s - s3));
    },

    //获得有向线矢量方向
    VecAngle(X1: number, Y1: number, X2: number, Y2: number) {
        //返回值在[0～2pai)之间
        //判断参考起点与终点是否重合
        //if(IS_EQUAL(X1, X2, 0.0) && IS_EQUAL(Y1, Y2, 0.0))
        //	throw(runtime_error("错误: 两点重合, 无法确定矢量方向"));
        let deltaX, deltaY;
        deltaX = X2 - X1;
        deltaY = Y2 - Y1;
        return this.NormalizeVecAngle(Math.atan2(deltaY, deltaX));
    },

    // 角度归2Pi化
    NormalizeVecAngle(angle: number) {
        // 返回值在[0～2pai)之间
        let count = ~~(angle / (2 * Math.PI));
        return (angle - count * (2 * Math.PI));
    },

    /**
     *求两个方向之间的夹角
     *
     * @param {*} direct1
     * @param {*} direct2
     * @returns
     */
    GeoAlgorithm(direct1: number, direct2: number) { //获得矢量夹角（从起始方向到终止方向，按逆时针）
        return this.NormalizeVecAngle(direct2 - direct1);
    }

};

export = GISTool;
