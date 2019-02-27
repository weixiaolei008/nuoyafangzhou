FROM harbor.anji-allways.com/library/nginx1.11:alpine3.8-bash
#FROM node:9.11.2-slim
MAINTAINER wangbin@anji-allways.com.cn

ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./ /data/work/devops/
COPY ./default.conf /etc/nginx/conf.d/
ENV PORT 80

CMD ["nginx","-g","daemon off;"]
