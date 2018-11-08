FROM nginx:alpine
COPY reveal /usr/share/nginx/html/
RUN echo daemon off\; >> /etc/nginx/nginx.conf
CMD ["nginx"]
EXPOSE 80

