const fs = require("fs");
const path = require("path");

function checkComponentStructure(dir) {
  const components = fs.readdirSync(dir);

  components.forEach((component) => {
    const componentPath = path.join(dir, component);
    const stat = fs.statSync(componentPath);

    if (stat.isDirectory()) {
      const files = fs.readdirSync(componentPath);

      // Check for JS and CSS files
      const hasJS = files.some((file) => file.endsWith(".js"));
      const hasCSS = files.some((file) => file.endsWith(".css"));

      if (hasJS && !hasCSS) {
        console.warn(`Warning: ${component} has JS but missing CSS file`);
      }

      // Recursively check subdirectories
      checkComponentStructure(componentPath);
    }
  });
}

// Check the components directory
checkComponentStructure(path.join(__dirname, "../src/components"));
