from fabric.api import run, env, local, sudo
from fabric.contrib import files, project

# AKIAJ4EO6O6USEUIZFYQ 
# cwdn44hghyiERlkOEZGLIqSb5jpqw0oSnI9goZSj

env.roledefs = {
    'dev':  ['review.smithandrobot.com']
}
env.user = "deploy"

def build():
    print "Building..."
    local('cd source && ant')
    print "Build complete."
    
def deploy(**kwargs):
    build()
    print "Deploying...."
    project.rsync_project(remote_dir="/var/www/vhosts/ncaa/", local_dir='deploy/')

def server():
    print "Go to http://localhost:8000"
    local('cd source && python -m SimpleHTTPServer')
    
    
    