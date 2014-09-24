// Derivado do post de  Kevin Deldycke's post on 7/12/12
// http://kevin.deldycke.com/2012/07/displaying-upcoming-events-google-calendar-javascript
function GCalEvents(gcal_json_url) {

        // Get list of upcoming iCal events formatted in JSON
        jQuery.getJSON(gcal_json_url, function(data){

            // Parse and render each event
            if(data.feed.openSearch$totalResults.$t > 0) {
                jQuery.each(data.feed.entry, function(i, item){
                    if(i === 0) {
                        jQuery("#JS-gcal-events li").first().hide();
                    }
                    
                    // event title
                    var event_title = item.title.$t;
                    

                    var event_link = item.content.$t;

                    // event start date/time
                    var event_start_date = new Date(item.gd$when[0].startTime);
                    var event_end_date = new Date(item.gd$when[0].endTime);
                    var event_date;
                    
                    if(event_start_date.getDate() === event_end_date.getDate() && event_start_date.getMonth() === event_end_date.getMonth() && event_start_date.getFullYear() === event_end_date.getFullYear()) {
                        // XX/XX/XXXX
                        event_date = event_start_date.getDate()+"-"+(event_start_date.getMonth()+1)+"-"+event_start_date.getFullYear();
                    } else if (event_start_date.getDate() != event_end_date.getDate() && event_start_date.getMonth() === event_end_date.getMonth() && event_start_date.getFullYear() === event_end_date.getFullYear()) {
                        // xx à XX/XX/XXXX
                        event_date =  event_start_date.getDate()+ " a " + event_end_date.getDate()+"-"+(event_end_date.getMonth()+1)+"-"+event_end_date.getFullYear();
                    } else if (event_start_date.getMonth() != event_end_date.getMonth() && event_start_date.getFullYear() === event_end_date.getFullYear()) {
                        // xx/XX à XX/XX/XXXX
                        event_date = event_start_date.getDate()+"-"+event_start_date.getMonth()+ " a " + event_end_date.getDate()+"-"+(event_end_date.getMonth()+1)+"-"+event_end_date.getFullYear();
                    }else if (event_start_date.getFullYear() != event_end_date.getFullYear()) {
                        // XX/xx/XX à XX/XX/XXXX
                        event_date = event_start_date.getDate()+"-"+(event_start_date.getMonth()+1)+"-"+event_start_date.getFullYear()+ " à " + event_end_date.getDate()+"-"+(event_end_date.getMonth()+1)+"-"+event_end_date.getFullYear();
                    }
                    
                    // Render the event
                    jQuery("#JS-gcal-events li").last().before(
                        "<li><a href='"+ event_link + "' target='_blank'><span class='bold'>"+ event_date + "</span> //" + event_title + "</a></li>"
                    );
                });
            }
        });
    }