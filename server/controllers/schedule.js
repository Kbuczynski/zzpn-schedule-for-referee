const cheerio = require("cheerio");
const request = require("request");
const excel = require("exceljs");
const http = require("http");
const fs = require("fs");

const { ADDRESS, FILE_NAME, LINK_NAME } = require("../utils/constants");
const compareHours = require("../utils/compareHours");

const getSchedulePostUrl = (html) => {
  const $ = cheerio.load(html);
  const posts = Object.values($("span.readmore-link > a")).slice(0, -4);
  const schedule = posts.filter((post) =>
    post.attribs.href.includes(LINK_NAME)
  );

  return schedule[0].attribs.href;
};

const saveScheduleFile = async (html) => {
  const $ = cheerio.load(html);
  const excelFile = $("p.has-text-align-center > a")[0].attribs.href;
  const file = await fs.createWriteStream(FILE_NAME);

  await http.get(excelFile, async (response) => {
    await response.pipe(file);
  });
};

const getMatchDetails = (row) => ({
  hosts: row.values[2],
  guests: row.values[3],
  date: row.values[4],
  hour: row.values[5],
  main_referee: row.values[7],
  assistant_referee_one: row.values[8],
  assistant_referee_two: row.values[9],
  description: row.values[10],
});

const sortMatches = (matches) =>
  matches.sort((a, b) => {
    if (a.date === b.date) return compareHours(a.hour, b.hour);
    return new Date(a.date) - new Date(b.date);
  });

const formatPhrase = (phrase) => phrase.toString().trim().toLowerCase();

exports.getAllMatches = (req, res) => {
  const { searchingName } = req.params;

  request(ADDRESS, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const newestPost = getSchedulePostUrl(html);

      request(newestPost, async (error, response, html) => {
        if (!error && response.statusCode === 200) {
          await saveScheduleFile(html);

          setTimeout(() => {
            const workbook = new excel.Workbook().xlsx.readFile(FILE_NAME);

            workbook
              .then((data) => {
                const worksheet = data.getWorksheet();
                const matches = [];

                worksheet.eachRow({ includeEmpty: false }, (row) => {
                  formatPhrase(row.values).includes(
                    formatPhrase(searchingName)
                  ) && matches.push(getMatchDetails(row));
                });

                res.send({
                  name: worksheet.name,
                  modified_at: data.modified,
                  total: matches.length,
                  matches: sortMatches(matches),
                });
              })
              .catch(() =>
                res.send({
                  name: "",
                  modified_at: "",
                  total: 0,
                  matches: [],
                })
              );
          }, 500);
        }
      });
    }
  });
};
