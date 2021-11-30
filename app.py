from flask import Flask, json, jsonify, render_template, request, redirect
import os
from flask_sqlalchemy import SQLAlchemy
import requests
import csv
import joblib


#################################################
# Flask Setup
#################################################

app = Flask(__name__)

#################################################
# Database Setup
#################################################
# Loading Machine Learning Model and Scalers
loadedModel = joblib.load('./models/price_model_supportVectorMachine_rbf.sav')
loadedxScaler = joblib.load('./models/price_model_SVR_xscaler.sav')
loadedyScaler = joblib.load('./models/price_model_SVR_yscaler.sav')

print(loadedModel)
print(loadedxScaler)
print(loadedyScaler)


# uri = os.getenv("DATABASE_URL", "")
# if uri.startswith("postgres://"):
#     uri = uri.replace("postgres://", "postgresql://", 1)
# app.config['SQLALCHEMY_DATABASE_URI'] = uri or "sqlite:///db.sqlite"

# # Remove tracking modifications
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)


#################################################
# Flask Routes
#################################################


@app.route("/")
def home_page():
    return render_template("index.html")


#################################################

@app.route("/routes")
def routes():

    return (
        f"#################################################################################<br/>"
        f"Welcome to the Property Market API of Perth, Western Australia!<br/>"
        f"#################################################################################<br/>"
        f"Here are the list of available routes:<br/>"
        f"#################################################################################<br/>"
        f"/marketanalysis -------------> Returns analysis results and visualisations.<br/>"
        f"<br/>"
        f"/ml_analysis -------------> Returns machine learning results.<br/>"
        f"<br/>"
        f"/leaflet ------------------> Returns a Leaflet map visualisation.<br/>"
        f"<br/>"
        f"/avgprice -------------> Returns a JSON list of the Average Price per Land Area.<br/>"
        f"<br/>"
        f"/maindata ------------------> Returns a JSON list of the main dataset.<br/>"
        f"<br/>"
        f"/geojson ------------------> Returns a GEOJSON list of WA suburbs.<br/>"
    )

#################################################


@app.route("/ml_analysis", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        bed = request.form["bedname"]
        bath = request.form["bathname"]
        land = request.form["landname"]
        floor = request.form["floorname"]
        distCBD = request.form["cbdname"]
        buildYear = request.form["builtname"]
        sellingYear = request.form["soldname"]
        app.logger.info(bed)

        user_input = [[bed, bath, land, floor,
                       buildYear, distCBD, sellingYear]]

        scaled_userinput = loadedxScaler.transform(user_input)
        prediction = loadedModel.predict(scaled_userinput)
        descaled_prediction = loadedyScaler.inverse_transform(
            prediction.reshape(-1, 1))

        price_predicted = int(round(descaled_prediction[0][0]/1000)*1000)
        prediction_dict = {"predicted_price": price_predicted, "Bedrooms": bed,
                           "Bathrooms": bath, "Land": land, "Floor": floor, "Dist_CBD": distCBD,
                           "Year_Built": buildYear, "Year_Sold": sellingYear}
    else:
        prediction_dict = {"prediction_price": "hit predict"}
    return render_template("machine_learning.html", dict=prediction_dict)


# #################################################


@app.route("/ml_analysis")
def prediction():

    return render_template("machine_learning.html")

# #################################################


@app.route("/marketanalysis")
def marketanalysis_page():
    return render_template("market_analysis.html")

# #################################################


@app.route("/leaflet")
def leaflet_page():
    return render_template("leaflet.html")

#################################################


@app.route("/maindata")
def maindata_func():
    CSV_URL = 'https://perth-housing.s3.ap-southeast-2.amazonaws.com/cleaned_perth_market.csv'

    with requests.Session() as s:
        download = s.get(CSV_URL)

        decoded_content = download.content.decode('utf-8')

        cr = csv.reader(decoded_content.splitlines(), delimiter=',')
        my_list = list(cr)

    address = []
    suburb = []
    price = []
    bedrooms = []
    bathrooms = []
    land_area = []
    floor_area = []
    build_year = []
    cbd_dist = []
    year_sold = []
    nearest_sch = []
    nearest_sch_dist = []

    for i in range(1, len(my_list)):
        address.append(my_list[i][0])
        suburb.append(my_list[i][1])
        price.append(my_list[i][2])
        bedrooms.append(my_list[i][3])
        bathrooms.append(my_list[i][4])
        land_area.append(my_list[i][6])
        floor_area.append(my_list[i][7])
        build_year.append(my_list[i][8])
        cbd_dist.append(my_list[i][9])
        year_sold.append(my_list[i][17])
        nearest_sch.append(my_list[i][15])
        nearest_sch_dist.append(my_list[i][16])

    property_info = list(zip(address, suburb, price, bedrooms, bathrooms,
                             land_area, floor_area, build_year, cbd_dist, year_sold,
                             nearest_sch, nearest_sch_dist))

    property_info_list = []
    for row in property_info:
        property_info_dict = {"Address": row[0], "Suburb": row[1], "Price": int(row[2]), "Bedrooms": int(row[3]), "Bathrooms": int(
            row[4]), "Land_Area": int(row[5]), "Floor_Area": int(row[6]), "Build_Year": int(row[7]), "CBD_Dist": int(row[8]), "Year_Sold": int(row[9]),
            "Nearest_SCH": row[10], "Nearest_SCH_Dist": float(row[11])}
        property_info_list.append(property_info_dict)

    return jsonify(property_info_list)

#################################################


@app.route("/avgprice")
def avgPrice_func():

    CSV_URL = 'https://perth-housing.s3.ap-southeast-2.amazonaws.com/avg_price_suburb.csv'

    with requests.Session() as s:
        download = s.get(CSV_URL)

        decoded_content = download.content.decode('utf-8')

        cr = csv.reader(decoded_content.splitlines(), delimiter=',')
        my_list = list(cr)

    suburb = []
    price_land = []
    for i in range(1, len(my_list)):
        suburb.append(my_list[i][0])
        price_land.append(my_list[i][1])

    suburb_avgprice = list(zip(suburb, price_land))

    avg_price_list = []
    for row in suburb_avgprice:
        avg_price_dict = {"Suburb": row[0], "Price_Land": float(row[1])}
        avg_price_list.append(avg_price_dict)

    return jsonify(avg_price_list)


#################################################
@app.route("/geojson")
def geo_func():

    geo_data = requests.get(
        "http://perth-housing.s3.ap-southeast-2.amazonaws.com/suburb-10-wa.geojson")

    return jsonify(geo_data.json())

#################################################


@app.route("/modelerror")
def machinelearning_model_func():
    CSV_URL = 'https://perth-housing.s3.ap-southeast-2.amazonaws.com/models_error.csv'

    with requests.Session() as s:
        download = s.get(CSV_URL)

        decoded_content = download.content.decode('utf-8')

        cr = csv.reader(decoded_content.splitlines(), delimiter=',')
        my_list = list(cr)

    model = []
    training_score = []
    testing_score = []

    for i in range(1, len(my_list)):
        model.append(my_list[i][0])
        training_score.append(my_list[i][1])
        testing_score.append(my_list[i][2])

    model_info = list(zip(model, training_score, testing_score))

    model_info_list = []
    for row in model_info:
        model_info_dict = {
            "Model": row[0], "Training_score": row[1], "Testing_score": row[2]}
        model_info_list.append(model_info_dict)

    return jsonify(model_info_list)


if __name__ == "__main__":
    app.run(debug=True)
