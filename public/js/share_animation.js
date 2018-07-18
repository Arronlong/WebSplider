//计算处理分享面板
let panelWidth;

function computAttr() {
    const availWidth = document.documentElement.offsetWidth;
    const availHeight = document.documentElement.offsetHeight;
    panelWidth = Math.floor(availWidth * 0.7);
    const sharewrap = document.getElementById("sharewrap");
    sharewrap.style.display = 'block';
    sharewrap.style.width = panelWidth + 'px';
    sharewrap.style.height = availHeight + 'px';
    sharewrap.style.left = -panelWidth + 'px';


    const sharepanel = document.getElementById("sharepanel");
    const shareconfig = document.getElementById("shareconfig");
    sharepanel.style.height = availHeight + 'px';
    shareconfig.style.height = availHeight + 'px';
    sharepanel.style.overflowY = "scroll";
    shareconfig.style.overflowY = "scroll";
}

//获取属性值
function getStyle(obj, attr) {
    if (obj.currentStyle) { //IE
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr]; //Other
    }
}

//计算分享及管理等上层面板所在位置
function computePosition() {
    const availWidth = document.documentElement.offsetWidth;
    return availWidth * 0.15;
}


//分享面板动效
// const moreshare = document.getElementsByClassName("moreshare")[0];
const sharewrap = document.getElementById("sharewrap");

function animation() {
    let targetPosition;
    if (parseInt(getStyle(sharewrap, 'left')) < 0) {
        targetPosition = Math.ceil(computePosition());
    } else {
        targetPosition = -panelWidth;
    }

    let timer = null;
    timer = setInterval(function() {
        let speed = (targetPosition - parseInt(getStyle(sharewrap, 'left'))) / 8;
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
        sharewrap.style.left = parseInt(getStyle(sharewrap, 'left')) + speed + 'px';
        if (targetPosition == parseInt(getStyle(sharewrap, 'left'))) {
            clearInterval(timer);
        }
    }, 16);
}
// moreshare.addEventListener('click', animation);
document.getElementsByClassName("close")[0].addEventListener('click', animation);