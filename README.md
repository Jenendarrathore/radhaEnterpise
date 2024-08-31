This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Steps

1. nextjs 14 , mongoose,redux toolkit rtx

2. folder structure

app - our main folder

-app  
----api - the client api calls folder inside app
--------clients
------------[id]
----------------route.ts localhost:3000/api/clients/{id} - get client by id
------------route.ts localhost:3000/api/clients/ - get all clients if get request and create client if post

-app
----clients - The client folder
------------[id]
----------------page.tsx localhost:3000/clients/{id} - The client by id page
--------page.tsx - The client list page - localhost:3000/clients/
--------new.tsx - The create client page - localhost:3000/clients/new

-redux - includes the redux / rtx
----clientsApi - The client rtx query file
----store - The Redux Store

-lib - includes the redux / rtx
----mongodb - The mongo db connections file
--------model - folder that contains all of mongo collections schema
------------clientmodel - contains the client schema code

how it works
from frontend page eg /app/clients/page.tsx useuseGetClientsQuery is called which is a method exposed by client rtx query
then rtx calls the api getClients endpoint in rtx
whhich makes a api call to /app/api/client/route.ts
inside /app/api/client/route.ts there are 2 functions GET and POST
for the current scenario get is called since getClients is a get request
so in /app/api/client/route.ts file the GET function first connects to mongodb and then perfoms a find method on ClientModel which is basically the model that matches the collection in mongodb
then the data is returned to

frontendpage----->rtx-----> makes apicall and pending action is dispathed
Reducer watches the action - once it gets pending it upsdates the state in store as loading
api call is made and suppose
api is successfull ----- > rtx dispatches fulles action along with data
Reducer watches the action - once it gets fullfilled reducer normalize the data and it stores data in redux store  
api is faliure ----- > rtx dispatches rejeected action along with error
Reducer watches the action - once it gets rejeected reducer and it stores error in redux store

and based on any change in store data the frontend component is rerendered
