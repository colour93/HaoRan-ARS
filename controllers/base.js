/**
 * controllers/base.js
 * 基础控制器
 */

module.exports = {
    /**
     * 计算文件大小
     * @param {Numer} Byte 字节
     * @returns {String} 计算后文件大小的string
     */
    sizeCalc: (Byte) => {

        temp = Byte;

        if (temp < 1024) {
            return (parseInt(temp) + " B");
        }

        temp = temp / 1024;
        if (temp < 1024) {
            return (parseInt(temp) + " KB");
        }

        temp = temp / 1024;
        if (temp < 1024) {
            return (parseInt(temp) + " MB");
        }

        temp = temp / 1024;
        return (parseInt(temp) + " GB");

    }

}


