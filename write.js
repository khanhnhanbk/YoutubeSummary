require('dotenv').config();
const { Client } = require('@notionhq/client');
const fs = require('fs');
let output = require('./Output.json');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_API_DATABASE2;

// const getDatabase = async () => {
//   const response = await notion.databases.query({ database_id: databaseId });

//   const results = response.results;
//   data = JSON.stringify(results);
//   fs.writeFile('results.json', data, (err) => {
//     // In case of a error throw err.
//     if (err) throw err;
//   });
// };
// getDatabase();
newEntryToDatabase = async function (name, number) {
  let tag;
  if (number > 5) {
    tag = 'Excellent';
  } else if (number == 5) {
    tag = 'Good';
  } else {
    tag = 'Warning';
  }
  const response = await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: {
      'number page in this week': {
        number: number,
      },
      Label: {
        multi_select: [
          {
            name: tag,
          },
        ],
      },
      Name: {
        title: [
          {
            text: { content: name },
          },
        ],
      },
    },
  });

  return response;
};
// newEntryToDatabase('Khanh Hoa', 20, 'Bad');
for (const property in output) {
  newEntryToDatabase(property, output[property]);
}
