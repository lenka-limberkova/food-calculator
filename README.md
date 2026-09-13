# Food Calculator

A simple nutrition calculator powered by the USDA FoodData Central API.

Users can search **Foundation Foods**, add foods to a selection, adjust
quantities in grams, and see calculated calories and macronutrients for
individual foods and the whole selection.

## Live Demo

[View live application](https://food-calculator-production-e4d1.up.railway.app/)

## Figma Design

[View design in Figma](https://www.figma.com/design/CnWUsBBq6tZ3ES0ewTsLiL/food-calculator-app?node-id=37-2&t=Y55m43rLXSrYIVRI-1)

## Overview

Food Calculator was created as a portfolio and learning project to
explore the complete process of building a small web application ---
from product concept and UI design to working with a third-party API,
creating a backend, handling real-world data, testing, debugging, and
deployment.

The application intentionally focuses on a simple core flow:

**Search → Add → Set quantity → See nutrition → Adjust → See total**

It is not intended to be a calorie diary, meal planner, or daily
nutrition tracker.

## Features

-   Search USDA Foundation Foods
-   Display calories, protein, carbohydrates, and fat
-   Add foods to a selection
-   Prevent duplicate selections
-   Adjust food quantities in grams
-   Automatically recalculate nutrition values
-   Calculate total calories and macronutrients
-   Remove individual foods
-   Reset the entire selection
-   Loading, empty, no-results, and error states
-   Responsive desktop and mobile interface

## Data Source

Nutrition data comes from the USDA FoodData Central API.

Only **Foundation Foods** are included in search results.

The application primarily uses energy values provided directly by USDA.
Because some Foundation Foods do not contain the same energy nutrient in
the search response, the backend checks multiple available USDA energy
values.

If no calorie value is available but macronutrient data exists, calories
are estimated using:

`protein × 4 + carbohydrates × 4 + fat × 9`

Foods without calorie or macronutrient data are excluded from the
results.

## How It Works

The application uses a small Node.js / Express backend as a proxy
between the frontend and the USDA API.

``` text
User
  ↓
Frontend (HTML / CSS / JavaScript)
  ↓
Node.js + Express backend
  ↓
USDA FoodData Central API
  ↓
Foundation Foods
```

The USDA API key is stored as an environment variable on the server and
is never exposed in frontend JavaScript or committed to GitHub.

## Built With

-   HTML5
-   CSS3
-   JavaScript
-   Node.js
-   Express
-   USDA FoodData Central API
-   Figma
-   Git & GitHub
-   Railway

## Design

The UI was designed in Figma before implementation.

The design includes desktop and mobile layouts, reusable UI components,
typography and color styles, spacing and radius variables, and states
for empty selections, loading, search results, selected foods, errors,
and no results.

The interface uses **Manrope** as its primary typeface.

## AI Collaboration

This project was intentionally built with extensive AI assistance.

I defined the product concept, scope, user flow, functionality, UI/UX,
and visual design. I also made decisions about how the application
should behave, what data should be displayed, and how edge cases should
be handled.

AI was used as a coding assistant throughout the implementation. A
significant portion of the JavaScript and backend code was generated
with AI assistance rather than written from scratch by me.

My role in the implementation included:

-   defining requirements and expected behavior
-   designing the interface in Figma
-   implementing and adjusting the HTML and CSS
-   integrating AI-generated code into the project
-   reviewing and modifying the implementation
-   testing application behavior
-   debugging API and data issues
-   investigating USDA FoodData Central responses
-   making decisions about fallback calculations and missing nutrition
    data
-   configuring environment variables and API key security
-   using Git and GitHub for version control
-   deploying and debugging the application on Railway

The goal of the project was not to present AI-generated code as entirely
hand-written work, but to practice building and understanding a real
application while learning how frontend, backend, APIs, deployment, and
AI-assisted development fit together.

## What I Learned

This project helped me understand the complete flow between a frontend
application, a backend, and a third-party API.

In particular, I gained practical experience with:

-   making API requests with `fetch`
-   working with asynchronous data
-   understanding API endpoints and query parameters
-   processing API responses
-   managing application state in JavaScript
-   dynamically rendering UI based on data
-   handling loading, error, and empty states
-   using Node.js and Express as a backend
-   protecting API keys with environment variables
-   handling inconsistent real-world API data
-   debugging HTTP and API errors
-   deploying a Node.js application
-   configuring production environment variables

## Running Locally

Clone the repository and install dependencies:

``` bash
npm install
```

Create a `.env` file in the project root:

``` env
FDC_API_KEY=your_api_key_here
```

Start the application:

``` bash
npm start
```

Then open:

``` text
http://localhost:3000
```

A USDA FoodData Central API key is required.

## Project Structure

``` text
food-calculator/
├── public/
│   ├── assets/
│   │   └── icons/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

> `.env` is excluded from Git and should never be committed to the
> repository.

## Future Improvements

Possible future improvements include improved search experience, more
detailed food information, accessibility improvements, additional input
validation, automated tests, and further refactoring.

## Author

Designed and developed as a frontend learning and portfolio project.
