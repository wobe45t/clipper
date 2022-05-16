from google.cloud import speech

def transcribe_file(speech_file, language_code='en-US'):
    """Transcribe the given audio file."""

    client = speech.SpeechClient()

    content = speech_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.FLAC,
        language_code=language_code,
        # enable_automatic_punctuation=True,
    )

    response = client.recognize(config=config, audio=audio)
    transcript = ''
    for result in response.results:
        # The first alternative is the most likely one for this portion.
        transcript += result.alternatives[0].transcript

    return transcript
