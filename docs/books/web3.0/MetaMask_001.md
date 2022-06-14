## 我们将使用MetaMask完整地实现 eth 小费收取的应用

```js
// 假设你要收取以太币消费
const yourAddress = '0x0c54FcCd2e384b4BB6f2E405Bf5Cbc15a017AaFb'
const value = '0xde0b6b3a7640000' // 16进制表示的以太币数量，单位：wei
const desiredNetwork = '1' // '1' 表示以太坊主网

//检测当前浏览器是否以太坊兼容，并进行相应的处理
if (!window.ethereum) {

  alert("Please install MetaMask.");

} else {

  //如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
  ethereum.enable()

  //如果用户拒绝了登录请求
  .catch(function (reason) {
    if (reason === 'User rejected provider access') {
      // 用户不想登录
    } else {
      // 本不该执行到这里，但是真到这里了，说明发生了意外
      alert('There was an issue signing you in.')
    }
  })

  //如果用户同意了登录请求，你就可以拿到用户的账号
  .then(function (accounts) {

    //然后开始验证用户接入正确的网络
    if (ethereum.networkVersion !== desiredNetwork) {
      alert('This application requires the main network, please switch it in your MetaMask UI.')

    }

    //一旦获取了用户账号，你就可以签名交易
    const account = accounts[0]
    sendEtherFrom(account, function (err, transaction) {
      if (err) {
        return alert(`Sorry you weren't able to contribute!`)
      }

      alert('Thanks for your successful contribution!')
    })

  })
}

function sendEtherFrom (account, callback) {

  //在这里我们要使用底层API
  const method = 'eth_sendTransaction'
  const parameters = [{
    from: account,
    to: yourAddress,
    value: value,
  }]
  const from = account

  //现在把所有数据整合为一个RPC请求
  const payload = {
    method: method,
    params: parameters,
    from: from,
  }

  //需要用户授权的方法，类似于这个，都会弹出一个对话框提醒用户交互
  //其他方法，例如只是读取区块链的数据，可能就不会弹框提醒

  // ethereum.sendAsync()方法采用异步形式向web3浏览器发送消息,消息格式与以太坊JSON-RPC API的格式向对应，
  // RPC API的响应结果在回调函数 中获得。
  ethereum.sendAsync(payload, function (err, response) {
    const rejected = 'User denied transaction signature.'
    if (response.error && response.error.message.includes(rejected)) {
      return alert(`We can't take your money without your permission.`)
    }
    if (err) {
      return alert('There was an issue, please try again.')
    }

    if (response.result) {
      //如果存在response.result，那么调用就是成功的
      //在这种情况下，它就是交易哈希
      const txHash = response.result
      alert('Thank you for your generosity!')

      //你可以轮询区块链来查看交易何时被打包进区块
      pollForCompletion(txHash, callback)
    }
    })
}

function pollForCompletion (txHash, callback) {
  let calledBack = false

  //正常情况下，以太坊区块大约15秒钟出一块
  //这里我们每隔2秒钟轮询一次
  const checkInterval = setInterval(function () {

    const notYet = 'response has no error or result'
    ethereum.sendAsync({
      method: 'eth_getTransactionByHash',
      params: [ txHash ],
    }, function (err, response) {
      if (calledBack) return
      if (err || response.error) {
        if (err.message.includes(notYet)) {
          return 'transaction is not yet mined'
        }

        callback(err || response.error)
      }
      
      //我们已经成功地验证了打包入块的交易
      //提醒一下，我们应当在服务端使用我们的区块链连接进行验证
      //在客户端做的话，就意味着我们信任用户的区块链连接
      const transaction = response.result
      clearInterval(checkInterval)
      calledBack = true
      callback(null, transaction)
    })
  }, 2000)
}

```