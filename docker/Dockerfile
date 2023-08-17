FROM nginx

# 设置映射的端口号
EXPOSE 8100
# 复制 nginx 配置文件到容器中
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN apt update -y && apt install -y vim
# 创建并切换到工作目录
WORKDIR /app
# 将编译好的前端文件复制到容器中
COPY dist/ /app
