# build env
FROM node:16 as build
WORKDIR /usr/src/app 

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build 

#production
FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf  

COPY nginx.conf /etc/nginx/conf.d

COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]



