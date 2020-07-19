<template>
  <div>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表-->
      <el-table :data="rolelist" border stripe>
        <!--权限控制-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', 'vcenter']" v-for="item in scope.row.children" :key="item.id">
              <!--一级菜单-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级菜单-->
              <el-col :span="19">
                <el-row :class="['bdbottom', 'vcenter']" v-for="item2 in item.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre>
              {{ scope.row }}
            </pre>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="100px"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分配权限对话框-->
    <el-dialog
      @close="setDefKeysNill"
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%">
      <el-tree  ref="treeRef" :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles.vue',
  data() {
    return {
      rolelist: [],
      // 显示所有权限对话框
      setRightDialogVisible: false,
      // 所有权限数据
      rightslist: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 所有的三级节点
      defKeys: [],
      // 当前节点 id
      nodeId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    returnMessageError(data, errorMessage, succMessage) {
      if (data.meta.status !== 200) {
        return this.$message.error(errorMessage)
      }
      return this.$message.success(succMessage)
    },
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      this.returnMessageError(res, '获取角色列表失败', '获取角色列表成功')
      this.rolelist = res.data
      console.log(this.rolelist)
    },
    async removeRightById(role, rightId) {
      console.log('进入删除')
      const confirmResult = await this.$confirm('此操作将永久删除此权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      console.log(role)
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      this.returnMessageError(res, '删除权限失败！', '删除权限成功')
      role.children = res.data
    },
    async showSetRightDialog(role) {
      this.nodeId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      this.returnMessageError(res, '获取权限数据失败', '获取用户权限成功')
      this.rightslist = res.data
      console.log(this.rightslist)
      // 对话框出现之前获取三级节点
      this.getLeafKeys(role, this.defKeys)
      console.log(this.defKeys)
      this.setRightDialogVisible = true
    },
    // 递归获取三级权限 id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 关闭对话框三级列表置为空
    setDefKeysNill() {
      this.defKeys = []
    },
    // 为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      console.log(idStr)
      const { data: res } = await this.$http.post(`roles/${this.nodeId}/rights`, { rids: idStr })
      this.returnMessageError(res, '分配权限失败', '分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-tag{
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
