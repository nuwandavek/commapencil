from flask import Flask, render_template, request, redirect
import glob, json

app = Flask(__name__, static_url_path='/static')
IMAGES = glob.glob('static/data/imgs/*.png')
config = json.load(open('config.json','r'))

# print(config)

# index
@app.route('/pencil')
def index():
    img_id = int(request.args.get('id',0))
    if img_id<0:
        return redirect("/pencil?id=0")
    elif img_id >= len(IMAGES):
        return redirect("/pencil?id="+str(len(IMAGES)-1))
    img_name = IMAGES[img_id].split('/')[-1]
    data = {'total_images':len(IMAGES), 'img_id':img_id, 'img_name':img_name, 'config':config}
    return render_template("pencil.html", data=data)

@app.route('/crayon')
def crayon():
    img_id = int(request.args.get('id',0))
    if img_id<0:
        return redirect("/crayon?id=0")
    elif img_id >= len(IMAGES):
        return redirect("/crayon?id="+str(len(IMAGES)-1))
    img_name = IMAGES[img_id].split('/')[-1]
    data = {'total_images':len(IMAGES), 'img_id':img_id, 'img_name':img_name, 'config':config}
    return render_template("crayon.html", data=data)

if __name__ == "__main__":
    app.run(debug=True)