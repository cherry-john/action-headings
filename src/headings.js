const core = require('@actions/core');
const fs = require('fs');
const glob = require('glob');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

/**
     * Returns the next valid heading level, based on the given currentHeading.
     * eg if heading="h3" and currentHeading="h1", this returns "h2", as that has been missed 
     * @param {String} heading tagName to verify
     * @param {String} currentHeading current highest relevant heading tagName
     * @param {String} previousCurrentHeading what was the previous heading before it was changed?
     * @returns {String}
     */
 const getValidHeading = (heading, currentHeading, previousCurrentHeading) => {
    const headingLevel = parseInt(heading.charAt(1));
    const previousLevel = parseInt(previousCurrentHeading.charAt(1));
    const currentHeadingLevel = parseInt(currentHeading.charAt(1));
    if (previousLevel == headingLevel) {
        return currentHeading;
    }
    if ((headingLevel <= currentHeadingLevel || headingLevel == currentHeadingLevel + 1)){
        if (previousLevel != headingLevel) {
            return heading;
        } else {
            return currentHeading;
        }
        
    }
    return "h" + (currentHeadingLevel + 1).toString();
}

/**
 * Correct Headings in filename to follow correct ordering
 * @param {String} filename 
 */
const updateHeadings = (filename) => {
    fs.readFile(filename, 'utf8' , (err, data) => {
        if (err) throw err;
        
        const dom = new JSDOM(data); //create JS DOM element to query
        
        let currentHeading = "h0";
        let previousCurrentHeading = "h0";//store what the previous level was before changing
        let tags = dom.window.document.querySelectorAll("h1, h2, h3, h4, h5, h6")
        for (const tag in tags) {
            if (Object.hasOwnProperty.call(tags, tag)) {
                const element = tags[tag];
                //create replacement element
                var new_element = dom.window.document.createElement(getValidHeading(element.tagName, currentHeading, previousCurrentHeading));
                previousCurrentHeading = elem.tagName;
                //add attributes
                for(var i = 0; i < element.attributes.length; ++i){
                    let attribute = element.attributes.item(i);
                    new_element.setAttribute(attribute.nodeName, attribute.nodeValue);
                }
                //add children
                while (element.firstChild) {
                    new_element.appendChild(element.firstChild);
                }
                //replace element
                element.parentNode.replaceChild(new_element, element);
                currentHeading = new_element.tagName;
            }
        }
        fs.writeFile(filename, dom.window.document.documentElement.outerHTML, (err) => { if (err) throw err; });
    });
}

/**
 * Test all files in current directory
 */
const updateAllHeadings = () => {
    //Iterate over all files in directory
    glob('./**/*.html', (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            core.info("Checking " + file );
            updateHeadings(file);
        });
    });
}

module.exports = { getValidHeading, updateHeadings, updateAllHeadings };