FROM jekyll/jekyll
COPY . /srv/jekyll
WORKDIR /srv/jekyll
# Change ownership of the project files to the 'jekyll' user
RUN chown -R jekyll:jekyll /srv/jekyll
CMD ["jekyll", "serve", "--watch", "--force_polling", "--host", "0.0.0.0"]
