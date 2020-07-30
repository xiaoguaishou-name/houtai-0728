<template>
  <div>
    <el-card>
      <CategorySelector @handlerCategory="handlerCategory"></CategorySelector>
    </el-card>
    <el-card>
      <!-- 列表页面 -->
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddDiv"
        >添加属性</el-button>
        <el-table :data="attrList" border style="width: 100%;margin:20px 0">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="address" label="属性值列表">
            <template slot-scope="{row,$index}">
              <el-tag
                v-for="(attrValue,index) in row.attrValueList"
                :type="color[Math.floor(Math.random()*5)]"
                :key="attrValue.id"
                style="margin:4px 5px;"
              >{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" width="150">
            <template slot-scope="{row,$index}">
              <HintButton type="warning" icon="el-icon-edit" title="修改"></HintButton>
              <HintButton type="danger" icon="el-icon-delete" title="删除"></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加和修改的页面 -->
      <div v-show="!isShowList">
        <el-form :inline="true" :model="attrForm">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrForm.attrName" @click="addAttrValue">添加属性名</el-button>
        <el-button @click="isShowList = true">取消</el-button>
        <el-table :data="attrForm.attrValueList" border style="width: 100%;margin:20px 0;">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column  label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值名"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template>
              <HintButton icon="el-icon-delete" type="danger" title="删除"></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="!attrForm.attrName" @click="addValueName">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AttrList",
  data() {
    return {
      //获取数据所需的参数
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      color:['danger','warning','success','info','primary'],
      isShowList: true,
      //收集添加属性参数相关的form对象,就是添加属性所需要的参数，是一个新的attr对象
      attrForm: {
        attrName: "",
        attrValueList: [],
        categoryId: "",
        categoryLevel: 3,
      },
    };
  },
  methods: {
    handlerCategory({ categoryId, level }) {
      if (level === 1) {
        //清空之前保留的2级级3级id以及之前请求的attrList
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category3Id = "";
        this.attrList = [];
        this.category2Id = categoryId;
      } else {
        //如果选中了三级，父组件会接收到3级id，代表要发请求，拿属性列表数据
        //三级被传过来，证明12级已经被传过来存储了
        //此时请求最佳
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 
    showAddDiv(){
      this.attrForm = {
        attrName:'',
        attrValueList:[],
        categoryId:this.category3Id,
        categoryLevel:3
      },
      this.isShowList = false
    },
    addAttrValue(){
      //点击添加属性值，需要给attrForm当中的attrValueList数组中塞一条数据，数据要参考接口文档
      //点击添加的这个属性值对象仅仅是为了让上面能出现一个输入框，此时这个属性值对象内部属性值都是空串和undefined
      this.attrForm.attrValueList.push({
        attrId:this.attrForm.id,
        valueName:''
      })
    },
    async addValueName(){
      const result = await this.$API.attr.getAddOrUpdate(this.attrForm)
      if(result.code === 200){
        this.$message.success('添加成功')
        this.isShowList = true
      }
    }
  },
};
</script>
