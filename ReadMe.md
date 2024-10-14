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



## 🎨 Initial Mockup


![image](https://github.com/user-attachments/assets/68b8af22-963e-478f-ada5-5be8d000142a)


## 💻 User Interface

![UI](https://github.com/user-attachments/assets/2c601b92-6060-4a8f-8ed9-d52a82a07dc1)



## 📹 Screencast

[Link to the file](Screencast.mp4)



https://github.com/user-attachments/assets/872b9495-22c0-4317-baad-8424283be15d



## 🚀 How to Get Started

Follow these steps to deploy the application using **Minikube** and **Kubernetes**.

### 1. Start Minikube with Ingress Enabled
Start your Minikube cluster with enough memory and CPU, and enable the Ingress addon:

```
minikube start --memory=7790 --cpus=8 --addons=Ingress 
minikube addons enable ingress
```

### 2. Set Environment Variables
Start your Minikube cluster with enough memory and CPU, and enable the Ingress addon:

```
@FOR /f "tokens=*" %i IN ('minikube -p minikube docker-env --shell cmd') DO @%i
#or 
& minikube docker-env | Invoke-Expression
# or
minikube docker-env
```
### 3. Create a Namespace for the Application
```
kubectl create namespace ms
```

### 4. Deploy the Large Language Model (LLM)
Deploy the LLM Service within the llm folder.

First install helm on the machine (https://helm.sh/) and use the helm chart for ollama (https://github.com/otwld/ollama-helm)
```
helm repo add ollama-helm https://otwld.github.io/ollama-helm/  

helm repo update  

helm install ollama ollama-helm/ollama --namespace ms
```

Modify the values.yaml to modify the helm chart. Right now we have defined which models should be pulled at the startup of the container. There could be added more models. (Motivational-Speech-Service\llm\values.yaml)
```
helm repo update 

# navigate to the folder where the values.yaml is stored: /llm  

helm upgrade ollama ollama-helm/ollama --namespace ms --values values.yaml
```
The pod needs a few minutes to come up, because the model is already pulled.


### 5. Deploy the Text-to-Speech (TTS) Service
Build and deploy the TTS service within the tts-service folder:
```
docker build --no-cache -t tts-service .
kubectl apply -f tts-deployment.yaml -n ms
kubectl apply -f tts-service.yaml -n ms
```

### 6. Build and Deploy Other Services in the following order
```
kubectl apply -f mariadb-deployment.yaml -n ms
kubectl apply -f k8s-mariadb-service.yaml -n ms

docker build --no-cache -t my-super-web-app .
kubectl apply -f app-deployment-minikube.yaml -n ms
kubectl apply -f app-service-and-ingress.yaml -n ms
```

### 7. Access the Web App
To access the deployed web application, use the following command to retrieve the URL:
```
minikube service -n ms my-super-app-service --url
```


### 🧹 How to Undeploy
Delete the entire namespace and everything inside it:
```
kubectl delete namespace ms
```
Or if you want to delete them manually:
```
kubectl delete service my-app-mariadb-service -n ms
kubectl delete service my-super-app-service -n ms
kubectl delete service tts-service -n ms
kubectl delete service ollama -n ms

kubectl delete deployment mariadb-deployment -n ms
kubectl delete deployment my-super-app-deployment -n ms
kubectl delete deployment tts-deployment -n ms
kubectl delete deployment ollama -n ms
```

## 🛠️ Created By

- Julia Hanak
- Julia Wellbrink
- Gurleen Kaur
- Denis Trautner
