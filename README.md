# Arquivo de Sentimentos

![](https://i.imgur.com/Hhjk4x9.png)
> *Arquivo de Sentimentos* provides the means to analyze the opinions, using sentiment analysis, of news media over the years

In the fast age we are living in, it can be challenging to keep up with recent events, and with so many different sources, it also becomes troublesome to know which are credible. This project aims to help the users form a more informed opinion on their own and avoid misinformation as a result.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contribute](#contribute)
- [License](#license)

## Background

Nowadays the users of the Internet have access to several resources people could only dream of decades ago. In the fast age we are living in, it can be challenging to keep up with recent events and even harder to keep track of how things evolve. With so many different source, it also becomes troublesome to know which are credible and which are not.

This project shall provide a means to analyze the opinions, using sentiment analysis, of news media (comparing them) over the years which will help the users form a more informed opinion on their own and avoid misinformation as a result. *Arquivo de Sentimentos* shall also be capable of bias detection in online publications. By comparing the underlying sentiment and how often they appear in given publications a pattern can be established exposing the writers' biases and how they shift over time.


## Install

```./install.sh```

* Creates a virtual environment for the Flask backend and installs the necessary packages
* Installs the node modules needed for the React frontend


## Configuration

In order to have the project fully running it will be necessary to connect it to both a **Google Cloud** platform and a **MongoDB** database. To achieve this some enviroment variables will need to be set.

### Google Cloud

An `apikey.json` file in the root of the project with the following format:

```
{
  "type": "service_account",
  "project_id": "XXX",
  "private_key_id": "XXX",
  "private_key": "XXX",
  "client_email": "XXX",
  "client_id": "XXX",
  "auth_uri": "XXX",
  "token_uri": "XXX",
  "auth_provider_x509_cert_url": "XXX",
  "client_x509_cert_url": "XXX"
}
```

For more information consult the [Google Cloud page](https://cloud.google.com/natural-language/docs/setup)

### MongoDB

An `.env` file in the folder `api/` with the following format:

```
FLASK_APP=api.py
FLASK_ENV=development
MONGO_ADDRESS=XXX
```

Replacing the `MONGO_ADDRESS` with the MongoDB database link access.
For more information consult the [MongoDB Documentation](https://docs.atlas.mongodb.com/connect-to-cluster/#connect-to-a-cluster)

## Usage

```./run.sh```

* Exports the Google API credentials and the enviroment variables
* Activates the virtual environment and runs the backend
* Runs the frontend

If everything works properly, you should see the following screen:

![Main Page](https://imgur.com/kkw2XzC.png)

## Contribute

Please refer to the [contributing.md](Contributing.md)  file for information about how to get involved. We welcome issues, questions, and pull requests.

## Maintainers
- Rafael Varela : joao.rafael.varela@gmail.com
- Tiago Verdade: tcverdade@hotmail.com
- José Silva: josesilva1211@gmail.com

## License

This project is licensed under the terms of the [CC-BY-NC-SA-4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) open source license. Please refer to [LICENSE](LICENSE) for the full terms.

