/**
* @Author: Zhang Yingya(hzzhangyingya) <zyy>
* @Date:   2016-07-22T15:18:59+08:00
* @Email:  zyy7259@gmail.com
* @Last modified by:   zyy
* @Last modified time: 2016-07-22T19:45:07+08:00
*/

var EventEmitter = require('wolfy87-eventemitter')
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
function Scanner (options) {
  var self = this

  var paths = options.paths
  var config = options.config
  console.log('there are %d paths', paths.length)
  console.log(paths)

  self.paths = paths
  self.config = config
  self.parser = options.parser

  // 依赖 map
  self.depMap = {}

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
    promiseArray.push(self.scanThread(paths.splice(0, numToCut)))
    counter++
  }
  Promise.all(promiseArray).then(function () {
    self.emit('end', self.depMap)
    return self.depMap
  }, function (error) {
    self.emit('error', error)
  })
}

var pro = Scanner.prototype = Object.create(EventEmitter.prototype)

console.log(pro.getListeners)

pro.scanThread = function (paths) {
  console.log('scaning')
  console.log(paths)
  var self = this
  return paths.reduce(function (seq, path) {
    return seq
    .then(self.parser.bind(null, path))
    .then(function (depMap) {
      self.depMap[path] = depMap
    })
  }, Promise.resolve())
}

module.exports = Scanner
