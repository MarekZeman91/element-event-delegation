# Event delegation
Simple JavaScript event delegation :)

## Example
[Live example on CodePen](http://codepen.io/MarekZeman91/details/oxJZmd/)

### Our HTML
```html
<div id="gallery">
    <img src="http://lorempixel.com/400/240/food/1">
 
    <div>
        <a href="http://lorempixel.com/400/240/food/1">
            <img src="http://lorempixel.com/120/80/food/1" alt="">
        </a>
        <a href="http://lorempixel.com/400/240/food/2">
            <img src="http://lorempixel.com/120/80/food/2" alt="">
        </a>
        <a href="http://lorempixel.com/400/240/food/8">
            <img src="http://lorempixel.com/120/80/food/8" alt="">
        </a>
    </div>
</div>
```

### Our JavaScript
```js
function listener(event) {
    // this = #gallery
    // event.currentTarget = <a>
    event.preventDefault();
 
    var img = this.firstElementChild;
    var url = event.currentTarget.href;
    img.src = url;
};
 
var gallery = document.getElementById('gallery');
gallery.delegateEventListener('click', 'a', listener);
```

```js
// to remove delegated event listener
gallery.undelegateEventListener('click', 'a', listener);
```
