$(document).ready(function() {
    let start = 0; //从多少开始渲染
    setImgsSize(start);
})

let _fontSize;

function fontSize(params) {
    let _html = document.getElementsByTagName("html")[0];
    let deviceWidth = _html.getBoundingClientRect().width;
    _html.style.fontSize = deviceWidth / 375 * 100 + "px";
    _fontSize = deviceWidth / 375 * 100;
}
fontSize();
window.onresize = function() {
    fontSize();
};
//  1 4 9三种不同的情况设置图片尺寸
function setImgsSize(start) {
    $(".item").slice(start).each(function() {
        let lines = parseInt($(this).find('.txt').css("height")) / parseInt($(this).find('.txt').css('line-height'));
        //如果小于6行文字
        if (lines <= 6) {
            $(this).find(".more").css("display", "none");
        } else {
            $(this).find('.txt').addClass("txt-hide");
        }
        let imgsNums = $(this).find(".imgs li").length;
        console.log(imgsNums);
        if (imgsNums == 1) {
            $(this).find(".imgs li").addClass("item-img");
            $(this).find(".imgs li").removeClass("item-imgs");
        } else {
            $(this).find(".imgs li").removeClass("item-img");
            $(this).find(".imgs li").addClass("item-imgs");
            if (imgsNums == 4) {
                $(this).find(".imgs").css("width", "2rem")
            }
            $(this).find(".imgs li").each(function() {
                let width = $(this).children('img')[0].width;
                let height = $(this).children('img')[0].height;
                let liWidth = $(this).width(); //li的宽度
                if (width / height > 1) {
                    let diff = (width - height) / 2; //单边差距
                    let scale = height / liWidth; //比例
                    $(this).addClass('height');
                    $(this).children('img').css("margin-left", -(diff / scale) + "px");
                } else {
                    let diff = (height - width) / 2; //单边差距
                    let scale = width / liWidth; //比例
                    $(this).addClass('width');
                    $(this).children('img').css("margin-top", -(diff / scale) + "px");
                }
            });
        }
    });

}
// 切换全文 收起
$(".content").on("click", ".more", function() {
    if ($(this).prev().hasClass("txt-hide")) {
        $(this).prev().removeClass("txt-hide");
        $(this).text("收起");
    } else {
        $(this).prev().addClass("txt-hide");
        $(this).text("全文");
    }
})