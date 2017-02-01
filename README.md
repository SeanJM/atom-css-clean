# css-clean package

We all write code a little quickly sometimes. This is a package which offers a helping hand to sort, align and clean your CSS and SASS.

## Configuration

If you want 4 spaces and tabs, create a `.csscleanrc` file in the project root directory.

example settings
```
{
  "tab_space": 2,
  "tab_char": "space"
}
```

- `tab_space` -> Any number
- `tab_char` -> "space" or "tab"

## Sorting properties

##### Before

```css
.comment-module {
  font-size: 16px;
  color: red;
  position: 'relative';
  z-index: 0;
  font-family: 'sans-serif';
}
```

##### After

```css
.comment-module {
  z-index     : 0;
  position    : 'relative';
  color       : red;
  font-family : 'sans-serif';
  font-size   : 16px;
}
```

## Clearly format your `@media` queries

##### Before

```css
@media only screen and (min-device-width: 320px) and (device-width: 320px) and (max-device-width: 736px),
       tv and (min-width: 320px) and (device-width: 320px) and (width: 736px) {
  .comment-module {
   font-size: 18px;
  }
}
```

##### After
```css
@media only screen
       and (min-device-width : 320px)
       and (device-width     : 320px)
       and (max-device-width : 736px),
       tv
       and (min-width        : 320px)
       and (device-width     : 320px)
       and (width            : 736px) {
  .comment-module {
    font-size : 18px;
  }
}
```

## Sort multiple selector names and automatic placement to one line per selector

##### Before

```css
input[type="text"], [class*="btn-grey"], input[type="date"], input[type="number"], textarea {
  color : $grey6;
}
```

##### After
```css
[class*="btn-grey"],
input[type="date"],
input[type="number"],
input[type="text"],
textarea {
  color : $grey6;
}
```

# SASS

## Grouping of variables which are pushed to the top of the file

##### Before

```css
$box-style2 : (bStyle: dotted, bColor: blue, bWidth: medium);
$i : 6;

@mixin does-parent-exist { @if & { &:hover { color : red; } } @else { a { color : red; } } }

$gutter-width : 10px;
```

##### After

```css
$box-style2   : (bStyle: dotted, bColor: blue, bWidth: medium);
$i            : 6;
$gutter-width : 10px;

@mixin does-parent-exist {
  @if & {
    &:hover {
      color : red;
    }
  } @else {
    a {
      color : red;
    }
  }
}
```

## Merging of multiple imports

##### Before

```css
@import "buttons.scss";
@import "forms.scss";
@import "variables.scss";
```

##### After

```css
@import "variables.scss",
        "buttons.scss",
        "forms.scss";
```

## Make your `@each` statements easier to read

##### Before

```css
@each $animal, $color, $cursor in (puma, black, default), (sea-slug, blue, pointer), (egret, white, move) {
  .#{$animal}-icon {
    background-image : url('/images/#{$animal}.png');
    border : 2px solid $color;
    cursor : $cursor;
  }
}
```

##### After

```css
@each $animal,
      $color,
      $cursor in (puma, black, default),
      (sea-slug, blue, pointer),
      (egret, white, move) {
  .#{$animal}-icon {
    border           : 2px solid $color;
    background-image : url('/images/#{$animal}.png');
    cursor           : $cursor;
  }
}
```

## Gradients

##### Before

```css
  .class {
    background : linear-gradient(rgba(33, 34, 30, 0.1), rgba(33, 34, 30, 0.1));
  }
```

##### After

```css
  .class {
    background : linear-gradient(
                   rgba(33, 34, 30, 0.1),
                   rgba(33, 34, 30, 0.1)
                 );
  }
```

- Shortcut is **CMD/CTRL+ALT+C**

Feel free to contribute.
