/**
* @Author: Zhang Yingya(hzzhangyingya) <zyy>
* @Date:   2016-07-22T15:18:59+08:00
* @Email:  zyy7259@gmail.com
* @Last modified by:   zyy
* @Last modified time: 2016-07-22T17:50:30+08:00
*/

var fs = require('fs-extra-promise')
var util = require('util')

// 最大并发数
var Max_Thread_Num = 20

// 默认并发数
var Default_Thread_Num = 5

/**
 * 扫描 paths 后返回 map
 * @private
 * @param  {String[]} paths 路径数组
 * @param {Object} config 配置
 * @return {Promise}
 */
function Scanner (paths, config) {
  console.log('there are %d paths', paths.length)
  console.log(paths)

  this.paths = paths
  this.config = config

  // 依赖 map
  this.deps = {}

  // 解析并发数
  var threadNum = Default_Thread_Num
  if (util.isNumber(config.threadNum) && config.threadNum <= Max_Thread_Num) {
    threadNum = config.threadNum
  }
  console.log('threadNum %d', threadNum)

  // 每个并发数要解析的数量
  var numPerThread = Math.floor(paths.length / threadNum)
  console.log('numPerThread %d', numPerThread)

  var promiseArray = []
  // 任务分解
  var remainder = paths.length - numPerThread * threadNum
  var counter = 1
  while (counter <= threadNum) {
    var numToCut = numPerThread
    if (counter <= remainder) {
      numToCut = numPerThread + 1
    }
    console.log('cutting %d', numToCut)
    promiseArray.push(this.scanThread(paths.splice(0, numToCut)))
    counter++
  }
  return Promise.all(promiseArray).then(function () {
    return reverseDeps(deps)
  })
}

var pro = Scanner.prototype

pro.scanThread = function (paths) {
  console.log('scaning')
  console.log(paths)
  var self = this
  return paths.reduce(function (seq, path) {
    return seq.then(function () {
      return fs.readFileAsync(path, 'utf8')
    }).then(function (cnt) {
      self.parseDeps(path, cnt)
    })
  }, Promise.resolve())
}

pro.parseDeps = function (path, cnt) {
  console.log('parsing %s', path)
  // 解析 cnt 里面所有的引用，赋给 deps[path]
  this.deps[path] = []
}

function reverseDeps () {
  return deps
}

module.exports = Scanner
