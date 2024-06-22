<template>
    <div style="margin: 20px; display: flex; flex-direction: column; align-items: center;">
        <div>
            <!-- 上传文件的框 -->
            <input type="file" @change="change" class="file-input"/>
        </div>
        <div class="btnBox">
            <!-- 点击按钮调用 upload 函数，向后端服务器请求添加 -->
            <el-button type="primary" @click="upload" class="upload-button">添加轮播图</el-button>
        </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  axios.defaults.baseURL = 'http://localhost:9000';
  export default {
    data() {
        return {
            //有没有上传图片
            hasFile: false,
            //图片
            file: {},
        };
    },
    methods: {
        change(e) {
            //获取图片，标为已经有图片
            this.file = e.target.files[0];
            this.hasFile = true;
        },
        upload() {
            //检测有没有上传
            if (!this.hasFile) return alert('还未上传图片');
            //获取管理员 id 与 token
            let id = this.$store.state.uid;
            let token = this.$store.state.token;
            //创建表单数据，添加 管理员id 与 图片
            const data = new FormData();
            data.append('id', id);
            data.append('carousel', this.file);
            //发送请求添加轮播图
            axios.post('/carousel/backend/add', data, {headers: {authorization: token}})
                .then(({ data: { code } }) => {
                    //消息显示
                    if (code != 1) return alert('添加失败！');
                    alert('添加成功！');
                })
        }
    },
  }
  </script>
  
  <style scoped>
  input {
    font-size: 15px;
  }
  
  .file-input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 20px;
  }
  
  .btnBox {
    margin-top: 10px;
  }
  
  .upload-button {
    font-size: 16px;
    padding: 10px 20px;
    border-radius: 5px;
  }
  </style>
  