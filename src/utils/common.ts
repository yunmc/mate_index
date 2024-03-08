import { Md5 } from 'ts-md5';
import { useUserStore } from '@/stores/user';
export function GenerateKey() {
    const userStore = useUserStore();
    const token = userStore.Token;
    const param = {
        seed: Date.now(),
        apikey: token ? token : `apikey_${randomRange(17)}`,
        sign: '',
    };
    const md5: any = new Md5();
    md5.appendAsciiStr(param.apikey + param.seed + 'b8e8d3041d75434eb2c093a4524e0a11');
    const password = md5.end();
    param.sign = password.toUpperCase();
    return param;
}

/** 随机生成固定位数或者一定范围内的字符串数字组合
 * @param {Number} min 范围最小值
 * @param {Number} max 范围最大值，当不传递时表示生成指定位数的组合
 * @returns {String} 返回字符串结果
 * */
export function randomRange(min: number, max?: number | undefined) {
    let returnStr = '';
    const range: any = max ? Math.round(Math.random() * (max - min)) + min : min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    for (let i = 0; i < range; i++) {
        const index = Math.round(Math.random() * (arr.length - 1));
        returnStr += arr[index];
    }
    return returnStr;
}

export function setTags(tags: any) {
    const len = 30;
    let t: any = 0;
    const arr: any = [];
    tags.forEach((element: any) => {
        if (t + element.length < len) {
            t += element.length;
            arr.push(element);
        }
    });
    return arr;
}

/** 时间戳转日期
 * @returns {String} 返回字符串结果
 * */
export function timestampToDate(timestamp: any) {
    const d = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    let ampm = 'AM';
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth(); // 月份从0开始，需要加1
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    if (hours >= 12) {
        ampm = 'PM';
        hours = hours - 12;
    }

    const current_date = new Date();
    const current_year = current_date.getFullYear();
    const current_month = current_date.getMonth();
    const current_day = current_date.getDate();

    if (current_year == year && current_month == month && current_day == day) {
        return `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes} ${ampm}`;
    } else {
        return `${year == current_year ? '' : year} ${d[month]} ${day} ${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes} ${ampm}`;
    }
}

let hisTime: any = '';
export function getTimeDifference(timestamp: any) {
    if (hisTime == '') {
        hisTime = timestamp;
        return timestamp;
    } else {
        const difference = timestamp - hisTime;
        if (difference > 1800) {
            hisTime = timestamp;
            return difference;
        } else {
            return '';
        }
    }
}

//使用递归的方式实现数组、对象的深拷贝

export function deepClone(obj: any) {
    const _tmp = JSON.stringify(obj); //将对象转换为json字符串形式
    const result = JSON.parse(_tmp); //将转换而来的字符串转换为原生js对象
    return result;
}

export function getUrlParams(name: any) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
