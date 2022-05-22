# React应用的性能优化方案

::: tip
以下内容包括：编译阶段的优化，路由切换优化，更新阶段优化，大数据渲染优化，React应用卡顿排查思路
:::

## 1、编译阶段的优化
- webpack开发环境时重复构建更快：
   - 1、include 缩小编译范围
   - 2、resolve 设置查找范围
   - 3、alias 设置别名
   - 4、external （引用外部模块）
   - 5、编译缓存（babel开启cacheDirectory, webpack 可开启cache:memory）
   - 6、开启多进程(用TerserPlugin压缩JS，用OptimizeCSSAssetsPlugin压缩CSS)

- 生产环境时文件更小，加载更快：
   - 1、开启tree-sharking
   - 2、scope-hosting
   - 3、splitChunks(代码分割)
   - 4、提供node的空mocks
   - 5、持久化缓存

## 2、路由切换优化
   - 1、React.Suspense 和  React.lazy懒加载模块
   - 2、在React.lazy引入模块的适合，在import时，使用模板注释时使用prefetch为true，模块就会在空闲的时加载。

## 3、更新阶段优化
   - 使用shouldComponentUpdate，PureComponent和memo，还有immutable（Map，Set, List）
   - Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象
   - PureComponent 会有一个属性浅比较
   - React.memo 缓存函数组件
   - react-router-dom有useSelector缓存中间映射结果
   - react-redux：每个组件都会从总的状态对象获取一部分属性，只要这个组件需要的属性没更新，这个组件就不需要刷新。
## 4、大数据渲染优化
   - 1、时间分片timeSlice
		使用requestAnimationFrame
		也可以使用requestIdleCallback
			react fiber自己实现了一套基于messageChannel实现
   - 2、虚拟列表
		确定总内容高度，在知道每个item的高度
		类似分页功能，只是我们要去计算
		具体实现
     - 1、最外层设置overflow:aouto,wilChange:transform,还有宽高，再设置position为relative
     - 2、在内层固定每个列表元素的宽高，position为absolute，然后根据item的高度和索引动态更改top属性

## 其它性能优化
 - React hooks性能优化(	react.memo, react.useMemo,react.useCallback)
 - 响应式数据的精细化渲染(单元渲染)
 - 通过DOM-DIFF原理进行性能优化
 - Error Boundaries
 - 骨架屏
 - 预渲染
 - 图片懒加载

## React应用卡顿排查思路

使用 Performance 录制应用快照，查看调用情况
查看network中网络请求情况，是否有资源因过大请求阻塞，导致后续资源无法加载，这种情况一般选择分包或固定资源选择cdn分担（多域名。浏览器设置的http2.0以下同域名仅允许同时最多6个tcp的限制）
可以通过 React Developer Tools 的 Profiler 的 Flamegraph（火焰图）或 Ranked（渲染时长排行榜） 查看各组件的渲染时长，根据对应的组件可以进行排查渲染问题，以下：
- a). 通过检查代码中是否有重复触发的 useEffect
- b). 检查是否有多次不同渲染周期中触发的setState导致的渲染（比如在一个事件中导致的state更新，导致依赖于该state的useEffect触发，而该effect中又有其他的setState，导致多个有依赖项的useEffect不同批次连环触发）
- c). 检查是否在某个超大组件中需要渲染的元素过多，可使用子组件可考虑使用 pureComponent，或 React.mome ，或使用useMome来根据依赖项更新子组件，或在父组件中将子组件需要的props通过使用useMome或useCallback缓存， 或在子组件中使用 shouldComponentUpdate 中校验是否需要更新来减少更新
- d). 检查是否存在拖拽业务，这类业务一般会导致大量的diff存在，可以的话可以考虑不使用React的方式去实现，使用第三方非React的JS库去实现。
- e). 同上情况，存在大量增删改查逻辑，会导致大量的的diff可以检查列表元素是否存在唯一的key，通过key可以让React复用Fiber从而避免重复创建 Fiber节点与 Dom 节点
- f). 存在未清除掉的定时器或dom监听事件
