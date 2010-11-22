/*
    Package: timer

    Reusable timer plugin (jquery ui widget based)
*/
;(function( $ )
{
    /*
        Function: ees.timer

        Used to create an image based checkbox replacement.

        Parameters:
            utc         - Provided dates are UTC (defaults to false)
            startdate   - The starting date for the timer. Either a string
            disabled    - URL to disabled state image

        Returns:
            None
    */
    $.widget( "ees.jCountdown",
    {
        options: 
        { 
        	transitionDelay: 	200
        	
        ,   syncLimit:          600 // 10 minutes till resync        
        ,   syncCount:          0
        
        ,   fragment:           "countdown.html"
        
        ,   enddate:            {}
        ,   startdate:          {}
        ,   remaining:			0
        ,   total:              0
        ,   secondValue:        1000
        ,   minuteValue:        1000 * 60
        ,   hourValue:          1000 * 60 * 60
        ,   dayValue:           1000 * 60 * 60 * 24
        }
            
    ,   _create: function( params )
        {
            var $widget  = this;
            var $item    = $widget.element;
            this.options = $.extend( this.options, params );
            var options  = this.options;
                                    
            // Calculate remaining
            //
            options.startdate.date = new Date(  options.startdate[ "year"    ], 
                                                parseInt( options.startdate[ "month" ] ) - 1, 
                                                options.startdate[ "day"     ], 
                                                options.startdate[ "hours"   ] || 0,
                                                options.startdate[ "minutes" ] || 0,
                                                options.startdate[ "seconds" ] || 0,
                                                options.startdate[ "milliseconds" ] || 0 );
            options.enddate.date   = new Date(  options.enddate[ "year"    ], 
                                                parseInt( options.enddate[ "month" ] ) - 1, 
                                                options.enddate[ "day"     ], 
                                                options.enddate[ "hours"   ] || 0,
                                                options.enddate[ "minutes" ] || 0,
                                                options.enddate[ "seconds" ] || 0,
                                                options.enddate[ "milliseconds" ] || 0 );
                                                
            options.total = options.enddate.date.getTime() - options.startdate.date.getTime();
            $widget._sync();
            
            // Load the timer HTML fragment and (start) updating it
            //
            $item.load( options.fragment, function()
            {
                // Set the startdate and enddate
                //
                $item.find( ".startdate .value" ).text( options.startdate.date.toLocaleString() );
                $item.find( ".enddate   .value" ).text( options.enddate.date.toLocaleString()   );
            
                $widget._update();	
            } );
        }

    ,   _sync: function()
        {
            var $widget = this;
            var $item   = $widget.element;
            var options = $widget.options;            
            var now     = new Date();            
            
            options.remaining = options.enddate.date.getTime() - now.getTime();
        }

    ,   _update: function()
        {
            var $widget = this;
            var $item   = $widget.element;
            var options = $widget.options;
            
            // Set day, hour, minutes and seconds value
            //
            var value   = options.remaining;
            var days    = Math.floor( value / options.dayValue );
            
            if ( days > 0 )
            {
                value      -= days * options.dayValue;
                var hours   = Math.floor( value  / options.hourValue );
                value      -= hours * options.hourValue;
                var minutes = Math.floor( value  / options.minuteValue );
                value      -= minutes * options.minuteValue;
                var seconds = Math.floor( value  / options.secondValue );
            }
            else
            {
                days = 0;
                var hours   = 0
                var minutes = 0;
                var seconds = 0;
            }
            
            $widget._transition( $item.find( ".days    .value" ), days    );
            $widget._transition( $item.find( ".hours   .value" ), hours   );
            $widget._transition( $item.find( ".minutes .value" ), minutes );
            $widget._transition( $item.find( ".seconds .value" ), seconds );
                        
            var percentage = 100 - Math.floor( ( options.remaining * 100 ) / options.total );
            percentage < 0 ? percentage = 0 : percentage = Math.min( 100, percentage );
            
            $widget._transition( $item.find( ".progress .text" ), percentage + "%" );
            $item.find( ".progress .value" ).animate( { width: percentage + "%" }, 10 * percentage )
            
            // (Re)start timer
            //
            if ( options.remaining > 0 )
            {
                window.setTimeout( function()
                {
                    options.syncCount++;
                    
                    if ( options.syncCount > options.syncLimit )
                    {
                        $widget._sync();
                        $widget._update();
                        options.syncCount = 0;
                    }
                    else
                    {
                        options.remaining -= 1000;
                        $widget._update();
                    }                    
                }, 1000 );
            }
        }
        
    ,   _transition: function( $element, newValue )
    	{
            var $widget = this;
            var options = $widget.options;    	
            
    		if ( $element.text() != newValue )
    		{
    			$element.fadeOut( options.transitionDelay, function()
    			{
    				$element.text( newValue );
    				$element.fadeIn( options.transitionDelay );
    			} );
    		}
    	}	
    } );    
} )( jQuery );