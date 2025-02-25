<div align="center">
  <img src="https://bs-uploads.toptal.io/blackfish-uploads/components/seo/content/og_image_file/og_image/777184/secure-rest-api-in-nodejs-18f43b3033c239da5d2525cfd9fdc98f.png" alt="NodeJS LOGO" width=800 />
  <p></p>
  <h1>Oscar Winners Overview</h1>
  <br />
</div>


## 👋 Intro

**Oscar Winners Overview** is a RESTful API built with **NestJS** and **MongoDB**. It enables users to manage Oscar-winning movies, featuring CRUD operations, search, pagination, and sorting. The project follows the **MVC architecture**, integrates **Swagger** for API documentation, and includes **Jest** for testing.

---

## ⚡ Technologies Used

- [Node.js](https://nodejs.org/)  
- [NestJS](https://nestjs.com/)  
- [MongoDB](https://www.mongodb.com/)  
- [Mongoose](https://mongoosejs.com/)  
- [Swagger](https://swagger.io/)  
- [Jest](https://jestjs.io/)  
- [Docker](https://www.docker.com/) *(optional)*  
- [OpenAPI](https://www.openapis.org/) *(optional)*  

---

## 🚀 Getting Started

- In your terminal go into a directory and then run the following command:

        git clone https://github.com/your-username/metrix-oscar-api.git
        cd metrix-oscar-api

- Run this code in your terminal:

        npm i

- After you have installed them setup your .env files for DB connection:

       MONGO_URI=mongodb://localhost:27017/oscar_db
       PORT=3000
- DB Seeding 

      npm run seed
## 🧪 Running Tests
Run Tests:

      npm run test:cov
      you access swagger for further testing here : http://localhost:3000/api

## 🎬 API Endpoints
      Method	Endpoint	Description
      POST	/movies	Create a new movie
      GET	/movies	Get all movies (pagination, search)
      GET	/movies/winners	Get all winning movies
      GET	/movies/{id}	Get a movie by ID
      PATCH	/movies/{id}	Update a movie by ID
      DELETE	/movies/{id}	Delete a movie by ID
      Sample Query Params for /movies:/movies?search=Godfather&sortBy=title&order=asc&limit=10&page=1
## 🐳 Docker (Optional)
Build & Run with Docker:

    docker-compose up --build
    Docker Compose Example:
    yaml
    version: '3.8'
    
    services:
      mongo:
        image: mongo
        ports:
          - "27017:27017"
        volumes:
          - mongo-data:/data/db
    
      api:
        build: .
        ports:
          - "3000:3000"
        env_file:
          - .env
        depends_on:
          - mongo
    
    volumes:
      mongo-data:
## 👊 Further Help?
For questions, feel free to reach out!  <br />
📧 contact me via e-mail RaymundTech@protonmail.com <br/>
© Raymund Noel Gyuris <br />

<br />
