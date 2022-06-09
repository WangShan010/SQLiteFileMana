function arraySortByKey(list,key) {
    // 前在前return 1,后在前return -1
    if (list === undefined || list === null) return []
    list.sort((a, b) => { // b是数组前一个，a是数组后一个
        // 去除.jpg,.jpeg,.gif,.png
        let strA = a[key].replace(/\.(jpg|jpeg|png)/, '');
        let strB = b[key].replace(/\.(jpg|jpeg|png)/, '');
        // 谁为非法值谁在前面
        if (strA === undefined || strA === null || strA === '' || strA === ' ' || strA === '　') {
            return -1
        }
        if (strB === undefined || strB === null || strB === '' || strB === ' ' || strB === '　') {
            return 1
        }
        let mB = strB.match(/\d+/g);
        let mA = strA.match(/\d+/g);
        // 全部都有数字
        if(mB && mA) {
            return parseInt(mB[mB.length-1]) > parseInt(mA[mA.length-1]) ? -1 : 1;
        }
        // 有一个有数字
        else if(mB || mA) {
            if(mB) {
                return 1;
            } else if(mA) {
                return -1;
            }
        }
        // 全都无数字
        else {
            // 如果a和b中全部都是汉字，或者全部都非汉字
            if ((strA.split('').every(char => notChinese(char)) && strB.split('').every(char => notChinese(char))) || (strA.split('').every(char => !notChinese(char)) && strB.split('').every(char => !notChinese(char)))) {
                return strA.localeCompare(strB)
            } else {
                const charAry = strA.split('')
                for (const i in charAry) {
                    if ((charCompare(strA[i], strB[i]) !== 0)) {
                        return charCompare(strA[i], strB[i])
                    }
                }
                // 如果通过上面的循环对比还比不出来，就无解了，直接返回-1
                return -1
            }
        }
    })
    return list
}

function charCompare(charA, charB) {
    // 谁为非法值谁在前面
    if (charA === undefined || charA === null || charA === '' || charA === ' ' || charA === '　') {
        return -1
    }
    if (charB === undefined || charB === null || charB === '' || charB === ' ' || charB === '　') {
        return 1
    }
    // 如果都为英文或者都为汉字则直接对比
    if ((notChinese(charA) && notChinese(charB)) || (!notChinese(charA) && !notChinese(charB))) {
        return charA.localeCompare(charB)
    } else {
        // 如果不都为英文或者汉字，就肯定有一个是英文，如果a是英文，返回-1，a在前，否则就是b是英文，b在前
        if (notChinese(charA)) {
            return -1
        } else {
            return 1
        }
    }
}

function notChinese(char) {
    const charCode = char.charCodeAt(0)
    return charCode >= 0 && charCode <= 128
}

export default arraySortByKey
