import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default {
  /*
  获取品牌分页列表(带搜索)
  */
  getTrademarkList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
    })
  },
  //增加或修改品牌
  addOrUpdate(trademark) {
    if (trademark.id) {
      //如果存在品牌id，那就是修改
      return request({
        url: `${api_name}/update`,
        method: 'put',
        data:trademark
      })
    } else {
      return request({
        url: `${api_name}/save`,
        method: 'post',
        data:trademark
      })
    }
  },
  //删除品牌
  delete(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method:'delete'
    })
  }
}