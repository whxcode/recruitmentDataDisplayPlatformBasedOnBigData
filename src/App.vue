<template>
  <div id="app">
    <main class="main_box">
      <!-- 上面部分 -->
      <div class="top">
        <technical-words/>  <!-- 技术词组件 -->
        <map-pos/>         <!-- 地图组件 -->
        <top-right/>       <!-- 左边联动组件 -->
      </div>
      <!-- 下面部分 -->
      <div class="bottom">
        <word-cloud/>  <!-- 词云组件 -->
        <position-rank/>
        <wel-fare/>
        <pos-rank/>
      </div>
    </main>
  </div>
</template>

<script>
import TechnicalWords from './components/TechnicalWords'
import MapPos from './components/Map'
import TopRight from './components/TopRight'
import WordCloud from './components/WordCloud'
import PositionRank from './components/PositionRank'
import PosRank from './components/PosRank'
import WelFare from './components/Welfare'
export default {
  name: 'App',
  data() {
    return {
      data:[],
    }
  },
  components: {
    TechnicalWords,
    MapPos,
    TopRight,
    WordCloud,
    PositionRank,
    PosRank,
    WelFare
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@/assets/styles/public'
  #app{
    position: fixed
    width: 100%
  }
  .main_box{
    width: 100%
    height: 100vh
    display: flex
    flex-direction: column
    .top{
      display: flex
      flex: 1
    }
    .bottom{
      //margin-top: 4px
      background: white
      overflow: hidden
      // box-shadow: 0 0 3px 3px rgb(100,100,100)
      display: flex
      flex: 0.5
    }
  }
</style>

