<template>
  <div>
    <el-row>
      <!-- 循环渲染轮播图 -->
      <el-col :span="8" v-for="(e, idx) in list" :key="idx">
        <el-card :body-style="{ padding: '0px',textAlign:'center',padding:'20px' }">
          <!-- 轮播图线上地址 -->
          <img :src="http.defaults.baseURL + '/' + e.name" class="image" />
          <!-- 删除按钮 -->
          <el-popconfirm title="确定删除该轮播图吗？"   @onConfirm="deleteCarousel(e.id)">
            <el-button slot="reference" style="margin: 10px 0;">删除</el-button>
          </el-popconfirm>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      //轮播图列表
      list: [],
      http: axios,
    };
  },
  methods: {
    deleteCarousel(imgId) {
      //获取管理员 id 与 token
      let id = this.$store.state.uid;
      let token = this.$store.state.token;
      //发送请求删除轮播图
      axios
        .post(
          "/carousel/backend/remove",
          { id, imgId },
          { headers: { authorization: token } }
        )
        .then(({ data: { code } }) => {
          //消息显示
          if (code != 1) return alert("删除失败！");
          //删除轮播图
          this.$message({
          message: '操作成功',
          type: 'success'
        });
          this.list = this.list.filter((e) => e.id != imgId);
        });
    },
  },
  created() {
    //初始化获取轮播图列表
    axios.get("/carousel/list").then(({ data: { code, list } }) => {
      if (code != 1) return console.log("获取轮播图列表失败");
      this.list = list;
    });
  },
};
</script>

<style scoped>
.image {
  /* width: 100%; */
  width: 334px;
  height: 213px;
  display: block;
  margin: 0 auto;
}

.btn {
  margin-top: 5px;
  margin-left: 40%;
  margin-bottom: 5px;
}
</style>
