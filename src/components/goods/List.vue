<template>
    <div>
      <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加商品</el-button>
          </el-col>
        </el-row>
        <el-table :data="goodslist" border stripe>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'List.vue',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    returnMessageError(data, errorMessage) {
      if (data.meta.status !== 200) {
        return this.$message.error(errorMessage)
      }
    },
    async getGoodsList() {
      console.log('13123')
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      this.returnMessageError(res, '获取商品列表成功!', '获取商品失败')
      this.goodslist = res.data.goods
      this.total = res.data.total
    }
  }
}
</script>

<style scoped>

</style>
