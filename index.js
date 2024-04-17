import { createOSMStream } from 'osm-pbf-parser-node';
import fs from 'fs';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

// Function to validate date
function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date);
}

async function processOSMFileForInvalidDates(inputFilePath, outputFilePath, objectType) {
    const csvWriter = createCsvWriter({
        path: outputFilePath,
        header: [
            {id: 'id', title: 'ID'},
            {id: 'url', title: 'URL'},
            {id: 'start_date', title: 'Invalid Start Date'},
            {id: 'end_date', title: 'Invalid End Date'}
        ]
    });

    let records = [];

    try {
        for await (const item of createOSMStream(inputFilePath)) {
            if (item.type === objectType && item.tags) {
                let record = {
                    id: item.id,
                    url: `https://www.openhistoricalmap.org/${objectType}/${item.id}`,
                    start_date: '',
                    end_date: ''
                };
                let hasInvalidDate = false;

                if (item.tags.start_date && !isValidDate(item.tags.start_date)) {
                    record.start_date = item.tags.start_date;
                    hasInvalidDate = true;
                }
                if (item.tags.end_date && !isValidDate(item.tags.end_date)) {
                    record.end_date = item.tags.end_date;
                    hasInvalidDate = true;
                }

                if (hasInvalidDate) {
                    records.push(record);
                }
            }
        }

        if (records.length > 0) {
            await csvWriter.writeRecords(records);
            console.log('Invalid date data has been successfully written to CSV file.');
        } else {
            console.log('No invalid dates found for the specified type.');
        }
    } catch (error) {
        console.error('Error processing OSM file:', error);
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 3) {
        console.error('Usage: node this_script.js <input_path_to_osm_pbf_file> <output_path_to_csv_file> <type_to_process>');
        process.exit(1);
    }

    const inputFilePath = args[0];
    const outputFilePath = args[1];
    const objectType = args[2];  // can be: "way", "node", "relation"
    await processOSMFileForInvalidDates(inputFilePath, outputFilePath, objectType);
}

main();
