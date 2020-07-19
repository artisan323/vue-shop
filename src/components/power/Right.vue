<template>
    <div>
      <el-card>
        <el-table :data="rightsList" border stripe>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="权限名称" prop="authName"></el-table-column>
          <el-table-column label="路径" prop="path"></el-table-column>
          <el-table-column label="权限等级" prop="level">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
              <el-tag v-if="scope.row.level === '1'" type="success">二级</el-tag>
              <el-tag v-if="scope.row.level === '2'" type="warning">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'Right.vue',
  data() {
    return {
      // 权限列表
      rightsList: [],
      responseData: {
        meta: {
          msg: '',
          status: ''
        },
        data: ''
      }
    }
  },
  created () {
    // 页面生成获取权限列表
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: responseData } = await this.$http.get('rights/list')
      console.log(responseData)
      if (responseData.meta.status !== 200) {
        return this.$message.error('获取权限列表失败!')
      }
      this.rightsList = responseData.data
      console.log(this.rightsList)
    }
  }
}
</script>

<style scoped>

</style>
