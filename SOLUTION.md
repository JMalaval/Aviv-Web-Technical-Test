# AVIV technical test solution

You can use this file to write down your assumptions and list the missing features or technical revamp that should
be achieved with your implementation.

## Notes

- I decided to create a new table to store the prices.
- So, I created a new repository to manage all the logic related to this table.
- I added some tests, but they only lightly cover the newly added logic. It would be necessary to add tests for the listing repository as well and further expand the tests for the price logic.
- I modified the database initialization file to create the new table and establish the relationship between the two tables. Then, I created a few elements for functional testing purposes.

I spent around 3 hours on the testing process in 2 sessions. During the first session, I tried to understand the exercise's requirements, set up the project, and start coding. In the second session, I wrote tests, fixed some bugs in my code, and also wrote the SOLUTION.md file.


## Questions

This section contains additional questions your expected to answer before the debrief interview.

- **What is missing with your implementation to go to production?**

  - Add unit tests for all repositories.
  - Include unit tests to cover functions as well and ensure routes respond correctly.
  - Implement pagination and limits for listing and price routes to avoid potential database issues.
  - Improve error handling by providing more explicit error messages.

- **How would you deploy your implementation?**

  I'm not entirely certain about the intended meaning of this question, so I'll provide a possible interpretation. If I were to deploy a new feature like this, I would likely create the new table required for the feature and perform a database migration to add the current price of a listing to the price table.

- **If you had to implement the same application from scratch, what would you do differently?**

  I would make the following changes:

  - Choose a framework like NestJS to have a more structured application using classes.
  - Use an ORM like Prisma to handle migrations, assist with SQL queries, and provide better typing support.  
  - Use a NoSQL database like MongoDB:
    - Firstly, because I have a preference for MongoDB.
    - NoSQL databases are well-suited for applications with high traffic and large volumes of data too.
    - NoSQL databases, including MongoDB, have the ability to scale horizontally, similar to PostgreSQL

- **The application aims at storing hundreds of thousands listings and millions of prices, and be accessed by millions
  of users every month. What should be anticipated and done to handle it?**

    - Use proper indexing and consider partitioning if needed.
    - Adjust configuration settings for performance optimization.
    - Use cache to store frequently accessed data in memory.
    - Set up an infrastructure that can scale horizontally using containerization and orchestration technologies like HPA ( Horizontal Pod Autoscaler )
    - Review SQL queries to make them more efficient and avoid costly redundancies.
    - Employ monitoring tools like Datadog to identify performance issues and improve overall architecture and performance over time.
    

  NB : You can update the [given architecture schema](./schemas/Aviv_Technical_Test_Architecture.drawio) by importing it
  on [diagrams.net](https://app.diagrams.net/) 
