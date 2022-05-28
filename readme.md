<a id="top"></a>

# Exam-project - VærkstedetCPH Backend 


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#project-description">Project Description</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#connect-to-the-frontend">Connecting to the frontend repo</a></li>
  </ol>
</details>



<!-- PROJECT DESCRIPTION -->
## Project Description
This repo is the backeend part of an exam project at KEA, developed for CPH-Værkstedet. 

It is a REST api developed with next, capable of handling authentication and crud operations through prisma to a PostgresQL database.  



<!-- BUILT WITH -->
## Built with

The technologies used to built this prototype are

* [Nest.JS]([https://reactjs.org/](https://nestjs.com/))
* [TypeScript](https://www.typescriptlang.org/)
* [Prisma](https://www.prisma.io/)


Necessary packages include

* [Passport JWT](https://yarnpkg.com/package/passport-jwt)
* [Cookie](https://yarnpkg.com/package/cookie)
* [Argon2](https://yarnpkg.com/package/argon2)
* [Dotenv cli](https://yarnpkg.com/package/dotenv-cli)




<!-- GETTING STARTED -->
## Getting Started

To get a local copy of the project up and running, follow the steps below



### Prerequisites

This project requires [Node.js](https://nodejs.org/en/) to run

> If you do not have Node.js installed, install it from their [website.](https://nodejs.org/en/)


This project uses Docker to run and connection to the database

> If you do not have a way to run docker in your OS, we recommend installing [Docker Desktop.](https://www.docker.com/products/docker-desktop/)


This project uses Yarn as a package manage. To run the project smoothly, we recommend using yarn instead of npm. 

If you do not have yarn installed, we recommend installing yarn through NPM

> If you do not have npm installed, we recommend following [this guide.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


* Install yarn globally through npm
    ```sh
    npm install -g yarn
    ```
* Check the version of yarn after installation
    ```sh
    yarn --version
    ```




### Installation

1. Clone the repository through the terminal

     ```sh
     git clone https://github.com/LasseStaus/CPHworkshop_backend.git
     ```

   Alternatively you can download the zip file, and open it in your IDE. 
   

2. Install packages used in the project

     ```sh
     yarn install
     ``` 

3. Copy the contents of `.env.example` into a `.env` file and either specify details or use the default settings 

    > If you wish to specify your own details, remember to update the database connection string in schema.prisma, located in the Prisma root folder. 


4. Restart / Start the database, run migrations and seeds. 

    ```sh
     yarn db:dev:restart
     ``` 

5. View the database locally

     ```sh
     yarn prisma studio
     ```
 

6. Run the application in production 

     ```sh
     yarn run build
     ```
     ```sh
     yarn start:prod
     ```
   
7. Alternatively, run the application in development mode

     ```sh
     yarn start:dev
     ```
     
8. Too see e2e tests 

     ```sh
     yarn db:test:restart
     ```
     ```sh
     yarn test:e2e
     ```
   
<p align="right"><a href="#top">back to top</a></p>



### Connect to the frontend

To create and connect with an instance of our frontend, please go to the [frontend repository](https://github.com/LasseStaus/frontend_chakra) and follow the steps in the Readme

