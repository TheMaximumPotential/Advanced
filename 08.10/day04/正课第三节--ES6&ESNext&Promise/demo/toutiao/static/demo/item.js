/**
 * @file 渲染单条组件
 */

function request(params, callback) {
    var requestParams = {
            method: params.method || 'GET',
        };

    if (requestParams.method.toUpperCase() === 'POST') {
        requestParams['body'] = JSON.stringify(params.data || {});
    }

    return fetch(
            params.url,
            requestParams
        )
        .then(res => res.json())
        .then(res => {
            callback && callback(res);
        });
}

function render(data) {
    // data.imageList[0] = '';
    var imageList = data.imageList.map(image => {
            image = image || 'http://s3b.pstatp.com/growth/mobile_list/image/toutiaoicon_loading_textpage@3x_f7c130ce.png';

            return `<img src=${image} />`;
        }).join('');

    return `<div class="item multiple-image" on:click="aa">
        <h3>
            ${data.title}
        </h3>
        <div class="image-list">
            ${imageList}
        </div>
        ${render.close || ''}
    </div>`;
}

request({
    url: 'http://localhost:8099/list'
}, function (res) {
    var item = res.data[0].data;
    var HTMLstr = render(item);
    var $container = document.getElementById('container');
    $container.innerHTML = HTMLstr;
});
