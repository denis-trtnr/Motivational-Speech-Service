# Cloud Application: Motivational Speech

Idea: Cloud Service Application which creates a motivation speech for the user. 
The user can have a text created for the speech and can provide some input and select a mood. 
After text creation the user can review the text, can give feedback to the text and can generate an audio from this text.
The user also have the opportunity to choose from a suggestion list with motivation speeches, that are stored in the database.

Components:
- User Interface
- Large-Language-Model
- Text-To-Speech
- Database with Cache
- Loadbalancer


## Concrete Features

This section describes the feature / funconality that the components realize.


### User Interface 
- Text generator with input and mood field
- Text preview for audio generating
- Motivation speech suggestion from database
- Button to play audio
- Button to download audio 


### Large-Language-Model 
- Input: User input and choosen mood
- Output: Motivational speechs


### Text-To-Speech 
- Input: Motivational speechs
- Output: Audiofile


### Database with Cache 
- Stores queries, speeches and audios


### Loadbalancer 
- Loadbalancer for all components (LLS, TTS, Cache)

  
