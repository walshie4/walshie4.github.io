set :haml, { :ugly => false, :format => :html5 }

page "index.html", :layout => :base
page "/pages/*", :layout => :page

configure :development do
  activate :livereload
  activate :directory_indexes
end

activate :deploy do |deploy|
      deploy.method = :git
      deploy.branch = 'master'
end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

set :build_dir, 'build'

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css
  # Minify Javascript on build
  activate :minify_javascript
  activate :directory_indexes
  # Utilize gzip compression
  activate :gzip
  # Minify HTML on build
  activate :minify_html
end

