module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("photos");
    return {
        templateFormats: ["html", "md", "mustache",
            "png", "xml", "ico", "json", "css", "txt"],
        markdownTemplateEngine: "mustache",
        htmlTemplateEngine: "mustache",
        passthroughFileCopy: true
    };
};