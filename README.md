# Exploration Infinity

An infinite scroll implementation with performance and usability as key design goals. Uses
Backbone JS (sans JQuery) for routing and vanilla Javascript (ES5) for everything else.
This is a prototype and not a library or plugin although it could be turned into one.

## Performance

As the user scrolls up or down, pages are added to either the top or the bottom of the container
depending on the direction of scroll.

If number of rendered pages exceeds a certain defined number, pages will be removed and stored
into a cache where they can be retrieved from and restored later.



## Usability
The current page is saved to the URL as the user scrolls. This allows the user to navigate away from and then back to the
page and have their scroll position remembered.

### Todo:
* scroll debouncing using RAF
* support for browsers other than Chrome
* make into a plugin
* version for HTML elements
* support for asynchronous paging
* remove backbone dependency for routing (make this pluggable)