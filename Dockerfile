#어떤 이미지를 기반으로 빌드하는지에 대해서 지정
FROM node:8

#Dockerfile을 생성/관리하는 사람
LABEL MAINTAINER dilrong "enfto@naver.com"

#디렉토리 생성
RUN mkdir -p /usr/src/app

#WORKDIR 설정
WORKDIR /usr/src/app

#앱 의존성 설치를 위해서 package.json 가져옴
COPY package*.json ./

#npm install 실행
#프로덕션 코드 빌드시 RUN npm ci --only=production
RUN npm install

#앱 소스 추가
COPY . .

#오픈 포트 설정
EXPOSE 2222

#컨테이너에서 실행할 명령어 지정
CMD ["npm", "start"]
