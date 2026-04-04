# 论文冲刺站

一个可直接部署到 GitHub Pages 的静态单页网站，展示：

- 当天日期
- 距离 `2026/04/16` 的倒计时
- 左下角静态展示的小猪鱼简洁插图
- 武汉当前天气与今日最高/最低温
- 每整点自动切换的论文鼓励语

## 本地查看

直接双击打开 [index.html](./index.html) 即可，或者用任意静态服务器打开当前目录。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库。
2. 把当前目录文件上传到仓库根目录。
3. 进入仓库 `Settings` -> `Pages`。
4. 在 `Build and deployment` 里选择 `Deploy from a branch`。
5. 分支选择 `main`，目录选择 `/ (root)`。
6. 保存后等待 GitHub 发布完成。

发布成功后，项目页地址通常是：

`https://<你的 GitHub 用户名>.github.io/<仓库名>/`

## 实现说明

- 页面使用原生 `HTML + CSS + JavaScript`，不依赖构建工具。
- 所有时间计算固定按 `Asia/Shanghai` 执行。
- 天气数据来自 Open-Meteo 公共接口。
- 资源路径全部为相对路径，兼容 GitHub Pages 项目页部署。
