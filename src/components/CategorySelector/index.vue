<template>
  <div>
    <el-form :inline="true" :model="cForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="选择一级分类" @change="handlerC1">
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1,index) in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="选择二级分类" @change="handlerC2">
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2,index) in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="选择三级分类" @change="handlerC3">
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3,index) in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  data() {
    return {
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  mounted() {
    this.getCategory1List()
  },
  methods:{
    // 获取一级分类列表
    async getCategory1List(){
      const result = await this.$API.category.getCategorys1()
      if(result.code === 200){
        this.category1List = result.data
      }
    },
    // 选中一级分类的时候触发获取二级分类列表
    async handlerC1(category1Id){
      //选中1级分类 把23级分类相关的都清空
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.category2List = []
      this.category3List = []
      //向父传递选中的1级分类id
      this.$emit('handlerCategory',{categoryId:category1Id,level:1})
      const result = await this.$API.category.getCategorys2(category1Id)
      if(result.code === 200){
        this.category2List = result.data
      }
    },
    // 选中二级分类的时候触发获取三级分类列表
    async handlerC2(category2Id){
      this.cForm.category3Id = ''
      this.category3List = []
      this.$emit('handlerCategory',{categoryId:category2Id,level:2})
      const result = await this.$API.category.getCategorys3(category2Id)
      if(result.code === 200){
        this.category3List = result.data
      }
    },
    //选中三级分类的时候触发，给父传递选中的3级id
    handlerC3(category3Id){
      this.$emit('handlerCategory',{categoryId:category3Id,level:3})
    }
  }
};

const obj = {
  a1: 1,
  a2: {
    b1: "abc",
    b2: [1, 2],
  },
};
const arr = [1];
</script>

<style>
</style>