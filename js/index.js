window.onload = function() {
    getMessages(page);
}
let _fontSize;
let page = 0; //从多少开始渲染
function getMessages(page) {
    // console.log(page)
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
            // console.log(data);
            let Promise1 = []; //每个人的异步
            for (let i = 0; i < data.length; i++) {
                let imgsA = data[i].imgs;
                Promise1[i] = new Promise((resolve, reject) => {
                    let ul = document.createElement("ul");
                    ul.className = "imgs";
                    let imgsArr = [];
                    let PromiseALl = []; //每个人所有图片异步操作
                    $("#content .content_ul").append(`<li class = "item"> <div class = "item-avatar"> <img src = "${data[i].avatar}" alt = "头像" > </div> <div class = "item-content" > <p class = "title" > ${data[i].title} </p> <div class = "txt" > ${data[i].txt} </div> <div class = "more" > <span > 全文 </span></div ><div class="imgs-box"></div><p class = "time" > ${data[i].time}</p> </div> </li> `);
                    //这里很关键，需要加上分页的值
                    // console.log("现在是", i + (10 * page))
                    let box = $("#content .content_ul .imgs-box").eq(i + (10 * page));
                    for (let j = 0; j < imgsA.length; j++) {
                        let imgsNums = imgsA.length;
                        // console.log(imgsNums)
                        PromiseALl[j] = new Promise((resolve, reject) => {
                            imgsArr[j] = new Image();
                            imgsArr[j].addEventListener('load', function() {
                                let li = document.createElement("li");
                                li.append(imgsArr[j]);
                                if (imgsNums == 1) {
                                    let width = this.width;
                                    let height = this.height;
                                    let liWidth = 1.8 * _fontSize;
                                    let liHeight = 1.8 * _fontSize;
                                    if (width / height > 1) {
                                        let scale = width / liWidth; //比例
                                        $(this).css('height', height / scale);
                                        $(this).css('width', liWidth);
                                    } else {
                                        let scale = height / liWidth; //比例
                                        $(this).css('height', liHeight);
                                        $(this).css('width', width / scale);
                                    }

                                } else {
                                    li.className = "item-imgs";
                                    if (imgsNums == 4) {
                                        $(ul).css("width", "2rem");
                                    }
                                    let width = this.width;
                                    let height = this.height;
                                    let liWidth = 0.8 * _fontSize;
                                    let liHeight = 0.8 * _fontSize;
                                    if (width / height > 1) {
                                        let diff = (width - height) / 2; //单边差距
                                        let scale = height / liWidth; //比例
                                        $(this).css('height', liHeight);
                                        $(this).css('width', width / scale);
                                        $(this).css("margin-left", -(diff / scale) + "px");
                                    } else {
                                        let diff = (height - width) / 2; //单边差距
                                        let scale = width / liWidth; //比例
                                        $(this).css('height', height / scale);
                                        $(this).css('width', liWidth);
                                        $(this).css("margin-top", -(diff / scale) + "px");
                                    }
                                }
                                ul.append(li);
                                resolve(1);
                            }, false)
                            imgsArr[j].src = imgsA[j];
                        })
                    }
                    Promise.all(PromiseALl).then(() => {
                        box.html(ul);
                    });
                    resolve();
                });
            }
            Promise.all(Promise1).then(() => {
                loading = false;
                setImgsSize(page);
            });

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
    $(".item").slice(0 * 10).each(function() {
        let lines = parseInt($(this).find('.txt').css("height")) / parseInt($(this).find('.txt').css('line-height'));
        // console.log(lines)
        //如果小于6行文字
        if (lines <= 6) {
            $(this).find(".more").css("display", "none");
        } else {
            $(this).find('.txt').addClass("txt-hide");
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
    $("#content .content_ul").empty()
    getMessages(0);
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
    // setImgsSize()
});