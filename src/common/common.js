class common {
  // 防抖函数
  debounce(fn, wait) {
    var timeout = null;
    return function () {
      var that = this,
        args = arguments;
        console.log(args)
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply(that, args);
      }, wait);
    };
  }
}

export default {
  common: new common
}
