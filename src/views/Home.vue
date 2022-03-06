<template>
  <div class="home" id="home" ref="home" @click="Fullscreen">
    <div id="mse" ref="mse" style="width: 100%; height: 100vh"></div>
  </div>
</template>

<script>
import Player from "xgplayer";
import Socket from "../utils/socket";
// function launchFullscreen(element) {
//   try {
//     if (element.requestFullscreen) {
//       element.requestFullscreen();
//     } else if (element.mozRequestFullScreen) {
//       element.mozRequestFullScreen();
//     } else if (element.msRequestFullscreen) {
//       element.msRequestFullscreen();
//     } else if (element.webkitRequestFullscreen) {
//       element.webkitRequestFullScreen();
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
export default {
  name: "Home",
  data() {
    return {
      Player: null,
      params: {
        bankCode: "INCP88336364",
        uuid: "INCP883363646201",
        deviceType: "62",
      },
      $Socket: null,
      videoUrl: "",
      videoUrllist: [],
    };
  },

  methods: {
    /**
     *
     * @description 自动播放
     */
    autoplay() {
      this.Player.play();
    },
    /**
     * @param ${string|number} 当前时间
     * @description 设置当前播放时间
     */
    currentTime(currentTime = 0) {
      this.Player.currentTime = currentTime;
    },
    /**
     *
     * @description 暂停
     */
    pause() {
      this.Player.pause();
    },
    /**
     *
     * @description 全屏
     */
    Fullscreen() {
      console.log(this.Player.fullscreen);
      console.log(this.Player);
      // 是否是全屏
      if (!this.Player.fullscreen) {
        this.Player.getFullscreen(this.Player.root);
      }
    },
    /**
     *
     * @description 重播
     */
    replay() {
      this.Player.replay();
    },

    /**
     *
     * @description 切换视频源
     */
    changeSrc(url) {
      if (url.indexOf(",") > 0) {
        this.videoUrllist = [];
        this.videoUrllist = url.split(",");
        this.videoUrl = this.videoUrllist[0];
        this.$set(this.Player.config.playNext, "urlList", this.videoUrllist);
      } else {
        this.videoUrl = url;
      }

      this.pause();
      this.Player.src = this.videoUrl;
      console.log("changeSrc", this.Player.currentSrc);
      console.log("changeSrc", this.Player);
    },

    /**
     * @description 初始化 视频组件
     */
    init() {
      let { videoUrllist } = this;
      let _this = this;
      _this.Player = new Player({
        id: "mse",
        url: require("../assets/video/movie.mp4"),
        autoplay: true,
        videoInit: true,
        fullscreen: true,
        muted: "muted",
        // defaultMuted: true,
        // rotateFullscreen: true,
        fluid: true,
        playNext: {
          urlList: videoUrllist,
        },
      });

      // 组件加载完成
      _this.Player.on("ready", () => {
        _this.Player.defaultMuted = true;
        _this.Fullscreen()
        // setTimeout(() => {
        //   document.getElementById('home').click();
        // },3000)
        // _this.Player.controlHide()
      });
    },

    /**
     * @description 初始化 socket
     */
    initScoket() {
      let { params, onMessage } = this;
      let Scokets = new Socket(params);
      this.$Socket = Scokets.sockets;
      this.$Socket.onopen = function () {
        Scokets.heart(true, { msgType: 3001, interval: 10000 });
      };
      // 服务端 => 客户端 发送消息
      this.$Socket.onmessage = function (e) {
        // console.log("msg:  ", e.data);
        let data = JSON.parse(e.data);
        onMessage(data);
      };
      // 连接关闭时触发
      this.$Socket.onclose = function (event) {
        console.log("onclose");
        console.log(
          `as clean? ${event.wasClean} Code=${event.code} Reason=${event.reason}`
        );
      };
      // 连接发生错误
      this.$Socket.onerror = function (e) {
        console.log("onerror: ", e);
      };
    },

    /**
     * @description 监听消息
     */
    onMessage(e) {
      console.log(e);
      let { code, msgType, materialType, videoUrl } = e;
      let { changeSrc } = this;
      let codeList = [3002, 200];
      if (!codeList.includes(code)) {
        console.log("onerror: ", e.message);
        return;
      }
      if (msgType == 7001) {
        // 1 图片 2 视频
        let type = parseInt(materialType);
        switch (type) {
          case 1:
            break;
          case 2:
            console.log("ONvideo：", videoUrl);
            changeSrc(videoUrl);
            break;
          default:
            break;
        }
      }
    },
  },
  mounted() {
    this.init();
    // console.log(console.log(document.fullscreenEnabled));
    // launchFullscreen(document.getElementById("home"));
  },
  created() {
    this.initScoket();
    // document.addEventListener("fullscreenchange", function (e) {
    //   if (document.fullscreenElement) {
    //     console.log("进入全屏");
    //   } else {
    //     console.log("退出全屏");
    //   }
    // });
  },
  destroy() {
    this.destroy(true);
  },
};
</script>
