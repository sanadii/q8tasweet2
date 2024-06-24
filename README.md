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

* `$ git clone https://github.com/seedstars/django-react-redux-base.git`
* `$ cd django-react-redux-base`
* `$ git submodule init`
* `$ git submodule update`
* `$ ./scripts/get_static_validation.sh`


Remember that when you copy this repository for a new project you need to add the scripts external module using:

* `$ git submodule add https://github.com/Seedstars/culture-scripts scripts`

NOTE: This is only needed in case you copy this code to a new project. If you only clone or fork the repository, the submodule is already configured


## Installation

**Clone the repository:**

git clone https://github.com/sanadii/q8tasweet.git


## Backend
** create and activate Virtual Environment**

For Windows:
python -m venv venv
venv\Scripts\activate

For Unix/Linux/MacOS:
python3 -m venv venv
source venv/bin/activate


** Install Django Requirments**

pip install -r requirments.txt
cd backend
pip install -r requirements.txt

**Do migration**
python manage.py makemigrations
python manage.py migrate


**Run the backend server**
once migrations is done

py manage.py runserver


## Frontend

Open new terminal to run the frontend
Navigate to the project directory:
cd..
cd frontend
yarn install


Once the installation is complete, start the frontend server:

yarn start



### Running NO DOCKER

**NodeJS tooling**

* `$ wget -qO- https://deb.nodesource.com/setup_6.x | sudo bash -`
* `$ apt-get install --yes nodejs`
* `$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
* `$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
* `$ sudo apt-get update && sudo apt-get install yarn`

**Compile and run project**

There are commands you need to compile javascript and run project. Ideally `yarn run dev` should be run in another console because it blocks it.

* `$ yarn `
* `$ yarn run dev`  # will run webpack with watch and compile code as it changes

* `$ virtualenv -p /usr/bin/python3 virtualenv`
* `$ source virtualenv/bin/activate`
* `$ pip install -r py-requirements/dev.txt`

* `$ cd src`
* `$ python manage.py migrate`
* `$ python manage.py loaddata fixtures.json`
* `$ python manage.py runserver`

Then open your browser the page: http://localhost:8000/ If all goes ok you should see a React single page app. 


### Running DOCKER

We use Docker as a development environment. For production, we leave you to set it up the way you feel better,
although it is trivial to extrapolate a production environment from the current docker-compose.yml.

* Install [Docker](https://www.docker.com/products/overview) and [Docker Compose](https://docs.docker.com/compose/install/).
* `$ docker-compose build`
* `$ docker-compose up`

To stop the development server:

* `$ docker-compose stop`

Stop Docker development server and remove containers, networks, volumes, and images created by up.

* `$ docker-compose down`

You can access shell in a container

* `$ docker ps  # get the name from the list of running containers`
* `$ docker exec -i -t djangoreactreduxbase_frontend_1 /bin/bash`

The database can be accessed @localhost:5433

* `$ psql -h localhost -p 5433 -U djangoreactredux djangoreactredux_dev`


## Accessing Website

The project has CORS enabled and the URL is hard-coded in javascript to http://localhost:8000 
For login to work you will to use this URL in your browser.


## Testing

To make sure the code respects all coding guidelines you should run the statics analysis and test scripts before pushing any code.

Frontend (javascript tests)

* `$ ./scripts/test_local_frontend.sh`

Backend (django/python tests)

* `$ ./scripts/test_local_backend.sh`

Please take into account that test_local_backend.sh runs py.test with `--nomigrations --reuse-db` flags to allow it be performant. Any time you add a migration please remove those flags next time you run the script.

### Static analysis


Frontend (javascript static analysis)

* `$ ./scripts/static_validate_frontend.sh`

Backend (django/python static analysis)

* `$ ./scripts/static_validate_backend.sh`

## Deployment in Production

We deploy all our production code using Kubernetes. Explaining how to do deployments is beyond the scope of this boilerplate. 

Here's a great article from digital ocean on how to deploy django project in a VM: https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-16-04 



## Screenshots

Here are some screenshots of the boilerplate project.

![Screenshot01][1]  

[1]: ./screenshots/screenshot_01.png

![Screenshot02][2]  

[2]: ./screenshots/screenshot_02.png


## Gotchas in Docker

* This project uses NodeJS v6.x (stable) and yarn
* The development server takes longer than the django server to start, as it has to install the javascript dependencies (if not already installed) and fire webpack. This means that after the django server starts, you should wait that webpack finishes compiling the .js files.
* If your IDE has builtin language support for python with auto-imports (e.g. PyCharm), you can create a virtualenv and install the py-requirements.
* If you are annoyed by docker creating files belonging to root (which is Docker's intended behaviour), you can run `# chown -hR $(whoami) .` before firing up the server.


## Contributing
Not yet


## License
Not yet

## Contact
For more information or help, please contact [esanad@gmail.com] or visit [q8tasweet.com].


