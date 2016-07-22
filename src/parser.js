/**
* @Author: Zhang Yingya(hzzhangyingya) <zyy>
* @Date:   2016-07-22T19:20:17+08:00
* @Email:  zyy7259@gmail.com
* @Last modified by:   zyy
* @Last modified time: 2016-07-22T19:45:15+08:00
*/

var fs = require('fs-extra-promise')

function parseDeps (path, cnt) {
  console.log('parsing %s', path)
  // 解析 cnt 里面所有的引用
  return []
}

module.exports = function (path) {
  return fs.readFileAsync(path, 'utf8').then(function (cnt) {
    return parseDeps(path, cnt)
  })
}
