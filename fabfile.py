from fabric.api import run, env, local, sudo
from fabric.contrib import files, project

env.roledefs = {
    'dev':  ['review.smithandrobot.com']
}
env.user = "deploy"


def deploy(**kwargs):
    project.rsync_project(remote_dir="/var/www/vhosts/ncaa/", local_dir='source/')

def server():
    local('cd source && python -m SimpleHTTPServer')