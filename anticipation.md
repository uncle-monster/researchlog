# VSCode 记录科研思路插件工具researchlog

## 需求
实现一个VSCode插件，命名为'researchlog'，方便科研人员记录不同时间点的科研想法

### 具体实现
该插件起到一个文件管理系统的作用，该文件管理系统有两个层级，第一级为文件夹，名为'researchlog'，放在项目总文件夹下；第二级为若干markdown格式文件夹，名称为一个数字，代表项目开始的天数。
初始化时，researchlog要记录下系统时间，格式为‘年/月/日’，作为该项目researchlog的起始时间，并在项目文件夹下创建'researchlog'文件夹；
接下来在项目研发过程中，使用者可以通过使用快捷键在‘researchlog’文件夹下创建markdown格式文档，名称为当前系统时间距离researchlog起始时间的天数，用数字表示