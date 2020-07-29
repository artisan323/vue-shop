<template>
  <div>
    <el-card>
      <el-row :gutter="10">
       <el-col :span="6">
         <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
           <el-button slot="append" icon="el-icon-search"></el-button>
         </el-input>
       </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="订单编号" prop="order_price"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" @click="showbox"></el-button>
            <el-button type="success" icon="el-icon-location"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="addrssForm">
        <el-form-item label="省市区" prop="address1">
          <el-input v-model="addressForm.address1"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      dialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      }
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    returnMessageError(data, errorMessage) {
      if (data.meta.status !== 200) {
        return this.$message.error(errorMessage)
      }
    },
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      this.returnMessageError(res, '获取订单列表失败')
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    showbox() {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>

</style>
