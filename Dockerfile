FROM nginx:alpine
COPY reveal /usr/share/nginx/html/
RUN echo daemon off\; >> /etc/nginx/nginx.conf
RUN chown -R nginx /usr/share/nginx/html/
CMD ["nginx"]
EXPOSE 80

