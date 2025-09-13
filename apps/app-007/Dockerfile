FROM nginx:alpine

# Copy the nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the app files
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

# Expose the internal port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]