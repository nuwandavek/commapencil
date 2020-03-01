from flask import Flask, render_template, request, redirect, jsonify
import glob, json, subprocess, os

app = Flask(__name__, static_url_path='/static')
IMAGES = glob.glob('static/data/imgs/*.png')
config = json.load(open('config.json','r'))

REPO_URL = 'https://github.com/nuwandavek/commapencil/'

# print(config)

# index
@app.route('/pencil/')
def index():
    img_id = int(request.args.get('id',0))
    if img_id<0:
        return redirect("/pencil?id=0")
    elif img_id >= len(IMAGES):
        return redirect("/pencil?id="+str(len(IMAGES)-1))
    img_name = IMAGES[img_id].split('/')[-1]
    data = {'total_images':len(IMAGES), 'img_id':img_id, 'img_name':img_name, 'config':config}
    return render_template("pencil.html", data=data)

@app.route('/hub-action/')
def hub():
    img_name = request.args.get('imgfile','')
    # print(img_name)
    if img_name=='':
        return jsonify({"out":"no-file","err":""})
    else:
        file_location = 'static/data/segz/'+img_name
        print(file_location, os.path.exists(file_location))
        process = subprocess.Popen(['git', 'status'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = process.communicate()
        if img_name in out.decode("utf-8"):
            process = subprocess.Popen(['git', 'add', file_location], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            process = subprocess.Popen(['git', 'commit', '-m','"add mask"'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            process = subprocess.Popen(['hub', 'pull-request', '-m','"'+REPO_URL + 'blob/master/static/data/imgs/' + img_name+'"'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            out, err = process.communicate()
        # print({"out":str(out.decode("utf-8")), "err": str(err.decode("utf-8") )})
        return jsonify({"out":str(out.decode("utf-8")), "err": str(err.decode("utf-8") )})



# @app.route('/crayon')
# def crayon():
#     img_id = int(request.args.get('id',0))
#     if img_id<0:
#         return redirect("/crayon?id=0")
#     elif img_id >= len(IMAGES):
#         return redirect("/crayon?id="+str(len(IMAGES)-1))
#     img_name = IMAGES[img_id].split('/')[-1]
#     data = {'total_images':len(IMAGES), 'img_id':img_id, 'img_name':img_name, 'config':config}
#     return render_template("crayon.html", data=data)

if __name__ == "__main__":
    app.run(debug=True)