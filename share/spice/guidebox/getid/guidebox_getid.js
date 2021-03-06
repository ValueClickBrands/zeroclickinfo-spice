function ddg_spice_guidebox_getid (api_result) {
    "use strict";

    if (!api_result.results) return;

    // Prevent jQuery from appending "_={timestamp}" in our url.
    $.ajaxSetup({
        cache: true
    });

    var script = $('[src*="/js/spice/guidebox/getid/"]')[0],
        source = decodeURIComponent($(script).attr("src")),
        matched = source.match(/\/js\/spice\/guidebox\/getid\/([a-zA-Z0-9\s]+)/),
        query  = matched[1];

    var metadata = {
        res_title :  api_result.results.result[0].title,
        network   :  api_result.results.result[0].network,
        more      :  api_result.results.result[0].url,
        query     :  query
    };
    
    ddg_spice_guidebox_getid.metadata = metadata;
    ddg_spice_guidebox_getid.metadata.searched = api_result.results.result;
    $.getScript("/js/spice/guidebox/lastshows/series/" + api_result.results.result[0].id);
}

function ddg_spice_guidebox_lastshows (api_result) {

    var metadata = ddg_spice_guidebox_getid.metadata;

    Spice.render({
        data                     : api_result,
        header1                  : metadata.res_title + " (TV  - " + metadata.network + ")",
        source_name              : "Guidebox",
        source_url               : metadata.more,
        template_frame           : "carousel",
        template_normal          : "guidebox_getid",
        carousel_css_id          : "guidebox",
        carousel_items           : api_result.results.result,
        carousel_template_detail : "guidebox_getid_details",
        template_options         : { 
            li_width : 120,
            li_height : 105
        }
    });
};

Handlebars.registerHelper("getQuery", function() {
    return ddg_spice_guidebox_getid.metadata.query;
});

Handlebars.registerHelper("getTitle", function() {
    return ddg_spice_guidebox_getid.metadata.res_title;
});

Handlebars.registerHelper("getDate", function(first_aired) {
    "use strict";

    var aired = DDG.getDateFromString(first_aired),
        days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        months = [ 'January','February','March','April','May','June','July','August','September','October','November','December'];

    return days[aired.getDay()] + ", " + months[aired.getMonth()] + " " + aired.getDate() + ", " + aired.getFullYear()
});

Handlebars.registerHelper("pluralize", function(string, options) { 
    
    if (options.hash && options.hash.singular && options.hash.plural){
        var arr = string.split("|");
        return arr.length > 1 ? options.hash.plural : options.hash.singular
    }
    return "";
});

Handlebars.registerHelper("split", function(string) { 
    return string.replace(/^\||\|$/g, "").replace(/\|/g, ", ");
});

Handlebars.registerHelper("creators", function(options) {
    
    if (this.writers.length || this.directors.length){
        return options.fn(this)
    }
    return "";
});