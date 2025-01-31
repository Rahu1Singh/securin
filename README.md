# Securin NVD Assessment 

Developed a full-stack NextJS application to perform the required tasks.

## File Structure
```
cve_fullstack_app  
    |--app
    |   |--api
    |   |   |--cves
    |   |   |   |--[cveId]
    |   |   |   |    |--route.ts    //dynamic api route to show full details
    |   |   |   |--route.ts         //api route to fetch data for list
    |   |--cves
    |   |   |--[cveId]
    |   |   |   |--page.tsx         //app route to display CVE information
    |   |--page.tsx                 //app route to display list of CVEs
    |--lib
    |   |--mongoose.ts              //connect to MongoDB
    |--models
    |   |--cve.ts                   //database schema
```

## Lib

1. `mongoose.ts`

    `connectDB()` to connect to MongoDB.

## Models

1. `cve.ts`

    Contains the mongoose schema for the database.

## Api Routes

1. `/api`

    `fetchAndStoreCVE()` to fetch data from the NVD API and store within the database. The data is fetched in batches of 100.  

    `GET()` to fetch CVEs from MongoDB with pagination and fetch from API if needed, usinf the previous function.

    `POST()` to sync CVEs from NVD API.

2. `/api/cves/[cveId]`

    `GET()` to fetch the details for the CVE with ID `cveId` using dynamic routes. 

## App Routes

1. `/`

    Display the list of CVEs with pagination and option to display upto 100 records at a time. ID, description, base score, published date and last modified date are displayed.

2. `/cves/[cveId]`

    Display all the details of the CVE without having to render ever page beforehand using dynamic routing.

## Screenshots

1. `GET /api?page=1&perPage=10 200 in 2058ms`

![10 rows](images/Pic1.png)

2. `GET /api?page=6&perPage=100 200 in 192ms`

![100 rows](images/Pic2.png)

3. `GET /api?page=13&perPage=100 200 in 21695ms`

![New records loading rows](images/Pic3.png)

4. `GET /api?page=13&perPage=100 200 in 21695ms`

![New rows](images/Pic4.png)

5. `GET /cves/CVE-2000-0356 200 in 1153ms`

![Dedicated Page](images/Pic5.png)