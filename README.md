# OlympicGamesStarter

## Description

This project is a **SPA** that displays useful information about the recent participations of various countries in the Olympics.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

Don't forget to install your node_modules before starting (`npm install`).

---

## Features

The project has 2 features:

1. The Home page show a pie chart with the name of the participating countries (from olympic.json) and their total number of participation.
2. The Detail page show a line chart representing the total number of medals per particaption.

---

## Navigation

On the Home page, the pie chart displays a slice for each participating countries with a different color. On mouse hover, you can see a tooltip showing their total number of medals. Clicking a slice will navigate you to the Detail page related to this country. At the bottom of the details line chart, there are a go back buttons to navigate to Home page.

---

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

---

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

---

## How to contribute

As you can see, an architecture has already been defined for the project. It is just a suggestion, you can choose to use your own. The predefined architecture includes (in addition to the default angular architecture) the following:

- `components` folder: contains every reusable components
- `pages` folder: contains components used for routing
- `core` folder: contains the business logic (`services` and `models` folders)
