module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("photos");
    eleventyConfig.addPassthroughCopy("manifest.json");
    return {
        templateFormats: ["html", "md"],
        markdownTemplateEngine: "mustache",
        htmlTemplateEngine: "mustache",
        passthroughFileCopy: true
    };
};