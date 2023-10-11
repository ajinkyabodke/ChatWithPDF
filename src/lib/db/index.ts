// import { neon, neonConfig } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";

// neonConfig.fetchConnectionCache = true; //to cache the connections that has been set

// if (!process.env.DATABASE_URL) {
//   throw new Error("Database URL not found");
// }


// const sql = neon(process.env.DATABASE_URL);


// export const db = drizzle(sql);

import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;//to cache the connections that has been set

if (!process.env.DATABASE_URL) {
  throw new Error("database url not found");
}
//connect to sql server using the neon function
const sql = neon(process.env.DATABASE_URL);
//db variable - to interact with our databse; schema to define shape/structure of our DB
export const db = drizzle(sql);
