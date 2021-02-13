from flask import *

app = Flask(__name__)

@app.route('/alarms', methods=['GET','POST'])

def get_alarms():
	if request.method == 'POST':
		ty = request.json['type']
		alarm_type = request.json['alarm_type']
		alarm_time = request.json['alarm_time']
		lat = request.json['latitude']
		lon = request.json['longitude']
		flist = request.json['file_list']
		return jsonify({'type':ty, 'alarm_type':alarm_type, 'alarm_time':alarm_time, 'latitude':lat, 'longitude':lon, 'file_list':flist})

if __name__=='__main__':
	app.run(debug=True)