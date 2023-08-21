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
        type : "xpath",
        locator : "//div"
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
        name: "Body is not Empty",
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
        failureMessage: "Body is inaccessible or possibly empty",
        critical : true
    },
    {
        name : "4 divs in the Grid / wrapped in a div",
        function : async (driver) => {
            try {
                const thegrid = await driver.findElement(By[elementMap['grid'].type](elementMap['grid'].locator));
                const gridChildren = await thegrid.findElements(By.xpath(".//*"));
                return gridChildren.length === 4;
            } catch (e) {
                console.log(e);
                return false;
            }
        },
        failureMessage : "Wrapper div doesnt exist / 4 divs arent in the wrapper",
        critical : true
    },
    {
        name : "Grid has an id and class",
        function : async (driver) => {
            try {
                const grid = await driver.findElement(By[elementMap['grid'].type](elementMap['grid'].locator));
                const id = await grid.getAttribute("id");
                const className = await grid.getAttribute("class");
                return id !== "" && className !== "";
            }
            catch (e) {
                console.log(e);
                return false;
            }
        },
        failureMessage : "Grid has no id/class, or is inaccessible.",
        critical : false
    },
    {
        name : "Grid Items all have classes",
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
                if (await gridChildren[0].getAttribute("class") !== await gridChildren[3].getAttribute("class")) {
                    return false;
                }
                if (await gridChildren[1].getAttribute("class") !== await gridChildren[2].getAttribute("class")) {
                    return false;
                }
                return true;
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
        name : "GridItem Hover produces red bg, with white text saying hello",
        function : async (driver) => {
            const grid = await driver.findElement(By[elementMap['grid'].type](elementMap['grid'].locator));
            const gridChildren = await grid.findElements(By.xpath(".//*"));

            const actions = driver.actions();

            for (let i=0; i<gridChildren.length; i++) {
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
                if (text !== "hello") {
                    return false;
                }
            }
            return true;        
        },
        failureMessage : "Hovering over GridItem does not turn it red and/or doesnt have white text saying 'hello'",
        critical : false
    }
]

export {testCases};
