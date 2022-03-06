export default class Socket {
  constructor(params) {
    this.sockets = null;
    this.heartTimer = null;
    this.initWebSocket(params);
  }
  initWebSocket({ bankCode, uuid, deviceType }) {
    const WSURL = `ws://219.234.0.216:8889/netand_incp/device_socket/${bankCode}/${uuid}/${deviceType}`;
    this.sockets = new WebSocket(WSURL);
    // return this.sockets;
    // // 链接成功时触发
    // this.sockets.onopen = function (e) {
    //   console.log("onopen", e);
    // };
    // // 服务端 => 客户端 发送消息
    // this.sockets.onmessage = function (e) {
    //   console.log("msg:  ", e.data);
    // };
    // // 连接关闭时触发
    // this.sockets.onclose = function (event) {
    //   console.log("onclose");
    //   console.log(
    //     `as clean? ${event.wasClean} Code=${event.code} Reason=${event.reason}`
    //   );
    // };
    // // 连接发生错误
    // this.sockets.onerror = function (e) {
    //   console.log("onerror: ", e);
    // };
  }
  // 心跳💗
  heart(isStart, { msgType, interval = 3000 }) {
    if (isStart) {
      this.heartTimer = setInterval(() => {
        this.sockets.send(JSON.stringify({ msgType }));
      }, interval);
    } else {
      if (this.heartTimer) {
        clearInterval(this.heartTimer);
      }
    }
  }
}
