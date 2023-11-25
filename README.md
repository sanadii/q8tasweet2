[![Build Status](https://github.com/sanadii/q8tasweet.git)]

# Django React/Redux/Saga Base Project

This repository includes a boilerplate project. It uses Django as backend and React as frontend.

We build on the shoulders of giants with the following technologies:

**Technologies Used:**

**Frontend**
- [React](https://github.com/facebook/react)
- [React Router](https://github.com/ReactTraining/react-router)
- [Babel](http://babeljs.io)
- [Webpack](http://webpack.github.io)
- [Redux](https://github.com/reactjs/redux)
- [React Router Redux](https://github.com/reactjs/react-router-redux)
- [bootstrap-loader](https://github.com/shakacode/bootstrap-loader)

**Backend**
- [Django](https://www.djangoproject.com/)
- [Django REST framework](http://www.django-rest-framework.org/)
- [Django REST Knox](https://github.com/James1345/django-rest-knox)
- [WhiteNoise](http://whitenoise.evans.io/en/latest/django.html)
- [Prospector](http://prospector.landscape.io/en/master/)
- [Bandit](https://github.com/openstack/bandit)
- [pytest](http://pytest.org/latest/)
- [Mock](http://www.voidspace.org.uk/python/mock/)
- [Responses](https://github.com/getsentry/responses)



## Retrieve code
* `git clone https://github.com/sanadii/q8tasweet.git`
* `cd q8tasweet`


## Configuration
Before running the project, you need to set up the environment variables. Create a `.env` file in the main `q8tasweet` folder with the following content:

```plaintext
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "your_secret_key_here"
JWT_SECRET_KEY = "your_jwt_secret_key_here"
```



* `cd q8tasweet`


## Installation
* `python -m venv venv`
* `source venv/bin/activate`  # On Windows use `venv\Scripts\activate`

## Install dependencies
* `pip install -r requirements.txt`

## Django Backend 
* `cd backend`
* `python manage.py mimakemigrations`
* `python manage.py migrate`
* `python manage.py runserver`
Access the application at http://localhost:8000/
Django Admin: http://localhost:8000/admin/



## React Js Frontend
* `cd..`
* `cd frontend`

You need to set up the environment variables for the frontend. Create a `.env` file in the main `frontend` folder with the following content:
```plaintext
# API URL Configuration
REACT_APP_PUBLIC_URL="http://127.0.0.1:8000/"
REACT_APP_MEDIA_URL="http://127.0.0.1:8000/"
REACT_APP_API_URL="http://127.0.0.1:8000/"

# Authentication and Authorization Configuration
REACT_APP_DEFAULTAUTH="jwt"
```

* `yarn install`
* `yarn start`
Visit http://localhost:3000/ to view the React app.


## Usage
Not yet

## Contributing
Not yet


## License
Not yet

## Contact
For more information or help, please contact [esanad@gmail.com] or visit [q8tasweet.com].


