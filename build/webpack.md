<!--
@Author: Yingya Zhang <zyy>
@Date:   2016-06-26 16:58:00
@Email:  zyy7259@gmail.com
@Last modified by:   zyy
@Last modified time: 2016-06-26 16:58:27
-->

// http://webpack.github.io/docs/build-performance.html

- Only use optimization plugins in production builds. https://webpack.github.io/docs/optimization.html
  - OccurrenceOrderPlugin: Webpack can vary the distribution of the ids to get the smallest id length for often used ids. The entry chunks have higher priority for file size.
	 - UglifyJsPlugin: minimize your scripts https://github.com/mishoo/UglifyJS2#usage
    - UglifyJS will warn about the condition being always false and about dropping unreachable code; for now there is no option to turn off only this specific warning, you can pass warnings=false to turn off all warnings.
    - The UglifyJsPlugin uses SourceMaps to map errors to source code. And SourceMaps are slow.
    - DedupePlugin: If you use some libraries with cool dependency trees, it may occur that some files are identical. Webpack can find these files and deduplicate them. This feature adds some overhead to the entry chunk.
    - LimitChunkCountPlugin: Limit the chunk count to a defined value. Chunks are merged until it fits.
    - MinChunkSizePlugin: Merge small chunks that are lower than this min size (in chars). An ASCII character in 8-bit ASCII encoding is 8 bits (1 byte).
- TODO
  - optimization
    - Single-Page-App
    - Multi-Page-App
      - https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points
      - https://github.com/webpack/webpack/tree/master/examples/multiple-commons-chunks
    - DYNAMIC LINKED LIBRARY
  - build-performance
    - prefetch
  - 除了 /src/js 之外的其他 JS 如何 watch 并 lint
  - hash 在 publish 的时候生成 hash
  - HtmlWebpackPlugin https://github.com/ampedandwired/html-webpack-plugin
