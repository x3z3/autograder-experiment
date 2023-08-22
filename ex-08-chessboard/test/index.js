import express from "express";
import { SeleniumFramework } from "./selenium-framework.js";
import { testCases } from "./tests.js";

// Express server to allow end points. Used to host the client files
// Also launches Selenium tests and closes it after tests are complete
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/test', express.static('client'));


const server = app.listen(port, async () => {
    console.log(`Test Server started on port ${port}`)

    const seleniumFramework = new SeleniumFramework(port, testCases)
    await seleniumFramework.runAllTests()
})

// Close the server to avoid zombie??? processes
app.get('/test/close', (req, res) => {
    server.close()
    console.log('Closing Test Server')
    res.send()
})
// Doing this because writing the close.server inside the listen is causing 
// the server to close before the tests are run