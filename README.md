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

But maybe you don't believe, Vepp solves all of them:

- Skip `new Function()`'s limit by a special way
- Build a pefect widget system in your favourite way
- Make core codes short, easy and fast
- Precompile the VML syntax (see below) by CLI, make it faster and faster

Now, start learning and enjoy!

# Quick start
Let's see what ZeppOS apps made by Vepp is like:

```html
<!-- this is the special syntax called VML (Vepp Markup Language), you can use it in `.vepp` suffixed files -->

<!-- each common element stands for a widget in ZeppOS -->
<text
    :h="
        // there are two built-in variables: `$w` and `$h`, they reference to device's width and height
        $h * 0.5
    "
    :text="
        /* use `:name='expression'` to set a reactive property */
        txt + '~'
    "
    @click_up="
        /* use `@name='statements'` to set an event */
        // get event argument by built-in variable `$arg`
        test($arg);
        // get the current widget object in native by `$widget`
        console.log('ID of the widget: ' + $widget.getId());
    "
    @@init="
        // this is our built-in event named `@init`
        // the codes here will be executed after the widget is first rendered
        console.log('first rendered!!!')
    ">
</text>
<!-- what's more, you can also use the form of `name="text"` to set a static and stringify property easily -->

<!-- we have special elements `script` which allow you to write your own JS -->
<!-- the following one has a `pre` attribute, the codes in it will be executed BEFORE Vepp's instance is initialized -->
<script pre>
    /* you MUST declare your reactive variables here, otherwise they may cause crash when they are not declared or initialized but are used before the first render */
    // `this`              :    references to all your reactive variables
    this.txt = 'hello, world'
    // WARNING! you must not declare your reactive function in the form of lambda, or you won't get the `this` correctly
    this.test = function (arg) {
        console.log('event argument: ' + JSON.stringify(arg))
        this.txt += '!'
    }
</script>
<!-- this one does not has a `pre` attribute, the codes in it will be executed AFTER Vepp's instance is initialized i.e. AFTER the first render -->
<script>
    // `$vepp`             :    references to your Vepp instance
    // `this`              :    the short form of $vepp.data, i.e. your reactive variables
    let watcher = () => {
        console.log(`variable 'txt' was first changed as: ` + this.txt)
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
# WARNING: it is invalid to import global packages in ZeppOS's project, so you MUST do like this:
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
# WARNING: although this mode is cool, it can not work as usual while other file watchers are working (like ZeppCLI)
vepp auto
```

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