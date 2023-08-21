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
        name: "Only interactive.js is loaded and is a module",
        function: async (driver) => {
            const scriptElements = await driver.findElements(By.css("script"));
            if (scriptElements.length === 1) {
                const src = await scriptElements[0].getAttribute("src");
                if (src === "interactive.js") {
                    return true;
                }
                const type = await scriptElements[0].getAttribute("type");
                if (type === "module") {
                    return true;
                }
            }
            return false;
        },
        failureMessage: "Browser scripts should only import interactive.js as a module. This is the first TODO",
        critical : true
    },
    {
        name: "Buttons are removed",
        function: async (driver) => {
            const buttonElements = await driver.findElements(By.css("button, input[type='button']"));
            return buttonElements.length === 0;
        },
        failureMessage: "All the buttons should be removed from the screen. This is the first TODO",
        critical : true
    },
    {
        name: "Box colors should be default",
        function: async (driver) => {
            const elementsColorsMap = [
                {element:"key",color:"rgba(255, 255, 0, 1)"},
                {element:"encode",color:"rgba(255, 255, 255, 1)"},
                {element:"decode",color:"rgba(255, 255, 255, 1)"},
                {element:"encoded",color:"rgba(255, 255, 255, 1)"},
                {element:"decoded",color:"rgba(255, 255, 255, 1)"}
            ]
            for (const elemColor of elementsColorsMap) {
                const element = await driver.findElement(By[elementMap[elemColor.element].type](elementMap[elemColor.element].locator));
                const color = await element.getCssValue("background-color");
                if (color !== elemColor.color) {
                    return false;
                }
            }
            return true;
        },
        failureMessage: "The default box colors should follow the documentation",
        critical : false
    },
    {
        name: "Key box color change interactions work as intended with only 26 unique alphabet characters",
        function: async (driver) => {
            const keyBox = await driver.findElement(By[elementMap.key.type](elementMap.key.locator));
            let keyBoxColor = await keyBox.getCssValue("background-color");
            if (keyBoxColor !== "rgba(255, 255, 0, 1)") {
                return false;
            }

            const testScenarios = [
                {key:"",color:"rgba(255, 255, 0, 1)"},
                {key:"abcdefghijklmnopqrstuvwxyz",color:"rgba(255, 255, 255, 1)"},
                {key:"abcdefghijklmnopqrstuvwxya",color:"rgba(255, 255, 0, 1)"},
                {key:"qwertyuiopasdfghjklzxcvbnm",color:"rgba(255, 255, 255, 1)"},
                {key:"qwertyuiopasdfghjklzxcvbnma",color:"rgba(255, 255, 0, 1)"},
                {key:"mnbvcxzasdfghjklpoiuytrewq",color:"rgba(255, 255, 255, 1)"},
                {key:"mnbvcxzasdfghjklpoiuytrewq1",color:"rgba(255, 255, 0, 1)"},
            ]

            for (const testScenario of testScenarios) {
                // Ctrl A + Backspace to clear the key box
                await keyBox.sendKeys(Key.chord(Key.CONTROL, "a"));
                await keyBox.sendKeys(Key.BACK_SPACE);
                await keyBox.sendKeys(testScenario.key);
                keyBoxColor = await keyBox.getCssValue("background-color");
                if (keyBoxColor !== testScenario.color) {
                    return false;
                }
            }
            return true;
        },
        failureMessage: "The key box should change to white when valid else stay yellow. Valid is if all characters are unique (alphabet) and 26 in length",
        critical : false
    },
    {
        name: "Encode and decode color change interactions work as intended",
        function: async (driver) => {
            const keyBox = await driver.findElement(By[elementMap.key.type](elementMap.key.locator));
            const encodeBox = await driver.findElement(By[elementMap.encode.type](elementMap.encode.locator));
            const encodedBox = await driver.findElement(By[elementMap.encoded.type](elementMap.encoded.locator));
            const decodeBox = await driver.findElement(By[elementMap.decode.type](elementMap.decode.locator));
            const decodedBox = await driver.findElement(By[elementMap.decoded.type](elementMap.decoded.locator));

            // Enter a valid key:
            await keyBox.sendKeys("bcdefghijklmnopqrstuvwxyza");

            // Enter a valid encode string:
            await encodeBox.sendKeys("xyz");
            let encodedBoxColor = await encodedBox.getCssValue("background-color");
            if (encodedBoxColor !== "rgba(255, 0, 0, 1)") {
                return false;
            }

            await decodeBox.sendKeys("yza");
            let decodedBoxColor = await decodedBox.getCssValue("background-color");
            if (decodedBoxColor !== "rgba(0, 128, 0, 1)") {
                return false;
            }

            return true;
        },
        failureMessage: "Encoded should be red, and decoded should be green",
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

                let encodedText = ''
                let decodedText = ''

                // ROUND 1
                await key.sendKeys("zyxwvutsrqponmlkjihgfedcba");

                // Encode
                await encode.sendKeys("abcdefghijklmnopqrstuvwxyz");
                encodedText = await encoded.getAttribute("value");
                if (encodedText !== "zyxwvutsrqponmlkjihgfedcba") {
                    return false;
                }

                // Decode
                await decode.sendKeys("zyxwvutsrqponmlkjihgfedcba");
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
                encodedText = await encoded.getAttribute("value");
                if (encodedText !== "zyxwvutsrqponmlkjihgfedcba") {
                    return false;
                }

                // Decode
                await decode.sendKeys("abcdefghijklmnopqrstuvwxyz");
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
                encodedText = await encoded.getAttribute("value");
                if (encodedText !== "qwertyuiopasdfghjklzxcvbnm") {
                    return false;
                }

                // Decode
                await decode.sendKeys("qwertyuiopasdfghjklzxcvbnm");
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
