const cheerio = require('cheerio');
const request = require('request');
const excel = require('exceljs');
const http = require('http');
const fs = require('fs');

const constants = require('../utils/constants');
const getSheetName = require('../utils/getSheetName');
const compareHours = require('../utils/compareHours');

const getNewestPost = (html, index = 0) => {
    const $ = cheerio.load(html);
    const newestPost = $('span.readmore-link > a')[index].attribs.href;

    if (!newestPost.includes('obsada-sedziow')) getNewestPost(html, index++);

    return newestPost;
}

exports.getAllMatches = (req, res) => {
    const { searchingName } = req.params;

    request(constants.ADDRESS, (error, response, html) => {
        if (!error && response.statusCode === 200) {
            const newestPost = getNewestPost(html);
            const sheetName = getSheetName(newestPost);

            request(newestPost, (err, resp, html) => {
                if (!error && response.statusCode === 200) {
                    const $ = cheerio.load(html);
                    const excelFile = $('p.has-text-align-center > a')[0].attribs.href;

                    const file = fs.createWriteStream(constants.FILE_NAME);

                    http.get(excelFile, (resp) => {
                        resp.pipe(file);
                    });

                    setTimeout(() => {
                        const workbook = new excel.Workbook();

                        workbook.xlsx.readFile(constants.FILE_NAME)
                            .then(() => {
                                const worksheet = workbook.getWorksheet(sheetName);
                                const matches = [];

                                worksheet.eachRow({ includeEmpty: false }, function(row) {
                                    if (row.values.includes(searchingName)) {
                                        const match = {
                                            hosts: row.values[2],
                                            guests: row.values[3],
                                            date: row.values[4],
                                            hour: row.values[5],
                                            main_referee: row.values[7],
                                            assistant_referee_one: row.values[8],
                                            assistant_referee_two: row.values[9],
                                            address: row.values[10],
                                        }

                                        matches.push(match);
                                    }
                                });

                                matches.sort((a, b) => {
                                    if (a.date === b.date) return compareHours(a.hour, b.hour);
                                    return new Date(a.date) - new Date(b.date);
                                })

                                res.send(matches);
                            })
                            .catch((err) => console.error(err));
                    }, 1000)
                }
            })
        }
    });
}