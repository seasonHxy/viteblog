# EventLoop 问题分解

::: tip
以下内容包括：进程，线程，浏览器进程，浏览器EventLoop，Node EventLoop.
:::

## 进程，线程
### 线程 问题
- 线程是 CPU调度的最小单位
- 一个进程可以包括多个线程，这些线程共享这个进程的资源
### 进程 问题
- 1、CPU承担了所有的计算任务，进程是CPU资源分配的最小单位
- 2、在同一个时间内，单个CPU只能执行一个任务，只能运行一个进程
- 3、如果有一个进程正在执行，其它进程就得暂停
- 4、CPU使用了时间片轮转的算法实现多进程的调度

## chrome浏览器进程 包括哪些进程？
- 浏览器是多进程的
- 每一个TAB页就是一个进程
- 1、浏览器主进程（控制其它子进程的创建和销毁，浏览器界面显示，比如用户交互、前进、后退等操作，将渲染的内容绘制到用户界面上）
- 2、渲染进程（就是我们说的浏览器内核，负责页面的渲染、脚本执行、事件处理，每个TAB页都有一个渲染进程）
- 3、网络进程（处理网络请求、文件访问等操作）
- 4、GPU进程（用于3D绘制）
- 5、第三方插件进程

#### 渲染进程

- 1、GUI渲染线程（渲染、布局和绘制页面，当页面需要重绘和回流时，此线程就会执行，与JS引擎互斥）
- 2、JS引擎线程（负责解析执行JS脚本，只有一个JS引擎线程(单线程)，与GUI渲染线程互斥）
- 3、事件触发线程（用来控制事件循环(鼠标点击、setTimeout、Ajax等)，当事件满足触发条件时，把事件放入到JS引擎所有的执行队列中）
- 4、定时器触发线程（setInterval和setTimeout所在线程，定时任务并不是由JS引擎计时，而是由定时触发线程来计时的，计时完毕后会通知事件触发线程）
- 5、异步HTTP请求线程（浏览器有一个单独的线程处理AJAX请求，当请求完毕后，如果有回调函数，会通知事件触发线程）
## 浏览器EventLoop使用
![An image](/browser/browser_event_loop.png)

### 宏任务
- 页面的大部分任务是在主任务上执行的，比如下面这些都是宏任务
- 渲染事件(DOM解析、布局、绘制)， 用户交互(鼠标点击、页面缩放)，JavaScript脚本执行，网络请求，文件读写
- 宏任务会添加到消息到消息队列的尾部，当主线程执行到该消息的时候就会执行
- 每次从事件队列中获取一个事件回调并且放到执行栈中的就是一个宏任务，宏任务执行过程中不会执行其它内容
- 每次宏任务执行完毕后会进行GUI渲染线程的渲染，然后再执行下一个宏任务
- 宏任务: script（整体代码）, setTimeout, setInterval, setImmediate, I/O, UI rendering
- 宏任务颗粒度较大，不适合需要精确控制境的任务
- 宏任务是由宿主方控制的

### 微任务
- 宏任务结束后会进行渲染然后执行下一个宏任务
- 微任务是当前宏任务执行后立即执行的宏任务
- 当宏任务执行完，就到达了检查点,会先将执行期间所产生的所有微任务都执行完再去进行渲染
- 微任务是由V8引擎控制的，在创建全局执行上下文的时候，也会在V8引擎内部创建一个微任务队列
- 微任务: process.nextTick（Nodejs）, Promises, Object.observe, MutationObserver
#### promise：
 - 微任务队列会一次性清空
 - 微任务会先于渲染执行
 - 宏任务结束之后会先执行微任务 

#### MutationObserver #
- MutationObserver创建并返回一个新的 MutationObserver 它会在指定的DOM发生变化时被调用
MutationObserver采用了异步 + 微任务的方案
- 异步是为了提升同步操作带来的性能问题
- 微任务是为了解决实时响应的问题

## EventLoop实现
- JS 分为同步任务和异步任务
- 同步任务都在JS引擎线程上执行，形成一个执行栈
- 事件触发线程管理一个任务队列，异步任务触发条件达成，将回调事件放到任务队列中
- 执行栈中所有同步任务执行完毕，此时JS引擎线程空闲，系统会读取任务队列，将可运行的异步任务回调事件添加到执行栈中，开始执行
- setTimeout/setInterval JS引擎线程=>定时触发器线程=>事件触发线程=>事件队列
- Ajax JS引擎线程=>异步http请求线程=>事件触发线程=>事件队列

## requestAnimationFrame

- 由浏览器决定何时渲染会更高效
- 浏览器仅渲染到显示器能够达到的频率 1000ms/60=16ms
- 每个帧的开头包括样式计算、布局和绘制
- 如果某个任务执行时间过长，浏览器会推迟渲染
- 当在执行用户交互的任务时，将渲染任务的优先级调整到最高
- 渲染线程完成后将页面解析、定时器等任务优先级提升

![An image](/browser/browser_event_loop_requestAnimationFrame.jpg)

### requestAnimationFrame 问题
- requestAnimationFrame回调函数运行在处理CSS之前的绘制之前
- 执行任务阶段不考虑CSS变化，在真正渲染的时候才会看最后的结果
- getComputedStyle可以迫使浏览器更早的执行样式计算

#### requestAnimationFrame 演示
 ```js
<body>
    <div style="background: lightblue;width: 0;height: 20px;"></div>
    <button>走你</button>
    <script>
        /**
         * requestAnimationFrame(callback) 由浏览器专门为动画提供的API
         * cancelAnimationFrame(返回值) 清除动画
         * <16.7 丢帧
         * >16.7 跳跃 卡顿
         */
        const div = document.querySelector('div');
        const button = document.querySelector('button');
        let start;
        function progress() {
            div.style.width = div.offsetWidth + 1 + 'px';
            div.innerHTML = (div.offsetWidth) + '%';
            if (div.offsetWidth < 100)
                timer = requestAnimationFrame(progress);
            else
                console.log(Date.now() - start);
        }
        button.onclick = () => {
            div.style.width = 0;
            start = Date.now();
            requestAnimationFrame(progress);
        }
    </script>
</body>
 ```
## requestIdleCallback
- window.requestIdleCallback()方法将在浏览器的空闲时段内调用的函数排队
- 开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应
- 页面是一帧一帧绘制出来的，当每秒绘制的帧数（FPS）达到 60 时，页面是流畅的，小于这个值时，用户会感觉到卡顿
1s 60帧，所以每一帧分到的时间是 1000/60 ≈ 16 ms。所以我们书写代码时力求不让一帧的工作量超过 16ms


### requestIdleCallback 问题
![An image](/browser/browser_event_loop_farmeimage.png)
- 上面六个步骤完成后没超过 16 ms，说明时间有富余，此时就会执行 requestIdleCallback 里注册的任务
```js
var handle = window.requestIdleCallback(callback[, options])
```
- IdleDeadline
- callback：回调，即空闲时需要执行的任务，该回调函数接收一个IdleDeadline对象作为入参。其中IdleDeadline对象包含：
- didTimeout，布尔值，表示任务是否超时，结合 timeRemaining 使用
- timeRemaining()，表示当前帧剩余的时间，也可理解为留给任务的时间还有多少
- options：目前 options 只有一个参数
- timeout。表示超过这个时间后，如果任务还没执行，则强制执行，不必等待空闲
- requestIdleCallback发生在一帧的最后，此时页面布局已经完成，所以不建议在 requestIdleCallback 里再操作 DOM，这样会导致页面再次重绘,DOM 操作建议在 rAF 中进行

 ```js
 <body>
    <script>
        let task = () => {
            console.log('requestAnimationFrame');
        };

        requestIdleCallback(idleWork, { timeout: 2000 });
        // 任务队列
        const tasks = [
            () => {
                console.log("第一个任务");
                requestAnimationFrame(task);
            },
            () => {
                console.log("第二个任务");
                requestAnimationFrame(task);
            },
            () => {
                console.log("第三个任务");
                requestAnimationFrame(task);
            },
        ];

        function idleWork(deadline) {
            console.log('deadline.timeRemaining()', deadline.timeRemaining());
            while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && tasks.length > 0) {
                work();
            }

            if (tasks.length > 0)
                requestIdleCallback(idleWork);
        }

        function work() {
            tasks.shift()();
            console.log('执行任务');
        }
    </script>
</body>
 ```

## Node中的EventLoop
- Node.js采用V8作为js的解析引擎，而I/O处理方面使用了自己设计的libuv
- libuv是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的API
- 事件循环机制也是它里面的实现
- V8引擎解析JavaScript脚本并调用Node API libuv库负责Node API的执行。它将不同的任务分配给不同的线程,形成一个Event Loop（事件循环），以异步的方式将任务的执行结果返回给V8引擎
- V8引擎再将结果返回给用户

### libuv
- 同步执行全局的脚本
- 执行所有的微任务，先执行nextTick中的所有的任务，再执行其它微任务
- 开始执行宏任务，共有6个阶段，从第1个阶段开始，会执行每一个阶段所有的宏任务

### process.nextTick
nextTick独立于Event Loop,有自己的队列，每个阶段完成后如果存在nextTick队列会全部清空，优先级高于微任务

## nodejs 和 浏览器关于eventLoop的主要区别

两者最主要的区别在于浏览器中的微任务是在每个相应的宏任务中执行的，而nodejs中的微任务是在不同阶段之间执行的。
