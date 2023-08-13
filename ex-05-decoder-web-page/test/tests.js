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
    go : { 
        // Assuming that this is the only button. Else add an ID to the button and change below
        type: "css", 
        locator: "input[type='button']" 
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
      critical : false
    },
    {
        name: "Basic Elements have ids",
        function: async (driver) => {
            try {
                const elements = {}
                for (const elementName in elementMap) {
                    elements[elementName] = await driver.findElement(By[elementMap[elementName].type](elementMap[elementName].locator));
                }
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        },
        failureMessage: "One or more elements have problems with the id. Check that the ids are all present and correct. Finally check the element map in '/test/tests.js'. Read the documentation for how the testing suite works.",
        critical : true
    },
    {
        name: "Key, Encode and Decode are input fields",
        function: async (driver) => {
            try {
                const elements = {}
                for (const elementName in elementMap) {
                    elements[elementName] = await driver.findElement(By[elementMap[elementName].type](elementMap[elementName].locator));
                }
                const elementNames = ['key', 'encode', 'decode'];
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
        failureMessage: "Key, Encode and/or Decode are not inputs. Check that the ids are all present and correct. Finally check the element map in '/test/tests.js'. Read the documentation for how the testing suite works.",
        critical : true
    },
    {
        name: "Go button is enabled",
        function: async (driver) => {
            try {
                const elements = {}
                for (const elementName in elementMap) {
                    elements[elementName] = await driver.findElement(By[elementMap[elementName].type](elementMap[elementName].locator));
                }

                const goButton = elements['go'];
                return await goButton.isEnabled();
            } catch (e) {
                console.log(e);
                return false;
            }
          },
        failureMessage: "Go button is not enabled. Ensure that the button is created, and not disabled. Alternatively add an id to the HTML, and finally check the element map in '/test/tests.js'. Read the documentation for how the testing suite works.",
        critical : true
    },
    {
        name: "Encode 'abcd' with reverse alphabet key is 'zyxw'",
        function: async (driver) => {
            try {
                const elements = {}
                for (const elementName in elementMap) {
                    elements[elementName] = await driver.findElement(By[elementMap[elementName].type](elementMap[elementName].locator));
                }

                const key = elements['key'];
                const encode = elements['encode'];
                const encoded = elements['encoded'];
                const goBtn = elements['go'];

                await key.sendKeys("zyxwvutsrqponmlkjihgfedcba");
                await encode.sendKeys("abcd");

                await goBtn.click();

                const encodedText = await encoded.getAttribute("value");
                if (encodedText === "zyxw") {
                    return true;
                } 

                console.log(`Encoded text is: ${encodedText}. Should be 'zyxw'`);
                return false;
            } catch (e) {
                console.log(e);
                return false;
            }
        },
        failureMessage: "Encode 'abcd' reversed is not 'zyxw'. Check that the ids are all present and correct. Finally check the element map in '/test/tests.js'. Read the documentation for how the testing suite works.",
        critical : false
    },
    {
        name: "Decode 'zyxw' with reverse alphabet key is 'abcd'",
        function: async (driver) => {
            try {
                const elements = {}
                for (const elementName in elementMap) {
                    elements[elementName] = await driver.findElement(By[elementMap[elementName].type](elementMap[elementName].locator));
                }

                const key = elements['key'];
                const decode = elements['decode'];
                const decoded = elements['decoded'];
                const goBtn = elements['go'];

                await key.sendKeys("zyxwvutsrqponmlkjihgfedcba");
                await decode.sendKeys("zyxw");

                await goBtn.click();

                const decodedText = await decoded.getAttribute("value");
                if (decodedText === "abcd") {
                    return true;
                } 

                console.log(`Decoded text is: ${decodedText}. Should be 'abcd'`);
                return false;
            } catch (e) {
                console.log(e);
                return false;
            }
        },
        failureMessage: "Decode 'zyxw' reversed is not 'abcd'. Check that the ids are all present and correct. Finally check the element map in '/test/tests.js'. Read the documentation for how the testing suite works.",
        critical : false
    },
    {
        name: "Encode 'abcd', then encode 'zyxw",
        function: async (driver) => {
            const elements = {}
            for (const elementName in elementMap) {
                elements[elementName] = await driver.findElement(By[elementMap[elementName].type](elementMap[elementName].locator));
            }

            const key = elements['key'];
            const encode = elements['encode'];
            const encoded = elements['encoded'];
            const goBtn = elements['go'];

            let encodedText = ''

            await key.sendKeys("zyxwvutsrqponmlkjihgfedcba");
            await encode.sendKeys("abcd");

            await goBtn.click();

            encodedText = await encoded.getAttribute("value");
            if (encodedText !== "zyxw") {
                console.log(`Encoded text is: ${encodedText}. Should be 'zyxw'`);
                return false;
            }

            await encode.clear();
            await encode.sendKeys("zyxw");

            await goBtn.click();

            encodedText = await encoded.getAttribute("value");
            if (encodedText !== "abcd") {
                console.log(`Encoded text is: ${encodedText}. Should be 'abcd'`);
                return false;
            }

            return true;
        },
        failureMessage: "Error possibly in clearing encoded on the second submission. Check that the ids are all present and correct. Finally check the element map in '/test/tests.js'. Read the documentation for how the testing suite works.",
        critical : false
    },
    {
        name: "Decode 'abcd', then decode 'zyxw",
        function: async (driver) => {
            const elements = {}
            for (const elementName in elementMap) {
                elements[elementName] = await driver.findElement(By[elementMap[elementName].type](elementMap[elementName].locator));
            }

            const key = elements['key'];
            const decode = elements['decode'];
            const decoded = elements['decoded'];
            const goBtn = elements['go'];

            let decodedText = ''

            await key.sendKeys("zyxwvutsrqponmlkjihgfedcba");
            await decode.sendKeys("abcd");

            await goBtn.click();

            decodedText = await decoded.getAttribute("value");
            if (decodedText !== "zyxw") {
                console.log(`Decoded text is: ${decodedText}. Should be 'zyxw'`);
                return false;
            }

            await decode.clear();
            await decode.sendKeys("zyxw");

            await goBtn.click();

            decodedText = await decoded.getAttribute("value");
            if (decodedText !== "abcd") {
                console.log(`Decoded text is: ${decodedText}. Should be 'abcd'`);
                return false;
            }

            return true;
        },
        failureMessage: "Error possibly in clearing decoded on the second submission. Check that the ids are all present and correct. Finally check the element map in '/test/tests.js'. Read the documentation for how the testing suite works.",
        critical : false
    },
    {
        name: "3 Times Encode and Decode",
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
                const goBtn = elements['go'];

                let encodedText = ''
                let decodedText = ''

                // ROUND 1
                await key.sendKeys("zyxwvutsrqponmlkjihgfedcba");

                // Encode
                await encode.sendKeys("abcdefghijklmnopqrstuvwxyz");
                await goBtn.click();

                encodedText = await encoded.getAttribute("value");
                if (encodedText !== "zyxwvutsrqponmlkjihgfedcba") {
                    return false;
                }

                // Decode
                await decode.sendKeys("zyxwvutsrqponmlkjihgfedcba");
                await goBtn.click();

                decodedText = await decoded.getAttribute("value");
                if (decodedText !== "abcdefghijklmnopqrstuvwxyz") {
                    return false;
                }

                await key.clear();
                await encode.clear();
                await decode.clear();

                // ROUND 2
                await key.sendKeys("abcdefghijklmnopqrstuvwxyz");

                // Encode
                await encode.sendKeys("zyxwvutsrqponmlkjihgfedcba");
                await goBtn.click();

                encodedText = await encoded.getAttribute("value");
                if (encodedText !== "zyxwvutsrqponmlkjihgfedcba") {
                    return false;
                }

                // Decode
                await decode.sendKeys("abcdefghijklmnopqrstuvwxyz");
                await goBtn.click();

                decodedText = await decoded.getAttribute("value");
                if (decodedText !== "abcdefghijklmnopqrstuvwxyz") {
                    return false;
                }

                await key.clear();
                await encode.clear();
                await decode.clear();

                // ROUND 3
                await key.sendKeys("qwertyuiopasdfghjklzxcvbnm");

                // Encode
                await encode.sendKeys("abcdefghijklmnopqrstuvwxyz");
                await goBtn.click();

                encodedText = await encoded.getAttribute("value");
                if (encodedText !== "qwertyuiopasdfghjklzxcvbnm") {
                    return false;
                }

                // Decode
                await decode.sendKeys("qwertyuiopasdfghjklzxcvbnm");
                await goBtn.click();

                decodedText = await decoded.getAttribute("value");
                if (decodedText !== "abcdefghijklmnopqrstuvwxyz") {
                    return false;
                }

                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        },
        failureMessage: "Fails when trying to encode and decode 3 times. Check that the ids are all present and correct. Finally check the element map in '/test/tests.js'. Read the documentation for how the testing suite works.",
        critical : false
    }
]

export {testCases};
