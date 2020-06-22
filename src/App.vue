<template>
  <div id="app">
<!--      <video autoplay loop id="bgvid">-->
<!--        <source src="http://works.juanmaotu.top/static/2.mp4" type="video/mp4">-->
<!--      </video>-->

    <div class="bg">
    </div>
    <router-view/>
  </div>
</template>

<!--http://works.juanmaotu.top/static/1.mp4-->

<script>
export default {
  name: 'App'
}
</script>

<style>
:root {
  --blur: 5px;
}
video#bgvid {
  position: fixed; right: 0; bottom: 0;
  min-width: 100%; min-height: 100%;
  width: auto;
  height: auto;
  z-index: -100;
  /*background: url("../static/img/bg.jpg") no-repeat;*/
  background: rgba(255,255,255,1);
  background-size: cover;
  /*filter: blur(5px)*/
}
.bg{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #3aafa9;
  background-size: cover;
  /*filter: blur(var(--blur));*/
  /*-webkit-filter:blur(var(--blur));*/
  /*-moz-filter:blur(var(--blur));*/
  /*-ms-filter:blur(var(--blur));*/
  /*-o-filter:blur(var(--blur));*/
  z-index: -1;
}
</style>
