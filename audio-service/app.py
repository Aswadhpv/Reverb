import io
from flask import Flask, request, send_file, jsonify
from pydub import AudioSegment
import numpy as np
from pedalboard import Pedalboard, Reverb, Chorus
import soundfile as sf

app = Flask(__name__)

@app.route('/plugins', methods=['GET'])
def plugins():
    return jsonify(['Reverb','Chorus'])

@app.route('/process', methods=['POST'])
def process_audio():
    data = request.get_json()
    audio_bytes = bytes(data['audio'], 'latin1')
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format='wav')
    samples = np.array(audio.get_array_of_samples(), dtype=np.float32) / 32768.0

    # choose plugin
    board = Pedalboard([Reverb() if data['plugin']=='Reverb' else Chorus()])
    effected = board(samples, audio.frame_rate)

    effected_int16 = np.int16(effected * 32767)
    buf = io.BytesIO()
    sf.write(buf, effected_int16, audio.frame_rate, format='WAV')
    buf.seek(0)
    return send_file(buf, mimetype='audio/wav')

if __name__ == '__main__':
    app.run(port=6000)
