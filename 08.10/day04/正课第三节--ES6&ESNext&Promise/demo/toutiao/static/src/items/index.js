define(['./base', './single-pic', './multiple-pic'], function (base, singlePic, multiplePic) {

    // 自己写了个继承
    function inherit(originClass, superClass) {

        function mixedClass() {
            superClass.apply(this, arguments);
            originClass.apply(this, arguments);
        };

        originClass.__proto__ = superClass;
        mixedClass.__proto__ = originClass;
        mixedClass.prototype = Object.create(superClass.prototype);
        for (var i in originClass.prototype) {
            mixedClass.prototype[i] = originClass.prototype[i];
        }
        mixedClass.prototype.constructor = originClass;

        return mixedClass;
    }

    return {
        base: base,
        singlePic: inherit(singlePic, base),
        multiplePic: inherit(multiplePic, base)
    };

});
