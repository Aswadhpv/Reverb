import io
import ffmpeg
from flask import Flask, request, send_file, jsonify
from pedalboard import Pedalboard, Reverb, Chorus
import soundfile as sf

app = Flask(__name__)

@app.route('/plugins', methods=['GET'])
def plugins():
    return jsonify(['Reverb', 'Chorus'])

@app.route('/process', methods=['POST'])
def process_audio():
    data = request.get_json()
    audio_bytes = bytes(data['audio'], 'latin1')

    input_buffer = io.BytesIO(audio_bytes)

    # decode audio to WAV PCM float32 mono 44100 Hz
    out, err = (
        ffmpeg
        .input('pipe:0')
        .output('pipe:1', format='wav', acodec='pcm_f32le', ac=1, ar=44100)
        .run(input=input_buffer.read(), capture_stdout=True, capture_stderr=True)
    )

    # load into numpy array
    buf = io.BytesIO(out)
    samples, samplerate = sf.read(buf)

    # apply plugin
    board = Pedalboard([Reverb() if data['plugin'] == 'Reverb' else Chorus()])
    effected = board(samples, samplerate)

    # write processed audio
    buf_out = io.BytesIO()
    sf.write(buf_out, effected, samplerate, format='WAV')
    buf_out.seek(0)

    return send_file(buf_out, mimetype='audio/wav')

if __name__ == '__main__':
    app.run(port=6000)
