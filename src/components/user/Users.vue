<template>
<div>
  <!-- 卡片视图 -->
  <el-card>
    <!-- 搜索与添加 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表区 -->
    <el-table :data="userList" :border="true" :stripe="true">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
        <!-- scope.row可以获取这一行的数据 {{ scope.row }}-->
          <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeuserById(scope.row.id)"></el-button>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="addRole(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页  -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  <!-- 对话框 -->
  <el-dialog
  title="添加用户"
  :visible.sync="dialogVisible"
  width="30%"
  @close="addDialogClose">
  <!-- 主体区 -->
  <el-form :model="addForm" :rules="addFromRules" label-width="70px" ref="addFormRef">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="addForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="addForm.password"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="addForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="addForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <!-- 底部 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
  <!--分配角色对话框-->
  <el-dialog title="分配角色" :visible.sync="dialogFormVisible">
    <p>当前用户名称: {{userInfo.username}}</p>
    <p>当前用户角色: {{userInfo.role_name}}</p>
    <p>分配新角色:
      <el-select v-model="selectedRoleId" placeholder="请选择">
        <el-option
          v-for="item in rolesList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
    </p>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
export default {
  name: 'Users.vue',
  data() {
    // 校验邮箱规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
    // 校验手机号规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^([a-zA-Z0-9])+/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法手机号'))
    }
    return {
      // 获取用户列表请求参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      // 添加用户信息对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 校验输入规则
      addFromRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3~10 个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名长度在 6~15 个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'brul' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }

        ]
      },
      // 分配角色对话框展示
      dialogFormVisible: false,
      // 用户信息
      userInfo: {},
      // 已选择角色 id
      selectedRoleId: '',
      // 角色列表
      rolesList: []
    }
  },
  created () {
    // 页面加载调用方法获取用户列表
    this.getUserList()
  },
  methods: {
    returnMessageError(data, errorMessage, succMessage) {
      if (data.meta.status !== 200) {
        return this.$message.error(errorMessage)
      }
      return this.$message.success(succMessage)
    },
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newsize) {
      console.log(newsize)
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStatusChange(userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(`user/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 关闭对话框 清空表单数据
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 表单预校验
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return null
        }
        // 发起添加用户请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('用户添加成功')
        // 隐藏对话框
        this.dialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    async removeuserById(id) {
      // 获取用户操作
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      console.log(id)
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    // 用户角色添加
    async addRole(userinfo) {
      this.userInfo = userinfo
      const { data: res } = await this.$http.get('roles')
      this.returnMessageError(res, '获取用户角色列表失败', '获取角色列表成功')
      this.rolesList = res.data
      console.log(this.rolesList)
      this.dialogFormVisible = true
    },
    // 保存用户角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择需要分配的角色')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      this.returnMessageError(res, '分配角色失败', '分配角色成功')
      this.getUserList()
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
