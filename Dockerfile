FROM jekyll/jekyll
COPY . /srv/jekyll
WORKDIR /srv/jekyll
CMD ["jekyll", "serve", "--watch", "--force_polling", "--host", "0.0.0.0"]
