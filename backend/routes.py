from flask import jsonify, request
import requests
from dotenv import load_dotenv
import os

load_dotenv()

def routes(app, mongodb):
    OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')

    @app.route('/api/get_weather', methods=['GET'])
    def get_weather_data():
        location = request.args.get('location')
        search_type = request.args.get('type')

        # Error message if no location is entered
        if not location:
            return jsonify({
                'status': 'error',
                'message': 'Location is missing!'
            }), 400
        
        try:
            if search_type == 'zip':
                search_url = f'https://api.openweathermap.org/data/2.5/weather?zip={location}&units=metric&appid={OPENWEATHER_API_KEY}'
                w_response = requests.get(search_url)

                if w_response.status_code != 200:
                    return jsonify({
                        'status': 'error',
                        'message': 'Invalid zip code'
                    }), 404

                w_data = w_response.json()
                location = w_data['name']
                lat = w_data['coord']['lat']
                lon = w_data['coord']['lon']
            
            else:
                geocoding_url = f'http://api.openweathermap.org/geo/1.0/direct?q={location}&limit=1&appid={OPENWEATHER_API_KEY}'
                geo_response = requests.get(geocoding_url)

                if geo_response.status_code != 200:
                    return jsonify({
                        'status': 'error',
                        'message': 'Failed to search city'
                    }), 404
                
                geo_data = geo_response.json()

                if not geo_data:
                    return jsonify({
                        'status': 'error',
                        'message': 'Invalid city'
                    })
                lat = geo_data[0]['lat']
                lon = geo_data[0]['lon']
                
                search_url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={OPENWEATHER_API_KEY}'
                w_response = requests.get(search_url)
                w_data = w_response.json()
            
            format_data = {
                'location': {
                    'name': location,
                    'lat': lat,
                    'lon': lon
                },
                'weather': {
                    'main': w_data['weather'][0]['main'],
                    'description': w_data['weather'][0]['description'],
                    'icon': w_data['weather'][0]['icon'],
                    'temperature': {
                        'current': w_data['main']['temp'],
                        'feels_like': w_data['main']['feels_like'],
                        'min': w_data['main']['temp_min'],
                        'max': w_data['main']['temp_max']
                    },
                    'humidity': w_data['main']['humidity'],
                    'wind': {
                        'speed': w_data['wind']['speed'],
                        'direction': w_data['wind']['deg']
                    }
                }
            }

            return jsonify(format_data)
        
        except requests.exceptions.RequestException as e:
            return jsonify({
                'status': 'error',
                'message': 'Failed fetching weather data'
            }), 500