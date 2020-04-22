/**
 * 工具类
 */
module.exports = {
  /**
   * 对象转URL
   */
  urlEncode(urlStr) {
    if (typeof urlStr == "undefined") {
             var url = decodeURI(location.search); 
       } else {
           var url = "?" + urlStr.split("?")[1];
    }
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
         var str = url.substr(1);
         var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
             theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
         }
     }
     return theRequest;
 }
};
