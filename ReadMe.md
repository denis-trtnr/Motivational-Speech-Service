# Motivational Speech Generation Service

The following cloud application provides a motivational speech generation platform, leveraging a Large-Language Model (LLM) and Text-to-Speech (TTS) technology. The user can have a text created for the speech and can provide some input and select a mood. After text creation the user can review the text, can give feedback to the text and can generate an audio from this text. The user also have the opportunity to choose from a suggestion list with motivation speeches, that are stored in the database.

## 📋 Concrete Features

This section outlines the functionality that each component of the system implements:

### 🎨 **User Interface**
- **Text Generator**: Users can input text and select a mood to generate motivational speeches.
- **Text Preview**: Users can preview the generated text before converting it to audio.
- **Motivational Speech Suggestions**: Pre-stored motivational speeches are fetched from the database as suggestions.
- **Play Audio Button**: Users can listen to the generated motivational speech.

### 🧠 **Large-Language-Model (LLM)**
- **Input**: User input combined with a chosen mood.
- **Output**: Custom-generated motivational speeches tailored to the input and mood.

### 🔊 **Text-to-Speech (TTS)**
- **Input**: The generated motivational speeches from the LLM.
- **Output**: An audio file (WAV format) of the speech.

### 🗄️ **Database with Cache**
- **Storage**: Stores user queries, generated speeches, and their respective audio files.
- **Caching**: Uses Memcached to optimize access and retrieval of frequently used data.

### 🔀 **Loadbalancer**
- **Ingress Loadbalancer**: Routes external traffic to the web application within the Kubernetes cluster.


## 🏗️ Architecture

![architecture_motivational_speech_service](https://github.com/user-attachments/assets/6dd2ddd6-db22-4c8f-bf07-d957e3009a97)



## 💻 The application


![image](https://github.com/user-attachments/assets/68b8af22-963e-478f-ada5-5be8d000142a)

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

##Deploy tts in folder tts-service
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
minikube service -n ms my-super-app-service --url

##Undeploy
kubectl delete -f app-service-and-ingress.yaml -n ms
kubectl delete -f app-deployment-minikube.yaml -n ms
kubectl delete -f k8s-mariadb-service.yaml -n ms
kubectl delete -f mariadb-deployment.yaml -n ms
```
