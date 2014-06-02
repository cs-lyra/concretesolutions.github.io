// Derivado do post de  Kevin Deldycke's post on 7/12/12
// http://kevin.deldycke.com/2012/07/displaying-upcoming-events-google-calendar-javascript
function GCalEvents(gcal_json_url) {

        // Get list of upcoming iCal events formatted in JSON
        jQuery.getJSON(gcal_json_url, function(data){

            // Parse and render each event
            jQuery.each(data.feed.entry, function(i, item){
                if(i == 0) {
                    jQuery("#JS-gcal-events li").first().hide();
                };
                
                // event title
                var event_title = item.title.$t;
                

                var event_link = item.link[0].href;

                // event start date/time
                var event_start_date = new Date(item.gd$when[0].startTime);
                var event_end_date = new Date(item.gd$when[0].endTime);
                var event_date;
                
                if(event_start_date.getDay() === event_end_date.getDay() && event_start_date.getMonth() === event_end_date.getMonth() && event_start_date.getFullYear() === event_end_date.getFullYear()) {
                    // XX/XX/XXXX
                    event_date = event_start_date.getDay()+"/"+event_start_date.getMonth()+"/"+event_start_date.getFullYear();  
                } else if (event_start_date.getDay() != event_end_date.getDay() && event_start_date.getMonth() === event_end_date.getMonth() && event_start_date.getFullYear() === event_end_date.getFullYear()) {
                    // xx à XX/XX/XXXX
                    event_date =  event_start_date.getDay()+ " à " + event_end_date.getDay()+"/"+event_end_date.getMonth()+"/"+event_end_date.getFullYear();
                } else if (event_start_date.getMonth() != event_end_date.getMonth() && event_start_date.getFullYear() === event_end_date.getFullYear()) {
                    // xx/XX à XX/XX/XXXX
                    event_date = event_start_date.getDay()+"/"+event_start_date.getMonth()+ " à " + event_end_date.getDay()+"/"+event_end_date.getMonth()+"/"+event_end_date.getFullYear();
                }else if (event_start_date.getFullYear() != event_end_date.getFullYear()) {
                    // XX/xx/XX à XX/XX/XXXX
                    event_date = event_start_date.getDay()+"/"+event_start_date.getMonth()+"/"+event_start_date.getFullYear()+ " à " + event_end_date.getDay()+"/"+event_end_date.getMonth()+"/"+event_end_date.getFullYear();
                }
                
                // Render the event
                jQuery("#JS-gcal-events li").last().before(
                    "<li> "+ event_date + " // <a href='"+ event_link + "'>" + event_title + "</a></li>"
                );
            });
        });
    }
