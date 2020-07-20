<template>
    <div>
      <el-card>
        <el-row>
        </el-row>
        <!--表格-->
        <tree-table
          :data="catelist"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          border
          :show-row-hover="false">
            <!--是否有效-->
            <template slot="isok" slot-scope="scope">
              <i class="el-icon-success" style="color: aquamarine" v-if="scope.row.cat_deleted === false"></i>
              <i class="el-icon-error" style="color: brown" v-if="scope.row.cat_deleted === true"></i>
            </template>
            <template slot="order" slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
              <el-tag size="mini" type='success' v-if="scope.row.cat_level === 1">二级</el-tag>
              <el-tag size="mini" type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
            </template>
          </tree-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <el-cascader
          expand-trigger="hover"
          v-model="selectOpt"
          :options="parentCateList"
          :props="cascaderProps"
          @change="handleChange"></el-cascader>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Cate.vue',
  data() {
    return {
      // 查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据
      catelist: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        }
      ],
      selectOpt: [],
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    returnMessageError(data, errorMessage) {
      if (data.meta.status !== 200) {
        return this.$message.error(errorMessage)
      }
    },
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      this.returnMessageError(res, '获取商品分类失败')
      this.catelist = res.data.result
      this.total = res.data.total
      console.log(this.catelist)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      console.log('监听页面')
      console.log(newSize)
      console.log(this.queryInfo.pagesize)
      this.getCateList()
    },
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getCateList()
    },
    handleChange() {
      console.log(this.selectOpt)
    }
  }
}
</script>

<style scoped>

</style>
