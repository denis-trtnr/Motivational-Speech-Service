## Deploy LLM-Resources
Install helm on the machine (https://helm.sh/)  
Use the helm chart for ollama (https://github.com/otwld/ollama-helm)
```
helm repo add ollama-helm https://otwld.github.io/ollama-helm/  

helm repo update  

/* all containers communication with the ollama container should be in the same namespace */
helm install ollama ollama-helm/ollama --namespace ms
```
Modify the values.yaml to modify the helm chart. Right now we have defined which models should be pulled at the startup of the container. There could be added more models. (Motivational-Speech-Service\llm\values.yaml)
```
helm repo update 
/* navigate to the folder where the values.yaml is stored */
helm upgrade ollama ollama-helm/ollama --namespace ms --values values.yaml
```

## Test Deployment
The Ollama Pod has a service with a ClusterIP. The ClusterIP should be reachable for the other pods in the cluster to start the models and send requests.

Search for ClusterIP:
```
kubectl get services -n ms
```
Here we should see a service called "ollama" and its ClusterIP.

Now we can test if we can reach the service with its ClusterIP. Therefore we start a container in the same namespace like the ollama pod for debugging with the following command:

```
kubectl run -i --tty --rm debug -n ms --image=curlimages/curl --restart=Never -- sh
```
In the shell of this pod (opens in your comamand line) you can enter the following command:

```
curl http://ClusterIP:11434
e.g.: curl http://10.109.223.133:11434

# output should be: "Ollama is running"
```

With this IP we can reach the Ollama Service out of other points and send requests to the REST API (https://github.com/ollama/ollama/blob/main/docs/api.md)   
via Python (https://github.com/ollama/ollama-python)   
or Java Script (https://github.com/ollama/ollama-js)


## Using API with Java Script
To send requests to a model, we first need to start the model. (WIE? - nicht definiert in der API Beschreibung. Befehl in der Kommandozeile: ollama run "modelname")

Wir wollen das generate Feature der Modelle nutzen und nicht das Chat Feature. 

Hierfür muss folgender Befehl mit folgenden Parametern genutzt werden:
```
ollama.generate(request)

Parameter:                  Needed values:
request <Object>: 
    - model <string>        llama3.2:1b
    - prompt <string>       prompt_var (siehe unten)
    - format <string>       json
    - stream <boolean>      False
    - options
        - temperature       tem_value
```
Die Temperature ist ein Zahlenwert zwischen 0 und 1. Dieser Wert muss umgewandelt werden aus der Nutzereingabe im Frontend.

### Prompts
We want 3 different prompts so that we get 3 different answers. Therefore we will send 3 requests to the model.

#### Prompt 1
```
Basierend auf den Kinderbüchern über Connie. Schreibe mir eine kurze motivierende Connie-Geschichte zu den folgenden 3 Stichwörtern: var_wort1, var_wort2, var_wort3


Based on the children's books about Connie. Write me a short motivational Connie story using the following three keywords: exam, math, complicated. Then, at the end, say that the person can overcome their problem just like Connie. Please answer in english.
```

#### Prompt 2
```
Ich bin aktuell sehr demotiviert. Kannst du mir eine kurze Motivationsrede schreiben im Kontext der folgenden 3 Wörter: var_wort1, var_wort2, var_wort3. Die Rede sollte maximal 100 Zeichen umfassen.

The user is currently feeling very demotivated. Can you write a short motivational speech in the context of the following three words: exam, math, complicated? The speech should be between 60 and 100 characters long.
```

#### Prompt 3
```
Kannst du mir einen motivierenden kurzen Reim oder ein Gedicht schreiben, dass mich motivieren kann. Der Kontext des Reims/Gedichts sollen die folgenden 3 Wörter sein: var_wort1, var_wort2, var_wort3

Can you write me a short motivational rhyme or poem to inspire me? The context of the rhyme/poem should include the following three words: exam, math, complicated.
```