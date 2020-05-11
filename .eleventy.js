module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("fonts");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("photos");
    return {
        templateFormats: ["html", "md", "png", "ico", "json", "xml", "css"],
        markdownTemplateEngine: "mustache",
        htmlTemplateEngine: "mustache",
        passthroughFileCopy: true
    };
};