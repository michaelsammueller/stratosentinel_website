from flask import Flask, render_template, abort
import markdown
import yaml
from datetime import datetime
import os
from pathlib import Path

app = Flask(__name__)

def get_post(slug):
    posts_dir = Path("posts")
    post_path = posts_dir / f"{slug}.md"
    
    if not post_path.exists():
        return None
        
    with open(post_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split front matter and content
    if content.startswith('---'):
        _, front_matter, content = content.split('---', 2)
        metadata = yaml.safe_load(front_matter)
    else:
        metadata = {}
    
    # Convert markdown to HTML
    md = markdown.Markdown(extensions=['meta', 'fenced_code', 'codehilite'])
    html_content = md.convert(content)
    
    return {
        'slug': slug,
        'content': html_content,
        'title': metadata.get('title', 'Untitled'),
        'date': metadata.get('date', ''),
        'author': metadata.get('author', ''),
        'excerpt': metadata.get('excerpt', '')
    }

def get_posts():
    posts_dir = Path("posts")
    posts = []
    
    if posts_dir.exists():
        for post_path in posts_dir.glob('*.md'):
            slug = post_path.stem
            post = get_post(slug)
            if post:
                posts.append(post)
    
    # Sort posts by date (newest first)
    return sorted(posts, key=lambda x: x['date'], reverse=True)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/blog')
def blog():
    posts = get_posts()
    return render_template('blog.html', posts=posts)

@app.route('/blog/<slug>')
def post(slug):
    post = get_post(slug)
    if post is None:
        abort(404)
    return render_template('post.html', post=post)

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)