<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="ShowDialog">添加</el-button>
    <el-table :data="trademarkList" border stripe background style="width:100%;margin:20px 0">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
      <el-table-column width="width" label="品牌LOGO">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt style="height:60px" />
        </template>
      </el-table-column>
      <el-table-column width="width" label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" @click="showUpdateDialog(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="getTrademarkList"
      :current-page="page"
      :page-size="limit"
      layout=" prev, pager, next, jumper, ->,total"
      :total="total"
    ></el-pagination>

    <el-dialog :title="`${form.id?'修改':'添加'}`" :visible.sync="isShowDialog">
      <el-form :model="form" style="width:80%" :rules="rules">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :before-upload="beforeLogoUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="ShowAddTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 5,
      trademarkList: [],
      total: 0,
      isShowDialog: false,
      formLabelWidth: "100px",
      form: {
        tmName: "",
        logoUrl: "",
      },

       rules: {
          tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { min: 2, max: 10, message: '输入字符长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          logoUrl: [
            { required: true, message: '请上传图片', trigger: 'change' }
          ],
      }
    }
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getTrademarkList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },
    // 上传图片成功调用
    handleLogoSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.form.logoUrl = res.data
    },
    // 上传图片前调用
    beforeLogoUpload(file) {
      const TypeArr = ['image/jpeg','image/png']
      const isJPGOrPNG = TypeArr.indexOf(file.type) !== -1;
      const isLt500k = file.size / 1024  < 500;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt500k) {
        this.$message.error("上传头像图片大小不能超过 500k!");
      }
      return isJPGOrPNG && isLt500k;
    },
    // 显示dialog下拉层
    ShowDialog(){
      this.form = {
        tmName:'',
        logoUrl:''
      }
      this.isShowDialog = true
    },
    // 删除品牌
    deleteTrademark(trademark){
      this.$confirm(`你想删除${trademark.tmName}吗？`,"提示",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      })
      .then(async ()=>{
        const result = await this.$API.trademark.delete(trademark.id)
        if(result.code === 200){
          this.$message.success("删除品牌成功")
          this.getTrademarkList(this.trademarkList.length > 1 ? this.page : this.page - 1)
        }else{
          this.$message.error("删除品牌失败")
        }
      })
      .catch(()=>{
        this.$message({
          type:"info",
          message:"已取消删除"
        })
      })
    },
    // 修改品牌
    showUpdateDialog(trademark){
      this.form = {...trademark}
      this.isShowDialog = true
    },
    // 增加品牌
    async ShowAddTrademark(){
      // 找参数
      let trademark = this.form
      // 发请求
      const result = await this.$API.trademark.addOrUpdate(trademark)
      if(result.code === 200){
        this.$message.success(`${trademark.id?"修改":"添加"}品牌成功`)
        this.getTrademarkList(trademark.id?this.page:1)
        this.isShowDialog = false
      }else{
        this.$message.error(`${trademark.id?"修改":"添加"}品牌失败`)
      }
    }
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>