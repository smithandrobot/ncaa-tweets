from fabric.api import run, env, local, sudo
from fabric.contrib import files, project

from boto.s3.connection import S3Connection 
from boto.s3.key import Key
from stat import *
import time, os

# AKIAJ4EO6O6USEUIZFYQ 
# cwdn44hghyiERlkOEZGLIqSb5jpqw0oSnI9goZSj

env.hosts = ['review.smithandrobot.com']

env.user = "deploy"

def build():
    print "Building..."
    local('cd source && ant')
    print "Build complete."
    
def dev():
    # build()
    print "Deploying...."
    project.rsync_project(remote_dir="/var/www/vhosts/ncaa/", local_dir='source/')
    
def production():

    conn = S3Connection('AKIAJ4EO6O6USEUIZFYQ', 'cwdn44hghyiERlkOEZGLIqSb5jpqw0oSnI9goZSj') 
    bucket = conn.get_bucket('massrelevance')
    
    build()
    basedir = 'deploy'
    for root, dirs, files in os.walk(basedir):
        for f in files:
            if f.startswith('.') :
                continue
                
            filename = root + '/' + f
            remotename = 'marchmadness2011/%s' % filename.replace('%s/' % basedir, '')
            modify_time = os.stat(filename)[ST_MTIME]
            key = bucket.get_key(remotename)
            
            if key is None:
                key = Key(bucket)
                key.key = remotename
            if key.last_modified is None or time.gmtime(modify_time) > time.strptime(key.last_modified, '%a, %d %b %Y %H:%M:%S %Z'): 
                fid = file(filename, 'r')
                key.set_contents_from_file(fid)
                key.set_acl('public-read')
                print '%s uploaded' % remotename


def server():
    print "Go to http://localhost:8000"
    local('cd source && python -m SimpleHTTPServer')
    
    
    