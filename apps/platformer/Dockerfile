FROM nginx:alpine

# Serve on port 3000 inside the container to match platform convention
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]