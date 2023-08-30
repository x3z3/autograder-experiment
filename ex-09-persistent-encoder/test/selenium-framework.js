import { Builder } from "selenium-webdriver";
import axios from "axios";
import chrome from "selenium-webdriver/chrome.js";

class SeleniumFramework {

  constructor(port, testCases) {
    this.driver = null;
    this.port = port;
    this.defaultURL = `http://localhost:${this.port}/test`;
    this.tests = testCases || [];
  }

  // Initialize a chrome driver if not already initialized
  async #initDriver() {
    if (!this.driver) {
      this.driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(new chrome.Options().headless())
        .build();
    }
    return this.driver;
  }

  // Hard refreshes the original driver if needed
  async #reInitDriver() {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
    return await this.#initDriver();
  }

  // Resets the driver to the Original Page
  async #refreshDriver() {
    try {
      const driver = await this.#initDriver();
      await driver.get(this.defaultURL);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  // Run a single test case
  async #runTestCase(testCase, testNumber) {
    console.log(`Test ${testNumber}: ${testCase.name}`)
    try {
      await this.#refreshDriver();
      const result = await testCase.function(this.driver);
      if (result) {
        return { passed: true, critical: false };
      }
      if (!testCase.critical) {
        return { passed: false, critical: false };
      }
      return { passed: result, critical: true };
    } catch (e) {
      console.log(e);
      return { passed: false, critical: testCase.critical };
    }
  }

  // Checks all test cases to make sure they have the required properties
  async validTestCases(testCases) {
    return testCases.every((test) => {
      return (
        test.name &&
        test.function &&
        test.failureMessage &&
        (test.critical === true || test.critical === false)
      );
    });
  }
  
  // Function to call the test server to close Selenium
  async closeTestServer() {
    await axios.get(`http://localhost:${this.port}/test/close`);
  }

  async runAllTests() {
    if (!(await this.validTestCases(this.tests))) {
      console.log("Test Cases are not valid. Please check the test cases and try again");
      await this.closeTestServer();
      return;
    }
    
    await this.#reInitDriver();
    
    console.log("========= Running Tests =========");

    const testResults = [];
    for (let i=0; i<this.tests.length; i++) {

      await this.#refreshDriver();
      const result = await this.#runTestCase(this.tests[i], i+1)
      if (result.passed) {
        console.log(`Passed`);
      } else {
        if (!result.critical) {
          console.log(`Failed: ${this.tests[i].failureMessage}`);
        }
        else {
          console.log(`CRITICAL : ${this.tests[i].failureMessage}`);
          console.log("Ending Tests...");

          await this.closeTestServer();
          return;

        }
      }
      console.log("--------- ------------ ---------");
      testResults.push(result.passed)
    }
    
    console.log("================================");
    console.log("========= Test Results =========");
    console.log("========= ============ =========");
    testResults.forEach((result, index) => {
      console.log(`Test ${index+1}: ${result ? "Passed" : "Failed"}`);
    });
    console.log("================================");
    const passedCount = testResults.reduce((acc, bool) => {
      return acc + (bool ? 1 : 0);
    })
    console.log(`Passed ${passedCount}/${testResults.length} tests`);
    if (passedCount !== testResults.length) {
      console.log("Not passing all tests may mean there are non critical errors. Read the test results to determine if they are important or not");
    }

    console.log("================================");

    await this.closeTestServer();
  }

}

export {SeleniumFramework};