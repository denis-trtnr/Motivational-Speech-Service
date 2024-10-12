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
- Loadbalancer for all components (LLS, TTS, Cache)



  ![image](https://github.com/user-attachments/assets/bbd017e6-d451-45e6-af28-1a78a0b5d582)


### How to start that shit:
```
minikube start --addons=Ingress
& minikube docker-env | Invoke-Expression
# oder
minikube docker-env
```

```
## Deployment starten
minikube start --addons=Ingress
minikube addons enable ingress
@FOR /f "tokens=*" %i IN ('minikube -p minikube docker-env --shell cmd') DO @%i
docker build -t my-super-web-app .
kubectl apply -f mariadb-deployment.yaml
kubectl apply -f k8s-mariadb-service.yaml
kubectl apply -f app-deployment-minikube.yaml
kubectl apply -f app-service-and-ingress.yaml
kubectl get all

##Testdaten anlegen (solange wir noch nichts in die DB speichern
kubectl get pods
kubectl exec -ti <mariadb-deployment-POD-ID> -- mariadb -u root --password=mysecretpw
USE motivationalspeechsdb;
INSERT INTO motivational_speeches (input, mood, speech_proposal) VALUES ('Test 1', 'sad', 'LALALA');
INSERT INTO motivational_speeches (input, mood, speech_proposal) VALUES ('Test 2', 'sad', 'LALALA');
INSERT INTO motivational_speeches (input, mood, speech_proposal) VALUES ('Test 3', 'sad', 'LALALA');
SELECT input, mood, speech_proposal FROM motivational_speeches LIMIT 10;
exit

##Webseite öffnen --> da werden jetzt die eingefügten Daten angezeigt
minikube service my-super-app-service --url 

##Undeploy
kubectl delete -f app-service-and-ingress.yaml
kubectl delete -f app-deployment-minikube.yaml
kubectl delete -f k8s-mariadb-service.yaml
kubectl delete -f mariadb-deployment.yaml
```
