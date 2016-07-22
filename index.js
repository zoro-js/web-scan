/**
* @Author: Zhang Yingya(hzzhangyingya) <zyy>
* @Date:   2016-07-22T13:50:42+08:00
* @Email:  zyy7259@gmail.com
* @Last modified by:   zyy
* @Last modified time: 2016-07-22T14:00:49+08:00
*/

var argv = require('yargs')
  .config()
  .check(function (parsedArgv, aliasMap) {
    if (!parsedArgv.pattern) {
      throw 'Missing required config "pattern"'
    }
    return true
  })
  .argv

var globby = require('globby')
globby(argv.pattern).then(function (paths) {
  console.log(paths)
})
