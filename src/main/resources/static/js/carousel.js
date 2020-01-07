//书籍列表前5页轮播
$(function () {
    var i = 1,
        count =  (HB.activity.count!=undefined)? HB.activity.count : 12,
        // limit =  ( HB.activity.pagenum < 5) ? HB.activity.pagenum : 5,
        timer;

    clearInterval(timer);
    timer = setInterval(function () {
        i += 1;
        if (i > (( HB.activity.pagenum < 5) ? HB.activity.pagenum : 5)) {
            i = 1;
        }
        change_book_page(i, HB.activity.type, 2,0,0,count);
    },10000);
    $(document).on("click", ".J_BookList .pages li a", function () {
        var page = parseInt($(this).attr("data-ci-pagination-page"));
        if (!isNaN(page)) {
            clearInterval(timer);
            if (i > (( HB.activity.pagenum < 5) ? HB.activity.pagenum : 5)) {
                i = page;
                timer = setInterval(function () {
                    i += 1;
                    if (i > (( HB.activity.pagenum < 5) ? HB.activity.pagenum : 5)) {
                        i = 1;
                    }
                    change_book_page(i, HB.activity.type, 2,0,0,count);

                },10000);
            }
        }
    });
});