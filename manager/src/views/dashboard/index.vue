<template>
  <div class="container">
    <div class="box">
      <p>欢迎，管理员</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 使容器占满整个视口高度 */
}

.box {
  font-size: 45px;
  font-weight: 600;
  color: #ffffff;
  background-color: #4a90e2; /* 添加背景颜色 */
  padding: 20px; /* 内边距 */
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 添加过渡效果 */
}

.box:hover {
  transform: translateY(-5px); /* 鼠标悬停时上移效果 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 增加阴影效果 */
}
</style>
