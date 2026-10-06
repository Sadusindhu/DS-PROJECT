from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/recipe")
def recipe():
    return render_template("recipe.html")

@app.route("/packing")
def packing():
    return render_template("packing.html")

@app.route("/gift")
def gift():
    return render_template("gift.html")

@app.route("/message")
def message():
    return render_template("message.html")

@app.route("/headline")
def headline():
    return render_template("headline.html")

@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404

if __name__ == "__main__":
    app.run(debug=True)