import io
from flask import Flask, request, jsonify, send_file
from transformers import BarkModel, AutoProcessor
from datetime import datetime
import scipy
import torch
import os
import soundfile as sf
import numpy as np

app = Flask(__name__)

# Load the smaller Bark model and tokenizer
model = BarkModel.from_pretrained("suno/bark-small")
processor = AutoProcessor.from_pretrained("suno/bark")
device = "cpu"
model = model.to(device)
sampling_rate = model.generation_config.sample_rate

# Ensure the results folder exists
if not os.path.exists('results'):
    os.makedirs('results')

@app.route('/tts', methods=['POST'])
def text_to_speech():
    data = request.get_json()

    # Get the text from the request body
    text = data.get('text', '')
    speaker = data.get('speaker', None)
    if not text:
        return jsonify({"error": "Text is required"}), 400
    
    #Different voices: https://suno-ai.notion.site/8b8e8749ed514b0cbf3f699013548683?v=bc67cff786b04b50b3ceb756fd05f68c

    try:
        # Tokenize input text
        if speaker:
            inputs = processor(text, return_tensors="pt", voice_preset=speaker)
        else: 
            inputs = processor(text, return_tensors="pt")

        # Generate speech
        with torch.no_grad():
            speech_output = model.generate(**inputs.to(device))


        # Create a timestamp for the filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"output_{timestamp}.wav"
        """
        # Save the generated audio using scipy
        output_path = os.path.join("results", filename)
        scipy.io.wavfile.write(output_path, rate=sampling_rate, data=speech_output[0].cpu().numpy())

        return jsonify({"message": "Audio generated successfully", "file": output_path}), 200
        """

        # Convert the generated tensor to numpy array
        audio_data = speech_output[0].cpu().numpy()

        # Create an in-memory buffer to store the audio data
        buffer = io.BytesIO()
        
        # Save the generated audio data to the buffer in WAV format using soundfile
        sf.write(buffer, audio_data, samplerate=sampling_rate, format='WAV')
        buffer.seek(0)  # Move the buffer position to the start

        # Return the audio as a file-like object
        return send_file(buffer, mimetype='audio/wav', as_attachment=True, download_name=filename)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
