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

![image](https://github.com/user-attachments/assets/68b8af22-963e-478f-ada5-5be8d000142a)


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
- Ingress Loadbalancer for the Webapp


![architecture_motivational_speech_service](https://github.com/user-attachments/assets/6dd2ddd6-db22-4c8f-bf07-d957e3009a97)




### How to start the app:

```
## Start Deployment

minikube start --memory=7790 --cpus=8 --addons=Ingress 
minikube addons enable ingress

## Send env variables
@FOR /f "tokens=*" %i IN ('minikube -p minikube docker-env --shell cmd') DO @%i
#or 
& minikube docker-env | Invoke-Expression
# or
minikube docker-env

# create namespace for application
kubectl create namespace ms

##Deploy llm --> see read.me in folder llm

##Deploy tts in folder tts 
docker build --no-cache -t tts-service .
kubectl apply -f tts-deployment.yaml -n ms
kubectl apply -f tts-service.yaml -n ms

#Build other deployments and services
docker build --no-cache -t my-super-web-app .
kubectl apply -f mariadb-deployment.yaml -n ms
kubectl apply -f k8s-mariadb-service.yaml -n ms
kubectl apply -f app-deployment-minikube.yaml -n ms
kubectl apply -f app-service-and-ingress.yaml -n ms



##Start website connection
minikube service my-super-app-service --url

##Undeploy
kubectl delete -f app-service-and-ingress.yaml -n ms
kubectl delete -f app-deployment-minikube.yaml -n ms
kubectl delete -f k8s-mariadb-service.yaml -n ms
kubectl delete -f mariadb-deployment.yaml -n ms
```
