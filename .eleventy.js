module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("fonts");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("photos");
    eleventyConfig.addPassthroughCopy("*.png");
    return {
        templateFormats: ["html", "md", "ico", "json", "xml", "css", "js"],
        markdownTemplateEngine: "mustache",
        htmlTemplateEngine: "mustache"
    };
};