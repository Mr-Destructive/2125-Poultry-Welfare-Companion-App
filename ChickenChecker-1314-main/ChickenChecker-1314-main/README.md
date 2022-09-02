# ChickenChecker README
# Release Notes
### Version 1.0.0
#### New Features
- Can generate a detailed PDF report of farm’s collective health
- Generates a nightly summary when the status of one of the houses changes
- Show heatmap timelapse for each house in a farm to asses biosecurity risks
- Farmers/integrators receive a live/current update of their houses/farms when they restart/refresh the app

#### Bug Fixes 
- Fixed heatmap position with respect to title jitter
- Fixed nightlyreport scaling for mobile
- Fixed report button behavior
- Properly and dynamically linked assets from client to server, specifically heatmap gif images
- Established procedure and code to interface with expo go app

#### Known Issues
- The graph is more representative of data than the heatmap because of a coloring issue for levels 3-5

### Version 0.4.0
#### New Features

- Created a "Nightly Summary" feature showing change in status levels for each house and other information
- Update email address and/or password in settings
- Heatmap data is presented for each house in the farm
- Created analysis/line graph of data over time to predict and assess potential issues

#### Bug Fixes
- N/A

#### Known Issues
- Heatmaps, in correspondence with database, are not at desired time interval (15 min Data vs Hourly Data)

### Version 0.3.0
#### New Features

- House view contains useful data
- House view presents visuals based on database data
- Heatmap shows spatial spread of disease
- Created time-based analysis of spread of disease
- Settings screen contains list of buttons to navigate to associated screens

#### Bug Fixes
- N/A

#### Known Issues
- Heatmap serialization for image does not work
- Heatmap is continuous but it should be discrete via client specification

### Version 0.2.0
#### New Features
- Log in page has user management/authentication and failed log in authentication
- Django backend setup 
- Front end can make requests to the API to use data from database
- Integrators can add and delete farms 
- Farm View displays house statuses at a glance
- House View for each house in the farm displays data

#### Bug Fixes
- Fixed adding coordination selection for Complex View farm elements
- Fixed adding Map View

#### Known Issues
- Data is not real

### Version 0.1.0
#### New Features
- Log in page for farmers and integrator users
- Farm View page with House IDs (e.g. House A, House B, etc..)
- House drop-down lists displaying flock age, status level, and house view buttons and colors
- Complex View page developed

#### Bug Fixes
- N/A

#### Known Issues
- Map pins are not functional

# ChickenChecker Installation Guide

This software was written as a proof of concept user platform for AudioT's monitor data. The users, farms, complexes, and houses are all fabricated for the purposes of demoing the capacity of the monitors to identify and assess biosecurity risks. The data used for the monitors (in the demo we showed Alex Freeman House 5 and the corresponding heatmap) was interpolated and formatted for our purposes based on real data provided by AudioT.

## Development Setup
The ChickenChecker repository has three major subdirectories:
1. `ChickenCheckerApp/` contains the React Native frontend code. We use Expo to host and manage the application.
2. `server/` contains the Django server settings and specifications.
3. `core/` is the backend for the ChickenChecker app and is where all the business logic code exists.


### Prerequisites
1. Clone the ChickenChecker respository. You can use the `git clone https://github.com/elenathornton/ChickenChecker-1314.git` command or use GitHub Desktop.
2. Download [node.js](https://nodejs.org/en/) LTS
3. Download [Python 3.10+](https://www.python.org/downloads/)
3. Set up a virtual environment. Resources for [MacOS](https://realpython.com/python-virtual-environments-a-primer/#create-it) and [Windows](https://docs.python.org/3/library/venv.html) are linked.

### Dependencies
Node provides npm (node package manager) and Python provides pip for project dependency management. All the project dependencies that have been used are listed in `/ChickenCheckerApp/package.json` for React Native packages and `ChickenChecker/requirements.txt` for Python packages.  To install all the required dependencies, do the following steps.
1. Under `ChickenChecker` run `pip install -r requirements.txt` in the terminal
2. `cd ChickenCheckerApp` to navigate to the React Native app
3. `npm install` 

Note: Dependencies change throughout development, whenever a new dependency is installed you should repeat the above steps to ensure that your environment is up to date. Node automatically updates `package.json` as packages are installed, but `requirements.txt` must be maintained using the `pip freeze > requirements.txt` command.

### Run
Launching the development mode of the application requires two terminals open. One terminal is for running the React Native Expo server. The second terminal is for running the Django server.

To launch the backend (in the other terminal),
1. Be in the root directory `ChickenChecker/`
2. `python manage.py runserver`


To launch the front end (in one terminal),
1. `cd ChickenCheckerApp`
2. `npm install`
3. `expo start`
This should open window for Expo that allows you to open the application and test on the web or different emulated devices.

To run the front end on an actual mobile device,
1. Download the Expo Go mobile app from your device's respective app store. 
2. Start a mobile hotspot on your computer and validate that it works by connecting with another device (ie the phone running Expo Go).
3. Use `ipconfig` to find the local hotspot host's IP address.
4. Launch the Django server using `python manage.py runserver <IP address of hotspot>:8000/`.
5. Change the `global.baseURL` variable in `App.js` to `<IP address of hotspot>:8000/`.
6. Launch Expo using `expo start`.
7. Press `d` to open the Developer Website. On this site, change the `Connection` type from `LAN` to `Tunneling`. 
8. Use the phone's camera app to scan the provided QR code.

### Troubleshooting

#### React Native/Expo
- If `npm install` gives errors, try using the legacy peer dependencies flag: `npm install --legacy-peer-deps`
- If you find that you are unable to log in using any of the credentials provided, double check that the django server is running.

#### Django
- `ImportError`s in the python shell are a result of uninstalled packages, make sure you install the requirements as listed above.



## Project Structure
Below is the project structure of the repository with information about each module/folder and the purposes it serves.
#### Root
`ChickenChecker/` or `ChickenChecker-1314/` is the root folder and overall repository folder for this project, anything under it on your local machine will get committed with git (unless it is ignored by .gitignore like your virtual environment or `node_modules/`).   

#### React Native
`ChickenCheckerApp/` is the React Native root folder and contains all of the frontend code. You need to `cd ChickenCheckerApp` to use expo and npm. Under this directory we have:
* `assets/`: folder where we put images and extra junk. 
* `components/`: folder where we put custom functional classes that specify reusable components. 
* `screens/`: folder  where we put custom components that represent unique screens in the app.  
* `App.js`: JavaScript file which is essentially the `main()` function that runs the frontend functionality. 
* `package.json` specifies dependencies our project uses from npm. 
* `node_modules/` is ignored by `.gitignore` and stays local. It is updated by `npm install` according to dependencies listed in `package.json`. Use npm commands to update it locally.

#### Django
`manage.py` is a CLI provided by Django to let us use the Django project. The most common commands you will use are:
* `python manage.py runserver`. More [here](https://docs.djangoproject.com/en/4.0/ref/django-admin/).
* `python manage.py check` for debugging.
* `python manage.py makemigrations` for packaging changes to the database.
* `python manage.py migrate` for updating changes in the database.


`core/` is the directory for Django *app* where we specify the app specific views and data. We are responsible for implementing every thing under this directory. This folder includes:
* `admin.py`
* `apps.py`
* `data/` contains microphone data provided by Kevin and AudioT. More located in AWS S3. Under this directory there is `clean_data/` and `generated_data/` for use in House View
* `models.py` is essentially our database structure. Details [here](https://docs.djangoproject.com/en/4.0/topics/db/models/).
* `urls.py` where we declare urls for our app, essentially our app's "table of contents"
* `views.py` is where we specify web requests and responses. More [here](https://docs.djangoproject.com/en/4.0/topics/http/views/). Django also provides [Built In Views](https://docs.djangoproject.com/en/4.0/ref/views/).
* `migrations.py` which is managed by migrate commands and how we update changes to our database.


`server/` is the Django *project* and contains project level settings and files. We use this folder as a python package and we can import its contents to use them in our app by `import server.urls`.
This folder includes:
* `settings.py` where we can configure settings for our project like using specific Django apps. Docs [here](https://docs.djangoproject.com/en/4.0/topics/settings/).
* `urls.py` where we declare urls for our project, essentially our project's "table of contents"

`.gitignore` tells git/GithHub what files it shouldn't include in our repository in order to minimize collaboration issues across machines and OSes.

`chickenCheckerdb` is the actual database file that stores the users, farms, complexes, etc.
