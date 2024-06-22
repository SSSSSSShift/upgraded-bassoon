<template>
  <div>
      <div style="margin: 20px;">
          <!-- 搜索框，输入时自动搜索 -->
          搜索用户：<el-input class="searchInp" v-model="searchStr" placeholder="搜索用户" clearable
              @input="searchUser"></el-input>
      </div>
      <!-- :data 要显示的数据，showList 是计算属性，后面要分页，计算属性方便 -->
      <el-table :data="showList" border style="width: 100%">
          <!-- label 表格列头名，prop 每个元素对应的字段 -->
          <el-table-column label="用户名" prop="username" align="center">
          </el-table-column>
          <el-table-column label="年龄" prop="age" align="center">
          </el-table-column>
          <el-table-column label="性别" prop="gender" align="center">
          </el-table-column>
          <el-table-column label="昵称" prop="nickname" align="center">
          </el-table-column>
          <el-table-column label="角色" prop="role" align="center">
          </el-table-column>
          <el-table-column align="center" prop="flag">
              <!-- 列头名称 -->
              <template slot="header">
                  冻结账号
              </template>
              <template slot-scope="scope">
                  <!-- v-if 和 else 显示冻结还是解冻按钮 -->
                  <!-- 使用 scope.row 是当前这一行的数据（一个用户） -->
                  <!-- 所有的操作都是用 用户的id 来辨别用户，而不是下标 -->
                  <!-- 一个是用 id 不会出错，在一个是后面要分页，下标不准 -->
                  <el-button v-if="scope.row.flag" size="mini" type="warning"
                      @click="freezeUser(scope.row.id)">冻结</el-button>
                  <el-button v-else size="mini" type="success" @click="thawUser(scope.row.id)">解冻</el-button>
              </template>
          </el-table-column>
          <el-table-column align="center" width="200px">
              <template slot="header">
                  操作
              </template>
              <template slot-scope="scope">
                  <!-- 重置密码 和 删除 按钮 -->
                  <el-button size="mini" type="primary" @click="resetPassword(scope.row.id)">重置密码</el-button>
                  <el-button size="mini" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- page-size 每页显示 5 个，current-page 当前第几页 -->
      <!-- @current-change 钩子，当页数变化的时候触发，在这里我们调用 curPageChange 这个函数 -->
      <!-- 他换页是不会改变你的变量的，写 current-page 里面也没有，所以需要这个钩子，让我们自己改变变量的值 -->
      <el-pagination :page-size="5" :current-page="1" @current-change="curPageChange"
          layout="total, prev, pager, next, jumper" :total="list.length">
      </el-pagination>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
      return {
          //所有用户的列表 与 搜索字符串
          list: [],
          searchStr: '',
          //当前页
          curPage: 1,
      }
  },
  methods: {
      //改变当前页，换页会传入一个页面新的值，覆盖就行
      curPageChange(newVal) {
          this.curPage = newVal;
      },
      //重置密码
      resetPassword(uid) {
          //获取用户
          let user = this.list.find(e => e.id == uid);
          //询问是否重置密码
          if (!confirm('确定要重置用户' + user.nickname + '的密码吗？')) return;
          //获取 id 与 token
          let id = this.$store.state.uid;
          let token = this.$store.state.token;
          //发送请求重置密码
          axios.post('/users/backend/reset', { id, uid }, { headers: { authorization: token } })
              .then(({ data: { code } }) => {
                  //消息显示
                  if (code == 1) alert('重置密码成功！');
                  else alert('重置密码失败');
              })
      },
      //删除用户
      deleteUser(uid) {
          //获取用户
          let user = this.list.find(e => e.id == uid);
          //询问是否删除（防误触）
          if (!confirm('确定要删除用户' + user.nickname + '吗？')) return;
          //获取 id 与 token
          let id = this.$store.state.uid;
          let token = this.$store.state.token;
          //发送请求冻结用户
          axios.post('/users/backend/del', { id, uid }, { headers: { authorization: token } })
              .then(({ data: { code } }) => {
                  if (code != 1) return alert('删除失败！');
                  //在 list 里面删除
                  this.list = this.list.filter(e => e.id != uid);
              })
      },
      //冻结用户
      freezeUser(uid) {
          //获取用户
          let user = this.list.find(e => e.id == uid);
          //询问是否冻结（防误触）
          if (!confirm('确定要冻结用户' + user.nickname + '吗？')) return;
          //获取 id 与 token
          let id = this.$store.state.uid;
          let token = this.$store.state.token;
          //发送请求冻结用户
          axios.post('/users/backend/flag', { id, uid }, { headers: { authorization: token } })
              .then(({ data: { code } }) => {
                  if (code != 1) return alert('冻结失败！');
                  //冻结成功修改 flag
                  user.flag = false;
              })
      },
      //解冻用户
      thawUser(uid) {
          //获取用户
          let user = this.list.find(e => e.id == uid);
          //获取 id 与 token
          let id = this.$store.state.uid;
          let token = this.$store.state.token;
          //发送请求解冻用户
          axios.post('/users/backend/flag', { id, uid }, { headers: { authorization: token } })
              .then(({ data: { code } }) => {
                  if (code != 1) return alert('解冻失败！');
                  //解冻成功修改 flag
                  user.flag = true;
              })
      },
      //搜索用户
      searchUser() {
          //获取 id 与 token
          let id = this.$store.state.uid;
          let token = this.$store.state.token;
          //发送请求搜索
          axios.get('/users/backend/search', { params: { id, searchStr: this.searchStr }, headers: { authorization: token } })
              .then(({ data: { code, list } }) => {
                  //搜索失败提示
                  if (code != 1) return alert('搜索失败');
                  //返回的用户列表直接覆盖
                  this.list = list;
              })
      }
  },
  computed: {
      //当前显示的用户列表
      showList() {
          //获取 [l, r) 内的元素，左闭右开
          let l = (this.curPage - 1) * 5;
          let r = l + 5 > this.list.length ? this.list.length : l + 5;
          return this.list.slice(l, r);
      }
  },
  created() {
      //创建时先获取一次用户列表
      //获取  管理员id 和 token
      let id = this.$store.state.uid;
      let token = this.$store.state.token;
      //请求接口获取用户信息
      axios.get('/users/backend/list', { params: { id }, headers: { authorization: token } })
          .then(({ data: { code, list } }) => {
              //获取失败
              if (code != 1) return alert('获取用户信息失败');
              //获取成功
              this.list = list;
          })
  }
}
</script>

<style scoped>
.searchInp {
  width: 200px;
  margin-bottom: 20px;
}

span {
  margin-left: 10px;
}
</style>