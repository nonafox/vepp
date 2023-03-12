# Vepp

A light TypeScript framework for ZeppOS, be maked to solve the rubbish widget system in native ZeppOS.

# Languagues

- English (current)
- [Chinese](https://github.com/jwhgzs/vepp/blob/master/README.chinese.md)

# Before start

You have to know, in ZeppOS, there are so many hard-to-solve limits:

- `eval()` and `new Function()` are disabled
- Rubbish widget system
- Rubbish running efficiency (may be caused by hardware)
- Deceptive APIs

But maybe you don't believe, Vepp solves all of them:

- Skip `new Function()`'s limit by a special way
- Build a pefect widget system in your favourite way
- Make core codes short, easy and fast
- Precompile the VML syntax (see below) by CLI, make it faster and faster
- Deal with deceptive APIs for you

Now, start learning and enjoy!

# Quick start

Let's see what ZeppOS apps made by Vepp is like:

```html
<!-- this is the special syntax called VML (Vepp Markup Language), you can use it in `.vepp` suffixed files -->

<!-- each common element stands for a widget in ZeppOS -->
<!-- and each common property stands for a parameter or a property of a widget in ZeppOS -->
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
    // don't worry about the reference of `this` in the lambda expression, Vepp solves it for you!
    this.test = (arg) => {
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
    	// use `$vepp.unwatch(func)` to cancel watching
        $vepp.unwatch(watcher)
    }
    // use `$vepp.watch(func)` to watch your reactive variables
    // when the variables which are depended by the `func` are changed, `func` will be triggered
    // WARNING: dependencies' increase of `func` won't be synced so far
    $vepp.watch(watcher)
</script>
```

Are you surprised? Yes, that's the way to work with her: everyone who has experienced front-end development knows how to use it now!

But wait a moment! This syntax which seems like HTML cannot be compiled by ZeppCLI directly. You may use Vepp's CLI and be with its help. Here is how to install Vepp and its CLI:

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
# WARNING: although this mode is cool, it may not work as usual while other file watchers are working (like ZeppCLI)
vepp auto
```

# Advanced Features

### Two-way Bindings

Although Vepp follows the native ZeppOS's APIs overall, for example, you can do anything in Vepp as you are in native ZeppOS, there are many troublesome and trivial things: e.g. forms, lists, etc. But Vepp has already considered!

Let's see an easy example of form:

```html
<!-- you can make two-way bindings on forms by the special property `vepp_value` -->
<!-- NOTICE!! Only the widget `RADIO_GROUP` supports this feature now, wait for a while as I'm hard developing! -->

<radio-group
        :h="64"
        select-src="select.png"
        unselect-src="unselect.png"
        :vepp-value="checked">
    <state-button :x="40" :y="200" :w="64" :h="64" vepp-value="A"></state-button>
    <state-button :x="190" :y="200" :w="64" :h="64" vepp-value="B"></state-button>
    <state-button :x="340" :y="200" :w="64" :h="64" vepp-value="C"></state-button>
</radio-group>
<text :y="100" :h="100" :text="'checked: ' + checked"></text>

<script pre>
    this.checked = 'C';
</script>
```

Is it pretty enough? You needn't do anything but to set the special built-in property named `vepp_value`, and then you achieve the data stream on forms! I think it's no need for me to introduce more in this example :)

# Polyfills

Vepp prepares varied polyfills for you, here we have the list of them:

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