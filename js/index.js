window.onload = function() {
    getMessages(page);

}
let _fontSize;
let page = 0; //从多少开始渲染
function getMessages(page) {
    $.ajax({
        type: "get",
        url: "https://www.easy-mock.com/mock/5b0f64deb0c1263f2ec2237d/pyq/pyq",
        // url: "./data.json",
        data: {
            page: page
        },
        dataType: "json",
        success: res => {
            let data = res.data.items;
            // console.log(data.length);
            for (let i = 0; i < data.length; i++) {
                if (data[i].imgs.length > 0) {
                    let ul = document.createElement("ul");
                    ul.className = "imgs";
                    let imgsArr = [];
                    let PromiseALl = []; //所有异步操作
                    $("#content .content_ul").append(`<li class = "item"> <div class = "item-avatar"> <img src = "${data[i].avatar}" alt = "头像" > </div> <div class = "item-content" > <p class = "title" > ${data[i].title} </p> <div class = "txt" > ${data[i].txt} </div> <div class = "more" > <span > 全文 </span></div ><div class="imgs-box"></div><p class = "time" > ${data[i].time}</p> </div> </li> `);
                    let box = $("#content .content_ul .imgs-box").eq(i);
                    for (let j = 0; j < data[i].imgs.length; j++) {
                        // $(ul).append(`
                        //     <li><img src="${data[i].imgs[j]}"></li>
                        // `);
                        let imgsNums = data[i].imgs.length;
                        PromiseALl[j] = new Promise((resolve, reject) => {
                            imgsArr[j] = new Image();
                            imgsArr[j].src = data[i].imgs[j];
                            imgsArr[j].onload = function() {
                                if (imgsNums == 1) {
                                    $(this).parent().addClass("item-img");
                                    $(this).parent().removeClass("item-imgs");
                                    let that = this;
                                    $(this).find(".imgs li").children('img')[0].onload = () => {
                                        let width = $(this).find(".imgs li").children('img')[0].width;
                                        let height = $(this).find(".imgs li").children('img')[0].height;
                                        let liWidth = $(this).find(".imgs li").width(); //li的宽度
                                        let liHeight = $(this).find(".imgs li").height();

                                        if (width / height > 1) {
                                            let scale = width / liWidth; //比例
                                            $(this).find(".imgs li").children('img').css('height', height / scale);
                                            $(this).find(".imgs li").children('img').css('width', liWidth);

                                        } else {
                                            let scale = height / liWidth; //比例
                                            $(this).find(".imgs li").children('img').css('height', liHeight);
                                            $(this).find(".imgs li").children('img').css('width', width / scale);
                                        }
                                    }

                                }
                                let li = document.createElement("li");
                                li.className = "item-imgs";
                                li.append(imgsArr[j]);
                                ul.append(li);
                                resolve();
                            }
                        })
                    }
                    Promise.all(PromiseALl).then(() => {
                        box.html(ul);
                    });
                    // box.html(ul);
                } else {
                    $("#content .content_ul").append(`<li class = "item"> <div class = "item-avatar"> <img src = "${data[i].avatar}" alt = "头像" > </div> <div class = "item-content" > <p class = "title" > ${data[i].title} </p> <div class = "txt" > ${data[i].txt} </div> <div class = "more" > <span > 全文 </span></div > <p class = "time" > ${data[i].time}</p> </div> </li> `);
                }
            }
            setImgsSize(page);
            loading = false;

        },
        error: err => {
            console.log(err)
        }
    });
}

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
function setImgsSize(page) {
    $(".item").slice(0).each(function() {
        let lines = parseInt($(this).find('.txt').css("height")) / parseInt($(this).find('.txt').css('line-height'));
        //如果小于6行文字
        if (lines <= 6) {
            $(this).find(".more").css("display", "none");
        } else {
            $(this).find('.txt').addClass("txt-hide");
        }
        let imgsNums = $(this).find(".imgs li").length;
        console.log(imgsNums);

        if (imgsNums > 0) {
            if (imgsNums == 1) {
                $(this).find(".imgs li").addClass("item-img");
                $(this).find(".imgs li").removeClass("item-imgs");
                let that = this;
                $(this).find(".imgs li").children('img')[0].onload = () => {
                    let width = $(this).find(".imgs li").children('img')[0].width;
                    let height = $(this).find(".imgs li").children('img')[0].height;
                    let liWidth = $(this).find(".imgs li").width(); //li的宽度
                    let liHeight = $(this).find(".imgs li").height();

                    if (width / height > 1) {
                        let scale = width / liWidth; //比例
                        $(this).find(".imgs li").children('img').css('height', height / scale);
                        $(this).find(".imgs li").children('img').css('width', liWidth);

                    } else {
                        let scale = height / liWidth; //比例
                        $(this).find(".imgs li").children('img').css('height', liHeight);
                        $(this).find(".imgs li").children('img').css('width', width / scale);
                    }
                }

            } else {
                $(this).find(".imgs li").removeClass("item-img");
                $(this).find(".imgs li").addClass("item-imgs");
                if (imgsNums == 4) {
                    $(this).find(".imgs").css("width", "2rem")
                }
                $(this).find(".imgs li").each(function() {
                    $(this).children('img')[0].onload = () => {
                        let width = $(this).children('img')[0].width;
                        let height = $(this).children('img')[0].height;
                        let liWidth = $(this).width(); //li的宽度=高度
                        if (width / height > 1) {
                            let diff = (width - height) / 2; //单边差距
                            let scale = height / liWidth; //比例
                            $(this).children('img').css('height', liWidth);
                            $(this).children('img').css('width', width / scale);
                            $(this).children('img').css("margin-left", -(diff / scale) + "px");
                        } else {
                            let diff = (height - width) / 2; //单边差距
                            let scale = width / liWidth; //比例
                            $(this).children('img').css('height', height / scale);
                            $(this).children('img').css('width', liWidth);
                            $(this).children('img').css("margin-top", -(diff / scale) + "px");
                        }
                    }
                });
            }
        } else {
            console.log("没有pics");
        }

    });

}
// 切换全文 收起
$("#content").on("click", ".more", function() {
    if ($(this).prev().hasClass("txt-hide")) {
        $(this).prev().removeClass("txt-hide");
        $(this).text("收起");
    } else {
        $(this).prev().addClass("txt-hide");
        $(this).text("全文");
    }
});
$(document.body).pullToRefresh(function() {
    // 下拉刷新触发时执行的操作放这里。
    // 从 v1.1.2 版本才支持回调函数，之前的版本只能通过事件监听
    $(document.body).pullToRefreshDone();

});
//点击图片
$("#content").on("click", ".imgs li", function() {
    //本张图片
    let now = $(this).children("img")[0];
    // console.log($(now).attr('src'));
    //所有兄弟图片
    let imgs = $(this).parent().find("img");
    let items = [];
    let index;
    for (let i = 0; i < imgs.length; i++) {
        items.push($(imgs[i]).attr('src'));
        if ($(imgs[i]).attr('src') == $(now).attr('src')) {
            index = i;
        }
    }
    // console.log(items)
    var pb = $.photoBrowser({
        items: items,
        initIndex: index
    });
    pb.open(); //打开
});

//滚动到底部加载
var loading = false; //状态标记
$(document.body).infinite().on("infinite", function() {
    if (loading) return;
    loading = true;
    page++;
    console.log(page);

    getMessages(page);
    setImgsSize(page);
});