import request from '@/utils/request'
const api_name = '/admin/product'
export default {
  //请求商品属性列表数据
  getList(category1Id, category2Id, category3Id) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method:'get'
    })
  },
  //请求添加或修改商品属性数据
  getAddOrUpdate(data) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: 'post',
      data
    })
  },
  //请求删除商品属性数据
  getDelete(attrId) {
    return request({
      url: `${api_name}/deleteAttr/${attrId}`,
      method:'delete'
    })
  }
}