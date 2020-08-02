<template>
    <div>
      <el-card>
        <div id="main" style="width: 600px;height: 400px"></div>
      </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'Report',
  created () {
  },
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 指定图表的配置项和数据
    const { data: res } = await this.$http.get('reports/type/1')
    console.log(res.data)
    // 使用刚指定的配置项和数据显示图表s。
    myChart.setOption(res.data)
  }
}
</script>

<style scoped>

</style>
