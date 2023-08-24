import { By, Key, until } from "selenium-webdriver";

// Read the documentation for Element Maps in the README.md file:

// The element map is an object that defines the mapping of web elements used in test cases.
// It should have the following structure:
// {
//   elementName1: {
//     type: String, // Type of locator (e.g., 'css', 'xpath', 'id', etc.)
//     locator: String // Locator value for the web element
//   }
// }
const elementMap = {
    key : {
        type: 'id',
        locator: 'key'
    },
    encode : { 
        type: 'id',
        locator: 'encode'
    },
    encoded : {
        type: 'id',
        locator: 'encoded'
    },
    decode : {
        type: 'id',
        locator: 'decode'
    },
    decoded : {
        type: 'id',
        locator: 'decoded'
    },
    clear : {
        type: 'id',
        locator: 'clear-state'
    }
}

// A test case should be an object with the following properties:
// - name: String (Descriptive name of the test case)
// - function: async (driver) => { return true/false } (The test case function)
//            The 'driver' parameter is a Selenium WebDriver instance.
//            The test case function should return 'true' for success and 'false' for failure.
// - FailureMessage: String (Descriptive message to display when the test case fails)
const testCases = [
    {
        name: "Driver exists and Loads",
        function : async (driver) => {
            return driver !== null;
        },
        failureMessage: "Driver is null. Driver not initialized correctly or Page does not load. Running more tests are not possible",
        critical : true
    },
    {
      name: "Not Empty Title",
      function: async (driver) => {
        try {
          const title = await driver.getTitle();
          return title !== "";
        } catch (e) {
          console.log(e);
          return false;
        }
      },
      failureMessage: "Title is not set or possibly null. No Big deal, just a test for test case :)",
      critical : false,
    },
    {
      name: "Elements are present",
      function: async (driver) => {
        try {
          const elements = {}
          for (const elementName in elementMap) {
              elements[elementName] = await driver.findElement(By[elementMap[elementName].type](elementMap[elementName].locator));
          }
          const elementNames = ['key', 'encode', 'decode', 'encoded', 'decoded'];
          for (const elementName of elementNames) {
              const element = elements[elementName];
              if (await element.getTagName() !== "input") {
                  return false;
              }
          }
          return true;
        } catch (e) {
            console.log(e);
            return false;
        }
      },
      failureMessage: "One or more elements are not present. Check the HTML and the element map",
      critical : true
    },
    {
      name: "Clear Button added",
      function: async (driver) => {
        try {
          const clear = await driver.findElement(By.id(elementMap.clear.locator));
          return clear !== null;
        } catch (e) {
          console.log(e);
          return false;
        }
      },
      failureMessage: "Clear button is not present. Check the HTML and the element map",
      critical : true,
    },
    {
      name: "Persistence Part 1 : Encode & Decode works correctly",
      function: async (driver) => {
        try {
          const elements = {}
          for (const elementName in elementMap) {
              elements[elementName] = await driver.findElement(By[elementMap[elementName].type](elementMap[elementName].locator));
          }

          const key = elements['key'];
          const encode = elements['encode'];
          const encoded = elements['encoded'];
          const decode = elements['decode'];
          const decoded = elements['decoded'];
          const clear = elements['clear'];

          let encodedText = ''
          let decodedText = ''

          await key.sendKeys("bcdefghijklmnopqrstuvwxyza");
          
          await encode.sendKeys("apple");
          encodedText = await encoded.getAttribute('value');
          console.log(encodedText)
          if (encodedText !== "bqqmf") {
              return false;
          }

          await decode.sendKeys("qfbs");
          decodedText = await decoded.getAttribute('value');
          if (decodedText !== "pear") {
              return false;
          }

          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      },
      failureMessage: "Encode and/or decode doesnt work correctly",
      critical: false,
      reset : true,
    },
    {
      name: "Persistence Part 2 : Persistence works correctly, and clear has no errors",
      function: async (driver) => {
        try {
          const elements = {}
          for (const elementName in elementMap) {
              elements[elementName] = await driver.findElement(By[elementMap[elementName].type](elementMap[elementName].locator));
          }

          const key = elements['key'];
          const encode = elements['encode'];
          const encoded = elements['encoded'];
          const decode = elements['decode'];
          const decoded = elements['decoded'];
          const clear = elements['clear'];

          if (await key.getAttribute('value') !== "bcdefghijklmnopqrstuvwxyza") {
            return false;
          }
          if (await encode.getAttribute('value') !== "apple") {
            return false;
          }
          if (await encoded.getAttribute('value') !== "bqqmf") {
            return false;
          }
          if (await decode.getAttribute('value') !== "qfbs") {
            return false;
          }
          if (await decoded.getAttribute('value') !== "pear") {
            return false;
          }
          
          await clear.click();

          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      },
      failureMessage: "Persistence doesnt work correctly after refresh",
      critical: false,
      reset : false,
    },
    {
      name: "Persistence Part 3 : Clear resets the storage",
      function: async (driver) => {
        try {

        const elements = {}
          for (const elementName in elementMap) {
              elements[elementName] = await driver.findElement(By[elementMap[elementName].type](elementMap[elementName].locator));
          }

          const key = elements['key'];
          const encode = elements['encode'];
          const encoded = elements['encoded'];
          const decode = elements['decode'];
          const decoded = elements['decoded'];

          if (await key.getAttribute('value') !== "") {
            return false;
          }
          if (await encode.getAttribute('value') !== "") {
            return false;
          }
          if (await encoded.getAttribute('value') !== "") {
            return false;
          }
          if (await decode.getAttribute('value') !== "") {
            return false;
          }
          if (await decoded.getAttribute('value') !== "") {
            return false;
          }
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      },
      failureMessage: "Clear doesnt reset the local storage correctly",
      critical: false,
      reset : false,
    },
]

export {testCases};
