from flask import jsonify

def routes(app, mongodb):
    @app.route('/api/test', methods=['GET'])
    def test():
        return jsonify({
            'message': 'Hello from flask backend',
            'status': 'success'
        })