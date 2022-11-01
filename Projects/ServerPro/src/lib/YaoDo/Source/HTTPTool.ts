/****************************************************************************
 名称：常用工具函数集合 - 请求类
 作者：冯功耀
 ****************************************************************************/
let HTTPTool = {

        // 设置cookie
        setCookie: function (name: string, value: string, iDay: number) {
            let oDate = new Date();
            oDate.setDate(oDate.getDate() + iDay);
            document.cookie = name + '=' + value + ';expires=' + oDate;
        },

        // 获取cookie
        getCookie: function (name: string) {
            let arr = document.cookie.split('; ');
            for (let i = 0; i < arr.length; i++) {
                let arr2 = arr[i].split('=');
                if (arr2[0] === name) {
                    return arr2[1];
                }
            }

            return '';
        },

        // 删除cookie
        removeCookie: function (name: string) {
            this.setCookie(name, '1', -1);
        },

        /* 结果
        { user: 'anonymous',
          id: [ 123, 456 ], // 重复出现的 key 要组装成数组，能被转成数字的就转成数字类型
          city: '北京', // 中文需解码
          enabled: true, // 未指定值得 key 约定为 true
        }
        */
        // parseParam (url) {
        //   const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
        //   const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
        //   let paramsObj = {};
        //   // 将 params 存到对象中
        //   paramsArr.forEach(param => {
        //     if (/=/.test(param)) { // 处理有 value 的参数
        //       let [key, val] = param.split('='); // 分割 key 和 value
        //       val = decodeURIComponent(val); // 解码
        //       val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字
        //
        //       if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
        //         paramsObj[key] = [].concat(paramsObj[key], val);
        //       } else { // 如果对象没有这个 key，创建 key 并设置值
        //         paramsObj[key] = val;
        //       }
        //     } else { // 处理没有 value 的参数
        //       paramsObj[param] = true;
        //     }
        //   });
        //
        //   return paramsObj;
        // },

        // currentURL: 返回当前 URL
        currentURL: () => window.location.href,

        isPc: () => !navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)

    }
;

export = HTTPTool;
