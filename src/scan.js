/**
* @Author: Zhang Yingya(hzzhangyingya) <zyy>
* @Date:   2016-07-22T15:18:59+08:00
* @Email:  zyy7259@gmail.com
* @Last modified by:   zyy
* @Last modified time: 2016-07-22T16:00:44+08:00
*/

var fs = require('fs-extra-promise')

/**
 * 扫描 paths 后返回 map
 * @private
 * @param  {String[]} paths 路径数组
 * @param {Object} config 配置
 * @return {Promise}
 */
var scan = function (paths, config) {
  console.log(config)
  return fs.readFileAsync(paths[0], 'utf8').then(function (cnt) {
    // console.log(cnt)
    return {
      'index.js': ['/index'],
      'a.js': ['/index', '/feed']
    }
  })
}

module.exports = scan
