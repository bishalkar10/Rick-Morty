# Rick-Morty Application Setup

Follow these steps to get started:

## Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
- It's recommended to use a version manager like [nvm](https://github.com/nvm-sh/nvm) for managing multiple versions of Node.js.

## Installation

1. **Clone the Repository**

   Open your terminal and clone this repository to your local machine:
```
git clone https://github.com/bishalkar10/Rick-Morty.git
cd Rick-Morty
```

2. **Install Dependencies**

   Navigate to the project directory and install the necessary dependencies using npm (Node Package Manager):
```
npm install
```

3. **Run the Project Locally**

   To start the development server, run:

```
npm run dev
```
   Your application will be available at `http://localhost:5173`.

This project uses Playwright testing framework. You are required to run this command to run tests:
```
npx playwright install
```
Note - You need to start development server first then you can run the command below to run the test scripts.

```
npm run test
```
## Troubleshooting

This project is developed on a linux Mint OS, if you are using windows you need to:

1. Delete the `node_modules` folder and the `package-lock.json` file.
2. Run `npm install` again to reinstall all dependencies.

After completing these steps, if the issue persists, ensure that your environment meets all the prerequisites mentioned above.
