# autograder-experiment

## About
My Independent Study under Prof. Timothy Richards at UMass Amherst.

The purpose of this study is to experiment with various autograder systems and create a comparable testing framework for students taking web-based courses, in order to aid and enhance student learning.

This is comprehensive guide is designed around CS326's course structure at UMass Amherst. Although, it can be adopted to write tests for any purpose including general UI-testing.

## Dependencies
The UI-testing framework uses Selenium and Chrome Driver.

Selenium is a popular open source tool/library designed to support browser automation. 

Chromedriver is a standalone server that implements the WebDriver standard which provides capabilities for navigating web pages, execute JS, enable user inputs, and more. For versions of Google Chrome after v115, the latest version of chromedriver can be downloaded [here](https://googlechromelabs.github.io/chrome-for-testing/#stable). Once downloaded, the chromedriver should be accessible from PATH.

## Test Suite

### Sample directory structure
```
ex-render-with-js / <!-- The parent directory -->
│
├── client/ <!-- Student's original template -->
| ├── README.md
│ ├── index.html
│ └── render.js
│
├── test/  <!-- Test suite files -->
│ ├── index.js
│ ├── selenium-framework.js
│ └── tests.js
│
└── package.json
```

### Running the test suite

#### Step 0 : Navigate to the folder directory
```$ cd ex-directory```
#### Step 1 : Install dependencies
```$ npm install```
#### Step 2 : Run the test suite
```$ npm test```

### Test Suite Files

#### index.js
The index.js file is the entry point for the test suite. It is responsible for setting up the test environment, and running the tests. 
It starts a testing server, which allows hosts the student's web page. It also triggers the selenium test framework allowing it to interact with the web page, and also loads the test file on where the tests are written.

#### [selenium-framework.js](./selenium-framework.js)
The selenium framework runs chromeBuilder in headless mode (Browser automation happens in the background). It can also be tweaked to initiate drivers, refresh them, run test cases, and provide feedback to the user.

#### tests.js
The tests.js file is where the tests are written. A test is written in the following format : 
```js
const testCases = [
    {
        // Descriptive name of the test
        name: "Driver exists and Loads",
        // Test function that runs the code
        function : async (driver) => {
            return driver !== null;
        },
        // Tips for the student on failure : 
        failureMessage: "Driver is null. Driver not initialized correctly or Page does not load. Running more tests are not possible",
        // If true, testing ends upon failure
        critical : true
    },
    // More test cases
]
export { testCases }
```


## Implemented tests

Click the following links to view the project documentation for each exercise:

### [**Exercise 05** : Decoder Web Page](./READMEs/ex-05.md)
- [Project Documentation](https://umass-cs-326.github.io/docs/exercises/decoder-web-page/)

### [**Exercise 06** : Decoder Interactive](./READMEs/ex-06.md)
- [Project Documentation](https://umass-cs-326.github.io/docs/exercises/interactive-decoder/)

### [**Exercise 07** : Checkerboard](./READMEs/ex-07.md)
- [Project Documentation](https://umass-cs-326.github.io/docs/exercises/checkerboard/)

### [**Exercise 08** : Chessboard](./READMEs/ex-08.md)
- [Project Documentation](https://umass-cs-326.github.io/docs/exercises/chessboard/)

### [**Exercise 9** : Persistent Encoder](./READMEs/ex-09.md)
- [Project Documentation](https://umass-cs-326.github.io/docs/exercises/persistent-encoder/)
