/**
* @Author: Zhang Yingya(hzzhangyingya) <zyy>
* @Date:   2016-07-22T13:50:42+08:00
* @Email:  zyy7259@gmail.com
* @Last modified by:   zyy
* @Last modified time: 2016-07-22T19:44:54+08:00
*/

var argv = require('yargs')
  .usage('Usage: $0 [options]')
  .config()
  .option('context', {
    describe: 'The base directory for resolving the `pattern` (absolute or relative; if relative, relative to process.cwd())'
  })
  .option('pattern', {
    describe: 'minimatch pattern',
    required: true
  })
  .check(function (parsedArgv, aliasMap) {
    if (!parsedArgv.pattern) {
      throw 'Missing required config "pattern"'
    }
    return true
  })
  .example('$0 --config config.json', 'read JSON config file')
  .example('$0 --pattern *', 'command line arguments')
  .argv

// console.log(argv)

// normalize pattern to array
var pattern = argv.pattern
if (!Array.isArray(pattern)) {
  pattern = [pattern]
}

// join context and pattern
var path = require('path')
var context = argv.context
if (context) {
  context = path.resolve(process.cwd(), context)
  pattern = pattern.map(function (item) {
    if (item === '*') {
      return path.join(context, '/**/*')
    } else {
      var index = 0
      var prefix = ''
      if (item.indexOf('!') === 0) {
        index = 1
        prefix = '!'
      }
      return prefix + path.join(context, item.slice(index))
    }
  })
}

// console.log(pattern)

var globby = require('globby')
var Scanner = require('./src/scanner')
var parser = require('./src/parser')
var reverser = require('./src/reverser')
globby(pattern).then(function (paths) {
  // console.log(paths)
  var scanner = new Scanner({
    paths: paths,
    config: argv,
    parser: parser
  })
  scanner.on('end', function (depMap) {
    var affectMap = reverser(depMap)
    console.log('resulting affectMap')
    console.log(affectMap)
  }).on('error', function (error) {

  })
})
