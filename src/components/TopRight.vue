<template>
  <section class="top_right_box">
    <educa-tion/>
    <wage-s/>
  </section>
</template>

<script>
import EducaTion from './Education'
import WageS from './Wages'
export default {
  name: 'TopRight',
  components: {
    EducaTion,
    WageS
  }
}
</script>

<style lang="stylus" scoped>
  .top_right_box
    background #fff
    flex: 1
    display flex
    flex-direction column
    position relative
    //box-shadow 0 0 5px 2px rgba(0,0,0,.2)
    z-index 3
</style>
