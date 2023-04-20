import pgp from "pg-promise";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL not found in env");
}
const db = pgp()(connectionString);

type JobObject = {
  company: string;
  companyUrl: string;
  applyUrl: string;
  logoUrl: string;
  logoBgColor: string;
  jobTitle: string;
  createdAt: Date;
  jobType: string;
  location: string;
  description: string;
  requirements: {
    content: string;
    items: string[];
  };
  duties: {
    content: string;
    items: string[];
  };
  salary: string;
};

type QueryResult = {
  id: string;
};

const generateMockJob = (): JobObject => {
  const companyName = faker.company.name();
  const companySlug = encodeURIComponent(
    companyName.replace(/[\s\p{P}]/gu, "").toLowerCase()
  );
  const companyUrl = `https://example.com/${companySlug}`;
  const applyUrl = `${companyUrl}/apply`;

  return {
    company: companyName,
    companyUrl,
    applyUrl,
    logoUrl: faker.image.business(100, 100, true),
    logoBgColor: faker.internet.color(),
    jobTitle: faker.name.jobTitle(),
    createdAt: faker.date.recent(90),
    jobType: faker.helpers.arrayElement(["f", "p", "c"]),
    location: `${faker.address.cityName()}, ${faker.address.country()}`,
    description: faker.lorem.paragraphs(3),
    requirements: {
      content: faker.lorem.paragraph(),
      items: Array.from({ length: 5 }, () => faker.lorem.sentence()),
    },
    duties: {
      content: faker.lorem.paragraph(),
      items: Array.from({ length: 5 }, () => faker.lorem.sentence()),
    },
    salary: faker.commerce.price(65000, 200000),
  };
};

const mockJobs: JobObject[] = Array.from({ length: 100 }, () =>
  generateMockJob()
);

async function insertJobs(mockJobs: JobObject[]) {
  for (const job of mockJobs) {
    await db.tx(async (t) => {
      const requirementsResult = await t.one<QueryResult>(
        'INSERT INTO "Requirements" (id, content) VALUES (uuid_generate_v4(), $1) RETURNING "id"',
        [job.requirements.content]
      );
      const dutiesResult = await t.one<QueryResult>(
        'INSERT INTO "Duties" (id, content) VALUES (uuid_generate_v4(), $1) RETURNING "id"',
        [job.duties.content]
      );

      const requirementId = requirementsResult.id;
      const dutyId = dutiesResult.id;

      await t.none(
        'INSERT INTO "Job" ("id", "company", "companyUrl", "applyUrl", "logoUrl", "logoBgColor", "jobTitle", "jobType", "location", "description", "salary", "requirementId", "dutyId", "createdAt") VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        [
          job.company,
          job.companyUrl,
          job.applyUrl,
          job.logoUrl,
          job.logoBgColor,
          job.jobTitle,
          job.jobType,
          job.location,
          job.description,
          job.salary,
          requirementId,
          dutyId,
          job.createdAt,
        ]
      );

      for (const requirement of job.requirements.items) {
        await t.none(
          'INSERT INTO "RequirementsItem" ("id", "item", "requirement_id") VALUES (uuid_generate_v4(), $1, $2)',
          [requirement, requirementId]
        );
      }

      for (const duty of job.duties.items) {
        await t.none(
          'INSERT INTO "DutiesItem" ("id", "item", "duty_id") VALUES (uuid_generate_v4(), $1, $2)',
          [duty, dutyId]
        );
      }
    });
  }
}

insertJobs(mockJobs)
  .then(() => {
    console.log("All jobs have been inserted successfully");
  })
  .catch((error) => {
    console.error("Error inserting jobs:", error);
  });
