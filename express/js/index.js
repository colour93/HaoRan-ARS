/**
 * index.js
 * 索引页面使用js
 */

// 初始化全局变量
let toastDoc;
let toast;

// 加载时函数
window.onload = async () => {

    toastDoc = document.getElementById('msgToast');
    toast = new bootstrap.Toast(toastDoc, {delay: 2000});

}

// 绑定路径
async function bindPath () {

    const bindPathId = document.getElementById('bindPathSelect').value;
    const userId = document.getElementById('userId').innerHTML;
    
    result = await axios({
        method: 'POST',
        url: '/api/bindPath',
        data: {
            bindPathId,
            userId
        }
    }).then(a=>a.data);

    const msgToastHeader = document.getElementById('msgToast-header');
    const msgToastBody = document.getElementById('msgToast-body');

    switch (result.code) {

        case 0:
            msgToastHeader.innerHTML = "操作提示";
            msgToastBody.innerHTML = "绑定成功";
            break;
    
        default:
            msgToastHeader.innerHTML = "操作失败提示";
            msgToastBody.innerHTML = result.msg;
            break;
    }

    toastDoc.addEventListener('hidden.bs.toast', () => {
        location.reload();
    })
    toast.show();
}

// 注册新项目
async function registerItem () {

    

}