import {By, Key, until} from "selenium-webdriver";

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
    // Grabs the first div element. For ease change this to the id
    grid : {
        type : "id",
        locator : "theGrid"
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
        name: "Body exists",
        function: async (driver) => {
            try {
                const body = await driver.findElement(By.css("body"));
                const bodyChildren = await body.findElements(By.xpath(".//*"));
                return bodyChildren.length > 0;
            } catch (e) {
                console.log(e);
                return false;
            }
        },
        failureMessage: "Body must be present and accessible",
        critical : true
    },
    {
        name : "64 divs in the Grid",
        function : async (driver) => {
            try {
                const thegrid = await driver.findElement(By[elementMap['grid'].type](elementMap['grid'].locator));
                const gridChildren = await thegrid.findElements(By.xpath(".//*"));
                return gridChildren.length === 64;
            } catch (e) {
                console.log(e);
                return false;
            }
        },
        failureMessage : "There aren't 64 divs arent in the wrapper",
        critical : true
    },
    {
        name : "Grid items all have classes",
        function : async (driver) => {
            const grid = await driver.findElement(By[elementMap['grid'].type](elementMap['grid'].locator));
            const gridChildren = await grid.findElements(By.xpath(".//*"));
            for (let i=0; i<gridChildren.length; i++) {
                const className = await gridChildren[i].getAttribute("class");
                if (className === "") {
                    return false;
                }
            }
            return true;
        },
        failureMessage : "Grid Items have no classes, or are inaccessible.",
        critical : false
    },
    {
        name : "Grid Items have alternating classes",
        function : async (driver) => {
            try {
                const grid = await driver.findElement(By[elementMap['grid'].type](elementMap['grid'].locator));
                const gridChildren = await grid.findElements(By.xpath(".//*"));
                const firstClass = await gridChildren[0].getAttribute("class");
                const secondClass = await gridChildren[1].getAttribute("class");
                if (firstClass === "" || secondClass === "") {
                    return false;
                }
                if (firstClass === secondClass) {
                    return false;
                }
                const numRows = gridChildren.length / 8; // Assuming gridChildren contains all elements

                for (let i=0; i<64; i++) {
                    const row = Math.floor(i / 8);
                    const col = i % 8;

                    const className = await gridChildren[i].getAttribute("class");
                    const correctClass = (row + col) % 2 === 0 ? firstClass : secondClass;
                    if (className !== correctClass) {
                        return false;
                    }
                    return true
                }
            }
            catch (e) {
                console.log(e);
                return false;
            }
        },
        failureMessage : "Grid items don't have alternating classes. Note the difference when elements line up in a new row",
        critical : false
    },
    {
        name : "Grid Items are squares",
        function : async (driver) => {
            try {
                const grid = await driver.findElement(By[elementMap['grid'].type](elementMap['grid'].locator));
                const gridChildren = await grid.findElements(By.xpath(".//*"));
                for (let i=0; i<gridChildren.length; i++) {
                    const width = await gridChildren[i].getCssValue("width");
                    const height = await gridChildren[i].getCssValue("height");
                    if (width !== height) {
                        return false;
                    }
                    if (width <= 0 || width === "") {
                        return false;
                    }
                }
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        },
        failureMessage : "Grid items are not squares, or are inaccessible.",
        critical : false
    },
    {
        name : "Grid is a square",
        function : async (driver) => {
            try {
                const grid = await driver.findElement(By[elementMap['grid'].type](elementMap['grid'].locator));
                const width = await grid.getCssValue("width");
                const height = await grid.getCssValue("height");
                if (width !== height) {
                    return false;
                }
                if (width <= 0 || width === "") {
                    return false;
                }
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        },
        failureMessage : "Grid items are not squares, or are inaccessible.",
        critical : false
    },
    {
        name : "GridItem Hover produces red bg, and correct text",
        function : async (driver) => {
            const grid = await driver.findElement(By[elementMap['grid'].type](elementMap['grid'].locator));
            const gridChildren = await grid.findElements(By.xpath(".//*"));

            const actions = driver.actions();

            for (let j=0; j<12; j++) {
                const i = Math.floor(Math.random() * gridChildren.length);
                await actions.move({origin: gridChildren[i]}).perform();

                const bg = await gridChildren[i].getCssValue("background-color");
                const color = await gridChildren[i].getCssValue("color");

                if (bg !== "rgba(255, 0, 0, 1)") {
                    return false;
                }
                if (color !== "rgba(255, 255, 255, 1)") {
                    return false;
                }

                const text = await gridChildren[i].getText();
                if (i > 15 && i < 48) {
                    if (text !== "") {
                        console.log(i+ ":" + text)
                        return false;
                    }
                }
                else if (i === 0 || i === 63 || i === 7 || i === 56) {
                    if (text !== "rook") {
                        console.log(i+ ":" + text)
                        return false;
                    }
                }
                else if (i === 1 || i === 62 || i === 6 || i === 57) {
                    if (text !== "knight") {
                        console.log(i+ ":" + text)
                        return false;
                    }
                }
                else if (i === 2 || i === 61 || i === 5 || i === 58) {
                    if (text !== "bishop") {
                        console.log(i+ ":" + text)
                        return false;
                    }
                }
                else if (i === 3 || i === 59 || i === 3 || i === 60) {
                    if (text !== "king" && text !== "queen") {
                        console.log(i+ ":" + text)
                        return false;
                    }
                }
                else if ((i > 7 && i < 16) || (i > 47 && i < 56)) {
                    if (text !== "pawn") {
                        console.log(i+ ":" + text)
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
            return true;        
        },
        failureMessage : "Hovering over GridItem does not output the text of pieces correctly. If using an alternative text, ignore if handled successfully",
        critical : false
    },
]

export {testCases};
