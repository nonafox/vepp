# Vepp
A light JavaScript framework for ZeppOS, be maked to solve the rubbish widget system in native ZeppOS.

# Languagues
- English (current)
- [Chinese](https://github.com/jwhgzs/vepp/blob/master/README.chinese.md)

# Before start
You have to know, in ZeppOS, there are so many hard-to-solve limits:

- `eval()` and `new Function()`'s limits
- Rubbish widget system
- Rubbish running efficiency

But maybe you don't believe, Vepp solves them:

- Skip `new Function()`'s limit by a special way
- Build a pefect widget system in your favourite way
- Make core codes short, easy and fast
- Precompile the VML syntax (see below) by CLI, make it faster and faster

Now, start learning and enjoy!

# Quick start
Let's see what ZeppOS apps made by Vepp is like:

```html
<!-- this is the special syntax called VML (Vepp Markup Language), you can use it in `.vepp` suffixed files -->

<!-- each element stands for a widget in ZeppOS -->
<!-- as those in Vue etc., use `:name="expression"` to set a reactive property, `name="text"` to set a static stringify property, and `@name="statements"` to set an event -->
<text :text="txt + '~'" @click_up="test()"></text>

<!-- special element `script` which allows you to write your own JS -->
<script>
    // `$vepp` references to your Vepp instance
    // `$`     the short form of $vepp.data, i.e. your reactive variables
    $.txt = 'hello, world'
    $.test = function () {
        $.txt += '!'
    }
	
    let watcher = () => {
        console.log(`variable 'txt' first changed.`)
    	// use `$vepp.unwatch(key, func)` to cancel watching
        $vepp.unwatch('txt', watcher)
    }
    // use `$vepp.watch(key, func)` to watch your reactive variables
    $vepp.watch('txt', watcher)
</script>
```

Are you surprised? Yes, that's the way to use it: everyone who has experienced front-end development knows how to use it now!

But wait a moment! This syntax which seems like HTML can not be compiled by ZeppCLI directly. You may use Vepp's CLI and be with its help. Here is how to install Vepp and its CLI:

```bash
# Vepp merges its core part and its CLI in a package.
# WARNNING: it is invalid to import global packages in ZeppOS's project, so you MUST do like this:
npm install vepp
npm install vepp -g
```

And then initialize and compile your `.vepp` files in the project:

```bash
vepp init test-project
cd ./test-project
vepp compile
```

It's done! What's more, you can do this and use the watcher mode to compile automatically when changing:

```bash
# WARNNING: this mode can not work as usual while other file watchers are working (like ZeppCLI)
vepp auto
```

For advanced, you can install Vepp's VSCode extension from extension store to enjoy more!

# Polyfills

Vepp prepares varied polyfills for you, includes:

- class `Buffer`
- class `Function`
- class `Logger`
- function `setTimeout`
- function `clearTimeout`
- function `setInterval`
- function `clearInterval`
- function `setImmediate`
- function `clearImmediate`
- function `console.time`
- function `console.timeEnd`