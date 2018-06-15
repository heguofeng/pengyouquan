window.onload = function() {
    getMessages(page);
    $("#publish").css("top", $(window).height() + "px");
    $("#publish").height($(window).height());
}

let page = 0; //从多少开始渲染
let pageNums = 10;

function getMessages(page) {
    // console.log(page)
    $.ajax({
        type: "get",
        // url: "https://www.easy-mock.com/mock/5b0f64deb0c1263f2ec2237d/pyq/pyq", //待写
        url: "http://work.zjqq.mobi/farmer/get-friend-data",
        data: {
            page: page,
            pageNums: pageNums,
            type: 1
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
                    $("#content .content_ul").append(`<li class = "item"> <div class = "item-avatar"> <img src = "${data[i].avatar}" alt = "头像" > </div> <div class = "item-content" > <p class = "title" > ${data[i].title} </p> <div class = "txt" > ${getFormatCode(data[i].txt)} </div> <div class = "more" > <span > 全文 </span></div ><div class="imgs-box"></div><p class = "time" > ${data[i].time}</p> </div> </li> `);
                    //这里很关键，需要加上分页的值
                    // console.log("现在是", i + (pageNums * page))
                    let box = $("#content .content_ul .imgs-box").eq(i + (pageNums * page));
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

//  1 4 9三种不同的情况设置图片尺寸
function setImgsSize(page) {
    $(".item").slice(page * pageNums).each(function() {
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
    $("#content .content_ul").empty();
    getMessages(0);
    $(document.body).pullToRefreshDone();

});
//点击图片放大
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


/* ----------------------------------------------朋友圈功能----------------------------------------------------- */
var formData = new FormData();
var formDataFaker = [];
/*  取消 */
$("#cancel").on("click", function() {
    $.confirm({
        title: '确定退出？',
        text: '退出后不保存任何编辑数据',
        onOK: function() {
            formData.delete('images')
            formData.delete('content')
            formDataFaker = [];
            console.log(formDataFaker)
            console.log(formData)
            $("#publish").animate({
                    'top': $(window).height()
                },
                function() {
                    $("#publish").hide();
                    // 清空发表页面
                    $("#uploaderFiles").empty();
                    $("#shuoshuo").val("");
                });
            $('html,body').css('overflow', '');
        },
        onCancel: function() {}
    });

});

/* 上传图片 */
$(function() {
    $gallery = $("#gallery"),
        $galleryImg = $("#galleryImg"),
        $uploaderInput = $("#uploaderInput"),
        $uploaderFiles = $("#uploaderFiles");


    // 允许上传的图片类型  
    var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    // 1024*2KB，也就是 2MB  
    var maxSize = 2048 * 1024;
    // 图片最大宽度  
    var maxWidth = 10000;
    // 最大上传图片数量  
    var maxCount = 9;
    // 声明承诺
    let p = [];
    /*  发布 */
    $("#camera").on("click", function() {
        counts();
        $("#publish").show();
        $("#publish").animate({
            'top': 0
        });
        $('body').css({
            "height": "100%"
        });
        $('html').css("height", "100%");
        $('html,body').css('overflow', 'hidden');
    });
    /* 控制添加图片按钮的显示 */
    function counts() {
        var num = $('.weui-uploader__file').length;
        $('.weui-uploader__info').text(num + '/' + maxCount); //多少张图片
        if ($('.weui-uploader__file').length >= maxCount) {
            $(".weui-uploader__input-box").css("display", "none");
            return false;
        } else if ($('.weui-uploader__file').length < maxCount) {
            $(".weui-uploader__input-box").css("display", "block")
        }
    }

    let orient;
    /* 选完图片后的事件 */
    $('#uploaderInput').on('change', function(event) {
        // 检查ios拍照是否 旋转bug  ===6
        EXIF.getData(event.target.files[0], function() {
            // console.log(EXIF.getTag(this, "Orientation"));
            // console.log(EXIF.getAllTags(this).Orientation);
            orient = EXIF.getAllTags(this).Orientation
        });

        var files = event.target.files;
        console.log(files)
        let totalCounts = parseInt($('.weui-uploader__file').length + files.length);
        if ((totalCounts) > maxCount) {
            $.alert("最多上传九张图片");
        } else {
            // console.log(totalCounts)
            if (totalCounts === 9) {
                $(".weui-uploader__input-box").css("display", "none");
            } else {
                $(".weui-uploader__input-box").css("display", "block")
            }
            //console.log(files);return false;
            // 如果没有选中文件，直接返回  
            if (files.length === 0) {
                return;
            }
            for (var i = 0, len = files.length; i < len; i++) {
                var file = files[i];
                var reader = new FileReader();
                console.log(file)
                    // 如果类型不在允许的类型范围内  
                if (allowTypes.indexOf(file.type) === -1) {
                    $.alert("该类型不允许上传！", "警告！");
                    continue;
                }
                if (file.size > maxSize) {
                    //$.weui.alert({text: '图片太大，不允许上传'});
                    $.alert("图片太大，不允许上传", "警告！");
                    continue;
                }
                // p[i] = new Promise((resolve, reject) => {
                /* 将文件读取为 DataURL */
                reader.readAsDataURL(file);
                // 文件读取成功完成时触发
                reader.onload = function(e) {
                    // console.log(e);
                    var img = new Image();
                    img.src = e.target.result;

                    img.onload = function() {
                        // 不要超出最大宽度  
                        var w = Math.min(maxWidth, img.width);
                        // 高度按比例计算  
                        var h = img.height * (w / img.width);
                        var canvas = document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        // 设置 canvas 的宽度和高度  
                        canvas.width = w;
                        canvas.height = h;
                        //如果图片方向等于6 ，则旋转矫正，反之则不做处理
                        if (orient == 6) {
                            canvas.width = h;
                            canvas.height = w;
                            ctx.rotate(Math.PI / 2);
                            ctx.drawImage(img, 0, -h, w, h);
                        } else {
                            ctx.drawImage(img, 0, 0, w, h);
                        }
                        // ctx.drawImage(img, 0, 0, w, h);　　　　　　　　　　　　
                        var base64 = canvas.toDataURL('image/jpeg', 0.8);
                        //console.log(base64);
                        // 插入到预览区  
                        var $preview = $('<li class="weui-uploader__file weui-uploader__file_status" style="background-image:url(' + base64 + ')"><div class="weui-uploader__file-content">0%</div></li>');
                        $('#uploaderFiles').append($preview);
                        var num = $('.weui-uploader__file').length;
                        $('.weui-uploader__info').text(num + '/' + maxCount); //多少张图片

                        var progress = 0;

                        function uploading() {
                            $preview.find('.weui-uploader__file-content').text(++progress + '%');
                            if (progress < 100) {
                                setTimeout(uploading, 10);
                            } else {
                                // 如果是失败，塞一个失败图标
                                //$preview.find('.weui_uploader_status_content').html('<i class="weui_icon_warn"></i>');
                                $preview.removeClass('weui-uploader__file_status').find('.weui-uploader__file-content').remove();
                            }
                        }
                        setTimeout(uploading, 30);
                        // resolve(base64);
                        formDataFaker.push(base64);
                    };
                };
                // })
            }
            // Promise.all(p).then((res) => {
            //     console.log(res);

            // }).catch((reason) => {
            //     console.log(reason);

            // })
        }
    });

    var index; //第几张图片  

    /* 点击放大图片 */
    $uploaderFiles.on("click", "li", function() {
        index = $(this).index();
        $galleryImg.attr("style", this.getAttribute("style"));
        $gallery.fadeIn(100);

    });
    $gallery.on("click", function() {
        $gallery.fadeOut(100);
    });

    //删除图片  
    $(".weui-gallery__del").click(function() {
        console.log(index)
        $uploaderFiles.find("li").eq(index).remove();
        formDataFaker.splice(index, 1);
        counts();
    });


    /* 发表朋友圈 */
    $("#express").click(function() {
        //如果有原先数据，先删除
        formData.delete("images")
        formData.delete("content")
            // 此处填写ajax的data
        for (let i = 0; i < formDataFaker.length; i++) {
            formData.append("images[]", formDataFaker[i]);
        }
        formData.append("content", $("#shuoshuo").val());

        // console.log($("#shuoshuo").val())
        console.log(formData)
        $.ajax({
            url: "savetofile.php", //待写
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                $.toast("发布成功", function() {

                    $("#publish").animate({
                            'top': $(window).height()
                        },
                        function() {
                            $("#publish").hide();
                        });
                    $('html,body').css('overflow', '');
                    $("#content .content_ul").empty();
                    // 清空发表页面
                    $("#uploaderFiles").empty();
                    $("#shuoshuo").val("");
                    getMessages(0);
                });
            },
            error: function(xhr, type) {
                alert('Ajax error!')
            }
        });
    })
});

//正则替换空格和换行
var getFormatCode = function(strValue) {
    return strValue.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
}