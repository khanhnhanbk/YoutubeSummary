// this will allow us to import our variable
require("dotenv").config();
// the following lines are required to initialize a Notion client
const { Client } = require("@notionhq/client");
const moment = require("moment");
// this line initializes the Notion Client using our key
const fs = require("fs");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_API_DATABASE;

const inThisWeek = function (date) {
  var now = moment();
  var input = moment(date);
  return now.isoWeek() == input.isoWeek();
};

const getDatabase = async () => {
  const response = await notion.databases.query({ database_id: databaseId });

  const results = response.results;
  const trim = results.map((page) => {
    return {
      created_time: Date.parse(page.created_time),
      create_by: page["properties"]["Create by"]["created_by"]["name"],
      tags: page["properties"]["Topics"]["multi_select"].map((tag) => tag.name),
      title: page["properties"]["Title"]["title"][0]["plain_text"],
      url: page["url"],
    };
  });

  // data = JSON.stringify(results);
  // fs.writeFile("results.json", data, (err) => {
  //   if (err) throw err;
  // });
  data = JSON.stringify(trim);
  fs.writeFile("trim.json", data, (err) => {
    if (err) throw err;
  });

  summary = {};
  trim.forEach((item) => {
    if (inThisWeek(item.created_time))
      summary[item.create_by] = summary[item.create_by] ? summary[item.create_by] + 1 : 1;
  });

  data = JSON.stringify(summary);
  fs.writeFile("Output.json", data, (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
};

getDatabase();
