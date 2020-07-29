<template>
  <div>
    <el-card>
      <el-alert type="warning" show-icon title="只能为三级分类设置参数" :closable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            expand-trigger="hover"
            @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!--上传问价-->
      <el-upload
        :action="uploadURL"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :headers="headerObj"
        :on-success="handleSuccess"
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" :disabled="isBunDisAbled">添加参数</el-button>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" size="mini" :disabled="isBunDisAbled">添加属性</el-button>
      </el-tab-pane>
      <el-tab-pane label="来一段描述" name="infoq">
      <quill-editor v-model="info">
      </quill-editor>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="预览图片" :visible.sync="previewVisible">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params.vue',
  data() {
    return {
      catelist: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      info: '',
      selectedCateKeys: [],
      activeName: 'many',
      manyTable: [],
      onlyTable: [],
      uploadURL: 'http://timemeetyou.com:8889/api/private/v1/upload',
      headerObj: {
        authorization: window.sessionStorage.getItem('token')
      },
      pics: [],
      previewPath: '',
      previewVisible: false
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
      const { data: res } = await this.$http.get('categories')
      console.log(res)
      this.returnMessageError(res, '获取商品分类失败')
      this.catelist = res.data
      console.log(this.catelist)
    },
    async handleChange() {
      console.log(this.selectedCateKeys)
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      this.returnMessageError(res, '获取参数列表失败')
      if (this.activeName === 'many') {
        this.manyTable = res.data
      } else {
        this.onlyTable = res.data
      }
      console.log(res.data)
    },
    handleClick() {
      console.log(this.activeName)
    },
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove(file) {
      console.log(file)
      const filePath = file.response.data.tmp_path
      const i = this.pics.findIndex(x => x.pic === filePath)
      this.pics.splice(i, 1)
      console.log(this.pics)
    },
    handleSuccess(response) {
      console.log(response)
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.pics.push(picInfo)
      console.log(this.pics)
    }
  },
  computed: {
    isBunDisAbled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return 1
    }
  }
}
</script>

<style scoped>
.cat_opt{
  margin: 15px 0;
}
  .previewImg{
    width: 100%;
  }
</style>
