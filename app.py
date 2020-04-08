from flask import Flask, render_template
from flask_restful import Api
import requests

# ============ app configs ============= #

app = Flask(__name__)
api = Api(app)


# ============ not found ============= #

@app.errorhandler(404)
def page_not_found(e):
    return render_template("not_found.html",
                           message="Oops. Looks something's wrong. Check the spelling and try again"), 404


# ============ app routes ============= #

@app.route("/confirm/<string:tag_lobby>")
def confirm_mail(tag_lobby):
    response = requests.get("https://dubblocksite.herokuapp.com/get_match_status/" + tag_lobby)
    j_response = response.json()
    if int(j_response) == 0:  # se prepartita
        pass
    elif int(j_response) == 1:  # se in partita
        pass
    elif int(j_response) == 2:  # se non esiste
        pass

# ============ ### ============= #

if __name__ == "__main__":
    app.run(port=60000, debug=True)
