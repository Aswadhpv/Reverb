# 🔊 Audio Service - Reverb

Python (Flask) backend for audio processing plugins like reverb, chorus, equalizer.

## 🚀 Setup
```bash
cd audio-service
pip install -r requirements.txt
python app.py
```

## 📁 Endpoints
- `POST /process` - Accepts WAV buffer + plugin name, returns processed WAV

## 🔌 Supported Plugins
- `Reverb`
- `Chorus`
- `Equalizer`

## 🔧 Notes
- Input must be a WAV file (converted in frontend)
- Used by main backend at `/api/collaboration/process`
